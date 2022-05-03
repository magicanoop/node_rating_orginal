module.exports = function makeLiveSessionDb({ LiveSessionModel }) {
    return Object.freeze({
      findAll,
      findById,
      findByCondition,
      insert,
      update,
      remove,
    })
    async function findAll() {
      let results = await LiveSessionModel.find();
      return {results};
    }
    async function findById(id) {
      let response = await LiveSessionModel.findById(id);
      return response;
  
    }
    
    async function findByCondition(searchRequest) {
      let results = await LiveSessionModel
        .find((searchRequest.getFindQuery()))
        .sort(searchRequest.getSortQuery())
        .limit(searchRequest.getPaginationDetails().limit)
        .skip(searchRequest.getPaginationDetails().skip)
        .select(searchRequest.getSelect())
      let total = await LiveSessionModel.countDocuments((searchRequest.getFindQuery()));
      return { results, total };
    }

    async function insert(content) {
      let newLiveSession = new LiveSessionModel(content);
      return await newLiveSession.save();
    }

    async function update(findRequest, updateQuery, options) {
      let response = await LiveSessionModel.findOneAndUpdate(findRequest.getFindQuery(), updateQuery, options);
      return response;
    }
    
    async function remove(id) {
      let response = await LiveSessionModel.findByIdAndDelete(id);
      return response;
    }
  }

