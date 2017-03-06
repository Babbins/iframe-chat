let zIndex = 2;
const makeDraggable = function(elem){
  let containers;
  elem.onmousedown = function(e) {
    const container = elem.parentNode;
     var coords = getCoords(container);
     var shiftX = e.pageX - coords.left;
     var shiftY = e.pageY - coords.top;

    containers = document.getElementsByClassName('iframeContainer');
    for (let i = 0; i < containers.length; i++){
      const cover = document.createElement('div');
      cover.id = 'drag-cover';
      containers[i].appendChild(cover);
    }

    //  container.style.position = 'absolute';
    moveTo(e);

    function moveTo(e) {
      container.style.left = e.pageX - shiftX + 'px';
       container.style.top = e.pageY - shiftY + 'px';
    }

    if (+container.style.zIndex + 1 !== zIndex) {
      container.style.zIndex = zIndex++;
    }

     document.onmousemove = function(e) {
        moveTo(e);
     };

     elem.onmouseup = function() {
        document.onmousemove = null;
        elem.onmouseup = null;
        for (let i = 0; i < containers.length; i++) {
          containers[i].removeChild(containers[i].childNodes[containers[i].childNodes.length - 1]);
        }
     };
  };
  elem.ondragstart = function() {
     return false;
  };
}

function getCoords(elem) {
   var box = elem.getBoundingClientRect();

   return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
   };
}

window.onload = () => {
  const iframes = window.frames;


  window.addIframe = function() {
    const iframeId = window.frames.length + 1;
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'iframeContainer';

    const newIframe = document.createElement('iframe');
    newIframe.setAttribute('src', 'iframe.html');

    newIframe.onload = () => {
      emitToIframe({
        type: 'join',
        id: iframeId
      }, newIframe.contentWindow);
    }

    const dragger = document.createElement('button');
    dragger.id = 'drag';


    document.body.appendChild(iframeContainer);
    iframeContainer.appendChild(newIframe);
    iframeContainer.appendChild(dragger);
    makeDraggable(dragger);

    broadcastToIframes({
      type: 'new_guest',
      id: iframeId
    });
  }

  function broadcastToIframes(payload) {
    for (let i = 0; i < iframes.length; i++) {
      if (iframes[i].postMessage) {
        emitToIframe(payload, iframes[i]);
      }
    }
  }

  function emitToIframe(payload, iframeWindow) {
    iframeWindow.postMessage(payload, '*');
  }

  window.addEventListener('message', function(event) {
    switch (event.data.type) {
      case 'new_message':
        broadcastToIframes(event.data)
        break;
      default:
        return;
    }
  });
}
