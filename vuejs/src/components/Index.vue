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
                    <el-button type="primary" plain @click="dialogAdminVisible=true">ADMIN COMMAND</el-button>
                    <el-button type="primary" plain @click="clickViewContract()">SEE CONTRACT INFO</el-button>
                    <el-button type="success" plain @click="addLock()">ADD New LOCK</el-button>
                    <el-button type="primary" plain @click="getMyLock()">SEE MY LOCKS</el-button>

                </el-row>
            </el-main>
        </el-container>
        <el-dialog title="The contract information" :visible.sync="dialogTableVisible">
            <el-main>
                <el-button type="success" plain @click="dialogTableVisible = false">OK</el-button>
                <el-collapse v-model="activeContractInfos">
                    <el-collapse-item title="LoveLockBase Contract" name="1">
                        <ul>
                            <li>contractAddress: {{basicInfo.contractAddress}}</li>
                            <li>name: {{basicInfo.name}}</li>
                            <li>symbol: {{basicInfo.symbol}}</li>
                            <li>baseURI: {{basicInfo.baseURI}}</li>
                            <li>ceoAddress: {{basicInfo.ceoAddress}}</li>
                            <li>cooAddress: {{basicInfo.cooAddress}}</li>
                            <li>totalSupply: {{basicInfo.totalSupply}}</li>
                            <li>numLoveLocks: {{basicInfo.numLoveLocks}}</li>
                            <li>saleContract: {{basicInfo.saleContract}}</li>
                            <li>COOHandleFee: {{basicInfo.defaultPrice}}</li>
                        </ul>
                    </el-collapse-item>
                    <el-collapse-item title="SaleLoveLock Contract" name="2">
                        <ul>
                            <li>contractAddress: {{saleBasicInfo.contractAddress}}</li>
                            <li>ceoAddress: {{saleBasicInfo.ceoAddress}}</li>
                            <li>cooAddress: {{saleBasicInfo.cooAddress}}</li>
                            <li>saleProductCountNow: {{saleBasicInfo.toSellLength}}</li>
                            <li>LoveLockBaseContract: {{saleBasicInfo.nonFungibleContract}}</li>
                        </ul>
                    </el-collapse-item>
                </el-collapse>
            </el-main>
        </el-dialog>
        <el-dialog title="The admin commands" :visible.sync="dialogAdminVisible">
            <el-main>
                <el-button type="success" plain @click="dialogAdminVisible = false">OK</el-button>
                <el-collapse v-model="activeContractInfos">
                    <el-collapse-item title="1.INIT_COMMAND" name="1">
                        <el-row>
                            <el-input v-model="cLevelParameter.inputSLLAddress"
                                      placeholder="SaleLoveLock smart contract address">
                                <el-button slot="append" icon="el-icon-search" @click="setSLLAddress()">bind SLL
                                </el-button>
                            </el-input>
                        </el-row>
                        <el-row>
                            <el-input v-model="cLevelParameter.inputLLBAddress"
                                      placeholder="LoveLockBase smart contract address">
                                <el-button slot="append" icon="el-icon-search" @click="setLLBAddress()">bind LLB
                                </el-button>
                            </el-input>
                        </el-row>
                        <el-row>
                            <el-input v-model="cLevelParameter.inputCOOAddress" placeholder="coo address">
                                <el-button slot="append" icon="el-icon-search" @click="setCOO()">set COO
                                </el-button>
                                <el-button slot="append" icon="el-icon-search" @click="setSLLCOO()">set SLL-COO
                                </el-button>
                            </el-input>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="2.TOKEN_HANDLE" name="2">
                        <el-row>
                            <el-input v-model="cLevelParameter.inputDelTokenID" placeholder="tokenID">
                                <el-button slot="append" icon="el-icon-search" @click="deleteLock()">delete lock forever
                                </el-button>
                            </el-input>
                        </el-row>

                        <el-form ref="form" :model="cLevelParameter.inputLockForm" label-width="100px">
                            <el-form-item label="style ID">
                                <el-input v-model="cLevelParameter.inputLockForm.styleId"></el-input>
                            </el-form-item>
                            <el-form-item label="notes limit">
                                <el-input v-model="cLevelParameter.inputLockForm.notesLimit"></el-input>
                            </el-form-item>
                            <el-form-item label="owner">
                                <el-input v-model="cLevelParameter.inputLockForm.owner"></el-input>
                            </el-form-item>
                            <el-row>
                                <el-button type="primary" plain @click="createLLtoSell()">Create to sell</el-button>
                                <el-button type="primary" plain @click="createLL()">Award someone</el-button>
                            </el-row>
                        </el-form>

                        <el-row>
                            <el-input v-model="cLevelParameter.inputCOOAddress" placeholder="coo address">
                                <el-button slot="append" icon="el-icon-search" @click="setCOO()">set COO
                                </el-button>
                                <el-button slot="append" icon="el-icon-search" @click="setSLLCOO()">set SLL-COO
                                </el-button>
                            </el-input>
                        </el-row>
                        deleteLock :burn
                        createLL :mint
                        createLLtoSell :generate

                    </el-collapse-item>
                </el-collapse>
            </el-main>
        </el-dialog>
        <el-dialog title="My Locks" :visible.sync="locksVisible">
            <el-main>
                <el-button type="success" plain @click="locksVisible = false">OK</el-button>
                        <ul id="myLocks">

                        </ul>
            </el-main>
        </el-dialog>
    </div>

</template>

<script>
    import CanvasView from "./CanvasView";
    import App from "../js/api/app"

    export default {
        name: 'Index',
        components: {CanvasView},
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
                activeName: '1',
                dialogTableVisible: false,
                dialogAdminVisible: false,
                locksVisible:false,
                contractInfo: {},
                activeContractInfos: ['1', '2'],
                basicInfo: {
                    contractAddress: "error by reading this attribute",
                    name: 'error by reading this attribute',
                    symbol: 'error by reading this attribute',
                    baseURI: 'error by reading this attribute',
                    ceoAddress: 'error by reading this attribute',
                    cooAddress: 'error by reading this attribute',
                    totalSupply: 'error by reading this attribute',
                    numLoveLocks: 'error by reading this attribute',
                    saleContract: 'error by reading this attribute',
                    defaultPrice: 'error by reading this attribute',
                },
                saleBasicInfo: {
                    contractAddress: "error by reading this attribute",
                    ceoAddress: 'error by reading this attribute',
                    cooAddress: 'error by reading this attribute',
                    toSellLength: 'error by reading this attribute',
                    nonFungibleContract: 'error by reading this attribute'
                },
                cLevelParameter: {
                    inputCOOAddress: '',
                    inputSLLAddress: '',
                    inputLLBAddress: '',
                    inputLockForm: {
                        notesLimit: '',
                        owner: '',
                        styleId: '',
                    },
                    inputDelTokenID: ''
                }

            }
        },
        async mounted() {
            await this.appInit();
            await this.basicInfoRead();
            await this.initInput();
        },
        methods: {
            async getMyLock(){
                this.locksVisible=true;
                let app = this.$llApp;
                let ttLength = await app.getTotalSupply();
                ttLength = Number.parseInt(ttLength);
                let ul = document.getElementById('myLocks');
                ul.innerHTML = "";
                for (let i = 0; i <ttLength; i++) {
                    let tokenID = (await app.tokenOfOwnerByIndex(i)).toString();
                    if (tokenID!=='3963877391197344453575983046348115674221700746820753546331534351508065746944'){

                        let lockOne = await app.loveLocks(tokenID);
                        let li = document.createElement("li");
                        let notesLength = Number.parseInt(lockOne.currentLength.toString());
                        li.appendChild(document.createTextNode("notesLength: "+notesLength));
                        li.appendChild(document.createTextNode("; notesLimit: "+lockOne.notesLimit.toString()));
                        li.appendChild(document.createTextNode("; styleId: "+lockOne.styleId.toString()));
                        li.appendChild(document.createTextNode("; slotPos: "+lockOne.slotPos.toString()));
                        if (notesLength > 0) {
                            let nodes = "; notes:"
                            for (let j = 0; j < notesLength; j++) {
                                nodes+=((await app.getNote(tokenID)).toString()+'\n');
                            }
                            li.appendChild(document.createTextNode(nodes));
                        }
                        ul.appendChild(li);
                    }
                }

            },
            async deleteLock() {

            },
            async createLLtoSell() {
                let app = this.$llApp;
                // console.log(this.cLevelParameter.inputCOOAddress);
                try {
                    console.log("this.cLevelParameter.inputLockForm.styleId", this.cLevelParameter.inputLockForm.styleId)
                    await app.createLLtoSell(Number(this.cLevelParameter.inputLockForm.styleId),
                        Number(this.cLevelParameter.inputLockForm.notesLimit))
                } catch (e) {
                    this.$message.error(e);
                }
            },
            async createLL() {
                let app = this.$llApp;
                // console.log(this.cLevelParameter.inputCOOAddress);
                try {
                    await app.createLL(Number(this.cLevelParameter.inputLockForm.styleId),
                        Number(this.cLevelParameter.inputLockForm.notesLimit),
                        this.cLevelParameter.inputLockForm.owner)
                } catch (e) {
                    this.$message.error(e);
                }
            },
            async initInput() {
                this.cLevelParameter.inputCOOAddress = this.basicInfo.ceoAddress;
                this.cLevelParameter.inputSLLAddress = this.saleBasicInfo.contractAddress;
                this.cLevelParameter.inputLLBAddress = this.basicInfo.contractAddress;
                this.cLevelParameter.inputLockForm = {
                    notesLimit: 10,
                    owner: this.basicInfo.ceoAddress,
                    styleId: 1,
                }
            },
            async setSLLAddress() {
                let app = this.$llApp;
                // console.log(this.cLevelParameter.inputCOOAddress);
                try {
                    await app.setSLLAddress(this.cLevelParameter.inputSLLAddress)
                } catch (e) {
                    this.$message.error(e);
                }
            },
            async setLLBAddress() {
                let app = this.$llApp;
                // console.log(this.cLevelParameter.inputCOOAddress);
                try {
                    await app.setLLBAddress(this.cLevelParameter.inputLLBAddress)
                } catch (e) {
                    this.$message.error(e);
                }
            },
            async setCOO() {
                let app = this.$llApp;
                // console.log(this.cLevelParameter.inputCOOAddress);
                try {
                    await app.setCOO(this.cLevelParameter.inputCOOAddress)
                } catch (e) {
                    this.$message.error(e);
                }
            },
            async setSLLCOO() {
                let app = this.$llApp;
                // console.log(this.cLevelParameter.inputCOOAddress);
                try {
                    await app.setSLLCOO(this.cLevelParameter.inputCOOAddress)
                } catch (e) {
                    this.$message.error(e);
                }
            },
            async clickViewContract() {
                this.dialogTableVisible = true;
                await this.basicInfoRead();
            },
            async appInit() {
                let app = this.$llApp;
                if (!app.initOK) {
                    await app.init();
                }
            },
            async basicInfoRead() {
                let app = this.$llApp;
                // init the basic Info of llb contract
                this.basicInfo.contractAddress = await app.getContractAddress();
                this.basicInfo.name = await app.getName();
                this.basicInfo.symbol = await app.getSymbol();
                this.basicInfo.baseURI = await app.getBaseURI();
                this.basicInfo.ceoAddress = await app.getCEO();
                this.basicInfo.cooAddress = await app.getCOO();
                this.basicInfo.totalSupply = await app.getTotalSupply();
                this.basicInfo.numLoveLocks = await app.getNumLoveLocks();
                this.basicInfo.saleContract = await app.getSaleContract();
                this.basicInfo.defaultPrice = await app.getDefaultPrice();
                // init the basic Info of sll contract
                this.saleBasicInfo.contractAddress = await app.getSLLContractAddress();
                this.saleBasicInfo.ceoAddress = await app.getSLLCEO();
                this.saleBasicInfo.cooAddress = await app.getSLLCOO();
                this.saleBasicInfo.nonFungibleContract = await app.getNonFungibleContract();
                this.saleBasicInfo.toSellLength = await app.getToSellLength();
            },
            async adminContractBind() {
                let app = this.$llApp;
                await app.contractBind(this.basicInfo.contractAddress, this.saleBasicInfo.contractAddress);
            },
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
