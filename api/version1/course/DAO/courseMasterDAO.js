
module.exports = function makeCourseDb({ CourseMasterModel }) {
  return Object.freeze({
    findAll,
    findByHash,
    findById,
    insert,
    remove,
    update,
    findByName,
    adminSearch
  })
  async function findAll(searchRequest) {
    let results = await CourseMasterModel.find()
      .sort(searchRequest.getSortQuery());
    return { results };
  }
  async function findById(id) {
    let result = await CourseMasterModel.findById(id);
    return result;
  }

  async function insert(courseMaster) {
    let newCourseMaster = new CourseMasterModel(courseMaster);
    return await newCourseMaster.save();

  }

  async function update(findRequest, updateQuery, options) {
    let response = await CourseMasterModel.findOneAndUpdate(findRequest.getFilters(), updateQuery, options);
    return response;
  }
  async function remove(id) {
    let Response = await CourseMasterModel.findByIdAndDelete(id)
    return Response;
  }
  async function findByHash(comment) {

  }
  async function findByName(name) {
    let course = await CourseMasterModel.findOne({ name: name });
    return course;
  }

  async function adminSearch(searchRequest) {
    let results = await CourseMasterModel
      .find(searchRequest.getFindQuery())
      .sort(searchRequest.getSortQuery())
      .limit(searchRequest.getPaginationDetails().limit)
      .skip(searchRequest.getPaginationDetails().skip);
    let total = await CourseMasterModel.countDocuments(searchRequest.getFindQuery());
    return { results, total };
  }
}
