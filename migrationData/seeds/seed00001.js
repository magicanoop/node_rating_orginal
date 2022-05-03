const config = require('config');
const mongoose = require('mongoose');

module.exports = function () {
    return [
        {
            _id: new mongoose.Types.ObjectId("00superadmin"),
            name: "super_admin",
            description: "Super-Admin",
            islocked: true,
            label: "Super Admin",
            higherOrder: true
        },
        {
            _id: new mongoose.Types.ObjectId("0000000admin"),
            name: "admin",
            description: "Admin",
            islocked: false,
            label: "Admin",
            higherOrder: true
        },
        {
            _id: new mongoose.Types.ObjectId("000institute"),
            name: "institute",
            description: "Institute",
            islocked: false,
            label: "Institute",
            higherOrder: true
        },
        {
            _id: new mongoose.Types.ObjectId("00000faculty"),
            name: "faculty",
            description: "Faculty",
            islocked: true,
            label: "Faculty",
            higherOrder: true
        },
        {
            _id: new mongoose.Types.ObjectId("00000student"),
            name: "student",
            description: "Student",
            islocked: true,
            label: "Student",
            higherOrder: true
        },
    ];
}();
