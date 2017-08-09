const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let winW = window.innerWidth;
let winH = window.innerHeight;
let Paths = [];
let color = [];
let settings = {
    amplitudeX: 100,
    amplitudeY: 10,
    lines: 30,
    startColor: '#275863',
    endColor: '#fafa6e',
    fromBottom: false
};

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
        let rootY = settings.startY;

        this.root = [{ x: rootX, y: rootY }];

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

            this.root.push({ x: rootX, y: y });
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(0, winH);

        ctx.lineTo(this.root[0].x, this.root[0].y);

        for (let i = 1; i < this.root.length - 2; i++) {
            var x_mid = (this.root[i].x + this.root[i + 1].x) / 2;
            var y_mid = (this.root[i].y + this.root[i + 1].y) / 2;
            var cp_x1 = (x_mid + this.root[i].x) / 2;
            var cp_y1 = (y_mid + this.root[i].y) / 2;
            var cp_x2 = (x_mid + this.root[i + 1].x) / 2;
            var cp_y2 = (y_mid + this.root[i + 1].y) / 2;
            ctx.quadraticCurveTo(cp_x1, this.root[i].y, x_mid, y_mid);
            ctx.quadraticCurveTo(cp_x2, this.root[i + 1].y, this.root[i + 1].x, this.root[i + 1].y);
        }

        const lastPoint = this.root.reverse()[0];
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

/* REGENERATE */
window.addEventListener('click', init);

/* WIN RESIZE */
window.addEventListener('resize', function () {
    winW = window.innerWidth;
    winH = window.innerHeight;
    c.width = winW;
    c.height = winH;
    init();
});
window.dispatchEvent(new Event("resize"));
