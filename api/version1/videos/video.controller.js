const {
    addVideo,
    updateVideo,
    getVideo,
    getSignedCookie,
    sendVideoAddedNotification,
    getStreamUrls
} = require('./video.service');
const envConfig = require('config');
const singleContentService = require('../../version0/services/singleContent.service');
const fileUploadService = require('../fileUpload/fileUpload.service');

exports.saveVideoDetails = async (httpRequest) => {
    const { body, user } = httpRequest;

    body.createdByUser = user?._id ?? "";
    const response = await addVideo(body);
    
    if (response?.title) {
        await singleContentService.updateContentIfFound(
            response.courseId, { name: response.title }
        );
    }

    sendVideoAddedNotification(response);

    return {
        statusCode: 200,
        data: response,
        message: 'Video added successfully'
    }
}

exports.updateVideoDetails = async (httpRequest) => {
    const { body, params, user } = httpRequest;

    body.updatedByUser = user?._id ?? "";
    const response = await updateVideo(params.videoId, body);
    
    if (response?.title) {
        await singleContentService.updateContentIfFound(
            response.courseId, { name: response.title }
        );
    }

    return {
        statusCode: 200,
        data: response,
        message: 'Video updated successfully'
    }
}

exports.getVideoDetails = async (httpRequest) => {
    const { params, user } = httpRequest;
    let response = await getVideo(params.videoId);
    if (!response) {
        return {
            statusCode: 404,
            data: response,
            message: 'Video not found'
        }
    }

    response.url = response?.url ? getStreamUrls(response.url) : "";
    
    let cookie = await getSignedCookie(response);
    let cookies = []
    cookies.push({ key: 'CloudFront-Key-Pair-Id', value: cookie['CloudFront-Key-Pair-Id'], options: envConfig.cloudFront.signedCookie});
    cookies.push({ key: 'CloudFront-Signature', value: cookie['CloudFront-Signature'], options: envConfig.cloudFront.signedCookie});
    cookies.push({ key: 'CloudFront-Policy', value: cookie['CloudFront-Policy'], options: envConfig.cloudFront.signedCookie});

    return {
        statusCode: 200,
        data: response,
        message: 'Video retrieved successfully',
        cookies
    }
}

exports.getUploadUrl = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await fileUploadService.getMultipartUploadUrl(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Upload url created successfully'
    };
}

exports.completeUpload = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await fileUploadService.completeMultipartUpload(body)
    
    return {
        statusCode: 200,
        data: response,
        message: 'Upload completed successfully'
    };
}