const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const {
    FREE,
    LIVE,
    PREMIUM,
    RECORDED,
    POINT
} = require('../utils/enums');
const { masterNameValidator } = require('../api/version1/course/course.service');
let courseMasterValidate = {};
const returnStatus = 422;

courseMasterValidate.courseMasterCreateValidation = async (req, res, next) => {
    const locationSchema = Joi.object().keys({
        type: Joi.string().valid(...[POINT]),
        coordinates: Joi.array().min(2)
    })
    const createCourseMasterSchema = Joi.object({
        name: Joi.string().external(async(value) => {
            try {
                await masterNameValidator(value);
                return value;
            } catch (error) {
                throw error
            }
        }).required(),
        instituteId: Joi.objectId().required(),
        mainCategories: Joi.array().items(Joi.objectId()).min(1).required(),
        subCategories: Joi.array().items(Joi.objectId()).min(0).optional(),
        hasLive: Joi.boolean().required(),
        hasRecorded: Joi.boolean().required(),
        country: Joi.string().optional(),
        state: Joi.string().optional(),
        location: locationSchema
    });
    try {
        await createCourseMasterSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

courseMasterValidate.courseMasterUpdateValidation = async (req, res, next) => {
    const courseModulesSchema = Joi.object().keys({
        type: Joi.string().valid(...[FREE, PREMIUM, LIVE, RECORDED]),
        moduleId: Joi.objectId().optional()
    })
    const locationSchema = Joi.object().keys({
        type: Joi.string().valid(...[POINT]),
        coordinates: Joi.array().min(2)
    })
    const updateCourseMasterSchema = Joi.object({
        name: Joi.string().external(async(value) => {
            try {
                await masterNameValidator(value, req.params.id);
                return value;
            } catch (error) {
                throw error
            }
        }).optional(),
        instituteId: Joi.objectId().optional(),
        mainCategories: Joi.array().items(Joi.objectId()).min(1).optional(),
        subCategories: Joi.array().items(Joi.objectId()).min(0).optional(),
        hasLive: Joi.boolean().optional(),
        hasRecorded: Joi.boolean().optional(),
        country: Joi.string().optional(),
        state: Joi.string().optional(),
        courseModules: Joi.array().items(courseModulesSchema).optional(),
        location: locationSchema
    });
    const updateParamsSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = updateParamsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    try {
        await updateCourseMasterSchema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(returnStatus).send({ message: error.message });
    }
}

courseMasterValidate.courseMasterDeleteValidation = (req, res, next) => {
    const deleteParamsSchema = Joi.object({
        courseMasterId: Joi.objectId().required()
    });
    let { error, value } = deleteParamsSchema.validate(req.params);
    if (error)
        return res.status(returnStatus).send({ message: error.message });
    next();
}

module.exports = courseMasterValidate;