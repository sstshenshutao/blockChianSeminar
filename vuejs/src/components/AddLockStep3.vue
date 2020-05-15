<template>
    <div>
        <el-container>
            <el-header>
                <h1>Love Lock -- Block Chain</h1>
            </el-header>
            <canvas-draw></canvas-draw>
            <el-main>
                <el-row>
                    <el-button type="primary" plain>SEE ALL LOCKS</el-button>
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
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-sm-8 col-sm-push-2">
                        <h1 id="tipps" class="text-center">Choose A Lock</h1>
                        <hr/>
                        <br/>
                    </div>
                </div>

                <div id="petsRow" class="row">
                    <!-- PETS LOAD HERE -->
                </div>
            </div>
            <div id="petTemplate" style="display: none;">
                <div class="col-sm-12 col-md-5 col-lg-2">
                    <div class="panel panel-default panel-pet">
                        <div class="panel-heading">
                            <h3 class="panel-title">Scrappy</h3>
                        </div>
                        <div class="panel-body">
                            <img alt="140x140" data-src="holder.js/140x140" class="img-rounded img-center"
                                 style="width: 100%;"
                                 src="https://animalso.com/wp-content/uploads/2017/01/Golden-Retriever_6.jpg"
                                 data-holder-rendered="true">
                            <br/><br/>
                            <strong>Breed</strong>: <span class="pet-breed">Golden Retriever</span><br/>
                            <strong>Age</strong>: <span class="pet-age">3</span><br/>
                            <strong>Location</strong>: <span class="pet-location">Warren, MI</span><br/><br/>
                            <button class="btn btn-default btn-adopt" type="button" data-id="0" @click="gotoStep2()">
                                choose
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </el-container>
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
                stepNumber: 1
            }
        },
        mounted() {
            this.initLocks()
        },
        methods: {
            gotoMain() {
                this.$router.push({
                    path: `/`,
                })
            },
            initLocks() {
                // Load pets.
                let jsonData = require('../assets/locks.json');
                // axios.get(lockPath).then(data => {
                let data = jsonData;
                var petsRow = $('#petsRow');
                var petTemplate = $('#petTemplate');
                console.log("petTemplate", petTemplate);
                for (let i = 0; i < data.length; i++) {
                    petTemplate.find('.panel-title').text(data[i].name);
                    petTemplate.find('img').attr('src', data[i].picture);
                    petTemplate.find('.pet-breed').text(data[i].breed);
                    petTemplate.find('.pet-age').text(data[i].age);
                    petTemplate.find('.pet-location').text(data[i].location);
                    petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                    petsRow.append(petTemplate.html());
                }
                // });
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
