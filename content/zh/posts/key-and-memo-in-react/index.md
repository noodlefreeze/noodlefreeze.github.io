---
title: "React(一): key 与 memo 到底做了什么?"
date: 2025-07-29
author: "脑冻"
description: "React 性能优化中, key 与 memo 的区别"
---

整理之前写的笔记, 这份应该被保留下来.

## 结论先行

- `key`: 帮助 React 更高效的复用 DOM 元素, 避免节点被销毁重建.
- `memo`: 避免组件在父组件更新时重复执行函数和生成虚拟 DOM.

## React 渲染流程

先看一下 React 在更新状态时的大致流程:

- 执行组件(组件即函数)
- 生成新的虚拟 DOM
- 对比新旧虚拟 DOM
- 根据差异更新真是 DOM

## `key` 的作用: 辅助 diff 算法复用 DOM

当我们使用 `.map()` 渲染一个列表时, React 需要判断哪些元素可以复用, 哪些需要新增或移除.

`key` 给每个列表项一个唯一标识, 帮助 React 更准确的匹配“新旧虚拟 DOM 节点”, 从而避免误删或重建 DOM 元素.

如果没有 `key` 或使用不稳定的值(`Math.random()`), React 可能会误认为节点改变了, 导致 DOM 被重新创建.

## `memo` 的作用: 阻止组件函数重复执行

React 默认会在父组件更新时, 重新执行子组件函数, 即使 props 没变.

使用 `memo(Component, areEqual)` 包裹组件后, 可以手动控制是否跳过更新:

```tsx
const MyComponent = React.memo(
  ({ value }) => {
    return <div>{value}</div>;
  },
  (prevProps, nextProps) => prevProps.value === nextProps.value
);
```

只有当 `areEqual` 返回 `false` 时, 才会执行函数和生成虚拟 DOM. 否则会跳过这一步, 直接复用旧的虚拟 DOM 和真实 DOM.

## 示例

> 使用 React Devtools 观察组件是否重新渲染

### 未使用 `memo`

```tsx
import { memo, useState } from 'react';

function App() {
  const [items, setItems] = useState([1, 2, 3])

  function handleClick() {
    const newItems = [...items];

    [newItems[0], newItems[1]] = [newItems[1], newItems[0]];
    setItems(newItems)
  }

  return (
    <section>
      <button onClick={handleClick}>Refresh</button>
      <Parent items={items} />
    </section>
  )
}

function Parent(props) {
  const { items } = props

  return (
    <section>
      <div>
        <p>with key</p>
        <div>
          {items.map((item) => (
            <Child key={item} item={item} />
          ))}
        </div>
      </div>
      <div>
        <p>with key and memo</p>
        {items.map((item) => (
          <MemoChild key={item} item={item} />
        ))}
      </div>
    </section>
  )
}

function Child(props) {
  const { item } = props

  return <span>{item}</span>
}

const MemoChild = memo(Child)

export default App

```