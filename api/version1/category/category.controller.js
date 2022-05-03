const {
    addCategory,
    updateCategory,
    deleteCategoryById,
    listCategory,
    addCategoryGroup,
    updateCategoryGroup,
    deleteCategoryGroupById,
    listCategoryGroups,
    listMinimalCategory
} = require('./category.service');

exports.add = async (httpRequest) => {
    const { body } = httpRequest;
    const created = await addCategory(body);

    return {
        statusCode: 201,
        data: { created },
        message: 'Category added successfully'
    }
}

exports.update = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await updateCategory(params.id, body);

    return {
        statusCode: 200,
        data: { created },
        message: 'Category updated successfully'
    }
}

exports.deleteCategory = async (httpRequest) => {
    const data = await deleteCategoryById(httpRequest.params.id);
    return {
        statusCode: 200,
        data,
        message: 'Category deleted successfully'
    }
}

exports.list = async (httpRequest) => {
    const { body, query } = httpRequest;
    const result = await listCategory({ ...body, ...query });
    return {
        statusCode: 200,
        data: result,
        message: 'Categories Retrived successfully'
    }
}

exports.listSubCategories = async (httpRequest) => {
    const { body, query, params } = httpRequest;
    if(!body.filters){
        body.filters={}
    }
    body.filters.parentId = params.parentId;
    const result = await listCategory({ ...body, ...query });
    return {
        statusCode: 200,
        data: result,
        message: 'Sub categories Retrived successfully'
    }
}

exports.listMinimalData = async (httpRequest) => {
    const { body, query } = httpRequest;
    body.select = 'title _id';
    const result = await listMinimalCategory({ ...body, ...query });
    return {
        statusCode: 200,
        data: result,
        message: 'Categories Retrived successfully'
    }
}

exports.addCategoryGroup = async (httpRequest) => {
    const { body } = httpRequest;
    const created = await addCategoryGroup(body);

    return {
        statusCode: 201,
        data: { created },
        message: 'Category Group added successfully'
    }
}

exports.updateCategoryGroup = async (httpRequest) => {
    const { params, body } = httpRequest;
    const created = await updateCategoryGroup(params.id, body);

    return {
        statusCode: 200,
        data: { created },
        message: 'Category Group updated successfully'
    }
}

exports.deleteCategoryGroup = async (httpRequest) => {
    await deleteCategoryGroupById(httpRequest.params.id);
    return {
        statusCode: 200,
        message: 'Category Group deleted successfully'
    }
}

exports.getCategoryGroupsByParentId = async (httpRequest) => {
    const { body, query, params } = httpRequest;
    if(!body.filters){
        body.filters={}
    }
    body.filters.parentId = params.parentId;
    const result = await listCategoryGroups({ ...body, ...query });
    return {
        statusCode: 200,
        data: result,
        message: 'Data Retrived successfully'
    }
}

exports.listParentGroups = async (httpRequest) => {
    const { body, query } = httpRequest;
    if(!body.filters){
        body.filters={}
    }
    body.filters.parentId= "" ;
    const result = await listCategoryGroups({ ...body, ...query });
    return {
        statusCode: 200,
        data: result,
        message: 'Data Retrived successfully'
    }
}