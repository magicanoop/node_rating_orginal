const mongoose = require('mongoose');

module.exports = function () {
    return [
        {
            _id: new mongoose.Types.ObjectId("00000faculty"),
            islocked: false
        }
    ];
}();
