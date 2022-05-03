const config = require('config');
const RegexEscape = require("regex-escape");
const constants = require('./../constants/constants');
const responseHelper = require('./../utils/responseHelper');
const responseMessages = require('./../constants/messages');
const { logger } = require('./../../../config');

exports.getSearchQuery = (text, fields, tagsValues) => {
    let conditions = [];
    if (text != "" && fields && fields.length > 0) {
        fields.forEach(field => {
            conditions.push({
                [field]: {
                    $regex: RegexEscape(text),
                    $options: "i"
                }
            })
        });
    }
    if (tagsValues) {
        Object.keys(tagsValues).forEach(key => {
            if (tagsValues[key].length > 0) {
                conditions.push({
                    [key]: {
                        $in: tagsValues[key]
                    }
                })
            }
        })
    }
    return conditions;
}

const getRangeQuery = (rangeObjs) => {
    let rangeQuery = {};
    Object.keys(rangeObjs).forEach(key => {
        let rangeObj = rangeObjs[key];
        rangeQuery[key] = {};
        if (rangeObj.hasOwnProperty('gte')) {
            rangeQuery[key]["$gte"] = rangeObj.gte;
        }
        if (rangeObj.hasOwnProperty('lt')) {
            rangeQuery[key]["$lt"] = rangeObj.lt;
        }
        if (rangeObj.hasOwnProperty('gt')) {
            rangeQuery[key]["$gt"] = rangeObj.gt;
        }
        if (rangeObj.hasOwnProperty('lte')) {
            rangeQuery[key]["$lte"] = rangeObj.lte;
        }
    });
    // logger.info("Range object : " + JSON.stringify(rangeQuery))
    return rangeQuery;
}

const getAggregationsQuery = (aggFields) => {
    let obj = { _id: 0 };
    Object.keys(aggFields).forEach(key => {
        obj[key] = {
            $addToSet: '$' + aggFields[key]
        }
    })
    return { $group: obj };
}

exports.getFilterQuery = (filters) => {
    let qObj = {};
    Object.keys(filters).forEach(key => {
        if (!["$or"].includes(key) && Array.isArray(filters[key])) {
            if (filters[key].length > 0) {
                qObj[key] = {
                    $in: filters[key]
                }
            }
        } else {
            qObj[key] = filters[key];
        }
    });

    return qObj;
}
exports.getQueryResults = async (Model, params, body, getTotalCount, exclude = "") => {
    let queryObject = {};
    let sortObject = {};
    let size = config.pagination_size;
    let page = 0;
    try {
        if (body) {
            if (body.filters) {
                // queryObject = body.filters;
                queryObject = this.getFilterQuery(body.filters);
            }
            if (body.query) {
                queryObject["$or"] = this.getSearchQuery(body.query, body.searchFields, body.tagsValues);
            }
            if (body.range) {
                let rangeQuery = getRangeQuery(body.range);
                queryObject = { ...queryObject, ...rangeQuery };
            }
        }
        let totalCountQuery = queryObject;
        if (params) {
            if (params.sortField && params.sortOrder) {
                if (Array.isArray(params.sortField) && params.sortOrder.length == params.sortField.length) {
                    params.sortField.forEach((field, index)=>{
                        sortObject[field] = constants.sortOrder[params.sortOrder[index]];
                    })
                } else {
                    sortObject[params.sortField] = constants.sortOrder[params.sortOrder];
                }
            }

            if (params.size) {
                size = (typeof params.size === "string") ? parseInt(params.size) : params.size;
            }
            if (params.page) {
                page = (typeof params.page === "string") ? parseInt(params.page) : params.page;
            }
        }
        // logger.info("Query is : " + JSON.stringify(queryObject))
        // logger.info("sortObject is : " + JSON.stringify(sortObject))

        let queryResult = {}, aggregations = {};
        if (params && params.size) {
            // logger.info("page is : " + size)
            // logger.info("size is : " + page)
            if (exclude && exclude.length > 0) {
                queryResult = await Model.find(queryObject).collation({ locale: "en" }).select(exclude).sort(sortObject).limit(size).skip(size * page);
            } else {
                queryResult = await Model.find(queryObject).collation({ locale: "en" }).sort(sortObject).limit(size).skip(size * page);
            }
            if (body?.aggs) {
                aggregations = await Model.aggregate([{ $match: queryObject }, getAggregationsQuery(body.aggs)]);
            }
        } else {
            if (exclude && exclude.length > 0) {
                queryResult = await Model.find(queryObject).collation({ locale: "en" }).select(exclude).sort(sortObject);
            } else {
                queryResult = await Model.find(queryObject).collation({ locale: "en" }).sort(sortObject);
            }
        }
        if (getTotalCount) {
            let totalCount = await Model.countDocuments(totalCountQuery);
            // console.log("Query : ", aggregations)
            return {
                results: queryResult,
                total: totalCount,
                aggregations
            }
        }
        return queryResult
    } catch (error) {
        logger.error(error)
        throw responseHelper.createCustomResponse(500, error.message || responseMessages.fetchFailed);
    }
}

exports.getAggregateQueryResults = async (Model, params, body, getTotalCount) => {
    let queryObject = {};
    let sortObject = {};
    let aggregateQuery = [];
    let size = config.pagination_size;
    let page = 0;
    try {
        if (body) {
            if (body.filters) {
                queryObject = this.getFilterQuery(body.filters);
            }
            if (body.query) {
                queryObject["$or"] = this.getSearchQuery(body.query, body.searchFields, body.tagsValues);
            }
            if (body.range) {
                let rangeQuery = getRangeQuery(body.range);
                queryObject = { ...queryObject, ...rangeQuery };
            }
        }

        if (params) {
            if (params.sortField && params.sortOrder) {
                sortObject[params.sortField] = constants.sortOrder[params.sortOrder];
            }

            if (params.size) {
                size = (typeof params.size === "string") ? parseInt(params.size) : params.size;
            }
            if (params.page) {
                page = (typeof params.page === "string") ? parseInt(params.page) : params.page;
            }
        }

        if (body.sortFields) {
            sortObject = { ...body.sortFields, ...sortObject };
        }

        if (body.unwind) {
            aggregateQuery = [...body.unwind];
        }

        aggregateQuery.push({ $match: queryObject });
        if (body.addFields) {
            aggregateQuery.push({ $addFields: body.addFields });
        }
        aggregateQuery.push({ $sort: sortObject });
        aggregateQuery.push({ $skip: page * size });
        aggregateQuery.push({ $limit: size });

        let queryResult = await Model.aggregate(aggregateQuery);
        if (getTotalCount) {
            let totalCount = await Model.countDocuments(queryObject);
            return {
                results: queryResult,
                total: totalCount,
                aggregations: {}
            }
        }
        return queryResult;
    } catch (error) {
        logger.error(error);
        throw responseHelper.createCustomResponse(500, error.message || responseMessages.fetchFailed);
    }
}