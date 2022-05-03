const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('000000doubts'),
            name: "doubts",
            label: "Doubts",
            description: "Doubts",
            parentId: mongoose.Types.ObjectId('interactions')
        },
        {
            _id: mongoose.Types.ObjectId('0000comments'),
            name: "comments",
            label: "Comments",
            description: "Comments",
            parentId: mongoose.Types.ObjectId('interactions')
        }
    ]
}();