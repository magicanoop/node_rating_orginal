const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const licenceSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            uniqueCaseInsensitive: true
        },
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdByUser: String,
        updatedByUser: String,
        capacity: {
            type: Number,
            default: 0
        },
        availableMaxMeetingDuration: {
            type: Number,
            default: 0
        },
        zoomUserInfo: {
            type: Object
        },
        canRecord: {
            type: Boolean,
            default: true
        },
        zoomUserId: {
            type: String,
            trim: true,
        }
    },
    { timestamps: true }
);

licenceSchema.plugin(uniqueValidator, { message: `License already exists.` });

licenceSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});


module.exports = mongoose.model("Licence", licenceSchema);