
Oracle 中已存在三个重要的角色：connect 角色，resource 角色，dba 角色。

```sql
-- 创建用户
create user study   -- 用户名
identified by study -- 密码
default tablespace study;   -- 所属的表空间

-- 给用户授权，否则无法登录
-- Oracle中常用角色
-- connect     连接角色，基本角色
-- resource    开发者角色
-- dba         超级管理员角色
-- 给study用户授予dba角色
grant dba to study;
```
  

**CONNECT 角色： --是授予最终用户的典型权利，最基本的**  

- ALTER SESSION --修改会话
- CREATE CLUSTER --建立聚簇
- CREATE DATABASE LINK --建立数据库链接
- CREATE SEQUENCE --建立序列
- CREATE SESSION --建立会话
- CREATE SYNONYM --建立同义词
- CREATE VIEW --建立视图


**RESOURCE 角色： --是授予开发人员的**

- CREATE CLUSTER --建立聚簇
- CREATE PROCEDURE --建立过程
- CREATE SEQUENCE --建立序列
- CREATE TABLE --建表
- CREATE TRIGGER --建立触发器
- CREATE TYPE --建立类型

**DBA 角色**：拥有全部特权，是系统最高权限，只有 DBA 才可以创建数据库结构，并且系统权限也需要 DBA 授出，且 DBA 用户可以操作全体用户的任意基表，包括删除