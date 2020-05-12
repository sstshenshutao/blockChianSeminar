var cvs = document.getElementById("cvs");
var imgObj = new Image();
imgObj.src = "./images/bgNew.png";
imgObj.onload = function(){
    var ctx = cvs.getContext('2d');
    ctx.drawImage(this, 0, 0);
};