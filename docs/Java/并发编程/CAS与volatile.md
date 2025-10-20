保证 `account.withdraw` 取款方法的线程安全：

方法内会启动 1000 个线程，每个线程做 -10 元 的操作，如果初始余额为 10000 那么正确的结果应当是 0。

线程不安全实现：

```java
public void withdraw(Integer amount) {
    balance -= amount;
}
```

对应的字节码：

```java
ALOAD 0 // <- this
ALOAD 0
GETFIELD cn/itcast/AccountUnsafe.balance : Ljava/lang/Integer; // <- this.balance
INVOKEVIRTUAL java/lang/Integer.intValue ()I // 拆箱
ALOAD 1 // <- amount
INVOKEVIRTUAL java/lang/Integer.intValue ()I // 拆箱
ISUB // 减法
INVOKESTATIC java/lang/Integer.valueOf (I)Ljava/lang/Integer; // 结果装箱
PUTFIELD cn/itcast/AccountUnsafe.balance : Ljava/lang/Integer; // -> this.balance
```

> 当多个线程同时执行时，会出现指令交错。

解决思路——锁：
```java
public synchronized void withdraw(Integer amount) {
    balance -= amount;
}
```

解决思路——无锁：
```java
public void withdraw(Integer amount) {
    // 需要不断尝试，直到成功为止
    while (true) {
        int prev = balance.get();  // 比如拿到了旧值 1000
        int next = prev - amount;  // 在这个基础上 1000-10 = 990
        
        /*
        compareAndSet 正是做这个检查，在 set 前，先比较 prev 与当前值
            - 不一致了，next 作废，返回 false 表示失败
        比如，别的线程已经做了减法，当前值已经被减成了 990
        那么本线程的这次 990 就作废了，进入 while 下次循环重试
            - 一致，以 next 设置为新值，返回 true 表示成功
        */
        if (balance.compareAndSet(prev, next)) {
            break;
        }
    }
    // 可以简化为下面的方法
    // balance.addAndGet(-1 * amount);
}
```


其中的关键是 compareAndSet，它的简称就是 CAS （也有 Compare And Swap 的说法），它必须是原子操作。

![](assets/CAS%E4%B8%8Evolatile/1e1dea030e4d1527fa2d745e112106e4_MD5.jpeg)

> 其实 CAS 的底层是 lock cmpxchg 指令（X86 架构），在单核 CPU 和多核 CPU 下都能够保证【比较-交换】的原子性。
> 
> 在多核状态下，某个核执行到带 lock 的指令时，CPU 会让总线锁住，当这个核把此指令执行完毕，再开启总线。这个过程中不会被线程的调度机制所打断，保证了多个线程对内存操作的准确性，是原子的。


## volatile

获取共享变量时，为了保证该变量的可见性，需要使用 volatile 修饰。
它可以用来修饰成员变量和静态成员变量，他可以避免线程从自己的工作缓存中查找变量的值，必须到主存中获取它的值，线程操作 volatile 变量都是直接操作主存。即一个线程对 volatile 变量的修改，对另一个线程可见。

> volatile 仅仅保证了共享变量的可见性，让其它线程能够看到最新值，但不能解决指令交错问题（不能保证原子性）

**CAS 必须借助 volatile 才能读取到共享变量的最新值来实现【比较并交换】的效果。**


## 无锁效率高

无锁情况下，即使重试失败，线程始终在高速运行，没有停歇，而 synchronized 会让线程在没有获得锁的时候，发生上下文切换，进入阻塞。

> 打个比喻：线程就好像高速跑道上的赛车，高速运行时，速度超快，一旦发生上下文切换，就好比赛车要减速、熄火，等被唤醒又得重新打火、启动、加速... 恢复到高速运行，代价比较大

但无锁情况下，因为线程要保持运行，需要额外 CPU 的支持，CPU 在这里就好比高速跑道，没有额外的跑道，线程想高速运行也无从谈起，虽然不会进入阻塞，但由于没有分到时间片，仍然会进入可运行状态，还是会导致上下文切换。


## CAS 的特点

结合 CAS 和 volatile 可以实现无锁并发，适用于线程数少、多核 CPU 的场景下。

**CAS 是基于乐观锁的思想**：最乐观的估计，不怕别的线程来修改共享变量，就算改了也没关系，我吃亏点再重试呗。

**synchronized 是基于悲观锁的思想**：最悲观的估计，得防着其它线程来修改共享变量，我上了锁你们都别想改，我改完了解开锁，你们才有机会。

CAS 体现的是无锁并发、无阻塞并发，请仔细体会这两句话的意思
1. 因为没有使用 synchronized，所以线程不会陷入阻塞，这是效率提升的因素之一
2. 但如果竞争激烈，可以想到重试必然频繁发生，反而效率会受影响

