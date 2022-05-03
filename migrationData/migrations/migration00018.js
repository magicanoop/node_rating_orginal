const data = require("../seeds/seed00018");
const HamburgerMenu = require('../../api/version0/models/index').hamburgerMenu;

// execution function
function execute() {
    return new Promise(async (resolve, reject) => {
        var modules = []
        let existingHamburgerMenu = await HamburgerMenu.find();
        if (existingHamburgerMenu.lenght > 0) {
            resolve()
        }
        data.forEach(element => {
            const module = new HamburgerMenu(element)
            modules.push(module.save())
        })
        Promise.all(modules)
            .then(resolve())
            .catch((e) => reject(e))
    });
}

module.exports = {
    execute
};