
在 LINUX 中，每个执行的程序都称为一个进程。每一个进程都分配一个 ID 号(pid，进程号)。

## 显示系统执行的进程 PS

ps 命令是用来查看目前系统中，有哪些正在执行，以及它们执行的状况。可以不加任何参数。

- `-a`：显示当前终端的所有进程信息
- `-u`：以用户的格式显示进程信息
- `-x`：显示后台进程运行的参数
- `-e`：显示所有进程
- `-f`：全格式
- `ps –aux | grep xxx` ：比如看看有没有 sshd 服务
- `ps -ef`：以全格式显示当前所有的进程

参数说明：
- USER：用户名称
- UID：用户 ID
- PID：进程号
- PPID：父进程 ID
- %CPU：进程占用 CPU 的百分比
- %MEM：进程占用物理内存的百分比
- VSZ：进程占用的虚拟内存大小（单位：KB）
- RSS：进程占用的物理内存大小（单位：KB）
- TT：终端名称，缩写
- TTY：完整的终端名称
- STAT：进程状态，其中 S-睡眠，s-表示该进程是会话的先导进程，N-表示进程拥有比普通优先级更低的优先级，R-正在运行，D-短期等待，Z-僵死进程，T-被跟踪或者被停止等等
- STARTED：进程的启动时间
- TIME：CPU 时间，即进程使用 CPU 的总时间
- COMMAND：启动进程所用的命令和参数，如果过长会被截断显示
- C：CPU 用于计算执行优先级的因子。数值越大，表明进程是 CPU 密集型运算，执行优先级会降低；数值越小，表明进程是 I/O 密集型运算，执行优先级会提高
- STIME：进程启动的时间

![](assets/Linux%E8%BF%9B%E7%A8%8B%E7%AE%A1%E7%90%86/381d397e86c6fc873035c4ff11ca5b08_MD5.jpeg)



## 终止进程 kill 和 killall

若是某个进程执行一半需要停止时，或是已消了很大的系统资源时，此时可以考虑停止该进程。使用 kill 命令来完成此项任务。

- `kill [选项] 进程号`：通过进程号杀死/终止进程
    - `-9`：表示强迫进程立即停止
    - `15`：请求进程正常终止
- `killall 进程名称`：通过进程名称杀死进程，也支持通配符，这在系统因负载过大而变得很慢时很有用


## 查看进程树 pstree

- `pstree [选项]`：可以更加直观的看进程信息
    - `-p`：显示进程的 PID
    - `-u`：显示进程的所属用户


## 服务(service)管理

服务(service) 本质就是进程，但是是运行在后台的，通常都会监听某个端口，等待其它程序的请求，比如(mysqld，sshd，防火墙等)，因此又称为守护进程，是 Linux 中非常重要的知识点。

- `service 服务名 [start | stop | restart | reload | status]`

> 在 CentOS7.0 后 很多服务不再使用 service，而是 systemctl

service 指令管理的服务在 `/etc/init.d` 查看


使用 service 指令，查看，关闭，启动 nginx
```bash
service nginx status
service nginx stop
service nginx start
```


查看服务名：
- `setup`
- `ls -l /etc/init.d`：看 service 指令管理的服务



### 服务的运行级别 runlevel

Linux 系统有 7 种运行级别(runlevel)：常用的是级别 3 和 5

- 运行级别 0：系统停机状态，系统默认运行级别不能设为 0，否则不能正常启动
- 运行级别 1：单用户工作状态，root 权限，用于系统维护，禁止远程登陆
- 运行级别 2：多用户状态(没有 NFS)，不支持网络
- **运行级别 3：完全的多用户状态(有 NFS)，无界面，登陆后进入控制台命令行模式**
- 运行级别 4：系统未使用，保留
- **运行级别 5：X11 控制台，登陆后进入图形 GUI 模式**
- 运行级别 6：系统正常关闭并重启，默认运行级别不能设为 6，否则不能正常启动

开机的流程：

![](assets/Linux%E8%BF%9B%E7%A8%8B%E7%AE%A1%E7%90%86/eb8e84831568657990756fca97b0d379_MD5.jpeg)


### chkconfig 指令

通过 chkconfig 命令可以给服务的各个运行级别设置自 启动/关闭

chkconfig 指令管理的服务在 /etc/init.d 查看

> Centos7.0 后，很多服务使用 systemctl 管理
> 
> chkconfig 重新设置服务后自启动或关闭，需要重启机器 reboot 生效

- `chkconfig --list [| grep xxx]`
- `chkconfig 服务名 --list`
- `chkconfig --level 5 服务名 on/off`


## systemctl 管理指令

基本语法：`systemctl [start | stop | restart | status] 服务名`

systemctl 指令管理的服务在 `/usr/lib/systemd/system` 查看

### systemctl 设置服务的自启动状态

- `systemctl list-unit-files [ | grep 服务名]`：查看服务开机启动状态，grep 可以进行过滤
- `systemctl enable 服务名`：设置服务开机启动
- `systemctl disable 服务名`：关闭服务开机启动
- `systemctl is-enabled 服务名`：查询某个服务是否是自启动的


## 防火墙 firewall

- 打开端口：`firewall-cmd --permanent --add-port=端口号/协议`
- 关闭端口：`firewall-cmd --permanent --remove-port=端口号/协议`
- 重新载入，才能生效：`firewall-cmd --reload`
- 查询端口是否开放：`firewall-cmd --query-port=端口/协议`


## 动态监控进程

top 与 ps 命令很相似。它们都用来显示正在执行的进程。Top 与 ps 最大的不同之处，在于 top 在执行一段时间可以更新正在运行的的进程。

- `top [选项]`
    - `-d 秒数`：指定top命令每隔几秒更新，默认是3秒
    - `-i`：使top不显示任何闲置或僵死进程
    - `-p`：通过指定监控进程id来监控某个进程的状态


交互操作：
- `P`：以CPU使用率排序，默认是此选项
- `M`：以内存的使用率排序
- `N`：以PID排序
- `q`：退出top
- `u`：查询某个用户名的进程
- `k`：结束某个进程


## 监控网络状态

- `netstat [选项]`：查看系统网络情况
    - `-an`：按一定顺序排列输出
    - `-p`：显示哪个进程在调用

查看服务名为 sshd 的服务的信息：
```bash
netstat -anp | grep sshd
```


## 检测主机连接命令 ping

是一种网络检测工具，它主要是用检测远程主机是否正常，或是两部主机间的网线或网卡故障。

- `ping 对方ip地址`