function init() {
  self.importScripts('data/games.js'); // 同步执行，importScripts 的文件加载和执行完成再执行后续代码

  const [cacheName, appShellFiles] = cache();
  install(cacheName, appShellFiles);
  offline(cacheName);
}

function install(cacheName, appShellFiles){
  self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
      caches.open(cacheName).then(function(cache) { // cache.open 打开一个cache对象，再使用Cache对象的方法去处理缓存；
        console.log('[Service Worker] Caching all: app shell and content');
        return cache.addAll(appShellFiles); // cache.addAll 捉取一个URL数组，检索并把返回的response对象添加给指定的Cache对象
      })
    )
  })
}

function cache(){
  var cacheName = 'pwa-v1';
  var appShellFiles = [
    '/games.js'
  ];

  return [cacheName, appShellFiles]
}

function offline(cacheName){
  self.addEventListener('fetch', function(e) {
    e.respondWith(
      caches.match(e.request).then(function(r) { // caches.match 跟Cache对象匹配的第一个已经缓存的结果
        console.log('[Service Worker] Fetching resource: ' + e.request.url);
        return r || fetch(e.request).then(function(response){
          return caches.open(cacheName).then(function(cache) { // cache.open 打开一个cache对象，再使用Cache对象的方法去处理缓存；
            console.log('[Service Worker] Caching new resource:' + e.request.url);
            cache.put(e.request, response.clone()); // 同时捉取一个请求及其响应，并将其添加到给定的cache；
            return response;
          })
        })
      })
    )
  })
}

init();