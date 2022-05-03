const { FileStorageService } = require('./fileStorageService');
const BluebirdPromise = require('bluebird')
class S3Services extends FileStorageService {
    constructor(s3Client, { PRESIGNED_URL_EXPIRY_TIME, S3_OBJECT_ACL_PUBLIC }) {
        super();
        this.s3Client = s3Client;
        this.PRESIGNED_URL_EXPIRY_TIME = PRESIGNED_URL_EXPIRY_TIME;
        this.S3_OBJECT_ACL_PUBLIC = S3_OBJECT_ACL_PUBLIC;
    }

    getPublicImagePayload({ contentType, filePath }, { imageSourceBucketName }) {
        return {
            Bucket: imageSourceBucketName,
            Key: filePath,
            Expires: this.PRESIGNED_URL_EXPIRY_TIME,
            ContentType: contentType,
            ACL: this.S3_OBJECT_ACL_PUBLIC
        }
    }

    getUploadUrl(params) {
        return this.s3Client.getSignedUrlPromise('putObject', params)
    };

    getPublicImageUrl({ filePath }, { imageSourceBucketName, bucketRegion }) {
        let filePublicUrl = `https://${imageSourceBucketName}.s3.${bucketRegion}.amazonaws.com/${filePath}`;
        return filePublicUrl;
    }

    startMultipartUpload = async (params) => {
        let createUploadPromised = BluebirdPromise.promisify(this.s3Client.createMultipartUpload.bind(this.s3Client))
        let upload = await createUploadPromised(params);
        upload.url = `https://${params.Bucket}/${upload.Key}`;
        return upload;
    }

    getMultipartUploadUrl = async (params) => {
        const presignedUrl = await this.s3Client.getSignedUrl('uploadPart', params);
        return { presignedUrl };
    }

    completeMultipartUpload = async (params) => {
        let completeUploadPromised = BluebirdPromise.promisify(this.s3Client.completeMultipartUpload.bind(this.s3Client));
        return await completeUploadPromised(params);
    }

    createPresignedUrl = async (params, bucketRegion) => {
        let uploadURL = await this.getUploadUrl(params);
        let filePublicUrl = `https://${params.Bucket}.s3.${bucketRegion}.amazonaws.com/${params.Key}`;
        return {
            uploadURL, filePublicUrl
        }
    }

    getS3FileUrl = async (params, region) => {
        // generate url
        return `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
    } 

    uploadFileObject = async (params) => {
        const fileObjectUpload = BluebirdPromise.promisify(this.s3Client.putObject.bind(this.s3Client));
        let data = await fileObjectUpload(params);
        return data
    }
}

module.exports = {
    S3Services
}