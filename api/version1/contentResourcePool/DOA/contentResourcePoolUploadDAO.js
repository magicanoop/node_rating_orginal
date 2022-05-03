module.exports = function makeContentResourcePoolUploadDb({ ContentResourcePoolUploadModel }) {
    return Object.freeze({
        createUpload,
        findByIdAndUpdate,
        findByCondition,
        findOneAndUpdate,
        create,
        search
    })

    async function createUpload(content) {
      let upload = new ContentResourcePoolUploadModel(content);
      let uploadResp = await upload.save();
      return uploadResp;
    }
    
    async function findByIdAndUpdate(id,contents) {
      uploadResp = await ContentResourcePoolUploadModel.findByIdAndUpdate(id, contents , { new: true, runValidators: true, context: 'query' })  
      return uploadResp;
    }

    async function findByCondition(condition) {
      uploadResp = await ContentResourcePoolUploadModel.findOne(condition)
      return uploadResp;
    }

    async function findOneAndUpdate(condition,contents) {
      uploadResp = await ContentResourcePoolUploadModel.findOneAndUpdate(condition, contents , { new: true, runValidators: true, context: 'query' })  
      return uploadResp;
    }

    async function create(content) {
      let results = new ContentResourcePoolUploadModel(content);
      return await results.save();
    }
    
    async function search(searchRequest) {
      let results = await ContentResourcePoolUploadModel
        .find(searchRequest.getFindQuery())
        .sort(searchRequest.getSortQuery())
        .limit(searchRequest.getPaginationDetails().limit)
        .skip(searchRequest.getPaginationDetails().skip);
      let total = await ContentResourcePoolUploadModel.countDocuments(searchRequest.getFindQuery());
      return { results, total };
    }
  }
  