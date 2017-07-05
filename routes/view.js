var express = require('express');
var router = express.Router();
var transferToken = require('../api/transferToken');
var createAccount = require('../api/createAccount');
var auth = function(req, res, next) {
  if (req.session && req.session.isLogged)
    return next();
  else
    return res.redirect('/signin');
};

var noauth = function(req, res, next) {
  if (!req.session || !req.session.isLogged)
    return next();
  else
    return res.redirect('/my-account');
};

router.get('/', noauth, function(req, res, next) {
  res.render('index', { title: 'Token | Wallet' });
});

router.get('/signin', noauth, function(req, res, next) {
  res.render('signin', { title: 'Token | Wallet' });
});

router.get('/forgot', noauth, function(req, res, next) {
  res.render('forgot', { title: 'Token | Wallet' });
});

router.get('/reset/:slug', createAccount.getReset);
router.get('/activate/:pub', createAccount.activate);

router.get('/contact-us', function(req, res, next) {
  res.render('contact-us', { title: 'Token | Wallet' });
});

router.get('/buy-xdc', auth, function(req, res, next) {
  res.render('buyxdc', { title: 'Token | Wallet', session:req.session });
});

router.get('/send-xdc', auth, function(req, res, next) {
  res.render('sellxdc', { title: 'Token | Wallet', session:req.session });
});

router.get('/send-xdcconfirm', auth, function(req, res, next) {
  res.render('sellxdcconfirm', { title: 'Token | Wallet', session:req.session });
});

router.get('/statement', auth, function(req, res, next) {
  res.render('statement', { title: 'Token | Wallet', session:req.session });
});

router.get('/support', function(req, res, next) {
  res.render('support', { title: 'Token | Wallet', session:req.session });
});

router.get('/my-account', auth, function(req, res, next) {
  res.render('my-account', { title: 'Token | Wallet', session:req.session });
});

router.get('/setting', auth, function(req, res, next) {
  res.render('setting', { title: 'Token | Wallet', session:req.session });
});

router.get('/kyc', auth, function(req, res, next) {
  res.render('kyc', { title: 'Token | Wallet', session:req.session });
});

router.get('/user-logged', auth, function(req, res, next) {
  res.render('user-logged', { title: 'Token | Wallet', session:req.session });
});

router.get('/logout', auth, function(req, res, next) {
  req.session.destroy();
  res.redirect('/signin');
});

router.post('/ipn_handler', transferToken.ipn_handler);

module.exports = router;
