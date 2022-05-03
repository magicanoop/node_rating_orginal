const mongoose = require("mongoose");

const {
    VIDEO,
    NOTE,
    TEST,
    LIVE,
    RECORDED
} = require('../../../../utils/enums');

const scheduleSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    contentId: {
        type: String,
        required: true
    }
});

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [VIDEO, NOTE, TEST, LIVE, RECORDED]
    },
    description: {
        type: String,
        required: true
    },
    faculty: [{
        type: String
    }],
    imageUrl: {
        type: String,
        required: true
    },
    contentId: {
        type: String,
        required: true
    },
    likeCount: {
        type: Number,
        default: 0
    },
    shareCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const titleSchema = new mongoose.Schema({
    contents: [
        {
            type: contentSchema,
            required: true
        }
    ],
    title: {
        type: String,
        trim: true,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    tags: [{
        type: String
    }],
    titles: [
        {
            type: titleSchema,
            required: true
        }
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
});

const sectionSchema = new mongoose.Schema({
    chapters: [
        {
            type: chapterSchema,
            required: true
        }
    ],
    title: {
        type: String,
        trim: true,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const subjectSchema = new mongoose.Schema({
    sections: [
        {
            type: sectionSchema,
            required: true
        }
    ],
    title: {
        type: String,
        trim: true,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const courseCurriculumSchema = new mongoose.Schema(
    {
        courseModuleId: {
            type: String,
            required: true
        },
        sectionsCount: {
            type: Number,
            default: 0
        },
        lecturesCount: {
            type: Number,
            default: 0
        },
        notesCount: {
            type: Number,
            default: 0
        },
        testsCount: {
            type: Number,
            default: 0
        },
        totalLengthInMinutes: {
            type: Number,
            default: 0
        },
        subjects: [
            {
                type: subjectSchema,
                required: true
            }
        ],
        schedules: [
            {
                type: scheduleSchema,
                required: true
            }
        ],
        isPreview: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CourseCurriculum", courseCurriculumSchema);