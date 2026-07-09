在配置文件中写的断言规则只是字符串，这些字符串会被Predicate Factory读取并处理，转变为路由判断的条件。

多个Route Predicate工厂可以进行组合，并通过逻辑and。

例如 `Path=/user/**` 是按照路径匹配，

这个规则是由 `org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory` 类来处理的，

像这样的断言工厂在SpringCloudGateway还有十几个：

| 名称         | 说明                | 示例                                                                                                       |
| ---------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| After      | 是某个时间点后的请求        | `- After=2037-01-20T17:42:47.789-07:00[America/Denver]`                                                  |
| Before     | 是某个时间点之前的请求       | -` Before=2031-04-13T15:14:47.433+08:00[Asia/Shanghai]`                                                  |
| Between    | 是某两个时间点之前的请求      | `- Between=2037-01-20T17:42:47.789-07:00[America/Denver], 2037-01-21T17:42:47.789-07:00[America/Denver]` |
| Cookie     | 请求必须包含某些cookie    | `- Cookie=chocolate, ch.p`，常用于 WebSession 判断，可以带正则表达式                                                    |
| Header     | 请求必须包含某些header    | `- Header=X-Request-Id, \d+`，可以带正则表达式                                                                    |
| Host       | 请求必须是访问某个host（域名） | `- Host=.somehost.org,.anotherhost.org`，也可以写通配符`*.beefic.com`                                            |
| Method     | 请求方式必须是指定方式       | `- Method=GET,POST`                                                                                      |
| Path       | 请求路径必须符合指定规则      | `- Path=/red/{segment},/blue/**`，`*` 匹配一段，`**` 递归匹配                                                      |
| Query      | 请求参数必须包含指定参数      | `- Query=name, Jack` 或者 `- Query=name`，可以带正则表达式                                                          |
| RemoteAddr | 请求者的ip必须是指定范围     | `- RemoteAddr=192.168.1.1/24`，可以给管理平台使用                                                                  |
| Weight     | 权重处理              | `- Weight=group1, 80`，与同组其它路由组成 100%：路由 A 80%，路由 B 20%，适用于灰度发布 / AB 流量<br>                               |

![](./assets/Gateway%E6%96%AD%E8%A8%80%EF%BC%88Predicate%EF%BC%89%E5%B7%A5%E5%8E%82/ee98b944003fe0b603e31f8b243fe2e1_MD5.png)