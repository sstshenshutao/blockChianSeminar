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
            this.canvasOpInstance.bindClickView(this.handleCanvasClickEvent)
        },
        methods: {
            open() {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleCanvasClickEvent(locationID) {
                // this is click => view
                //    call show the content and title of locationID
                //    if there are no locks with locationID, do
                this.$message({
                    type: 'info',
                    message: 'this is click=>view' +
                        'hey, no locks there, see another one'
                });
            }
        }
    }
</script>
<style>
    @import "../assets/css/bootstrap.min.css";
</style>
