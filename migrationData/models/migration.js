const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var migrationSchema = Schema({
    fileName: {
        type: String,
        required: true
    },
    batch: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Migration', migrationSchema, 'migrations');