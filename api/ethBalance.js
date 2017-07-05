var address = require('../address.js');
var contract = require('truffle-contract');
var coin_artifacts = require('../build/contracts/Coin.json');

// var assert = require('assert');
var web3_extended = require('web3_extended');
require('dotenv').load()

var options = {
	// host: '/home/user/.ethereum/geth.ipc',
	host: process.env.RPC,
	ipc: true,
	personal: true,
	admin: false,
	debug: false
};
var web3 = web3_extended.create(options);

var Coin = contract(coin_artifacts);

var errorMessage = "";
module.exports = {
	balance: function (req, res, next) {
		var self = this;
		var address = req.body.address;
		web3.eth.getBalance(address, function (err, response) {
			if (!err)
				res.send({ status: 'SUCCESS', address: address, message: `Balance is ${web3.fromWei(response, "ether")} ether` });
			else
				res.send({ status: 'Failure', message: err });
		})
	},

}
