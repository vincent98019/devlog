
Spring Cloud LoadBalancer 加上后必然出现的提示：

```log
21:31:24.727 [main] WARN  o.s.c.l.c.LoadBalancerCacheAutoConfiguration$LoadBalancerCaffeineWarnLogger:94 Spring Cloud LoadBalancer is currently working with the default cache. While this cache implementation is useful for development and tests, it's recommended to use Caffeine cache in production.You can switch to using Caffeine cache, by adding it and org.springframework.cache.caffeine.CaffeineCacheManager to the classpath.
```

大概意思是现在用的是 “默认内存缓存（基于 Map 的简单缓存）”，适用于开发环境。  在生产环境建议改用 Caffeine（高性能缓存库）。


**开启官方推荐的 Caffeine**

```xml
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
    <version>3.1.8</version>
</dependency>
```

Spring Boot 3.x 自带 Caffeine 支持，所以只需引入 caffeine 这个库即可。


在 Gateway 工程中新建类：

```java
@Configuration
public class LoadBalancerCacheConfig {

    @Bean
    public CaffeineCacheManager cacheManager() {
        return new CaffeineCacheManager();
    }
}
```


这样 LoadBalancer 自动使用 CaffeineCacheManager。

更多Caffeine的介绍：[Caffeine简介](../../../Java/Libraries/Caffeine/Caffeine简介.md)

**Caffeine 是目前 JVM 内存缓存的性能天花板，性能 > EhCache > Guava。**