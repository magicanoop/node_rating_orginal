const data = require("../seeds/seed00019");
const User = require('../../api/version0/models/index').users;
const config = require('config');

// execution function
function execute() {
    return new Promise(async (resolve, reject) => {
        let existingUser = await User.findOne({ emailId: config.admin.email })
        if (existingUser) {
            resolve()
        } else {
            const newAdmin = new User(data);
            newAdmin.setPassword(process.env.ADMIN_PASSWORD || config.admin.password);
            newAdmin.save()
                .then(resolve())
                .catch((e) => reject(e))
        }
    });
}

module.exports = {
    execute
};