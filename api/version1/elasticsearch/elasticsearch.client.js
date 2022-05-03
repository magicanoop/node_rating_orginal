"use strict";
const elasticsearch = require('elasticsearch');

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

const client = new elasticsearch.Client({
    hosts: [ELASTICSEARCH_URL]
});


module.exports = client;