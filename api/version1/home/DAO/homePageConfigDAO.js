const homePageConfigModel = require("../models/homePageConfig.model");

module.exports = function makeHomePageDb({ HomePageConfigModel }) {
  return Object.freeze({
    create,
    findById,
    homeSearch,
    update,
    remove,
  });

  async function create(data) {
    let newCourseCurriculam = new HomePageConfigModel(data);
    return await newCourseCurriculam.save();
  }
};
async function findById(id) {
  let result = await homePageConfigModel.findById(id);
  return result;
}
async function homeSearch(searchRequest) {
  let results = await homePageConfigModel.find(searchRequest.getFindQuery())
    .sort(searchRequest.getSortQuery())
    .limit(searchRequest.getPaginationDetails().limit)
    .skip(searchRequest.getPaginationDetails().skip);
  let total = await homePageConfigModel.countDocuments(
    searchRequest.getFindQuery()
  );
  return { results, total };
}
async function update(findRequest, updateQuery, options) {
  let response = await homePageConfigModel.findOneAndUpdate(findRequest.getFilters(), updateQuery, options);
  return response;
}
async function remove(id) {
  let Response = await homePageConfigModel.findByIdAndDelete(id)
  if (Response) {
    return Response;
  } else {
    throw new Error();
  }
}