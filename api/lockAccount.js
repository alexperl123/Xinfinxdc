require('dotenv').load()

var web3_extended = require('web3_extended');
var options = {
	host: process.env.RPC,
	ipc: true,
	personal: true,
	admin: false,
	debug: false
};
var web3 = web3_extended.create(options);

module.exports = {
	lock: function (req, res, next) {
		var self = this;
		var account = req.body.address;
		web3.personal.lockAccount(account);
		res.json({ status: "SUCCESS", message: `Account ${account} Locked` });
	},
}
