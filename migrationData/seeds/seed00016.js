const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('0000feedback'),
            name: "feedback",
            label: "Feedback",
            description: "Feedback"
        }
    ]
}();