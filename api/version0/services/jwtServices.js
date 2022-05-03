const jwt = require('jsonwebtoken');
const config = require('config');
//const secretKey = process.env.JWT_SECRET || config.jwt.secretKey;cosole.log(secretKey);
const secretKey="askjkfkdfdkfjdkfjdkfjdk";
const responseHelper = require('./../utils/responseHelper');
const responseMessages = require('./../constants/messages');

exports.createJWToken = (payload, tokenExpiration) => {
    return jwt.sign({
        data: payload
    }, secretKey, { expiresIn: tokenExpiration });
}

exports.decodeToken = (token) => {
    return jwt.verify(token, secretKey);
}

exports.verifyToken = (token) => {
    try {
        let tokenData = this.decodeToken(token).data;
        return tokenData;
    } catch (error) {
        if (error.message === "jwt expired") {
            throw responseHelper.createCustomResponse(498, "TOKEN EXPIRED")
        } else {
            throw responseHelper.createCustomResponse(401, "INVALID TOKEN")
        }
    }
}