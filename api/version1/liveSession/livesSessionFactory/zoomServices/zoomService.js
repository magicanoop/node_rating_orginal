const { LiveSessionServices } = require("../liveSessionServices");
const moment = require('moment');

class ZoomServices extends LiveSessionServices {

    constructor(zoomClient, defaultMeetingSetting) {
        super();
        this.zoomClient = zoomClient;
        this.defaultMeetingSetting = defaultMeetingSetting;
    }

    getUserDetails(email) {
        let path = `users/${email}`;
        let params = { status: 'active' };
        return this.zoomClient.service.get(path, { params })
    };

    getUserSettings(userId) {
        let path = `users/${userId}/settings`;
        return this.zoomClient.service.get(path)
    };

    createMeetingForAUser(userId, body) {
        if (!body.settings) {
            body.settings = this.defaultMeetingSetting
        }
        let path = `users/${userId}/meetings`;
        return this.zoomClient.service.post(path, { body })
    }

    createMeetingPayload(meeting, userId) {
        let obj = {
            "timezone": "Asia/Calcutta",
            "password": "123456",
            "settings": {
                join_before_host: false,
                jbh_time: 0,
                auto_recording: "cloud"
            }
        }
        if (meeting.startDateTime)
            obj["start_time"] = moment(meeting.startDateTime).format('yyyy-MM-DDTHH:mm:ss');
        if (userId)
            obj["schedule_for"] = userId;
        if (meeting.description)
            obj["agenda"] = meeting.description;
        if (meeting.duration)
            obj["duration"] = meeting.duration; 
        return obj
    }

    updateMeeting(meetingId, body) {
        let path = `meetings/${meetingId}`;
        return this.zoomClient.service.patch(path, body)
    }

    getMeeting (meetingId) {
        let path = `meetings/${meetingId}`;
        return this.zoomClient.service.get(path)
    }

    deleteMeeting (meetingId) {
        let path = `meetings/${meetingId}`;
        return this.zoomClient.service.delete(path)
    }

}

module.exports = {
    ZoomServices
}