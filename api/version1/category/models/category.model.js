const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {   
        title: {
            type: String,
            required: true,
            unique: true
        },
        code: {
            type: String,
            required: true,
            unique: true
        },
        parentId: {
            type: String,
            default: ""
        },
        imageUrl: {
            type: String
        },
        isHome: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);