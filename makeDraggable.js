//IIFE so zIndex is not global
//gives element ability to reposition PARENT element on drag.
const makeDraggable =
(function () {
  let zIndex = 2;

  const makeDraggable = function(elem){
    let containers;
    elem.onmousedown = (evt) => {
      const container = elem.parentNode;
      //if the element does not already have the current zIndex
      //assign it then increment the zIndex global.
      if (+container.style.zIndex + 1 !== zIndex) {
        container.style.zIndex = zIndex++;
      }

       const coords = getCoordinates(container);

       function getCoordinates(elem) {
          const box = elem.getBoundingClientRect();
          return {
             top: box.top + pageYOffset,
             left: box.left + pageXOffset
          };
       }

       const shiftX = evt.pageX - coords.left;
       const shiftY = evt.pageY - coords.top;

       moveTo(evt);

       function moveTo(evt) {
         container.style.left = evt.pageX - shiftX + 'px';
         container.style.top = evt.pageY - shiftY + 'px';
       }


      containers = document.getElementsByClassName('iframeContainer');
      //cover all iframeContainers with a transparent div so that the cursor
      //remains 'detectable' to main webpage'
      //(these div will be removed from the DOM onmouseup)
      for (let i = 0; i < containers.length; i++){
        const cover = document.createElement('div');
        cover.className = 'drag-cover grabbing';
        containers[i].appendChild(cover);
      }

      document.onmousemove = (evt) => moveTo(evt);

      document.onmouseup = () => {
        //remove mouse eventHandlers from document
        document.onmousemove = null;
        document.onmouseup = null;

        //remove all drag-covers (to allow iframe interaction)
        const dragCovers = document.getElementsByClassName('drag-cover');
        while (dragCovers.length) {
          dragCovers[0].parentNode.removeChild(dragCovers[0]);
        }
      };
    };
  }
  return makeDraggable;
}());
