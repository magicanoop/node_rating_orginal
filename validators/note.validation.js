const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

let noteValidate = {};
const returnStatus = 422;

noteValidate.noteCreateValidation = async (req, res, next) => {
    const createNoteSchema = Joi.object({
        courseId: Joi.objectId().required(),
        title: Joi.string().required(),
        imageUrl: Joi.string().required(),
        url: Joi.string().required(),
        facultyId: Joi.string().allow(''),
        tags: Joi.array().items(Joi.string()).optional(),
        description: Joi.string().optional(),
        isShareable: Joi.boolean().required()
    });
    try {
        await createNoteSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

noteValidate.noteUpdateValidation = async (req, res, next) => {
    const updateNoteSchema = Joi.object({
        courseId: Joi.objectId().required(),
        title: Joi.string().required(),
        imageUrl: Joi.string().required(),
        url: Joi.string().required(),
        facultyId: Joi.string().allow(''),
        tags: Joi.array().items(Joi.string()).optional(),
        description: Joi.string().optional(),
        isShareable: Joi.boolean().required()
    });
    try {
        await updateNoteSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

module.exports = noteValidate;
