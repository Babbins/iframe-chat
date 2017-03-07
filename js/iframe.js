window.onload = () => {
  const input = document.getElementById('chat-message');
  const label = document.getElementById('chat-name');
  const messages = document.getElementById('messages');
  let parentWindow, id;

  //listen for messages from parent window.
  window.addEventListener('message', (evt) => {
    //get reference to parent window to gain ability to send postMessages.
    if (!parentWindow) {
      parentWindow = evt.source;
    }

    switch (evt.data.type) {
      case 'join':
        handleJoin(evt.data)
        break;
      case 'new_guest':
        handleNewGuest(evt.data)
        break;
      case 'new_message':
        handleNewMessage(evt.data);
        break;
      default:
        return;
    }
  })

  //assigns id to element and displays a joined message.
  function handleJoin(data) {
    id = data.id;
    const msg = document.createElement('div');
    msg.className = 'col s12';
    msg.innerHTML = `[system]: Joined chat as iframe-${id}.`;
    label.innerHTML = `[iframe-${id}]:`;
    messages.appendChild(msg);
  }

  //displays that a new Iframe has joined.
  function handleNewGuest(data) {
    const msg = document.createElement('div');
    msg.className = 'col s12 well';
    msg.innerHTML = `[system]: iframe-${data.id} has joined the chat.`;
    messages.appendChild(msg);
  }

  //displays a message sent by an Iframe (including it's own).
  function handleNewMessage(data) {
    const msg = document.createElement('div');
    msg.className = 'col s12 well';
    msg.innerHTML = `[iframe-${data.sender}]: ${data.message}`
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  //emits message to parent window that will be emitted to all other iFrames
  //(including this one).
  window.sendMessage =  () => {
    parentWindow.postMessage({
      type: 'new_message',
      sender: id,
      message: input.value
    }, '*');
    input.value = '';
  }
}
