const { createEmailBodyFromTemplate } = require("../api/version1/email/email.service.js");
const config = require("config");
const jwtServices = require("../api/version0/services/jwtServices")

const getStudentRegTemplateData = (token,user) => {
    return {
        confirmationUrl: `${config.server_url}/api/admin/v1/user/verifyEmail/?token=${token}`,        
        contactUsUrl: config.client_url + config.contactUsPath,
        whiteBackGroundUrl: config.client_url + config.email.otp.whiteBackGroundUrl,
        welcomeBannerUrl: config.client_url + config.email.studentReg.regImageUrl,
        logoUrl: config.client_url + config.app_logo_url,
        username:user.name,
        
      };
}
exports.createUserRegistrationEmail = async (user) => {
    let token = jwtServices.createJWToken(user, config.jwt.verificationExpiry);

    try {
        let emailTemplate = await createEmailBodyFromTemplate(global.appRoot + config.email.studentReg.templatePath, getStudentRegTemplateData(token, user));
        var params = {
            Destination: {
                ToAddresses: [user.emailId],
            },
            Message: {
                Body: {
                    Html: {
                        Data: emailTemplate,
                        
                    },
                },
                Subject: {
                    Data: config.email.studentReg.subject,
                },
            },
            Source: config.email.fromAddress,
            ReplyToAddresses: [config.email.replyToAddresses],
        };
        return params;
    } catch (error) {
        throw error;
    }
};

const getForgotPasswordTemplatedData = (token) => {
    return {
        resetLink: `${config.client_url}/auth/reset-password/?token=${token}`,        
        // contactUsUrl: config.client_url + config.contactUsPath,
        whiteBackGroundUrl: config.client_url + config.email.forgotPwd.whiteBackGroundUrl,
        forgotPasswordBg: config.client_url + config.email.forgotPwd.BGImageUrl,
        logoUrl: config.client_url + config.app_logo_url,
      };
}

exports.createForgotPasswordEmail = async (user) => {
    let token = jwtServices.createJWToken(user, config.jwt.verificationExpiry);

    try {
        let emailTemplate = await createEmailBodyFromTemplate(global.appRoot + config.email.forgotPwd.templatePath, getForgotPasswordTemplatedData(token));
        var params = {
            Destination: {
                ToAddresses: [user.emailId],
            },
            Message: {
                Body: {
                    Html: {
                        Data: emailTemplate,
                    },
                },
                Subject: {
                    Data: config.email.forgotPwd.subject,
                },
            },
            Source: config.email.fromAddress,
            ReplyToAddresses: [config.email.replyToAddresses],
        };
        return params;
    } catch (error) {
        throw error;
    }
};

const getSubScriptionRegTemplateData = (user,planEndDate,course,duration) => {
    return {
        contactUsUrl: config.client_url + config.contactUsPath,
        whiteBackGroundUrl: config.client_url + config.email.otp.whiteBackGroundUrl,
        welcomeBannerUrl: config.client_url + config.email.studentReg.regImageUrl,
        logoUrl: config.client_url + config.app_logo_url,
        username:user.name,
        planEndDate:planEndDate,
        courseName:course,
        duration:duration,
      };
}
exports.freeSubscriptionEmail = async (user,planEndDate,course,duration) => {

    try {
        let emailTemplate = await createEmailBodyFromTemplate(global.appRoot + config.email.freeSubscription.templatePath, getSubScriptionRegTemplateData(user,planEndDate,course,duration));
        var params = {
            Destination: {
                ToAddresses: [user.emailId],
            },
            Message: {
                Body: {
                    Html: {
                        Data: emailTemplate,
                    },
                },
                Subject: {
                    Data: config.email.freeSubscription.subject,
                },
            },
            Source: config.email.fromAddress,
            ReplyToAddresses: [config.email.replyToAddresses],
        };
        return params;
    } catch (error) {
        throw error;
    }
};

exports.paidSubscriptionEmail = async (user,planEndDate,course,duration) => {
    try {
        let emailTemplate = await createEmailBodyFromTemplate(global.appRoot + config.email.paidSubscription.templatePath, getSubScriptionRegTemplateData(user,planEndDate,course,duration));
        var params = {
            Destination: {
                ToAddresses: [user.emailId],
            },
            Message: {
                Body: {
                    Html: {
                        Data: emailTemplate,
                    },
                },
                Subject: {
                    Data: config.email.paidSubscription.subject,
                },
            },
            Source: config.email.fromAddress,
            ReplyToAddresses: [config.email.replyToAddresses],
        };
        return params;
    } catch (error) {
        throw error;
    }
};

const getpaymentTemplateData = (user, amount) => {
    return {
        contactUsUrl: config.client_url + config.contactUsPath,
        whiteBackGroundUrl: config.client_url + config.email.otp.whiteBackGroundUrl,
        welcomeBannerUrl: config.client_url + config.email.studentReg.regImageUrl,
        logoUrl: config.client_url + config.app_logo_url,
        username:user.name,
        amount:amount
      };
}

exports.paymentSucessEmail = async (user, amount) => {

    try {
        let emailTemplate = await createEmailBodyFromTemplate(global.appRoot + config.email.paymentSuccess.templatePath, getpaymentTemplateData(user,amount));

        var params = {
            Destination: {
                ToAddresses: [user.emailId],
            },
            Message: {
                Body: {
                    Html: {
                        Data: emailTemplate,
                    },
                },
                Subject: {
                    Data: config.email.paymentSuccess.subject,
                },
            },
            Source: config.email.fromAddress,
            ReplyToAddresses: [config.email.replyToAddresses],
        };
        return params;
    } catch (error) {
        throw error;
    }
};


const getpaymentfailTemplateData = (user) => {
    return {
        contactUsUrl: config.client_url + config.contactUsPath,
        whiteBackGroundUrl: config.client_url + config.email.otp.whiteBackGroundUrl,
        welcomeBannerUrl: config.client_url + config.email.studentReg.regImageUrl,
        logoUrl: config.client_url + config.app_logo_url,
        username:user.name, 
      };
}
exports.paymentFailEmail = async (user) => {

    try {
        let emailTemplate = await createEmailBodyFromTemplate(global.appRoot + config.email.paymentFail.templatePath, getpaymentfailTemplateData(user));
        var params = {
            Destination: {
                ToAddresses: [user.emailId],
            },
            Message: {
                Body: {
                    Html: {
                        Data: emailTemplate,
                    },
                },
                Subject: {
                    Data: config.email.paymentFail.subject,
                },
            },
            Source: config.email.fromAddress,
            ReplyToAddresses: [config.email.replyToAddresses],
        };
        return params;
    } catch (error) {
        throw error;
    }
};





const getVerificationTemplateData = (user) => {
  let token = jwtServices.createJWToken(user, config.jwt.verificationExpiry);
  return {
    uiLink: config.client_url,
    caLogo: config.app_logo_url,
    gustName: user.name,
    message: "<h1>Neyyar App-Verify your Email Id.</h1></br>Plese click on the button to verify your email addresss </br> ",
    url: `${config.server_url}/api/admin/v1/user/verifyEmail/?token=${token}`,
    inviterName: "Neyyar App Team",
    subject: "Account Registration",
  };
  // return { "verificationLink": `${config.server_url}/api/v1/user/verifyEmail/?token=${token}`, "name": user.name }
};

exports.createUserVerificationEmail = async (user) => {
  return {
    Destination: {
      ToAddresses: [user.emailId],
    },
    Source: config.email.fromAddress,
    Template: config.email.studentVerification,
    TemplateData: JSON.stringify(getVerificationTemplateData(user)),
  };
};

const getOtpTemplateData = (otp) => {
  return {
    otp: otp,
    supportUrl: config.client_url + config.supportPath,
    contactUsUrl: config.client_url + config.contactUsPath,
    whiteBackGroundUrl: config.client_url + config.email.otp.whiteBackGroundUrl,
    otpImage: config.client_url + config.email.otp.otpImageUrl,
    logoUrl: config.client_url + config.app_logo_url,
  };
};

exports.createUserOtpEmail = async (user, otp) => {
  try {
    let emailTemplate = await createEmailBodyFromTemplate(global.appRoot + config.email.otp.otpTamplatePath, getOtpTemplateData(otp));
    var params = {
      Destination: {
        ToAddresses: [user.emailId],
      },
      Message: {
        Body: {
          Html: {
            Data: emailTemplate,
          },
        },
        Subject: {
          Data: config.email.otp.subject,
        },
      },
      Source: config.email.fromAddress,
      ReplyToAddresses: [config.email.replyToAddresses],
    };
    return params;
  } catch (error) {
    throw error;
  }
};

const getForgotPasswordTemplateData = (user) => {
  user.isResetPassword = true;
  let token = jwtServices.createJWToken(user, config.jwt.verificationExpiry);
  return { verificationLink: `${config.server_url}/api/v1/user/verifyEmail/?token=${token}`, name: user.name };
};

exports.createResetPasswordEmail = async (user) => {
  return {
    Destination: {
      ToAddresses: [user.emailId],
    },
    Source: config.email.fromAddress,
    Template: config.email.forgotPasswordEmailTemplateName,
    TemplateData: JSON.stringify(getForgotPasswordTemplateData(user)),
  };
};