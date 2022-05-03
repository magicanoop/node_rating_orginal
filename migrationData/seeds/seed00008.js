const config = require('config');
const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('00000reports'),
            name: "reports",
            label: "Reports",
            description: "Reports"
        },
        {
            _id: mongoose.Types.ObjectId('00salereport'),
            name: "salereport",
            label: "Sales Report",
            description: "Manage Sales Report",
            parentId: mongoose.Types.ObjectId('00000reports')
        },
        {
            _id: mongoose.Types.ObjectId('prsalereport'),
            name: "prsalereport",
            label: "Pre-sales Report",
            description: "Manage Pre-sales Report",
            parentId: mongoose.Types.ObjectId('00000reports')
        },
        {
            _id: mongoose.Types.ObjectId('00testreport'),
            name: "testreport",
            label: "Test Result Report",
            description: "Manage Test Result Report",
            parentId: mongoose.Types.ObjectId('00000reports')
        }
    ]
}();