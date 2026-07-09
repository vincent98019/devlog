
GatewayFilter是网关中提供的一种过滤器，可以对进入网关的请求和微服务返回的响应做处理：

![](./assets/Gateway%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88Filter%EF%BC%89%E5%B7%A5%E5%8E%82/36f0421d84e596c312a900a03dca0297_MD5.png)

过滤器的作用：

1. 对路由的请求或响应做加工处理，比如添加请求头
2. 置在路由下的过滤器只对当前路由的请求生效


Filter 分两类：

| 类型                      | 说明             |
| ----------------------- | -------------- |
| **全局过滤器 GlobalFilter**  | 所有请求都会经过（适合鉴权） |
| **路由过滤器 GatewayFilter** | 仅在某个 Route 上生效 |


## 全局过滤器

全局过滤器的作用也是处理一切进入网关的请求和微服务响应，与GatewayFilter的作用一样。区别在于GatewayFilter通过配置定义，处理逻辑是固定的，而GlobalFilter的逻辑需要自己写代码实现。

定义方式是实现GlobalFilter接口：

```java
public interface GlobalFilter {

   /**
    * 处理当前请求，有必要的话通过{@link GatewayFilterChain}将请求交给下一个过滤器处理
    *
    * @param exchange 请求上下文，里面可以获取Request、Response等信息
    * @param chain    用来把请求委托给下一个过滤器 
    * @return {@code Mono<Void>} 返回标示当前过滤器业务结束
    */
   Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain);
}
```


在filter中编写自定义逻辑，可以实现下列功能：

- 登录状态判断
- 权限校验
- 请求限流等

## 路由过滤器

Spring提供了31种不同的路由过滤器工厂。常用的过滤器：

| 名称                       | 说明             |
| ------------------------ | -------------- |
| **StripPrefix**          | 移除 URL 前缀（最常用） |
| **AddRequestHeader**     | 添加请求头          |
| **AddResponseHeader**    | 添加响应头          |
| **RemoveRequestHeader**  | 删除请求头          |
| **RemoveResponseHeader** | 删除响应头          |
| **RewritePath**          | 正则重写路径         |
| **SetPath**              | 将路径完全替换为新路径    |
| **PrefixPath**           | 添加前缀           |
| **RequestRateLimiter**   | 限流（依赖 Redis）   |
| **Retry**                | 重试机制           |
| **CircuitBreaker**       | 熔断机制           |
| **RequestSize**          | 限制请求体大小        |
| **AddRequestParameter**  | 添加 Query 参数    |
| **DedupeResponseHeader** | 去重响应头          |




### StripPrefix（最常用）
  
删除 URL 前 N 段路径。

```yaml
filters:
  - StripPrefix=2
```

访问：

```
/api/main/user/info
```

下游收到：

```
/user/info
```

### AddRequestHeader（添加请求头）

```yaml
filters:
  - AddRequestHeader=X-Trace-Id, #{T(java.util.UUID).randomUUID().toString()}
```


### RequestRateLimiter（限流）

需要 Redis。[Gateway启用Redis限流](./Gateway启用Redis限流.md)

```yaml
filters:
  - name: RequestRateLimiter
    args:
      keyResolver: "#{@ipKeyResolver}"
      redis-rate-limiter.replenishRate: 5
      redis-rate-limiter.burstCapacity: 10
```


### Retry（重试）

```yaml
filters:
  - name: Retry
    args:
      retries: 3
      statuses: BAD_GATEWAY, SERVICE_UNAVAILABLE
      methods: GET
```

### CircuitBreaker（熔断器）

```yaml
filters:
  - name: CircuitBreaker
    args:
      name: mainBreaker
      fallbackUri: forward:/fallback
```


### RequestSize（请求体大小限制）

```yaml
filters:
  - name: RequestSize
    args:
      maxSize: 5MB
```



## 默认过滤器

如果要对所有的路由都生效，则可以将过滤器工厂写到default下。格式如下：

```yaml
spring:
  cloud:
   gateway:
     routes:
       - id: user-service 
         uri: lb://userservice 
         predicates: 
           - Path=/user/**
     default-filters:     # 默认过滤项
         - AddRequestHeader=token, aaa
```


## 过滤器执行顺序

请求进入网关会碰到三类过滤器：当前路由的过滤器、DefaultFilter、GlobalFilter

请求路由后，会将当前路由过滤器和DefaultFilter、GlobalFilter，合并到一个过滤器链（集合）中，排序后依次执行每个过滤器：

![](./assets/Gateway%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88Filter%EF%BC%89%E5%B7%A5%E5%8E%82/2c2b9eaca1439fb6e6f3829d33159825_MD5.png)

排序规则：

- 每一个过滤器都必须指定一个int类型的order值，order值越小，优先级越高，执行顺序越靠前
- GlobalFilter通过实现Ordered接口，或者添加@Order注解来指定order值，由自己指定
- 路由过滤器和defaultFilter的order由Spring指定，默认是按照声明顺序从1递增
- 当过滤器的order值一样时，会按照 defaultFilter > 路由过滤器 > GlobalFilter的顺序执行

详细内容，可以查看源码：

- `org.springframework.cloud.gateway.route.RouteDefinitionRouteLocator#getFilters()` 方法是先加载defaultFilters，然后再加载某个route的filters，然后合并
- `org.springframework.cloud.gateway.handler.FilteringWebHandler#handle()` 方法会加载全局过滤器，与前面的过滤器合并后根据order排序，组织过滤器链