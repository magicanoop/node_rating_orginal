module.exports = function makePlanDb({ PlanModel }) {
    return Object.freeze({
      findById,
      insert,
      remove,
      update,
      findByCondition,
      findByName,
      search
    });

    async function findById(id) {
      let result = await PlanModel.findById(id);
      return result;
    }
  
    async function findByCondition(condition) {
      let results = await PlanModel.find(condition);
      let total = await PlanModel.countDocuments(condition);
      return {results,total}
    }
  
    async function insert(plan) {
      let newPlan = new PlanModel(plan);
      return await newPlan.save();
    }
  
    async function update(id, plan) {
      let response = await PlanModel.findByIdAndUpdate(id, { $set: plan }, { new: true });
      return response;
    }
    async function remove(id) {
      let response = await PlanModel.findByIdAndDelete(id);
      return response;
    }

    async function findByName(condition) {
      let result = await PlanModel.findOne(condition);
      return result;
    }

    async function search(searchRequest) {
      let results = await PlanModel
        .find(searchRequest.getFindQuery())
        .sort(searchRequest.getSortQuery())
        .limit(searchRequest.getPaginationDetails().limit)
        .skip(searchRequest.getPaginationDetails().skip)
        .select(searchRequest.getSelect()).lean();
        let total = await PlanModel.countDocuments(searchRequest.getFindQuery());
      return { results, total };
    }
  }