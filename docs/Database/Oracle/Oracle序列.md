
在很多数据库中都存在一个自动增长的列，如果现在要想在 oracle 中完成自动增长的功能，则只能依靠序列完成，所有的自动增长操作，需要用户手工完成处理。

```sql
CREATE SEQUENCE 序列名
[INCREMENT BY n] -- 每次增加n，默认为1
[START WITH n] -- 从n开始，默认为1
[{MAXVALUE/ MINVALUE n|NOMAXVALUE}] -- 最大值和最小值
[{CYCLE|NOCYCLE}] -- 循环
[{CACHE n|NOCACHE}];    -- 缓存，缓存n个序列，略微提高效率
```
  

例如创建一个 seqpersonid 的序列，验证自动增长的操作

```sql
CREATE SEQUENCE seqpersonid;
```
  

序列创建完成之后，所有的自动增长应该由用户自己处理，所以在序列中提供了以下的两种操作：

- **nextval**：取得序列的下一个内容
- **currval**：取得序列的当前内容

```sql
-- dual是虚表，只是为了补全语法，没有任何意义
-- 查看下一个序列
select seqpersonid.nextval from dual;

-- 查看当前序列
select seqpersonid.currval from dual;
```

在插入数据时需要自增的主键中可以这样使用

```sql
insert into 表名 (列名1（主键）, 列名2, ...) values (序列名.nextval, 列2的值, ...);
```