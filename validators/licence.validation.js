const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { licenceUniqueValidator } = require('../api/version1/licence/licence.service');

let licenceValidate = {};
const returnStatus = 422;

licenceValidate.licenceCreateValidation = async (req, res, next) => {
    const createLicenceSchema = Joi.object({
        email: Joi.string().external(async (value) => {
            try {
                await licenceUniqueValidator('email', value);
                return value;
            } catch (error) {
                throw error;
            }
        }).required(),
        name: Joi.string().external(async (value) => {
            try {
                await licenceUniqueValidator('name', value);
                return value;
            } catch (error) {
                throw error;
            }
        }).required(),
        availableMaxMeetingDuration: Joi.number().required(),
    });
    try {
        await createLicenceSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

licenceValidate.licenceUpdateValidation = async (req, res, next) => {
    const updateLicenceSchema = Joi.object({
        email: Joi.string().external(async (value) => {
            try {
                await licenceUniqueValidator('email', value, req.params.id);
                return value;
            } catch (error) {
                throw error;
            }
        }).optional(),
        name: Joi.string().external(async (value) => {
            try {
                await licenceUniqueValidator('name', value, req.params.id);
                return value;
            } catch (error) {
                throw error;
            }
        }).optional(),
        availableMaxMeetingDuration: Joi.number().optional(),
    });
    const updateParamsSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = updateParamsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    try {
        await updateLicenceSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error) return res.status(returnStatus).send({ message: error.message });
    }
}

licenceValidate.licenceDeleteValidation = (req, res, next) => {
    const deleteParamsSchema = Joi.object({
        licenceId: Joi.objectId().required()
    });
    let { error, value } = deleteParamsSchema.validate(req.params);
    if (error)
        return res.status(returnStatus).send({ message: error.message });
    next();
}

licenceValidate.idValidation = (req, res, next) => {
    const idSchema = Joi.object({
        id: Joi.objectId().required()
    });
    let { error, value } = idSchema.validate(req.params);
    if (error)
        return res.status(returnStatus).send({ message: error.message });
    next();
}

licenceValidate.licenceListAllValidation = async (req, res, next) => {
    const listAllLicenceParamsSchema = Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional()
    });
    const listAllLicenceBodySchema = Joi.object({
        filters: Joi.object().optional(),
        query: Joi.string().optional().allow(''),
        sort: Joi.object().optional()
    });
    let { error, value } = listAllLicenceBodySchema.validate(req.body);
    let { error: err, value: licenceValue } = listAllLicenceParamsSchema.validate(req.params);
    if (error) return res.status(returnStatus).send({ message: error.message });
    if (err) return res.status(returnStatus).send({ message: err.message });
    next();
}

module.exports = licenceValidate;