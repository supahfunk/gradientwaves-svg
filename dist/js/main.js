'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*--------------------------------------------------
VARS
--------------------------------------------------*/
var svg = document.getElementById('svg');
var winW = window.innerWidth,
    winH = window.innerHeight,
    colors = [];

/*--------------------------------------------------
SETTINGS
--------------------------------------------------*/
var settings = {
    amplitudeX: 100,
    amplitudeY: 20,
    lines: 20,
    startColor: '#500c44',
    endColor: '#b4d455'

    /*--------------------------------------------------
    PATH
    --------------------------------------------------*/
};
var Path = function () {
    function Path(y, fill) {
        _classCallCheck(this, Path);

        this.rootY = y;
        this.fill = fill;
    }

    _createClass(Path, [{
        key: 'createRoot',
        value: function createRoot() {
            this.root = [];

            var x = 0;
            var y = 0;
            var rootY = this.rootY;
            var upSideDown = 0;

            this.root.push({ x: 0, y: rootY });

            while (x < winW) {
                upSideDown = !upSideDown;
                var value = upSideDown ? 1 : -1;
                x += parseInt(Math.random() * settings.amplitudeX / 2 + settings.amplitudeX / 2);
                y = parseInt(Math.random() * settings.amplitudeY / 2 + settings.amplitudeY / 2) * value + rootY;
                console.log(upSideDown);
                this.root.push({ x: x, y: y });
            }
        }
    }, {
        key: 'createCircles',
        value: function createCircles() {
            var fill = this.fill;
            this.root.forEach(function (key, obj) {
                var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('r', 2);
                circle.setAttribute('cx', key.x);
                circle.setAttribute('cy', key.y);
                circle.setAttribute('fill', fill);
                svg.appendChild(circle);
            });
        }
    }, {
        key: 'createPath',
        value: function createPath() {
            var stroke = this.fill;
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke', stroke);
            path.classList.add('path');

            // first point
            var d = 'M ' + this.root[0].x + ' ' + this.root[0].y;

            for (var i = 1; i < this.root.length - 1; i++) {
                var letter = i == 1 ? 'c' : 's';

                var p = this.root[i];
                var pPrev = this.root[i - 1];
                var pNext = this.root[i + 1];

                var x1 = (p.x - pPrev.x) / 2;
                var x2 = (pNext.x - p.x) / 2;
                var x = p.x;
                var y = p.y - this.rootY;

                if (letter == 'c') {
                    d += ' ' + letter + x2 + ' ' + y + ', ' + x1 + ' ' + y + ', ' + x + ' ' + y;
                } else {
                    d += ' ' + letter + x1 + ' ' + y + ', ' + x + ' ' + y;
                }
            }

            path.setAttribute('d', d);

            svg.appendChild(path);
        }
    }]);

    return Path;
}();

;

/*--------------------------------------------------
INIT
--------------------------------------------------*/
function init() {
    colors = chroma.scale([settings.startColor, settings.endColor]).mode('lch').colors(settings.lines);

    svg.innerHTML = '';

    for (var i = 0; i < settings.lines; i++) {
        var path = new Path(winH / settings.lines * i, colors[i]);
        path.createRoot();
        path.createPath();
    }
};
init();

/*--------------------------------------------------
RENDER
--------------------------------------------------*/
function render() {
    requestAnimationFrame(render);
};
render();

/*--------------------------------------------------
WIN RESIZE
--------------------------------------------------*/
window.addEventListener('resize', function () {
    winW = window.innerWidth;
    winH = window.innerHeight;
    init();
});