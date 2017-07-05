var address = require('../address.js');
var contract = require('truffle-contract');
var coin_artifacts = require('../build/contracts/Coin.json');

var BigNumber = require('bignumber.js');

var Coin = contract(coin_artifacts);

var accounts;
var account;

var errorMessage = "";
function start() {
	var self = this;
	Coin.setProvider(web3.currentProvider);
	web3.eth.getAccounts(function (err, accs) {
		if (err != null) {
			errorMessage = "There was an error fetching your accounts.";
			return;
		}
		if (accs.length == 0) {
			errorMessage = "Couldn't get any accounts! Make sure your Ethereum client is configured correctly.";
			return;
		}
		accounts = accs;
		account = web3.eth.coinbase;
	});
}
module.exports = {
	getBalance: function (req, res, next) {
		start();
		var self = this;
		var wallet_address = req.body.address;
		var coin;
		Coin.deployed().then(function (instance) {
			coin = instance;
			return coin.balanceOf.call(wallet_address, { from: account });
		}).then(function (response) {
			num = new BigNumber(response).div(10000);
			// console.log("Balance = ", parseFloat(response/10000), response, num)
			res.json({ message: "Success", address: wallet_address, res: response, balance: num})
		}).catch(function (e) {
			res.json({ message: "Failure", Error: e, errorMessage: errorMessage })
		});
	},
}
