var express = require('express');
var router = express.Router();
var auth = function(req, res, next) {
  if (req.session && req.session.isLogged)
    return next();
  else
    return res.json({status:'FAILED',message:'Please login.'});
};

var balance = require('../api/balance');
var transferToken = require('../api/transferToken');
var createAccount = require('../api/createAccount');
var unlockAccount = require('../api/unlockAccount');
var lockAccount = require('../api/lockAccount');
var ethTransfer = require('../api/ethTransfer');
var ethBalance = require('../api/ethBalance');
var services = require('../api/services');
var test = require('../api/test');
var otp = require('../api/otp');

//var sendmail = require('../api/sendmail');

router.post('/balance', balance.getBalance);
router.post('/transfertoken', transferToken.transfer);
router.post('/unlockaccount', unlockAccount.unlock);
router.post('/account/create', createAccount.create);
router.post('/geteth', ethTransfer.ethTransfer);
router.post('/ethbalance', ethBalance.balance);
router.post('/lockaccount', lockAccount.lock);
router.post('/signin', createAccount.signin);
router.post('/sendxdc', auth, transferToken.sendxdc);
router.get('/transactions', auth, transferToken.transactions);
router.post('/buy', transferToken.buy);
router.post('/forgot', createAccount.forgot);
router.post('/reset', createAccount.postReset);
router.post('/contact', services.contact);
router.post('/support', services.support);
router.get('/changepassword', test.changepassword);
router.post('/otp', otp.otp);
router.post('/getotp', otp.getotp);
router.post('/verifyotp', otp.verifyotp);
router.post('/cancelotp', otp.cancelotp);
router.post('/regenerateotp', otp.regenerateotp);
router.post('/verifyxdcaddress', transferToken.verifyxdcaddress);
//router.post('/sendmail', sendmail.sendmail);

module.exports = router;
