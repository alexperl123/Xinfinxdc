var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var coinPay = require('coinpayments');

var view = require('./routes/view');
var api = require('./routes/api');

var app = express();
var session = require('express-session')
app.use(session({
    secret: '',
    resave: true,
    saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', view);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var client = new coinPay({
                  'key': '',
                  'secret': '',
                  'autoIpn': true
                 });

// client.createTransaction(...) Make transaction(s)
app.use('/ipn_handler', client.ipn({
                            'merchantId': '',
                            'merchantSecret': ''
                          }));
client.on('ipn_error', function(data){nfo@xinfin
    // Handle error
return;
	console.log("IPN_ERROR---------",data)
});
client.on('ipn_fail', function(data){
    // Handle failed transaction
        console.log("IPN_FAIL---------",data)
});
client.on('ipn_pending', function(data){
    // Handle pending payment
        console.log("IPN_PENDING---------",data)
});
client.on('ipn_complete', function(data){
    // Handle completed payment
        console.log("IPN_COMPLETE---------",data)
});


module.exports = app;
