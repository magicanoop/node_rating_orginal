const express = require('express');
const router = express.Router();

const {
    saveNoteDetails,
    updateNoteDetails,
    getNoteDetails
} = require('./note.controller');
const { isUserAuthenticated } = require('../../middlewares/authorizer');
const { noteCreateValidation, noteUpdateValidation } = require('../../../validators/note.validation');

const makeCallback = require('../../express-callback');

router.post("/", [isUserAuthenticated], noteCreateValidation, makeCallback(saveNoteDetails));

router.get('/:noteId', [ isUserAuthenticated ], makeCallback(getNoteDetails));

router.put("/:noteId", [isUserAuthenticated], noteUpdateValidation, makeCallback(updateNoteDetails));

module.exports = router;
