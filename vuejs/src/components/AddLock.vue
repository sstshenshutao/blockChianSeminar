<template>
    <div>
        <el-container>
            <el-header>
                <h1>Love Lock -- Block Chain</h1>
            </el-header>
            <canvas-view></canvas-view>
            <el-main>
                <el-row>
                    <el-button type="success" plain @click="gotoMain()">TO MAIN PAGE</el-button>
                    <el-button type="primary" plain @click="gotoStep2()">NEXT</el-button>
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
                        <h1 id="tipps" class="text-center">Buy A Lock</h1>
                        <hr/>
                        <br/>
                    </div>
                </div>

                <div id="petsRow" class="row">
                    <!-- PETS LOAD HERE -->
                </div>
            </div>
            <!--            tokenID:tokenIDs[i],-->
            <!--            owner:tmp.owner,-->
            <!--            price:tmp.price,-->
            <!--            loveLock:lock-->
            <!--            string title;-->
            <!--            string[] notes;-->
            <!--            uint32 currentLength;-->
            <!--            uint32 notesLimit;-->
            <!--            uint32 styleId;-->
            <!--            uint256 slotPos;-->
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
                            <strong>Lock ID</strong>: <span class="token-id">tokenID</span><br/>
                            <strong>Price</strong>: <span class="price">price</span><br/>
                            <strong>Notes Limit</strong>: <span class="notes-limit">notesLimit</span><br/>
                            <strong>styleId</strong>: <span class="style-id">styleId</span><br/>
                            <strong>owner</strong>: <span class="owner">owner</span><br/><br/>
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
    import CanvasView from "./CanvasView";
    import * as $ from "jquery"

    export default {
        name: 'Index',
        components: {CanvasView},
        data() {
            return {
                url1: '',
                msg: 'Welcome to Your Vue.js App',
                stepNumber: 1,
                locksSrc: [
                    require('../assets/images/locks/lock0.png'),
                    require('../assets/images/locks/lock1.png'),
                    require('../assets/images/locks/lock2.png'),
                    require('../assets/images/locks/lock3.png')
                ],
                allSaleObjs: []
            }
        },
        async mounted() {
            await this.appInit();
            await this.initLocks()
        },
        methods: {
            async buy(event) {
                let app = this.$llApp;
                let i = parseInt($(event.target).data('id'));
                let lockID = this.allSaleObjs[i].tokenID;
                let result = await app.buyLock(lockID, this.allSaleObjs[i].price);
                console.log("i", i)
                // console.log("$(event.target)",$(event.target).data('id'))
                console.log("buy result", result)
                if (result) {
                    this.gotoStep2(lockID, this.locksSrc[this.allSaleObjs[i].loveLock.styleId])
                }
            },
            async appInit() {
                let app = this.$llApp;
                if (!app.initOK) {
                    await app.init();
                }
            },
            async getToSellLength() {
                let app = this.$llApp;
                // console.log(this.cLevelParameter.inputCOOAddress);
                let length = 0
                try {
                    length = await app.getToSellLength();
                } catch (e) {
                    this.$message.error(e);
                }
                return length;
            },
            async getAllSaleTokenIDs() {
                let length = await this.getToSellLength();
                console.log("getAllSaleTokenIDs::length", length)
                let app = this.$llApp;
                let tokenIDs = [];
                // console.log(this.cLevelParameter.inputCOOAddress);
                try {
                    for (let i = 0; i < length; i++) {
                        tokenIDs.push(await app.getSaleLock(i))
                    }
                } catch (e) {
                    this.$message.error(e);
                }
                console.log("getAllSaleTokenIDs", tokenIDs)
                return tokenIDs;
            },
            async getAllSaleObjs() {
                let ret = [];
                let app = this.$llApp;
                let tokenIDs = await this.getAllSaleTokenIDs();
                for (let i = 0; i < tokenIDs.length; i++) {
                    let tmp = await app.tokenToSaleLocks(tokenIDs[i])
                    let lock = await app.loveLocks(tokenIDs[i]);
                    ret.push({
                        tokenID: tokenIDs[i],
                        owner: tmp.owner,
                        price: tmp.price,
                        loveLock: lock
                    })
                }
                console.log("getAllSaleObjs", ret)
                this.allSaleObjs = ret;
                return ret;
            },
            gotoMain() {
                this.$router.push({
                    path: `/`,
                })
            },
            async initLocks() {
                // Load locks.
                let dataObjs = await this.getAllSaleObjs();
                // axios.get(lockPath).then(data => {
                let data = dataObjs;
                var petsRow = $('#petsRow');
                var petTemplate = $('#petTemplate');


                // console.log("petTemplate", petTemplate);
                for (let i = 0; i < data.length; i++) {
                    petTemplate.find('.owner').text(data[i].owner);
                    petTemplate.find('img').attr('src', this.locksSrc[data[i].loveLock.styleId]);
                    petTemplate.find('.price').text(data[i].price);
                    petTemplate.find('.notes-limit').text(data[i].loveLock.notesLimit);
                    petTemplate.find('.style-id').text(data[i].loveLock.styleId);
                    petTemplate.find('.token-id').text(data[i].tokenID);
                    petTemplate.find('.btn-adopt').attr('data-id', i);
                    // console.log("petTemplate.html()", petTemplate.html())
                    petsRow.append(petTemplate.html());
                }
                $(document).on('click', '.btn-adopt', this.buy);
                // });
            },
            gotoStep2(lockID, src) {
                console.log("gotoStep2 with lockID", lockID);
                this.$router.push({
                    name: 'AddLockStep2',
                    params: {
                        lockInfo: {
                            id: lockID,
                            lockSrc: src
                        }
                    }
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
