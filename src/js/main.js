/*--------------------------------------------------
VARS
--------------------------------------------------*/
const svg = document.getElementById('svg');
let winW = window.innerWidth,
    winH = window.innerHeight,
    colors = [];


/*--------------------------------------------------
SETTINGS
--------------------------------------------------*/
let settings = {
    amplitudeX: 100,
    amplitudeY: 20,
    lines: 20,
    startColor: '#500c44',
    endColor: '#b4d455'
}


/*--------------------------------------------------
PATH
--------------------------------------------------*/
class Path {
    constructor (y, fill) {
        this.rootY = y;
        this.fill = fill;
    }
    
    createRoot() {
        this.root = [];
        
        let x = 0;
        let y = 0;
        let rootY = this.rootY;
        let upSideDown = 0;

        this.root.push({ x: 0, y: rootY});

        while (x < winW) {
            upSideDown = !upSideDown;
            let value = upSideDown ? 1 : -1;
            x += parseInt((Math.random() * settings.amplitudeX / 2) + (settings.amplitudeX / 2));
            y = (parseInt((Math.random() * settings.amplitudeY / 2) + (settings.amplitudeY / 2)) * value) + rootY;
            console.log(upSideDown)
            this.root.push({ x: x, y: y});
        }
    }

    createCircles() {
        const fill = this.fill;
        this.root.forEach(function(key, obj) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', 2);
            circle.setAttribute('cx', key.x);
            circle.setAttribute('cy', key.y);
            circle.setAttribute('fill', fill);
            svg.appendChild(circle);
        })
    }

    createPath(){
        const stroke = this.fill;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke', stroke);
        path.classList.add('path');

        // first point
        let d = `M ${this.root[0].x} ${this.root[0].y}`;

        for (let i = 1; i < this.root.length - 1; i++) {
            const letter = (i == 1) ? 'c' : 's';

            const p = this.root[i];
            const pPrev = this.root[i - 1];
            const pNext = this.root[i + 1];
            
            const x1 = (p.x - pPrev.x) / 2;
            const x2 = (pNext.x - p.x) / 2;
            const x = p.x;
            const y = p.y - this.rootY;
            
            if (letter == 'c') {
                d += ` ${letter}${x2} ${y}, ${x1} ${y}, ${x} ${y}`;
            } else {
                d += ` ${letter}${x1} ${y}, ${x} ${y}`;
            }
        }

        path.setAttribute('d', d);

        svg.appendChild(path);
    }
};


/*--------------------------------------------------
INIT
--------------------------------------------------*/
function init(){
    colors = chroma.scale([settings.startColor, settings.endColor]).mode('lch').colors(settings.lines);

    svg.innerHTML = '';

    for (let i = 0; i < settings.lines; i++) {
        var path = new Path(winH / settings.lines * i, colors[i]);
        path.createRoot();
        path.createPath();
    }
    
};
init();


/*--------------------------------------------------
RENDER
--------------------------------------------------*/
function render(){
    requestAnimationFrame(render);
};
render();


/*--------------------------------------------------
WIN RESIZE
--------------------------------------------------*/
window.addEventListener('resize', function() {
    winW = window.innerWidth;
    winH = window.innerHeight;
    init();
});
