
在微服务架构中，如果没有统一错误返回：

- Token 校验失败 → 返回 403 / 401 内容不同  
- 限流 → Redis 返回一段不可读的 JSON  
- 路由不存在 → 返回 HTML（Whitelabel Error Page）  
- 下游服务挂掉 → 返回 503 错误页面  
- CORS 错误 → 返回莫名的“预检失败”  

这些都非常不利于前端（APP / Web）处理，也不利于排查问题。

**统一错误 JSON 格式：**

```json
{
  "code": "xxx",
  "msg": "错误信息",
  "traceId": "全链路追踪ID",
  "data": null
}
```

其中：

| 字段      | 含义                                                       |
| ------- | -------------------------------------------------------- |
| code    | 字符串形式的 HTTP 状态码（401/403/429/500/503）                     |
| msg     | 中文错误提示                                                   |
| traceId | Gateway 注入、贯穿全链路，参考[Gateway统一日志体系](./Gateway统一日志体系.md) |
| data    | 保留字段，固定 null                                             |


创建文件：

```java
@Component
@Order(-1) // 优先级高于默认的异常处理器
public class GatewayErrorHandler implements ErrorWebExceptionHandler {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {

        HttpStatus status = resolveStatus(ex);
        String msg = resolveMessage(status);
        String traceId = exchange.getAttribute("traceId");

        Map<String, Object> body = new HashMap<>();
        body.put("code", String.valueOf(status.value()));
        body.put("msg", msg);
        body.put("traceId", traceId);
        body.put("data", null);

        byte[] bytes;
        try {
            bytes = mapper.writeValueAsString(body).getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            bytes = "{\"code\":\"500\",\"msg\":\"系统异常\",\"data\":null}".getBytes(StandardCharsets.UTF_8);
        }

        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        return exchange.getResponse()
                .writeWith(Mono.just(exchange.getResponse()
                        .bufferFactory()
                        .wrap(bytes)));
    }

    private HttpStatus resolveStatus(Throwable ex) {
        if (ex instanceof ResponseStatusException rse) {
            return rse.getStatusCode();
        }

        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private String resolveMessage(HttpStatus status) {
        return switch (status) {
            case UNAUTHORIZED -> "未授权";
            case FORBIDDEN -> "无权限访问";
            case NOT_FOUND -> "资源不存在";
            case TOO_MANY_REQUESTS -> "请求过于频繁，请稍后再试";
            case SERVICE_UNAVAILABLE -> "服务不可用";
            default -> "系统异常，请稍后重试";
        };
    }
}
```



TokenFilter 抛异常 → 由 ErrorHandler 接管

在 TokenFilter 中：

```java
throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token 无效");
```

自动进入全局错误处理器。


**启用该 ErrorHandler：**

在 `application.yml` 中添加：

```yaml
spring:
  main:
    web-application-type: reactive
  codec:
    max-in-memory-size: 10MB
```

（多数项目已经默认 reactive，不需要额外配置）

无需任何额外配置，Spring Boot 会自动加载你定义的 ErrorWebExceptionHandler。
