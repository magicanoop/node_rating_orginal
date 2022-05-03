module.exports = function makeCategoryGroupDb({ CategoryGroupModel }) {
    return Object.freeze({
      insert,
      remove,
      update,
      list,
      findByTitle
    });
  
    async function insert(categoryGroup) {
      let newCategoryGroup = new CategoryGroupModel(categoryGroup);
      return await newCategoryGroup.save();
    }
  
    async function update(id, categoryGroup) {
      let response = await CategoryGroupModel.findByIdAndUpdate(id, { $set: categoryGroup }, { new: true });
      return response;
    }
    async function remove(id) {
      let response = await CategoryGroupModel.findByIdAndDelete(id);
      return response;
    }

    async function list(searchRequest) {
      let results = await CategoryGroupModel
        .find(searchRequest.getFindQuery())
        .sort(searchRequest.getSortQuery())
        .limit(searchRequest.getPaginationDetails().limit)
        .skip(searchRequest.getPaginationDetails().skip)
        .select(searchRequest.getSelect());
      let total = await CategoryGroupModel.countDocuments(searchRequest.getFindQuery());
      return { results, total };
    }

    async function findByTitle(title) {
      let result = await CategoryGroupModel.findOne({ title: title });
      return result;
    }

  }