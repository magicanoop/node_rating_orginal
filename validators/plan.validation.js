const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const { moduleNameValidator, findById } = require('../api/version1/plan/plan.service');
let planValidate = {};
const returnStatus = 422;

const method = async (value) => {
    const plan = await moduleNameValidator({ name: value });
    if (!plan) {
        return value;
    } else {
        throw new Error("Name already exists");
    }
};

planValidate.planCreateValidation = async (req, res, next) => {
    const taxSchema = Joi.object().keys({
        cgst: Joi.number().optional(),
        sgst: Joi.number().optional(),
    })
    const createPlanSchema = Joi.object({
        courseMasterId: Joi.objectId().required(),
        courseModuleId: Joi.objectId().required(),
        courseCurriculumId: Joi.objectId().required(),
        name: Joi.string().external(async (value) => {
            const plan = await moduleNameValidator({ name: value, courseModuleId: req.body.courseModuleId });
            if (plan) {
                throw new Error("Name already exists");
            } else {
                return value;
            }
        }).required(),
        duration: Joi.number().external(async (value) => {
            const plan = await moduleNameValidator({ duration: value, courseModuleId: req.body.courseModuleId });
            if (plan) {
                throw new Error("Duration already exists");
            } else {
                return value;
            }
        }).required(),
        price: Joi.number().external(async (value) => {
            const plan = await moduleNameValidator({ price: value, courseModuleId: req.body.courseModuleId });
            if (plan) {
                throw new Error("Price already exists");
            } else {
                return value;
            }
        }).required(),
        isExclusiveTax: Joi.boolean().optional(),
        tax: taxSchema,
        isCustom: Joi.boolean().optional(),
        isActive: Joi.boolean().optional(),
    });
    try {
        await createPlanSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

planValidate.planUpdateValidation = async (req, res, next) => {
    const taxSchema = Joi.object().keys({
        cgst: Joi.number().external(method).optional(),
        sgst: Joi.number().external(method).optional(),
    });
    const plan = await findById(req.params.id);
    const updatePlanSchema = Joi.object({
        name: Joi.string().external(async (value) => {
            let planExists = await moduleNameValidator({ name: value, courseModuleId: plan.courseModuleId });
            if (planExists && planExists._id != req.params.id) {
                throw new Error("Name already exists");
            } else {
                return value;
            }
        }).optional(),
        courseMasterId: Joi.objectId().optional(),
        courseModuleId: Joi.objectId().optional(),
        courseCurriculumId: Joi.objectId().optional(),
        duration: Joi.number().external(async (value) => {
            let planExists = await moduleNameValidator({ duration: value, courseModuleId: plan.courseModuleId });
            if (planExists && planExists._id != req.params.id) {
                throw new Error("Duration already exists");
            } else {
                return value;
            }
        }).optional(),
        price: Joi.number().external(async (value) => {
            let planExists = await moduleNameValidator({ price: value, courseModuleId: plan.courseModuleId });
            if (planExists && planExists._id != req.params.id) {
                throw new Error("Price already exists");
            } else {
                return value;
            }
        }).optional(),
        avgRating: Joi.number().optional(),
        isExclusiveTax: Joi.boolean().optional(),
        tax: taxSchema,
        isCustom: Joi.boolean().optional(),
        isActive: Joi.boolean().optional(),
        createdByUser: Joi.string().optional(),
        updatedByUser: Joi.string().optional()
    });
    const updateParamsSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = updateParamsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    try {
        await updatePlanSchema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(returnStatus).send({ message: error.message });
    }
}


planValidate.planDeleteValidation = (req, res, next) => {
    const deleteParamsSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = deleteParamsSchema.validate(req.params);
    if (error)
        return res.status(returnStatus).send({ message: error.message });
    next();
}


module.exports = planValidate