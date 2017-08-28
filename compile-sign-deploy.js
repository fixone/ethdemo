const Web3 = require('../ethereum/node_modules/web3/index.js')
const web3 = new Web3()
const config = require('../ethereum/config')
var Tx = require('../ethereum/node_modules/ethereumjs-tx/index.js')
const keth = require('../ethereum/node_modules/keythereum/index.js')

web3.setProvider(new web3.providers.HttpProvider(config['provider-remote'].dev))
const contractFile = "contract.sol"
const fs = require('fs')
const exec = require('child_process').execSync
console.log("compiling",contractFile)
exec(`solc --bin --abi --optimize --overwrite -o bin contract.sol`)
/*pay attention to file names here!*/
var abi = fs.readFileSync("bin/BucJSToken.abi")
var compiled = "0x" + fs.readFileSync("bin/BucJSToken.bin")
console.log("we should now have in 'bin' the abi and the compiled contract")
var contract = web3.eth.contract(JSON.parse(abi))

/*
read key and address from a file
*/
var personal = require('./key')
var deployer = personal.address
console.log("deploying from", deployer)

const tokenCfg = require('./config')

//let's see how much gas it will take to deploy the contract
var cData = contract.new.getData(parseInt(tokenCfg.supply),tokenCfg.name,parseInt(tokenCfg.decimals),tokenCfg.symbol,{data:compiled})
var gasLimit = web3.eth.estimateGas({data: cData})
console.log("it's about",gasLimit,"gas")
nonceHex = web3.toHex(web3.eth.getTransactionCount(deployer))
gasPriceHex = web3.toHex(web3.eth.gasPrice)
gasLimitHex = web3.toHex(gasLimit)

console.log("nonce is",nonceHex,"for",deployer,"gasLimit",gasLimitHex,"gasPrice",gasPriceHex)
var rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    from: deployer,
    data: cData
}
console.log("raw transaction",JSON.stringify(rawTx))
var tx = new Tx(rawTx);
var privateKey = new Buffer(personal.key, 'hex')
tx.sign(privateKey);

var serializedTx = tx.serialize()
var txhex = serializedTx.toString("hex")
if(txhex.substring(0,3) != '0x')
    txhex = '0x'+txhex
console.log("sending hex TX",txhex)
console.log("transaction sent with hash",web3.eth.sendRawTransaction(txhex))

