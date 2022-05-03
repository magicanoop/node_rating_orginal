const db = require("../models");
const multer = require("multer");
const ratingServices = require("../services/rating.services");
const responseMessages = require("../constants/messages");
const responseHelper = require("../utils/responseHelper");
const Ratings = db.ratings;

const authorizationService = require("../services/jwtServices");
const config = require("config");
const constants = require("../constants/constants");
const logger =require("../../../config/winston.config");

const queryBuilder = require("../services/queryBuilder.service");
const moduleService = require("../services/module.service");

/* Add Single Post */
exports.create = async (req, res) => {
  let postDetails = {
    postID: req.body.postID,
    userID: req.body.userID,
    rating: req.body.rating,
    status: req.body.status,
  };
  try {
    let ratingResponse = await ratingServices.createRating(postDetails);
    req.body = {};

    res
      .status(200)
      .send(responseHelper.createSuccessResponse(responseMessages.ratingaddsuccess, ratingResponse));
  } catch (error) {
    logger.error("Create error ", error);
    res.status(error.httpcode || 500).send(error);
  }
};

exports.getrating= async (req, res) => {
  try {
   
    let response = await ratingServices.findRatingById(req.body.id);
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.ratingfetch, response));
  } catch (error) {
    logger.error("Error occure while retrieving data" + error.message);
    res.status(error.httpcode || 500).send(error);
  }
};
// Get average Rating of a post
exports.getpostrating= async (req, res) => {
  try {
   
    let response = await ratingServices.findRatingBypost(req.params.postid);
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.ratingfetch, response));
  } catch (error) {
    logger.error("Error occure while retrieving data" + error.message);
    res.status(error.httpcode || 500).send(error);
  }
};
// Update a post by the id in the request
exports.updaterating = async (req, res) => {
  try {
    let response = await ratingServices.updateRatingById(req.params.id, req.body);
    
   // console.log("========", response)
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.updateRatingSuccess));
  } catch (error) {
    res.status(error.httpcode || 500).send(error);
  }
};


/* Delete Single Post by id*/
exports.deleterating = async (req, res) => {
  try {
    let response = await ratingServices.findByIdAndDelete(req.params.id);
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.ratingdeletesuccess));
  } catch (error) {
    res.status(500).send(error.httpcode || 500, error);
  }
};


/* Get all Posts */
exports.findAll = async (req, res) => {
  try {
    req.body = {};
    appendRequest(req);
    let response = await queryBuilder.getQueryResults(Users, req.query, req.body, true);
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.fetchSuccess, response));
  } catch (error) {
    logger.error("Error occure while retrieving user" + error.message);
    res.status(error.httpcode || 500).send(error);
  }
};




/* Get Single Post */
exports.getUser = async (req, res) => {
  try {
    let response = await userServices.findUserById(req.params.user_id);
    let profileWithComplition = await userServices.getProfileComplitionPercentage(response);

    response = userServices.getUserPublicData(response.toObject());
    response.profileWithComplition = profileWithComplition;
    response = await userServices.getRelatedData(response, req?.user?._id);    
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.updateUserSuccess, response));
  } catch (error) {
    logger.error("Error occure while retrieving user" + error.message);
    res.status(error.httpcode || 500).send(error);
  }
};

/* Edit Single Post */

// Update a product by the id in the request
exports.update = async (req, res) => {
  try {
    let response = await userServices.updateUserById(req.params.user_id, req.body);
    console.log("========", response)
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.updateUserSuccess));
  } catch (error) {
    res.status(error.httpcode || 500).send(error);
  }
};

/* Delete Single Post */
exports.delete = async (req, res, next) => {
  try {
    let response = await Users.findByIdAndDelete(req.params.user_id);
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.updateUserSuccess));
  } catch (error) {
    res.status(500).send(error.httpcode || 500, error);
  }
};

exports.updatePassword = (req, res) => {
  let currentPassword = req.body.currentPassword;
  let newPassword = req.body.newPassword;
  Users.findById(req.params.user_id)
    .then((user) => {
      if (user) {
        if (user.validPassword(currentPassword)) {
          user.setPassword(newPassword);
          user
            .save()
            .then((data) => {
              res.send(responseHelper.createSuccessResponse(responseMessages.updateUserSuccess));
            })
            .catch((err) => {
              res.status(500).send({
                message: "Error updating user with id=" + req.user._id,
              });
            });
        } else {
          res.status(400).send(responseHelper.createCustomResponse(400, responseMessages.inVaidCurrentPassword));
        }
      } else {
        res.status(404).send(responseHelper.createCustomResponse(404, responseMessages.inVaidUserId));
      }
    })
    .catch((err) => {
      logger.error("Error occure while updating user" + err.message);
      res.status(500).send(responseHelper.createCustomResponse(500, err.message || responseMessages.signupFailure));
    });
};

// Update a user by the id in the request
exports.verifyEmail = async (req, res) => {
  try {
    if (req.query.token) {
      let response = await userServices.verifyEmail(req.query.token);
      res.status(500).send(
        `<title>Email verification</title><p style="font-size:20px;text-align:center;margin-top:20%;color:#0c8619;">
          ${responseMessages.emailVerifySuccess}
        </p>`
      );
    } else {
      throw responseHelper.createCustomResponse(400, "Bad request");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send(
      `<title>Email verification</title><p style="font-size:20px;text-align:center;margin-top:20%;color:#ea2121;">
        ${responseMessages.emailVerifyFailure}
      </p>`
    );
  }
};

// Update a user by the id in the request
exports.resendVerification = async (req, res) => {
  try {
    if (req.query.emailId) {
      let response = await userServices.resendVerification(req.query.emailId);
      res.status(200).send(responseHelper.createSuccessResponse(responseMessages.resendVerifySuccess));
    } else {
      res.status(400).send(responseHelper.createCustomResponse(400, "Bad request"));
    }
  } catch (error) {
    res.status(500).send(error.httpcode || 500, error);
  }exports.verifyOtp = async (req, res) => {
    try {
      let user = await userServices.verifyOtp(req.body);
      let tokenExpiration = process.env.JWT_EXPIRATION_TIME || config.jwt.tokenExpiry;
      let token = authorizationService.createJWToken(userServices.getUserPublicData(user.toObject()), tokenExpiration);
      res.header("token", `Bearer ${token}`);
      return res.status(200).send(responseHelper.createSuccessResponse(responseMessages.loginSuccess, userServices.getUserPublicData(user.toObject())));
    } catch (error) {
      logger.error("Error occured while verify otp" + error);
      res.status(500).send(error.httpcode || 500, error);
    }
  };
};

// Update a user by the id in the request
exports.forgotPassword = async (req, res) => {
  try {
    if (req.query.emailId) {
      let response = await userServices.forgotPassword(req.query.emailId);
      res.status(200).send(responseHelper.createSuccessResponse(responseMessages.resendVerifySuccess));
    } else if (req.query.phoneNumber) {
      let otpRes = await userServices.forgotPasswordWithPhoneNumber(req.query.phoneNumber);
      res.status(200).send(responseHelper.createSuccessResponse(responseMessages.otpSendSuccess));
    } else {
      res.status(400).send(responseHelper.createCustomResponse(400, "Bad request"));
    }
  } catch (error) {
    res.status(500).send(error.httpcode || 500, error);
  }
};

// Update a user by the id in the request
exports.resetPassword = async (req, res) => {
  try {
    let response = await userServices.resetPassword(req.body);
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.updateUserSuccess));
  } catch (error) {
    res.status(500).send(error.httpcode || 500, error);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    let user = await userServices.verifyOtp(req.body);
    let tokenExpiration = process.env.JWT_EXPIRATION_TIME || config.jwt.tokenExpiry;
    let token = authorizationService.createJWToken(userServices.getUserPublicData(user.toObject()), tokenExpiration);
    res.header("token", `Bearer ${token}`);
    return res.status(200).send(responseHelper.createSuccessResponse(responseMessages.loginSuccess, userServices.getUserPublicData(user.toObject())));
  } catch (error) {
    logger.error("Error occured while verify otp" + error);
    res.status(500).send(error.httpcode || 500, error);
  }
};

exports.resendOtp = async (req, res) => {
  try {
    let user = await userServices.resendOtp(req.body);
    let message = responseMessages.otpSendSuccess;
    if (req.body.emailId) {
      message = responseMessages.otpEmailSuccess;
    }
    return res.status(200).send(responseHelper.createSuccessResponse(message));
  } catch (error) {
    logger.error("Error occured while resend otp" + error);
    res.status(error.httpcode || 500).send(error.httpcode || 500, error);
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

exports.getAllFaculties = async (req, res) => {
  try {
    let filters = {
      role: "faculty",
      isActive: true,
      isDeleted: false,
    };
    let response = await userServices.search({ filters }, req.query);
    return res.status(200).send(responseHelper.createSuccessResponse(responseMessages.fetchSuccess, response));
  } catch (error) {
    logger.error("Error occured while search" + error);
    res.status(error.httpcode || 500).send(error);
  }
};

function appendRequest(req) {
  if (!req.body.filters) {
    req.body.filters = {
      isHidden: { $ne: true },
      ...req.body.filters,
    };
  } else {
    req.body.filters.isHidden = { $ne: true };
  }
}

/* Get all Posts */
exports.search = async (req, res) => {
  try {
    appendRequest(req);
    let body = req.body;
    if(!body.searchFields){
      body.searchFields = ["name"];
    }
    let response = await queryBuilder.getQueryResults(Users, req.query, body, true);
    if (response.results.length > 0) {
      let searchResponse = response.results.map((result) => userServices.getUserPublicData(result.toObject()));
      response.results = searchResponse;
    }
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.fetchSuccess, response));
  } catch (error) {
    logger.error("Error occure while retrieving user" + error.message);
    res.status(error.httpcode || 500).send(error);
  }
};

exports.createStudent = async (req, res) => {
  let userDetails = {
    role: req.body.role,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    emailId: req.body.emailId,
    language: req.body.language,
  };
  if (req.body.referralCode) {
    userDetails.referralCode = req.body.referralCode;
  }
  try {
    let userResponse = await userServices.createStudent(userDetails);
    res
      .status(200)
      .send(userResponse);
  } catch (error) {
    logger.error("Create error ", error);
    res.status(error.httpcode || 500).send(error);
  }
};

exports.studentLogin = async (req, res) => {
  let body = req.body;
  let otp = req.body.otp;
  delete body["otp"];
  try {
    let userResponse = await userServices.studentLogin(body, otp);
    res.header("token", userResponse.token);
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.signupSuccess, userResponse.userDetails));
  } catch (error) {
    logger.error("Create error ", error);
    res.status(error.httpcode || 500).send(error);
  }
};

exports.sendLoginOtp = async (req, res) => {
  let body = req.body;
  try {
    let message = responseMessages.otpSendSuccess;
    if (req.body.emailId) {
      message = responseMessages.otpEmailSuccess;
    }
    let userResponse = await userServices.sendLoginOtp(body);
    res.status(200).send(responseHelper.createSuccessResponse(message));
  } catch (error) {
    logger.error("Create error ", error);
    res.status(error.httpcode || 500).send(error);
  }
};

exports.myEarnings = async (req, res) => {
  let userId = req.user._id;
  try {
    let userResponse = await transactionService.myEarnings(userId, req.query);
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.fetchSuccess, userResponse));
  } catch (error) {
    logger.error("Create error ", error);
    res.status(error.httpcode || 500).send(error);
  }
};

exports.invite = async (req, res) => {
  let userId = req.user._id;
  try {
    let userResponse = await userServices.invite(userId);
    res.status(200).send(responseHelper.createSuccessResponse(userResponse));
  } catch (error) {
    logger.error("Create error ", error);
    res.status(error.httpcode || 500).send(error);
  }
};

exports.getAbout = async (req, res) => {
  try {
    const user = await userServices.findUserById(req.params.userId);
    if(!user) throw { message: responseMessages.notFound, httpcode: 404 };

    let response = null;
    if(user.role==="institute") {
      response = await instituteService.findInsituteByMatch({ userId: user._id.toString() });
    }

    if(user.role==="faculty") {
      response = await facultyService.findFacultyByMatch({ userId: user._id.toString() });
    }
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.fetchSuccess, response));
  } catch (error) {
    logger.error(error);
    res.status(error.httpcode || 500).send(error);
  }
}

/* Get Single Post */
exports.getUserProfile = async (req, res) => {
  try {
    let userId = "";
    if(req.user){
      userId = req.user._id;
    }
    let response = await userServices.getUserProfile(req.params.user_id, userId);
    res.status(200).send(responseHelper.createSuccessResponse(responseMessages.fetchSuccess, response));
  } catch (error) {
    logger.error("Error occure while retrieving user" + error.message);
    res.status(error.httpcode || 500).send(error);
  }
};