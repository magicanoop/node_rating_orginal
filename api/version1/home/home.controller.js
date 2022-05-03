const {
  createtHomePageConfig,
  viewHomePage,
  updateHomePage,
  searchHomePage,
  getVersionDetails,
  deleteHomePage,
} = require("./home.service");
const responseMessages = require("./../../../constants/messages");
//add new home page
exports.addHomePageConfig = async (httpRequest) => {
  let response = await createtHomePageConfig(httpRequest.body);

  return {
    statusCode: 200,
    data: response,
    message: "Downloads retrieved successfully",
  };
};
//search
exports.searchhomePage = async (httpRequest) => {
  const { source = {} } = httpRequest.body;
  source.ip = httpRequest.ip;
  source.browser = httpRequest.headers["User-Agent"];
  if (httpRequest.headers["Referer"]) {
    source.referrer = httpRequest.headers["Referer"];
  }
  const response = await searchHomePage({
    ...httpRequest.body,
    ...httpRequest.query,
  });

  return {
    statusCode: 200,
    data: response,
    message: "Data retrieved successfully",
  };
};
//view by id
exports.viewhomePage = async (httpRequest) => {
  const response = await viewHomePage(httpRequest.params.id);
  return {
    statusCode: 200,
    message: "data retrived success",
  };
};
//update
exports.updatehomePage = async (httpRequest) => {
  const { params, body } = httpRequest;
  const created = await updateHomePage(params.id, body);

  return {
    statusCode: 200,
    data: { created },
    message: "Course module updated successfully",
  };
};
// Delete
exports.deletehomePage = async (httpRequest) => {
  await deleteHomePage(httpRequest.params.id)
  return { statusCode: 200, 
  message: "deleted successfully"}
};

exports.getVersion = async (httpRequest) => {
  return {
    statusCode: 200,
    data: getVersionDetails(),
    message: "Version retrieved successfully",
  };
};
