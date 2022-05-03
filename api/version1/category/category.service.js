const CategoryModel = require('./models/category.model');
const CategoryGroupModel = require('./models/category_group.model');
const makeCategoryDb = require('./DAO/categoryDAO');
const makeCategoryGroupDb = require('./DAO/categoryGroupDAO');
const { NotFoundError } = require('../../../utils/api_error_util');
const CategoryDb = makeCategoryDb({ CategoryModel });
const CategoryGroupDb = makeCategoryGroupDb({ CategoryGroupModel });
const BuildQueryRequest = require('./../../queryBuilder');
const buildQueryRequest = new BuildQueryRequest(require("regex-escape"), { asc: 1, desc: -1 });

const addCategory = (details) => {
    return CategoryDb.insert(details);
}

const updateCategory = async (id, details) => {
    const response = CategoryDb.update(id, details);
    if (!response) {
        throw new NotFoundError(`Category not found`)
    }
    return response
}

const deleteCategoryById = async (id) => {
    const response = CategoryDb.remove(id);
    if (!response) {
        throw new NotFoundError(`Category not found`)
    }
    return response
}

const listCategory = async (searchParams) => {
    let searchRequest = await  buildQueryRequest(searchParams);
    const response =  await CategoryDb.list(searchRequest);
    const parentIds = response.results.map(result => result._id);
    const subCategories =  await CategoryDb.findByCondition({"parentId": { $in: parentIds } });

    response.results = response.results.map((parentCategory) => {
        const selectedSubCategories = subCategories.results.filter(category => category.parentId == parentCategory._id);
        return {
            ...parentCategory.toObject(),
            subCategories: selectedSubCategories||[]
        };
    });
    
    return response;
}

const moduleTitleValidator = (title) => {
    return CategoryDb.findByTitle(title);
}

const addCategoryGroup = (details) => {
    return CategoryGroupDb.insert(details);
}

const updateCategoryGroup = async (id, details) => {
    const response = CategoryGroupDb.update(id, details);
    if (!response) {
        throw new NotFoundError(`Category Group not found`)
    }
    return response
}

const deleteCategoryGroupById = async (id) => {
    const response = CategoryGroupDb.remove(id);
    if (!response) {
        throw new NotFoundError(`Category Group not found`)
    }
    return response
}

const getGroupDetails = async (groups) => {
    let categoryIds = [];
    groups.forEach(group => {
        group.memberCategories?.forEach(category => {
            categoryIds.push(category)
        })
    });
    let searchRequest = buildQueryRequest({ filters: { _id: { $in: categoryIds } }, select: 'title' });
    let categories = await CategoryDb.list(searchRequest);
    let newResults = groups.map((group) => {
        group = group.toObject()
        let categoryList = [];
        if (categories.results && categories.results.length) {
            let categoryDetails = []
            categories.results.map(category => {
                group.memberCategories.map(e => {
                    if (category._id == e) {
                        categoryDetails.push({ title: category.title, id: category._id })
                    }
                })
            });
            categoryList = categoryDetails
        }
        group.categories = categoryList;
        return group;
    });
    return newResults;
}

const listCategoryGroups = async (searchParams) => {
    let searchRequest = buildQueryRequest(searchParams);
    const groups = await CategoryGroupDb.list(searchRequest);
    let detailedResults = await getGroupDetails(groups.results);
    return {
        results: detailedResults,
        total: groups.total
    }
}

const categoryGroupTitleValidator = async (title, id = null) => {
    const response = await CategoryGroupDb.findByTitle(title);
    if (response && id && response._id != id) {
        throw new Error(`Title already exists`);
    }
    if (response && !id) {
        throw new Error(`Title already exists`);
    }
    return;
}

const getCateriesForCourses = async (categoryIds) => {
    let Ids = [];
    categoryIds.map(category => {
        if (Array.isArray(category)) {
            category.map(cat => {
                Ids.push(cat)
            })
        } else {
            Ids.push(category)
        }
    })
    let searchRequest = buildQueryRequest({ filters: { _id: { $in: Ids } } });
    const response = CategoryDb.findAllById(searchRequest);
    return response
}

const listMinimalCategory = async (searchParams) => {
    let searchRequest = await  buildQueryRequest(searchParams);
    const response =  await CategoryDb.list(searchRequest);   
    return response;
}

module.exports = {
    addCategory,
    updateCategory,
    deleteCategoryById,
    listCategory,
    moduleTitleValidator,
    addCategoryGroup,
    updateCategoryGroup,
    deleteCategoryGroupById,
    listCategoryGroups,
    categoryGroupTitleValidator,
    getCateriesForCourses,
    listMinimalCategory
}