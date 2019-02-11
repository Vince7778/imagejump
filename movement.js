
var doublejump = true;
var onground = false;

function toggleDJ() {
    doublejump = !doublejump;
}

function goRight(n) {
    var fin = false;
    for (var k = 0; k < n; k++) {
        var done = false;
        for (var i = boxX+size; i < 5+boxX+size; i++) {
            for (var j = size+boxY-1; j >= boxY+1; j--) {
                var color = getImageDataFaster(i,j,1,1,canvas.width,canvas.height,cacheImage);
                var sum = color[0]+color[1]+color[2];
                if (sum <= contrast*3) {
                    if (i > boxX+size) {
                        done = true;
                        boxX++;
                    } else if (j == size+boxY-1 && (doublejump || (!doublejump && onground))) {
                        downSpeed = -2;
                        fin = true;
                        onground = false;
                    } else {
                        fin = true;
                    }
                    break;
                }
            }
            if (done || fin) break;
        }
        if (!done && !fin) boxX++;
        if (fin) break;
    }
}

function goLeft(n) {
    var fin = false;
    for (var k = 0; k < n; k++) {
        var done = false;
        for (var i = boxX; i > boxX-5; i--) {
            for (var j = size+boxY-1; j >= boxY+1; j--) {
                var color = getImageDataFaster(i,j,1,1,canvas.width,canvas.height,cacheImage);
                var sum = color[0]+color[1]+color[2];
                if (sum <= contrast*3) {
                    if (i < boxX) {
                        done = true;
                        boxX--;
                    } else if (j == size+boxY-1 && (doublejump || (!doublejump && onground))) {
                        downSpeed = -2;
                        fin = true;
                        onground = false;
                    } else {
                        fin = true;
                    }
                    break;
                }
            }
            if (done || fin) break;
        }
        if (!done && !fin) boxX--;
        if (fin) break;
    }
}

function gravity(n) {
    if (downSpeed < 0) {
        moveup(-n);
        return;
    }
    var fin = false;
    for (var k = 0; k < n-1; k++) {
        var done = false;
        for (var i = boxY+size; i < 5+boxY+size; i++) {
            for (var j = boxX+1; j <= size+boxX-1; j++) {
                var color = getImageDataFaster(j,i,1,1,canvas.width,canvas.height,cacheImage);
                var sum = color[0]+color[1]+color[2];
                if (sum <= contrast*3) {
                    if (i > boxY+size) {
                        onground = false;
                        done = true;
                        boxY++;
                    } else {
                        onground = true;
                        downSpeed = 0;
                        fin = true;
                    }
                    break;
                }
            }
            if (done || fin) break;
        }
        if (!done && !fin) {
            onground = false;
            boxY++;
        }
        if (fin) break;
    }
}

function moveup(n) {
    var fin = false;
    for (var k = 0; k < n; k++) {
        var done = false;
        for (var i = boxY; i > boxY-5; i--) {
            for (var j = boxX+1; j <= size+boxX-1; j++) {
                var color = getImageDataFaster(j,i,1,1,canvas.width,canvas.height,cacheImage);
                var sum = color[0]+color[1]+color[2];
                if (sum <= contrast*3) {
                    if (i < boxY) {
                        done = true;
                        boxY--;
                    } else {
                        downSpeed = 1;
                        fin = true;
                    }
                    break;
                }
            }
            if (done || fin) break;
        }
        if (!done && !fin) boxY--;
        if (fin) break;
    }
}