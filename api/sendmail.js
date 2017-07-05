var nodemailer = require('nodemailer');

// Create common function to send email
module.exports = {
    sendmail: function (ToEmail, Subject, Body) {
        	let transporter = nodemailer.createTransport({
            host: 'mail-b01.cloudmailbox.in',
            secure: false,
            auth: {
                user: '',
                pass: ''
            }
        });
        let mailOptions = {
        from: '""', // sender address
        to: ToEmail, // list of receivers
        subject: Subject, // Subject line
        html: Body
        };
       	// send mail with defined transport object
        
        transporter.sendMail(mailOptions, (error2, info) => {
            if (error2) {
                return console.log("RESULT ERROR = ", error2);
            }
        });

    },
}