let settings = {
    amplitudeX: 150,
    amplitudeY: 20,
    lines: 30,
    startColor: '#500c44',
    endColor: '#b4d455'
};

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let winW = window.innerWidth;
let winH = window.innerHeight;
let Paths = [];
let color = [];
let mouseY = 0;
let mouseDown = false;
let time = 0;

class Path {
    constructor(y, color) {
        this.y = y;
        this.color = color;
        this.root = [];
        this.create();
        this.draw();
    }

    create() {
        let rootX = 0;
        let rootY = this.y;

        this.root = [{ x: rootX, y: rootY }];

        while (rootX < winW) {
            let casual = Math.random() > 0.5 ? 1 : -1;
            let x = parseInt(
                settings.amplitudeX / 2 + Math.random() * settings.amplitudeX / 2
            );
            let y = parseInt(rootY + casual * (settings.amplitudeY / 2 + Math.random() * settings.amplitudeY / 2));
            rootX += x;
            let delay = Math.random() * 100;
            this.root.push({ x: rootX, y: y, height: rootY, casual: casual, delay: delay });
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(0, winH);

        ctx.lineTo(this.root[0].x, this.root[0].y);

        for (let i = 1; i < this.root.length - 1; i++) {

            let x = this.root[i].x;
            let y = this.root[i].y;
            let nextX = this.root[i + 1].x;
            let nextY = this.root[i + 1].y;

            let xMid = (x + this.root[i + 1].x) / 2;nextX
            let yMid = (y + nextY) / 2;
            let cpX1 = (xMid + x) / 2;
            let cpY1 = (yMid + y) / 2;
            let cpX2 = (xMid + this.root[i + 1].x) / 2;
            let cpY2 = (yMid + nextY) / 2;
            
            ctx.quadraticCurveTo(cpX1, y, xMid, yMid);
            ctx.quadraticCurveTo(cpX2, nextY, this.root[i + 1].x, nextY);
        }

        const lastPoint = this.root.reverse()[0];
        this.root.reverse();
        ctx.lineTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(winW, winH);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

/* INIT */
let path;
function init() {
    c.width = winW;
    c.height = winH;
    Paths = [];

    color = chroma.scale([settings.startColor, settings.endColor])
        .mode('lch').colors(settings.lines);

    document.body.style = `background: ${settings.startColor}`;

    for (let i = 0; i < settings.lines; i++) {
        Paths.push(new Path(winH / settings.lines * i, color[i]));
        settings.startY = winH / settings.lines * i;
    }
}

/* WIN RESIZE */
window.addEventListener('resize', function () {
    winW = window.innerWidth;
    winH = window.innerHeight;
    c.width = winW;
    c.height = winH;
    init();
});
window.dispatchEvent(new Event("resize"));

/* RENDER */
function render(a) {
    /*
    let curves = mouseDown ? 2 : 4;
    let velocity = mouseDown ? 4 : 0.8;
    c.width = winW;
    c.height = winH;
    
    time += mouseDown ? 0.1 : 0.05 ;

    Paths.forEach(function (path, i) {
        path.root.forEach(function (r, j) {
            if (j % curves == 1) {
                let move = Math.sin(time + r.delay ) * velocity * r.casual;
                r.y -= (move / 2) - move;
            }
        });

        path.draw();
    });
    */
    requestAnimationFrame(render);
}
render();

/* MOUSEDOWN */
('mousedown touchstart').split(' ').forEach(e => {
  document.addEventListener(e, function() {
      mouseDown = true;
  })
});

/* MOUSEUP */
('mouseup mouseleave touchend').split(' ').forEach(e => {
  document.addEventListener(e, function() {
      mouseDown = false;
  })
});

/* MOUSEMOVE */
('mousemove touchmove').split(' ').forEach(e => {
  document.addEventListener(e, function(e) {
      mouseY = e.clientY || e.touches[0].clientY;
  })
});

/* DATA GUI */
const gui = (
    function datgui() {
    var gui = new dat.GUI();
    dat.GUI.toggleHide();
    gui.add(settings, "amplitudeX", 20, 100).step(1).onChange(function(newValue) {
        init();
    });
    gui.add(settings, "amplitudeY", 0, 100).step(1).onChange(function(newValue) {
        init();
    });
    gui.add(settings, "lines", 5, 50).step(1).onChange(function(newValue) {
        init();
    });
    gui.addColor(settings, "startColor").onChange(function(newValue) {
        init();
    });
    gui.addColor(settings, "endColor").onChange(function(newValue) {
        init();
    });
    
    return gui;
})();

