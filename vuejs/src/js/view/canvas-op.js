export default class CanvasOp {
    constructor(cvsID, options) {
        cvsID = cvsID || 'cvs';
        this.cvs = document.getElementById(cvsID);
        console.log("constructor:this.cvs", this.cvs)
        this.options = options || {};
    }

    /**
     * deprecated
     * @param callback
     * @param options
     */
    bindClickCallback(callback, options) {
        if (callback) {
            if (options) {
                if (options['beforeCB']) {
                    callback = () => {
                        options['beforeCB']();
                        callback();
                    }
                }
                if (options['afterCB']) {
                    callback = () => {
                        callback();
                        options['afterCB']();
                    }
                }
            }
            this.cvs.onmousedown = () => callback();
        }

    }

    /**
     * this will invoke callback(locationID)
     * @param callback
     * @param parameters
     * @param beforeCheck
     */
    bindClickDraw(callback, parameters, beforeCheck) {
        console.log("bindClickDraw:this.cvs", this.cvs)
        this['drawParas'] = parameters;
        if (beforeCheck) {
            this.cvs.onmousedown = x => {
                beforeCheck(x) && this.clickDraw(x, callback)
            };
        } else {
            this.cvs.onmousedown = x => {
                this.clickDraw(x, callback)
            };
        }

    }

    bindClickView(callback) {
        console.log("bindClickView:this.cvs", this.cvs)
        this.cvs.onmousedown = x => this.clickView(x, callback);
    }

    setDrawOptions(options) {
        this.options = options;
    }

    clickView(event, callback) {
        let lockX = event.layerX;
        let lockY = event.layerY;
        console.log("clickView", lockX, lockY);
        let baseX = (this.options['boundary'] && this.options['boundary']['x']) ? this.options['boundary']['x'][0] : 0;

        let baseY = (this.options['boundary'] && this.options['boundary']['y']) ? this.options['boundary']['y'][0] : 180;
        let boundary = this.options['boundary'] || {
            x: [0, 6350],
            y: [180, 360]
        };
        if (lockY < boundary.y[0] || lockY > boundary.y[1] || lockX > boundary.x[1] || lockX < boundary.x[0]) {
            return;
        }
        let locationID = CanvasOp.calculateLocationId(lockX, lockY, baseX, baseY);
        callback(locationID);
    }

    clickDraw(event, callback) {
        let lockX = event.layerX;
        let lockY = event.layerY;
        console.log("clickDraw", lockX, lockY);
        let baseX = (this.options['boundary'] && this.options['boundary']['x']) ? this.options['boundary']['x'][0] : 0;

        let baseY = (this.options['boundary'] && this.options['boundary']['y']) ? this.options['boundary']['y'][0] : 180;
        let boundary = this.options['boundary'] || {
            x: [0, 6350],
            y: [180, 360]
        };
        if (lockY < boundary.y[0] || lockY > boundary.y[1] || lockX > boundary.x[1] || lockX < boundary.x[0]) {
            return;
        }
        // todo change later lock style
        let src = this.drawParas['lockSrc'] || this.options['lockSrc'];
        //calculate LockLocationID
        let locationID = CanvasOp.calculateLocationId(lockX, lockY, baseX, baseY);
        let normPara = CanvasOp.calculateNormalizationXY(locationID, baseX, baseY);
        this.drawLock(normPara.x, normPara.y, src, this.drawParas['title']);

        callback(locationID);
    }

    static calculateLocationId(x, y, baseX, baseY, width = 50, height = 50) {
        console.log("click xy", x, y);
        let xOffset = Math.floor((x - baseX) / width);
        let yOffset = Math.floor((y - baseY) / height);
        yOffset = yOffset > 2 ? 2 : yOffset;
        console.log("xyOffset", xOffset, yOffset);
        return xOffset * 3 + yOffset;
    }

    static calculateNormalizationXY(locationID, baseX, baseY, width = 50, height = 50) {
        console.log("locationID", locationID);
        let row = Math.floor(locationID % 3);
        let column = Math.floor(locationID / 3);
        console.log("row", row);
        console.log("column", column);
        console.log("new XY", column * width + baseX + width / 2, row * height + baseY + height / 2);
        return {
            x: column * width + baseX + width / 2,
            y: row * height + baseY + height / 2
        }
    }

    /**
     *
     * @param lockX center of x
     * @param lockY center of y
     * @param src
     * @param text
     */
    drawLock(lockX, lockY, src, text) {
        let lk1 = new Image();
        lk1.src = src || this.options['lockSrc'];
        let lockWidth = this.options['lockWidth'] || 50;
        let lockHeight = this.options['lockHeight'] || 50;
        let self = this;
        lk1.onload = function () {
            let ctx = self.cvs.getContext('2d');
            ctx.drawImage(this, lockX - lockWidth / 2, lockY - lockHeight / 2, lockWidth, lockHeight);
            // todo: remove them later, they are useful for debug
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

    static getInstance(options) {
        canvasOP = new CanvasOp('cvs', options);
        return canvasOP;
    }
}
let canvasOP;

