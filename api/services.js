var nodemailer = require('nodemailer');
var moment = require('moment')

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
require('dotenv').load()

var errorMessage = "";

module.exports = {
	contact: function(req, res, next) {
		//send email
		var url = process.env.DB+'accounts';

		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);
			db.collection('queries').insertOne({ name: req.body.name, email: req.body.email, query: req.body.query, source: 'CONTACT' }, function (err1, result) {
				assert.equal(err1, null);
				// create reusable transporter object using the default SMTP transport
				let transporter = nodemailer.createTransport({
					host: 'mail-b01.cloudmailbox.in',
					secure: false,
					auth: {
						user: '',
						pass: ''
					}
				});
				// setup email data with unicode symbols
				let mailOptions = {
					from: '"XinFin.org" <no-reply@xinfin.org>', // sender address
					to: 'info@xinfin.org', // list of receivers
					subject: 'Query from contact us.', // Subject line
					html: `Name :- ${req.body.name}<br>Email :- ${req.body.email}<br>Query :- ${req.body.query}<br> Thanks Xinfin Foundation`
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error2, info) => {
					if (error2) {
						res.send({ status: 'FAILED', message: 'Something Went Wrong. Please try again later.' });
						return console.log("RESULT ERROR = ", error2);
					} else {
						res.send({ status: 'SUCCESS', message: 'Query Sent. Some official from Xinfin will contact you shortly.' });
					}
					// res.send({status:'SUCCESS',message:'Reset link has been sent to your registered email.'})
				});

			});
			db.close();
		});
	},
	support: function(req, res, next) {
		//send email
		var url = process.env.DB+'accounts';

		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);
			db.collection('tickets').insertOne({ email: req.body.email, query: req.body.query, source: 'SUPPORT' }, function (err1, result) {
				assert.equal(err1, null);
				// create reusable transporter object using the default SMTP transport
				let transporter = nodemailer.createTransport({
					host: 'mail-b01.cloudmailbox.in',
					secure: false,
					auth: {
						user: '',
						pass: ''
					}
				});
				// setup email data with unicode symbols
				let mailOptions = {
					from: '"XinFin.org" <no-reply@xinfin.org>', // sender address
					to: 'info@xinfin.org', // list of receivers
					subject: 'Support request.', // Subject line
					html: `Email :- ${req.body.email}<br>Query :- ${req.body.query}<br><br> Thanks Xinfin Support`
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error2, info) => {
console.log(error2, info);
					if (error2) {
						res.send({ status: 'FAILED', message: 'Something Went Wrong. Please try again later.' });
						return console.log("RESULT ERROR = ", error2);
					} else {
						res.send({ status: 'SUCCESS', message: 'Query Sent. Some official from Xinfin will contact you shortly.' });
					}
					// res.send({status:'SUCCESS',message:'Reset link has been sent to your registered email.'})
				});

			});
			db.close();
		});
	}
}
