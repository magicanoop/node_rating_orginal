const express = require('express');
const router = express.Router();

const {
    createCourse,
    updateCourse,
    createCoursemodel,
    deleteCourse,
    adminSearch,
    deleteCourseModule,
    updateCourseModel,
    getCourseMasters,
    getCourseModules,
    getCourseModuleById,
    softDeleteCourseModule,
    deactivateCourseModule,
    activateCourseModule,
    makeCourseModulePrivate,
    makeCourseModulePublic,
    getCourseMaster,
    getCourseOverView,
    getFacultyByCourseId,
    importStudents
} = require('../course/course.controller');
const courseMasterValidate = require('../../../validators/courseMaster.validation');
const courseModuleValidate = require('../../../validators/courseModule.validator');
const makeCallback = require('../../express-callback');
const { isUserAuthenticated } = require('../../middlewares/authorizer');
const { singleUpload } = require('./../../version0/utils/utils');

router.post('/courseMaster', [isUserAuthenticated], courseMasterValidate.courseMasterCreateValidation, makeCallback(createCourse));
router.put('/courseMaster/:id', [isUserAuthenticated], courseMasterValidate.courseMasterUpdateValidation, makeCallback(updateCourse));
router.delete('/courseMaster/:courseMasterId', [isUserAuthenticated], courseMasterValidate.courseMasterDeleteValidation, makeCallback(deleteCourse));
router.post('/courseModule', [isUserAuthenticated], courseModuleValidate.courseModuleCreateValidation, makeCallback(createCoursemodel))
router.post('/search', [isUserAuthenticated], makeCallback(adminSearch));
router.put('/courseModule/:id', [isUserAuthenticated], courseModuleValidate.courseModuleUpdateValidation, makeCallback(updateCourseModel));
router.delete('/courseModule/:courseModuleId', [isUserAuthenticated], courseModuleValidate.courseModuleDeleteValidation, makeCallback(deleteCourseModule));
router.get('/courseMasters', [isUserAuthenticated], makeCallback(getCourseMasters));
router.post('/courseModules', [isUserAuthenticated], makeCallback(getCourseModules));
router.get('/courseModuleDetails/:id', courseModuleValidate.idValidation, makeCallback(getCourseModuleById));
router.put('/softDeleteCourseModule/:id', [isUserAuthenticated], courseModuleValidate.idValidation, makeCallback(softDeleteCourseModule));
router.put('/deactivateCourseModule/:id', [isUserAuthenticated], courseModuleValidate.idValidation, makeCallback(deactivateCourseModule));
router.put('/activateCourseModule/:id', [isUserAuthenticated], courseModuleValidate.idValidation, makeCallback(activateCourseModule));
router.put('/makeCourseModulePrivate/:id', [isUserAuthenticated], courseModuleValidate.idValidation, makeCallback(makeCourseModulePrivate));
router.put('/makeCourseModulePublic/:id', [isUserAuthenticated], courseModuleValidate.idValidation, makeCallback(makeCourseModulePublic));
router.get('/courseMaster/:id', [isUserAuthenticated], courseModuleValidate.idValidation, makeCallback(getCourseMaster));
router.get('/courseOverView/:id', [isUserAuthenticated], courseModuleValidate.idValidation, makeCallback(getCourseOverView));
router.get('/getFacultyByCourseId/:id',[isUserAuthenticated],makeCallback(getFacultyByCourseId))
router.post("/:curriculumId/students/import", [isUserAuthenticated], singleUpload("file", [".xls", ".xlsx"]),makeCallback(importStudents));
module.exports = router;