
## 文本缩进

`text-indent`属性定义首行文本内容之前的缩进量，缩进两个字符应该写作 `text-indent: 2em;` 
em表示字符宽度。

- 数字+px
- 数字+em（推荐：1em = 当前标签的font-size的大小）


## 水平对齐方式

`text-align`定义对齐方式。如果需要让文本水平居中，`text-align`属性给文本所在标签（文本的父元素）设置。

- `left`：左对齐
- `right`：右对齐
- `center`：居中对齐，可以使文本、span标签、a标签、input标签、img标签居中对齐，需要给这些元素的父元素设置。
- `justify`：自动改变字间距，两端对齐

![](./assets/CSS%E6%96%87%E6%9C%AC%E6%A0%B7%E5%BC%8F/df8bdfb208de396081b83587149d3bb7_MD5.jpg)


## 倾斜

`font-style`属性设置字体的倾斜。

| 示例 | 意义 |
|:----|:----|
| `font-style: normal;` | 取消倾斜，比如可以把天生倾斜的i、 em等标签设置为不倾斜 |
| `font-style: italic;` | 设置为倾斜字体（常用） |
| `font-style: oblique;` | 设置为倾斜字体（用常规字体模拟， 不常用） |


## 下划线、删除线

`text-decoration`属性用于设置文本的修饰线外观的（下划线、删除线）

| 示例                               | 意义    |
| :------------------------------- | :---- |
| `text-decoration: none;`         | 没有修饰线 |
| `text-decoration: underline;`    | 下划线   |
| `text-decoration: overline;`     | 上划线   |
| `text-decoration: line-through;` | 删除线   |

## 行高

`line-height`属性用于定义行高，单位可以是以`px`为单位的数值，也可以是没有单位的数值，表示字号的倍数，这是最推荐的写法，也可以是百分数，表示字号的倍数。

![](./assets/CSS%E6%96%87%E6%9C%AC%E6%A0%B7%E5%BC%8F/d897a14e3de766eeb1ded3777803b1d2_MD5.png)

```css
line-height: 30px;
line-height: 1.5;
line-height: 150%;
```

> 让单行文本垂直居中可以设置line-height : 文字父元素高度
> 
> 网页精准布局时，会设置line-height : 1可以取消上下间距


## 字体属性连写

`font` 属性可以用来作为 `font-style`，`font-weight`，`font-size`，`line-height`和`font-family`属性的合写。

可以同时设置样式，只能省略前两个，如果省略了相当于设置了默认值

```css
font (复合属性)
font: style weight size family;
//    倾斜  加粗 大小/行高 字体
font: 20px/1.5 Arial, "微软雅黑";
font: italic bold 20px/1.5 Arial, "微软雅黑";
```


如果需要同时设置单独和连写形式：

- 要么把单独的样式写在连写的下面
- 要么把单独的样式写在连写的里面


## 文字阴影

给文字添加阴影效果，吸引用户注意

![](./assets/CSS%E6%96%87%E6%9C%AC%E6%A0%B7%E5%BC%8F/0959c03554964f1436088bc682b2e554_MD5.png)

  

属性名：`text-shadow`

| 参数       | 作用            |
| -------- | ------------- |
| h-shadow | 必须，水平偏移量，允许负值 |
| v-shadow | 必须，垂直偏移量，允许负值 |
| blur     | 可选，模糊度        |
| color    | 可选，阴影颜色       |

阴影可以叠加设置，每组阴影取值之间以逗号隔开。


## 文字溢出显示省略号

`text-overflow: ellipsis; `


## 文字不换行

`white-space: nowrap;`

[CSS三大特性](./CSS三大特性.md)


