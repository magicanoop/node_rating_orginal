const { FileServiceFactory } = require('./fileServiceFactory/FileServiceFactory')
const fileServiceFactory = new FileServiceFactory();
const { v4: uuidv4 } = require('uuid');
const config = require('./../../../config/config');
const envConfig = require('config');
const awsSdk = require('../../../config/awsSdk');
const s3 = new awsSdk.S3();

const generateRandomFileName = (fileName) => {
    return `${uuidv4()}.${fileName.split('.').pop()}`.replace(/ /g, "");
};

const generateSignedUrl = async (params) => {
    let fileName = generateRandomFileName(params.fileName);
    let filePath = `${params.filePath}/${fileName}`;
    let service = fileServiceFactory.getStorageService("s3", config);
    let s3Params = service.getPublicImagePayload({ ...params, filePath }, envConfig.aws.s3)
    let uploadUrl = await service.getUploadUrl(s3Params);
    let filePublicUrl = service.getPublicImageUrl({ ...params, filePath }, envConfig.aws.s3);
    
    return {
        uploadUrl,
        filePublicUrl
    }
}

const generateSignedUrlForCourseModule = async (params) => {
    params.filePath = `${config.STORAGE_PATH}course/module`;
    return generateSignedUrl(params);
}

const generateSignedUrlForCategory = async (params) => {
    params.filePath = `${config.STORAGE_PATH}category`;
    return generateSignedUrl(params);
}

const generateSignedUrlForVideoSupportFile = async (params) => {
    params.filePath = `${config.STORAGE_PATH}courses/${params.courseId}/videos/${params.videoId}/supportFiles`;
    return generateSignedUrl(params);
}

const generateSignedUrlForPublicFile = async (params) => {
    params.filePath = `${config.STORAGE_PATH}public/${params.folder}`;
    return generateSignedUrl(params);
}

const generateSignedUrlForNoteFile = async (params) => {
    params.filePath = `${config.STORAGE_PATH}courses/${params.courseId}/notes/${params.noteType}`;
    return generateSignedUrl(params);
}

const startMultipartUpload = async (extension, uuid, contentType) => {
    let fileName = `videos/${uuid}.${extension}`;
    let params = {
        Bucket: envConfig.aws.s3.sourceBucketName,
        Key: fileName,
        ContentType: contentType
    }
    let service = fileServiceFactory.getStorageService("s3", config);
    let upload = service.startMultipartUpload(params);
    return upload;
}

const getMultipartUploadUrl = async (data) => {
    let params = {
        Bucket: envConfig.aws.s3.sourceBucketName,
        Key: data.s3Key,
        PartNumber: data.partNumber,
        UploadId: data.uploadId
    }

    let service = fileServiceFactory.getStorageService("s3", config);
    return service.getMultipartUploadUrl(params);
}

const completeMultipartUpload = async (data) => {
    let params = {
        Bucket: envConfig.aws.s3.sourceBucketName,
        Key: data.s3Key,
        MultipartUpload: {
            Parts: data.parts
        },
        UploadId: data.uploadId
    }

    let service = fileServiceFactory.getStorageService("s3", config);
    return service.completeMultipartUpload(params);
}

const createPresignedUrl = async (key, contentType, acl = envConfig.aws.s3.objectAcl, bucketName = envConfig.aws.s3.bucketName) => {
    const s3Params = {
        Bucket: bucketName,
        Key: key,
        Expires: envConfig.aws.s3.s3UrlExpirationSeconds,
        ContentType: contentType,
        ACL: acl
    }
    let service = fileServiceFactory.getStorageService("s3", config);
    return service.createPresignedUrl(s3Params, envConfig.aws.s3.bucketRegion);
}

const generateSignedUrlForBanner = async (params) => {
    let fileName = generateRandomFileName(params.fileName);
    let filePath = `${config.STORAGE_PATH}assets/banner/${fileName}`;
    let service = fileServiceFactory.getStorageService("s3", config);
    let s3Params = service.getPublicImagePayload({ filePath, ...params }, envConfig.aws.s3)
    let uploadUrl = await service.getUploadUrl(s3Params);
    let filePublicUrl = service.getPublicImageUrl({ filePath, ...params }, envConfig.aws.s3);
    
    return {
        uploadUrl,
        filePublicUrl
    }
}

const getFileExtension = (fileName) => {
    // get file extension
    return fileName.split('.').pop();
}

const uploadFileObject = async (file, filePath, fileName, acl = envConfig.aws.s3.objectAcl,bucketName = envConfig.aws.s3.bucketName) => {
    let params = {
        ACL: acl,
        Body: file?.buffer, 
        Bucket: bucketName, 
        Key: `${filePath}/${uuidv4()}.${getFileExtension(fileName)}`,
        ContentType: file?.mimetype
    };
    let service = await fileServiceFactory.getStorageService("s3", config);
    let data = await service.uploadFileObject(params);
    data.url = await service.getS3FileUrl(params,envConfig.aws.s3.bucketRegion);  
    return data;
}

const generateSignedUrlForLiveSessionImage = async (params) => {
    params.filePath = `${config.STORAGE_PATH}courses/${params.courseId}/live_session`;
    return generateSignedUrl(params);
}

const generateSignedUrlForvideoImage = async (params) => {
    params.filePath = `${config.STORAGE_PATH}courses/${params.courseId}/video`;
    return generateSignedUrl(params);
}

const generateSignedUrlForTestImage = async (params) => {
    params.filePath = `${config.STORAGE_PATH}courses/${params.courseId}/test`;
    return generateSignedUrl(params);
}

const generateSignedUrlForNoteImage = async (params) => {
    params.filePath = `${config.STORAGE_PATH}courses/${params.courseId}/test`;
    return generateSignedUrl(params);
}

const generateSignedUrlForCourseMasterImage = async (params) => {
    params.filePath = `${config.STORAGE_PATH}course-master`;
    return generateSignedUrl(params);
}

const generateSignedUrlForCategoryGroupImage = async (params) => {
    params.filePath = `${config.STORAGE_PATH}category-group`;
    return generateSignedUrl(params);
}

const generateSignedUrlForFacultyImage = async (params) => {
    params.filePath = `${config.STORAGE_PATH}faculty`;
    return generateSignedUrl(params);
}

const generateSignedUrlForCRPNote = async (params) => {
    params.filePath = `${config.STORAGE_PATH}CRP/${params.instituteId}/notes`;
    return generateSignedUrl(params);
}

const generateSignedUrlForInstitute = async (params) => {
    params.filePath = `${config.STORAGE_PATH}institute`;
    return generateSignedUrl(params);
}

module.exports = {
    generateSignedUrlForCourseModule,
    startMultipartUpload,
    getMultipartUploadUrl,
    completeMultipartUpload,
    createPresignedUrl,
    generateSignedUrlForCategory,
    generateSignedUrlForBanner,
    generateSignedUrlForVideoSupportFile,
    uploadFileObject,
    generateSignedUrlForPublicFile,
    generateSignedUrlForNoteFile,
    generateSignedUrlForLiveSessionImage,
    generateSignedUrlForvideoImage,
    generateSignedUrlForTestImage,
    generateSignedUrlForNoteImage,
    generateSignedUrlForCourseMasterImage,
    generateSignedUrlForCategoryGroupImage,
    generateSignedUrlForFacultyImage,
    generateSignedUrlForCRPNote,
    generateSignedUrlForInstitute
}