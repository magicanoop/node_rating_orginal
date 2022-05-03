const express = require('express');
const router = express.Router();

const {
    addSubject,
    addSection,
    addChapter,
    addVideoContent,
    addNoteContent,
    changeStatusOfSubject,
    changeStatusOfSection,
    changeStatusOfChapter,
    changeStatusOfContent,
    editSubject,
    editSection,
    editChapter,
    editContent,
    getCurriculumByCourseId,
    addLiveSessionContent,
    deleteContent,
    addTitle,
    editTitle,
    startMultipartUpload,
    getMultipartUploadUrl,
    completeMultipartUpload,
    getCurriculumSchedules,
    addTestContent,
    importFromCurriculum,
    getLiveSessionDetails,
    getAllLiveSessions
} = require('./curriculum.controller');
const curriculumValidate = require('../../../validators/curriculum.validation');
const fileUploadValidate = require('../../../validators/fileUpload.validation');
const makeCallback = require('../../express-callback');
const { isUserAuthenticated } = require('../../middlewares/authorizer');

router.post('/subject/:id', [isUserAuthenticated], curriculumValidate.subjectCreateValidation, makeCallback(addSubject));
router.post('/section/:curriculumId/:subjectId', [isUserAuthenticated], curriculumValidate.sectionCreateValidation, makeCallback(addSection));
router.post('/chapter/:curriculumId/:subjectId/:sectionId', [isUserAuthenticated], curriculumValidate.chapterCreateValidation, makeCallback(addChapter));
router.post('/videoContent/:curriculumId/:subjectId/:sectionId/:chapterId/:titleId', [isUserAuthenticated], curriculumValidate.videoContentCreateValidation, makeCallback(addVideoContent));
router.post('/noteContent/:curriculumId/:subjectId/:sectionId/:chapterId/:titleId', [isUserAuthenticated], curriculumValidate.noteContentCreateValidation, makeCallback(addNoteContent));
router.put('/changeStatusOfSubject/:status/:curriculumId/:subjectId', [isUserAuthenticated], curriculumValidate.subjectChangeStatusValidation, makeCallback(changeStatusOfSubject));
router.put('/changeStatusOfSection/:status/:curriculumId/:subjectId/:sectionId', [isUserAuthenticated], curriculumValidate.sectionChangeStatusValidation, makeCallback(changeStatusOfSection));
router.put('/changeStatusOfChapter/:status/:curriculumId/:subjectId/:sectionId/:chapterId', [isUserAuthenticated], curriculumValidate.chapterChangeStatusValidation, makeCallback(changeStatusOfChapter));
router.put('/changeStatusOfContent/:status/:curriculumId/:subjectId/:sectionId/:chapterId/:titleId/:contentId', [isUserAuthenticated], curriculumValidate.contentChangeStatusValidation, makeCallback(changeStatusOfContent));
router.put('/editSubject/:curriculumId/:subjectId', [isUserAuthenticated], curriculumValidate.subjectUpdateValidation, makeCallback(editSubject));
router.put('/editSection/:curriculumId/:subjectId/:sectionId', [isUserAuthenticated], curriculumValidate.sectionUpdateValidation, makeCallback(editSection));
router.put('/editChapter/:curriculumId/:subjectId/:sectionId/:chapterId', [isUserAuthenticated], curriculumValidate.chapterUpdateValidation, makeCallback(editChapter));
router.put('/editContent/:curriculumId/:subjectId/:sectionId/:chapterId/:titleId/:contentId', [isUserAuthenticated], curriculumValidate.contentUpdateValidation, makeCallback(editContent));
router.get('/getCurriculumByCourseId/:id', [isUserAuthenticated], curriculumValidate.idValidation, makeCallback(getCurriculumByCourseId));
router.post('/liveSessionContent/:curriculumId/:subjectId/:sectionId/:chapterId/:titleId', [isUserAuthenticated], curriculumValidate.liveSessionContentCreateValidation, makeCallback(addLiveSessionContent));
router.delete('/deleteContent/:curriculumId/:subjectId/:sectionId/:chapterId//:titleId/:contentId', [isUserAuthenticated], curriculumValidate.contentDeleteValidation, makeCallback(deleteContent));
router.post('/title/:curriculumId/:subjectId/:sectionId/:chapterId', [isUserAuthenticated], makeCallback(addTitle));
router.put('/editTitle/:curriculumId/:subjectId/:sectionId/:chapterId/:titleId', [isUserAuthenticated], curriculumValidate.titleUpdateValidation, makeCallback(editTitle));
router.post('/upload',[isUserAuthenticated], fileUploadValidate.startMultipartUploadValidation, makeCallback(startMultipartUpload));
router.post('/getUploadUrl',[isUserAuthenticated], fileUploadValidate.multipartUploadUrlValidation, makeCallback(getMultipartUploadUrl));
router.post('/completeUpload',[isUserAuthenticated], fileUploadValidate.completeMultipartUploadValidation, makeCallback(completeMultipartUpload));
router.get('/curriculumSchedules',[isUserAuthenticated], makeCallback(getCurriculumSchedules));
router.post('/testContent/:curriculumId/:subjectId/:sectionId/:chapterId/:titleId', [isUserAuthenticated], curriculumValidate.testContentCreateValidation, makeCallback(addTestContent));
router.post('/importFromCurriculum',[isUserAuthenticated], makeCallback(importFromCurriculum));
router.get('/liveSessionDetails/:id',[isUserAuthenticated], makeCallback(getLiveSessionDetails));
router.post('/getAllLiveSessions/:type', makeCallback(getAllLiveSessions));

module.exports = router;