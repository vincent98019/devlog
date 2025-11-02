

## 系统数据库

Mysql数据库安装完成后，自带了一下四个数据库，具体作用如下：

| 数据库                | 含义                                                       |
| ------------------ | -------------------------------------------------------- |
| mysql              | 存储MySQL服务器正常运行所需要的各种信息 （时区、主从、用户、权限等）                    |
| information_schema | 提供了访问数据库元数据的各种表和视图，包含数据库、表、字段类型及访问权限等                    |
| performance_schema | 为MySQL服务器运行时状态提供了一个底层监控功能，主要用于收集数据库服务器性能参数               |
| sys                | 包含了一系列方便 DBA 和开发人员利用 performance_schema性能数据库进行性能调优和诊断的视图 |

  

## 常用工具

### mysql

该mysql不是指mysql服务，而是指mysql的客户端工具。

语法：

```bash
mysql [options] [database]

# 指定用户名
# -u, --user=name

#指定密码
# -p, --password[=name]

#指定服务器IP或域名
# -h, --host=name

#指定连接端口
# -P, --port=port

#执行SQL语句并退出
# -e, --execute=name 
```

-e选项可以在Mysql客户端执行SQL语句，而不用连接到MySQL数据库再执行，对于一些批处理脚本，这种方式尤其方便。

```bash
mysql -uroot –p123456 db01 -e "select * from stu";
```

![](assets/MySQL%E7%AE%A1%E7%90%86/d0d7bad28d9e965fd64446570c88c599_MD5.png)


### mysqladmin

mysqladmin 是一个执行管理操作的客户端程序。可以用它来检查服务器的配置和当前状态、创建并删除数据库等。

通过帮助文档查看选项：`mysqladmin --help`

语法：

```bash
mysqladmin [options] command ..

#指定用户名
# -u, --user=name

#指定密码
# -p, --password[=name]

#指定服务器IP或域名
# -h, --host=name

#指定连接端口
# -P, --port=port
```

![](assets/MySQL%E7%AE%A1%E7%90%86/7d4b1a6693996427d3d804aad9ee162f_MD5.png)

  
### mysqlbinlog

由于服务器生成的二进制日志文件以二进制格式保存，所以如果想要检查这些文本的文本格式，就会使用到mysqlbinlog 日志管理工具。

```bash
mysqlbinlog [options] log-files1 log-files2 ..

# 指定数据库名称，只列出指定的数据库相关操作。
# -d, --database=name

# 忽略掉日志中的前n行命令。
# -o, --offset=n

# 将输出的文本格式日志输出到指定文件。
# -r, --result-file=name

# 显示简单格式， 省略掉一些信息。
# -s, --short-form

# 指定日期间隔内的所有日志。
# --start-datatime=date1 --stop-datetime=date2

# 指定位置间隔内的所有日志。
# --start-position=pos1 --stop-position=pos2
```

![](assets/MySQL%E7%AE%A1%E7%90%86/34d06fa0f9ceddef99d18ba5cedda587_MD5.png)

### mysqlshow

mysqlshow 客户端对象查找工具，用来很快地查找存在哪些数据库、数据库中的表、表中的列或者索引。

```bash
mysqlshow [options] [db_name [table_name [col_name]]]

# 显示数据库及表的统计信息（数据库，表 均可以不指定）
# --count

# 显示指定数据库或者指定表的状态信息
# -i
```

例：

```bash
#查询test库中每个表中的字段数及行数
mysqlshow -uroot -p2143 test --count

#查询test库中book表的详细情况
mysqlshow -uroot -p2143 test book --count
```
  

### mysqldump

mysqldump 客户端工具用来备份数据库或在不同数据库之间进行数据迁移。备份内容包含创建表，及插入表的SQL语句。

```bash
mysqldump [options] db_name [tables]
mysqldump [options] --database/-B db1 [db2 db3...]
mysqldump [options] --all-databases/-A

# 连接选项：

#指定用户名
# -u, --user=name

#指定密码
# -p, --password[=name]

#指定服务器IP或域名
# -h, --host=name

#指定连接端口
# -P, --port=port

# 输出选项：

# 在每个数据库创建语句前加上 drop database 语句
# --add-drop-database

# 在每个表创建语句前加上 drop table 语句，默认开启；不开启 (--skip-add-drop-table)
# --add-drop-table

# 不包含数据库的创建语句
# -n, --no-create-db

# 不包含数据表的创建语句
# -t, --no-create-info

# 不包含数据
# -d --no-data

# 自动生成两个文件：一个.sql文件，创建表结构的语句；一 个.txt文件，数据文件
# -T, --tab=name 
```

例：备份db01数据库

![](assets/MySQL%E7%AE%A1%E7%90%86/930364c1595b55169a36d7d61e3e6dc7_MD5.png)

将db01数据库的表的表结构与数据分开备份(-T)：

```bash
mysqldump -uroot -p1234 -T /root db01 score
```

指定的数据存放目录/root，MySQL认为是不安全的，需要存储在MySQL信任的目录下。MySQL信任的目录可以查看一下系统变量 secure_file_priv 。执行结果如下：

![](assets/MySQL%E7%AE%A1%E7%90%86/1ef7fad49eb9521d1686cfa1651998b5_MD5.png)

![](assets/MySQL%E7%AE%A1%E7%90%86/8dcec113bd7b8764b103c3a007944523_MD5.png)

  

### mysqlimport/source

mysqlimport 是客户端数据导入工具，用来导入mysqldump 加 -T 参数后导出的文本文件。

```bash
mysqlimport [options] db_name textfile1 [textfile2...]
```

例：

```bash
mysqlimport -uroot -p2143 test /tmp/city.txt
```
  

如果需要导入sql文件,可以使用mysql中的source 指令：

```bash
source /root/xxxxx.sql
```
  
