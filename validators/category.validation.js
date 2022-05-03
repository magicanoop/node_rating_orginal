const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const { moduleTitleValidator, categoryGroupTitleValidator } = require('../api/version1/category/category.service');
let categoryValidate = {};
const returnStatus = 422;

const method = async (value) => {
    const category = await moduleTitleValidator(value);
    if (!category) {
        return value;
    } else {
        throw new Error("Title already exists");
    }
};

categoryValidate.categoryCreateValidation = async (req, res, next) => {
    const createCategorySchema = Joi.object({
        parentId: Joi.objectId().optional().allow(""),
        title: Joi.string().external(method).required(),
        code: Joi.string().optional(),
        imageUrl: Joi.string().uri().optional(),
        isHome: Joi.boolean().optional(),
    });
    try {
        await createCategorySchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

categoryValidate.categoryUpdateValidation = async (req, res, next) => {
    const updateCategorySchema = Joi.object({
        title: Joi.string().external(async (value) => {
            const category = await moduleTitleValidator(value);
            if (category && category._id != req.params.id) {
                throw new Error("Name already exists");
            } else {
                return value;
            }
        }).optional(),
        parentId: Joi.objectId().optional().allow(""),
        code: Joi.string().optional(),
        imageUrl: Joi.string().uri().optional(),
        isHome: Joi.boolean().optional(),
    });
    const updateParamsSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = updateParamsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    try {
        await updateCategorySchema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(returnStatus).send({ message: error.message });
    }
}


categoryValidate.categoryDeleteValidation = (req, res, next) => {
    const deleteParamsSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = deleteParamsSchema.validate(req.params);
    if (error)
        return res.status(returnStatus).send({ message: error.message });
    next();
}

categoryValidate.subCategoryListValidation = (req, res, next) => {
    const paramsSchema = Joi.object({
        parentId: Joi.objectId().required()
    });
    let { error, value } = paramsSchema.validate(req.params);
    if (error)
        return res.status(returnStatus).send({ message: error.message });
    next();
}

categoryValidate.categoryGroupCreateValidation = async (req, res, next) => {
    const createGroupSchema = Joi.object({
        parentId: Joi.objectId().optional().allow(""),
        title: Joi.string().external(async (value) => {
            try {
                await categoryGroupTitleValidator(value);
                return value;
            } catch (error) {
                throw error;
            }
        }).required(),
        imageUrl: Joi.string().uri().required(),
        memberCategories: Joi.array().items(Joi.objectId()).optional()
    });
    try {
        await createGroupSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

categoryValidate.categoryGroupUpdateValidation = async (req, res, next) => {
    const updateGroupSchema = Joi.object({
        parentId: Joi.objectId().optional().allow(""),
        title: Joi.string().external(async (value) => {
            try {
                await categoryGroupTitleValidator(value, req.params.id);
                return value;
            } catch (error) {
                throw error;
            }
        }).optional(),
        imageUrl: Joi.string().uri().optional(),
        memberCategories: Joi.array().items(Joi.objectId()).optional()
    });
    const updateParamsSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = updateParamsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    try {
        await updateGroupSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

categoryValidate.categoryGroupDeleteValidation = async (req, res, next) => {
    const deleteGroupSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = deleteGroupSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next();
}


module.exports = categoryValidate