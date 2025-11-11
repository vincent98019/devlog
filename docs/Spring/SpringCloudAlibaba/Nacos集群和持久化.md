

![](assets/Nacos%E9%9B%86%E7%BE%A4%E5%92%8C%E6%8C%81%E4%B9%85%E5%8C%96/509a8666c1bb75ffb9de0ab8caf6757d_MD5.png)

![](assets/Nacos%E9%9B%86%E7%BE%A4%E5%92%8C%E6%8C%81%E4%B9%85%E5%8C%96/a8f21550251bf2358e3861b37902890f_MD5.png)

[https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html](https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html)

默认Nacos使用嵌入式数据库实现数据的存储。所以，如果启动多个默认配置下的Nacos节点，数据存储是存在一致性问题的。

为了解决这个问题，Nacos采用了集中式存储的方式来支持集群化部署，目前只支持MySQL的存储。

![](assets/Nacos%E9%9B%86%E7%BE%A4%E5%92%8C%E6%8C%81%E4%B9%85%E5%8C%96/02eb2e0d666117de4ec7f09703487f8e_MD5.png)

![](assets/Nacos%E9%9B%86%E7%BE%A4%E5%92%8C%E6%8C%81%E4%B9%85%E5%8C%96/cece7801830705c22d1921fabfce0882_MD5.png)

官网说明：[https://nacos.io/zh-cn/docs/deployment.html](https://nacos.io/zh-cn/docs/deployment.html)

  

## 持久化

Nacos默认自带的是嵌入式数据库derby，[https://github.com/alibaba/nacos/blob/develop/config/pom.xml](https://github.com/alibaba/nacos/blob/develop/config/pom.xml)

derby到mysql切换配置步骤：

1. nacos-server-1.1.4\nacos\conf目录下找到sql脚本(nacos-mysql.sql)
2. 执行脚本
3. nacos-server-1.1.4\nacos\conf目录下找到application.properties
4. 修改配置（最底下加入这些配置）

```properties
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=root
db.password=123123
```

5. 重启nacos

启动Nacos，可以看到是个全新的空记录界面，以前是记录进derby，重新配置之后，MySQL数据库中就有数据啦

  

## Linux版Nacos安装

Nacos下载Linux版：[https://github.com/alibaba/nacos/releases](https://github.com/alibaba/nacos/releases)

上传到Linux系统并解压，因为要在一台机器上运行三个nacos，需要改端口号，修改startup文件的端口号

1. 配置MySQL数据库，并执行nacos-mysql.sql文件，创建数据库

2. application.properties 配置

```properties
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://192.168.0.123:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false&useUnicode=true&serverTimezone=Asia/Shanghai
db.user=root
db.password=123123
```

3. Linux服务器上nacos的集群配置cluster.conf，梳理出3台nacos集器的不同服务端口号(这个IP不能写127.0.0.1，必须是Linux命令hostname -i能够识别的IP)

拷贝这个文件

```bash
cp cluster.conf.example cluster.conf
```

并修改内容：

![](assets/Nacos%E9%9B%86%E7%BE%A4%E5%92%8C%E6%8C%81%E4%B9%85%E5%8C%96/b12ca0d2ac9cf4819fbf22ba6c5b4bdb_MD5.png)

4. 编辑Nacos的启动脚本startup.sh，使它能够接受不同的启动端口

集群启动，希望可以类似其它软件的shell命令，传递不同的端口号启动不同的nacos实例。命令：`./startup.sh -p 3333` 表示启动端口号为3333的nacos服务器实例，和上一步的cluster.conf配置的一致。

![](assets/Nacos%E9%9B%86%E7%BE%A4%E5%92%8C%E6%8C%81%E4%B9%85%E5%8C%96/bb3cce09c37d5c3a7f891b49709b0108_MD5.png)

这里我改成了-a

![](assets/Nacos%E9%9B%86%E7%BE%A4%E5%92%8C%E6%8C%81%E4%B9%85%E5%8C%96/db993a3a4adee592ba04cc497e816ad1_MD5.png)

5. Nginx的配置，由它作为负载均衡器

修改nginx的配置文件

```
upstream cluster{
        server 127.0.0.1:3333;
        server 127.0.0.1:4444;
        server 127.0.0.1:5555;
}
```