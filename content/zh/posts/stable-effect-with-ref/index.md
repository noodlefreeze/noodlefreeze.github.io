---
title: "React(二): 避免副作用函数反复创建的小技巧"
date: 2025-07-30
author: "脑冻"
description: "通过 useRef 优化副作用函数注册频率，提升 React 应用性能"
---

在 React 中, 使用 `useEffect` 注册事件或副作用函数时, 如果依赖发生变化, 就会导致副作用函数被反复销毁与重建. 在一些场景中, 可以通过 `useRef` 将副作用函数的引用保持不变, 从而减少不必要的注册/解绑开销.

## 示例对比

### 普通方式：函数随着 state 变化不断注册

```tsx
import { useEffect, useState } from "react"

function ComponentA() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const handler = () => {
      console.log("count changed:", count)
    }

    window.addEventListener("resize", handler)

    return () => {
      window.removeEventListener("resize", handler)
    }
  }, [count])

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}
```

在这个例子中, 每次点击按钮后 `count` 改变, 都会重新注册 `resize` 事件. 这在轻量级组件中问题不大, 但如果副作用更重, 就可能引发性能问题.

### 优化方式：用 `useRef` 保持处理函数引用稳定，只注册一次

```tsx
import { useEffect, useRef, useState } from "react"

function ComponentB() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  useEffect(() => {
    countRef.current = count
  }, [count])

  useEffect(() => {
    const handler = () => {
      console.log("count changed:", countRef.current)
    }

    window.addEventListener("resize", handler)

    return () => {
      window.removeEventListener("resize", handler)
    }
  }, []) // 只注册一次

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}
```

通过将 `count` 放入 `ref`, 并仅在 `resize` 时读取当前值, 可以避免副作用函数随着 `count` 的变化而反复注册的开销.

也可以不使用 `ref` 存储, 将变量的作用域提升, 脱离 React 组件, 来实现相同的功能.
