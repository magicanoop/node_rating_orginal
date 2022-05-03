"use strict";
const searchClinet = require('./elasticsearch.client');
const _ = require('underscore');
const globalSearchData = async (queryWord) => {
    const queryDSL = {
        "query": {
          "multi_match": {
            "fields": [
              "object_title",
              "object_description"
            ],
            "query": queryWord
          }
        },
        "highlight": {
          "fields": {
            "object_title.complete": {},
            "object_tags.complete": {}
          }
        }
      }
    try {
        const resp = await searchClinet.search({
            index: 'global_search',
            body: queryDSL
        });
        return { total: resp.hits.total.value, results: _.map(resp.hits.hits , (doc)=>{ return doc._source}) };
    } catch (err) {
        console.trace(err.message);
        return err;
    }
}

const globalGroupSearchData = async (queryWord) => {
//     ,
//     "aggs": {
//      "type": {
//       "terms": {
//         "field": "object_type"
//       }
//     }
//   },
    const queryDSL = {
        "query": {
          "multi_match": {
            "fields": [
              "object_title",
              "object_description"
            ],
            "query": queryWord
          }
        },
        "highlight": {
          "fields": {
            "object_title.complete": {},
            "object_tags.complete": {}
          }
        }
      }
    try {
        const resp = await searchClinet.search({
            index: 'global_search',
            body: queryDSL
        });
        let groups = _.map(resp.hits.hits , (doc)=>{ return doc._source});
        groups = _.groupBy(groups, 'object_type')
        return { total: resp.hits.total.value, results: groups };
    } catch (err) {
        console.trace(err.message);
        return err;
    }
}

const pingElasticsearchService = async () => {
    try {
        const pingResponse = await searchClinet.ping({
            requestTimeout: 30000,
        });
        console.log('Everything is ok');
        return {statusCode: 200, status: true, message :'Everything is ok'};
    } catch (err) {
        console.trace(err.message);
        console.error('elasticsearch cluster is down!');
        return {statusCode: 500, status: false, message :'elasticsearch cluster is down!'};
    }
}

const bulkOperation = async (body) => {
    try {
        const response = await searchClinet.bulk({ body });
       return response;
    } catch (error) {
        console.trace(err.message);
        return {statusCode: 500, status: false, message : error.message || 'Bulk operation failed', data: error};
    }
}

module.exports = {
    globalSearchData,
    pingElasticsearchService,
    globalGroupSearchData,
    bulkOperation
}