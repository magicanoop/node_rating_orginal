const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        courseId: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        imageUrl: {
            type: String
        },
        facultyId: {
            type: String,
            default: ""
        },
        avgRating: {
            type: Number,
            default: 0
        },
        ratingCount: {
            type: Number,
            default: 0
        },
        shareCount: {
            type: Number,
            default: 0
        },
        likeCount: {
            type: Number,
            default: 0
        },
        viewersCount: {
            type: Number,
            default: 0
        },
        tags: {
            type: Array,
        },
        description: {
            type: String,
        },
        url: {
            type: String,
        },
        duration: {
            type: Number,
        },
        supportFiles: [{
            type: String,
            enum: ['note', 'test'],
            contentId:String
        }],
        createdByUser: {
            type: String,
            default: ""
        },
        updatedByUser: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("course_curriculum_videos", videoSchema);