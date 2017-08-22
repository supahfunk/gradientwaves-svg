'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*--------------------------------------------------
SETTINGS
--------------------------------------------------*/
var settings = {
    amplitudeX: 100,
    amplitudeY: 20,
    lines: 20,
    hueStartColor: 53,
    saturationStartColor: 74,
    lightnessStartColor: 67,
    hueEndColor: 216,
    saturationEndColor: 100,
    lightnessEndColor: 7,
    smoothness: 3,
    offsetX: 10,
    fill: true,
    crazyness: false

    /*--------------------------------------------------
    VARS
    --------------------------------------------------*/
};var svg = document.getElementById('svg'),
    winW = window.innerWidth,
    winH = window.innerHeight,
    Colors = [],
    Paths = [],
    Mouse = {
    x: winW / 2,
    y: winH / 2
},
    overflow = void 0,
    startColor = void 0,
    endColor = void 0,
    gui = void 0;

/*--------------------------------------------------
PATH
--------------------------------------------------*/

var Path = function () {
    function Path(y, fill, offsetX) {
        _classCallCheck(this, Path);

        this.rootY = y;
        this.fill = fill;
        this.offsetX = offsetX;
    }

    _createClass(Path, [{
        key: 'createRoot',
        value: function createRoot() {
            this.root = [];
            var offsetX = this.offsetX;
            var x = -overflow + offsetX;
            var y = 0;
            var rootY = this.rootY;
            var upSideDown = 0;

            this.root.push({ x: x, y: rootY });

            while (x < winW) {
                var value = Math.random() > 0.5 ? 1 : -1;

                // Crazyness
                if (settings.crazyness) {
                    x += parseInt(Math.random() * settings.amplitudeX / 2 + settings.amplitudeX / 2);
                    y = parseInt(Math.random() * settings.amplitudeY / 2 + settings.amplitudeY / 2) * value + rootY;
                } else {
                    // Geometric
                    upSideDown = !upSideDown;
                    value = upSideDown == 0 ? 1 : -1;

                    x += settings.amplitudeX;
                    y = settings.amplitudeY * value + rootY;
                }

                this.root.push({ x: x, y: y });
            };

            this.root.push({ x: winW + overflow, y: rootY });
        }
    }, {
        key: 'createCircles',
        value: function createCircles() {
            var fill = '#fff';
            this.root.forEach(function (key, obj) {
                var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('r', 1);
                circle.setAttribute('cx', key.x);
                circle.setAttribute('cy', key.y);
                circle.setAttribute('fill', 'rgba(255, 255, 255, .3)');
                svg.appendChild(circle);
            });
        }
    }, {
        key: 'createPath',
        value: function createPath() {
            var root = this.root;
            var fill = this.fill;
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', fill);
            path.setAttribute('stroke', fill);
            svg.appendChild(path);
            if (settings.fill) {
                svg.setAttribute('class', 'path');
            } else {
                svg.setAttribute('class', 'stroke');
            }

            // first & second points
            var d = 'M -' + overflow + ' ' + (winH + overflow);
            d += ' L ' + root[0].x + ' ' + root[0].y;

            // magic points
            for (var i = 1; i < this.root.length - 1; i++) {
                var prevPoint = root[i - 1];
                var actualPoint = root[i];
                var diffX = (actualPoint.x - prevPoint.x) / settings.smoothness;
                var x1 = prevPoint.x + diffX;
                var x2 = actualPoint.x - diffX;
                var x = actualPoint.x;
                var y1 = prevPoint.y;
                var y2 = actualPoint.y;
                var y = actualPoint.y;

                d += ' C ' + x1 + ' ' + y1 + ', ' + x2 + ' ' + y2 + ', ' + x + ' ' + y;
            }

            // Second last
            var reverseRoot = root.reverse();
            d += ' L ' + reverseRoot[0].x + ' ' + reverseRoot[0].y;
            root.reverse();

            // Last point
            d += ' L ' + (winW + overflow) + ' ' + (winH + overflow);

            // Close path
            d += ' Z';

            path.setAttribute('d', d);
        }
    }, {
        key: 'createLines',
        value: function createLines() {
            var root = this.root;
            var fill = this.fill;
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', fill);
            path.classList.add('path');
            svg.appendChild(path);

            // first & second points
            var d = 'M -' + overflow + ' ' + (winH + overflow);
            d += ' L ' + root[0].x + ' ' + root[0].y;

            // Magic points
            for (var i = 1; i < root.length - 1; i++) {
                d += ' L ' + root[i].x + ' ' + root[i].y;
            }

            // Second last & last points
            var reverseRoot = root.reverse();
            d += ' L ' + reverseRoot[0].x + ' ' + reverseRoot[0].y;
            d += ' L ' + (winW + overflow) + ' ' + (winH + overflow);
            root.reverse();

            // Close path
            d += ' Z';

            path.setAttribute('d', d);
        }
    }]);

    return Path;
}();

;

/*--------------------------------------------------
INIT
--------------------------------------------------*/
function init() {
    // Overflow
    overflow = Math.abs(settings.lines * settings.offsetX);

    // Colors
    startColor = 'hsl(' + settings.hueStartColor + ', ' + settings.saturationStartColor + '%, ' + settings.lightnessStartColor + '%)';
    endColor = 'hsl(' + settings.hueEndColor + ', ' + settings.saturationEndColor + '%, ' + settings.lightnessEndColor + '%)';
    Colors = chroma.scale([startColor, endColor]).mode('lch').colors(settings.lines + 2);

    // Reset
    Paths = [];
    document.body.removeChild(svg);
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('id', 'svg');
    document.body.appendChild(svg);

    // Background
    if (settings.fill) {
        svg.style.backgroundColor = Colors[0];
    } else {
        svg.style.backgroundColor = '#000';
    }

    // Lines
    for (var i = 0; i < settings.lines + 1; i++) {
        var rootY = parseInt(winH / settings.lines * i);
        var path = new Path(rootY, Colors[i + 1], settings.offsetX * i);
        Paths.push(path);
        path.createRoot();
    }
    Paths.forEach(function (path) {
        path.createPath();
    });
};
init();

/*--------------------------------------------------
WIN RESIZE
--------------------------------------------------*/
window.addEventListener('resize', function () {
    winW = window.innerWidth;
    winH = window.innerHeight;
    init();
});

/*--------------------------------------------------
DAT GUI
--------------------------------------------------*/
function datgui() {
    gui = new dat.GUI();

    // Settings
    var guiSettings = gui.addFolder('Settings');
    guiSettings.add(settings, 'lines', 5, 50).step(1).onChange(init);
    guiSettings.add(settings, 'amplitudeX', 20, 300).step(1).onChange(init);
    guiSettings.add(settings, 'amplitudeY', 0, 200).step(1).onChange(init);
    guiSettings.add(settings, 'offsetX', -20, 20).step(1).onChange(init);
    guiSettings.add(settings, 'smoothness', 0.5, 10).step(0.2).onChange(init);
    guiSettings.add(settings, 'fill', false).onChange(init);
    guiSettings.add(settings, 'crazyness', false).onChange(init);
    guiSettings.open();

    // Start Color
    var guiStartColor = gui.addFolder('Start Color');
    guiStartColor.add(settings, 'hueStartColor', 0, 360).step(1).onChange(init);
    guiStartColor.add(settings, 'saturationStartColor', 0, 100).step(1).onChange(init);
    guiStartColor.add(settings, 'lightnessStartColor', 0, 100).step(1).onChange(init);
    guiStartColor.open();

    // End Color
    var guiEndColor = gui.addFolder('End Color');
    guiEndColor.add(settings, 'hueEndColor', 0, 360).step(1).onChange(init);
    guiEndColor.add(settings, 'saturationEndColor', 0, 100).step(1).onChange(init);
    guiEndColor.add(settings, 'lightnessEndColor', 0, 100).step(1).onChange(init);
    guiEndColor.open();

    // Randomize
    var guiRandomize = { randomize: function randomize() {
            _randomize();
        } };
    gui.add(guiRandomize, 'randomize');

    return gui;
}
datgui();

/*--------------------------------------------------
RANDOMIZE
--------------------------------------------------*/
function _randomize() {
    settings = {
        lines: parseInt(5 + Math.random() * 45),
        amplitudeX: parseInt(20 + Math.random() * 300),
        amplitudeY: parseInt(Math.random() * 200),
        hueStartColor: parseInt(Math.random() * 360),
        saturationStartColor: 74,
        lightnessStartColor: 67,
        hueEndColor: parseInt(Math.random() * 360),
        saturationEndColor: 90,
        lightnessEndColor: 14,
        smoothness: 1 + parseInt(Math.random() * 9),
        offsetX: parseInt(-20 + Math.random() * 40),
        fill: Math.random() * 1 > 0.3 ? true : false,
        crazyness: Math.random() * 1 > 0.9 ? true : false
    };
    init();
    gui.destroy();
    datgui();
}