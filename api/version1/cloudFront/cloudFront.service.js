const awsSdk = require('../../../config/awsSdk');
const path = require("path");
const envConfig = require('config');

const cloudFront = new awsSdk.CloudFront.Signer(
  process.env.CF_KEY_PAIR_ID,
  process.env.CF_PRIVATE_KEY
);
const createSignedCookie = async (resourceLink, expiryInMilliSec) => {
    const policy = JSON.stringify({
      Statement: [
        {
          Resource: resourceLink.substring(0, resourceLink.lastIndexOf("/"))+"/*",
          Condition: {
            DateLessThan: {
              'AWS:EpochTime': Math.floor(new Date().getTime() / 1000) + expiryInMilliSec,
            },
          },
        },
      ],
    });
      
    return cloudFront.getSignedCookie({
      policy,
    });
}

const getStreamUrls = (url) => {
  let fileName = path.basename(url).split('.').slice(0, -1).join('.');
  let baseUrl = `${envConfig.cloudFront.url}${envConfig.aws.s3.outputPath}/${fileName}/HLS/`;
  let extension = ".m3u8";
  
  return `${baseUrl}${fileName}${extension}`;
}

module.exports = {
  getStreamUrls,
  createSignedCookie,
}