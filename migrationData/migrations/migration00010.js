const data = require("../seeds/seed00010");
const Module = require('../../api/version0/models').modules;

async function update() {
    try {
        var modules = [];
        await timeout(1000);
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let module = await Module.findById(element._id);
            module.parentId = element.parentId;
            modules.push(await module.save());
        }
        return modules;
    } catch (error) {
        throw error;
    }
}

// execution function
function execute() {
    return new Promise((resolve, reject) => {
        update()
            .then(resolve())
            .catch((e) => reject(e));
    });

}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    execute
};