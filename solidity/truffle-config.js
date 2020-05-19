const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = "..... <your memo>.....";
module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*" // Match any network id
        },
        develop: {
            port: 8545
        },
        rinkeby: {
            // must be a thunk, otherwise truffle commands may hang in CI
            provider: () =>
                new HDWalletProvider(mnemonic, ".... <your weburi> ..."
                ,0),
            network_id: 4,
            gas: 10000000,
            // gasPrice: 1000000000000000,
        }
    },
    compilers: {
        solc: {
            version: "^0.6.0", // A version or constraint - Ex. "^0.5.0"
            // Can also be set to "native" to use a native solc
        }
    }
};
