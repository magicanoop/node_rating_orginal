const mongoose = require('mongoose');

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('000000coupon'),
            name: "coupon",
            label: "Coupons",
            description: "Coupons module",
        },
    ];
}();