function initBG(src, cvsID) {
    src = src || "./images/bgNew.png";
    console.log("initBG",src)
    cvsID = cvsID || "cvs";
    var cvs = document.getElementById(cvsID);
    var imgObj = new Image();
    imgObj.src = src;
    imgObj.onload = function () {
        var ctx = cvs.getContext('2d');
        ctx.drawImage(this, 0, 0);
    };

}

export default initBG;
