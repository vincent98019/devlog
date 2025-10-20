LongAdder 是并发大师 @author Doug Lea （大哥李）的作品，设计的非常精巧

LongAdder 类有几个关键域：
```java
// 累加单元数组, 懒惰初始化
transient volatile Cell[] cells;

// 基础值, 如果没有竞争, 则用 cas 累加这个域
transient volatile long base;

// 在 cells 创建或扩容时, 置为 1, 表示加锁 
transient volatile int cellsBusy;
```


cellsBusy原理（CAS锁）：
```java
// 不要用于实践！！！
public class LockCas {
    // 0表示未上锁，1表示已上锁
    private AtomicInteger state = new AtomicInteger(0);

    public void lock() {
        // 循环至获取锁
        while (true) {
            if (state.compareAndSet(0, 1)) {
                break;
            }
        }
    }

    public void unlock() {
        log.debug("unlock...");
        state.set(0);
    }
}
```


## 原理之伪共享

其中 Cell 即为累加单元

```java
// 防止缓存行伪共享
@sun.misc.Contended
static final class Cell {

    volatile long value;
    
    Cell(long x) { value = x; }
    
    // 最重要的方法, 用来 cas 方式进行累加, prev 表示旧值, next 表示新值
    final boolean cas(long prev, long next) {
        return UNSAFE.compareAndSwapLong(this, valueOffset, prev, next);
    }
    
    // 省略不重要代码
}
```


因为 CPU 与 内存的速度差异很大，需要靠预读数据至缓存来提升效率。

![](assets/JavaLongAdder%E5%8E%9F%E7%90%86/b0800fe0de8eeff2baf465e7818bb07f_MD5.jpeg)

| 从 cpu 到 | 大约需要的时钟周期                     |
| ------- | ----------------------------- |
| 寄存器     | 1 cycle (4GHz 的 CPU 约为0.25ns) |
| L1      | 3~4 cycle                     |
| L2      | 10~20 cycle                   |
| L3      | 40~45 cycle                   |
| 内存      | 120~240 cycle                 |


而缓存以缓存行为单位，每个缓存行对应着一块内存，一般是 64 byte（8 个 long）。

缓存的加入会造成数据副本的产生，即同一份数据会缓存在不同核心的缓存行中。

CPU 要保证数据的一致性，如果某个 CPU 核心更改了数据，其它 CPU 核心对应的整个缓存行必须失效。

![](assets/JavaLongAdder%E5%8E%9F%E7%90%86/0fa074bb15c77db5f4e35f98ad4cdaf4_MD5.jpeg)

因为 Cell 是数组形式，在内存中是连续存储的，一个 Cell 为 24 字节（16 字节的对象头和 8 字节的 value），因此缓存行可以存下 2 个的 Cell 对象。这样问题来了：

- `Core-0`要修改`Cell[0]`
- `Core-1`要修改`Cell[1]`

无论谁修改成功，都会导致对方 Core 的缓存行失效，比如 Core-0 中 `Cell[0]=6000, Cell[1]=8000`要累加`Cell[0]=6001, Cell[1]=8000`，这时会让 Core-1 的缓存行失效

`@sun.misc.Contended`用来解决这个问题，它的原理是在使用此注解的对象或字段的前后各增加 128 字节大小的padding，从而让 CPU 将对象预读至缓存时占用不同的缓存行，这样，不会造成对方缓存行的失效。

![](assets/JavaLongAdder%E5%8E%9F%E7%90%86/b0085f3e5237d4f0238deda998b0c871_MD5.jpeg)



## 累加

```java
public void add(long x) {

    // as 为累加单元数组
    // b 为基础值
    // x 为累加值
    Cell[] as; long b, v; int m; Cell a;
    // 进入 if 的两个条件
    // 1. as 有值, 表示已经发生过竞争, 进入 if
    // 2. cas 给 base 累加时失败了, 表示 base 发生了竞争, 进入 if
    if ((as = cells) != null || !casBase(b = base, b + x)) {
        // uncontended 表示 cell 没有竞争
        boolean uncontended = true;
        
        if (
            // as 还没有创建
            as == null || (m = as.length - 1) < 0 ||
            // 当前线程对应的 cell 还没有
            (a = as[getProbe() & m]) == null ||
            // cas 给当前线程的 cell 累加失败 uncontended=false
            // ( a 为当前线程的 cell )
            !(uncontended = a.cas(v = a.value, v + x))
        ) {
            // 进入 cell 数组创建、cell 创建的流程
            longAccumulate(x, null, uncontended);
        }
    }
}
```


![](assets/JavaLongAdder%E5%8E%9F%E7%90%86/ca54b48853c590481b1ba95f2984214e_MD5.jpeg)



### longAccumulate

```java
final void longAccumulate(long x, LongBinaryOperator fn, 
    boolean wasUncontended) {

    int h;
    // 当前线程还没有对应的 cell, 需要随机生成一个 h 值用来将当前线程绑定到 cell
    if ((h = getProbe()) == 0) {
        // 初始化 probe
        ThreadLocalRandom.current();
        // h 对应新的 probe 值, 用来对应 cell
        h = getProbe();
        wasUncontended = true;
    }

    // collide 为 true 表示需要扩容
    boolean collide = false;

    for (;;) {
        Cell[] as; Cell a; int n; long v;
        // 已经有了 cells 走下图2的流程 ---------------->
        if ((as = cells) != null && (n = as.length) > 0) {
            // 还没有 cell
            if ((a = as[(n - 1) & h]) == null) {
                // 为 cellsBusy 加锁, 创建 cell, cell 的初始累加值为 x
                // 成功则 break, 否则继续 continue 循环
                // 代码省略....
                collide = false;
            }
            // 有竞争, 改变线程对应的 cell 来重试 cas
            else if (!wasUncontended)
                wasUncontended = true;
            // cas 尝试累加, fn 配合 LongAccumulator 不为 null, 配合 LongAdder 为 null
            else if (a.cas(v = a.value, ((fn == null) ? v + x : fn.applyAsLong(v, x))))
                break;
            // 如果 cells 长度已经超过了最大长度, 或者已经扩容, 改变线程对应的 cell 来重试 cas
            else if (n >= NCPU || cells != as)
                collide = false;
            // 确保 collide 为 false 进入此分支, 就不会进入下面的 else if 进行扩容了
            else if (!collide)
                collide = true;
            // 加锁
            else if (cellsBusy == 0 && casCellsBusy()) {
                // 加锁成功, 扩容 走图3的流程 ------------------>
                continue;
            }
            // 改变线程对应的 cell
            h = advanceProbe(h);
        }

        // 还没有 cells, 尝试给 cellsBusy 加锁 走图1的流程 ------------------>
        else if (cellsBusy == 0 && cells == as && casCellsBusy()) {
            // 加锁成功, 初始化 cells, 最开始长度为 2, 并填充一个 cell
            // 成功则 break;
        }

        // 上两种情况失败, 尝试给 base 累加
        else if (casBase(v = base, ((fn == null) ? v + x : fn.applyAsLong(v, x))))
    break;

}

}
```

图1：
![](assets/JavaLongAdder%E5%8E%9F%E7%90%86/5cf6a4afbd54c68ac9e81ee15681334e_MD5.jpeg)


图2：
![](assets/JavaLongAdder%E5%8E%9F%E7%90%86/1d1c30ffaa820bed140979677ea98acd_MD5.jpeg)

图3：
![](assets/JavaLongAdder%E5%8E%9F%E7%90%86/c0a16a181d1aba3dfab80ae2915a10bb_MD5.jpeg)