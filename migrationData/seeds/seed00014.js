const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('interactions'),
            name: "interactions",
            label: "Interactions",
            description: "Interactions"
        }
    ]
}();