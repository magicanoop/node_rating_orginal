const AWS = require('aws-sdk');
const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION } = process.env;
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION
});

module.exports = AWS;