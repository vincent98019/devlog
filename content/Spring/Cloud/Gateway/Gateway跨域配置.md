

跨域：域名不一致就是跨域，主要包括：

- 域名不同： www.taobao.com 和 www.taobao.org 和 www.jd.com 和 miaosha.jd.com
- 域名相同，端口不同：localhost:8080和localhost:8081

跨域问题：浏览器禁止请求的发起者与服务端发生跨域ajax请求，请求被浏览器拦截的问题

Gateway 是全局入口，**所有跨域必须在 Gateway 做**，后端服务不需要再做任何 CORS 配置。


Spring Cloud Gateway 是 WebFlux，不支持 MVC 的 CORS 方式，以下写法在 Gateway 无效：

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {}

// 或者
@CrossOrigin
```


在Gateway服务的application.yml文件中，添加下面的配置：

```yaml
spring:
  cloud:
    gateway:
      # 其他配置....
      globalcors:                                   # 全局的跨域处理
        add-to-simple-url-handler-mapping: true     # 解决options请求被拦截问题
        corsConfigurations:
          '[/**]':
            allowedOrigins:                         # 允许哪些网站的跨域请求 
              - "http://localhost:8090"
            allowedMethods:                         # 允许的跨域ajax的请求方式
              - "GET"
              - "POST"
              - "DELETE"
              - "PUT"
              - "OPTIONS"
            allowedHeaders: "*"                     # 允许在请求中携带的头信息
            allowCredentials: true                  # 是否允许携带cookie
            maxAge: 360000                          # 这次跨域检测的有效期
```


或者：

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {

        CorsConfiguration config = new CorsConfiguration();

        // 允许所有域名访问（也可以改为具体域名）
        config.addAllowedOriginPattern("*");

        // 允许携带 Cookie（如后台需要）
        config.setAllowCredentials(true);

        // 允许所有方法
        config.addAllowedMethod(CorsConfiguration.ALL);

        // 允许所有 Header（尤其是 Authorization）
        config.addAllowedHeader(CorsConfiguration.ALL);

        // 暴露给前端的 header（可选）
        config.addExposedHeader("Authorization");
        config.addExposedHeader("X-User-Id");

        // CORS 配置应用于所有路径
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource(new PathPatternParser());
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
```

