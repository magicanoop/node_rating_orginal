const Joi = require('joi');

const returnStatus = 422;
let fileUploadValidate = {};

fileUploadValidate.uploadValidation = async (req, res, next) => {
    const fileSchema = Joi.object({
        fileName: Joi.string().required(),
        contentType: Joi.string().required()
    });
    let { error, value } = fileSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next()
}

fileUploadValidate.supportFileValidation = async (req, res, next) => {
    const fileSchema = Joi.object({
        fileName: Joi.string().required(),
        contentType: Joi.string().required(),
        courseId: Joi.string().required(),
        videoId: Joi.string().required()
    });
    let { error, value } = fileSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next()
}

fileUploadValidate.publicFileValidation = async (req, res, next) => {
    const fileSchema = Joi.object({
        folder: Joi.string().required(),
        fileName: Joi.string().required(),
        contentType: Joi.string().required()
    });
    let { error, value } = fileSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next()
}

fileUploadValidate.startMultipartUploadValidation = async (req, res, next) => {
    const fileSchema = Joi.object({
        fileType: Joi.string().required(),
        fileName: Joi.string().required(),
        extension: Joi.string().optional()
    });
    let { error, value } = fileSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next();
}

fileUploadValidate.multipartUploadUrlValidation = async (req, res, next) => {
    const fileSchema = Joi.object({
        s3Key: Joi.string().required(),
        partNumber: Joi.string().required(),
        uploadId: Joi.string().optional()
    });
    let { error, value } = fileSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next();
}

fileUploadValidate.completeMultipartUploadValidation = async (req, res, next) => {
    const fileSchema = Joi.object({
        s3Key: Joi.string().required(),
        parts: Joi.array().optional(),
        uploadId: Joi.string().required()
    });
    let { error, value } = fileSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next();
}

fileUploadValidate.noteFileValidation = async (req, res, next) => {
    const fileSchema = Joi.object({
        fileName: Joi.string().required(),
        contentType: Joi.string().required(),
        courseId: Joi.string().required(),
        noteType: Joi.string().required()
    });
    let { error, value } = fileSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next();
}

fileUploadValidate.contentUploadValidation = async (req, res, next) => {
    const fileSchema = Joi.object({
        fileName: Joi.string().required(),
        contentType: Joi.string().required(),
        courseId: Joi.string().required()
    });
    let { error, value } = fileSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next()
}

fileUploadValidate.crpNoteValidation = async (req, res, next) => {
    const fileSchema = Joi.object({
        fileName: Joi.string().required(),
        contentType: Joi.string().required(),
        instituteId: Joi.string().required()
    });
    let { error, value } = fileSchema.validate(req.body);
    if (error) return res.status(returnStatus).send({ message: error.message });
    next()
}

module.exports = fileUploadValidate;