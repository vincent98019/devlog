
网关搭建步骤：

1. 创建项目，引入nacos服务发现和gateway依赖
2. 配置application.yml，包括服务基本信息、nacos地址、路由

路由配置包括：

1. 路由id：路由的唯一标示
2. 路由目标（uri）：路由的目标地址，http代表固定地址，lb代表根据服务名负载均衡
3. 路由断言（predicates）：判断路由的规则，
4. 路由过滤器（filters）：对请求或响应做处理


```xml
<dependencies>
    <!-- Spring Cloud Gateway (webflux) -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <!-- 老版本 -->
        <!-- <artifactId>spring-cloud-starter-gateway</artifactId> -->
        <artifactId>spring-cloud-starter-gateway-server-webflux</artifactId>
    </dependency>

    <!-- Nacos service discovery -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    
    <!-- 负载均衡 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-loadbalancer</artifactId>
    </dependency>

    <!-- Spring Boot Actuator（可选）-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>
```


**bootstrap.yaml**

```yaml
spring:
  application:
    name: gateway

  cloud:
    nacos:
      discovery:
        server-addr: 100.80.0.80:8848  # nacos 地址
    gateway:
      routes:
        - id: bizmain
          uri: lb://bizmain  # lb需要加入负载均衡依赖，http不用
          predicates:
            - Path=/api/**  # 按照路径匹配，只要以/user/开头就符合要求
```


将符合 Path 规则的一切请求，都代理到 uri 参数指定的地址。

本例中，将 `/user/**` 开头的请求，代理到 `lb://userservice` ，lb是负载均衡，根据服务名拉取服务列表，实现负载均衡。

  

网关路由的流程图：

![](./assets/Gateway%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8/acaa8d3a9bb0ea4ed7d65c2752dc2603_MD5.png)



[Gateway更改缓存策略](./Gateway更改缓存策略.md)

[Gateway断言（Predicate）工厂](./Gateway断言（Predicate）工厂.md)

[Gateway过滤器（Filter）工厂](./Gateway过滤器（Filter）工厂.md)

[Gateway跨域配置](./Gateway跨域配置.md)

[Gateway启用Redis限流](./Gateway启用Redis限流.md)

[Gateway统一错误响应](./Gateway统一错误响应.md)

[Gateway统一日志体系](./Gateway统一日志体系.md)



