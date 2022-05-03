var mammoth = require("mammoth");
const cheerio = require('cheerio');
const fs = require("fs");
const cheerioTableparser = require('cheerio-tableparser');
const utils = require('./../../version0/utils/utils');

var options = {
    convertImage: mammoth.images.imgElement(function (image) {
        return image.read("base64").then(function (imageBuffer) {            
            return {
                src: "data:" + image.contentType + ";base64," + imageBuffer
            };
        });
    })
};

const convertDocToHtml = async (filePAth) => {
    return new Promise((resolve, reject) => {
        mammoth.convertToHtml({ path: filePAth }, options)
            .then(function (result) {
                var text = result.value;
                // let tables = text.split(pattrn)
                const $ = cheerio.load(text)
                cheerioTableparser($);
                data = $("table").parsetable();
                resolve(data)
            })
            .catch(err => {
                reject(err)
            })
            .done();
    })
}

const parseContentFromQuestionFile = async (filePath) => {
    let htmlContent = await convertDocToHtml(filePath);
    let tableList = utils.docContentParser(htmlContent[0], htmlContent[1]);
    let out = {
        testDetails : tableList.splice(0, 1),
        questions : tableList
    }

    if(fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return out

}

module.exports = {
    parseContentFromQuestionFile
   
}