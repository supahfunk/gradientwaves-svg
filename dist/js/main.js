'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var settings = {
    amplitudeX: 150,
    amplitudeY: 20,
    lines: 30,
    startColor: '#500c44',
    endColor: '#b4d455'
};

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var winW = window.innerWidth;
var winH = window.innerHeight;
var Paths = [];
var color = [];
var mouseY = 0;
var mouseDown = false;
var time = 0;
var curves = void 0;
var velocity = void 0;

var Path = function () {
    function Path(y, color) {
        _classCallCheck(this, Path);

        this.y = y;
        this.color = color;
        this.root = [];
        this.create();
        this.draw();
    }

    _createClass(Path, [{
        key: 'create',
        value: function create() {
            var rootX = 0;
            var rootY = this.y;

            this.root = [{ x: rootX, y: rootY }];

            while (rootX < winW) {
                var casual = Math.random() > 0.5 ? 1 : -1;
                var x = parseInt(settings.amplitudeX / 2 + Math.random() * settings.amplitudeX / 2);
                var y = parseInt(rootY + casual * (settings.amplitudeY / 2 + Math.random() * settings.amplitudeY / 2));
                rootX += x;
                var delay = Math.random() * 100;
                this.root.push({ x: rootX, y: y, height: rootY, casual: casual, delay: delay });
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            ctx.beginPath();
            ctx.moveTo(0, winH);

            ctx.lineTo(this.root[0].x, this.root[0].y);

            for (var i = 1; i < this.root.length - 1; i++) {

                var x = this.root[i].x;
                var y = this.root[i].y;
                var nextX = this.root[i + 1].x;
                var nextY = this.root[i + 1].y;

                var xMid = (x + nextX) / 2;
                var yMid = (y + nextY) / 2;
                var cpX1 = (xMid + x) / 2;
                var cpY1 = (yMid + y) / 2;
                var cpX2 = (xMid + nextX) / 2;
                var cpY2 = (yMid + nextY) / 2;

                ctx.quadraticCurveTo(cpX1, y, xMid, yMid);
                ctx.quadraticCurveTo(cpX2, nextY, nextX, nextY);
            }

            var lastPoint = this.root.reverse()[0];
            this.root.reverse();
            ctx.lineTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(winW, winH);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }]);

    return Path;
}();

/* INIT */


var path = void 0;
function init() {
    c.width = winW;
    c.height = winH;
    Paths = [];

    color = chroma.scale([settings.startColor, settings.endColor]).mode('lch').colors(settings.lines);

    document.body.style = 'background: ' + settings.startColor;

    for (var i = 0; i < settings.lines; i++) {
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
function render() {
    c.width = winW;
    c.height = winH;

    curves = mouseDown ? 2 : 4;
    velocity = mouseDown ? 6 : 0.8;

    time += mouseDown ? 0.1 : 0.05;

    Paths.forEach(function (path, i) {
        path.root.forEach(function (r, j) {
            if (j % curves == 1) {
                var move = Math.sin(time + r.delay) * velocity * r.casual;
                r.y -= move / 2 - move;
            }
            if (j + 1 % curves == 0) {
                var _move = Math.sin(time + r.delay) * velocity * r.casual;
                r.x += _move / 2 - _move / 10;
            }
        });

        path.draw();
    });

    requestAnimationFrame(render);
}
render();

/* MOUSEDOWN */
'mousedown touchstart'.split(' ').forEach(function (e) {
    document.addEventListener(e, function () {
        mouseDown = true;
    });
});

/* MOUSEUP */
'mouseup mouseleave touchend'.split(' ').forEach(function (e) {
    document.addEventListener(e, function () {
        mouseDown = false;
    });
});

/* MOUSEMOVE */
'mousemove touchmove'.split(' ').forEach(function (e) {
    document.addEventListener(e, function (e) {
        mouseY = e.clientY || e.touches[0].clientY;
    });
});

/* DATA GUI */
var gui = function datgui() {
    var gui = new dat.GUI();
    dat.GUI.toggleHide();
    gui.add(settings, "amplitudeX", 20, 100).step(1).onChange(function (newValue) {
        init();
    });
    gui.add(settings, "amplitudeY", 0, 100).step(1).onChange(function (newValue) {
        init();
    });
    gui.add(settings, "lines", 5, 50).step(1).onChange(function (newValue) {
        init();
    });
    gui.addColor(settings, "startColor").onChange(function (newValue) {
        init();
    });
    gui.addColor(settings, "endColor").onChange(function (newValue) {
        init();
    });

    return gui;
}();