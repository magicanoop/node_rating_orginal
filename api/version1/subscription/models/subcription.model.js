const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        planId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        curriculumId: {
            type: String,
            required: true,
        },
        courseId: {
            type: String,
            required: true,
        },
        planStartDate: {
            type: Date,
            required: true,
        },
        planEndDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("subscriptions", subscriptionSchema);