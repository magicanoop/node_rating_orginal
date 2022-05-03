const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('00refProgram'),
            name: "referralProgram",
            label: "Referral Program",
            description: "Referral Program"
        }
    ]
}();