const nodemailer = require('nodemailer');
const { AppError } = require("../helpers/utils");


const mailerSend = process.env.MAILER_SEND;
const mailerPass = process.env.MAILER_PASS;

const emailVerification = {};

emailVerification.sendVerificationEmail = (email, subject, text) => {

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    service: 'gmail',
    auth: {
        user: mailerSend,
        pass: mailerPass,
    }
});

const mailOptions = {
    from: mailerSend,
    to: email,
    subject: subject,
    text: text
}

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
        throw new AppError(401, `${error.message}`, "Email verification error")
    } else {
        console.log('Email sent:' + info.response)
    }
});
};

module.exports = emailVerification;