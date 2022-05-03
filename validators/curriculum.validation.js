const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const {
    VIDEO,
    NOTE,
    TEST,
    LIVE,
    RECORDED,
    ZOOM
} = require('../utils/enums');

const returnStatus = 422;
let curriculumValidate = {};

curriculumValidate.subjectCreateValidation = async (req, res, next) => {
    const createSubjectSchema = Joi.object({
        title: Joi.string().required(),
    });
    const createParamsSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = createParamsSchema.validate(req.params);
    let { error: err } = createSubjectSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.sectionCreateValidation = async (req, res, next) => {
    const createSectionSchema = Joi.object({
        title: Joi.string().required(),
    });
    const createParamsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required()
    });
    let { error, value } = createParamsSchema.validate(req.params);
    let { error: err } = createSectionSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.chapterCreateValidation = async (req, res, next) => {
    const createChapterSchema = Joi.object({
        title: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).optional(),
    });
    const createParamsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required()
    });
    let { error, value } = createParamsSchema.validate(req.params);
    let { error: err } = createChapterSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.videoContentCreateValidation = async (req, res, next) => {
    const createContentSchema = Joi.object({
        courseId: Joi.objectId().required(),
        facultyId: Joi.objectId().required(),
        tags: Joi.array().items(Joi.string()).min(1).required(),
        url: Joi.string().uri().required(),
        duration: Joi.number().required(),
        title: Joi.string().required(),
        type: Joi.string().valid(...[VIDEO, NOTE, TEST, LIVE, RECORDED]).required(),
        description: Joi.string().required(),
        imageUrl: Joi.string().uri().required(),
        faculty: Joi.array().items(Joi.string()).min(1).required()
    });
    const createParamsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required(),
        chapterId: Joi.objectId().required(),
        titleId: Joi.objectId().required(),
    });
    let { error, value } = createParamsSchema.validate(req.params);
    let { error: err } = createContentSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.noteContentCreateValidation = async (req, res, next) => {
    const createContentSchema = Joi.object({
        courseId: Joi.objectId().required(),
        facultyId: Joi.objectId().required(),
        tags: Joi.array().items(Joi.string()).min(1).required(),
        url: Joi.string().uri().required(),
        title: Joi.string().required(),
        type: Joi.string().valid(...[VIDEO, NOTE, TEST, LIVE, RECORDED]).required(),
        description: Joi.string().required(),
        imageUrl: Joi.string().uri().required(),
        faculty: Joi.array().items(Joi.string()).min(1).required()
    });
    const createParamsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required(),
        chapterId: Joi.objectId().required(),
        titleId: Joi.objectId().required(),
    });
    let { error, value } = createParamsSchema.validate(req.params);
    let { error: err } = createContentSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.subjectChangeStatusValidation = async (req, res, next) => {
    const paramsSchema = Joi.object({
        status: Joi.boolean().required(),
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required()
    });
    let { error, value } = paramsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next()
}

curriculumValidate.sectionChangeStatusValidation = async (req, res, next) => {
    const paramsSchema = Joi.object({
        status: Joi.boolean().required(),
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required()
    });
    let { error, value } = paramsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next()
}

curriculumValidate.chapterChangeStatusValidation = async (req, res, next) => {
    const paramsSchema = Joi.object({
        status: Joi.boolean().required(),
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required(),
        chapterId: Joi.objectId().required()
    });
    let { error, value } = paramsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next()
}

curriculumValidate.contentChangeStatusValidation = async (req, res, next) => {
    const paramsSchema = Joi.object({
        status: Joi.boolean().required(),
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required(),
        chapterId: Joi.objectId().required(),
        contentId: Joi.objectId().required(),
        titleId: Joi.objectId().required(),
    });
    let { error, value } = paramsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next()
}

curriculumValidate.contentUpdateValidation = async (req, res, next) => {
    const liveSessionDetailsSchema = Joi.object().keys({
        startUrl: Joi.string().uri().optional(),
        joinUrl: Joi.string().uri().optional(),
        password: Joi.string().optional()
    });
    const updateContentSchema = Joi.object({
        courseId: Joi.objectId().optional(),
        facultyId: Joi.objectId().optional(),
        tags: Joi.array().items(Joi.string()).min(1).optional(),
        url: Joi.string().uri().optional(),
        duration: Joi.number().optional(),
        title: Joi.string().optional(),
        type: Joi.string().valid(...[VIDEO, NOTE, TEST, LIVE, RECORDED]).required(),
        description: Joi.string().optional(),
        imageUrl: Joi.string().uri().optional(),
        contentId: Joi.objectId().required(),
        faculty: Joi.array().items(Joi.string()).min(1).optional(),
        liveSessionDetails: liveSessionDetailsSchema,
        serviceProvider: Joi.string().valid(...[ZOOM]).optional(),
        startDateTime: Joi.date().optional(),
        instituteId: Joi.objectId().optional()
    });
    const paramsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required(),
        chapterId: Joi.objectId().required(),
        titleId: Joi.objectId().required(),
        contentId: Joi.objectId().required()
    });
    let { error, value } = paramsSchema.validate(req.params);
    let { error: err } = updateContentSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.chapterUpdateValidation = async (req, res, next) => {
    const updateChapterSchema = Joi.object({
        title: Joi.string().optional(),
        tags: Joi.array().items(Joi.string()).min(1).optional()
    });
    const paramsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required(),
        chapterId: Joi.objectId().required()
    });
    let { error, value } = paramsSchema.validate(req.params);
    let { error: err } = updateChapterSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.sectionUpdateValidation = async (req, res, next) => {
    const updateSectionSchema = Joi.object({
        title: Joi.string().optional()
    });
    const paramsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required()
    });
    let { error, value } = paramsSchema.validate(req.params);
    let { error: err } = updateSectionSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.subjectUpdateValidation = async (req, res, next) => {
    const updateSubjectSchema = Joi.object({
        title: Joi.string().optional()
    });
    const paramsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required()
    });
    let { error, value } = paramsSchema.validate(req.params);
    let { error: err } = updateSubjectSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.idValidation = async (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = paramsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next()
}

curriculumValidate.liveSessionContentCreateValidation = async (req, res, next) => {
    const createContentSchema = Joi.object({
        courseId: Joi.objectId().required(),
        facultyId: Joi.objectId().required(),
        title: Joi.string().required(),
        type: Joi.string().valid(...[VIDEO, NOTE, TEST, LIVE, RECORDED]).required(),
        description: Joi.string().required(),
        imageUrl: Joi.string().uri().required(),
        faculty: Joi.array().items(Joi.string()).min(1).required(),
        startDateTime: Joi.string().required(),
        duration: Joi.number().required(),
        serviceProvider: Joi.string().valid(...[ZOOM]).required(),
        instituteId: Joi.objectId().required()
    });
    const createParamsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required(),
        chapterId: Joi.objectId().required(),
        titleId: Joi.objectId().required()
    });
    let { error, value } = createParamsSchema.validate(req.params);
    let { error: err } = createContentSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.contentDeleteValidation = async (req, res, next) => {
    const bodySchema = Joi.object({
        id: Joi.string().required(),
        type: Joi.string().valid(...[VIDEO, NOTE, TEST, LIVE, RECORDED]).required()
    });
    const paramsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required(),
        chapterId: Joi.objectId().required(),
        titleId: Joi.objectId().required(),
        contentId: Joi.objectId().required()
    });
    let { error, value } = paramsSchema.validate(req.params);
    let { error: err } = bodySchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.titleUpdateValidation = async (req, res, next) => {
    const updateChapterSchema = Joi.object({
        title: Joi.string().optional()
    });
    const paramsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required(),
        chapterId: Joi.objectId().required(),
        titleId: Joi.objectId().required()
    });
    let { error, value } = paramsSchema.validate(req.params);
    let { error: err } = updateChapterSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

curriculumValidate.testContentCreateValidation = async (req, res, next) => {
    const createContentSchema = Joi.object({
        courseId: Joi.objectId().required(),
        title: Joi.string().required(),
        type: Joi.string().valid(...[TEST]).required(),
        description: Joi.string().required(),
        imageUrl: Joi.string().uri().required(),
        instructions: Joi.string().required()
    });
    const createParamsSchema = Joi.object({
        curriculumId: Joi.objectId().required(),
        subjectId: Joi.objectId().required(),
        sectionId: Joi.objectId().required(),
        chapterId: Joi.objectId().required(),
        titleId: Joi.objectId().required(),
    });
    let { error, value } = createParamsSchema.validate(req.params);
    let { error: err } = createContentSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next()
}

module.exports = curriculumValidate;