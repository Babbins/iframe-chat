window.onload = function() {
  const input = document.getElementById("chat-message");
  const label = document.getElementById('chat-name');
  const messages = document.getElementById('messages');
  let mainWindow, id;



  window.addEventListener('message', function(event) {
    if (!mainWindow) {
      mainWindow = event.source;
    }
    let msg;
    console.log(event.data);
    switch (event.data.type) {
      case 'join':
        id = event.data.id;
        msg = document.createElement('div');
        msg.className = 'col s12';
        msg.innerHTML = `Joined chat as iframe-${id}.`;
        label.innerHTML = `[iframe-${id}]`;
        messages.appendChild(msg);
        break;
      case 'new_guest':
        msg = document.createElement('div');
        msg.className = 'col s12';
        msg.innerHTML = `iframe-${event.data.id} has joined the chat.`;
        messages.appendChild(msg);
        break;
      case 'new_message':
        msg = document.createElement('div');
        msg.className = 'col s12';
        msg.innerHTML = `iframe-${event.data.sender}: ${event.data.message}`
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
        break;
      default:
        return;
    }
  })

  window.sendMessage =  function(evt){
    evt.preventDefault();
    mainWindow.postMessage({
      type: 'new_message',
      sender: id,
      message: input.value
    }, '*');
    input.value = '';
  }
}
