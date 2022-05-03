const LicenceModel = require('./models/licence.model');
const makeLicenceDb = require('./DAO/licenceDAO');
const { NotFoundError, BadRequestError } = require('../../../utils/api_error_util');
const BuildQueryRequest = require('./../../queryBuilder');
const buildQueryRequest = new BuildQueryRequest(require("regex-escape"), { asc: 1, desc: -1 });
const LicenceDb = makeLicenceDb({ LicenceModel });
const { LiveSessionsFactory } = require('../liveSession/livesSessionFactory');
const zoomConfig = require('./../../../config/zoom');

const addZoomDetails = async (details) => {
    let liveSessionsFactory = new LiveSessionsFactory(zoomConfig);
    let liveSessionService = liveSessionsFactory.getLiveSessionServices("zoom");
    let { code, data: zoomUserDetails, message } = await liveSessionService.getUserDetails(details.email);
    if (code != 200) {
        throw new BadRequestError(message)
    }
    let { data: zoomUserSettings } = await liveSessionService.getUserSettings(zoomUserDetails.id);
    details.zoomUserId = zoomUserDetails.id;
    details.zoomUserInfo = zoomUserDetails
    if (zoomUserSettings?.feature?.meeting_capacity) {
        details.capacity = zoomUserSettings.feature.meeting_capacity;
    }
    details.canRecord = true;
    return details;
}

const createLicence = async (details) => {
    details = await addZoomDetails(details);
    const response = await LicenceDb.create(details);
    return response
}

const updateLicence = async (id, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: id,
        }
    });
    let options = {
        new: true
    };
    if (details.email) {
        details = await addZoomDetails(details);
    }
    const response = await LicenceDb.update(findRequest, details, options);
    if (!response) {
        throw new NotFoundError(`Licence not found`)
    }
    return response
}

const deleteLicence = async (id) => {
    const response = await LicenceDb.remove(id);
    if (!response) {
        throw new NotFoundError(`Licence not found`)
    }
    return response
}

const listAll = async (searchParams) => {
    let findRequest = buildQueryRequest(searchParams);
    const response = await LicenceDb.findAll(findRequest);
    return response
}

const licenceDetails = async (id) => {
    const response = await LicenceDb.findById(id);
    if (!response) {
        throw new NotFoundError(`Licence not found`)
    }
    return response
}

const licenceUniqueValidator = async (field, value, id = null) => {
    let findRequest = buildQueryRequest({
        filters: {
            [field]: value
        }
    });
    const response = await LicenceDb.findByHash(findRequest);
    if (response && id && response._id != id) {
        throw new Error(`${field} already exists`);
    }
    if (response && !id) {
        throw new Error(`${field} already exists`);
    }
    return;
}

module.exports = {
    createLicence,
    updateLicence,
    deleteLicence,
    listAll,
    licenceDetails,
    licenceUniqueValidator
}