const sgMail = require('@sendgrid/mail');

require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, subject, html) => {
    await sgMail.send({
        to: email,
        from: process.env.FROM_EMAIL,
        subject,
        html
    });
}

module.exports = {
    sendEmail
}