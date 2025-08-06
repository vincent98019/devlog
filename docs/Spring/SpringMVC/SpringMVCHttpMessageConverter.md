
HttpMessageConverter，报文信息转换器，将请求报文转换为Java对象，或将Java对象转换为响应报文。
HttpMessageConverter提供了两个注解和两个类型：`@RequestBody`，`@ResponseBody`，`RequestEntity`，`ResponseEntity`

## `@RequestBody`

`@RequestBody`可以获取请求体，需要在控制器方法设置一个形参，使用`@RequestBody`进行标识，当前请求的请求体就会为当前注解所标识的形参赋值。

```html
<form th:action="@{/testRequestBody}" method="post">
    用户名：<input type="text" name="username"><br>
    密码：<input type="password" name="password"><br>
    <input type="submit">
</form>
```

```java
@RequestMapping("/testRequestBody")
public String testRequestBody(@RequestBody String requestBody){
    System.out.println("requestBody:"+requestBody);
    return "success";
}
```

输出结果：`requestBody:username=admin&password=123456`

## RequestEntity

`RequestEntity`封装请求报文的一种类型，需要在控制器方法的形参中设置该类型的形参，当前请求的请求报文就会赋值给该形参，可以通过`getHeaders()`获取请求头信息，通过`getBody()`获取请求体信息。
```java
@RequestMapping("/testRequestEntity")
public String testRequestEntity(RequestEntity<String> requestEntity){
    System.out.println("requestHeader:"+requestEntity.getHeaders());
    System.out.println("requestBody:"+requestEntity.getBody());
    return "success";
}
```

## `@ResponseBody`

`@ResponseBody`用于标识一个控制器方法，可以将该方法的返回值直接作为响应报文的响应体响应到浏览器

```java
@RequestMapping("/testResponseBody")
@ResponseBody
public String testResponseBody(){
    return "success";
}
```

结果：浏览器页面显示success，而不是跳转到该页面

`@ResponseBody`处理json的步骤：

1. 导入jackson的依赖
```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.12.1</version>
</dependency>
```

2. 在SpringMVC的核心配置文件中开启mvc的注解驱动，此时在`HandlerAdaptor`中会自动装配一个消息转换器：`MappingJackson2HttpMessageConverter`，可以将响应到浏览器的Java对象转换为Json格式的字符串

```xml
<mvc:annotation-driven />
```

3. 在处理器方法上使用`@ResponseBody`注解进行标识

4. 将Java对象直接作为控制器方法的返回值返回，就会自动转换为Json格式的字符串

```java
@RequestMapping("/testResponseUser")
@ResponseBody
public User testResponseUser(){
    return new User(1001,"admin","123456",23,"男");
}
```

浏览器的页面中展示的结果：`{“id”:1001,“username”:“admin”,“password”:“123456”,“age”:23,“sex”:“男”}`

## `@RestController`

`@RestController`注解是springMVC提供的一个复合注解，标识在控制器的类上，就相当于为类添加了`@Controller`注解，并且为其中的每个方法添加了`@ResponseBody`注解

## ResponseEntity

ResponseEntity用于控制器方法的返回值类型，该控制器方法的返回值就是响应到浏览器的响应报文
