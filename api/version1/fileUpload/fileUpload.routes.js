const express = require('express');
const router = express.Router();

const {
    courseModuleImage,
    categoryImage,
    bannerImage,
    videoSupportFile,
    publicFile,
    noteFile,
    liveSessionImage,
    noteImage,
    testImage,
    videoImage,
    categoryGroupImage,
    courseMasterImage,
    facultyImage,
    contentResourcePoolNote,
    parseDocFile,
    instituteImage
} = require('./fileUpload.controllers');
const { isUserAuthenticated } = require('../../middlewares/authorizer');
const multer = require("multer");
const path = require("path");
const {
    uploadValidation, supportFileValidation, publicFileValidation, noteFileValidation, contentUploadValidation,
    crpNoteValidation
} = require('../../../validators/fileUpload.validation');

const makeCallback = require('../../express-callback');

const storage = multer.diskStorage({
    destination: function (httpRequest, file, cb) {
      cb(null, "data/uploads");
    },
  
    // By default, multer removes file extensions so let's add them back
    filename: function (httpRequest, file, cb) {
      
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
      
  },
  });
  var upload = multer({ storage: storage });

router.post('/courseModule', [isUserAuthenticated], uploadValidation, makeCallback(courseModuleImage));
router.post('/category', [isUserAuthenticated], uploadValidation, makeCallback(categoryImage));
router.post('/banner', [isUserAuthenticated], uploadValidation, makeCallback(bannerImage));
router.post("/supportFiles", [isUserAuthenticated], supportFileValidation, makeCallback(videoSupportFile));
router.post("/public", [isUserAuthenticated], publicFileValidation, makeCallback(publicFile));
router.post("/notes", [isUserAuthenticated], noteFileValidation, makeCallback(noteFile));
router.post("/liveSessionImage", [isUserAuthenticated], contentUploadValidation, makeCallback(liveSessionImage));
router.post("/noteImage", [isUserAuthenticated], contentUploadValidation, makeCallback(noteImage));
router.post("/testImage", [isUserAuthenticated], contentUploadValidation, makeCallback(testImage));
router.post("/videoImage", [isUserAuthenticated], contentUploadValidation, makeCallback(videoImage));
router.post('/categoryGroup', [isUserAuthenticated], uploadValidation, makeCallback(categoryGroupImage));
router.post('/courseMaster', [isUserAuthenticated], uploadValidation, makeCallback(courseMasterImage));
router.post('/faculty', [isUserAuthenticated], uploadValidation, makeCallback(facultyImage));
router.post('/contentResourcePool/notes', [isUserAuthenticated], crpNoteValidation, makeCallback(contentResourcePoolNote));
router.post("/parseDocx", [isUserAuthenticated], upload.single("docFile"), makeCallback(parseDocFile));
router.post('/institute', [isUserAuthenticated], uploadValidation, makeCallback(instituteImage));
module.exports = router;