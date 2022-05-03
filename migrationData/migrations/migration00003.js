
const data = require("../seeds/seed00003");
const Roles = require("../../api/version0/models").roles;

async function update() {
    try {
        var roles = []
        await timeout(1000)
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            role = await Roles.findById(element._id)
            role.label = element.label
            roles.push(role.save())
        }
        return roles
    } catch (error) {
        throw error
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// execution function
function execute() {
    return new Promise((resolve, reject) => {
        update()
            .then(roles => Promise.all(roles))
            .then(resolve())
            .catch((e) => reject(e))
    });

}

module.exports = {
    execute
};