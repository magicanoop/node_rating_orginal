"use strict";
const {
    globalSearchData, pingElasticsearchService, globalGroupSearchData, bulkOperation
} = require('./elasticsearch.service');

exports.globalSearch = async (httpRequest) => {
    const { query } = httpRequest;
    const searchData = await globalSearchData(query.q);
    return {
        statusCode: 200,
        data: { searchData },
        message: 'Data fetched successfully'
    }
}

exports.globalGroupSearch = async (httpRequest) => {
    const { query } = httpRequest;
    const searchData = await globalGroupSearchData(query.q);
    return {
        statusCode: 200,
        data: { searchData },
        message: 'Data fetched successfully'
    }
}

exports.pingSearchService = async () => {
    const pingReponse = await pingElasticsearchService();
    return pingReponse;
}

exports.createIndices = async (httpRequest) => {
    const { body } = httpRequest;
    const response = await bulkOperation(body);
    return {
        statusCode: 200,
        data: { response },
        message: 'Data fetched successfully'
    }
}


