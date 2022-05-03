const PlanModel = require('./models/plan.model');
const makePlanDb = require('./DAO/planDAO');
const { NotFoundError } = require('../../../utils/api_error_util');
const BuildQueryRequest = require('./../../queryBuilder');
const buildQueryRequest = new BuildQueryRequest(require("regex-escape"), { asc: 1, desc: -1 });

const PlanDB = makePlanDb({ PlanModel });

const addPlan = (details) => {
    return PlanDB.insert(details);
}

const updatePlan= async (id, details) => {
    const response =  PlanDB.update(id, details);
    if (!response) {
        throw new NotFoundError(`Plan not found`)
    }
    return response
}

const deletePlanById = async (id) => {
    const response =  PlanDB.remove(id);
    if (!response) {
        throw new NotFoundError(`Plan not found`)
    }
    return response
}
const listPlan = async (courseModuleId) => {
    const response =  PlanDB.findByCondition({ courseModuleId: courseModuleId });
    if (!response) {
        throw new NotFoundError(`Plan not found`)
    }
    return response
}
const findById = async (id) => {
    const response =  PlanDB.findById(id);
    if (!response) {
        throw new NotFoundError(`Plan not found`)
    }
    return response
}
const findByCondition = async (condition) => {
    const response =  PlanDB.findByCondition(condition);
    if (!response) {
        throw new NotFoundError(`Plan not found`)
    }
    return response
}
const moduleNameValidator = (condition) => {
    return PlanDB.findByName(condition);
}

const searchPlan = async (searchParams) => {
    let searchRequest = await buildQueryRequest(searchParams);
    const response =  await PlanDB.search(searchRequest);

    return response;
}

module.exports = {
    addPlan,
    updatePlan,
    deletePlanById,
    listPlan,
    findById,
    moduleNameValidator,
    findByCondition,
    searchPlan
}