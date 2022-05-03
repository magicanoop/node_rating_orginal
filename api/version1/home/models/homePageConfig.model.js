const config = require('config');
const mongoose = require("mongoose");

var schema = mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    categoryId: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        default: 0
    },
    isVisible: {
        type: Boolean,
        default: true,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    type : {
        type : String,
        enum : config.homePage.types
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("home_page_configuration", schema);