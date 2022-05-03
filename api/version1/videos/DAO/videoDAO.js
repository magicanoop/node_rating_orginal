
module.exports = function makeVideoDb({ VideoModel }) {
    return Object.freeze({
      findAll,
      findById,
      findByTitle,
      findByCondition,
      insert,
      update,
      insertMany,
      deleteById,
      remove
    })
    async function findAll() {
      let results = await VideoModel.find();
      return {results};
    }
    async function findById(id) {
      let result = await VideoModel.findById(id);
      return result;
  
    }
    async function findByCondition(searchRequest,condition) {
      let results = await VideoModel
        .find((searchRequest.getFindQuery(condition)))
        .sort(searchRequest.getSortQuery())
        .limit(searchRequest.getPaginationDetails().limit)
        .skip(searchRequest.getPaginationDetails().skip)
        .select(searchRequest.getSelect()).lean()
      let total = await VideoModel.countDocuments((searchRequest.getFindQuery()));
      return { results, total };
    }
  
    async function findByTitle(title) {
      let video = await VideoModel.findOne({ title:title });
      return video;
    }

    async function insert(videoContent) {
      let newVideo = new VideoModel(videoContent);
      return await newVideo.save();
    }

    async function insertMany(videoContent) {
      response = await VideoModel.insertMany(videoContent);
      return response
    }

    async function update(findRequest, updateQuery, options) {
      let response = await VideoModel.findOneAndUpdate(findRequest.getFindQuery(), updateQuery, options);
      return response;
    }

    async  function deleteById(id){
      const response = await VideoModel.findByIdAndRemove(id);
    }

    async function remove(id) {
      let response = await VideoModel.findByIdAndDelete(id);
      return response;
    }
    
  }
  