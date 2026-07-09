## 单行函数

作用于一行，返回一个值。

### 字符函数

- `upper()`：小写变大写
- `lower()`：大写变小写

```sql
select upper('yes') from dual;  -- upper():小写变大写
select lower('YES') from dual;  -- lower():大写变小写
```


### 数值函数

- `round(m,n)`：四舍五入，n表示保留的位数，可以为负数，例如-1就是个位的舍入
- `trunc(m,n)`：直接截取，n表示截取到哪一位，可以为负数
- `mod(m,n)`：求余，m是被除数，n是除数，得出的结果是余数

```sql
select round(26.18, 1) from dual;  -- round(m,n):四舍五入
select trunc(56.16, 1) from dual;  -- trunc(m,n):直接截取，n表示截取到哪一位，可以为负数
select mod(10, 3) from dual;       -- mod(m,n):求余，m是被除数，n是除数，得出的结果是余数
```
  

### 日期函数

日期可以直接加减，得到的单位是天

- `sysdate`:当前系统的时间
- `months_between(m,n)`:日期m到日期n有几个月

```sql
-- 查询出EMP表所有员工入职到现在有几天
select sysdate-e.hiredate from emp e; -- sysdate:当前系统的时间

-- 算出明天的此时
select sysdate+1 from dual;

-- 查询出EMP表所有员工入职距离至现在有几个月
select months_between(sysdate, e.hiredate) from emp e;  -- months_between(m,n):日期m到日期n有几个月

-- 查询出EMP表所有员工入职距离至现在有几年
select months_between(sysdate, e.hiredate)/12 from emp e;

-- 查询出EMP表所有员工入职距离至现在有几周
select (sysdate-e.hiredate)/7 from emp e;
```
  

### 转换函数

- `to_char(m,n)`：将日期转换为字符串
- `'yyyy-mm-dd hh:mi:ss'`：不区分大小写，所以分钟使用mi
- `'fm yyyy-mm-dd hh:mi:ss'`：去除0，例如05月变成5月
- `'yyyy-mm-dd hh24:mi:ss'`：24小时计数法
- `to_date(m,n)`：将字符串转换为日期

```sql

-- 日期转换为字符串

select to_char(sysdate, 'yyyy-mm-dd hh:mi:ss') from dual;  -- to_char(m,n):将日期转换为字符串

select to_char(sysdate, 'fm yyyy-mm-dd hh:mi:ss') from dual;

select to_char(sysdate, 'yyyy-mm-dd hh24:mi:ss') from dual;

-- 字符串转换为日期

select to_date('2021-05-23 21:21:17', 'yyyy-mm-dd hh24:mi:ss') from dual;    -- to_date(m,n):将字符串转换为日期
```
  

### 通用函数

- `nvl(m,n)`：如果m是null，则替换为n

```sql
-- 算出EMP表中所有员工的年薪          null和任意数值做算术运算，结果都是null
select e.sal*12+nvl(e.comm, 0) from emp e;        -- nvl(m,n):如果m是null，则替换为n
```
  

## 条件表达式

mysql和oracle通用写法：

等值判断：

```sql
-- 给EMP表中员工起中文名
select e.ename,
case e.ename
  when 'SMITH' then '张三'       -- 将when的值转换为then的值
    when 'ALLEN' then '李四'
      when 'WARD' then '王五'    
        else '无名'              -- 如果没有when的值，则默认使用else的值，不写则默认为null
          end                    -- 结束语句
from emp e;
```
  

范围判断：

```sql
-- 判断EMP表员工工资，如果高于3k，显示高收入，在1.5k~3k之间，显示中等收入，低于1.5k显示低收入
select 
e.ename, e.sal,
case
  when e.sal>3000 then '高收入'
    when e.sal>1500 then '中等收入'
      else '低收入'
        end
from emp e;
```  

oracle专用的条件表达式

```sql
-- oracle中起别名用双引号或者不用引号，其他都用单引号
-- 给EMP表中员工起中文名
select e.ename,
 decode(e.ename,
   'SMITH', '张三',    
   'ALLEN', '李四',
   'WARD',  '王五',    
   '无名')  "中文名"           
from emp e;
```
  

## 多行函数(聚合函数)

作用于多行，返回一个值。

- `count()`：查询总数量，推荐参数写1，指的是第一列
- `sum()`：总和
- `max()`：最大值
- `min()`：最小值
- `avg()`：平均值


```sql
-- 多行函数【聚合函数】：
select count(1) from emp;        -- count():查询总数量，推荐参数写1，指的是第一列
select sum(sal) from emp;        -- sum():总和
select max(sal) from emp;        -- max():最大值
select min(sal) from emp;        -- min():最小值
select avg(sal) from emp;        -- avg():平均值
```