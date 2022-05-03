
const router = require("express").Router();
const user = require("../controllers/user.controler");
const validate = require('express-jsonschema').validate;  
const { createUserSchema } = require('../validationSchemas/userValidationSchema');  
//const { isUserAuthenticated, hasModuleAccess, ifUserAuthenticated } = require('../../middlewares/authorizer');
const searchValidationSchema = require('./../validationSchemas/searchValidationSchema');

router.use('/', function (req, res, next) {
    
    req.currentModule = "user";
    
    next();
});

// Create a new user
router.post("/",( validate({ body: createUserSchema }), user.create));

router.post("/login", user.login);

// // Verify user email
// router.get("/verifyEmail", user.verifyEmail);

// // Resend verification
// router.get("/resendVerification", user.resendVerification);

// // Forgot password request
// router.get("/forgotPassword", user.forgotPassword);

// // Retrieve all user
// router.get("/", [isUserAuthenticated, hasModuleAccess], user.findAll);

// router.get("/faculties", [isUserAuthenticated], user.getAllFaculties);

// // Retrieve a single user with id
// router.get("/:user_id", [isUserAuthenticated], user.getUser);

// // Update a user with id
// router.put("/:user_id", [isUserAuthenticated], validate({ body: updateUserSchema }), user.update);

// Delete a user with id
//router.delete("/:user_id", [isUserAuthenticated, hasModuleAccess], user.delete);

// router.post("/login", validate({ body: loginUserSchema }), user.login);

// // Update a user with id
// router.put("/updatePassword/:user_id", [isUserAuthenticated], validate({ body: updatePasswordSchema }), user.updatePassword);

// // Forgot password request
// router.post("/resetPassword", validate({ body: resetPasswordSchema }), user.resetPassword);

// // router.post("/verifyOtp", validate({ body: verifyOtpSchema }), user.verifyOtp);

// // router.post("/resendOtp", validate({ body: resendOtpSchema }), user.resendOtp);

// router.post("/search", [isUserAuthenticated], validate({ body: searchValidationSchema }), user.search);

// router.post("/createStudent", validate({ body: createStudentSchema }), user.createStudent);

// router.post("/studentOtpLogin", validate({ body: loginStudentSchema }), user.studentLogin);

// router.post("/sendLoginOtp", validate({ body: sendLoginStudentSchema }), user.sendLoginOtp);router.post("/verifyOtp", validate({ body: verifyOtpSchema }), user.verifyOtp);

// // router.post("/resendOtp", validate({ body: resendOtpSchema }), user.resendOtp);

// router.get("/:userId/myEarnings", [isUserAuthenticated], user.myEarnings);

// router.get("/:userId/invite", [isUserAuthenticated], user.invite);

// router.get("/:userId/about", [isUserAuthenticated], user.getAbout)

// router.get("/:user_id/profile", [ifUserAuthenticated], user.getUserProfile);


module.exports = router;

