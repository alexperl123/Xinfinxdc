# XinFin Wallet #

Wallet for XinFin


### What is this repository for? ###

* This is wallet for XDC Coin

* v1

* [XinFin](http://xinfin.org)


### How do I get set up? ###

* npm install

* npm install --only=dev

* truffle compile

* start geth

	* geth --datadir /<**path**> init genesis.json

	* geth --datadir /<**path**> --networkid 2110 --rpc --rpcapi "db,net,web3,admin,eth,miner,	personal" --rpccorsdomain "http://localhost:3000")

	* geth attach ipc:/<**path**>

* start mongo (if mongod service not running <systemctl start mongod>)

* truffle migrate


### To-Do ###

1. Correct Details in My Account Page (After login)

2. Wireframe send tokens to wallet ui

3. Populate Statement with real transactions from & to that specific account

4. Display Proper Error

5. Display Wait when processing transactions & Other features which takes time in geth

6. Profile Information

7. Make copy (icon) option for public address

8. Incorporate Proper validations.


### Bugs ###

* Lock Account Not Working

geth --datadir /home/celticlab/xdcchain/ --networkid 2110 --rpc --rpcaddr "78.129.229.92" --rpcapi "db,net,web3,admin,eth,miner,personal"  --rpccorsdomain "http://localhost:3000"

geth --datadir /home/himanshu/privatechain --rpc --rpcaddr "localhost" --rpcapi "db,net,web3,admin,eth,miner,personal" --rpccorsdomain "http://localhost:3000"

geth attach ipc:/home/himanshu/privatechain/geth.ipc


// script to mine when transactions are there
var mining_threads = 1

function checkWork() {
    if (eth.getBlock("pending").transactions.length > 0) {
        if (eth.mining) return;
        // console.log("== Pending transactions! Mining...");
        miner.start(mining_threads);
    } else {
        miner.stop();
        // console.log("== No transactions! Mining stopped.");
    }
}

eth.filter("latest", function(err, block) { checkWork(); });
eth.filter("pending", function(err, block) { checkWork(); });

checkWork();