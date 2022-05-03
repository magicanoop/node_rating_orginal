module.exports = function buildQueryRequest(RegexEscape, sortConfig) {

    function createFilterQuery(filterOptions) {
        let filterKeys = Object.keys(filterOptions);
        let filters = {};
        filterKeys.forEach(filterBy => {
            if (Array.isArray(filterOptions[filterBy]) && filterOptions[filterBy].length > 0) {
                filters[filterBy] = { $in: filterOptions[filterBy] }
            } else {
                filters[filterBy] = filterOptions[filterBy];
            }
        })
        return filters;
    }

    function createRangeQuery(rangeObjs) {
        let rangeQuery = {};
        Object.keys(rangeObjs).forEach(field => {
            let rangeObj = rangeObjs[field];
            let fieldQuery = {};
            if (rangeObj.gte) {
                fieldQuery["$gte"] = rangeObj.gte;
            }
            if (rangeObj.lt) {
                fieldQuery["$lt"] = rangeObj.lt;
            }
            if (rangeObj.gt) {
                fieldQuery["$gt"] = rangeObj.gt;
            }
            if (rangeObj.lte) {
                fieldQuery["$lte"] = rangeObj.lte;
            }
            rangeQuery[field] = fieldQuery;
        });
        return rangeQuery;
    }

    function createSearchQuery(text, fields) {
        let conditions = [];
        fields.forEach(field => {
            conditions.push({
                [field]: {
                    $regex: RegexEscape(text),
                    $options: "i"
                }
            })
        });
        return conditions;
    }


    function createSortQuery(sortObj) {
        let sortFields = Object.keys(sortObj);
        let sortQuery = {};
        sortFields.forEach(field => {
            sortQuery[field] = sortConfig[sortObj[field]]
        })
        sortQuery._id = 1
        return sortQuery;
    }

    return function makeQueryRequest({
        filters,
        range,
        query,
        searchFields,
        sort,
        select,
        page,
        size
    } = {}) {

        let textSearchConditions = [];
        let pagination = {};

        if (filters) {
            filters = createFilterQuery(filters);
        }
        if (range) {
            range = createRangeQuery(range);
        }

        if (query) {
            if (!searchFields) {
                throw new Error("Please provide search fields along with search query");
            }
            if (query != "") {
                textSearchConditions = createSearchQuery(query, searchFields)
            }
        }

        if (sort) {
            sort = createSortQuery(sort);
        }

        if (select) {
            if (select.length < 1) {
                throw new Error("Please provide select fields");
            }
        }

        if (size) {
            size = (typeof size === "string") ? parseInt(size) : size;
            pagination["limit"] = size;
        }

        if (page) {
            page = (typeof page === "string") ? parseInt(page) : page;
            pagination["skip"] = page * size;
        }

        function createFindQuery() {
            let query = {};
            if (filters) {
                query = { ...filters }
            }
            if (range) {
                query = { ...query, ...range }
            }
            if (textSearchConditions && textSearchConditions.length > 0) {
                query = { ...query, $or: textSearchConditions }
            }
            return query;
        }

        return Object.freeze({
            getFilters: () => filters,
            getRangeQuery: () => range,
            getTextSearchQuery: () => textSearchConditions,
            getSortQuery: () => sort,
            getSelect: () => select,
            getPaginationDetails: () => pagination,
            getFindQuery: () => createFindQuery()
        })
    }
}
