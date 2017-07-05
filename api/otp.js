var address = require('../address.js');
var contract = require('truffle-contract');
var coin_artifacts = require('../build/contracts/Coin.json');
var axios = require('axios');
var nodemailer = require('nodemailer');
var AES = require('crypto-js/aes');
var SHA256 = require('crypto-js/sha256');
var bcrypt = require('bcrypt')
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var web3_extended = require('web3_extended');
var sendmail = require('./sendmail.js');
var moment = require('moment');

var errorMessage = "";
var url = process.env.DB + 'accounts';
 
module.exports = {
    // Call this from sellxdc.ejs
    otp: function(req, res, next) {
            
            var wallet_address = req.body.address;
            var account = req.body.account;
            var xdc = req.body.xdc;
            var toemail = req.body.email;
           
            MongoClient.connect(url, function (err, db) 
            {	
                        assert.equal(null, err);	
                        var queryGet = { public: wallet_address, IsExpired: "0", IsUsed: "0" };    
                        db.collection("xdcotp").find(queryGet).toArray(function(error, result) 
                        {
                            if(error) { res.send({message:error,status:'FAILED'}); }    
                           else
                           {
                               if(result.length > 0) 
                               {
                                    var startDate = moment(result[0].ValidityDateTime);
                                    var endDate =  moment(moment().format().toString());
                                    var minDiff = endDate.diff(startDate, 'minutes');
                                    if (minDiff <= 10)
                                    {
                                        res.send({message:"Last 'Send XDC' request not processed. Please try after some time or after 10 minutes.",status:'FAILED'});
                                    }
                                    else
                                    {
                                          ExpireUsedOTP(req,res,"1","0","0"); // Expire old OTP and create new OTP
                                    } 
                               }
                               else
                               {
                                    insertOTP(req,res); // Create New OTP for first time
                               }
                           }  
                    });
                  
            });

    },
    // Call this from sellxdcconfirm.ejs to verify OTP
    verifyotp: function(req, res, next) {
       var wallet_address = req.body.address;
       var otp = req.body.OTP;     
         MongoClient.connect(url, function (err, db) 
            {		
                        var queryGet = { public: wallet_address, otp: otp.toString(), IsExpired: "0", IsUsed: "0"  };    
                        db.collection("xdcotp").find(queryGet).toArray(function(error, result) 
                        {
                            if(error) { res.send({message:error,status:'FAILED'}); }    
                           else
                           {
                               if(result.length > 0) 
                               {   ExpireUsedOTP(req,res,"0","1","0");   }
                               else
                               {
                                   res.send({message:"Invalid OTP.",status:'FAILED'});
                               }
                           }  
                    });
            });

    },
    // Call this from sellxdcconfirm.ejs to Cancel OTP 
    cancelotp: function(req, res, next) {
       var wallet_address = req.body.address;
       var toemail = req.body.email;
       var account = req.body.account;
         MongoClient.connect(url, function (err, db) 
            {		
                        var queryGet = { public: wallet_address, IsExpired: "0", IsUsed: "0" };    
                        db.collection("xdcotp").find(queryGet).toArray(function(error, result) 
                        {
                            if(error) { res.send({message:error,status:'FAILED'}); }    
                           else
                           {
                               if(result.length > 0) 
                               {   
                                   ExpireUsedOTP(req,res,"0","0","0");   
                                   var subject = 'Send XDC - Cancelled Request Alert';
                                   var html = `<strong>Hi,</strong><br><br>You have cancelled request of Send XDC.<br><br>Thanks<br>Xinfin Support `;
                                   sendmail.sendmail(toemail,subject,html);
                                   res.send({message:"Rquest cancel successfully.",status:'SUCCESS'}); 
                                }
                               else
                               {
                                   res.send({message:"Not found pending Request. Please try once again to Send XDC",status:'FAILED'});
                               }
                           }  
                    });
            });

    },
    // Call this from sellxdcconfirm.ejs to Regenerate OTP
    regenerateotp: function(req, res, next) {
       var wallet_address = req.body.address;
       var toemail = req.body.email;
         MongoClient.connect(url, function (err, db) 
            {		
                        var queryGet = { public: wallet_address, IsExpired: "0", IsUsed: "0" };       
                        db.collection("xdcotp").find(queryGet).toArray(function(error, result) 
                        {
                            if(error) { res.send({message:error,status:'FAILED'}); }    
                           else
                           {
                               if(result.length > 0) 
                               {
                                        var count = parseInt(result[0].count) + 1;
                                        var startDate = moment(result[0].ValidityDateTime);
                                        var endDate =  moment(moment().format().toString());
                                        var minDiff = endDate.diff(startDate, 'minutes');
                                        if (minDiff < 10 && count < 4 )
                                        {
                                            UpdateOTPCount(req,res,count);
                                            var otpNo = result[0].otp;
                                            var subject = 'Send XDC - OTP Alert';
                                            var html = `<strong>Hi,</strong><br><br>Please use OTP ${otpNo} to Send XDC. <br><br>Thanks<br>Xinfin Support `;
                                            sendmail.sendmail(toemail,subject,html);
                                            res.send({message:"OTP sent Successfully on your Email.",status:'SUCCESS'});
                                        }
                                        else if (minDiff < 10 && count >= 4 && minDiff < 20 )
                                        {
                                             res.send({message:"Please try after 10 minutes.",status:'FAILED'});        
                                        }
                                        else 
                                        {
                                                ExpireUsedOTP(req,res,"1","0","0");
                                        }
                                 }
                                 else
                                 {
                                     res.send({message:"Something Went Wrong.",status:'FAILED'}); 
                                 }
                           }  
                    });
            });
    },
    // Call this from sellxdcconfirm.ejs
    getotp: function(req, res, next) {
       var wallet_address = req.body.address;
         MongoClient.connect(url, function (err, db) 
            {	
                        assert.equal(null, err);	
                        var queryGet = { public: wallet_address, IsExpired: "0", IsUsed: "0" };    
                        db.collection("xdcotp").find(queryGet).toArray(function(error, result) 
                        {
                            if(error) { res.send({message:error,status:'FAILED'}); }    
                           else
                           {
                               if(result.length > 0) 
                               {
                                    var startDate = moment(result[0].ValidityDateTime);
                                    var endDate =  moment(moment().format().toString());
                                    var minDiff = endDate.diff(startDate, 'minutes');
                                    if (minDiff > 10)
                                    {
                                        ExpireUsedOTP(req,res,"1","0","0");
                                        res.send({message:"Last OTP Expired. Send new OTP on your Email.",status:'FAILED'});
                                        //res.redirect('/send-xdcconfirm');
                                    }
                                    else
                                    {
                                           var account = result[0].account;
                                           var xdc =   result[0].xdc;
                                           res.json({ message: "Success", account: account, xdc: xdc})
                                    } 
                               }
                               else
                               {
                                    //insertOTP(req,res);
                                    res.send({message:"Something Went Wrong..",status:'FAILED'});
                               }
                           }  
                    });
            });

    }
 
};
// This function is using for to update Expire and Used for OTP. And if require then also insert OTP as per out sider call
function ExpireUsedOTP(req, res,IsCallInsertOTP,IsUsedOTP,IsRegOTP)
    {
        var queryGet = { public: req.body.address, IsExpired: "0", IsUsed: "0" };   
        var queryUpdate =   {$set:{"IsExpired": '1',"LastUpdatedDateTime" : moment().format().toString()}};
        if (IsUsedOTP == "1" || IsRegOTP == "1")
        {
            queryUpdate =   {$set:{"IsUsed": '1',"LastUpdatedDateTime" : moment().format().toString()}};
        }
        //console.log(queryUpdate);
        MongoClient.connect(url, function (err, db) 
        {
            db.collection('xdcotp').findAndModify(
                queryGet,
                [['_id','asc']],
                queryUpdate,
                {}, //options
                function(error1, result1){
                    //assert.equal(error1, null);
                    if(error1){
                        //console.log("mongo error",error1)
                        res.send({message:"Something Went Wrong.",status:'FAILED'});
                    }
                    db.close();
                    if (IsCallInsertOTP == "1" || IsRegOTP =="1")
                    {insertOTP(req,res);}
                     if (IsUsedOTP == "1")
                     {
                          res.send({message:"OTP Verified.",status:'SUCCESS'});       
                     }
                   
                });
        });
    }
 // Create OTP and insert into Database and also send email to user   
 function insertOTP(req, res)
    {
        var otpNo = Math.floor(1000 + Math.random() * 9000);
        var wallet_address = req.body.address;
        var account = req.body.account;
        var xdc = req.body.xdc;
        var toemail = req.body.email;
        MongoClient.connect(url, function (err, db) 
            {
                    db.collection('xdcotp').insertOne({
                                            "otp": otpNo.toString(),
                                            "account": account, 
                                            "xdc": xdc,
                                            "public": wallet_address,
                                            "ValidityDateTime": moment().format().toString(),
                                            "LastUpdatedDateTime" : moment().format().toString(),
                                            "IsUsed" : '0',
                                            "IsExpired" : '0',
                                            "count" : '1',
                                        }, function(error, result)
                                        {
                                        if(error) {
                                            res.send({message:error,status:'FAILED'});
                                        }    
                                        else
                                        {
                                            var subject = 'Send XDC - OTP Alert';
                                            var html = `<strong>Hi,</strong><br><br>Please use OTP ${otpNo} to Send XDC. <br><br>Thanks<br>Xinfin Support `;
                                            sendmail.sendmail(toemail,subject,html);
                                            res.send({message:"OTP sent Successfully on your Email.",status:'SUCCESS'});
                                        }     
                                    });   
                                    db.close();
             });
    };

    // This function is using for to update OTP count
function UpdateOTPCount(req, res,cntUpdate)
    {
        var queryGet = { public: req.body.address, IsExpired: "0", IsUsed: "0" };   
        var queryUpdate =   {$set:{"count": cntUpdate,"LastUpdatedDateTime" : moment().format().toString()}};
        MongoClient.connect(url, function (err, db) 
        {
            db.collection('xdcotp').findAndModify(
                queryGet,
                [['_id','asc']],
                queryUpdate,
                {}, //options
                function(error1, result1){
                    if(error1){
                        res.send({message:"Something Went Wrong.",status:'FAILED'});
                    }
                    db.close();                   
                });
        });
    }