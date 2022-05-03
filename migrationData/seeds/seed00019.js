const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('0000000admin'),
            emailId: process.env.ADMIN_EMAIL || config.admin.email,
            password: process.env.ADMIN_PASSWORD || config.admin.password,
            name: process.env.ADMIN_NAME || config.admin.name,
            role: 'super_admin',
            isActive: true,
            phoneNumber: process.env.ADMIN_PHONE || config.admin.phone
        }
    ]
}();