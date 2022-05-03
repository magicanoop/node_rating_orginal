const config = require('config');
const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: new mongoose.Types.ObjectId('00000000home'),
            name: "home",
        },
        {
            _id: new mongoose.Types.ObjectId('000000course'),
            name: "course",
        },
        {
            _id: new mongoose.Types.ObjectId('00000000plan'),
            name: "plan",
        },
        {
            _id: new mongoose.Types.ObjectId('00curriculum'),
            name: "curriculum",
        },
        {
            _id: new mongoose.Types.ObjectId('0000category'),
            name: "category",
        },
        {
            _id: new mongoose.Types.ObjectId('0institution'),
            name: "institution",
        },
        {
            _id: new mongoose.Types.ObjectId('00000000user'),
            name: "user",
        },
        {
            _id: new mongoose.Types.ObjectId('000000banner'),
            name: "banner",
        },
        {
            _id: new mongoose.Types.ObjectId('0000sContent'),
            name: "singleContent",
        },
        {
            _id: new mongoose.Types.ObjectId('00000subject'),
            name: "subjects",
        },
        {
            _id: new mongoose.Types.ObjectId('00000000test'),
            name: "test",
        },
        {
            _id: new mongoose.Types.ObjectId('000liveClass'),
            name: "liveClass",
        },
        {
            _id: new mongoose.Types.ObjectId('000languages'),
            name: "language",
        },
        {
            _id: new mongoose.Types.ObjectId('0000000roles'),
            name: "role",
        }
    ]
}()