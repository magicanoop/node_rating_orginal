const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('0000000class'),
            name: "class",
            label: "Class",
            description: "Class"
        },
        {
            _id: mongoose.Types.ObjectId('0000000batch'),
            name: "batch",
            label: "Batch",
            description: "Batches",
            parentId: mongoose.Types.ObjectId('0000000class')
        }
    ]
}();