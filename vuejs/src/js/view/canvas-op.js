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
     */
    bindClickDraw(callback) {
        console.log("bindClickDraw:this.cvs", this.cvs)
        this.cvs.onmousedown = x => this.clickDraw(x, callback);
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
        console.log("clickView",lockX,lockY);
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
        console.log("clickDraw",lockX,lockY);
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
        let src = this.options['lockSrc'];
        //calculate LockLocationID

        this.drawLock(lockX, lockY, src, "new Love Lock");
        let locationID = CanvasOp.calculateLocationId(lockX, lockY, baseX, baseY);
        callback(locationID);
    }

    static calculateLocationId(x, y, baseX, baseY) {
        return Math.ceil((x - baseX) / 50) * 3 + Math.ceil((y - baseY) / 50);
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

