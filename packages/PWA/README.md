
### 易于安装

可安装网站需要满足以下条件：
- 一份网页清单
- 网站的协议必须是安全的（即使用HTTPS协议）
- 一个在设备上代表应用的图标
- 一个注册好的`Service Worker`，可以让应用离线工作

#### 网页清单（Manifest）
- 列举网站的所有信息；
- 位于网页应用的根目录；
- 使用方式：在<head>中添加以下代码

```javascript
<link rel="manifest" href="rainbowpwa.webmanifest">
```
文件内容
```json
{
  "name": "rainbow Pregressive Web App",
  "short_name": "rainbow",
  "description": "Progressive Web App that record the rainbow app created",
  "icons": [
      {
          "src": "icons/icon-32.png",
          "sizes": "32x32",
          "type": "image/png"
      },
      // ...
      {
          "src": "icons/icon-512.png",
          "sizes": "512x512",
          "type": "image/png"
      }
  ],
  "start_url": "/index.html",
  "display": "fullscreen",
  "theme_color": "#B12A34",
  "background_color": "#B12A34"
}

```

### 主动显示按照按钮

``` javascript
// 在一个用户被提示”安装“一个网站到移动设备的主屏幕之前，beforeInstallPromptEvent被触发
window.addEventListener('beforeinstallprompt', (e) => {
  // 防止Chrome67及更早版本自动显示安装提示
  e.preventDefault();
  // 把事件缓存起来，稍后会触发
  deferredPrompt = e;
  // 显示按钮
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // 隐藏按钮
    addBtn.style.display = 'none';

    // 等待用户反馈
    deferredPrompt.userChoice.then((choiceResult) => {
      if(choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt')
      } else {
        console.log('User dismissed the A2HS prompt')
      }
      // 不再需要，设置为空
      deferredPrompt = null;
    })
  })
}
```

