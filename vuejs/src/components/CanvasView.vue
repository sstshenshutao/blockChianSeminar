<template>
    <div>
        <canvas id="cvs" width="6398" height="360" style="border:1px solid #ccc;margin:20px auto;display: block;">
            browser wrong
        </canvas>
    </div>
</template>
<style>

</style>
<script>
    import initBG from '../js/view/draw-bg'
    import CanvasOp from '../js/view/canvas-op'

    export default {
        data() {
            return {
                bgUrl: require('../assets/images/bgNew.png'),
                defaultLockUrl: require('../assets/images/locks/lock1.png'),
                canvasOpInstance: '',
                locksSrc: [
                    require('../assets/images/locks/lock0.png'),
                    require('../assets/images/locks/lock1.png'),
                    require('../assets/images/locks/lock2.png'),
                    require('../assets/images/locks/lock3.png')
                ],
            }
        }
        ,
        async mounted() {
            initBG(this.bgUrl);
            this.canvasOpInstance = CanvasOp.getInstance({
                lockSrc: this.defaultLockUrl
            });
            this.canvasOpInstance.bindClickView(this.handleCanvasClickEvent)
            await this.appInit();
            await this.getHangObj();
        },
        methods: {
            async appInit() {
                let app = this.$llApp;
                if (!app.initOK) {
                    await app.init();
                }
            },
            open() {
            },
            handleCanvasClickEvent(locationID) {
                // this is click => view
                //    call show the content and title of locationID
                //    if there are no locks with locationID, do
                this.$message({
                    type: 'info',
                    message: 'nothing here'
                });
            },
            async getHangObj() {
                let ret = [];
                let app = this.$llApp;
                let len = await app.getUsedSlotLength();
                console.log("len", len)
                for (let i = 0; i < len; i++) {
                    let slotId = await app.getUsedSlot(i);
                    let tokenId = await app.getLockOnSlot(slotId);
                    let lockOne = await app.loveLocks(tokenId);
                    let note = undefined
                    let notesLength = Number.parseInt(lockOne.currentLength.toString());
                    console.log("lockOnelockOnelockOne", notesLength)
                    if (notesLength > 0) {
                        note = await app.getNote(tokenId);
                    }
                    console.log("lockOne", lockOne)
                    console.log("lockOne:tokenId", tokenId.toString())
                    let normPara = CanvasOp.calculateNormalizationXY(lockOne.slotPos - 1, 0, 180);
                    let content = note ? note : "No Titles and Notes";
                    this.canvasOpInstance.drawLock(normPara.x, normPara.y, this.locksSrc[lockOne.styleId], content);
                }
            }
        }
    }
</script>
<style>
    @import "../assets/css/bootstrap.min.css";
</style>
