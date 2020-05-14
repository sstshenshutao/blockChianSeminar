var cvs = document.getElementById("cvs");
var canva = cvs;

// canva.onmousedown=
// let lockX = e.layerX;
// let lockY = e.layerY;
// lk1.src = "./images/locks/lock1.png";
export function setClickDraw(callback) {
    canva.onmousedown= x=>clickDraw(x,callback);
}

function clickDraw(event,callback) {
    let lockX = event.layerX;
    let lockY = event.layerY;
    let baseX = 0;
    let baseY = 180;
    if (lockY<180 || lockY>360|| lockX>6350 || lockX<0){
        return;
    }
    // todo change later lock style
    let src = "./images/locks/lock1.png";
    let lockLocationId = Math.ceil((lockX-baseX)/50)*3+Math.ceil((lockY-baseY)/50);
    drawLock(lockX,lockY,src,"hi this is new");
    callback(lockLocationId);
}

export function drawLock(lockX, lockY, src, text) {
    let lk1 = new Image();
    lk1.src = src;
    lk1.onload = function () {
        var ctx = cvs.getContext('2d');
        ctx.drawImage(this, lockX - 25, lockY - 25, 50, 50);
        // line
        ctx.lineCap = 'round';
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath();
        ctx.moveTo(lockX, lockY);
        ctx.lineTo(lockX, lockY - 140);
        ctx.stroke();
        // text
        ctx.font = "20px serif";
        ctx.fillStyle = "#FF0000";
        ctx.fillText(text, lockX, lockY - 140);
    };
}

// export default {drawLock,clickDraw};