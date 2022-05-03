const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const {
    FREE,
    LIVE,
    PREMIUM,
    RECORDED,
    POINT
} = require('../utils/enums');
const { moduleNameValidator } = require('../api/version1/course/course.service');
let courseModuleValidate = {};
const returnStatus = 422;

courseModuleValidate.courseModuleCreateValidation = async (req, res, next) => {
    const locationSchema = Joi.object().keys({
        type: Joi.string().valid(...[POINT]),
        coordinates: Joi.array().min(2)
    })
    const createCourseModuleSchema = Joi.object({
        name: Joi.string().required(),
        instituteId: Joi.objectId().required(),
        mainCategories: Joi.array().items(Joi.objectId()).min(1).required(),
        subCategories: Joi.array().items(Joi.objectId()).min(1).required(),
        imageUrl: Joi.string().required(),
        planType: Joi.string().valid(...[FREE, PREMIUM]).required(),
        moduleType: Joi.string().valid(...[LIVE, RECORDED]).required(),
        languages: Joi.array().items(Joi.string()).required(),
        subtitleLanguages: Joi.array().items(Joi.string()).optional(),
        description: Joi.string().required(),
        learningPoints: Joi.array().items(Joi.string()).required(),
        subtitleLanguages: Joi.array().items(Joi.string()).required(),
        tags: Joi.array().items(Joi.string()).required(),
        country: Joi.string().optional(),
        state: Joi.string().optional(),
        courseMasterId: Joi.objectId().required(),
        location: locationSchema,
        isPrivate: Joi.boolean().optional(),
        isCertified: Joi.boolean().optional(),
        isSponsored: Joi.boolean().optional(),
        isBestSeller: Joi.boolean().optional(),
        startDate: Joi.date().optional(),
        relatedCourses:Joi.array().items(Joi.objectId()).optional()
    });
    try {
        await createCourseModuleSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

courseModuleValidate.courseModuleUpdateValidation = async (req, res, next) => {
    const locationSchema = Joi.object().keys({
        type: Joi.string().valid(...[POINT]),
        coordinates: Joi.array().min(2)
    })
    const createCourseModuleSchema = Joi.object({
        name: Joi.string().optional(),
        instituteId: Joi.objectId().optional(),
        mainCategories: Joi.array().items(Joi.objectId()).min(1).optional(),
        subCategories: Joi.array().items(Joi.objectId()).min(1).optional(),
        imageUrl: Joi.string().optional(),
        planType: Joi.string().valid(...[FREE, PREMIUM]).optional(),
        moduleType: Joi.string().valid(...[LIVE, RECORDED]).optional(),
        languages: Joi.array().items(Joi.string()).optional(),
        subtitleLanguages: Joi.array().items(Joi.string()).optional(),
        description: Joi.string().optional(),
        learningPoints: Joi.array().items(Joi.string()).optional(),
        subtitleLanguages: Joi.array().items(Joi.string()).optional(),
        tags: Joi.array().items(Joi.string()).optional(),
        country: Joi.string().optional(),
        state: Joi.string().optional(),
        courseMasterId: Joi.objectId().optional(), 
        location: locationSchema,
        isPrivate: Joi.boolean().optional(),
        isCertified: Joi.boolean().optional(),
        isSponsored: Joi.boolean().optional(),
        isBestSeller: Joi.boolean().optional(),
        startDate: Joi.date().optional(),
        relatedCourses:Joi.array().items(Joi.objectId()).optional(),
        faculties: Joi.array().items(Joi.string()).optional(),
    });
    const updateParamsSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = updateParamsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    try {
        await createCourseModuleSchema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(returnStatus).send({ message: error.message });
    }
}


courseModuleValidate.courseModuleDeleteValidation = (req, res, next) => {
    const deleteParamsSchema = Joi.object({
        courseModuleId: Joi.objectId().required()
    });
    let { error, value } = deleteParamsSchema.validate(req.params);
    if (error)
        return res.status(returnStatus).send({ message: error.message });
    next();
}

courseModuleValidate.idValidation = (req, res, next) => {
    const idParamsSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = idParamsSchema.validate(req.params);
    if (error)
        return res.status(returnStatus).send({ message: error.message });
    next();
}

courseModuleValidate.getByTypeValidation = (req, res, next) => {
    const idParamsSchema = Joi.object({
        id: Joi.objectId().required(),
        type: Joi.string().valid(...[LIVE, RECORDED]).required(),
    });
    let { error, value } = idParamsSchema.validate(req.params);
    if (error)
        return res.status(returnStatus).send({ message: error.message });
    next();
}

module.exports = courseModuleValidate