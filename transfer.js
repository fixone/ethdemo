const Web3 = require('../ethereum/node_modules/web3/index.js')
const web3 = new Web3()
const config = require('../ethereum/config')
var Tx = require('../ethereum/node_modules/ethereumjs-tx/index.js')
const key = require('./key')
web3.setProvider(new web3.providers.HttpProvider(config['provider-remote'].dev))
const keth = require('../ethereum/node_modules/keythereum/index.js')


const destination = "0x901Add46F7Cabb7Ba8bC51fc5777CC6f3aF47acF"

gasPrice = web3.eth.gasPrice
gasPriceHex = web3.toHex(gasPrice+1)
gasLimitHex = web3.toHex(100000)

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
    to: destination,
    from: sender,
    value: web3.toHex(web3.toWei(1,"ether")),
    data: web3.fromAscii('Hello!')
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

