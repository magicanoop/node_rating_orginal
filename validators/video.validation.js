const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

let videoValidate = {};
const returnStatus = 422;

videoValidate.videoCreateValidation = async (req, res, next) => {
    const createVideoSchema = Joi.object({
        courseId: Joi.objectId().required(),
        title: Joi.string().required(),
        imageUrl: Joi.string().required(),
        facultyId: Joi.string().allow(''),
        tags: Joi.array().items(Joi.string()).optional(),
        description: Joi.string().optional(),
        duration: Joi.number().optional(),
        url: Joi.string().optional(),
        supportFiles: Joi.array().optional()
    });
    try {
        await createVideoSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

videoValidate.videoUpdateValidation = async (req, res, next) => {
    const updateVideoSchema = Joi.object({
        courseId: Joi.objectId().required(),
        title: Joi.string().required(),
        imageUrl: Joi.string().required(),
        facultyId: Joi.string().allow(''),
        tags: Joi.array().items(Joi.string()).optional(),
        description: Joi.string().optional(),
        duration: Joi.number().optional(),
        url: Joi.string().optional(),
        supportFiles: Joi.array().optional()
    });
    try {
        await updateVideoSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

videoValidate.getUploadUrlValidation = async (req, res, next) => {
    const uploadUrlSchema = Joi.object({
        s3Key: Joi.string().required(),
        partNumber: Joi.string().required(),
        uploadId: Joi.string().required()
    });
    try {
        await uploadUrlSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

videoValidate.completeUploadValidation = async (req, res, next) => {
    const completeUploadSchema = Joi.object({
        s3Key: Joi.string().required(),
        parts: Joi.array().min(1).required(),
        uploadId: Joi.string().required()
    });
    try {
        await completeUploadSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

module.exports = videoValidate;
