
在单体项目中，AOP 拦截 Controller 打日志就够用了。但微服务架构下：

- 请求首先经过 **Gateway**
- 再路由到各个服务（main-service、admin-service…）
- 各服务之间还可能进行内部调用

如果没有 **统一 TraceId + 入口日志 + MDC 机制**：

- 无法定位某个请求跨服务链路发生了什么
- 无法知道谁在调用（userId / Token）
- 无法定位具体的调用路径
- 无法知道网关层发生了什么（限流、鉴权、异常）

因此，大厂统一做 **全链路日志体系**，从 Gateway 到业务服务全部打通。


## 整体架构图（从 Gateway → main-service）

```
          ┌────────────────────┐
          │  Client / App / Web │
          └─────────┬──────────┘
                    │  请求进入
                    ▼
        ┌────────────────────────────┐
        │         API Gateway         │
        │  1. TraceIdFilter           │
        │  2. TokenFilter             │
        │  3. AccessLogFilter         │
        └─────────┬──────────────────┘
                  │  携带 TraceId
                  ▼
        ┌────────────────────────────┐
        │        main-service         │
        │  4. TraceIdFilter（Servlet） │
        │  5. AOP 业务日志             │
        │  6. 日志输出（带 traceId）    │
        └────────────────────────────┘
```

所有日志最终被串在一起，形成完整链路。


## TraceIdFilter（生成全局 TraceId）

```java
@Component
public class TraceFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String traceId = UUID.randomUUID().toString().replace("-", "");

        ServerHttpRequest mutatedRequest = exchange.getRequest()
                .mutate()
                .header("X-Trace-Id", traceId)
                .build();

        exchange.getAttributes().put("traceId", traceId);

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    @Override
    public int getOrder() {
        return -200; 
        // 必须比 TokenFilter 更早
    }
}
```


## AccessLogFilter（统一入口日志）

```java
@Component
public class AccessLogFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(AccessLogFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        long start = System.currentTimeMillis();
        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethodValue();

        return chain.filter(exchange)
                .doFinally(signal -> {

                    long cost = System.currentTimeMillis() - start;

                    String traceId = exchange.getAttribute("traceId");
                    String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");

                    String ip = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");
                    if (ip == null && exchange.getRequest().getRemoteAddress() != null) {
                        ip = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
                    }

                    log.info("GW | traceId={} | userId={} | {} {} | ip={} | {}ms",
                            traceId, userId, method, path, ip, cost
                    );
                });
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE; 
        // 最后执行
    }
}
```


## 业务服务（写入 MDC）

```java
@Component
public class TraceIdFilter implements Filter {

    @Override
    public void doFilter(
            ServletRequest request, 
            ServletResponse response, 
            FilterChain chain
    ) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;

        String traceId = req.getHeader("X-Trace-Id");
        if (traceId != null) {
            MDC.put("traceId", traceId);
        }

        try {
            chain.doFilter(request, response);
        } finally {
            MDC.remove("traceId");  // 防止内存泄漏
        }
    }
}
```


## 业务服务日志格式

```xml
<pattern>
    %d{HH:mm:ss.SSS} [%thread] %-5level traceId=%X{traceId} %logger - %msg%n
</pattern>
```

输出效果：

```
12:21:32.120 [http-nio-8080-exec-1] INFO  traceId=8a3b2f9a... 处理请求成功
12:21:32.122 [http-nio-8080-exec-1] INFO  traceId=8a3b2f9a... 查询数据库 5ms
12:21:32.123 [http-nio-8080-exec-1] INFO  traceId=8a3b2f9a... 返回 10 条记录
```

## 业务服务AOP 日志

```java
@Aspect
@Component
public class ApiLogAspect {

    @Around("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
    public Object log(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            return pjp.proceed();
        } finally {
            long cost = System.currentTimeMillis() - start;
            log.info("API | {} | {}ms", pjp.getSignature(), cost);
        }
    }
}
```

业务层日志继续照旧，但不负责 traceId 与 userId。


## 最终效果（链路日志）

### Gateway:

```
GW | traceId=9f31ac... | userId=123 | GET /reports | ip=1.2.3.4 | 44ms
```

### 业务服务:

```
INFO traceId=9f31ac... 接收请求 /reports
INFO traceId=9f31ac... 查询数据库 5ms
INFO traceId=9f31ac... 返回 10 条数据
```

两边通过 traceId 串联成完整链路。
