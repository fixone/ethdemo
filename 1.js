const Web3 = require('../ethereum/node_modules/web3/index.js')
const web3 = new Web3()
//not really much here, just a RPC URL for a geth node
const config = require('../ethereum/config')
const address = "0xB98B9dCfDF06095408530C395Dea296103469257".toLowerCase()

try{
    if(process.env.ENV === 'live')
        web3.setProvider(new web3.providers.HttpProvider(config.provider.live))
    else
        web3.setProvider(new web3.providers.HttpProvider(config.provider.dev))
    /*
    we start with a few simple calls, note that, since we're accessing the variable and not providing a callback function as the last argument, all these function calls are synchronous
    */
/*    
    console.log("connecting to",web3.currentProvider)
    console.log("this node is connected to a network with id",web3.version.network)
    console.log("and eth version", web3.version.ethereum,"i.e.",parseInt(web3.version.ethereum))
    console.log("balance of",address,"is",web3.fromWei(web3.eth.getBalance(address),"ether").toString(),"in ether (in wei that's",web3.eth.getBalance(address).toString(),")")
    console.log("and this address has done",web3.eth.getTransactionCount(address),"transactions")
*/    
    /*
    Let's do some block inspection
    */
    /*
    var currentBlock = web3.eth.blockNumber
    console.log("current block is",currentBlock)
    currentBlock = 1489908
    while(currentBlock > 0) {
        var block = web3.eth.getBlock(currentBlock)
        if(block.miner === address) {
            console.log("looking in",currentBlock)
            //console.log(web3.eth.getBlock(currentBlock))
            console.log("---->has hash",block.hash)
            console.log("---->and",block.transactions.length,"transactions")
            console.log("---->with extra data",block.extraData)
            console.log("---->which means",block.extraData.match(/.{2}/g).map((v)=>{return String.fromCharCode(parseInt(v,16))}).join(''))

            
        } else {
            console.log("nothing in",currentBlock)
        }
        currentBlock--       
    }
    */
    var pending = web3.eth.getBlock("pending")
    if(pending != null && pending.transactions.length > 0){
        console.log("there are",pending.transactions.length,"waiting to be mined")
        console.log("and they are",pending.transactions)
        var tx = web3.eth.getTransaction(pending.transactions[0])
        if(tx.to == null) {
            console.log("the first transaction is a contract creation by", tx.from)
        } else {
            console.log("the first one being from", tx.from,"to",tx.to,"in amount of",web3.fromWei(tx.value,"ether").toString(),"ether")
        }
    } else {
        console.log("No unmined transactions")
    }
   
} catch (e) {
    console.log(e)
}
