const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const contentResourceTranscodePoolSchema = new mongoose.Schema(
    {
        instituteId: {
            type: String,
            default: null
        },
        guid: {
            type: String,
            default: uuidv4
        },
        contentPoolId: {
            type: String,
            default: null
        },
        url: {
            type: String,
            default: null
        },
        fileName: {
            type: String,
            required: true
        },
        contentType: {
            type: String,
            enum: ["video", "note"],
            required: true
        },
        status: {
            type: String,
            enum: ["initiated", "completed", "failed"],
            default: "initiated"
        },
        startedAt: {
            type: Date,
            default: Date.now
        },
        fileChecksum: {
            type: String,
            default: null
        },
        trancodeRequired: {
            type: Boolean,
            default: false
        },
        transcodeQuality: [
            {
                quality: {
                    type: String
                },
                description: {
                    type: String,
                    default: null
                }
            }
        ],
        transcodeFileType: [
            {
                type: {
                    type: String
                },
                extension: {
                    type: String,
                    default: null
                }
            }
        ]
    },
        
    { timestamps: true }
);

module.exports = mongoose.model("content_resource_pool_upload", contentResourceTranscodePoolSchema);