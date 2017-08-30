const Web3 = require('../ethereum/node_modules/web3/index.js')
const web3 = new Web3()
const config = require('../ethereum/config')
web3.setProvider(new web3.providers.HttpProvider(config.provider.dev))
//const address = "0xB98B9dCfDF06095408530C395Dea296103469257"
//const address = "0x3de654b603addf6255a1d88647f703210e389ee6"
const key = require('./key')
const address = key.address

//up to here is the config section, change as desired
//compilation needs to happen before

const fs = require('fs')
var abi = fs.readFileSync("bin/BucJSToken.abi")
var contract = web3.eth.contract(JSON.parse(abi))

var instance = require('./contract.json')
if(instance != null && instance.contract != null) {
    var tokenContract = contract.at(instance.contract)
    /*
    since the contract was deployed using the first account in personal, that account owns all the tokens
    */ 
    var sender = web3.personal.listAccounts[0]
    console.log("sending from", sender,"to",address)
    web3.personal.unlockAccount(sender,"")

    /*
    Once we unlocked the account we simply need to call the transfer function of the contract
    Things are relatively easy here as we let the RPC endpoint (a node also holding the accounts) do all the transaction signing
    If we would need to send it from an account that is not on the node (thus not accesible/unlock-able via web3.personal), things are slightly more difficult
    */ 
    var gasLimit = 100000
    console.log("transaction sent with hash",tokenContract.transfer(address,5000,{from:sender,gas:gasLimit}))
    console.log("balance of",sender,"is",tokenContract.balanceOf(web3.personal.listAccounts[0]).toString(),"of",tokenContract.symbol(),"tokens")
}
