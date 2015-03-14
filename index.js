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
    // define number of particles that can exist at one time
    var NUM_PARTICLES = 1000;
    var bg_color = "#33CCFF"; //rgb(51, 204, 255)
    var bg_update_color = 'rgb(51, 204, 255, 0.3)';
    var circ_color = "#FFCC00";
    var particle_color = "#00FF00";

    function Particle(x,y){
        //generate a random offset for a spawned particle
        var angle = Math.random()*2*Math.PI;
        var dist = Math.random()*64;
        this.x = x+Math.cos(angle)*dist;
        this.y = y-Math.sin(angle)*dist;
    }

    function Circle(x,y,r,vx,vy) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.vx = vx;
        this.vy = vy;
    }

    Circle.prototype.draw = function() {
        context.fillStyle = circ_color;
        context.beginPath();
        context.arc(this.x,this.y,this.r,0,2*Math.PI);
        context.fill();
    }

    function update(){
        context.fillStyle = bg_color;
        context.fillRect(0, 0, width, height);
        circ.draw();
        
        if (touchdown) {
            particles.push(new Particle(touchx,touchy));
            particles.push(new Particle(touchx,touchy));

            while (particles.length > NUM_PARTICLES) {
                particles.shift();
            }
        }

        context.fillStyle = particle_color;
        for (var i=0;i<particles.length;++i) {
            var p = particles[i];
            context.fillRect(p.x, p.y, 3, 3);
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
        circ = new Circle(width*0.5,height*0.5,50, 0, 0); // centred

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
        if (particles.length > NUM_PARTICLES) {
            particles.shift();
        }
    }
    var touchdown = false;
    var touchx, touchy;
    function bindEvents(){
        window.addEventListener('resize', init);
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('touchmove', function(e){
            e.preventDefault();
            var touch = e.changedTouches[0];
            mouseMove({'x':touch.clientX,'y':touch.clientY});
            touchx = touch.clientX;
            touchy = touch.clientY;
        });
        window.addEventListener('touchstart', function(e){
            var touch = e.changedTouches[0];
            mouseMove({'x':touch.clientX,'y':touch.clientY});
            touchdown = true;
            touchx = touch.clientX;
            touchy = touch.clientY;
        });
        window.addEventListener('touchend', function(e){
            var touch = e.changedTouches[0];
            mouseMove({'x':touch.clientX,'y':touch.clientY});
            touchdown = false;
        });
    }

    init();
})();