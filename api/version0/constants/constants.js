module.exports = {
    sortOrder: {
        asc: 1,
        desc: -1
    },
    defaultMeetingSetting: {
        "host_video": true,
        "participant_video": false,
        "cn_meeting": false,
        "in_meeting": true,
        "join_before_host": true,
        "mute_upon_entry": false,
        "watermark": true,
        "use_pmi": false,
        "approval_type": 2,
        // "registration_type": "integer",
        "audio": "both",
        "auto_recording": false,
        "alternative_hosts": "",
        "global_dial_in_countries": [],
        "registrants_email_notification": true
    },
    zoomMeetingTypes: {
        daily: 1,
        weekly: 2,
        monthly: 3
    },
    zoomMeetingDays: {
        sunday: "1",
        monday: "2",
        tuesday: "3",
        wednesday: "4",
        thursday: "5",
        friday: "6",
        saturday: "7"
    },
    notificationMessageTypes: {
        promotional: 100,
        mandatory: 1
    },
    notificationPriority: {
        low: 0,
        medium: 1,
        high: 1000
    },
    "userFieldWeightage": {
        "phoneNumber": 25,
        "name": 25,
        "emailId": 25,
        "imageUrl": 25
    }
}