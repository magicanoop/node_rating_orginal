const LiveSessionModel = require('./models/curriculum_live_session.model');
const makeLiveSessionDb = require('./DAO/liveSessionDAO');
const { NotFoundError, BadRequestError } = require('../../../utils/api_error_util');
const { LiveSessionsFactory } = require('./livesSessionFactory');
const zoomConfig = require('./../../../config/zoom');
const moment = require('moment');

const BuildQueryRequest = require('./../../queryBuilder');
const buildQueryRequest = new BuildQueryRequest(require("regex-escape"), { asc: 1, desc: -1 });

const liveSessionDb = makeLiveSessionDb({ LiveSessionModel });
const { listAll } = require('./../licence/licence.service');
const { response } = require('express');
const queryBuilder = require('../../version0/services/queryBuilder.service');
const facultyService = require('../../version0/services/faculty.service');
const instituteService = require('../../version0/services/institute.service');
const CourseModuleModel = require('../course/models/course_module.model');
const makeCourseModelDb = require('../course/DAO/courseModuleDAO');
const courseModuleDb = makeCourseModelDb({ CourseModuleModel });

const notificationManagerService = require('../../version0/services/notificationManagerService');
const inappNotificationHandler = require('../../version0/services/inappNotificationHandler');
const {
    users: Users,
    subscription: Subscription
} = require('../../version0/models');

const getMeetingDetailsObject = (meetingResponse) => {
    return {
        id: meetingResponse.id,
        startUrl: meetingResponse.start_url,
        joinUrl: meetingResponse.join_url,
        password: meetingResponse.password,
    }
}

const addLiveSession = async (details) => {
    let { zoomUserId } = await getAvailableLicenses(details.startDateTime, details.duration);
    let liveSessionsFactory = new LiveSessionsFactory(zoomConfig);
    let liveSessionService = liveSessionsFactory.getLiveSessionServices("zoom");
    let { code, data: meetingResponse, message } = await liveSessionService.createMeetingForAUser(
        zoomUserId,
        liveSessionService.createMeetingPayload(details, zoomUserId)
    );
    if (code != 201) {
        throw new BadRequestError(message)
    }
    details.liveSessionDetails = getMeetingDetailsObject(meetingResponse);
    let endTime = moment(details.startDateTime).add(meetingResponse.duration, "minutes");
    details.endDateTime = endTime;
    const response = await liveSessionDb.insert({ ...details, zoomUserId });
    return response;
}

const updateLiveSession = async (id, details) => {
    if (details.startDateTime || details.duration) {
        const liveSession = await liveSessionDb.findById(id);
        if (!liveSession) {
            throw new NotFoundError('Live session not found')
        }
        let liveSessionsFactory = new LiveSessionsFactory(zoomConfig);
        let liveSessionService = liveSessionsFactory.getLiveSessionServices("zoom");
        let { code, data: updateResponse, message } = await liveSessionService.updateMeeting(
            liveSession.liveSessionDetails.id,
            liveSessionService.createMeetingPayload(details, liveSession.zoomUserId)
        );
        if (code != 204) {
            throw new BadRequestError(message)
        }
        let { code: _code, data: meetingResponse, message: _message } = await liveSessionService.getMeeting(liveSession.liveSessionDetails.id);
        details.liveSessionDetails = getMeetingDetailsObject(meetingResponse);
        let endTime = moment(details.startDateTime).add(meetingResponse.duration, "minutes");
        details.endDateTime = endTime;
    }
    let findRequest = buildQueryRequest({
        filters: {
            _id: id,
        }
    });
    let options = {
        new: true
    };
    const response = await liveSessionDb.update(findRequest, details, options);
    return response;
}

const deleteLiveSession = async (id) => {
    const liveSession = await liveSessionDb.findById(id);
    if (!liveSession) {
        throw new NotFoundError('Live session not found')
    }
    let liveSessionsFactory = new LiveSessionsFactory(zoomConfig);
    let liveSessionService = liveSessionsFactory.getLiveSessionServices("zoom");
    let { code, data: meetingResponse, message } = await liveSessionService.deleteMeeting(
        liveSession.liveSessionDetails.id
    );
    if (code != 204) {
        throw new BadRequestError(message)
    }
    const response = await liveSessionDb.remove(id);
    return response;
}

const getAvailableLicenses = async (startTime, duration) => {
    let start = moment(startTime).toISOString();
    let end = moment(startTime).add(duration, "minutes").toISOString();
    let range = {
        startDateTime: {
            lte: end,
        },
        endDateTime: {
            gte: start
        }
    }
    let findRequest = buildQueryRequest({ range });
    let availableLivesInTime = await liveSessionDb.findByCondition(findRequest);
    let exclude = [];
    if (availableLivesInTime.results.length > 0) {
        exclude = availableLivesInTime.results.map(result => result.zoomUserId);
    }
    let filters = {
        zoomUserId: {
            $nin: [...new Set(exclude)]
        },
        isActive: true
    }
    let activeLicenses = await listAll({ filters })
    return activeLicenses.results[0] || new NotFoundError("No license available ati this slot")
}

const getLiveSessionContentDetails = async (liveSession) => {
    liveSession = liveSession.toObject();
    let faculty = await facultyService.findFacultyById(liveSession.facultyId);
    liveSession.faculty = {
        facultyId: liveSession.facultyId,
        facultyName: faculty?.name ?? ""
    }
    let institute = await instituteService.findInstituteById(liveSession.instituteId);
    liveSession.institute = {
        instituteId: liveSession.instituteId,
        instituteName: institute?.name ?? ""
    }
    let course = await courseModuleDb.findById(liveSession.courseId);
    liveSession.course = {
        courseId: liveSession.courseId,
        courseName: course?.name ?? ""
    }

    return liveSession;
}

const getliveSessionByid = async (id) => {
    let liveSession = await liveSessionDb.findById(id);
    if (!liveSession) throw new NotFoundError("No live session found");
    return await getLiveSessionContentDetails(liveSession);
}

const sendLiveClassAddedNotification = async (liveDetails) => {
    let date = new Date(Date.now());
    let filters = {
        courseId: liveDetails.courseId,
        isActive: true
    };
    let range = {
        planStartDate: {
            lte: date.toISOString(),
        },
        planEndDate: {
            gte: date.toISOString(),
        },
    };
    let subscriptions = await queryBuilder.getQueryResults(Subscription, null, { filters, range }, false);
    if(subscriptions.length==0) return;

    let userIds = subscriptions.map(item => item.userId).filter(userId => userId!="");
    if(userIds.length==0) return;

    let users = await Users.find({ _id: userIds, deviceToken: { $exists: true }});
    if(users.length==0) return;

    let deviceTokens = users.map(item => item.deviceToken).filter(deviceToken => deviceToken!="");
    
    if (deviceTokens.length > 0) {
        await notificationManagerService.enqueueNotification("liveclassCreated", liveDetails, deviceTokens);
    }

    let promises = [];
    userIds.forEach(userId => {
        promises.push(inappNotificationHandler.liveclassCreatedNotification({
            ...liveDetails.toObject(),
            userId
        }));
    });

    await Promise.all(promises);

    return true;
}

const getLiveSessions = async (type, searchParams) => {
    let today = new Date();
    if (!searchParams.filters) {
        searchParams.filters = {}
    }
    searchParams.searchFields = ['title']
    if (type === 'scheduled') {
        searchParams.filters.startDateTime = { $gte: today }
    }
    if (type === 'ongoing') {
        searchParams.filters.startDateTime = { $lte: today }
        searchParams.filters.endDateTime = { $gte: today }
    }
    if (type === 'past_live') {
        searchParams.filters.endDateTime = { $lte: today }
    }

    let findRequest = buildQueryRequest(searchParams);
    const response = await liveSessionDb.findByCondition(findRequest);
    return response;
}

module.exports = {
    addLiveSession,
    updateLiveSession,
    deleteLiveSession,
    getliveSessionByid,
    sendLiveClassAddedNotification,
    getLiveSessions
}