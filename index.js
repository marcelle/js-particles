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
        canvas, context,
        particles,
        didInit;
    var circ;

    function Particle(x,y){
        this.x = x+Math.random()*32-16; //note: not an int
        this.y = y+Math.random()*32-16;
    }

    function Circle(x,y,r,vx,vy) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.vx = vx;
        this.vy = vy;
    }

    Circle.prototype.draw = function() {
        context.fillStyle = "#FF0000";
        context.beginPath();
        context.arc(this.x,this.y,this.r,0,2*Math.PI);
        context.fill();
    }

    function update(){
        context.fillStyle = 'rgba(32,32,32,0.3)';
        context.fillRect(0, 0, width, height);
        circ.draw();



        context.fillStyle = 'rgba(255,255,255,1)';
        for (var i=0;i<particles.length;++i) {
            var p = particles[i];
            context.fillRect(p.x, p.y, 2, 2);
        }

        context.lineWidth=1;
        context.fillStyle="#CCCCCC";
        context.font="16px sans-serif";
        context.fillText(""+width+"x"+height+"@"+scale+"x", 10, 25);


        requestAnimationFrame(update);
    }

    function init(){
        canvas = document.getElementById("canvas") || document.createElement("canvas");
        canvas.id = 'canvas';
        document.body.appendChild(canvas);
        resizeCanvas();
        context = canvas.getContext("2d");
        context.scale(scale, scale);

        particles = [];
        circ = new Circle(width*0.5,height*0.5,50, 0, 0); //currently centred

        if(!didInit){
            didInit = true;
            update();
            bindEvents();
        }
    }

    function resizeCanvas(){
        scale = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = window.innerWidth * scale;
        canvas.height = window.innerHeight * scale;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
    }

    function mouseMove(e){
        particles.push(new Particle(e.x,e.y));
        if (particles.length > 10) {
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