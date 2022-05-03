const { ZoomAPIClient } = require("./zoomServices/zoomClient");
const { ZoomServices } = require("./zoomServices/zoomService");
const axios = require('axios');
const { ZOOM_REST_API } = require('./../../../../config/config');
const { defaultMeetingSetting } = require("../../../../constants/constants");

class LiveSessionsFactory {

    constructor(zoomConfig) {
        this.zoomConfig = zoomConfig;
    }

    getLiveSessionServices(type) {
        if (type == "zoom") {
            // let token = this.zoomConfig.getToken();
            let zoomClient = new ZoomAPIClient(this.zoomConfig, axios, ZOOM_REST_API)
            return new ZoomServices(zoomClient, defaultMeetingSetting);
        }
    }
}

module.exports = {
    LiveSessionsFactory
}