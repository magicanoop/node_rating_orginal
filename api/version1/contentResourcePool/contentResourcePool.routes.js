const express = require('express');
const router = express.Router();
const makeCallback = require('../../express-callback');
const {
    insertMultipleContents,
    startUpload,
    uploadCompleted,
    updateMultipleContents,
    listContents,
    deleteContents,
    importFromVideos,
    uploadThumbnail,
    importToCurriculum,
    getSignedCookie
} = require('./contentResourcePool.controller');
const { isUserAuthenticated } = require('../../middlewares/authorizer');
const contentResourcePoolValidate = require('../../../validators/contentResourcePool.validation');

router.post('/insertContents', [isUserAuthenticated],contentResourcePoolValidate.insertContentShema, makeCallback(insertMultipleContents));
router.post('/upload', [isUserAuthenticated],contentResourcePoolValidate.uploadShema, makeCallback(startUpload));
router.post('/upload/completed', [isUserAuthenticated],contentResourcePoolValidate.uploadCompleteShema, makeCallback(uploadCompleted));
router.put("/", [isUserAuthenticated], contentResourcePoolValidate.updateShema,makeCallback(updateMultipleContents));
router.post("/search", [isUserAuthenticated],contentResourcePoolValidate.searchShema, makeCallback(listContents));
router.post("/delete", [isUserAuthenticated], contentResourcePoolValidate.deleteContentShema, makeCallback(deleteContents));
router.post("/importFromVideos", [isUserAuthenticated], makeCallback(importFromVideos));
router.post("/uploadThumbnail", [isUserAuthenticated],contentResourcePoolValidate.uploadThumbnailShema, makeCallback(uploadThumbnail));
router.post("/importToCurriculum", [isUserAuthenticated],contentResourcePoolValidate.importContentToCurriculumShema,makeCallback(importToCurriculum));
router.get("/:contentId/getSignedCookie", [isUserAuthenticated], makeCallback(getSignedCookie));

module.exports = router;