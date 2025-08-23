---
slug: Linux/内网穿透与 FRP 配置指南
title: 内网穿透与 FRP 配置指南
authors: [vincent]
tags: [frp, linux]
date: 2025-08-23
---

FRP（Fast Reverse Proxy）是一款用于内网穿透的工具，支持 TCP、UDP、HTTP、HTTPS 等协议。

- **FRPS（服务端）**：部署在公网服务器上，负责接收流量并转发。
- **FRPC（客户端）**：部署在内网机器上，将本地服务映射到公网。

<!-- truncate -->


## 安装和启动

在GitHub上下载最新版：[https://github.com/fatedier/frp/releases](https://github.com/fatedier/frp/releases)

在 **服务端**（运行在有公网 IP 的机器上，比如云服务器） 和 **客户端**（运行在内网机器上）分别下载解压：

```bash
# 进入临时目录
cd /tmp

# 下载最新版本（以 0.64.0 为例，根据你的系统架构选择）
wget https://github.com/fatedier/frp/releases/download/v0.64.0/frp_0.64.0_linux_amd64.tar.gz

# 解压
tar -zxvf frp_0.64.0_linux_amd64.tar.gz

# 移动到 /usr/local
sudo mv frp_0.64.0_linux_amd64 /usr/local/frp
cd /usr/local/frp
```


### FRPS（云服务器）

```bash
# 启动 FRP 服务端
./frps -c frps.toml
```

### FRPC（内网机器）

```bash
# 启动 FRP 客户端
./frpc -c frpc.toml
```


## FRP 配置文件（TOML 格式）

### FRPS 配置（frps.toml）

```toml
bindPort = 7000  # FRP 监听端口

vhostHttpPort = 8080  # FRP HTTP 端口
vhostHttpsPort = 8443 # FRP HTTPS 端口
```



### FRPC 配置（frpc.toml）
```toml
serverAddr = "你的云服务器公网 IP"
serverPort = 7000

[[proxies]]
name = "web"
type = "http"
localPort = 80
customDomains = ["yourdomain.com"]
```


### 多端口映射

要映射多个服务，可以在 `frpc.toml` 里添加多个 `[[proxies]]` 配置，例如：

```toml
[[proxies]]
name = "ssh"
type = "tcp"
localPort = 22
remotePort = 2222

[[proxies]]
name = "web"
type = "http"
localPort = 80
customDomains = ["yourdomain.com"]
```

这样，你可以通过 `ssh -p 2222 user@云服务器IP` 远程连接内网机器。


### 结合 Nginx 进行反向代理

Nginx 配置（云服务器）：

在 `/etc/nginx/sites-available/default` 或 `/etc/nginx/nginx.conf` 添加：

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

如果使用 HTTPS，添加 SSL 证书：

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

重启 Nginx：

```bash
sudo systemctl restart nginx
```


如果你正确配置了 DNS 解析（A 记录指向你的云服务器公网 IP），你可以直接在浏览器访问：

```
http://yourdomain.com
https://yourdomain.com
```



## 后台启动

如果你的服务器长期运行，可以创建 systemd 服务。


**1. 创建服务文件**

```bash
sudo nano /etc/systemd/system/frps.service
```

填入以下内容：

```ini
[Unit]
Description=FRP Server
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/frp/frps -c /usr/local/frp/frps.toml
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

**2. 让 frps 随开机启动**

```bash
sudo systemctl daemon-reload
sudo systemctl enable frps
sudo systemctl start frps

sudo systemctl status frps

sudo systemctl stop frps
```

> 同理，客户端则使用frpc