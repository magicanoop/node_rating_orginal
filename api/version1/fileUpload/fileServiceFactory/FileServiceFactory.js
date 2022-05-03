const { S3Services } = require('./s3Services');
const AwsSDK = require('../../../../config/awsSdk')
const s3 = new AwsSDK.S3();

class FileServiceFactory {
    getStorageService(type, config) {
        if (type == "s3") {
            return new S3Services(s3, config);
        }
    }
}

module.exports = {
    FileServiceFactory
}