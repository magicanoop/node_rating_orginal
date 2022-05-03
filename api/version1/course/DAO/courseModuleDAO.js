module.exports = function makeCourseModuleDb({ CourseModuleModel }) {
  return Object.freeze({
    findAll,
    findById,
    insert,
    remove,
    update,
    findByName,
    findByCourseMaster,
    deleteMany
  });
  async function findAll() {

  }
  async function findById(id) {
    let result = await CourseModuleModel.findById(id);
    return result;
  }

  async function findByCourseMaster(searchRequest) {
    let results = await CourseModuleModel
      .find(searchRequest.getFindQuery())
      .sort(searchRequest.getSortQuery())
      .limit(searchRequest.getPaginationDetails().limit)
      .skip(searchRequest.getPaginationDetails().skip)
      .select(searchRequest.getSelect());
    let total = await CourseModuleModel.countDocuments(searchRequest.getFindQuery());
    return { results, total };
  }

  async function insert(courseModule) {
    let newCourseModule = new CourseModuleModel(courseModule);
    return await newCourseModule.save();
  }

  async function update(findRequest, updateQuery, options) {
    let response = await CourseModuleModel.findOneAndUpdate(findRequest.getFilters(), updateQuery, options);
    return response;
  }
  async function remove(id) {
    let response = await CourseModuleModel.findByIdAndDelete(id);
    return response;
  }

  async function findByName(name, moduleType, planType) {
    let result = await CourseModuleModel.findOne({
      name: name,
      moduleType: moduleType,
      planType: planType
    });
    return result;
  }

  async function deleteMany(id) {
    let response = await CourseModuleModel.deleteMany({courseMasterId: id});
    return response;
  }

}