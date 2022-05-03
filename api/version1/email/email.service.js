const awsSdk = require('../../../config/awsSdk');
const ses = new awsSdk.SES({ apiVersion: '2010-12-01' });
const {logger} = require('../../../config');
const ejs = require('ejs')

exports.createEmailBodyFromTemplate = async (path, data) => {
    let email = await ejs.renderFile(path, data)
    return email;
}

exports.sendTemplatedEmail = async (params) => {
    logger.info("Sending email " + params)
    let response = await ses.sendTemplatedEmail(params).promise();
    return response;
 
}

exports.sendOTPEmail = async (params) => {
    logger.info("Sending email " + params)
    console.log(params)
    let response = await ses.sendEmail(params).promise();
    return response;
}

exports.subscriptionEmail = async (params) => {
    logger.info("Sending email " + params)
    console.log(params)
    let response = await ses.sendEmail(params).promise();
    return response;
}

