require('dotenv').load()
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.DB + 'accounts');

var schema = new mongoose.Schema({
	password: String,
	_bcrypt: String,
	email: String
});

var  accounts= mongoose.model('accounts', schema);

module.exports = accounts;
