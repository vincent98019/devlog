---
slug: linux
title: 服务器配置密钥登录
authors: [vincent]
tags: [ssh, linux]
---

生成 **SSH 密钥对** 的原理和Git 里用的密钥是一模一样的。

**工作用（Git 代码仓库）** 和 **服务器登录用** 可以用同一对密钥，也可以分开生成不同的密钥对，方便管理，也更安全。

<!-- truncate -->

## 生成密钥

在终端选一个执行，生成密钥：

```bash
# rsa 算法，最常见的算法
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Ed25519 算法，比 RSA 更短、更快、更安全
ssh-keygen -t ed25519 -C "your_email@example.com"
```


系统会问你要保存到哪里，默认是 `/Users/xxx/.ssh/id_ed25519`，如果之前已经有密钥的话，建议不要覆盖它，可以改个名字，例如：

```bash
Enter file in which to save the key (/Users/xxx/.ssh/id_ed25519):/Users/xxx/.ssh/id_ed25519_vlon
```


然后会让你设置密码，不设置的话可以直接回车：

- **如果直接回车（留空）** → 就没有密码，每次用这个私钥时不会再提示输入。
    
- **如果输入一个密码** → 每次用这个私钥时，需要输入这个密码来解锁私钥。

## 配置快速登录

编辑配置文件 `~/.ssh/config`（没有就新建）：

```bash
# 我的服务器
Host myserver
    HostName 192.168.31.168
    User vlon
    Port 22
    IdentityFile ~/.ssh/id_ed25519_vlon
```

如果有多个密钥的话，需要在`IdentityFile`中配置对应密钥，不配置则使用默认密钥。

这样就可以使用：

```bash
ssh myserver
```

自动使用密钥登录服务器，但现在还不行，还需要下面的配置：


## 把公钥配置到服务器

把公钥复制到服务器：

```bash
ssh-copy-id user@server_ip

# 如果不是默认的，则需要指定密钥文件，
# 注意是pub后缀的文件
# 例如：
ssh-copy-id -i ~/.ssh/id_ed25519_vlon.pub vlon@192.168.31.168
```

或者手动把 pub 的内容追加到服务器上的 `~/.ssh/authorized_keys` 文件中。

正常登录服务器，修改权限：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```


现在就可以使用密钥 免密码 登录服务器了：

```bash
ssh user@server_ip
```

也可以使用：

```bash
ssh myserver
```

后续使用scp命令也更方便：
```bash
scp ~/test.txt vlon:/usr
```


## 禁用密码登录，提高安全性

修改 `/etc/ssh/sshd_config`，确保有：

```bash
PasswordAuthentication no
PubkeyAuthentication yes
```

然后重启 ssh 服务：

```bash
sudo systemctl restart ssh
```