
**Gateway 自带限流的优势：**

- 官方支持、稳定、轻量
- 与 WebFlux 原生兼容
- 不需要引入 Sentinel
- 配置简单
- 可按 IP / userId / 路径灵活限流

需要 Reactive Redis（因为 Gateway 是 WebFlux 技术栈）：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
</dependency>
```


## 创建 IP KeyResolver

```java
@Bean
public KeyResolver ipKeyResolver() {
    return exchange -> {
        // 1. 优先从 X-Forwarded-For 获取真实 IP
        String ip = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");

        if (ip != null && !ip.isEmpty()) {
            return Mono.just(ip.split(",")[0].trim());
        }

        // 2. 再尝试 RemoteAddress
        InetSocketAddress remoteAddress = exchange.getRequest().getRemoteAddress();
        if (remoteAddress != null && remoteAddress.getAddress() != null) {
            return Mono.just(remoteAddress.getAddress().getHostAddress());
        }

        // 3. 兜底值（避免 NPE）
        return Mono.just("unknown");
    };
}
```


## 配置限流过滤器（RequestRateLimiter）

在 `application.yml` 中加入：

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: healtrack-main
          uri: lb://healtrack-main
          predicates:
            - Path=/**
          filters:
            - name: RequestRateLimiter
              args:
                key-resolver: "#{@ipKeyResolver}"
                redis-rate-limiter.replenishRate: 10       # 每秒令牌数
                redis-rate-limiter.burstCapacity: 20       # 突发容量
```

说明：

- `replenishRate`: 每秒恢复多少令牌  
- `burstCapacity`: 最大桶容量（允许瞬时流量）

> 示例含义：**允许每个 IP 每秒 10 次请求，最多在短时间内放行 20 次。**


## 用户级限流

可以根据网关 Token Filter 注入的 `X-User-Id`：

```java
@Bean
public KeyResolver userKeyResolver() {
    return exchange -> Mono.just(
        exchange.getRequest().getHeaders().getFirst("X-User-Id")
    );
}
```

YAML 配置：

```yaml
- id: ocr
  uri: lb://healtrack-main
  predicates:
    - Path=/report/ocr
  filters:
    - name: RequestRateLimiter
      args:
        key-resolver: "#{@userKeyResolver}"
        redis-rate-limiter.replenishRate: 3
        redis-rate-limiter.burstCapacity: 3
```

含义：

> 每个用户每分钟只能调用 3 次 OCR。

## 登录接口单独限流（防爆破）

```yaml
- id: login
  uri: lb://healtrack-main
  predicates:
    - Path=/auth/login
  filters:
    - name: RequestRateLimiter
      args:
        key-resolver: "#{@ipKeyResolver}"
        redis-rate-limiter.replenishRate: 5
        redis-rate-limiter.burstCapacity: 5
```

含义：

> 每个 IP 每分钟最多 5 次登录尝试。

## 全局限流

可以对所有请求设置默认限流：

```yaml
spring:
  cloud:
    gateway:
      default-filters:
        - name: RequestRateLimiter
          args:
            key-resolver: "#{@ipKeyResolver}"
            redis-rate-limiter.replenishRate: 20
            redis-rate-limiter.burstCapacity: 40
```

作为防护墙使用。


## 限流失败返回 429（可定制 JSON）

默认返回：

```
HTTP 429 Too Many Requests
```

参考：[Gateway统一错误响应](./Gateway统一错误响应.md)

## 验证限流是否生效

1. 查看 Redis 是否出现 key：

```
request_rate_limiter.{key}
```

2. 连续请求同一个接口：

```
curl http://gateway-ip/auth/login
```

超过速率时会返回：

```
HTTP/1.1 429 Too Many Requests
```

说明已成功。