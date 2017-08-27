const Web3 = require('../ethereum/node_modules/web3/index.js')
const web3 = new Web3()
const config = require('../ethereum/config')
web3.setProvider(new web3.providers.HttpProvider(config.provider.dev))
const contractFile = "contract.sol";
const fs = require('fs');
const exec = require('child_process').execSync;
console.log("compiling",contractFile)
exec(`solc --bin --abi --optimize --overwrite -o bin contract.sol`);
/*pay attention to file names here!*/
var abi = fs.readFileSync("bin/BucJSToken.abi");
var compiled = "0x" + fs.readFileSync("bin/BucJSToken.bin");
console.log("we should now have in 'bin' the abi and the compiled contract")
var contract = web3.eth.contract(JSON.parse(abi))
/*
The contract constructor has 4 defined parameters
uint256 initialSupply,
string tokenName,
uint8 decimalUnits,
string tokenSymbol
so we need to supply 4 params to the contract.new call below
*/
var deployer = web3.personal.listAccounts[0]
console.log("deploying from", deployer)
web3.personal.unlockAccount(deployer,"")


//let's see how much gas it will take to deploy the contract
var cData = contract.new.getData(1000000,"BucharestJS TestToken",0,"BJSTT",{data:compiled})
var gasLimit = web3.eth.estimateGas({data: cData})
console.log("it's about",gasLimit,"gas")

var tx = {
    gas: gasLimit+10,
    from: deployer,
    data:compiled
}

/*callback triggers twice, once on send, once when it is mined. 
When sent there's no address allocated yet
*/
contract.new(1000000,"BucharestJS TestToken",0,"BJSTT", tx ,(e, c) => {
    if(e){
            console.log("Error!",e);return;
    }       
    if(c.address == null) {
        console.log("Contract sent in transaction", c.transactionHash)
    } else {
        console.log("Contract mined with address" ,c.address , ", transactionHash was" , c.transactionHash)
    }    
})
