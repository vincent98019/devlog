
## 分组查询  

分组查询中，出现在group by 后面的原始列，才能出现在select后面，没有出现的原始列，必须加上聚合函数才能出现在select后面，聚合函数的一个特性：把多行记录变成一个值。


- where：过滤分组前的数据，必须在group by之前
- having：过滤分组后的数据，必须在group by之后

```sql
-- 查询每个部门的平均工资
select e.deptno, avg(e.sal)
from emp e
group by e.deptno;

-- 查询平均工资高于2000的部门信息
select e.deptno, avg(e.sal)
from emp e
group by e.deptno
having avg(e.sal) > 2000;

-- 查询每个部门工资高于800的员工的平均工资
select e.deptno, avg(e.sal)
from emp e
where e.sal > 800
group by e.deptno

-- 查询每个部门工资高于800的员工的平均工资，并且部门平均工资高于2000的部门
select e.deptno, avg(e.sal)
from emp e
where e.sal > 800
group by e.deptno
having avg(e.sal)>2000
```
  

## 自连接

在不同的角度把一张表看成多张表

```sql
-- 自连接:在不同的角度把一张表看成多张表
-- 查询员工姓名和员工的领导姓名
select e1.ename, e2.ename
from emp e1, emp e2
where e1.mgr = e2.empno;

-- 查询员工名称、员工部门名称、员工领导名称、员工领导部门名称
select e1.ename, d1.dname, e2.ename, d2.dname
from emp e1, emp e2, dept d1, dept d2
where e1.mgr = e2.empno 
and e1.deptno = d1.deptno 
and e2.deptno = d2.deptno;
```
  

## 子查询

```sql
-- 子查询
-- 子查询返回一个值
-- 查询工资和scott一样的员工信息
select * from emp where sal in (
select sal from emp where ename = 'SCOTT')

-- 子查询返回一个集合
-- 查询出工资和10号部门任意员工的工资一样的员工信息
select * from emp where sal in(
select sal from emp where deptno = 10)

-- 子查询返回一张表
-- 查询每个部门最低工资，和最低工资员工姓名，和该员工所在的部门名称
-- 1. 先查询每个部门的最低工资
select deptno, min(sal) msal from emp group by deptno;
-- 2. 三表联查，得到最终结果
select e.ename, e.sal, d.dname, d.deptno
from emp e, (select deptno, min(sal) msal from emp group by deptno) t, dept d
where t.msal = e.sal 
and t.deptno = e.deptno
and t.deptno = d.deptno;
```
  

## 分页查询

```sql
-- oracle的分页
-- rownum：行号，当做select操作时，每查询一行记录，就会在该行加一个行号
-- 行号从1开始，依次递增。排序操作会影响rownum的顺序
select rownum, e.* from emp e where rownum < 4 order by e.sal desc

-- 如果涉及到排序，还需要使用rownum时，可以嵌套查询
select rownum t.* from (
select rownum, e.* from emp e where rownum < 4 order by e.sal desc) t;

-- emp表工资倒序后，每页5条记录，查询第二页
-- 在where语句中rownum不能大于一个正数
select * 
from (
  select rownum rn, tt.*
  from (select * from emp order by sal desc) tt
  where rownum < 11)
where rn > 5;
```