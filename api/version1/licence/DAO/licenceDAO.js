module.exports = function makeLicenceDb({ LicenceModel }) {
    return Object.freeze({
        findAll,
        findById,
        create,
        remove,
        update,
        findByHash
    })
    async function findAll(searchRequest) {
        let results = await LicenceModel
            .find(searchRequest.getFindQuery())
            .sort(searchRequest.getSortQuery())
            .limit(searchRequest.getPaginationDetails().limit)
            .skip(searchRequest.getPaginationDetails().skip)
            .select(searchRequest.getSelect());
        let total = await LicenceModel.countDocuments(searchRequest.getFindQuery());
        return { results, total };
    }
    async function findByHash(findRequest) {
        return await LicenceModel.findOne(findRequest.getFindQuery());
    }

    async function findById(id) {
        return await LicenceModel.findById(id);
    }

    async function create(licence) {
        let newLicence = new LicenceModel(licence);
        return await newLicence.save();
    }

    async function update(findRequest, updateQuery, options) {
        let response = await LicenceModel.findOneAndUpdate(findRequest.getFilters(), updateQuery, options);
        return response;
    }

    async function remove(id) {
        let Response = await LicenceModel.findByIdAndDelete(id);
        return Response;
    }
}