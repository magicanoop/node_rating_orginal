const mongoose = require("mongoose");


const contentResourceTranscodePoolSchema = new mongoose.Schema(
    {
        instituteId: {
            type: String
        },
        guid: {
            type: String,
            required: true
        },
        contentPoolId: {
            type: String,
            required: true
        },
        url: {
            type: String
        },
        quality: {
            type: String,
            enum: ["120p", "360p", "480p", "720p", "1080p"]
        },
        status: {
            type: String,
            enum: ["initiated", "completed", "failed"]
        },
        progress: {
            type: Number
        },
        fileSize: {
            type: Number
        },
        duration: {
            type: Number
        },
        startedAt: {
            type: Date
        },
        completedAt: {
            type: Date
        }
    },
        
    { timestamps: true }
);

module.exports = mongoose.model("content_resource_pool_transcode", contentResourceTranscodePoolSchema);