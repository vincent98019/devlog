
## 基础配置

创建一个新的微服务cloudalibaba-config-nacos-client3377

添加pom的相关依赖：

```xml
<!--nacos-config-->
<dependency>
   <groupId>com.alibaba.cloud</groupId>
   <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>

<!--nacos-discovery-->
<dependency>
   <groupId>com.alibaba.cloud</groupId>
   <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```
  

配置yml文件：

Nacos同springcloud-config一样，在项目初始化时，要保证先从配置中心进行配置拉取，拉取配置之后，才能保证项目的正常启动。

springboot中配置文件的加载是存在优先级顺序的，bootstrap优先级高于application

bootstrap：

```yaml

# nacos配置
server:
  port: 3377

spring:
  application:
    name: nacos-config-client
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
      config:
        server-addr: localhost:8848 #Nacos作为配置中心地址
        file-extension: yaml #指定yaml格式的配置
# ${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}
# nacos-config-client-dev.yaml
# nacos-config-client-test.yaml  ----> config.info
```


application：

```yaml
spring:
  profiles:
    active: dev # 表示开发环境
    #active: test # 表示测试环境
    #active: info
```


主启动类：

```java
@EnableDiscoveryClient
@SpringBootApplication
public class NacosConfigClientMain3377 {
   public static void main(String[] args) {
       SpringApplication.run(NacosConfigClientMain3377.class, args);
   }
}
```
  

业务类：

在控制器类加入@RefreshScope注解使当前类下的配置支持Nacos的动态刷新功能。

```java
@RestController
@RefreshScope // 支持Nacos的动态刷新功能。
public class ConfigClientController {
   @Value("${config.info}")
   private String configInfo;
  
   @GetMapping("/config/info")
   public String getConfigInfo() {
       return configInfo;
   }
}
```
  

在Nacos中添加配置信息：

### Nacos中的匹配规则

Nacos中的dataid的组成格式及与SpringBoot配置文件中的匹配规则

官网：[https://nacos.io/zh-cn/docs/quick-start-spring-cloud.html](https://nacos.io/zh-cn/docs/quick-start-spring-cloud.html)

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/4207d8486def42c723725dbca51e2e56_MD5.png)

最后公式：

```
${spring.application.name}-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}
```

- prefix 默认为 spring.application.name 的值
- spring.profile.active 即为当前环境对应的 profile，可以通过配置项 spring.profile.active 来配置
- file-exetension 为配置内容的数据格式，可以通过配置项 spring.cloud.nacos.config.file-extension 来配置
- 配置文件的后缀需要为yaml，全后缀

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/6e223d8f484db07ce6b701100f3f5b31_MD5.png)

Nacos会记录配置文件的历史版本默认保留30天，此外还有一键回滚功能，回滚操作将会触发配置更新

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/54e55441cf8be95bf879c850a62ad208_MD5.png)


新建一个配置：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/85cebc70f38716f9b70b840f5a21a92a_MD5.png)


测试：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/913da19a8672f1d0d404aa9372a40d39_MD5.png)

此时修改nacos中的配置内容 version 2  ：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/6509dc0863c9318372636525da1f0898_MD5.png)

不用重启项目，直接进行测试：

自带动态刷新

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/e2c9269ab5aeb9bbad3755e70b093d6d_MD5.png)

  

## 分类配置

多环境多项目管理：

问题1：实际开发中，通常一个系统会准备dev开发环境、test测试环境、prod生产环境。如何保证指定环境启动时服务能正确读取到Nacos上相应环境的配置文件呢？

问题2：一个大型分布式微服务系统会有很多微服务子项目，每个微服务项目又都会有相应的开发环境、测试环境、预发环境、正式环境......那怎么对这些微服务配置进行管理呢？
  

### Nacos的图形化管理界面

配置管理：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/ae343517439a90897e33dcd54d158482_MD5.png)


命名空间：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/30e5bacdcb55a0ab20966c6597e0889b_MD5.png)


Namespace+Group+Data ID三者关系？为什么这么设计？

类似Java里面的package名和类名，最外层的namespace是可以用于区分部署环境的，Group和DataID逻辑上区分两个目标对象。


三者情况

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/d023171b58ad28eb0fca2c4b851a2fa9_MD5.png)

默认情况： Namespace=public，Group=DEFAULT_GROUP， 默认Cluster是DEFAULT

- Nacos默认的命名空间是public，Namespace主要用来实现隔离。 比方说我们现在有三个环境：开发、测试、生产环境，我们就可以创建三个Namespace，不同的Namespace之间是隔离的。
- Group默认是DEFAULT_GROUP，Group可以把不同的微服务划分到同一个分组里面去。
- Service就是微服务，一个Service可以包含多个Cluster（集群），Nacos默认Cluster是DEFAULT，Cluster是对指定微服务的一个虚拟划分。比方说为了容灾，将Service微服务分别部署在了杭州机房和广州机房，这时就可以给杭州机房的Service微服务起一个集群名称（HZ），给广州机房的Service微服务起一个集群名称（GZ），还可以尽量让同一个机房的微服务互相调用，以提升性能。
- 最后是Instance，就是微服务的实例。

### 三种方案加载配置

#### DataID方案

指定spring.profile.active和配置文件的DataID来使不同环境下读取不同的配置，默认空间+默认分组+新建dev和test两个DataID

新建一个DataID不一样的配置文件：nacos-config-client-test.yaml

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/38f2db8aba822d5e499076547ab2835b_MD5.png)

现在的配置：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/b1a247da0f9eb894492899cef59fecd6_MD5.png)

 通过spring.profile.active属性就能进行多环境下配置文件的读取

 将dev环境切换为test环境，然后重启微服务

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/235ac1f20bf131e12649084b3e158fa7_MD5.png)

 可以看到已经切换到test环境的配置了：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/fdb42e68bf037b2c99c8aae8f42b3312_MD5.png)

  

#### Group方案

通过Group实现环境区分，新建Group：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/1891f817fafad5619b9db7310fe6692b_MD5.png)

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/4827460c62d21206a54670d26b531147_MD5.png)

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/fe95c84991ba7849b2262ae02651de80_MD5.png)

新增了两个配置，一个dev组，一个test组，将服务环境改为info的环境

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/75b53cb3e671e00d4344304052d0abad_MD5.png)

然后配置bootstrap.yml文件，加上group属性：

```yml
spring:
  application:
    name: nacos-config-client
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
      config:
        server-addr: localhost:8848
        file-extension: yaml
        group: DEV_GROUP   # 指定group分组
```
  

重启微服务，并进行测试：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/7659f215158e1c081daf1ecd64b6d2a6_MD5.png)

将bootstrap.yml文件的group属性改为TEST_GROUP再重启：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/899df3e01612472b6b752cc216e0b19a_MD5.png)

  

#### Namespace方案

新建dev和test的命名空间：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/4fbdea10a19bc24206fb3f647dc8456a_MD5.png)

此时服务列表就有新增的命名空间了：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/43342288a49c232ef440331d81438c47_MD5.png)

  

配置微服务的命名空间、group：

```yml
spring:
  application:
    name: nacos-config-client
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
     config:
        server-addr: localhost:8848
        file-extension: yaml
        group: DEV_GROUP
        namespace: 7ec0b349-9767-4252-9920-b3e3f504083b
```
  

环境切换为dev环境：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/b2c1aa4a1b9004e7260b403902ba1b4e_MD5.png)

  

在dev的命名空间中新建三个配置：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/a60649bee676f6bd33bb2701b18a74ec_MD5.png)

  

重启应用，并进行测试：

![](assets/Nacos%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/3b9101ad3644beef51cbbb0a26230d1d_MD5.png)