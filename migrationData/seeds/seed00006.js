const config = require('config');
const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('00000faculty'),
            name: "faculty",
            label: "Faculty",
            description: "Faculty module",
        },
    ]
}()