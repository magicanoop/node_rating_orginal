const mongoose = require("mongoose");


const contentResourcePoolSchema = new mongoose.Schema(
    {
        instituteId: {
            type: String
        },
        contentType: {
            type: String,
            enum: ["video", "note"]
        },
        guid: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        duration: {
            type: Number
        },
        quality: {
            type: String
        },
        title: [
            {
                languageId: String,
                value: String
            }
        ],
        description: {
            type: String,
            default: null
        },
        thumbnail: {
            type: String
        },
        tags: {
            type: Array
        },
        categories: {
            type: Array
        },
        subjects: {
            type: Array
        },
        faculties: {
            type: Array
        },
        createdBy: {
            type: String
        },
        updatedBy: {
            type: String
        }
    },
        
    { timestamps: true }
);

contentResourcePoolSchema.method("toJSON", function () {
    const { __v, title, ...object } = this.toObject();
    object.title = title[0] ? title[0]?.value : "";
    return object;
});

module.exports = mongoose.model("content_resource_pool", contentResourcePoolSchema);