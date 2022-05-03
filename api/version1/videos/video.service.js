const VideoModel = require('./models/video.model');
const makeVideoDb = require('./DAO/videoDAO');
const { NotFoundError } = require('../../../utils/api_error_util');
const BuildQueryRequest = require('./../../queryBuilder');
const buildQueryRequest = new BuildQueryRequest(require("regex-escape"), { asc: 1, desc: -1 });
const cloudFrontService= require('../cloudFront/cloudFront.service');
const notificationManagerService = require('../../version0/services/notificationManagerService');
const inappNotificationHandler = require('../../version0/services/inappNotificationHandler');
const {
    VIDEO
} = require('./../../../utils/enums');
const {
    users: Users,
    subscription: Subscription
} = require('../../version0/models');
const envConfig = require('config');

const videoModuleDb = makeVideoDb({ VideoModel });

const facultyService = require('../../version0/services/faculty.service');
const CourseModuleModel = require('../course/models/course_module.model');
const makeCourseModelDb = require('../course/DAO/courseModuleDAO');
const courseModuleDb = makeCourseModelDb({ CourseModuleModel });

const getVideos = async (condition,searchParams) => {
    let searchRequest = buildQueryRequest(searchParams);
    const response = await videoModuleDb.findByCondition(searchRequest,condition);
    return response
}

const getVideoContentDetails = async (video) => {
    video = video.toObject();
    let faculty = await facultyService.findFacultyById(video.facultyId);
    video.faculty = {
        facultyId: video.facultyId,
        facultyName: faculty?.name ?? ""
    }
    let course = await courseModuleDb.findById(video.courseId);
    video.course = {
        courseId: video.courseId,
        courseName: course?.name ?? ""
    }

    return video;
}

const getVideo = async (id) => {
    const video = await videoModuleDb.findById(id);
    if (!video) throw new NotFoundError("Video not found");
    return await getVideoContentDetails(video);
}

const getStreamUrls = (url) => {
    return cloudFrontService.getStreamUrls(url);
}

const getSignedCookie = async (video) => {
    let url = getStreamUrls(video.url);
    let cookie = await cloudFrontService.createSignedCookie(url, envConfig.cloudFront.signedCookie.maxAge);
    return cookie;
}

const addVideo = async (details) => {
    const response = await videoModuleDb.insert(details);
    return response;
}

const insertMany = async (details) => {
    const response = await videoModuleDb.insertMany(details);
    return response;
}

const updateVideo = async (id, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: id,
        }
    });
    let options = {
        new: true
    };
    const response = await videoModuleDb.update(findRequest, details, options);
    return response;
}

const deleteVideo = async (id) => {
    const response = await videoModuleDb.remove(id);
    return response;
}
const deleteById = async (id) => {
    const response = await videoModuleDb.deleteById(id);
    if(!response){
        return false;
    }
    return response;
}

const sendVideoAddedNotification = async (videoDetails) => {
    let subscriptions = await Subscription.find({ courseId: videoDetails.courseId });
    let userIds = subscriptions.map(item => item.userId);
    let user = await Users.find({ _id:{ $in: userIds }, deviceToken: { $exists: true }});
    let deviceToken = user.map(item => item.deviceToken);
    
    if (deviceToken.length > 0) {
        await notificationManagerService.enqueueNotification("videoAdded", videoDetails, deviceToken);
    }

    let promises = [];
    for (let i = 0; i < userIds.length; i++) {
        promises.push(inappNotificationHandler.videoAddedNotification({
            ...videoDetails.toObject(),
            userId: userIds[i]
        }));
    }

    await Promise.all(promises);

    return true;
}

const replicateVideo = async (items,courseId) => {
    let videoData = [];
    let filters = {
        _id: items.map(item => item.id)
    }
    let searchRequest = buildQueryRequest({filters});
    let videos = await videoModuleDb.findByCondition(searchRequest,null);
    
    if(videos.results.length>0){
        let replicas = videos.results.map(video=>{
            delete video._id;
            video.courseId = courseId;
            video.type = VIDEO
            return video;
        });
        videoData= replicas;
    }
    
    return videoData;
}

module.exports = {
    getVideos,
    getVideo,
    getSignedCookie,
    addVideo,
    updateVideo,
    insertMany,
    deleteById,
    deleteVideo,
    sendVideoAddedNotification,
    replicateVideo,
    getStreamUrls
}