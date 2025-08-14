---
title: "浏览器扩展跨源传输大体积文件的实用方案"
date: 2025-08-14
author: "脑冻"
description: "浏览器扩展跨源传输大文件与二进制数据的高效方案"
---

## 背景

在开发一款[浏览器扩展](https://github.com/noodlefreeze/yooloop)时, 我需要将 Content Script 中录制的音频数据存储到扩展域的 IndexedDB 中, 并在 Side Panel 中展示. 最直观的做法是使用 `runtime.sendMessage` 将数据发送给 Background Script, 但遇到了几个问题:

1. 数据类型限制: `Blob` 和 `ArrayBuffer` 无法直接通过 `sendMessage` 传输, 需要先转换为 `Uint8Array`
2. 性能问题: 对于大体积数据, 转换与传输会显著增加内存占用和运算时间, 导致 UI 卡顿
3. 大小限制: `sendMessage` 对单次传输的数据量有限制, 需要将大文件拆分成多块进行多次传输

因此, 需要寻找一种即能支持跨源通信, 又能高效传输大文件的方法

## 思考

### 大文件传输

最好的方法应该是利用 `postMessage` 的 `transfer` 能力, 通过转移数据所有权的方式实现零拷贝传输

### 跨源通信

最终方案是：利用扩展域 iframe 作为桥接层, 结合 postMessage transfer, 实现零拷贝的跨源大文件传输  

- **iframe 的作用**  
  - 源（origin）可设为扩展域, 因此可以直接访问扩展 API 和 IndexedDB  
  - 既能与 Content Script 通过 `postMessage` 通信, 也能与 Side Panel / Background 通过 `runtime` API 通信  
- **流程概览**  
  1. Content Script 发送 `runtime.sendMessage` 请求给 Background  
  2. Background 在页面中注入扩展域的 iframe(bridge-frame.ts)
  3. Content Script 将大数据通过 `postMessage`(带 `transfer`)传给 iframe  
  4. iframe 直接写入扩展域 IndexedDB, 并与 Side Panel 通信

最后的实现过程大致如图:

![illustration](illustration.svg)

## 实现

### 1. Background 注入 iframe
在 Background Script 中注入生成 `iframe` 的代码

```ts
// background.ts
export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const id = sender.tab?.id
    const url = sender.tab?.url

    if (id && url && message.action === actionKeys.injectBridgeFrame) {
      Promise.all([
        browser.scripting.executeScript({
          target: { tabId: id },
          files: ['/bridge-iframe.js'],
          world: 'ISOLATED',
        }),
      ]).then(() => {
        sendResponse({ success: true, tabId: id, origin: new URL(url).origin })
      })
    } else {
      Promise.resolve().then(() => {
        sendResponse({ success: false })
      })
    }

    return true
  })
})
```

### 2. 注入脚本创建 iframe

```ts
// bridge-iframe.ts
export default defineUnlistedScript(() => {
  const wrapper = document.createElement('div')
  wrapper.style.setProperty('width', '0')
  wrapper.style.setProperty('height', '0')

  const iframe = document.createElement('iframe')
  iframe.style.setProperty('width', '0')
  iframe.style.setProperty('height', '0')
  iframe.src = browser.runtime.getURL('/iframe.html')
  iframe.id = bridgeIframeId

  wrapper.appendChild(iframe)
  document.body.appendChild(iframe)
})
```

### 3. 扩展域 iframe 页面

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Iframe</title>
    <meta name="manifest.type" content="browser_action" />
</head>

<body>
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
</body>

</html>
```

### 4. Content Script → iframe 传输音频

```ts
new Blob(audioChunks, { type: audioType }).arrayBuffer().then((buffer) => {
if (!appMetadata.bridgeIfr?.contentWindow) return

const payload: {
    audioType: string
    title: string
    startMs: number
    vid: string
    audio: ArrayBuffer
} = {
    audioType,
    title: document.title,
    startMs: appMetadata.videoEl.currentTime * 1000,
    vid: getSearchParam('v') as string,
    audio: buffer,
}
const message = {
    payload,
    source: messageKeys.contentSource,
    action: actionKeys.addShadowing,
}

appMetadata.bridgeIfr.contentWindow.postMessage(message, new URL(appMetadata.bridgeIfr.src).origin, [buffer])
})
```

最终完整代码可以在[这里查看](https://github.com/noodlefreeze/yooloop/tree/main)
