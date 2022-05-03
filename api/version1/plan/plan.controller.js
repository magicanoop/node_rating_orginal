const {
    addPlan,
    updatePlan,
    deletePlanById,
    listPlan,
    findById
} = require('./plan.service');

exports.add = async (httpRequest) => {
    const { body } = httpRequest;
    const created = await addPlan(body);

    return {
        statusCode: 201,
        data: { created },
        message: 'Plan added successfully'
    }
}

exports.update = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await updatePlan(params.id, body);

    return {
        statusCode: 200,
        data: { created },
        message: 'Plan updated successfully'
    }
}

exports.deletePlan = async (httpRequest) => {
    const data = await deletePlanById(httpRequest.params.id);
    return {
        statusCode: 200,
        data,
        message: 'Plan deleted successfully'
    }
}

exports.list = async (httpRequest) => {
    const { params } = httpRequest;
    const result = await listPlan(params.courseModuleId);

    return {
        statusCode: 200,
        data: { result },
        message: 'Plans Retrived successfully'
    }
}

exports.view = async (httpRequest) => {
    const { params } = httpRequest;
    const data = await findById(params.id);
    return {
        statusCode: 200,
        data,
        message: 'Plan Retrived successfully'
    }
}

