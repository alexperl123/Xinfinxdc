var bcrypt = require('bcrypt')
var  accounts= require('../mongoConfig')

require('dotenv').load()

module.exports = {
	changepassword: function(req, res, next) {
		accounts.find({}, function(e, res){
			res.forEach(function(a){
				//a._bcrypt = a.password;
			//	a.password = bcrypt.hashSync(a.password,10);
a.save();
			});
		})

	}
}
