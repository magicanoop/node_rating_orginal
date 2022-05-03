const {
    generateSignedUrlForCourseModule,
    generateSignedUrlForCategory,
    generateSignedUrlForBanner,
    generateSignedUrlForVideoSupportFile,
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
} = require('./fileUpload.service');
const {parseContentFromQuestionFile}=require('./fileParsing.service');

exports.courseModuleImage = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForCourseModule(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.categoryImage = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForCategory(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.bannerImage = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForBanner(body);
    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.videoSupportFile = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForVideoSupportFile(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.publicFile = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForPublicFile(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.noteFile = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForNoteFile(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.liveSessionImage = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForLiveSessionImage(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.videoImage = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForvideoImage(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.testImage = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForTestImage(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.noteImage = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForNoteImage(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.courseMasterImage = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForCourseMasterImage(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.categoryGroupImage = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForCategoryGroupImage(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.facultyImage = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForFacultyImage(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.contentResourcePoolNote = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await generateSignedUrlForCRPNote(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Url created successfully'
    }
}

exports.parseDocFile = async (httpRequest) => {
    let parsedContent = await parseContentFromQuestionFile(`${appRoot}/${httpRequest.file.path}`);
    return {
        statusCode: 200,
        data: parsedContent,
        message: 'Presigned URL created sucecsfully'
    }
};

exports.instituteImage = async (httpRequest) => {
    let parsedContent = await generateSignedUrlForInstitute(httpRequest.body);
    return {
        statusCode: 200,
        data: parsedContent,
        message: 'Url created sucecsfully'
    }
};
