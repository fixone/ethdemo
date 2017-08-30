const Web3 = require('../ethereum/node_modules/web3/index.js')
const web3 = new Web3()
//not really much here, just a RPC URL for a geth node
//you can even use an infura.io node for the demo here
const config = require('../ethereum/config')
const key = require('./key')

const address = key.address.toLowerCase()
/////everything below can be used verbatim, provided that the configs & libraries have been corectly loaded. also init the 'address' variable with the desired value
try{
    if(process.env.ENV === 'live')
        web3.setProvider(new web3.providers.HttpProvider(config['provider-remote'].live))
    else
        web3.setProvider(new web3.providers.HttpProvider(config['provider'].dev))
    /*
    we start with a few simple calls, note that, since we're accessing the variable and not providing a callback function as the last argument, all these function calls are synchronous
    */
    
    console.log("connecting to",web3.currentProvider)
    console.log("this node is connected to a network with id",web3.version.network)
    console.log("and eth protocol version", web3.version.ethereum,"i.e.",parseInt(web3.version.ethereum))
    console.log("etherbase is",web3.eth.coinbase)
    console.log("balance of",address,"is",web3.fromWei(web3.eth.getBalance(address),"ether").toString(),"in ether (in wei that's",web3.eth.getBalance(address).toString(),")")
    console.log("and this address has done",web3.eth.getTransactionCount(address),"transactions")
    
    /*
    Let's do some block inspection
    */

    var currentBlock = web3.eth.blockNumber
    console.log("current block is",currentBlock)
    //jump to a more 'relevant' block
    currentBlock = 1567759
    var blocksDone = 10 //stop after this many blocks inspected
    while(currentBlock > 0 && blocksDone > 0) {
        var block = web3.eth.getBlock(currentBlock)
        if(block.miner === address) {
            console.log("looking in",currentBlock)
            //console.log(web3.eth.getBlock(currentBlock))
            console.log("---->has hash",block.hash)
            console.log("---->and",block.transactions.length,"transactions")
            console.log("---->with extra data",block.extraData)
            console.log("---->which means",web3.toAscii(block.extraData))
            
        } else {
            console.log("nothing interesting in",currentBlock)
        }
        currentBlock-- 
        blocksDone--
    }
    /*
    there are two block names which are special - latest and pending
    let's see what transactions are pending (have not been included in a block
    */ 
    var pending = web3.eth.getBlock("pending")
    if(pending != null && pending.transactions.length > 0){
        console.log("there are",pending.transactions.length,"transactions waiting to be mined")
        console.log("and they are",pending.transactions)
        var tx = web3.eth.getTransaction(pending.transactions[pending.transactions.length-1])
        if(tx.to == null || parseInt(tx.to) === 0) {
            console.log("the last transaction is a contract creation by", tx.from)
        } else {
            console.log("the last one being from", tx.from,"to",tx.to,"in amount of",web3.fromWei(tx.value,"ether").toString(),"ether")
            if(tx.value == 0) {
                console.log("(this means that it's a contract call, for which the details are in the 'input' variable",tx.input,")")
            }
        }
    } else {
        console.log("No unmined transactions")
    }
   
} catch (e) {
    console.log(e)
}
