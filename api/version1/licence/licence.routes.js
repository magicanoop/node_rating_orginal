const express = require('express');
const router = express.Router();

const {
    createLicence,
    updateLicence,
    deleteLicence,
    listAll,
    licenceDetails
} = require('./licence.controller');
const makeCallback = require('../../express-callback');
const { isUserAuthenticated } = require('../../middlewares/authorizer');
const licenceValidate = require('../../../validators/licence.validation');

router.post('/', [isUserAuthenticated], licenceValidate.licenceCreateValidation, makeCallback(createLicence));
router.put('/:id', [isUserAuthenticated], licenceValidate.licenceUpdateValidation, makeCallback(updateLicence));
router.delete('/:licenceId', [isUserAuthenticated], licenceValidate.licenceDeleteValidation, makeCallback(deleteLicence));
router.post('/listAll', [isUserAuthenticated], licenceValidate.licenceListAllValidation, makeCallback(listAll));
router.get('/details/:id', [isUserAuthenticated], licenceValidate.idValidation, makeCallback(licenceDetails));

module.exports = router;