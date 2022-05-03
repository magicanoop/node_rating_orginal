const {
    createManyContents,
    startUploadContents,
    contentsUploadCompleted,
    updateManyContents,
    getAllContents,
    deleteContents,
    importContentsFromVideos,
    uploadThumbnail,
    importContentsToCurriculum,
    getSignedCookie
} = require('./contentResourcePool.service');
const envConfig = require('config');

exports.startUpload = async (httpRequest) => {
    const { body } = httpRequest ;
    const data = await startUploadContents(body.contents);
    return {
        statusCode: 200,
        data,
        message: 'Content upload started'
    }
}

exports.insertMultipleContents = async (httpRequest) => {
    const { body } = httpRequest ;
    const data = await createManyContents(body.contents);
    return {
        statusCode: 200,
        data,
        message: 'Contents Inserted successfully'
    }
}

exports.uploadCompleted = async (httpRequest) => {
    const data = await contentsUploadCompleted(httpRequest?.httpRequest?._id ?? null,httpRequest.body.contents);
    return {
        statusCode: 200,
        data,
        message: 'Content upload completed'
    }
}

exports.updateMultipleContents = async (httpRequest) => {
    const data = await updateManyContents(httpRequest.body.contents);
    return {
        statusCode: 200,
        data,
        message: 'Content updated'
    }
}
exports.listContents = async (httpRequest) => {
    if(!httpRequest.body.searchFields) httpRequest.body.searchFields = ["title.value"]
    const data = await getAllContents(httpRequest.body);
    return {
        statusCode: 200,
        data,
        message: 'Content retrived successfuly'
    }
}

exports.deleteContents = async (httpRequest) => {
    const response = await deleteContents( httpRequest.body.contents);
    const successCount = response.reduce((a, v) => (v !== false ? a + 1 : a), 0);
    const failureCount = response.reduce((a, v) => (v === false ? a + 1 : a), 0);
    let responseMessage ="content(s) deleted count: " + successCount;
    responseMessage += failureCount > 0 ? "  Couldn't deleted content(s) count " + failureCount : ""
    return {
        statusCode: 200,
        message: responseMessage
    }   
}

exports.importFromVideos = async (httpRequest) => {
    const response = await importContentsFromVideos( httpRequest.body); 
    return {
        statusCode: 200,
        data:response,
        message: "Done"
    }   
}

exports.uploadThumbnail = async (httpRequest) => {
    const response = await uploadThumbnail( httpRequest.body,"contentPool/thumbnails"); 
    return {
        statusCode: 200,
        data:response,
        message: "Done"
    }   
}
exports.importToCurriculum = async (httpRequest) => {
    const response = await importContentsToCurriculum(httpRequest.body);
    return {
        statusCode: 200,
        data:response,
        message: "contents Imported Successfuly"
    }   
}

exports.getSignedCookie = async (httpRequest) => {
    const { params } = httpRequest;
    let { streamUrl, cookie } = await getSignedCookie(params.contentId);

    let cookies = [];
    if(cookie) {
        cookies.push({ key: 'CloudFront-Key-Pair-Id', value: cookie['CloudFront-Key-Pair-Id'], options: envConfig.cloudFront.signedCookie});
        cookies.push({ key: 'CloudFront-Signature', value: cookie['CloudFront-Signature'], options: envConfig.cloudFront.signedCookie});
        cookies.push({ key: 'CloudFront-Policy', value: cookie['CloudFront-Policy'], options: envConfig.cloudFront.signedCookie});
    }
    
    return {
        statusCode: 200,
        data: { streamUrl },
        message: 'Signed cookie generated successfully',
        cookies
    };
};
