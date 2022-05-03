
const db = require("../models");
const PostUsers = db.users;

const logger = require("../../../config/winston.config");
const responseHelper = require("../utils/responseHelper");
const responseMessages = require("../constants/messages");
const utils = require("../utils/utils");
const emailUtils = require('../../../utils/emailUtils');
const { sendTemplatedEmail, sendOTPEmail } =  require('../../version1/email/email.service')
const jwtServices = require("./jwtServices");
//const otpService = require("./sms.service");
const config = require("config");

const authorizationService = require("./jwtServices");
const queryBuilder = require("./queryBuilder.service");
//const referralProgramService = require('./referralProgram.service');
//const { sendSms } = require("./sms.service");
//const { createRefarrelEarnings } = require('./transaction.services')
//const { createUserRegistrationEmail, createForgotPasswordEmail } = require('./../../../utils/emailUtils');
//const followerService = require('./followers.service');
//const notificationManagerService = require('./notificationManagerService');
//const { createStudentRegistrationNotification } = require('./inappNotificationHandler');
const { userFieldWeightage } = require('../constants/constants')

const {
  faculty: Faculty,
  institute: Institute
} = require("../models");
const c = require("config");



exports.createUser = async (userDetails) => {
 // Here is the issue
  let newUser = new PostUsers(userDetails);  
  UserId = newUser._id;
  newUser.userName=userDetails.userName;
  newUser.userPass=userDetails.userPass;
  newUser.email=userDetails.email;
  newUser.status=userDetails.status;  
  return new Promise((resolve, reject) => {
    newUser
      .save()
      .then(async (data) => {
      resolve(data);
      })
      .catch(async (err) => {
       
            reject(responseHelper.createCustomResponse(404, err));
         
      });
  });
};

// get

exports.findUserById = async (userId) => {
  try {
    let userResponse = await Users.findById(userId);
    if (userResponse) {
      return userResponse;
    } else {
      throw responseHelper.createCustomResponse(404, responseMessages.inVaidUserId);
    }
  } catch (err) {
    logger.error("Error occure while getting user" + err.message);
    throw responseHelper.createCustomResponse(err.httpcode || 500, err.message || responseMessages.signupFailure);
  }
};

exports.findUserByEmailId = async (email) => {
  try {
    let userResponse = await Users.findOne({ emailId: email });
    if (userResponse) {
      return userResponse;
    } else {
      throw responseHelper.createCustomResponse(404, responseMessages.invalidEmail);
    }
  } catch (err) {
    logger.error("Error occure while getting user" + err.message);
    throw responseHelper.createCustomResponse(err.httpcode || 500, err.message || responseMessages.signupFailure);
  }
};

exports.updateUserById = async (userId, updateBody) => {
  try {
    let user = await Users.findById(userId);
    if (!user) {
      throw responseHelper.createCustomResponse(404, `Cannot update user with id=${userId}. Maybe User was not found!`);
    }
    if (updateBody.password) {
      user.setPassword(updateBody.password);
      delete updateBody.password;
    }
    const updates = Object.keys(updateBody);
    updates.forEach((update) => (user[update] = updateBody[update]));
    console.log(user)
    user = user.toObject();
    delete user._id;
    let updateResponse = await Users.findByIdAndUpdate({ _id: userId }, { $set: user })
    return updateResponse;
  } catch (error) {
    console.log(error)
    logger.error("Error occure while updating user" + error.message);
    if (error.errors) {
      throw responseHelper.createCustomResponse(409, responseHelper.processModelValidationMessage(error.errors, true));
    }
    throw responseHelper.createCustomResponse(error.httpcode || 500, error.message || `error occured while updating user` + error);
  }
};

exports.verifyEmail = async (token) => {
  try {
    let { data } = jwtServices.decodeToken(token);
    let updateResponse = await this.updateUserById(data.id || data._id, { isActive: true });
    return updateResponse;
  } catch (error) {
    logger.error("Error occure while updating user" + error.message);
    if (error.httpcode) {
      throw responseHelper.createCustomResponse(error.httpcode || 500, responseMessages.emailVerifyFailure);
    } else if (error.message === "jwt expired") {
      throw responseHelper.createCustomResponse(401, "TOKEN EXPIRED");
    } else {
      throw responseHelper.createCustomResponse(403, "INVALID TOKEN");
    }
  }
};

exports.resendVerification = async (emailId) => {
  try {
    let data = await this.findUserByEmailId(emailId);
    let verificationEmail = await emailUtils.createUserVerificationEmail(this.getUserPublicData(data.toObject()));
    await sendTemplatedEmail(verificationEmail);
    return data;
  } catch (error) {
    logger.error("Error occure while resendVerification" + error.message);
    throw responseHelper.createCustomResponse(error.httpcode || 500, responseMessages.resendVerifyFailure);
  }
};

exports.forgotPassword = async (emailId) => {
  try {
    let data = await this.findUserByEmailId(emailId);
    // let verificationEmail = utils.createResetPasswordEmail(this.getUserPublicData(data.toObject()));
    let conformationMail = await createForgotPasswordEmail(data)
    await sendOTPEmail(conformationMail);
    // await sendTemplatedEmail(verificationEmail);
    return data;
  } catch (error) {
    logger.error("Error occure while forgotPassword " + error.message);
    throw responseHelper.createCustomResponse(error.httpcode || 500, responseMessages.resendVerifyFailure);
  }
};

exports.resetPassword = async (requestBody) => {
  try {
    let response = {};
    if (!requestBody.phoneNumber) {
      response = await this.resetPasswordWithEmail(requestBody);
    } else {
      response = await this.resetPasswordWithOtp(requestBody);
    }
  } catch (error) {
    logger.error("Error occure while reset password " + error.message);
    throw error;
  }
};

exports.findUserByQuery = async (query) => {
  try {
    let userResponse = await Users.findOne(query);
    if (userResponse) {
      return userResponse;
    } else {
      throw responseHelper.createCustomResponse(404, responseMessages.invalidEmail);
    }
  } catch (err) {
    logger.error("Error occure while getting user" + err.message);
    throw responseHelper.createCustomResponse(err.httpcode || 500, err.message || responseMessages.signupFailure);
  }
};

exports.verifyOtp = async (requestBody) => {
  try {
    let userResponse = await this.findUserByQuery({ phoneNumber: requestBody.phoneNumber });
    if (userResponse.otp) {
      let tokenData  = authorizationService.verifyToken(userResponse.otp);
      if (tokenData.otp === requestBody.otp && tokenData.phoneNumber == requestBody.phoneNumber) {
        let updateResponse = await this.updateUserById(userResponse._id, { isActive: true });
        return userResponse;
      } else {
        throw responseHelper.createCustomResponse(400, responseMessages.otpMisMatch);
      }
    } else {
      throw responseHelper.createCustomResponse(400, responseMessages.otpMisMatch);
    }
  } catch (err) {
    logger.error("Error occure while getting user" + err.message);
    throw responseHelper.createCustomResponse(err.httpcode || 500, err.message || responseMessages.otpVerificationFailue);
  }
};

exports.resendOtp = async (requestBody) => {
  try {
    let userDetails = await this.findUserByQuery(requestBody);
    let otp = otpService.generateOtp();
    let otpExpiration = process.env.JWT_EXPIRATION_TIME || config.sms.otpExpiration;
    let otpToken = authorizationService.createJWToken({ phoneNumber: requestBody.phoneNumber, otp: otp }, otpExpiration);
    userDetails.otp = otpToken;
    let verificationEmail = await emailUtils.createUserOtpEmail(userDetails, otp);
    await sendSms(otp, userDetails.phoneNumber);
    await sendOTPEmail(verificationEmail);
    await userDetails.save();
    //ToDo : Send OTP to the mobile number
    return userDetails; 
  } catch (err) {
    logger.error("Error occure while resend OTP" + err.message);
    throw responseHelper.createCustomResponse(err.httpcode || 500, err.message || responseMessages.otpVerificationFailue);
  }
};

exports.processNormalLogin = async (userQuery, password) => {
  try {
    let user = await this.findUserByQuery(userQuery);
    if (user.validPassword(password)) {
      if (user.isActive) {
        if (!user.isDeleted) {
          if (user.isHidden === true) {
            throw responseHelper.createCustomResponse(403, responseMessages.disabledLogin);
          }
          let tokenExpiration = process.env.JWT_EXPIRATION_TIME || config.jwt.tokenExpiry;
          let token = authorizationService.createJWToken(this.getUserPublicData(user.toObject()), tokenExpiration);
          return {
            token: `Bearer ${token}`,
            userDetails: this.getUserPublicData(user.toObject()),
          };
        } else {
          throw responseHelper.createCustomResponse(403, responseMessages.disabledAccount);
        }
      } else {
        throw responseHelper.createCustomResponse(403, responseMessages.inActiveUSer);
      }
    } else {
      throw responseHelper.createCustomResponse(404, responseMessages.invalidEmail);
    }
  } catch (error) {
    logger.error("Error occured while normal login" + error.message);
    throw error;
  }
};

exports.processMobileLogin = async (requestBody) => {
  try {
    let userQuery = { phoneNumber: requestBody.phoneNumber };
    let user = await this.findUserByQuery(userQuery);
    let otp = otpService.generateOtp();
    let otpExpiration = process.env.JWT_EXPIRATION_TIME || config.sms.otpExpiration;
    let otpToken = authorizationService.createJWToken({ phoneNumber: requestBody.phoneNumber, otp: otp }, otpExpiration);
    user.otp = otpToken;
    await user.save();
    throw responseHelper.createCustomResponse(200, responseMessages.otpSendSuccess);
  } catch (error) {
    logger.error("Error occured while mobile login" + error.message);
    throw error;
  }
};

exports.login = async (requestBody) => {
  try {
    let userQuery = {};
    if (requestBody.email) {
      userQuery = { phoneNumber: requestBody.phoneNumber };
    } else {
      userQuery = { emailId: requestBody.emailId };
    }
    let response = await this.processNormalLogin(userQuery, requestBody.password);
    return response;
  } catch (error) {
    logger.error("Error occured while login" + error.message);
    throw error;
  }
};

exports.forgotPasswordWithPhoneNumber = async (phoneNumber) => {
  try {
    let userDetails = await this.findUserByQuery({ phoneNumber });
    let otp = otpService.generateOtp();
    let otpExpiration = process.env.JWT_EXPIRATION_TIME || config.sms.otpExpiration;
    let otpToken = authorizationService.createJWToken({ phoneNumber: phoneNumber, otp: otp }, otpExpiration);
    userDetails.otp = otpToken;
    await userDetails.save();
    //ToDo : Send OTP to the mobile number
    return userDetails;
  } catch (err) {
    logger.error("Error occure while resend OTP" + err.message);
    throw responseHelper.createCustomResponse(err.httpcode || 500, err.message || responseMessages.otpVerificationFailue);
  }
};

exports.resetPasswordWithOtp = async (requestBody) => {
  try {
    let userResponse = await this.findUserByQuery({ phoneNumber: requestBody.phoneNumber });
    if (userResponse.otp) {
      let tokenData = authorizationService.verifyToken(userResponse.otp);
      if (tokenData.otp === requestBody.otp && tokenData.phoneNumber == requestBody.phoneNumber) {
        userResponse.setPassword(requestBody.newPassword);
        let response = await userResponse.save();
        return response;
      } else {
        throw responseHelper.createCustomResponse(400, responseMessages.otpMisMatch);
      }
    } else {
      throw responseHelper.createCustomResponse(400, responseMessages.otpMisMatch);
    }
  } catch (err) {
    logger.error("Error occure while resetPasswordWithOtp" + err.message);
    throw responseHelper.createCustomResponse(err.httpcode || 500, err.message || responseMessages.otpVerificationFailue);
  }
};

exports.resetPasswordWithEmail = async ({ resetToken, newPassword }) => {
  try {
    let { data } = jwtServices.decodeToken(resetToken);
    let user = await this.findUserById(data.id);
    user.setPassword(newPassword);
    let userResponse = await user.save();
    return userResponse;
  } catch (error) {
    logger.error("Error occure while reset password " + error.message);
    if (error.httpcode) {
      throw responseHelper.createCustomResponse(error.httpcode || 500, responseMessages.updateUserFailure);
    } else if (error.message === "jwt expired") {
      throw responseHelper.createCustomResponse(401, "TOKEN EXPIRED");
    } else {
      throw responseHelper.createCustomResponse(403, "INVALID TOKEN");
    }
  }
};

exports.search = async (requestBody, queryParams) => {
  requestBody.searchFields = ["name", "emailId", "phoneNumber", "role"];
  try {
    let response = await queryBuilder.getQueryResults(Users, queryParams, requestBody);
    return response;
  } catch (error) {
    logger.error("Error occured while getting user" + error.message);
    throw responseHelper.createCustomResponse(error.httpcode || 500, responseMessages.fetchFailed);
  }
};

exports.createStudent = async (userDetails) => {
  // userDetails.otpCreatedTime = new Date();
  var userId = null;
  try {
    let otp = otpService.generateOtp();
    let otpExpiration = process.env.JWT_EXPIRATION_TIME || config.sms.otpExpiration;
    let otpToken = authorizationService.createJWToken({ phoneNumber: userDetails.phoneNumber, otp: otp }, otpExpiration);
    userDetails.otp = otpToken;
    let refererCode = userDetails.referralCode
    userDetails.referralCode = await referralProgramService.generateReferralCode();
    let newUser = new Users(userDetails);
    let refferer = null;
    if (refererCode && refererCode != "") {
      try {
        refferer = await this.findUserByQuery({ referralCode: refererCode });
      } catch (error) {
        throw responseHelper.createCustomResponse(404, "Invalid referral code");
      }
    }
    let message = null
    let user = await newUser.save();
    if (refererCode) {
      message = await createRefarrelEarnings(refferer._id, user._id);
    }
    userId = user._id;
    let conformationMail = await createUserRegistrationEmail(user)
    await sendOTPEmail(conformationMail);
    // await sendTemplatedEmail(conformationMail);
    //ToDo : Send OTP
    // await sendSms(otp, user.phoneNumber);
    console.log("============", userDetails)
    if (userDetails.deviceToken) {
      await notificationManagerService.enqueueNotification("registration", user.toObject(), userDetails.deviceToken)
    }
    await createStudentRegistrationNotification(user.toObject())
    return responseHelper.createSuccessResponse(message || responseMessages.signupSuccess, this.getUserPublicData(user));

  } catch (err) {
    logger.error("Error occure while creating user" + err.message);
    if (err.errors && (err.errors.emailId || err.errors.phoneNumber)) {
      if (err.errors.phoneNumber) {
        throw responseHelper.createCustomResponse(409, "Phone number already in use");
      } else {
        throw responseHelper.createCustomResponse(409, "Email already in use");
      }
    } else {
      if (userId) {
        await Users.findByIdAndDelete(userId);
      }
      throw responseHelper.createCustomResponse(err.httpcode || 500, err.message || responseMessages.signupFailure);
    }
  }
};

exports.studentLogin = async (userQuery, otp, deviceToken) => {
  try {
    if (userQuery) {
      userQuery = this.scopeActive(userQuery);
    }
    let user = await this.findUserByQuery(userQuery);
    let tokenData = authorizationService.verifyToken(user.otp);
    if (tokenData.otp == otp) {
      if (!user.isDeleted) {
        user.isActive = true;
        user.deviceToken = deviceToken;
        await user.save();
        let tokenExpiration = process.env.JWT_EXPIRATION_TIME || config.jwt.tokenExpiry;
        let token = authorizationService.createJWToken(this.getUserPublicData(user.toObject()), tokenExpiration);
        let updateResponse = await this.updateUserById(user._id, { accessToken: token });
        return {
          token: `Bearer ${token}`,
          userDetails: this.getUserPublicData(user.toObject()),
        };
      } else {
        throw responseHelper.createCustomResponse(403, responseMessages.disabledAccount);
      }
    } else {
      throw responseHelper.createCustomResponse(404, responseMessages.otpMisMatch);
    }
  } catch (error) {
    if (error.httpcode == 498) {
      throw responseHelper.createCustomResponse(498, responseMessages.otpExpired);
    }
    logger.error("Error occured while login" + error.message);
    throw error;
  }
};

exports.sendLoginOtp = async (userQuery) => {
  try {
    if (userQuery) {
      userQuery = this.scopeActive(userQuery);
    }
    let user = await this.findUserByQuery(userQuery);
    let otp = otpService.generateOtp();
    let otpExpiration = process.env.JWT_EXPIRATION_TIME || config.sms.otpExpiration;
    let otpToken = authorizationService.createJWToken({ ...userQuery, otp: otp }, otpExpiration);
    user.otp = otpToken;
    if (userQuery.phoneNumber) {
      await sendSms(otp, user.phoneNumber);
    } else {
      let verificationEmail = await emailUtils.createUserOtpEmail(user, otp);
      await sendOTPEmail(verificationEmail);
    }
    await user.save();
    return user;
  } catch (error) {
    logger.error("Error occured while login" + error.message);
    if (error.httpcode == 404) {
      throw responseHelper.createCustomResponse(404, responseMessages.userNotRegistered);
    }
    throw error;
  }
};

exports.validateUser = (userDetails, password) => {
  return new Promise((resolve, reject) => {
    try {
      let newUser = new Users(userDetails);
      newUser.setPassword(password);
      newUser
        .validate()
        .then((data) => {
          return resolve(newUser);
        })
        .catch((error) => {
          let message = responseHelper.processModelValidationMessage(error.errors, true);
          message = message.replace("emailId", "Email").replace("phoneNumber", "Phone number");
          reject(responseHelper.createCustomResponse(409, message));
        });
    } catch (error) {
      return reject(error);
    }
  });
};

exports.validateAuth = async (id) => {
  try {
    const user = await Users.findById(id).lean();
    if (!user || user.isDeleted) {
      throw "User doesn't exist";
    } else if (!user.isActive) {
      throw "User not active";
    } else {
      const allowedData = ["role", "name", "isActive", "isDeleted", "_id", "imageUrl", "emailId", "phoneNumber", "createdAt", "updatedAt"];
      let userData = {};
      allowedData.forEach((data) => (userData[data] = user[data]));
      userData._id = userData._id.toString();
      userData = await this.getSpecialId(userData);
      return userData;
    }
  } catch (error) {
    throw error;
  }
};

exports.getSpecialId = async (user) => {
  try {
    if (user.role === "institute") {
      const inst = await db.institute.findOne({ userId: user._id }).lean();
      if (inst) {
        user.instituteId = inst._id.toString();
      }
    }

    if (user.role === "faculty") {
      const faculty = await Faculty.findOne({ userId: user._id }).lean();
      if (faculty) {
        user.facultyId = faculty._id.toString();
      }
    }

    return user;
  } catch (error) {
    logger.error(error);
    return user;
  }
};

exports.invite = async (userId) => {
  try {
    let user = await this.findUserById(userId);
    if (!user.referralCode) {
      user.referralCode = await referralProgramService.generateReferralCode();
      await user.save();
    }
    return {
      referralCode: user.referralCode,
      messgae: config.invitationMessage
    };
  } catch (error) {
    logger.error("Error occure while reset password " + error.message);
    throw responseHelper.createCustomResponse(error.httpcode || 500, responseMessages.fetchFailed);
  }
};

exports.getUserProfile = async (userId, gustUserId) => {
  try {
    let userResponse = await this.findUserById(userId);
    let publicProfile = this.getUserPublicData(userResponse.toObject())
    let query = {
      "followedId": userId,
      followerId: gustUserId
    }
    let isFollowed = await followerService.findFollowByMatch(query)
    return {
      ...publicProfile,
      isFollowed: (isFollowed) ? true : false
    }
  } catch (err) {
    logger.error("Error occure while getting user" + err.message);
    throw responseHelper.createCustomResponse(err.httpcode || 500, err.message || responseMessages.signupFailure);
  }
};

exports.getRelatedData = async (user, userId) => {
  let followedId = user._id;
  let followingType = user.role;
  switch (followingType) {
    case "institute":
      const institute = await Institute.findOne({ userId: followedId });
      if (institute) {
        followedId = institute._id;
        user.instituteId = institute._id;
      }
      break;

    case "faculty":
      const faculty = await Faculty.findOne({ userId: followedId });
      if (faculty) {
        followedId = faculty._id;
        user.facultyId = faculty._id;
      }
      break;

    default:
      followingType = "user";
      break;
  }

  user.isFollowed = await followerService.isFollowedByUser(userId, followedId?.toString(), followingType);

  return user;
}

exports.findUsersByQuery = async (query) => {
  try {
    let userResponse = await Users.find(query);
      return userResponse;
  } catch (err) {
    logger.error("Error occure while getting user" + err.message);
    throw responseHelper.createCustomResponse(err.httpcode || 500, err.message || responseMessages.signupFailure);
  }
};
