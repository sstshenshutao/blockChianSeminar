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
        },
        props: {
            title: String,
            id: Number,
            lockSrc: String,
            notes: String
        },
        mounted() {
            initBG(this.bgUrl);
            this.canvasOpInstance = CanvasOp.getInstance({
                lockSrc: this.defaultLockUrl
            });
            this.canvasOpInstance.bindClickDraw(this.handleCanvasClickEvent, {
                title: "I LOVE LL Online",
                lockSrc: "this guy is too lazy, nothing here"
            })
        },
        watch: {
            title: 'bindClickDraw',
            id: 'bindClickDraw',
            lockSrc: 'bindClickDraw',
            notes: 'bindClickDraw'
        },
        methods: {
            bindClickDraw() {
                this.canvasOpInstance.bindClickDraw(this.handleCanvasClickEvent, {
                    title: this.title,
                    lockSrc: this.lockSrc
                }, this.isLocationAvailable)
            },
            handleCanvasClickEvent(locationID) {
                // // this is click => draw
                //    call show the content and title of locationID
                //    if there are no locks with locationID, do
                // drawable
                this.$emit('clicked', locationID);
                this.$message({
                    type: 'info',
                    message: 'hey, you draw one lock, pay it now'
                });

            },
            isLocationAvailable(event) {
                return true;
            }
        }
    }
</script>
<style>
    @import "../assets/css/bootstrap.min.css";
</style>
