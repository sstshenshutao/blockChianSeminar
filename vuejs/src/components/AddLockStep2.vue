<template>
    <div>
        <el-container>
            <el-header>
                <h1>Love Lock -- Block Chain</h1>
            </el-header>
            <canvas-view></canvas-view>
            <el-main>
                <el-row>
                    <el-button type="primary" plain @click="gotoStep1()">PREVIOUS</el-button>
                    <el-button type="success" plain @click="gotoMain()">TO MAIN PAGE</el-button>
                    <el-button type="primary" plain @click="gotoStep3()">NEXT</el-button>
                </el-row>
                <el-tag type="info">Follow the steps below to add a love lock!</el-tag>
            </el-main>
        </el-container>
        <el-steps :active="stepNumber">
            <el-step title="Step 1" icon="el-icon-edit">
            </el-step>
            <el-step title="Step 2" icon="el-icon-upload">
            </el-step>
            <el-step title="Step 3" icon="el-icon-picture">
            </el-step>
        </el-steps>
        <el-container>
            <el-aside width="200px">
                <h3>you choice:</h3>
                <img src="" id="lock-choice">
                <br>
                <p>this is a wonderful lock!</p>
                <p>id: {{this.$route.params['lockInfo'].id}}</p>
            </el-aside>
            <el-container>
                <el-header>
                    <h1>Write down the title and notes</h1>
                </el-header>
                <el-main>
                    Title:
                    <el-input
                            placeholder="write down the title"
                            prefix-icon="el-icon-date"
                            v-model="inputTitle">
                    </el-input>
                    Notes:
                    <el-input
                            placeholder="write down your notes"
                            prefix-icon="el-icon-date"
                            v-model="inputNotes">
                    </el-input>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>

<script>
    import CanvasView from "./CanvasView";
    import * as $ from "jquery"

    export default {
        name: 'Index',
        components: {CanvasView},
        data() {
            return {
                url1: '',
                msg: 'Welcome to Your Vue.js App',
                stepNumber: 2,
                inputTitle: '',
                inputNotes: ''
            }
        },
        mounted() {
            if (!this.$route.params['lockInfo'] || typeof this.$route.params['lockInfo'].lockSrc == "undefined" || typeof this.$route.params['lockInfo'].id == "undefined") {
                this.$message({
                    type: 'info',
                    message: 'choose lock firstly!'
                });
                this.gotoStep1();
            }
            let lockImg = document.getElementById('lock-choice');
            lockImg.src = this.$route.params['lockInfo'].lockSrc;
            lockImg.width = 100
            lockImg.height = 100
        },
        methods: {
            gotoMain() {
                this.$router.push({
                    path: `/`,
                })
            },
            gotoStep3() {
                let newLockInfo =Object.assign(this.$route.params['lockInfo'],
                    {title: this.inputTitle, notes: this.inputNotes});
                console.log("newLockInfo",newLockInfo);
                this.$router.push({
                    name: 'AddLockStep3',
                    params: {
                        lockInfo:newLockInfo
                    }
                })
            },
            gotoStep1() {
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

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
</style>
