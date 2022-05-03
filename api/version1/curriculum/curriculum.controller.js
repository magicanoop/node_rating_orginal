const { v4: uuidv4 } = require('uuid');
const {
    addSubject,
    addSection,
    addChapter,
    addContent,
    updateCourseCurriculum,
    deleteCourseCurriculum,
    changeStatusOfSubject,
    changeStatusOfSection,
    changeStatusOfChapter,
    changeStatusOfContent,
    editSubject,
    editSection,
    editChapter,
    editContent,
    getCurriculumByCourseId,
    deleteContent,
    addTitle,
    editTitle,
    getSchedules,
    importFromCurriculum,
    getLiveSessionDetails,
    getAllLiveSessions
} = require('./curriculum.service');
const {
    startMultipartUpload,
    getMultipartUploadUrl,
    completeMultipartUpload
} = require('../fileUpload/fileUpload.service');

const {
    sendLiveClassAddedNotification
} = require('../liveSession/live_session.service');



exports.updateCurriculum = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await updateCourseCurriculum(params.id, body);

    return {
        statusCode: 200,
        data: { created },
        message: 'Curriculum updated successfully'
    }
}

exports.deleteCurriculum = async (httpRequest) => {
    await deleteCourseCurriculum(httpRequest.params.id);

    return {
        statusCode: 200,
        message: 'Curriculum deleted successfully'
    }
}

exports.addSubject = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await addSubject(params.id, body);

    return {
        statusCode: 201,
        data: { created },
        message: 'Subject added successfully'
    }
}

exports.addSection = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await addSection(params.curriculumId, params.subjectId, body);

    return {
        statusCode: 201,
        data: { created },
        message: 'Section added successfully'
    }
}

exports.addChapter = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await addChapter(params.curriculumId, params.subjectId, params.sectionId, body);

    return {
        statusCode: 201,
        data: { created },
        message: 'Chapter added successfully'
    }
}

exports.addTitle = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await addTitle(params.curriculumId, params.subjectId, params.sectionId, params.chapterId, body);

    return {
        statusCode: 201,
        data: { created },
        message: 'Content added successfully'
    }
}

exports.addVideoContent = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await addContent(params.curriculumId, params.subjectId, params.sectionId, params.chapterId, params.titleId, "video", body);

    return {
        statusCode: 201,
        data: { created },
        message: 'Content added successfully'
    }
}

exports.addNoteContent = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await addContent(params.curriculumId, params.subjectId, params.sectionId, params.chapterId, params.titleId, "note", body);

    return {
        statusCode: 201,
        data: { created },
        message: 'Content added successfully'
    }
}

exports.addLiveSessionContent = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await addContent(params.curriculumId, params.subjectId, params.sectionId, params.chapterId, params.titleId, "live", body);
    sendLiveClassAddedNotification(created);
    return {
        statusCode: 201,
        data: { created },
        message: 'Content added successfully'
    }
}

exports.changeStatusOfSubject = async (httpRequest) => {
    const { params } = httpRequest;
    const created = await changeStatusOfSubject(params.status, params.curriculumId, params.subjectId);

    return {
        statusCode: 200,
        data: { created },
        message: 'Activated'
    }
}

exports.changeStatusOfSection = async (httpRequest) => {
    const { params } = httpRequest;
    const created = await changeStatusOfSection(params.status, params.curriculumId, params.subjectId, params.sectionId);

    return {
        statusCode: 200,
        data: { created },
        message: 'Activated'
    }
}

exports.changeStatusOfChapter = async (httpRequest) => {
    const { params } = httpRequest;
    const created = await changeStatusOfChapter(params.status, params.curriculumId, params.subjectId, params.sectionId, params.chapterId);

    return {
        statusCode: 200,
        data: { created },
        message: 'Activated'
    }
}

exports.changeStatusOfContent = async (httpRequest) => {
    const { params } = httpRequest;
    const created = await changeStatusOfContent(params.status, params.curriculumId, params.subjectId, params.sectionId, params.chapterId, params.titleId, params.contentId);

    return {
        statusCode: 200,
        data: { created },
        message: 'Activated'
    }
}

exports.editSubject = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await editSubject(params.curriculumId, params.subjectId, body);

    return {
        statusCode: 200,
        data: { created },
        message: 'Updated successfully'
    }
}

exports.editSection = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await editSection(params.curriculumId, params.subjectId, params.sectionId, body);

    return {
        statusCode: 200,
        data: { created },
        message: 'Updated successfully'
    }
}

exports.editChapter = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await editChapter(params.curriculumId, params.subjectId, params.sectionId, params.chapterId, body);

    return {
        statusCode: 200,
        data: { created },
        message: 'Updated successfully'
    }
}

exports.editContent = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await editContent(params.curriculumId, params.subjectId, params.sectionId, params.chapterId, params.titleId, params.contentId, body);

    return {
        statusCode: 200,
        data: { created },
        message: 'Updated successfully'
    }
}

exports.getCurriculumByCourseId = async (httpRequest) => {
    const { params } = httpRequest;
    const data = await getCurriculumByCourseId(params.id);

    return {
        statusCode: 200,
        data,
        message: 'Data retrieved successfully'
    }
}

exports.deleteContent = async (httpRequest) => {
    const { params, body } = httpRequest;
    await deleteContent(params.curriculumId, params.subjectId, params.sectionId, params.chapterId, params.titleId, params.contentId, body);

    return {
        statusCode: 200,
        message: 'Content deleted successfully'
    }
}

exports.editTitle = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await editTitle(params.curriculumId, params.subjectId, params.sectionId, params.chapterId, params.titleId, body);

    return {
        statusCode: 200,
        data: { created },
        message: 'Updated successfully'
    }
}

exports.startMultipartUpload = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await startMultipartUpload(body.extension, uuidv4(), body.fileType);

    return {
        statusCode: 200,
        data: response,
        message: 'Upload started successfully'
    };
}

exports.getMultipartUploadUrl = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await getMultipartUploadUrl(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Upload url generated successfully'
    };
}

exports.completeMultipartUpload = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await completeMultipartUpload(body);

    return {
        statusCode: 200,
        data: response,
        message: 'Upload started successfully'
    };
}


exports.getCurriculumSchedules = async(req) => {
    const {user, query} = req;
    const schedules = await getSchedules(user, query);
    return {
        statusCode: 200,
        data: schedules,
        message: 'Schedule fetched successfully'
    }
}

exports.addTestContent = async (httpRequest) => {
    const { params, body, user } = httpRequest;
    const created = await addContent(params.curriculumId, params.subjectId, params.sectionId, params.chapterId, params.titleId, "test", body, user);

    return {
        statusCode: 201,
        data: { created },
        message: 'Content added successfully'
    }
}

exports.importFromCurriculum = async (httpRequest) => {
    let response = await importFromCurriculum(httpRequest.body)

    return {
        statusCode: 201,
        data: response,
        message: 'Content added successfully'
    }
}

exports.getLiveSessionDetails = async (httpRequest) => {
    const { params } = httpRequest;
    const response = await getLiveSessionDetails(params.id);

    return {
        statusCode: 200,
        data: response,
        message: 'Data retrieved successfully'
    };
}

exports.getAllLiveSessions = async (httpRequest) => {
    const { params, query, body } = httpRequest;
    const response = await getAllLiveSessions(params.type, { ...body, ...query });

    return {
        statusCode: 200,
        data: response,
        message: 'Data retrieved successfully'
    }
}