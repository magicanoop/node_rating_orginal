const express = require('express');
const router = express.Router();
const {
    add,
    update,
    deleteCategory,
    list,
    listSubCategories,
    listMinimalData,
    addCategoryGroup,
    updateCategoryGroup,
    deleteCategoryGroup,
    getCategoryGroupsByParentId,
    listParentGroups
} = require('./category.controller');
const categoryValidate = require('../../../validators/category.validation');
const makeCallback = require('../../express-callback');

router.post('/', categoryValidate.categoryCreateValidation, makeCallback(add));

router.put('/:id', categoryValidate.categoryUpdateValidation, makeCallback(update));

router.delete('/:id', categoryValidate.categoryDeleteValidation, makeCallback(deleteCategory));

//List categories
router.post('/list', makeCallback(list));

//List categories
router.post('/search', makeCallback(list));

//List contain name and id only 
router.post('/list/minimal', makeCallback(listMinimalData));

//List sub categories 
router.post('/:parentId/sub-categories', categoryValidate.subCategoryListValidation, makeCallback(listSubCategories));

router.post('/group', categoryValidate.categoryGroupCreateValidation, makeCallback(addCategoryGroup));

router.put('/group/:id', categoryValidate.categoryGroupUpdateValidation, makeCallback(updateCategoryGroup));

router.delete('/group/:id', categoryValidate.categoryGroupDeleteValidation, makeCallback(deleteCategoryGroup));

//List parent groups
router.post('/listParentGroups', makeCallback(listParentGroups));

//List sub groups
router.post('/sub-groups/:parentId', categoryValidate.subCategoryListValidation, makeCallback(getCategoryGroupsByParentId));

module.exports = router;