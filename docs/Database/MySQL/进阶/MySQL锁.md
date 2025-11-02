

锁是计算机协调多个进程或线程并发访问某一资源的机制。在数据库中，除传统的计算资源（CPU、RAM、I/O）的争用以外，数据也是一种供许多用户共享的资源。

如何保证数据并发访问的一致性、有效性是所有数据库必须解决的一个问题，锁冲突也是影响数据库并发访问性能的一个重要因素。从这个角度来说，锁对数据库而言显得尤其重要，也更加复杂。

MySQL中的锁，按照锁的粒度分，分为以下三类：

- 全局锁：锁定数据库中的所有表。
- 表级锁：每次操作锁住整张表。
- 行级锁：每次操作锁住对应的行数据。

  
## 全局锁

全局锁就是对整个数据库实例加锁，加锁后整个实例就处于只读状态，后续的DML的写语句，DDL语句，已经更新操作的事务提交语句都将被阻塞。

其典型的使用场景是做全库的逻辑备份，对所有的表进行锁定，从而获取一致性视图，保证数据的完整性。

假设在数据库中有三张表: tb_stock 库存表，tb_order 订单表，tb_orderlog 订单日志表。

![](assets/MySQL锁/bc27b73d2e6541ab73c46c7580f88e8e_MD5.png)

1. 在进行数据备份时，先备份了tb_stock库存表。
2. 然后业务系统中，执行了下单操作，扣减库存，生成订单（更新tb_stock表，插入tb_order表）。
3. 再执行备份 tb_order表的逻辑。
4. 业务中执行插入订单日志操作。
5. 最后备份tb_orderlog表。

此时备份的数据是存在问题的。tb_stock表与tb_order表的数据不一致(有最新操作的订单信息，但是库存数没减)。

而对数据库进行进行逻辑备份之前，先对整个数据库加上全局锁，一旦加了全局锁之后，其他的DDL、DML全部都处于阻塞状态，但是可以执行DQL语句，也就是处于只读状态，而数据备份就是查询操作。

数据在进行逻辑备份的过程中，数据库中的数据就是不会发生变化的，这样就保证了数据的一致性和完整性。

### 语法

- 加全局锁：

```sql
flush tables with read lock;
```
  

- 数据备份：

```sql
mysqldump -uroot –p1234 study > study.sql
```


- 释放锁：

```sql
unlock tables;
```
  

数据库中加全局锁，是一个比较重的操作，存在以下问题：

1. 如果在主库上备份，那么在备份期间都不能执行更新，业务基本上就得停摆。
2. 如果在从库上备份，那么在备份期间从库不能执行主库同步过来的二进制日志（binlog），会导致主从延迟。

在InnoDB引擎中，我们可以在备份时加上参数 --single-transaction 参数来完成不加锁的一致性数据备份。

```sql
mysqldump --single-transaction -uroot –p123456 study > study.sql
```

  

## 表级锁

表级锁，每次操作锁住整张表。锁定粒度大，发生锁冲突的概率最高，并发度最低。应用在MyISAM、InnoDB、BDB等存储引擎中。

对于表级锁，主要分为以下三类：

- 表锁
- 元数据锁（meta data lock，MDL）
- 意向锁

  
### 表锁

- 表共享读锁（read lock）
- 表独占写锁（write lock）

#### 语法

- 加锁：

```sql
lock tables 表名... read/write
```
  

- 释放锁：

```sql
unlock tables / 客户端断开连接
```
  

#### 特点

 读锁不会阻塞其他客户端的读，但是会阻塞写。写锁既会阻塞其他客户端的读，又会阻塞其他客户端的写。

1. 读锁。左侧为客户端一，对指定表加了读锁，不会影响右侧客户端二的读，但是会阻塞右侧客户端的写。

![](assets/MySQL锁/71285da4b4966b529b6feeb70b9cfaf0_MD5.png)

2. 写锁。左侧为客户端一，对指定表加了写锁，会阻塞右侧客户端的读和写。

![](assets/MySQL锁/5196f9eb6c2d6099e9e8d3e03b4808d9_MD5.png)

  

### 元数据锁

meta data lock , 元数据锁，简写MDL。

MDL加锁过程是系统自动控制，无需显式使用，在访问一张表的时候会自动加上。MDL锁主要作用是维护表元数据的数据一致性，在表上有活动事务的时候，不可以对元数据进行写入操作。为了避免DML与DDL冲突，保证读写的正确性。

元数据，可以简单理解为就是一张表的表结构。 某一张表涉及到未提交的事务时，是不能够修改这张表的表结构的。

在MySQL5.5中引入了MDL，当对一张表进行增删改查的时候，加MDL读锁(共享)；当对表结构进行变更操作的时候，加MDL写锁(排他)。

常见的SQL操作时，所添加的元数据锁：

| 对应SQL                                       | 锁类型                                     | 说明                                       |
| ------------------------------------------- | --------------------------------------- | ---------------------------------------- |
| lock tables xxx read / write                | shared_read_only / shared_no_read_write |                                          |
| select 、select ... lock in share mode       | shared_read                             | 与shared_read、shared_write兼容，与exclusive互斥 |
| insert 、update、delete、select ... for update | shared_write                            | 与shared_read、shared_write兼容，与exclusive互斥 |
| alter table ...                             | exclusive                               | 与其他的MDL都互斥                               |

  
当执行select、insert、update、delete等语句时，添加的是元数据共享锁（shared_read /shared_write），之间是兼容的。

当执行select语句时，添加的是元数据共享锁（shared_read），会阻塞元数据排他锁（exclusive），之间是互斥的。

  

查看元数据锁的加锁情况：

```sql
select object_type,object_schema,object_name,lock_type,lock_duration from performance_schema.metadata_locks ;
```
  

### 意向锁

为了避免DML在执行时，加的行锁与表锁的冲突，在InnoDB中引入了意向锁，使得表锁不用检查每行数据是否加锁，使用意向锁来减少表锁的检查。

假如没有意向锁，客户端一对表加了行锁后，客户端二如何给表加表锁呢，来通过示意图简单分析一下：

1. 客户端一开启一个事务，执行DML操作，在执行DML语句时，会对涉及到的行加行锁。

![](assets/MySQL锁/3b9d39aa8a8f4a8f1affad2887abb255_MD5.png)

2. 当客户端二，想对这张表加表锁时，会检查当前表是否有对应的行锁，如果没有，则添加表锁，会从第一行数据，检查到最后一行数据，效率较低。

![](assets/MySQL锁/988c710841bf83d8af505abac6a8e29a_MD5.png)

3. 有了意向锁之后，客户端一在执行DML操作时，会对涉及的行加行锁，同时也会对该表加上意向锁。其他客户端，对这张表加表锁的时候，会根据该表上所加的意向锁来判定是否可以成功加表锁，而不用逐行判断行锁情况了。

![](assets/MySQL锁/373b820aa29d98ef3310cde5d03f8e47_MD5.png)

#### 分类

- 意向共享锁(IS)：由语句select ... lock in share mode添加。与表锁共享锁(read)兼容，与表锁排他锁(write)互斥。
- 意向排他锁(IX)：由insert、update、delete、select...for update添加。与表锁共享锁(read)及排他锁(write)都互斥，意向锁之间不会互斥。

一旦事务提交，意向共享锁、意向排他锁，都会自动释放。

  

查看意向锁及行锁的加锁情况：

```sql
select object_schema,object_name,index_name,lock_type,lock_mode,lock_data from performance_schema.data_locks;
```


## 行锁

行级锁，每次操作锁住对应的行数据。锁定粒度最小，发生锁冲突的概率最低，并发度最高。应用在InnoDB存储引擎中。

InnoDB的数据是基于索引组织的，行锁是通过对索引上的索引项加锁来实现的，而不是对记录加的锁。

主要分为以下三类：

- 行锁（Record Lock），锁定单个行记录的锁，防止其他事务对此行进行update和delete。在RC、RR隔离级别下都支持。

![](assets/MySQL锁/9f3be41784151d0bcf55e5ea371a1115_MD5.png)

- 间隙锁（Gap Lock）：锁定索引记录间隙（不含该记录），确保索引记录间隙不变，防止其他事务在这个间隙进行insert，产生幻读。在RR隔离级别下都支持。

![](assets/MySQL锁/d103c84d3246e8e83b71476079abeb03_MD5.png)

- 临键锁（Next-Key Lock）：行锁和间隙锁组合，同时锁住数据，并锁住数据前面的间隙Gap。在RR隔离级别下支持。

![](assets/MySQL锁/b4b5556c9035b7dc824e48d75779d8df_MD5.png)

  

### 行锁

InnoDB实现了以下两种类型的行锁：

- 共享锁(S)：允许一个事务去读一行，阻止其他事务获得相同数据集的排它锁。
- 排他锁(X)：允许获取排他锁的事务更新数据，阻止其他事务获得相同数据集的共享锁和排他锁。

| 当前锁类型 ↓  请求锁类型→ | S(共享锁) | X(排它锁) |
| --------------- | ------ | ------ |
| S(共享锁)          | 兼容     | 冲突     |
| X(排它锁)          | 冲突     | 冲突     |


常见的SQL语句，在执行时，所加的行锁如下：

| sql                           | 行锁类型  | 说明                               |
| ----------------------------- | ----- | -------------------------------- |
| insert ...                    | 排他锁   | 自动加锁                             |
| update ...                    | 排他锁   | 自动加锁                             |
| delete ...                    | 排他锁   | 自动加锁                             |
| select（正常）                    | 不加任何锁 |                                  |
| select ... lock in share mode | 共享锁   | 需要手动在select之后加lock in share mode |
| select ... for update         | 排他锁   | 需要手动在select之后加for update         |

  
默认情况下，InnoDB在 REPEATABLE READ事务隔离级别运行，InnoDB使用 next-key 锁进行搜索和索引扫描，以防止幻读。

- 针对唯一索引进行检索时，对已存在的记录进行等值匹配时，将会自动优化为行锁。

- InnoDB的行锁是针对于索引加的锁，不通过索引条件检索数据，那么InnoDB将对表中的所有记录加锁，此时 就会升级为表锁。

查看意向锁及行锁的加锁情况：

```sql
select object_schema,object_name,index_name,lock_type,lock_mode,lock_data from performance_schema.data_locks;
```
  

### 间隙锁&临键锁

默认情况下，InnoDB在 REPEATABLE READ事务隔离级别运行，InnoDB使用 next-key 锁进行搜索和索引扫描，以防止幻读。

- 索引上的等值查询(唯一索引)，给不存在的记录加锁时, 优化为间隙锁 。
- 索引上的等值查询(非唯一普通索引)，向右遍历时最后一个值不满足查询需求时，next-key lock 退化为间隙锁。
- 索引上的范围查询(唯一索引)--会访问到不满足条件的第一个值为止。

间隙锁唯一目的是防止其他事务插入间隙。间隙锁可以共存，一个事务采用的间隙锁不会阻止另一个事务在同一间隙上采用间隙锁。

  
- 索引上的等值查询(唯一索引)，给不存在的记录加锁时, 优化为间隙锁 。

![](assets/MySQL锁/fdb81ae3751df40e63c76f568ee0dbd6_MD5.png)

-  索引上的等值查询(非唯一普通索引)，向右遍历时最后一个值不满足查询需求时，next-key lock 退化为间隙锁。

InnoDB的B+树索引叶子节点是有序的双向链表。 假如，根据二级索引查询值为18的数据，并加共享锁，因为是非唯一索引，这个结构中可能有多个18的存在，所以在加锁时会继续往后找，找到一个不满足条件的值（当前案例中是29）。此时会对18加临键锁，并对29之前的间隙加锁。

![](assets/MySQL锁/691e4e67795d2602d581226fb753a5c2_MD5.png)

![](assets/MySQL锁/ce040be6c0605bdf8e0920e8630988da_MD5.png)

- 索引上的范围查询(唯一索引)--会访问到不满足条件的第一个值为止。

![](assets/MySQL锁/3cb20918a6bde4538fbc316310e1d8d1_MD5.png)

查询的条件为id>=19，并添加共享锁。 此时可以根据数据库表中现有的数据，将数据分为三个部分：

- \[19]
- (19,25]
- (25,+∞]

所以数据库数据在加锁时，将19加了行锁，25的临键锁（包含25及25之前的间隙），正无穷的临键锁(正无穷及之前的间隙)。