
页面中的每一个标签，都可看做是一个 “盒子”，通过盒子的视角更方便的进行布局。


## 宽度和高度

CSS 中规定每个盒子分别由：内容区域（content）、内边距区域（padding）、边框区域（border）、外边距区域（margin）构成，这就是盒子模型。

![](./assets/CSS%E7%9B%92%E5%AD%90%E6%A8%A1%E5%9E%8B/2e7505723d0a8cd9d4f314e7dc32e332_MD5.png)

- 盒子的总宽度 = width + 左右padding + 左右border
- 盒子的总高度 = height + 上下padding + 上下border

![](./assets/CSS%E7%9B%92%E5%AD%90%E6%A8%A1%E5%9E%8B/5b8002c6df5430b2b168555676a63a13_MD5.png)



### width属性

width属性表示盒子内容的宽度，width属性的单位通常是px，移动端开发也会涉及百分数、rem等单位，当块级元素（div、h系列、li等）没有设置width属性时，它将自动撑满，但这并不意味着width可以继承。

### height属性

height属性表示盒子内容的高度，height属性的单位通常是px，移动端开发也会涉及百分数、rem等单位，盒子的height属性如果不设置，它将自动被其内容撑开，如果没有内容，则height默认是0。

![](./assets/CSS%E7%9B%92%E5%AD%90%E6%A8%A1%E5%9E%8B/70c56ec1a707f3c56980c202ff558373_MD5.png)

## 边框

给设置边框粗细、边框样式、边框颜色效果。

| 作用   | 属性名             | 属性值                             |
| ---- | --------------- | ------------------------------- |
| 边框粗细 | `border-width`  | 数字+px                           |
| 边框样式 | `border-style`  | 实线`solid`、虚线`dashed`、点线`dotted` |
| 边框颜色 | `border-color`  | 颜色取值                            |

**连写形式**

```css
border : 10px solid red;
```
  

**单方向设置**

给盒子的某个方向单独设置边框，`border - 方位名词` 

```css
border-top：10px dashed yellow;
```


### 边框圆角

让盒子四个角变得圆润，增加页面细节，提升用户体验

- 属性名：`border-radius`
- 常见取值：数字+px 、百分比


**圆角边框设置不同的角**

```css
border-radius: 左上角 右上角 右下角 左下角；
```



![](./assets/CSS%E7%9B%92%E5%AD%90%E6%A8%A1%E5%9E%8B/ec2e0262d9ffbc9b69db4c39d8b2c7ef_MD5.jpg)

> 从左上角开始赋值，然后顺时针赋值，没有赋值的看对角


### 边框合并

让相邻表格边框进行合并，得到细线边框效果

代码：`border-collapse：collapse；`


![](./assets/CSS%E7%9B%92%E5%AD%90%E6%A8%A1%E5%9E%8B/a2998c0b947a1fbac18bf31cd6903df1_MD5.png)



## 内边距 padding

padding是盒子的内边距，四个方向的，可以分别用方位属性进行设置。

padding属性如果用四个数值以空格隔开进行设置，分别表 示上、右、下、左的padding。

```css
padding: 10px 20px 30px 40px;
/*      上  右  下    左  */

padding: 10px 20px 30px;
/*        上  左右  下    */

padding: 10px 20px;
/*       上下 左右  */

padding: 10px;
/*    上下左右    */
```

如果子盒子没有设置宽度，此时宽度默认是父盒子的宽度，此时给子盒子设置左右的padding或者左右的border，此时不会撑大子盒子。但是内容的宽度会被缩小。

  

## 外边距 margin

margin是盒子的外边距，即盒子和其他盒子之间的距离。

![](./assets/CSS%E7%9B%92%E5%AD%90%E6%A8%A1%E5%9E%8B/88218bf0aaf9f498031a9a9c6619e05b_MD5.png)

margin也有四个方向。

**竖直方向的margin有塌陷现象**：小的margin会塌陷到大的 margin中，从而margin不叠加，只以大值为准

![](./assets/CSS%E7%9B%92%E5%AD%90%E6%A8%A1%E5%9E%8B/ec0a753247334a927039b9b8a3fe977d_MD5.jpg)

一些元素（比如body、ul、p等）都有默认的margin，在开始制作网页的时候，要将他们清除

```css
/* 通配符选择器 表示选择所有元素 */
* {
   margin: 0; padding: 0;
}

/* 通配符有效率问题 应该使用并集选择器 */
body, ul, p {
   margin: 0; padding: 0;
}
```

给行内元素设置margin和padding时，垂直方向的margin和padding布局中无效。


**外边距塌陷**：

区块元素上下外边距会出现塌陷情况。

- 嵌套关系(父子）的区块元素。
- 给子盒子设置上下外边距会让父盒子塌陷移动。

![](./assets/CSS%E7%9B%92%E5%AD%90%E6%A8%A1%E5%9E%8B/7fb310362b8ea6422309825db8181b0c_MD5.jpg)

解决方案：

1. 给父盒子添加上边框。（父盒子本身有边框则不会出现问题）
2. 给父盒子添加上内边距。（同理）
3. 给父盒子添加： `overflow: hidden;` 属性


## box-sizing

| 属性值           | 描述                                                                             |
| ------------- | ------------------------------------------------------------------------------ |
| `content-box` | 默认值。元素的 width 和 height 仅包含内容区域，不包含 padding 和 border。理解： `width = 内容的宽度`        |
| `border-box`  | 元素的 width 和 height 包含内容、padding和 border。理解： `width = border + padding + 内容的宽度` |

将盒子添加了`box-sizing: border-box;`之后，盒子的`width`、`height` 数字就表示盒子实际占有的宽高（不含margin）了，即padding、border变为“内缩”的，不再“外扩”。

```css
.box {
   box-sizing: border-box; width: 200px;
   height: 200px;
   border: 10px solid #000; padding: 10px;
}
```

![](./assets/CSS%E7%9B%92%E5%AD%90%E6%A8%A1%E5%9E%8B/9f7e05162ed762afb0d4002f92bf6911_MD5.png)

> `box-sizing`属性大量应用于移动网页制作中，因为它结合百分比布局、弹性布局等非常好用，在PC页面开发中使用较少，兼容到IE9。



[CSS盒子背景](./CSS盒子背景.md)