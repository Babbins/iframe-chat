/* globals dragTools */

window.onload = () => {
  const iframes = window.frames;

  window.addIframe = () => {
    const iframeId = window.frames.length + 1;
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'iframeContainer';
    iframeContainer.style.zIndex = dragTools.zIndex;

    const newIframe = document.createElement('iframe');
    newIframe.setAttribute('src', 'iframe.html');

    const dragger = document.createElement('button');
    dragger.className = 'drag';

    document.body.appendChild(iframeContainer);
    iframeContainer.appendChild(newIframe);
    iframeContainer.appendChild(dragger);
    dragTools.makeDraggable(dragger);

    //once iframe has loaded
    //emit to it a 'join' event.
    newIframe.onload = () => {
      emitToIframe({
        type: 'join',
        id: iframeId
      }, newIframe.contentWindow);
    }

    broadcastToIframes({
      type: 'new_guest',
      id: iframeId
    });
  }

  //sends postMessage (w/ payload) to all Iframes on page.
  function broadcastToIframes(payload) {
    for (let i = 0; i < iframes.length; i++) {
      if (iframes[i].postMessage) {
        emitToIframe(payload, iframes[i]);
      }
    }
  }

  //sends postMessage (w/ payload) to a single iframe.
  function emitToIframe(payload, iframeWindow) {
    iframeWindow.postMessage(payload, '*');
  }

  //listen for postMessages from iFrames
  window.addEventListener('message', function(evt) {

    switch (evt.data.type) {
      case 'new_message':
        //broadcast newMessage sent from one Iframe to all Iframes.
        broadcastToIframes(evt.data)
        break;
      default:
        return;
    }
  });
}
