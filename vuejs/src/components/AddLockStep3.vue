<template>
    <div>
        <el-container>
            <el-header>
                <h1>Love Lock -- Block Chain</h1>
            </el-header>
            <canvas-draw :title="title"
                         :id="id"
                         :lockSrc="lockSrc"
                         :notes="notes"
                         @clicked="clicked"></canvas-draw>
            <el-main>
                <el-row>
                    <el-button type="primary" plain @click="gotoStep2()">PREVIOUS</el-button>
                    <el-button type="success" plain @click="gotoMain()">TO MAIN PAGE</el-button>
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
            <el-header>
                <h3>Click the picture above to set the location</h3>
            </el-header>
            <el-main>
                <p>here is the lock information</p>
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="Title" name="1">
                        <div>{{title}}</div>
                    </el-collapse-item>
                    <el-collapse-item title="Lock Style" name="2">
                        <el-image
                                style="width: 100px; height: 100px"
                                :src="lockSrc"
                                fit="fill"></el-image>
                    </el-collapse-item>
                    <el-collapse-item title="Notes" name="3">
                        <div>{{notes}}</div>
                    </el-collapse-item>
                    <el-collapse-item title="Location" name="4">
                        <div>{{location}}</div>
                    </el-collapse-item>
                </el-collapse>
            </el-main>
        </el-container>
        <el-dialog title="The transaction information" :visible.sync="dialogTableVisible">
            <el-main>
                <el-button type="success" plain @click="ok()">OK</el-button>
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="Title" name="1">
                        <div>{{title}}</div>
                    </el-collapse-item>
                    <el-collapse-item title="Lock Style" name="2">
                        <el-image
                                style="width: 100px; height: 100px"
                                :src="lockSrc"
                                fit="fill"></el-image>
                    </el-collapse-item>
                    <el-collapse-item title="Notes" name="3">
                        <div>{{notes}}</div>
                    </el-collapse-item>
                    <el-collapse-item title="Location" name="4">
                        <div>{{location}}</div>
                    </el-collapse-item>
                </el-collapse>
            </el-main>
        </el-dialog>
    </div>

</template>

<script>
    import CanvasDraw from "./CanvasDraw";
    import * as $ from "jquery"

    export default {
        name: 'Index',
        components: {CanvasDraw},
        data() {
            return {
                url1: '',
                msg: 'Welcome to Your Vue.js App',
                stepNumber: 3,
                title: '',
                lockSrc: this.$route && this.$route.params && this.$route.params['lockInfo'] ? this.$route.params['lockInfo'].lockSrc : undefined,
                notes: '',
                location: -1,
                id: -1,
                activeNames: ['1', '2', '3', '4'],
                dialogTableVisible: false
            }
        },
        mounted() {
            console.log("LockInfo3", this.$route.params['lockInfo']);
            if (!this.$route.params['lockInfo'] || typeof this.$route.params['lockInfo'].lockSrc == "undefined" || typeof this.$route.params['lockInfo'].id !== "number") {
                this.$message({
                    type: 'info',
                    message: 'choose lock firstly!'
                });
                this.gotoStep1();
            }
            if (!this.$route.params['lockInfo'] || typeof this.$route.params['lockInfo'].title !== "string" || typeof this.$route.params['lockInfo'].notes !== "string") {
                this.$message({
                    type: 'info',
                    message: 'write notes firstly!'
                });
                this.gotoStep2();
            }
            this.title = this.$route.params['lockInfo'].title;
            this.lockSrc = this.$route.params['lockInfo'].lockSrc;
            this.notes = this.$route.params['lockInfo'].notes;
            this.id = this.$route.params['lockInfo'].id;
            this.location = 'please click the picture to get the locationID';
        },
        methods: {
            ok() {
                // todo: this is the entry of web3!!!!
            },
            clicked(locationID) {
                this.location = locationID;
                this.dialogTableVisible = true
            },
            gotoStep2() {
                this.$router.push({
                    name: 'AddLockStep2',
                    params: {
                        lockInfo: this.$route.params['lockInfo']
                    }
                })
            },
            gotoStep1() {
                this.$router.push({
                    path: '/add_lock',
                })
            },
            gotoMain() {
                this.$router.push({
                    path: `/`,
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
