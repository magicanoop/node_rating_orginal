module.exports = function makeCurriculumDb({ CurriculumModel }) {
  return Object.freeze({
    findAll,
    findByCourseModuleId,
    findById,
    create,
    remove,
    update,
    findCurriculumByChapterId,
    arrayUpdate,
    aggregateQuery,
    removeByCourseId
  })
  async function findAll() {

  }
  async function findById(id) {
    return await CurriculumModel.findById(id);
  }

  async function findByCourseModuleId(id) {
    return await CurriculumModel.findOne({ courseModuleId: id });
  }

  async function create(curriculum) {
    let newCourseCurriculam = new CurriculumModel(curriculum);
    return await newCourseCurriculam.save();
  }

  async function update(id, curriculum) {
    let response = await CurriculumModel.findByIdAndUpdate(id, { $set: curriculum }, { new: true });
    return response;
  }

  async function remove(id) {
    let Response = await CurriculumModel.findByIdAndDelete(id);
    return Response;
  }

  async function arrayUpdate(findRequest, updateQuery, options) {
    let response = await CurriculumModel.findOneAndUpdate(findRequest.getFilters(), updateQuery, options);
    return response;
  }

  async function findCurriculumByChapterId(id) {
    let curriculum = await CurriculumModel.findOne({ "subjects.sections.chapters._id": id });
    if(!curriculum){
      return null ;
    }
    return curriculum;
  }

  async function aggregateQuery(aggQuery) {
    let results = await CurriculumModel.aggregate(aggQuery)
    let total = results.length;
    return { results, total };
  }
  
  async function removeByCourseId(id) {
    let Response = await CurriculumModel.findOneAndDelete({courseModuleId: id});
    return Response;
  }

}