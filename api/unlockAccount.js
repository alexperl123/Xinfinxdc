// var address = require('../address.js');
// var contract = require('truffle-contract');
// var coin_artifacts = require('../build/contracts/Coin.json');
require('dotenv').load()

var web3_extended = require('web3_extended');
var options = {
	host: process.env.RPC,
	ipc:true,
	personal: true,
	admin: false,
	debug: true
};
var web3 = web3_extended.create(options);

module.exports = {
	unlock: function (req, res, next) {
		var self = this;
		var account = req.body.address;
		var password = req.body.password;
		web3.personal.unlockAccount(account, password,function(error,result){
			if(!error){
				console.log(result);
				res.send({public: account,status:"UNLOCKED"});
			} else {
				console.log("ERROR NEW acc", error)
			}
		});

	},
}
