module.exports = function makeSubcriptionDb({ SubcriptionModel }) {


  return Object.freeze({
    list,
    findByCondition
  });

  async function list(searchRequest) {
    let results = await SubcriptionModel
      .find(searchRequest.getFindQuery())
      .sort(searchRequest.getSortQuery())
      .limit(searchRequest.getPaginationDetails().limit)
      .skip(searchRequest.getPaginationDetails().skip)
      .select(searchRequest.getSelect());
    let total = await SubcriptionModel.countDocuments(searchRequest.getFindQuery());
    return { results, total };
  };


  async function findByCondition(searchRequest) {
    let results = await SubcriptionModel.find(searchRequest.getFindQuery());
    let total = await SubcriptionModel.countDocuments(searchRequest.getFindQuery());
    return { results, total };
  };

}

