require('dotenv').load()

var address = require('../address.js');
var contract = require('truffle-contract');
var coin_artifacts = require('../build/contracts/Coin.json');
var axios = require('axios');
var moment = require('moment');
var nodemailer = require('nodemailer');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var coinPay = require('coinpayments');
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
	});
}
module.exports = {
	transfer: function (req, res, next) {
		var account = req.body.addressFrom.toLowerCase();
		start();
		var self = this;
		var addressTo = req.body.addressTo.toLowerCase();
		var value = parseInt(parseFloat(req.body.value) * 10000);
		var coin;

		Coin.deployed().then(function (instance) {
			coin = instance;
			tx = coin.transfer(addressTo, value, {from: account, gas: 2000000}).then(function(txid){

				// console.log("TXID = ", txid)
				var url = process.env.DB + 'accounts';
				MongoClient.connect(url, function (err, db) {
					assert.equal(null, err);

					db.collection('transactions').insertOne({
						"tx": txid.tx,
						"from": account,
						"to": addressTo,
						"value": value / 10000,
						"blockNumber": txid.receipt.blockNumber,
						"blockHash": txid.receipt.blockHash,
						"status": 'ACTIVE',
						"transactionHash": txid.receipt.transactionHash,
						"gasUsed": txid.receipt.gasUsed,
						"receipt": txid.receipt,
						"logs": txid.logs,
						"time": moment().format().toString()
					}, function (err, result) {
						assert.equal(err, null);
						// return {}
						res.send({ response:txid.tx, status: 'SUCCESS', message: 'Transfer Success' });
					});
					db.close();
				});

				return tx;
			}).catch(function (e) {
				res.json({ status: "FAILED", message: "Something went wrong. Please try again." })
			});
		});


	},
 verifyxdcaddress:  function (req, res, next) {
		var address = req.body.account;
		var xdc = parseFloat(req.body.xdc);
		var url = process.env.DB+'accounts';
		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);

			db.collection('accounts').find({
				"public": address
			}).toArray( function (err1, result1) {
				//console.log("public=address",result1)
				if(err1 || result1.length == 0) {
					res.send({ status: 'FAILED', message: 'Address is invalid. Recheck address field.' })
					return;
				}
				res.send({ status: 'SUCCESS', message: 'Address is valid.' })
				return;
			});
		});
	},
	sendxdc:  function (req, res, next) {
		var address = req.body.account;
		var xdc = parseFloat(req.body.xdc);
		console.log("XDC = " + xdc)
		var url = process.env.DB+'accounts';
		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);

			db.collection('accounts').find({
				"public": address
			}).toArray( function (err1, result1) {
				//console.log("public=address",result1)
				if(err1 || result1.length == 0) {
					res.send({ status: 'FAILED', message: 'Address is invalid. Recheck address field.' })
					return;
				}

				db.collection('accounts').findOne({
					"email": req.session.email,
					"public": req.session.public
				}, function (err, result) {
					assert.equal(err, null);
					// console.log('unlockaccount request')
					axios.post(process.env.API+'unlockaccount', {
						address: req.session.public,
						password: result.phrase
					})
					.then(function (response) {
						// console.log('transfertoken request', xdc)
						axios.post(process.env.API+'transfertoken', {
							addressTo: req.body.account,
							addressFrom: req.session.public,
							value: xdc
						})
						.then(function (response1) {
							// console.log("RESPONSE 1 = ", response1)

							let transporter = nodemailer.createTransport({
								host: 'mail-b01.cloudmailbox.in',
								secure: false,
								auth: {
										user: '',
										pass: ''
								}
							});
							// setup email data with unicode symbols
							let mailOptions1 = {
								from: '">', // sender address
								to: req.session.email, // list of receivers
								subject: 'Transfer Success', // Subject line
								html: `<strong>Hi,</strong><br><br>
										Your account has been debited with XDC Nos: ${xdc}<br>
										Transfered to: ${req.body.account} <br><br>
										Thanks<br>
										Xinfin Support`
							};

							let mailOptions2 = {
								from: '">', // sender address
								to: result1[0].email, // list of receivers
								subject: 'Transfer Success', // Subject line
								html: `<strong>Hi,</strong><br><br>
										Your account has been credited with XDC Nos: ${xdc}<br>
										Transfered by: ${req.session.public} <br><br>
										Thanks<br>
										Xinfin Support`
							};

							// send mail with defined transport object
							transporter.sendMail(mailOptions1, (error2, info) => {
								if (error2) {
									return console.log("RESULT ERROR = ", error2);
								}
							});
							transporter.sendMail(mailOptions2, (error2, info) => {
								if (error2) {
									return console.log("RESULT ERROR = ", error2);
								}
							});
							res.send({ status: 'SUCCESS', message: 'Transfer Success' });
						});
					})
					.catch(function (response) {
						res.send({ status: 'FAILED', message: 'Transfer Failed' });
						console.log(response);
						return;
					});

					db.close();
				});
			});
		});
	},
	transactions: function(req, res, next) {
		var url = process.env.DB+'accounts';
		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);
			var collection = db.collection('transactions');
			collection.find({
				$or: [{
					"from": req.session.public
				}, {
					"to": req.session.public
				}]
			}).sort({time:-1}).toArray(function (err, items) {
				res.send({data:items,status:true});
				db.close();
			});
		});
	},
	buy: function(req, res, next) {
		if(req.body.currency == 'BTC' || req.body.currency == 'ETH') {
			//client.rates(function(err,result){
			client.createTransaction({
				'currency1' : 'USD',
				'currency2' : req.body.currency,
				'amount' : req.body.xdcnos*0.0004,
				'buyer_email': req.session.email,
				'custom': req.session.public,
				'item_name': 'XDC',
				'item_number': req.body.xdcnos
			},function(err1,result1){
				res.send({data:result1, xdc:req.body.xdcnos, currency:req.body.currency, dollars:req.body.xdcnos*0.0004, status:"SUCCESS"});
			});
			//});
		} else {
			res.send({message:"Currency not valid.", status:"FAILED"});
		}
	},
	ipn_handler: function(req, res, next) {
		var url = process.env.DB + 'accounts';
		/*MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);
			db.collection('ipn').insertOne(req.body, function (err, result) {
				assert.equal(err, null);
			});
			db.close();
		});*/

		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);

			db.collection('ipn').find(req.body).toArray(function(e,r) {
				if(r.length) {
					console.log("Already in ipn_new")
				} else {
					db.collection('ipn').insertOne(req.body, function(e1,r1) {
						if(!e1 && req.body.status == 100) {
							axios.post(process.env.API+'unlockaccount', {
								address: , //should have tokens
								password: ""
							})
							.then(function (response) {

								axios.post(process.env.API+'transfertoken', {
									addressTo: req.body.custom, //req.body.custom
									addressFrom: web3.eth.coinbase,
									value: req.body.item_number //req.body.item_number
								})
								.then(function (response1) {
									db.close();
									//res.send({ status: 'SUCCESS', message: 'Transfer Success' });
								});
							})
							.catch(function (response) {
								console.log(response);
							});
						} else {
							//res.send({ response:req.body, status: 'SUCCESS', message: 'Transfer Success' });
						}

					})

				}
			})
		});
		//console.log(req.body);
		//return;
	}
}
