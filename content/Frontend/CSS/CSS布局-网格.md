
网格布局是一种二维布局模型，允许开发者通过定义行 （rows）和列 （columns） 来精确控制网页元素的位置和尺寸。还可以实现响应式设计。


容器（父盒子）设置 `display: grid;`（块级）或者 `dlisplay: inline-grid;`（行内）

与弹性盒子不同的是，在定义网格后，网页并不会马上发生变化。因为 `display: grid` 的声明只创建了一个只有一列的网格。


## 绘制网格

- `grid-template-columns`： 定义网格中的列
- `grid-template-rows`： 定义网格中的行

> 有几个属性值代表创建几列/行，长度单位比如 100px

```css
grid-template-columns: 200px 200px 200px;
/* 定义三列，每列宽度为 200px */

grid-template-rows: 200px 200px 200px;
/* 定义三行，每行高度为 200px */
```


| 属性值        | 说明                                                  | 示例                                                        | 应用场景          |
| ---------- | --------------------------------------------------- | --------------------------------------------------------- | ------------- |
| 固定长度       | 使用px、em 等固定单位定义列宽                                   | `grid-template-columns: 100px 200px;`                     | 需要精确控制列宽的固定布局 |
| 百分比        | 按容器宽度百分比分配列宽                                        | `grid-template-columns: 30% 70%;`                         | 响应式布局中按比例划分列  |
| fr 单位      | 分配轨道剩余空间的比例（1fr 表示一份，总和为容器剩余空间） fr是fraction 缩写，意思分数 | `grid-template-columns: 1fr 2fr;`                         | 需要自适应比例分配的布局  |
| auto       | 列宽由内容白动撑开                                           | `grid-template-columns: auto 100px;`                      | 内容宽度不确定时的灵活布局 |
| repeat()函数 | 简化重复的列定义                                            | `grid-template-columns: repeat(3, 1fг);`（等效于 1fr 1fr 1fr） | 多列等宽布局        |
| minmax()函数 | 定义列宽的最小值和最大值                                        | `grid-template-columns: minmax(100px, 1fг);`              | 响应式布局中限制列宽范围  |



## 对齐方式

与[CSS布局-弹性盒子](./CSS布局-弹性盒子.md)的[主轴对齐方式](./CSS布局-弹性盒子.md#主轴对齐方式)和[交叉轴对齐方式（多行）](./CSS布局-弹性盒子.md#交叉轴对齐方式（多行）)一样


## 网格间距

与[CSS布局-弹性盒子](./CSS布局-弹性盒子.md)的[间距](./CSS布局-弹性盒子.md#间距)一样

gap是简写形式也可以分开写

```css
column-gap: 30px;
row-gap: 20px;
```


## repeat()函数

语法：`repeat(次数，轨道尺寸)` 或 `repeat(自动填充，轨道尺寸)`

```css
grid-template-columns: repeat(3, 1fг);
```


自动填充：适用于响应式布局中“列数随容器宽度变化”的场景。

- `auto-fill`：尽可能多地创建列。
- `auto-fit`： 尽可能拉伸列填满容器（会合并空白，列宽不小于 minmax的最小值）

![](./assets/CSS%E5%B8%83%E5%B1%80-%E7%BD%91%E6%A0%BC/92db098fd3e3c832c4661d4a0d436873_MD5.jpg)

## minmax()函数

语法：`minmax(最小值，最大值)`

```css
/* 列自动选择，宽度最小为210px，最大为1fr */
grid-template-columns: repeat(auto-fill, minmax(210px, 1fr))
```


## 网格线

网格线会在使用网格布局时被创建。

使用场景：实现元素跨越多个网格单元。

![](./assets/CSS%E5%B8%83%E5%B1%80-%E7%BD%91%E6%A0%BC/4fd62befb3be2b5798b1db91df825b62_MD5.jpg)


实现语法1：

- 跨列：`grid-column: 开始线编号/结束线编号`
- 跨行：`grid-row: 开始线编号/结束线编号`

```css
background-color: pink；
grid-column: 1/3; /* 1/3 表示从第1列到第3列 */
grid-row: 1/3; /* 1/3 表示从第1行到第3行 */
```


实现语法2：

- 跨列：`grid-column: 开始线编号 /span 跨单元格数量`
- 跨行：`grid-row: 开始线编号 / span 跨单元格数量`

```css
background-color: pink;
grid-column: 1 / span 2; /* 从1线开始，跨2个单元格 */
grid-row: 1 / span 2;  /* 从1线开始，跨2个单元格 */
```


