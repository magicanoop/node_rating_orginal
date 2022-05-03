"use strict";
const express = require('express');
const router = express.Router();
const makeCallback = require('../../express-callback');
const {
    globalSearch,
    pingSearchService,
    globalGroupSearch,
    createIndices
} = require('./elasticsearch.controller');
// const makeCallback = require('../../express-callback');

router.get('/global', makeCallback(globalSearch)); // content-type => application/json
router.get('/group', makeCallback(globalGroupSearch)); // content-type => application/json
router.get('/ping', makeCallback(pingSearchService));  // content-type => application/json
router.post('/bulk-operation', makeCallback(createIndices));  // content-type => application/x-ndjson

module.exports = router;