
module.exports = function makeContentResourcePoolDb({ ContentResourcePoolModel }) {
    return Object.freeze({
      findByCondition,
      create,
      findByIdAndUpdate,
      adminSearch
    })
    
    async function findByCondition(condition) {
      let results = await ContentResourcePoolModel.findOne(condition);
      return results;
    }

    async function create(content) {
      let results = new ContentResourcePoolModel(content);
      return await results.save();
    }

    async function findByIdAndUpdate(id,contents) {
      uploadResp = await ContentResourcePoolModel.findByIdAndUpdate(id, contents , {new : true})  
      return uploadResp;
    }

    async function adminSearch(searchRequest) {
      let results = await ContentResourcePoolModel
        .find(searchRequest.getFindQuery())
        .sort(searchRequest.getSortQuery())
        .limit(searchRequest.getPaginationDetails().limit)
        .skip(searchRequest.getPaginationDetails().skip);
      let total = await ContentResourcePoolModel.countDocuments(searchRequest.getFindQuery());
      return { results, total };
    }  
  }
  