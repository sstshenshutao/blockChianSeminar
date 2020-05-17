<template>
    <div>
        <el-container>
            <el-header>
                <h1>Love Lock -- Block Chain</h1>
            </el-header>
            <canvas-view></canvas-view>
            <el-main>
                <el-row>
                    <el-tag type="info">click the canvas to see the lock information</el-tag>
                </el-row>
                <el-row>
                    <el-button type="primary" plain>SEE ALL LOCKS</el-button>
                    <el-button type="success" plain @click="addLock()">ADD MY LOCK</el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>

</template>

<script>
    import CanvasView from "./CanvasView";

    export default {
        name: 'Index',
        components: {CanvasView},
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
                activeName: '1'
            }
        },
        mounted() {
            console.log("window.web3", window.web3)
            console.log("window.ethereum", window.ethereum)
            console.log("new Web3.providers.HttpProvider('http://localhost:7545')", new Web3.providers.HttpProvider('http://localhost:7545'))
        },
        methods: {
            addLock() {
                this.$router.push({
                    path: '/add_lock',
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    @import url('//unpkg.com/element-ui@2.13.1/lib/theme-chalk/index.css');

    .el-header, .el-footer {
        background-color: #B0C4DE;
        color: #ffffff;
        text-align: center;
        line-height: 60px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 50px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }
</style>
