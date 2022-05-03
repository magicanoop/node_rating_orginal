const { API_VERSION } = require("./../../../config/config");
const BuildQueryRequest = require("./../../queryBuilder");
const { NotFoundError } = require('../../../utils/api_error_util');
const buildQueryRequest = new BuildQueryRequest(require("regex-escape"), {
  asc: 1,
  desc: -1,
});
const HomePageConfigModel = require("./models/homePageConfig.model");
const makeHomePageDb = require("./DAO/homePageConfigDAO");
const HomePageDb = makeHomePageDb({ HomePageConfigModel });
//add new home page
const createtHomePageConfig = async (data) => {
  let configs = await HomePageDb.create(data);
  return configs;
};
//search

const searchHomePage =  (searchParams) => {
  let searchRequest = buildQueryRequest(searchParams);
  return HomePageDb.homeSearch(searchRequest)
}
//view by id
const viewHomePage = async (id) => {
  let response = await HomePageDb.findById(id);
  response= response.toObject();
  if(!response){
    return null
  }
  return response
}
//update
const updateHomePage = async (id, details) => {
  let findRequest = buildQueryRequest({
    filters: {
        _id: id,
    }
});
let options = {
    new: true
};
const response = await HomePageDb.update(findRequest, details, options);
if (!response) {
    throw new NotFoundError(`not found`)
}
return response
}

//delete
const deleteHomePage = async (id) => {
  const response = await HomePageDb.remove(id);
  if (!response) {
    throw new NotFoundError(`not found`)
  }
  return response
};

const getVersionDetails = () => {
  let { NODE_ENV: serverEnv } = process.env;
  let version = API_VERSION;
  let environment = "";
  switch (serverEnv) {
    case "test_server":
      environment = "Test";
      break;
    case "development_server":
      environment = "Dev";
      break;
    case "uat_server":
      environment = "UAT";
      break;
    default:
      environment = "local";
      break;
  }
  let response = {
    version,
    environment,
  };
  return response;
}

module.exports = {
  createtHomePageConfig,
  searchHomePage,
  viewHomePage,
  updateHomePage,
  deleteHomePage,
  getVersionDetails
};
