const config = require('config');
const mongoose = require('mongoose');

module.exports = function () {
    return [
        {
            _id: new mongoose.Types.ObjectId("00superadmin"),
            label: "Super Admin"
        },
        {
            _id: new mongoose.Types.ObjectId("0000000admin"),
            label: "Admin"
        },
        {
            _id: new mongoose.Types.ObjectId("000institute"),
            label: "Institute"
        },
        {
            _id: new mongoose.Types.ObjectId("00000faculty"),
            label: "Faculty"
        },
        {
            _id: new mongoose.Types.ObjectId("00000student"),
            label: "Student"
        },
    ];
}();
