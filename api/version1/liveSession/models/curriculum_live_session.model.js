const mongoose = require("mongoose");

const {
    ZOOM
} = require('../../../../utils/enums');

const liveSessionDetailsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    startUrl: {
        type: String,
        required: true
    },
    joinUrl: {
        type: String,
        required: true
    },
    password: {
        type: String
    }
});

const courseCurriculumLiveSessionSchema = new mongoose.Schema(
    {
        facultyId: {
            type: String,
            required: true
        },
        courseId: {
            type: String,
            required: true
        },
        startDateTime: {
            type: Date,
            required: true
        },
        endDateTime: {
            type: Date,
        },
        imageUrl: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        liveSessionDetails: {
            type: liveSessionDetailsSchema
        },
        serviceProvider: {
            type: String,
            enums: [ZOOM]
        },
        curriculumId: {
            type: String,
            required: true
        },
        zoomUserId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        instituteId: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("course_curriculum_live_session", courseCurriculumLiveSessionSchema);