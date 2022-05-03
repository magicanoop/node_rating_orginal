const express = require('express');
const router = express.Router();

const {
    saveVideoDetails,
    getVideoDetails,
    updateVideoDetails,
    getUploadUrl,
    completeUpload
} = require('./video.controller');
const { isUserAuthenticated } = require('../../middlewares/authorizer');
const {
    videoCreateValidation, videoUpdateValidation,
    getUploadUrlValidation, completeUploadValidation
} = require('../../../validators/video.validation');

const makeCallback = require('../../express-callback');

router.post("/", [isUserAuthenticated], videoCreateValidation, makeCallback(saveVideoDetails));

router.put("/:videoId", [isUserAuthenticated], videoUpdateValidation, makeCallback(updateVideoDetails));

router.get("/:videoId", [isUserAuthenticated], makeCallback(getVideoDetails));

router.post("/pool/getUploadUrl",[isUserAuthenticated], getUploadUrlValidation, makeCallback(getUploadUrl));

router.post("/pool/completeUpload",[isUserAuthenticated], completeUploadValidation, makeCallback(completeUpload));

module.exports = router;
