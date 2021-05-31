var template = ({name}) => {
  return `<div>${name}</div>`
}

function init() {
  var content = '';
  for(var i = 0; i < lists.length; i++) {
    content = content + template(lists[i]);
  }
  
  document.getElementById('content').innerHTML = content;
}

function buildServiceWorker(){
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}

function sendMessage(){
  var button = document.getElementById('notifications');
  button.addEventListener('click', function(e){
    Notification.requestPermission().then(function(result) {
      if(result === 'granted') {
        randomNotification();
      }
    })
  })
}

function randomNotification(){
  var randomItem = Math.floor(Math.random()*lists.length);
  var notifTitle = lists[randomItem].name;
  var notifBody = 'Created by Miwa';
  var options = {
    body: notifBody
  }

  var notif = new Notification(notifTitle, options);
  setTimeout(randomNotification, 30000)
}

init();