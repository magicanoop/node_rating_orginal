const express = require("express");
const router = express.Router();
const {
    addHomePageConfig,
    searchhomePage,
    deletehomePage,
    updatehomePage,
    viewhomePage,
    getVersion
} = require("./home.controller");
const makeCallback = require("../../express-callback");
const { isAdminUser } = require("./../../middlewares/authorizer");
router.get('/version', makeCallback(getVersion));
//create
router.post("/homePageConfig", [isAdminUser], makeCallback(addHomePageConfig));
//list search
router.post("/search", [isAdminUser], makeCallback(searchhomePage)); 
//view by id
router.get("/:id", [isAdminUser], makeCallback(viewhomePage)); 
//update
router.put("/:id", [isAdminUser], makeCallback(updatehomePage));
//delete
router.delete("/:id", [isAdminUser], makeCallback(deletehomePage));


module.exports = router;
