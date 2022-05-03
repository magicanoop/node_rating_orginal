const config = require('config');
const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('00000000home'),
            name: "home",
            label: "Home",
            description: "Home module",
        },
        {
            _id: mongoose.Types.ObjectId('000000course'),
            name: "course",
            label: "Courses",
            description: "Courses",
        },
        {
            _id: mongoose.Types.ObjectId('00000000plan'),
            name: "plan",
            label: "Plans",
            description: "Manage Course Plans",
            parentId: mongoose.Types.ObjectId('000000course')
        },
        {
            _id: mongoose.Types.ObjectId('00curriculum'),
            name: "curriculum",
            label: "Curriculum",
            description: "Manage Course Curriculums",
            parentId: mongoose.Types.ObjectId('000000course')
        },
        {
            _id: mongoose.Types.ObjectId('0000category'),
            name: "category",
            label: "Categories",
            description: "Manage Categories",
        },
        {
            _id: mongoose.Types.ObjectId('0institution'),
            name: "institution",
            label: "Institution",
            description: "Manage Institutions",
        },
        {
            _id: mongoose.Types.ObjectId('00000000user'),
            name: "user",
            label: "Users",
            description: "Manage Users",
        },
        {
            _id: mongoose.Types.ObjectId('000000banner'),
            name: "banner",
            label: "Banner",
            description: "Manage Banners",
        },
        {
            _id: mongoose.Types.ObjectId('0000sContent'),
            name: "single content",
            label: "Single Content",
            description: "Manage Single Content",
        },
        {
            _id: mongoose.Types.ObjectId('00000subject'),
            name: "subject",
            label: "Subject",
            description: "Manage Subjects",
        },
        {
            _id: mongoose.Types.ObjectId('00000000test'),
            name: "test",
            label: "Test",
            description: "Manage tests",
        },
        {
            _id: mongoose.Types.ObjectId('000liveClass'),
            name: "live class",
            label: "Live Class",
            description: "Manage Live Classes"
        },
        {
            _id: mongoose.Types.ObjectId('000languages'),
            name: "languages",
            label: "Languages",
            description: "Manage Languages"
        },
        {
            _id: mongoose.Types.ObjectId('0000000roles'),
            name: "roles",
            label: "Roles",
            description: "Manage Roles"
        }
    ]
}()