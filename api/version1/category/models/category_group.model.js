const mongoose = require("mongoose");

const {
    MEMBER_CATEGORIES_LIMIT
} = require("../../../../config/config");

const categoryGroupSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        parentId: {
            type: String,
            default: ""
        },
        memberCategories: [
            {
                type: String,
                required: true
            }
        ],
        imageUrl: {
            type: String
        }
    },
    { timestamps: true }
);

categoryGroupSchema.path('memberCategories').validate(function (value) {
    if (value.length > MEMBER_CATEGORIES_LIMIT) {
        throw new Error(`Assigned member categories size can't be greater than ${MEMBER_CATEGORIES_LIMIT}!`);
    }
});

module.exports = mongoose.model("CategoryGroup", categoryGroupSchema);