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
	ethTransfer: function (req, res, next) {
		var self = this;
		var addressTo = req.body.addressTo;
		var value = 10;
		web3.eth.sendTransaction({ to: addressTo, value: web3.toWei(value, "ether"), from: web3.eth.coinbase}, function (err, success) {
			if (!err)
				res.send({ status: 'SUCCESS', addressTo: addressTo,  message: `Transfered ${value} ether` });
			else
				res.send({ status: 'Failure', message: err});
		});
	},

}
