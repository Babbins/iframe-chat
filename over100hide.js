const spans = document.querySelectorAll('li.tile>div.price>p>span');

for (let i = 0; i < spans.length; i++) {
  let ele = spans[i];
  const price = +spans[i].innerHTML.substring(1);
  if (price > 100) {
    while (!ele.parentElement.classList.contains('tile')) {
      ele = ele.parentElement;
    }
    ele.parentElement.style.display = 'none';
  }
}
// const tileSets = document.getElementsByClassName('tileset');
//
// for (let i = 0; i < tileSets.length; i++) {
//   let tileSet = tileSets[i];
//   console.log(tileSet);
//   let tileNum = 0;
//   for (var j = 0; i < tileSet.childNodes.length; j++) {
//     if (tileSet.childNodes[j]) {
//       console.log(tileSet.childNodes[j], j);
//       if (!tileSet.childNodes[j].classList.contains('tile')){
//         continue;
//       }
//       tileSet.childNodes[j].className += 'tile tile-' + (tileNum++)
//     }
//   }
// }
