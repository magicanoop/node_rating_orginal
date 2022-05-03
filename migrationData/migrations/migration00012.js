const data = require("../seeds/seed00012");
const Module = require('../../api/version0/models').modules;

// execution function
function execute() {
    return new Promise((resolve, reject) => {
        var modules = [];
        data.forEach(element => {
            const module = new Module(element);
            modules.push(module.save());
        });
        Promise.all(modules)
            .then(resolve())
            .catch((e) => reject(e));
    });
}

module.exports = {
    execute
};