const config = require('config');
const mongoose = require('mongoose');

module.exports = function () {
    return [
        {
            _id: new mongoose.Types.ObjectId("00superadmin"),
        },
        {
            _id: new mongoose.Types.ObjectId("0000000admin"),
        },
        {
            _id: new mongoose.Types.ObjectId("000institute"),
        },
        {
            _id: new mongoose.Types.ObjectId("00000faculty"),
        },
        {
            _id: new mongoose.Types.ObjectId("00000student"),
        },
    ];
}();
