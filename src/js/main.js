const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let winW = window.innerWidth;
let winH = window.innerHeight;
let root = [];
let color = [];
let settings = {
  amplitudeX: 200,
  amplitudeY: 30,
  lines: 30,
  startY: 200
};

/* CREATE ROOT */
function createRoot() {
  console.clear();
  root = [];

  let rootX = 0;
  let rootY = settings.startY;
  
  console.log(settings.startY);

  root = [{ x: rootX, y: rootY }];

  while (rootX < winW) {
    let casual = Math.random() > 0.5 ? 1 : -1;
    let x = parseInt(
      settings.amplitudeX / 2 + Math.random() * settings.amplitudeX / 2
    );
    let y = parseInt(
      rootY +
        casual *
          (settings.amplitudeY / 2 + Math.random() * settings.amplitudeY / 2)
    );
    rootX += x;

    root.push({ x: rootX, y: y });
  }

  function drawRoot(){
    ctx.beginPath();
    ctx.moveTo(0, winH);
    ctx.lineTo(root[0].x, root[0].y);

    for (let i = 1; i < root.length - 2; i++) {
      var x_mid = (root[i].x + root[i+1].x) / 2;
      var y_mid = (root[i].y + root[i+1].y) / 2;
      var cp_x1 = (x_mid + root[i].x) / 2;
      var cp_y1 = (y_mid + root[i].y) / 2;
      var cp_x2 = (x_mid + root[i+1].x) / 2;
      var cp_y2 = (y_mid + root[i+1].y) / 2;
      ctx.quadraticCurveTo(cp_x1,root[i].y ,x_mid, y_mid);
      ctx.quadraticCurveTo(cp_x2,root[i+1].y ,root[i+1].x,root[i+1].y);
    }

    const lastPoint = root.reverse()[0];
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(winW, winH);
    ctx.fill();
    ctx.closePath();
  }
  drawRoot();
  
}

/* INIT */
function init(){
  color = chroma.scale(['#2A4858','#fafa6e'])
    .mode('lch').colors(settings.lines);
  
  for ( let i = 0; i < settings.lines; i++) {
    createRoot();
    settings.startY = winH / settings.lines * i;
    ctx.fillStyle = color[i];
  }
}

/* REGENERATE */
window.addEventListener('click', init);

/* WIN RESIZE */
window.addEventListener('resize', function() {
  winW = window.innerWidth;
  winH = window.innerHeight;
  c.width = winW;
  c.height = winH;
  init();
});
window.dispatchEvent(new Event("resize"));
