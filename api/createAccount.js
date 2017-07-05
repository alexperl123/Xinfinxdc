var address = require('../address.js');
var contract = require('truffle-contract');
var coin_artifacts = require('../build/contracts/Coin.json');
var axios = require('axios');
var nodemailer = require('nodemailer');
var AES = require('crypto-js/aes');
var SHA256 = require('crypto-js/sha256');
var moment = require('moment')
var bcrypt = require('bcrypt')

// var ethTransfer = require('./ethTransfer');
// var unlockAccount = require('./unlockAccount');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
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
	create: function (req, res, next) {
		var self = this;
		var email = req.body.email;
		var phone = req.body.phone;
		var password = req.body.password;
		var pub = '';
		var phrase = Math.random().toString(36).substring(7);
		web3.personal.newAccount(phrase, function (error, result) {
			if (!error) {
				// console.log(result);
				web3.personal.getListAccounts(function (er, re) {
					if (!er && re.length > 0) {
						var pub = re[re.length - 1];
						var url = process.env.DB + 'accounts';
						MongoClient.connect(url, function (err, db) {
							assert.equal(null, err);

							db.collection('accounts').find({email:email}).toArray(function(er1,re1){
								if(re1.length) {
									res.send({ status: 'FAILED', message: 'Email already exists.' });
								} else {

									var hash = bcrypt.hashSync( password, 10);
									//console.log(hash);

									db.collection('accounts').insertOne({
										"email": email,
										"password": hash,
										"phone": phone,
										"status": 'INACTIVE',
										"public": pub,
										"phrase": phrase
									}, function (err, result) {
										assert.equal(err, null);
										// create reusable transporter object using the default SMTP transport
										let transporter = nodemailer.createTransport({
											host: '',
											secure: false,
											auth: {
												user: '',
												pass: ''
											}
										});
										// setup email data with unicode symbols
										let mailOptions = {
											from: '"', // sender address
											to: email, // list of receivers
											subject: '', // Subject line
											html: ``
										};

										// send mail with defined transport object
										transporter.sendMail(mailOptions, (error2, info) => {
											if (error2) {
												return console.log("RESULT ERROR = ", error2);
											}
											// res.send({status:'SUCCESS',message:'Reset link has been sent to your registered email.'})
										});

										axios.post(process.env.API+'unlockaccount', {
											address: ,
											password: ''
										})
										.then(function (response) {
											axios.post(process.env.API+'geteth', {
												addressTo: pub
											})
											.then(function (response) {
												console.log('Transfered 10 ether!');
											})
											.catch(function (response) {
												console.log(response);
											});
											console.log('Unlocked Account!');
										})
										.catch(function (response) {
											console.log(response);
										});

										res.send({ public: pub, status: 'SUCCESS', message: 'Account Created Successfully.' });
									});
									db.close();

								}
							})

						});
					}
				});
			} else {
				console.log("ERROR NEW acc", error)
			}
		});
	},
	signin: function(req, res, next) {
		var self = this;
		var username = req.body.username;
		var password = req.body.password;
		var url = process.env.DB+'accounts';

		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);
			db.collection('accounts').find({email: username, status:'ACTIVE'}).toArray(function(err, results){
				if(results.length && bcrypt.compareSync(password, results[0].password)) {
					req.session.public = results[0].public;
					req.session.email = results[0].email;
					req.session.mobile = results[0].phone;
					req.session.isLogged = true;
					res.send({status:'SUCCESS',message:'Successfully logged in.',isLogged:req.session.isLogged})
				} else {
					req.session.destroy()
					res.send({status:'FAILED',message:'Failed login attempt. Please retry.'})
				}
			});
		});
	},
	forgot: function(req, res, next) {
		//send email
		var url = process.env.DB+'accounts';

		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);
			db.collection('accounts').findOne({email: req.body.email}, function(error, result){
				if(result) {
					email = result.email;
					date = SHA256(moment().format().toString())
					db.collection('accounts').findAndModify(

					{email: email.toString()},

					[['_id','asc']],

					{$set:{
						"reset": date.toString()
					}},

					{}, //options
					function(error1, result1){
						//assert.equal(error1, null);
						if(error1){console.log("mongo error",error1)}

						db.close();
						// create reusable transporter object using the default SMTP transport
						let transporter = nodemailer.createTransport({
							host: 'mail-b01.cloudmailbox.in',
							secure: false,
							auth: {
									user: 'xinfin@mail-b01.cloudmailbox.in',
									pass: 'DEfER#e'
							}
						});
						// setup email data with unicode symbols
						let mailOptions = {
							from: '"XinFin" <info@xinfin.org>', // sender address
							to: req.body.email, // list of receivers
							subject: 'Reset Password Link', // Subject line
							html: `<strong>Hi,</strong><br><br>Xinfin recently received a request for a forgotten password. <br><br>To change your Xinfin password, Please click on this <a href="https://ewallet.xinfin.org/reset/${date}">link</a><br><br>This link will expire in 10 minutes.<br><br>Thanks<br>Xinfin Support`
						};

						// send mail with defined transport object
						transporter.sendMail(mailOptions, (error2, info) => {
							if (error2) {
								return console.log("RESULT ERROR = ", error2);
							}
							res.send({status:'SUCCESS',message:'Reset link has been sent to your registered email.'})
						});
						//db.close();
					});
				} else {
					res.send({status:'FAILED',message:`Entered Email doesn't exists.`})
				}
			});
		//db.close();
		});
	},
	getReset: function(req, res, next) {
		var url = process.env.DB+'accounts';

		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);

			db.collection('accounts').findOne({reset: req.params.slug}, function(error, result){ console.log(error,result)
				if(!error && result!=null){
					res.render('reset', { title: 'Token | Wallet', reset_code: req.params.slug });
				} else {
					res.send({data:"Reset Link Expired", status: "FAILED"});
				}
			});
		});
	},
	postReset: function(req, res, next) {
		var url = process.env.DB+'accounts';

		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);

			db.collection('accounts').findOne({reset: req.body.reset_code}, function(error, result){

				if(error) {
					res.send({message:"Reset link expired.",status:'FAILED'});
				} else {
					var hash = bcrypt.hashSync(req.body.password.toString(), 10)
					db.collection('accounts').findAndModify(

					{reset: req.body.reset_code},

					[['_id','asc']],

					{$set:{
						"reset": '',
						"password": hash
					}},

					{}, //options
					function(error1, result1){
						//assert.equal(error1, null);
						if(error1){
							console.log("mongo error",error1)
							res.send({message:"Something Went Wrong.",status:'FAILED'});
						}
						res.send({message:"Password Changed Successfully.",status:'SUCCESS'});
						db.close();
					});

				}
			});
		});
	},
	activate: function(req, res, next) {
		var url = process.env.DB+'accounts';

		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);

			db.collection('accounts').findOne({public: req.params.pub}, function(error, result){

				if(error) {
					res.send({message:"Something went wrong.",status:'FAILED'});
				} else {
					db.collection('accounts').findAndModify(

					{public: req.params.pub},

					[['_id','asc']],

					{$set:{
						"status": 'ACTIVE'
					}},

					{}, //options
					function(error1, result1){
						//assert.equal(error1, null);
						if(error1){
							console.log("mongo error",error1)
							res.send({message:"Something Went Wrong.",status:'FAILED'});
						}
						res.render('activated', {message:"Activated Successfully.",status:'SUCCESS'});
						db.close();
					});

				}
			});
		});
	}
}
