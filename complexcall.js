const Web3 = require('../ethereum/node_modules/web3/index.js')
const web3 = new Web3()
const config = require('../ethereum/config')
var Tx = require('../ethereum/node_modules/ethereumjs-tx/index.js')
const key = require('./key')
web3.setProvider(new web3.providers.HttpProvider(config.provider.dev))
const keth = require('../ethereum/node_modules/keythereum/index.js')
const fs = require('fs')
var abi = fs.readFileSync("bin/BucJSToken.abi")
var contract = web3.eth.contract(JSON.parse(abi))

var instance = require('./contract.json')

var tokenContract = contract.at(instance.contract)

//console.log(tokenContract)

const destination = "0xB98B9dCfDF06095408530C395Dea296103469257"
/*we simulate the call to get the payload data which we'll use in the handcrafted transaction*/
var contractData = tokenContract.transfer.getData(destination,999)

gasPrice = web3.eth.gasPrice
gasPriceHex = web3.toHex(gasPrice)
gasLimitHex = web3.toHex(50000)

var privateKey = new Buffer(key.key, 'hex')
var sender = keth.privateKeyToAddress(key.key)
/*
since we build transaction by hand, we need the nonce of the sender account
*/
nonce =  web3.eth.getTransactionCount(sender)
nonceHex = web3.toHex(nonce)
console.log("nonce is",nonce,"for",sender,"gasLimit",gasLimitHex,"gasPrice",gasPriceHex)
var rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    to: instance.contract,
    from: sender,
    value: '0x00',
    data: contractData
}

var tx = new Tx(rawTx);
console.log("raw",JSON.stringify(rawTx))

tx.sign(privateKey);

var serializedTx = tx.serialize()
var txhex = serializedTx.toString("hex")
if(txhex.substring(0,3) != '0x')
    txhex = '0x'+txhex
console.log("sendingTX",txhex)
console.log("transaction sent with hash",web3.eth.sendRawTransaction(txhex))
