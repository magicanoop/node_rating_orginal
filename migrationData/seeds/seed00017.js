const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('000hamburger'),
            name: "hamburger",
            label: "Hamburger",
            description: "Hamburger"
        }
    ]
}();