const mongoose = require("mongoose");

const {
    FREE,
    LIVE,
    PREMIUM,
    RECORDED,
    POINT
} = require('../../../../utils/enums');
const {
    COURSE_NAME_LIMIT
} = require('../../../../config/config');

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: [POINT],
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const courseMasterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            maxlength: COURSE_NAME_LIMIT,           
        },
        instituteId: {
            type: String,
            required: true
        },
        mainCategories: [{
            type: String,
            required: true
        }],
        subCategories: [{
            type: String,
            required: true
        }],
        hasLive: {
            type: Boolean,
            default: false
        },
        hasRecorded: {
            type: Boolean,
            default: false
        },
        courseModules: [
            {
                type: {
                    type: String,
                    enums: [FREE, PREMIUM, LIVE, RECORDED]
                },
                moduleId: {
                    type: String
                }
            }
        ],
        isActive: {
            type: Boolean,
            default: true
        },
        location: {
            type: locationSchema
        },
        country: { type: String , default : "india"},
        state: { type: String , default: "kerala"}
    },
    { timestamps: true }
);

module.exports = mongoose.model("CourseMaster", courseMasterSchema);