const mongoose = require('mongoose');

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('0contentPool'),
            name: "contentPool",
            label: "Content Resource Pool",
            description: "Content Resource Pool"
        }
    ]
}();