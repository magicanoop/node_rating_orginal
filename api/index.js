const router = require('express').Router();


// version0 folder

router.use('/v1/rating', require('./version0/routes/rating.routes'));
router.use('/v1/user', require('./version0/routes/user.routes'));


module.exports = router;