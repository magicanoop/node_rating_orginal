const SubcriptionModel = require('./models/subcription.model');
const makeSubcriptionDb = require('./DAO/subcriptionDAO');
const { NotFoundError } = require('../../../utils/api_error_util');
const BuildQueryRequest = require('./../../queryBuilder');
const buildQueryRequest = new BuildQueryRequest(require("regex-escape"), { asc: 1, desc: -1 });

const subcriptionModuleDb = makeSubcriptionDb({ SubcriptionModel });

const getSubcriptions = async (condition) => {
    let searchRequest = buildQueryRequest({filters: condition});
    const response = await subcriptionModuleDb.findByCondition(searchRequest);
    return response
}

const getSubscriptionById = async (id) => {
    const response = await noteModuleDb.findById(id);
    return response
}


module.exports = {
    getSubscriptionById,
    getSubcriptions
}