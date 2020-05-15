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
                canvasOpInstance: ''
            }
        }
        ,
        mounted() {
            initBG(this.bgUrl);
            this.canvasOpInstance = CanvasOp.getInstance({
                lockSrc: this.defaultLockUrl
            });
            this.canvasOpInstance.bindClickDraw(this.handleCanvasClickEvent)
        },
        methods: {
            handleCanvasClickEvent(locationID) {
                // // this is click => draw
                //    call show the content and title of locationID
                //    if there are no locks with locationID, do
                this.$message({
                    type: 'info',
                    message: 'hey, you draw one lock, pay it now'
                });
            }
        }
    }
</script>
<style>
    @import "../assets/css/bootstrap.min.css";
</style>
