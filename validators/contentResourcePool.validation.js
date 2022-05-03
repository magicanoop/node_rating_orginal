const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

let contentPoolValidate = {};
const returnStatus = 422;

contentPoolValidate.insertContentShema = async (req, res, next) => {
    const createContentSchema = Joi.object().keys({
        courseId: Joi.objectId().required(),
        facultyId: Joi.objectId().required(),
        tags: Joi.array().items(Joi.string()).min(1).required(),
        url: Joi.string().uri().required(),
        duration: Joi.number().required(),
        title: Joi.string().required(),
        type: Joi.string().valid(...["video", "note"]).required(),
        description: Joi.string().required(),
        imageUrl: Joi.string().uri().required(),
        faculty: Joi.array().items(Joi.string()).min(1).required(),
        
    })

    const createContentPoolValidateSchema = Joi.object({
        contents:Joi.array().items(createContentSchema).min(1).required()
   
    });
    try {
        await createContentPoolValidateSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

contentPoolValidate.uploadShema = async (req, res, next) => {
    const qualitySchema = Joi.object().keys({
        quality: Joi.string().required(),
        description: Joi.string().optional(),
    })
    const transcodeFileTypeSchema = Joi.object().keys({
        type: Joi.string().required(),
        extension: Joi.string().optional()
    })
    const createContentSchema = Joi.object().keys({
        instituteId: Joi.objectId().optional(),
        facultyId: Joi.objectId().optional(),
        status: Joi.string().required(),
        trancodeRequired: Joi.boolean().optional(),
        fileType: Joi.string().optional(),
        fileName: Joi.string().required(),
        extension: Joi.string().optional(),
        contentType: Joi.string().valid(...["video", "note"]).required(),
        transcodeQuality: Joi.array().items(qualitySchema).optional(),
        transcodeFileType: Joi.array().items(transcodeFileTypeSchema).optional()
    })

    const createContentPoolValidateSchema = Joi.object({
        contents:Joi.array().items(createContentSchema).min(1).required()
   
    });
    try {
        await createContentPoolValidateSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

contentPoolValidate.uploadCompleteShema = async (req, res, next) => {
    const createContentSchema = Joi.object().keys({
        url: Joi.string().uri(),
        status: Joi.string().required(),
        languageId: Joi.string().required(),
        guid: Joi.string().required(),
    })
    const createContentPoolValidateSchema = Joi.object({
        contents:Joi.array().items(createContentSchema).min(1).required()
   
    });
    try {
        await createContentPoolValidateSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

contentPoolValidate.deleteContentShema = async (req, res, next) => {
    const deleteSchema = Joi.object().keys({
        contentId: Joi.string().required(),
        contentType: Joi.string().required(),

    })
    const deleteContentPoolValidateSchema = Joi.object({
        contents:Joi.array().items(deleteSchema).min(1).required()
   
    });
    try {
        await deleteContentPoolValidateSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

contentPoolValidate.updateShema = async (req, res, next) => {
    const qualitySchema = Joi.object().keys({
        quality: Joi.string().required(),
        description: Joi.string().optional(),
    })
    const transcodeFileTypeSchema = Joi.object().keys({
        type: Joi.string().required(),
        extension: Joi.string().optional()
    })
    const titleSchema = Joi.object().keys({
        languageId: Joi.string().required(),
        value: Joi.string().required()
    })
    const updateContentSchema = Joi.object().keys({
        _id: Joi.objectId().required(),
        description: Joi.string().optional().allow(""),
        tags:Joi.array().optional(),
        categories:Joi.array().optional(),
        subjects: Joi.array().optional(),
        faculties: Joi.array().optional(),
        title: Joi.array().items(titleSchema).required(),
        trancodeRequired: Joi.boolean().optional(),
        transcodeQuality: Joi.array().items(qualitySchema).optional(),
        transcodeFileType: Joi.array().items(transcodeFileTypeSchema).optional(),
        thumbnail: Joi.string().optional().allow("")
    })

    const createContentPoolValidateSchema = Joi.object({
        contents:Joi.array().items(updateContentSchema).min(1).required()
   
    });
    try {
        await createContentPoolValidateSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

contentPoolValidate.importContentToCurriculumShema = async (req, res, next) => {
    const createContentPoolValidateSchema = Joi.object({
        chapterId: Joi.objectId().required(),
        curriculumId: Joi.objectId().required(),
        subjectId : Joi.objectId().required(),
        sectionId: Joi.objectId().required(),
        curriculumId: Joi.objectId().required(),
        contentIds: Joi.array().required(),
        titleId:Joi.objectId().required()
    });
    try {
        await createContentPoolValidateSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

contentPoolValidate.uploadThumbnailShema = async (req, res, next) => {
    const uploadThumbnaillValidateSchema = Joi.object({
        contentType: Joi.string().required(),
        extension: Joi.string().required(),
    });
    try {
        await uploadThumbnaillValidateSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

contentPoolValidate.searchShema = async (req, res, next) => {
    const searchValidateSchema = Joi.object({
        filters: Joi.object().optional(),
        query: Joi.string().optional().allow(''),
        searchFields:Joi.array().optional(),
        sort: Joi.object().optional()
    });
    try {
        await searchValidateSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}
module.exports = contentPoolValidate