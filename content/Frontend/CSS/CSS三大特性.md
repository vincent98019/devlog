

## 继承性  

文本相关的属性普遍具有继承性，只需要给祖先标签设置，即可在后代所有标签中生效

- color
- font- 开头的
- list- 开头的
- text- 开头的
- line- 开头的

因为文字相关属性有继承性，所以通常会设置body标签的字号、颜色、行高等，这样就能当做整个网页的默认样式。

就近原则：在继承的情况下，选择器权重计算失效，而是“就近原则”。

```html
<div id="box1" class="box1">
    <div id="box2" class="box2">
        <div id="box3" class="box3">
            <p>我是文字</p>
        </div>
    </div>
</div>

#box1 #box2 #box3 { <!-- 继承 -->
    color: red;
}
p { <!-- 选中了 -->
    color: green;
}
```

```html
<div id="box1" class="box1">
    <div id="box2" class="box2">
        <div id="box3" class="box3">
            <p>我是文字</p>
        </div>
    </div>
</div>

#box1 #box2 {   <!-- 远 -->
    color: red;
}
.box1 .box3 {   <!-- 近 -->
    color: blue;
}
```

  
## 层叠性

CSS全名叫做“层叠式样式表”，层叠性是它很重要的性质，层叠性：多个选择器可以同时作用于同一个标签，效果叠加。

- 给同一个标签设置不同的样式 → 此时样式会层叠叠加 → 会共同作用在标签上
- 给同一个标签设置相同的样式 → 此时样式会层叠覆盖 → 最终写在最后的样式会生效

当样式冲突时，只有当选择器优先级相同时，才能通过层叠性判断结果

```css

<p id="para" class="spec">我是段落</p>

p {
  color: red;
}

.spec {
  font-style: italic;
}

#para {
  text-decoration: underline;
}
``` 


## 优先级

CSS有严密的处理冲突的规则，不同选择器具有不同的优先级，优先级高的选择器样式会覆盖优先级低选择器样式

> 继承 < 通配符选择器 < 标签选择器 < 类选择器 < id选择器 < 行内样式 < `!important`


### 权重叠加计算

如果是复合选择器，此时需要通过权重叠加计算方法，判断最终哪个选择器优先级最高会生效

> **权重叠加计算公式：（每一级之间不存在进位）**

![](./assets/CSS%E4%B8%89%E5%A4%A7%E7%89%B9%E6%80%A7/99033d3f04f35ddf79735576453d15c4_MD5.png)

比较规则：

1. 先比较第一级数字，如果比较出来了，之后的统统不看
2. 如果第一级数字相同，此时再去比较第二级数字，如果比较出来了，之后的统统不看
3. ……
4. 如果最终所有数字都相同，表示优先级相同，则比较层叠性

> 先判断选择器是否能直接选中标签，如果不能直接选中 → 是继承，优先级最低 → 直接pass

```html

<div id="box1" class="box1">
  <div id="box2" class="box2">
      <div id="box3" class="box3">
          <p>我是段落</p>
      </div>
  </div>
</div>
```

```css

#box1 #box2 p {     /* 2,0,1 */
  color: red;
}

#box1 div.box2 #box3 p {     /* 2,1,2 */
  color: green;
}

.box1 .box2 .box3 p {   /* 0,3,1 */
  color: blue;
}
```


## 提升优先级

如果需要将某个选择器的某条属性提升权重，可以在属性后面写`!important`，`!important`不能提升继承的优先级，只要是继承优先级最低。

```css
.spec {
  color: blue !important;
}
```

很多公司不允许使用`!important`，因为这会带来不经意的样式冲突

  

![](./assets/CSS%E4%B8%89%E5%A4%A7%E7%89%B9%E6%80%A7/325eb7f58ae0fb2d52c84b7d4baffdfe_MD5.png)

[CSS盒子模型](./CSS盒子模型.md)
