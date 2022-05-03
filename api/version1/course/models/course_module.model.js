const mongoose = require("mongoose");

const {
    FREE,
    LIVE,
    PREMIUM,
    RECORDED,
    POINT
} = require('../../../../utils/enums');
const {
    COURSE_NAME_LIMIT,
    DESCRIPTION_LIMIT,
    LEARNING_POINT_LIMIT,
    LEARNING_POINTS_LIMIT,
    TAG_LIMIT,
    TAGS_LIMIT
} = require("../../../../config/config");

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

const courseModuleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: COURSE_NAME_LIMIT
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
        imageUrl: {
            type: String
        },
        moduleType: {
            type: String,
            enums: [LIVE, RECORDED],
            required: true
        },
        planType: {
            type: String,
            required: true,
            enums: [FREE, PREMIUM]
        },
        languages: [{ type: String }],
        subtitleLanguages: [{ type: String }],
        description: {
            type: String,
            required: true,
            maxlength: DESCRIPTION_LIMIT
        },
        learningPoints: [{
            type: String,
            maxlength: LEARNING_POINT_LIMIT
        }],
        avgRating: {
            type: Number,
            default: 0
        },
        totalRatingCount: {
            type: Number,
            default: 0
        },
        tags: [{
            type: String,
            maxlength: TAG_LIMIT
        }],
        location: {
            type: locationSchema
        },
        promotionPoints: {
            type: Number,
            default: 0
        },
        country: { type: String },
        state: { type: String },
        courseMasterId: {
            type: String,
            required: true
        },
        suscribersCount: {
            type: Number,
            default: 0
        },
        startDate: {
            type: Date
        },
        isPrivate: {
            type: Boolean,
            default: false
        },
        isCertified: {
            type: Boolean,
            default: false
        },
        isSponsored: {
            type: Boolean,
            default: false
        },
        isBestSeller: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: false
        },
        relatedCourses: {
            type: Array,
        },
        premiumBenifits: [
            {
                type: String
            }
        ],
        faculties: [
            {
                type: String
            }
        ]
    },
    { timestamps: true }
);

courseModuleSchema.path('learningPoints').validate(function (value) {
    if (value.length > LEARNING_POINTS_LIMIT) {
        throw new Error(`Assigned learning points size can't be greater than ${LEARNING_POINTS_LIMIT}!`);
    }
});

courseModuleSchema.path('tags').validate(function (value) {
    if (value.length > TAGS_LIMIT) {
        throw new Error(`Assigned tags size can't be greater than ${TAGS_LIMIT}!`);
    }
});

module.exports = mongoose.model("CourseModule", courseModuleSchema);