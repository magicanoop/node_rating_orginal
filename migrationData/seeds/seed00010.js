const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('000liveClass'),
            parentId: mongoose.Types.ObjectId('0000000class')
        }
    ]
}();