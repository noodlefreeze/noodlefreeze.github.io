---
title: "跳出 React 视角, 利用 Head 标签脚本实现暗黑模式切换"
date: 2025-07-24
author: "脑冻"
description: "在 React App 中, 设置暗黑模式的合理方式"
---

起初我用 `useEffect` 和 `useRef` 管理暗黑模式切换, 后来换成执行更早的 `useLayoutEffect`, 希望能缓解 React 首次渲染时的白屏跳黑屏问题. 

不过我始终没跳出 React 的框架去思考. 直到后来, 我才意识到, 其实完全可以在 `<head>` 标签中插入一段原生 `<script>`, 在 DOM 加载前设置好 `document.documentElement.classList.add('dark')`. 

```js
;(function () {
  var darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  var userPreferredTheme

  function setTheme(t) {
    window.__theme = t

    if (t === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (t === 'light') {
      document.documentElement.classList.remove('dark')
    }
  }

  try {
    userPreferredTheme = localStorage.getItem('theme')
  } catch (_) {}

  if (!userPreferredTheme) {
    userPreferredTheme = darkModeQuery.matches ? 'dark' : 'light'
  }

  setTheme(userPreferredTheme)

  darkModeQuery.addEventListener('change', function (e) {
    if (!userPreferredTheme) {
      setTheme(e.matches ? 'dark' : 'light')
    }
  })

  window.__setPreferTheme = function (t) {
    userPreferredTheme = t
    setTheme(t)

    try {
      localStorage.setItem('theme', t)
    } catch (_) {}
  }
})()
```