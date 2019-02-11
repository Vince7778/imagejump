var image = new Image();

var canvas = document.getElementById("canvs");
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext("2d");

var coarseness = 200;
var cn = coarseness;

var contrast = 100;

var downSpeed = 0;

var boxX = 0;
var boxY = 0;
var size = 10;

var cacheImage;

var bodyel = document.getElementById("bodyel");

var revealCollision = false;

var firstLoad = true;
var waitingForClick = true;

var blackwhitetimer;

var drawBW = false;

image.onload = function(){
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image,0,0,image.width,image.height);

    canvas2.width = image.width;
    canvas2.height = image.height;
    ctx2.drawImage(image,0,0,image.width,image.height);

    boxX = 0;
    boxY = 0;

    animx = 0;
    animy = 0;

    cacheImage = ctx.getImageData(0,0,canvas.width,canvas.height).data;

    waitingForClick = true;
    donedraw = false;

    requestAnimationFrame(blackwhite);

};

var animx = 0;
var animy = 0;
var donedraw = false;
var pps = 4000;

function blackwhite() {

    if (!donedraw) {
        for (var k = 0; k < pps; k++) {
            var color = getImageDataFaster(animx,animy,1,1,canvas.width,canvas.height,cacheImage);
            var sum = color[0] + color[1] + color[2];
            if (sum <= contrast * 3) {
                ctx2.fillStyle = "rgba(0,0,0)";
            } else {
                ctx2.fillStyle = "rgba(255,255,255)";
            }
            ctx2.fillRect(animx,animy,1,1);
            animx++;
            if (animx >= canvas2.width) {
                animy++;
                animx = 0;
            }
            if (animy >= canvas2.height) donedraw = true;
        }
    }

    if (drawBW) {
        ctx.drawImage(canvas2,0,0);
    } else {
        ctx.drawImage(image,0,0);
    }

    if (!donedraw) {
        requestAnimationFrame(blackwhite);
    }
}

function toggleBW() {
    drawBW = !drawBW;
    revealCollision = false;
    document.getElementById("revealbox").checked = false;
}

function toggleReveal() {
    revealCollision = !revealCollision;
    drawBW = false;
    document.getElementById("bwbox").checked = false;
}

function previewFile(){
    var file    = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();

    reader.onloadend = function () {
        image.src = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    }
}

var jumpCooldown = 0;

function doThing() {
    if (drawBW) {
        ctx.drawImage(canvas2,0,0);
    } else {
        ctx.drawImage(image,0,0);
    }
    if (!waitingForClick) {
        jumpCooldown--;
        if (keysHeld[1]) {
            goRight(3);
        }
        if (keysHeld[0]) {
            goLeft(3);
        }
        if (keysHeld[2] && jumpCooldown <= 0 && (doublejump || (!doublejump && onground))) {
            jumpCooldown = 10;
            downSpeed = -5;
            onground = false;
        }
        downSpeed += 0.2;
        gravity(downSpeed);
        ctx.fillStyle="#FF0000";
        ctx.fillRect(boxX,boxY,size,size);
        if (revealCollision) {
            drawCollision(50);
        }
    }
    requestAnimationFrame(doThing);
}

var keysHeld = [false,false,false];

bodyel.onkeyup = function(e) {
    if (e.keyCode == 38 || e.keyCode == 87) {
        keysHeld[2] = false;
    }
    if (e.keyCode == 39 || e.keyCode == 68) {
        keysHeld[1] = false;
    }
    if (e.keyCode == 37 || e.keyCode == 65) {
        keysHeld[0] = false;
    }
};

bodyel.onkeydown = function(e) {
    if (e.keyCode == 38 || e.keyCode == 87) {
        e.preventDefault();
        keysHeld[2] = true;
    }
    if (e.keyCode == 39 || e.keyCode == 68) {
        e.preventDefault();
        keysHeld[1] = true;
    }
    if (e.keyCode == 37 || e.keyCode == 65) {
        e.preventDefault();
        keysHeld[0] = true;
    }
};

canvas.onclick = function(e) {
    waitingForClick = false;
    boxX = e.offsetX;
    boxY = e.offsetY;
    if (firstLoad) requestAnimationFrame(doThing);
    firstLoad = false;
};

function drawCollision(n) {
    for (var i = boxX-n; i <= boxX+n; i++) {
        for (var j = boxY-n; j <= boxY+n; j++) {
            var color = getImageDataFaster(i,j,1,1,canvas.width,canvas.height,cacheImage);
            var sum = color[0] + color[1] + color[2];
            if (sum <= contrast * 3) {
                ctx.fillStyle = "rgba(0,0,0,.5)";
            } else {
                ctx.fillStyle = "rgba(255,255,255,.5)";
            }
            ctx.fillRect(i,j,1,1);
        }
    }
}

image.src = "image.png";
