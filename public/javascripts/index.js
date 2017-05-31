function $(s) {
    return document.querySelectorAll(s);
}
var list = $('#list li');
var len = list.length;
var typeLi = $('header li');
var lenTypeLi = typeLi.length;
var size = 128;
var count = 0;
var frameId = null;
var box = $('#box')[0];
var height,width;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext("2d");
box.appendChild(canvas);
var Dots = [];

var mp = new MusicPlay({
    size: size,
    draw: draw
})

function init() {
    for(var i = 0; i < len; i++) {
        list[i].addEventListener('click', function () {
            for(var j = 0; j < len; j++) {
                list[j].className = '';                
            }
            this.className = 'selected';
            // load('/media/' + this.title);
            mp.play('/media/' + this.title);
        });
    }
    for(i = 0; i < lenTypeLi; i++) {
        typeLi[i].onclick = function () {
            for(var j = 0; j < lenTypeLi; j++) {
                typeLi[j].className = '';                
            }
            this.className = 'show';
            draw.type = this.getAttribute('data-type');
        }
    }
    reSize();
}


function random(m, n) {
    return Math.round(Math.random() * (n - m) + m);
}

function setDots() {
    Dots = [];
    for(i = 0; i < size; i++) {
        var x = random(0, width);
        var y = random(0, height);
        var color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        Dots.push({
            x: x,
            y: y,
            color: color
        })
    }
}
var line;
function reSize() {
    height = box.clientHeight;
    width = box.clientWidth;
    canvas.height = height;
    canvas.width = width;
    line = ctx.createLinearGradient(0,0,0,height);
    line.addColorStop(0, 'red');
    line.addColorStop(0.5, 'yellow');
    line.addColorStop(1, 'green');   
    setDots();
}

function draw(arr) {
    ctx.clearRect(0, 0, width, height);
    var w = width / size;
    ctx.fillStyle = line;    
    for(i = 0; i < size; i++) {
        if(draw.type == 'column') {
            var h = arr[i] / 256 * height;
            ctx.fillRect(w * i, height- h, w * 0.8, h);
        }else if(draw.type == 'dot') {
            ctx.beginPath();
            var o = Dots[i];
            var r = arr[i] / 256 * 50;
            ctx.arc(o.x, o.y, r, 0, Math.PI * 2, true);
            var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
            g.addColorStop(0, '#fff');
            g.addColorStop(1, o.color); 
            ctx.fillStyle = g;
            ctx.fill();
            // ctx.strokeStyle = '#fff';
            // ctx.stroke();
        }
        
    }
}

draw.type = "column";

window.onresize = reSize;


$('#volume')[0].onchange = function () {
    mp.changeVolume(this.value / this.max);
}
$('#volume')[0].onchange();

window.onload = init;