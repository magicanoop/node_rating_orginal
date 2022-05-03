module.exports = function makeCategoryDb({ CategoryModel }) {
    return Object.freeze({
      insert,
      remove,
      update,
      findByCondition,
      findByTitle,
      list,
      findAllById
    });
  
    async function findByCondition(condition) {
      let results = await CategoryModel.find(condition);
      return results
    }
  
    async function insert(category) {
      let newcategory = new CategoryModel(category);
      return await newcategory.save();
    }
  
    async function update(id, category) {
      let response = await CategoryModel.findByIdAndUpdate(id, { $set: category }, { new: true });
      return response;
    }
    async function remove(id) {
      let response = await CategoryModel.findByIdAndDelete(id);
      return response;
    }

  async function findByCondition(condition) {
    let results = await CategoryModel.find(condition);
    let total = await CategoryModel.countDocuments(condition);
    return { results, total }
  }

    async function list(searchRequest) {
        let results = await CategoryModel
          .find(searchRequest.getFindQuery())
          .sort(searchRequest.getSortQuery())
          .limit(searchRequest.getPaginationDetails().limit)
          .skip(searchRequest.getPaginationDetails().skip)
          .select(searchRequest.getSelect()).lean();
          let total = await CategoryModel.countDocuments(searchRequest.getFindQuery());
        return { results, total };
      }

  async function update(id, category) {
    let response = await CategoryModel.findByIdAndUpdate(id, { $set: category }, { new: true });
    return response;
  }
  async function remove(id) {
    let response = await CategoryModel.findByIdAndDelete(id);
    return response;
  }

  async function findByTitle(title) {
    let result = await CategoryModel.findOne({ title: title });
    return result;
  }

  async function list(searchRequest) {
    let results = await CategoryModel
      .find(searchRequest.getFindQuery())
      .sort(searchRequest.getSortQuery())
      .limit(searchRequest.getPaginationDetails().limit)
      .skip(searchRequest.getPaginationDetails().skip)
      .select(searchRequest.getSelect());
    let total = await CategoryModel.countDocuments(searchRequest.getFindQuery());
    return { results, total };
  }

  async function findAllById(findRequest) {
    let results = await CategoryModel
      .find(findRequest.getFindQuery());
    return results;
  }

}