const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
    {
        courseMasterId: {
            type: String,
        },
        courseModuleId: {
            type: String,
        },
        courseCurriculumId: {
            type: String,
        },
        name: {
            type: String,
        },
        duration: {
            type: Number
        },
        price: {
            type: Number,
        },
        avgRating: {
            type: Number,
        },
        isExclusiveTax: {
            type: Boolean,
            default:true
        },
        tax: {
            cgst: {
                type:Number
            },
            sgst: {
                type:Number
                }
        },
        isCustom: {
            type: Boolean,
        },
        isActive: {
            type: Boolean,
            default:true
        },
        createdByUser: {
            type: String,
        },
        updatedByUser: {
            type: String,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("course_plans", planSchema);