---
title: "CSS 边框渐变"
date: 2025-07-23
author : "脑冻"
description: "CSS边框渐变的实现方法和动画效果"
css: ["border-gradient.css"]
---

最近在业务开发中，遇到一个需求：实现一个有渐变边框且边框可以旋转的盒子.

我一开始的思路是比较常规的 -- 用两个盒子叠加. 下面的盒子设置渐变背景, 加上 ```rotate``` 动画; 上面的盒子放内容, 尺寸比下面的小一圈(也就是边框的宽度). 这个方法理论上可行, 但实际效果并不好, 还需要手动计算宽度与高度.

后来我去 [CSS-Tricks](https://css-tricks.com/) 搜了搜, 确实有很多实现方式, 但写法都挺绕, 不太想搞.

于是转头去 MDN 查了一下 ```background``` 属性, 想看看有没有办法用它实现叠加的效果, 结果发现 [background-clip](https://developer.mozilla.org/en-US/docs/Web/CSS/background#visual-box) 支持 ```padding-box``` 和 ```border-box```.

利用这个特性, 事情就简单多了. 只需要一个元素就能搞定, 渐变背景设在 ```border-box```, 中间的内容区域由 ```padding-box``` 控制.

<div class='gradient-border'></div>

```css
.gradient-border {
  border: 2px solid transparent;
  border-radius: 12px;
  height: 3rem;
  width: 70%;
  margin: auto;

  background: linear-gradient(white, white) padding-box, linear-gradient(var(--angle), #e18728, #326eef) border-box;
  animation: 4s rotate linear infinite;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
```
