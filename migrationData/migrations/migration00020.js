const Language = require('../../api/version0/models/index').language;
const config = require('config');

// execution function
function execute() {
    return new Promise(async (resolve, reject) => {
        let existingLanguage = await Language.findOne({ name: config.defaultLanguage.name })
        if (existingLanguage) {
            resolve()
        } else {
            const newLanguage = new Language(config.defaultLanguage);
            newLanguage.save()
                .then(resolve())
                .catch((e) => reject(e))
        }
    });
}

module.exports = {
    execute
};