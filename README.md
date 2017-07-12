

# XinFin [XDC] Connecting Blockchain to the real world through IoT #

XinFin (XDC) is blockchain in development to deliver real world and enterprise grade integrations into the financial ecosystem. We are working on providing blockchain connectivity, transactions and financing mechanism to the real world applications through the Internet of Things (IoT) enabled devices or projects. Our core focus is to bridge the huge inefficiencies in global supply chain and bridge the $5 trillion infrastructure deficit. 

## Two main use cases for XinFin (XDC) platform include : ##

Peer to Peer Financing for IoT enabled real world devices and projects and critical public infrastructure projects ($5 trillion deficit and opportunities)
Enabling global trade finance for the buyers and sellers with proven products, credibility and yet non-existent ratings. (Approx : $1 trillion non-existent market)
Enabling an efficient repayment mechanism coupled with FIAT currency smart-contracts linked to XDC blockchain network.

We are currently working on providing a peer to peer financing platform through XinFin XDC network directly into the IoT Enabled water Purifier ATM machine in remote villages in the parts of Africa and India that supplies clean drinkable water at a highly subsidised rate. The same architecture can be easily scaled up in the long term by the Governments or institutions to secure/raise finance from global investors for critical infrastructure projects the are neglected and glamour-less for investors. The applications of XinFin [XDC] platform are endless and can be applicable to institutional/retail as well as Government Financing. From the compliance aspect, XinFin XDC network will work with regulated or existing market makers or money changers in the long term.

## XinFin (XDC) will be opening it’s open API’s for any number of use cases such as : ##

Cross border remittances
PoS terminals

## XinFin (XDC) has derived a fork out of Ethereum blockchain to enable the following features : ##

Specifications
Hashing Algorithm: same as in Ethereum, keccak-256
Dev Language : Go, Java, NodeJs
Block time: 1 second 
Type: PoW
Difficulty re-targets each block
ERC 20 compliant token to evolve into it’s own XDC01 standard with security and scalability
Fully Auditable
One coin is divisible down to 5 decimal places (divisible up to 10-5)
Total coins: 100,000,000,000 XDC 
Pre-mine : 100% (80% in Escrow)


### Features ###
Gerant Nodes/Master nodes for quick processing
Lite Nodes/Wallet
Multi-Sig Contracts
API connectivity to IoT devices
Lowest latency times upto a few seconds
Hybrid Public/Private architecture with connectivity to Ethereum and Bitcoin public blockchains

Business White Paper : http://www.xinfin.org/white-paper-xinfin-xdc/

Technical Summary and Architecture Overview : http://www.xinfin.org/white-paper-xinfin-xdc/

Team Bios (Password Protected) :  http://www.xinfin.org/about-team/
[The team profiles have been password protected to avoid spam emails. The password is available on the same URL]

Youtube Video : https://www.youtube.com/watch?v=jLaqms1IHWE&t=20s

Note To Exchanges : XDC as an asset code is currently locked by a defunct/dead coin. XinFin is not in an way associated with the previously dead coin. We are “Exchange Infinite Development Contract”. We request the exchanges to reserve/allocate [XDC] as an asset code to the XinFin XDC Network. 


Website
http://www.xinfin.org

How to Get XDC and Link to EWallet
http://www.xinfin.org/get_xdc/

Community Forum
http://www.xinfin.net

Github and BlockExplorer : Coming Soon






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

	* geth --datadir /<**path**> --networkid <network id> --rpc --rpcapi "db,net,web3,admin,eth,miner,	personal" --rpccorsdomain "http://localhost:3000")

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

geth --datadir /path/to/chaindata/ --networkid <network id> --rpc --rpcaddr "::" --rpcapi "db,net,web3,admin,eth,miner,personal"  --rpccorsdomain "http://localhost:3000"

geth --datadir /path/to/chaindata/ --rpc --rpcaddr "localhost" --rpcapi "db,net,web3,admin,eth,miner,personal" --rpccorsdomain "http://localhost:3000"

geth attach ipc:/path/to/geth.ipc


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