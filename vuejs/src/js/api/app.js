import Web3 from "web3";
import TruffleContract from "@truffle/contract"
import el from "element-ui/src/locale/lang/el";

export default class App {
    /**
     *
     * @param options {abiJSON:{LoveLockBase:{abi of LoveLockBase}, SaleLoveLock:{abi of SaleLoveLock}}}
     * @returns {Promise<void>}
     */
    constructor(options) {
        if (options) {
            this.abiJSON = options['abiJSON'];
        }
    }

    async init() {
        if (this.initOK) {
            return;
        }
        await this.initWeb3();
        this.initContract();
        await this.initLlbInstance();
        await this.initSllInstance();
        this.initOK = true;
    }

    async initWeb3() {
        // Modern dapp browsers...
        if (window.ethereum) {
            this.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
// Legacy dapp browsers...
        else if (window.web3) {
            this.web3Provider = window.web3.currentProvider;
        }
// If no injected web3 instance is detected, fall back to Ganache
        else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        this.web3 = new Web3(this.web3Provider);
    }

    initContract() {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        this.contracts = this.contracts || {};
        this.contracts.LoveLockBase = TruffleContract(this.abiJSON.LoveLockBase);
        this.contracts.SaleLoveLock = TruffleContract(this.abiJSON.SaleLoveLock);

        // Set the provider for our contract
        this.contracts.LoveLockBase.setProvider(this.web3Provider);
        this.contracts.SaleLoveLock.setProvider(this.web3Provider);

        // // Use our contract to retrieve and mark the adopted pets
        // return App.markLocks();
        //
        // return App.bindEvents();
    }


    /***  llb contract ***/
    async initLlbInstance() {
        this.llbInstance = await this.contracts.LoveLockBase.deployed();
    }

    async llbMethod() {
        if (!this.llbInstance) {
            await this.initLlbInstance();
        }
    }

    async getContractAddress() {
        await this.llbMethod();
        return await this.llbInstance.getContractAddress.call();
    }

    async getBaseURI() {
        await this.llbMethod();
        return await this.llbInstance.baseURI.call();
    }

    async getCEO() {
        await this.llbMethod();
        return await this.llbInstance.ceoAddress.call();
    }

    async getCOO() {
        await this.llbMethod();
        return await this.llbInstance.cooAddress.call();
    }

    async getName() {
        await this.llbMethod();
        return await this.llbInstance.name.call();
    }

    async getNumLoveLocks() {
        await this.llbMethod();
        return await this.llbInstance.numLoveLocks.call();
    }

    async getSaleContract() {
        await this.llbMethod();
        return await this.llbInstance.saleContract.call();
    }

    async getSymbol() {
        await this.llbMethod();
        return await this.llbInstance.symbol.call();
    }

    async getTotalSupply() {
        await this.llbMethod();
        return await this.llbInstance.totalSupply.call();
    }

    async getDefaultPrice() {
        await this.llbMethod();
        let defaultPrice = await this.llbInstance.defaultPrice.call();
        console.log("defaultPrice", defaultPrice)
        return this.web3.utils.fromWei(defaultPrice, 'finney');
    }

    async loveLocks(index) {
        index = index.toString();
        await this.llbMethod();
        return await this.llbInstance.loveLocks(index);
    }

    async deleteLock() {

    }

    async hangLL(tokenId, slotId) {
        tokenId = tokenId.toString();
        slotId = slotId.toString();
        let account;
        try {
            let accounts = await this.promisifyAccount()
            account = accounts[0];
            console.log("accounts", accounts)
            let result = await this.llbInstance.hangLL(tokenId, slotId, {
                from: account
            });
            return result;
        } catch (e) {
            return;
        }
    }

    async getUsedSlotLength() {
        await this.llbMethod();
        return await this.llbInstance.getUsedSlotLength.call();
    }

    async getUsedSlot(nth) {
        nth = nth.toString();
        await this.llbMethod();
        return await this.llbInstance.getUsedSlot(nth);
    }

    async getLockOnSlot(slotId) {
        slotId = slotId.toString();
        await this.llbMethod();
        return await this.llbInstance.getLockOnSlot(slotId);
    }

    async addNote(tokenId, note) {
        tokenId = tokenId.toString();
        await this.llbMethod();
        let account;
        try {
            let accounts = await this.promisifyAccount()
            account = accounts[0];
            console.log("accounts", accounts)
            let result = await this.llbInstance.addNote(tokenId, note, {
                from: account
            });
            return result;
        } catch (e) {
            return;
        }


    }

    async getNote(tokenId) {
        // console.log("getNote::tokenID before",tokenId)
        tokenId = tokenId.toString();
        // console.log("getNote::tokenID after",tokenId)
        await this.llbMethod();
        return await this.llbInstance.getNote(tokenId, '0');
    }

    async tokenOfOwnerByIndex( index){
        await this.llbMethod();
        let account;
        try {
            let accounts = await this.promisifyAccount()
            account = accounts[0];
            console.log("accounts", accounts)
            let result = await this.llbInstance.tokenOfOwnerByIndex(account, index);
            return result;
        } catch (e) {
            return;
        }
    }

    /***  sll contract ***/
    async initSllInstance() {
        this.sllInstance = await this.contracts.SaleLoveLock.deployed();
    }

    async sllMethod() {
        if (!this.sllInstance) {
            await this.initSllInstance();
        }
    }

    async getSLLCEO() {
        await this.sllMethod();
        return await this.sllInstance.ceoAddress.call();
    }

    async getSLLCOO() {
        await this.sllMethod();
        return await this.sllInstance.cooAddress.call();
    }

    async getToSellLength() {
        await this.sllMethod();
        return await this.sllInstance.getToSellLength.call();
    }

    async getNonFungibleContract() {
        await this.sllMethod();
        return await this.sllInstance.nonFungibleContract.call();
    }

    async getSLLContractAddress() {
        await this.sllMethod();
        return await this.sllInstance.getContractAddress.call();
    }

    async getSaleLock(index) {
        index = index.toString();
        await this.sllMethod();
        return await this.sllInstance.getSaleLock(index);
    }

    async tokenToSaleLocks(tokenId) {
        tokenId = tokenId.toString();
        await this.sllMethod();
        return await this.sllInstance.tokenToSaleLocks(tokenId);
    }

    /**
     *
     * @param tokenId
     * @param price  str
     * @param unit
     * @returns {Promise<void>}
     */
    async buyLock(tokenId, price, unit) {
        tokenId = tokenId.toString();
        // price =price.toString();
        let account;
        try {
            let accounts = await this.promisifyAccount()
            account = accounts[0];
            console.log("accounts", accounts)
            let result = await this.sllInstance.buyLock(tokenId, {
                from: account,
                value: price
            });
            return result;
        } catch (e) {
            return;
        }
    }

    /*** cLevel method ***/

    async createLLtoSell(styleId, notesLimit) {
        let account;
        try {
            let accounts = await this.promisifyAccount()
            account = accounts[0];
            console.log("accounts", accounts)
        } catch (e) {
            return
        }
        // console.log("call createLLtoSell")
        // await this.contracts.LoveLockBase.methods.setNonFungibleContract(llbAddress).call({from: account});
        let result = await this.llbInstance.createLLtoSell(styleId, notesLimit, {
            from: account,
            value: this.web3.utils.toWei('1', 'finney')
        });
        // console.log("call createLLtoSell result",result)

    }

    async createLL(styleId, notesLimit, owner) {
        let account;
        try {
            let accounts = await this.promisifyAccount()
            account = accounts[0];
            console.log("accounts", accounts)
        } catch (e) {
            return
        }
        // await this.contracts.LoveLockBase.methods.setNonFungibleContract(llbAddress).call({from: account});
        await this.llbInstance.createLL(styleId, notesLimit, owner, {
            from: account
        });

    }

    async contractBind(llbAddress, sllAddress) {
        let account;
        try {
            let accounts = await this.promisifyAccount()
            account = accounts[0];
            console.log("accounts", accounts)
        } catch (e) {
            return
        }
        // await this.contracts.LoveLockBase.methods.setNonFungibleContract(llbAddress).call({from: account});
        await this.sllInstance.setNonFungibleContract(llbAddress, {from: account});
        await this.llbInstance.setSaleContractAddress(sllAddress, {from: account});
    }

    async setLLBAddress(llbAddress) {
        let account;
        try {
            let accounts = await this.promisifyAccount()
            account = accounts[0];
            console.log("accounts", accounts)
        } catch (e) {
            return
        }
        // await this.contracts.LoveLockBase.methods.setNonFungibleContract(llbAddress).call({from: account});
        await this.sllInstance.setNonFungibleContract(llbAddress, {from: account});
    }

    async setSLLAddress(sllAddress) {
        let account;
        try {
            let accounts = await this.promisifyAccount()
            account = accounts[0];
            console.log("accounts", accounts)
        } catch (e) {
            return
        }
        // await this.contracts.LoveLockBase.methods.setNonFungibleContract(llbAddress).call({from: account});
        await this.llbInstance.setSaleContractAddress(sllAddress, {from: account});
    }

    async setCOO(cooAddress) {
        let account;
        try {
            let accounts = await this.promisifyAccount()
            account = accounts[0];
            console.log("accounts", accounts)
        } catch (e) {
            return
        }
        await this.llbInstance.setCOO(cooAddress, {from: account});
    }

    async setSLLCOO(cooAddress) {
        let account;
        try {
            let accounts = await this.promisifyAccount()
            account = accounts[0];
            console.log("accounts", accounts)
        } catch (e) {
            return
        }
        await this.sllInstance.setCOO(cooAddress, {from: account});
    }

    promisifyAccount() {
        return new Promise((resolve, reject) => {
            return this.web3.eth.getAccounts((error, content) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(content)
                }
            })
        })

    }
}
//     markLocks(adopters, account) {
//         if (this.llbInstance){
//
//         }
//         var llbInstance;
//         this.contracts.LoveLockBase.deployed().then(function (instance) {
//             llbInstance = instance;
//
//             return llbInstance.getLocks.call();
//         }).then(function (locks) {
//             for (let i = 0; i < locks.length; i++) {
//                 if (locks[i] !== '0x0000000000000000000000000000000000000000') {
//                     let width = 50;
//                     let height = 50;
//                     let baseX = 0;
//                     let baseY = 180;
//                     drawLock(i / 3 * width + baseX, i % 3 * height + baseY, "images/locks/lock3.png", "XX Love YY")
//                     // $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
//                 }
//             }
//         }).catch(function (err) {
//             console.log(err.message);
//         });
//     }
// }
//
//
// let App = {
//         web3Provider: null,
//         contracts: {},
//
//
//         bindEvents: function () {
//             $(document).on('click', '.btn-adopt', App.handleClick);
//         },
//
//     ,
//     handleClick:
//
// function (event) {
//     event.preventDefault();
//     // todo:later var petId = parseInt($(event.target).data('id'));
//     document.getElementById('tipps').innerText = 'click a location above to add the lock!'
//     setClickDraw(App.handleDrawLock);
// }
//
// ,
// handleDrawLock: function (locationID) {
//     let lockInstance;
//     web3.eth.getAccounts(function (error, accounts) {
//         if (error) {
//             console.log(error);
//         }
//
//         var account = accounts[0];
//         console.log("accounts", accounts)
//
//         App.contracts.LoveLock.deployed().then(function (instance) {
//             lockInstance = instance;
//             // adoptionInstance.methods.adopt().call(petId,{from: account,
//             //   gas: 10})
//             // t.methods.getInfo().call
//             // Execute adopt as a transaction by sending account
//             console.log("locationID", locationID)
//             return lockInstance.drawLock(locationID, {
//                 from: account,
//                 value: web3.toWei(2, "ether")
//             });
//         }).then(function (result) {
//             return App.markLocks();
//         }).catch(function (err) {
//             console.log(err.message);
//         });
//     });
// }

//
// }
// ;
//
// $(function () {
//     $(window).load(function () {
//         App.init();
//     });
// });
