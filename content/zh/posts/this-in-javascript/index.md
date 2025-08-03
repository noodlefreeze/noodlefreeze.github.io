---
title: "[for interviews] JavaScript 中的 this"
date: 2025-08-03
author: "脑冻"
description: "JavaScript 中的 this"
---

## 结论

`this` 的指向规则:

- 普通函数的 `this` 是在调用时动态决定的, 取决于函数被谁调用;
- 箭头函数的 `this` 是在定义时词法绑定的, 继承自定义时所在的外层作用域, 不会被调用方式改变

## 作用域形成的常见结构

- **函数**: JavaScript 传统的作用域单位, 函数内声明的变量局限于函数内部
- **代码块**: 用 `{}` 包裹的代码块
- **模块**: ES6 模块拥有独立的模块作用域
- **类**: `class` 声明形成的块级作用域

以前我一直认为对象字面量会形成自己的作用域, 但它只是当前作用域中的一个值

## 练习

### 判断 `this` 指向

```js
const obj = {
  name: 'Alice',
  regularFunc: function() {
    console.log(this.name);
  },
  arrowFunc: () => {
    console.log(this.name);
  }
};

obj.regularFunc(); // Alice, 函数被调用时, this 指向 obj
obj.arrowFunc(); // undefined, this 在定义时被指定为全局作用域
```

### 解释代码输出

```js
function greet() {
  console.log(this);
}

greet(); // undefined or window
greet.call({name: 'Bob'}); // {name: 'Bob'}
```

### 补全代码

```js
const person = {
  name: 'John',
  getName: function() {
    return this.name;
  }
};

const getName = /* 这里写代码 */;
// const getName = person.getName.bind(person)
console.log(getName()); // 输出 "John"
```
