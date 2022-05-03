const db = require("../models");
const multer = require("multer");
const userServices = require("../services/user.services");
const responseMessages = require("../constants/messages");
const responseHelper = require("../utils/responseHelper");
const Users = db.users;

const authorizationService = require("../services/jwtServices");
const config = require("config");
const constants = require("../constants/constants");
const logger =require("../../../config/winston.config");

const queryBuilder = require("../services/queryBuilder.service");
const moduleService = require("../services/module.service");

/* Add User*/
exports.create = async (req, res) => {
  let userDetails = {
    userName: req.body.userName,
    userPass: req.body.userPass,
    email: req.body.email,
    status: req.body.status,
  };
  try {
    let userResponse = await userServices.createUser(userDetails);
    res
      .status(200)
      .send(responseHelper.createSuccessResponse(responseMessages.useraddsuccess, userResponse));
  } catch (error) {
    logger.error("Create error ", error);
    res.status(error.httpcode || 500).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    let response = await userServices.login(req.body);
    response.userDetails = await userServices.getSpecialId(response.userDetails);
    req.user = response.userDetails;
    response.userDetails.moduleAccess = await moduleService.myList(req);
    res.header("token", response.token);
    return res.status(200).send(responseHelper.createSuccessResponse(responseMessages.loginSuccess, response.userDetails));
  } catch (error) {
    logger.error("Error occured while login" + error);
    res.status(error.httpcode || 500).send(error);
  }
};