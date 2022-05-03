
const data = require("../seeds/seed00001");
const Roles = require("../../api/version0/models").roles;

// execution function
function execute() {
    return new Promise((resolve, reject) => {
        var roles = []
        data.forEach(element => {
            roles.push(new Roles(element).save())
        })
        Promise.all(roles)
            .then(resolve())
            .catch((e) => reject(e))
    });
}

module.exports = {
    execute
};