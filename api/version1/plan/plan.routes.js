const express = require('express');
const router = express.Router();
const {
   add,
   update,
   deletePlan,
   list,
   view
} = require('./plan.controller');
const planValidate = require('../../../validators/plan.validation');
const makeCallback = require('../../express-callback');

router.post('/', planValidate.planCreateValidation, makeCallback(add));
router.put('/:id',planValidate.planUpdateValidation,makeCallback(update));
router.delete('/:id',planValidate.planDeleteValidation, makeCallback(deletePlan));
router.get('/list/:courseModuleId', makeCallback(list))
router.get('/view/:id', makeCallback(view));

module.exports = router; 