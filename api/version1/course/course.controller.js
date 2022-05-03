const { ObjectId } = require("mongoose").Types;
const {
    addCourseMaster,
    updateCourseMaster,
    deleteCourseMaster,
    addCourseModel,
    adminSearch,
    updateCoursemodule,
    deleteCoursemodule,
    getAllCourseMasters,
    getAllCourseModules,
    getCourseModule,
    softDeleteCourseModule,
    deactivateCourseModule,
    activateCourseModule,
    makeCourseModulePrivate,
    makeCourseModulePublic,
    getCourseMaster,
    getCourseOverView,
    getFacultyByCourseId,
    importStudents
} = require('./course.service')
const responseMessages = require("../../../constants/messages");

exports.createCourse = async (httpRequest) => {
    const { source = {}, ...courseInfo } = httpRequest.body
    source.ip = httpRequest.ip
    source.browser = httpRequest.headers['User-Agent']
    if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer']
    }
    const created = await addCourseMaster({
        ...courseInfo
    })
    return {
        statusCode: 201,
        data: { created },
        message: 'Course master created successfully'
    }
}

exports.updateCourse = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await updateCourseMaster(params.id, body);

    return {
        statusCode: 200,
        data: { created },
        message: 'Course master updated successfully'
    }
}

exports.deleteCourse = async (httpRequest) => {
    await deleteCourseMaster(httpRequest.params.courseMasterId)

    return {
        statusCode: 200,
        message: 'Course master deleted successfully'
    }
}

exports.createCoursemodel = async (httpRequest) => {
    const { source = {}, ...courseInfo } = httpRequest.body
    source.ip = httpRequest.ip
    source.browser = httpRequest.headers['User-Agent']
    if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer']
    }
    const created = await addCourseModel({
        ...courseInfo
    });

    return {
        statusCode: 201,
        data: { created },
        message: 'Course module created successfully'
    }
}

exports.adminSearch = async (httpRequest) => {
    const { source = {}, ...courseInfo } = httpRequest.body
    source.ip = httpRequest.ip
    source.browser = httpRequest.headers['User-Agent']
    if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer']
    }
    const response = await adminSearch({ ...httpRequest.body, ...httpRequest.query });

    return {
        statusCode: 200,
        data: response,
        message: 'Data retrieved successfully'
    }
}

exports.updateCourseModel = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await updateCoursemodule(params.id, body);

    return {
        statusCode: 200,
        data: { created },
        message: 'Course module updated successfully'
    }
}

exports.deleteCourseModule = async (httpRequest) => {
    await deleteCoursemodule(httpRequest.params.courseModuleId);

    return {
        statusCode: 200,
        message: 'Course module deleted successfully'
    }
}

exports.getCourseMasters = async (httpRequest) => {
    const response = await getAllCourseMasters();

    return {
        statusCode: 200,
        message: 'Data retrieved successfully',
        data: response
    }
}

exports.getCourseModules = async (httpRequest) => {
    const response = await getAllCourseModules({ ...httpRequest.body });

    return {
        statusCode: 200,
        message: 'Data retrieved successfully',
        data: response
    }
}

exports.getCourseModuleById = async (httpRequest) => {
    const response = await getCourseModule(httpRequest.params.id);

    return {
        statusCode: 200,
        message: 'Data retrieved successfully',
        data: response
    }
}

exports.softDeleteCourseModule = async (httpRequest) => {
    const { params } = httpRequest;
    const created = await softDeleteCourseModule(params.id);

    return {
        statusCode: 200,
        data: { created },
        message: 'Course module deleted'
    }
}

exports.deactivateCourseModule = async (httpRequest) => {
    const { params } = httpRequest;
    const created = await deactivateCourseModule(params.id);

    return {
        statusCode: 200,
        data: { created },
        message: 'Deactivated'
    }
}

exports.activateCourseModule = async (httpRequest) => {
    const { params } = httpRequest;
    const created = await activateCourseModule(params.id);

    return {
        statusCode: 200,
        data: { created },
        message: 'Activated'
    }
}

exports.makeCourseModulePrivate = async (httpRequest) => {
    const { params } = httpRequest;
    const created = await makeCourseModulePrivate(params.id);

    return {
        statusCode: 200,
        data: { created },
        message: 'Updated successfully'
    }
}

exports.makeCourseModulePublic = async (httpRequest) => {
    const { params } = httpRequest;
    const created = await makeCourseModulePublic(params.id);

    return {
        statusCode: 200,
        data: { created },
        message: 'Updated successfully'
    }
}

exports.getCourseMaster = async (httpRequest) => {
    const response = await getCourseMaster(httpRequest.params.id);

    return {
        statusCode: 200,
        message: 'Data retrieved successfully',
        data: response
    }
}

exports.getCourseOverView = async (httpRequest) => {
    const response = await getCourseOverView(httpRequest.params.id);

    return {
        statusCode: 200,
        message: 'Data retrieved successfully',
        data: response
    }
}

exports.getFacultyByCourseId = async (httpRequest) => {
    const { params } = httpRequest;
    let response = await getFacultyByCourseId(params.id);
    return {
        statusCode: 200,
        data: response,
        message: 'Data retrieved successfully'
    }
}

exports.importStudents = async (httpRequest, res) => {
    if (httpRequest?.fileValidationError) throw { message: httpRequest.fileValidationError, httpcode: 404 };
    const { curriculumId } = httpRequest.params;
    const response = await importStudents(curriculumId, httpRequest.file);
    const successCount = response.reduce((a, v) => (ObjectId.isValid(v) ? a + 1 : a), 0);
    const failureCount = response.reduce((a, v) => (!ObjectId.isValid(v) ? a + 1 : a), 0);
    if (successCount > 0) {
      //  await courseService.enrollImportStudentsToLiveClass(curriculumId, response.filter(data => ObjectId.isValid(data)));
    }
    let responseMessage = "Sucess count: "+ successCount
    responseMessage += failureCount > 0 ? "failure count :" + failureCount : "";
    return {
        statusCode: 200,
        data: response,
        message: responseMessage
    }
  }
  