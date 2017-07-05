var Web3 = require('web3');
require('dotenv').load()

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC));
}

module.exports = web3;
