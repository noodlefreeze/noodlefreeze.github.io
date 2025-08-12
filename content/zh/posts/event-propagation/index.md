---
title: "事件委托、事件捕获与事件冒泡"
date: 2025-08-12
author: "脑冻"
description: "事件委托的优势、事件捕获与冒泡的详细流程，以及事件传播的阻止方法"
---

## 原理解释

### 事件委托

将目标元素的事件注册在父元素上, 而不是直接绑定在每个子元素上

#### 优势

- 减少内存消耗, 因为不需要给每个子元素都绑定事件监听器
- 动态添加的子元素无需重新绑定事件, 事件委托仍然生效
- 便于统一管理事件逻辑

### 事件捕获与事件冒泡

事件捕获(capturing)与事件冒泡(bubbling)这两个阶段加上目标本身的处理过程, 合起来叫事件传播机制(event propagation)

当事件被触发时, 浏览器会创建一个对应的事件对象

浏览器处理事件的过程可以分为三个阶段:

1. 捕获阶段

    事件对象从祖先元素沿着 DOM 树向下传递, 触发沿途元素上以捕获方式注册的事件监听器, 直到达到目标元素的父节点

2. 目标阶段

    事件到达目标元素本身, 触发目标元素上以捕获和冒泡方式注册的事件监听器

3. 冒泡阶段

    事件对象从目标元素开始, 沿着 DOM 树向上传递, 触发沿途元素上以冒泡方式注册的事件监听器

### 禁止事件传播与默认行为

- 监听器第三个参数 `caption` 控制事件在哪个阶段触发:

```js
element.addEventListener('click', handler, { capture: true })  // 捕获阶段触发
element.addEventListener('click', handler, { capture: false }) // 冒泡阶段触发（默认）
```

- 阻止事件继续传播(阻止捕获和冒泡):

```js
event.stopPropagation()
```

- 阻止事件的默认行为:

```js
event.preventDefault()
```

## 事件委托机制示例

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="gbaGyNB" data-pen-title="Untitled" data-user="noodlefreeze" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/noodlefreeze/pen/gbaGyNB">
  Untitled</a> by 脑冻 (<a href="https://codepen.io/noodlefreeze">@noodlefreeze</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>