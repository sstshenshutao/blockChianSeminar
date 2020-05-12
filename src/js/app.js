import {drawLock,setClickDraw} from "./canvas-op";

let App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        // Load pets.
        $.getJSON('../pets.json', function (data) {
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');

            for (let i = 0; i < data.length; i++) {
                petTemplate.find('.panel-title').text(data[i].name);
                petTemplate.find('img').attr('src', data[i].picture);
                petTemplate.find('.pet-breed').text(data[i].breed);
                petTemplate.find('.pet-age').text(data[i].age);
                petTemplate.find('.pet-location').text(data[i].location);
                petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                petsRow.append(petTemplate.html());
            }
        });

        return await App.initWeb3();
    },

    initWeb3: async function () {
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
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
            App.web3Provider = window.web3.currentProvider;
        }
// If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('LoveLock.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            var LoveLockArtifact = data;
            App.contracts.LoveLock = TruffleContract(LoveLockArtifact);

            // Set the provider for our contract
            App.contracts.LoveLock.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.markLocks();
        });

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-adopt', App.handleDrawLock);
    },

    markLocks: function (adopters, account) {
        var lockInstance;

        App.contracts.LoveLock.deployed().then(function (instance) {
            lockInstance = instance;

            return lockInstance.getLocks.call();
        }).then(function (locks) {
            for (let i = 0; i < locks.length; i++) {
                if (locks[i] !== '0x0000000000000000000000000000000000000000') {
                    let width =50;
                    let height  = 50;
                    let baseX = 0;
                    let baseY = 180;
                    drawLock(i/3 * width+baseX, i%3 *height+baseY, "images/locks/lock3.png", "XX Love YY")
                    // $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
                }
            }
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    handleDrawLock: function (event) {
        event.preventDefault();
        // todo:later var petId = parseInt($(event.target).data('id'));
        document.getElementById('tipps').innerText = 'click a location above to add the lock!'
        var lockInstance;
        setClickDraw();
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];
            console.log("accounts", accounts)

            App.contracts.LoveLock.deployed().then(function (instance) {
                lockInstance = instance;
                // adoptionInstance.methods.adopt().call(petId,{from: account,
                //   gas: 10})
                // t.methods.getInfo().call
                // Execute adopt as a transaction by sending account
                return lockInstance.drawLock(petId, {
                    from: account,
                    value: web3.toWei(2, "ether")
                });
            }).then(function (result) {
                return App.markAdopted();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    }





};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
export default App;