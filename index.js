(function(){
    var requestAnimationFrame = (function(){
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
        };
    })();

    var width, height, scale,
        canvas, ctx,
        particles,
        didInit;

    function Particle(x,y){
        this.x = x+Math.random()*32-16;
        this.y = y+Math.random()*32-16;
    }

    function update(){
        ctx.fillStyle = 'rgba(32,32,32,0.3)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'rgba(255,255,255,1)';
        for (var i=0;i<particles.length;++i) {
            var p = particles[i];
            ctx.fillRect(p.x, p.y, 2, 2);
        }

        ctx.lineWidth=1;
        ctx.fillStyle="#CCCCCC";
        ctx.font="16px sans-serif";
        ctx.fillText(""+width+"x"+height+"@"+scale+"x", 10, 25);

        requestAnimationFrame(update);
    }

    function init(){
        canvas = document.getElementById("canvas") || document.createElement("canvas");
        canvas.id = 'canvas';
        document.body.appendChild(canvas);
        resizeCanvas();
        ctx = canvas.getContext("2d");
        ctx.scale(scale, scale);

        particles = [];

        if(!didInit){
            didInit = true;
            update();
            bindEvents();
        }
    }

    function resizeCanvas(){
        scale = window.devicePixelRatio || 1;
        canvas.width = width = window.innerWidth * scale;
        canvas.height = height = window.innerHeight * scale;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
    }

    function mouseMove(e){
        particles.push(new Particle(e.x,e.y));
        if (particles.length > 50) {
            particles.shift();
        }
    }

    function bindEvents(){
        window.addEventListener('resize', init);
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('touchmove', function(e){
            e.preventDefault();
            var touch = e.changedTouches[0];
            mouseMove({'x':touch.clientX,'y':touch.clientY});
        });
    }

    init();
})();