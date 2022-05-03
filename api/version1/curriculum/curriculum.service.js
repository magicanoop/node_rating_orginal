const _ = require('underscore');
const CurriculumModel = require('./models/course_curriculum.model');
const makeCurriculumDb = require('./DAO/curriculumDAO');
const { NotFoundError } = require('../../../utils/api_error_util');
const {
    addVideo,
    updateVideo,
    deleteVideo,
    replicateVideo
} = require('../videos/video.service');
const {
    addNote,
    updateNote,
    deleteNote,
    replicateNote
} = require('../notes/note.service');
const {
    addLiveSession,
    updateLiveSession,
    deleteLiveSession,
    getliveSessionByid,
    getLiveSessions
} = require('../liveSession/live_session.service');

const {
    getSubcriptions
} = require('../subscription/subscription.service');


const {
    VIDEO,
    NOTE,
    TEST,
    LIVE,
    RECORDED
} = require('../../../utils/enums');
const {
    createTest
} = require('../../version0/services/testService')

const BuildQueryRequest = require('./../../queryBuilder');
const buildQueryRequest = new BuildQueryRequest(require("regex-escape"), { asc: 1, desc: -1 });

const courseCurriculumDb = makeCurriculumDb({ CurriculumModel });

const updateCourseCurriculum = async (id, details) => {
    const response = await courseCurriculumDb.update(id, details);
    if (!response) {
        throw new NotFoundError(`Curriculam not found`)
    }
    return response
}

const deleteCourseCurriculum = async (id) => {
    const response = courseCurriculumDb.remove(id);
    if (!response) {
        throw new NotFoundError(`Curriculam not found`)
    }
    return response
}

const addSubject = async (id, details) => {
    let curriculum = await courseCurriculumDb.findByCourseModuleId(id);
    if (!curriculum) {
        await courseCurriculumDb.create({ courseModuleId: id });
    }
    let findRequest = buildQueryRequest({
        filters: {
            courseModuleId: id
        }
    });
    let updateQuery = {
        $push: {
            subjects: details
        }
    }
    let options = {
        new: true
    };
    let created = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options)
    if (!created) {
        throw new NotFoundError(`Curriculum not found`)
    }
    let { _id, title } = created.subjects[created.subjects.length - 1];

    return { _id, title, curriculumId: created._id }
}

const addSection = async (curriculumId, subjectId, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId
        }
    });
    let updateQuery = {
        $inc: { "sectionsCount": 1 },
        $push: {
            "subjects.$.sections": details
        }
    }
    let options = {
        new: true
    };
    let created = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options)
    if (!created) {
        throw new NotFoundError(`Subject not found`)
    }
    let sections = created.subjects.find(subject => subject._id == subjectId).sections;
    let { _id, title } = sections[sections.length - 1];
    return { _id, title };
}

const addChapter = async (curriculumId, subjectId, sectionId, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
            "subjects.sections._id": sectionId
        }
    });
    let updateQuery = {
        $push: {
            "subjects.$[subjectId].sections.$[sectionId].chapters": details
        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }, { "sectionId._id": sectionId }],
        new: true
    };
    let curriculum = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options)
    if (!curriculum) {
        throw new NotFoundError(`Section not found`)
    }
    let created = {};
    curriculum.subjects.forEach(subject => {
        if (subject._id == subjectId) {
            subject.sections.forEach(section => {
                if (section._id == sectionId) {
                    let { _id, title, tags } = section.chapters[section.chapters.length - 1];
                    created = { _id, title, tags };
                }
            })
        }
    });

    return created
}

const addTitle = async (curriculumId, subjectId, sectionId, chapterId, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
            "subjects.sections._id": sectionId,
            "subjects.sections.chapters._id": chapterId
        }
    });
    let updateQuery = {
        $push: {
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].titles": details
        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }, { "sectionId._id": sectionId }, { "chapterId._id": chapterId }],
        new: true
    };
    let curriculum = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options)
    if (!curriculum) {
        throw new NotFoundError(`Chapter not found`)
    }
    let created;
    curriculum.subjects.forEach(subject => {
        if (subject._id == subjectId) {
            subject.sections.forEach(section => {
                if (section._id == sectionId) {
                    section.chapters.forEach(chapter => {
                        if (chapter._id == chapterId) {
                            let { _id, title } = chapter.titles[chapter.titles.length - 1];
                            created = { _id, title }
                        }
                    })
                }
            })
        }
    });

    return created
}

const addContent = async (curriculumId, subjectId, sectionId, chapterId, titleId, type, details, user) => {
    let content;
    let contentType;
    switch (type) {
        case "video":
            content = await addVideo(details);
            break;
        case "note":
            content = await addNote(details);
            contentType = "notesCount"
            break;
        case "live":
            content = await addLiveSession({ curriculumId, ...details });
            break;
        case "test":
            let testDetails = {
                courseId: details.courseId,
                name: details.title,
                createdByUser: user._id,
                updatedByUser: user._id,
                sectionId,
                instructions: details.instructions,
                thumbnail: details.imageUrl,
            }
            content = await createTest(testDetails);
            break;
        default:
            break;
    }
    details.contentId = content._id;
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
            "subjects.sections._id": sectionId,
            "subjects.sections.chapters._id": chapterId,
            "subjects.sections.chapters.titles._id": titleId
        }
    });
    let updateQuery = {
        $inc: {
            "lecturesCount": 1,
            [contentType]: 1
        },
        $push: {
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].titles.$[titleId].contents": details
        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }, { "sectionId._id": sectionId }, { "chapterId._id": chapterId }, { "titleId._id": titleId }],
        new: true
    };
    let created = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options);
    if (!created) {
        throw new NotFoundError(`Title not found`)
    }

    return content
}

const changeStatusOfSubject = async (status, curriculumId, subjectId) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
        }
    });
    let updateQuery = {
        $set: {
            "subjects.$[subjectId].isActive": status,
            "subjects.$[subjectId].sections.$[].isActive": status,
            "subjects.$[subjectId].sections.$[].chapters.$[].isActive": status,
            "subjects.$[subjectId].sections.$[].chapters.$[].contents.$[].isActive": status,

        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }],
        new: true
    };
    let curriculum = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options);
    if (!curriculum) {
        throw new NotFoundError(`Subject not found`)
    }
    let subject = curriculum.subjects.find(subject => subject.id === subjectId);

    return subject
}

const changeStatusOfSection = async (status, curriculumId, subjectId, sectionId) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
            "subjects.sections._id": sectionId
        }
    });
    let updateQuery = {
        $set: {
            "subjects.$[subjectId].sections.$[sectionId].isActive": status,
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[].isActive": status,
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[].contents.$[].isActive": status,

        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }, { "sectionId._id": sectionId }],
        new: true
    };
    let created = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options);
    if (!created) {
        throw new NotFoundError(`Section not found`)
    }

    return created
}

const changeStatusOfChapter = async (status, curriculumId, subjectId, sectionId, chapterId) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
            "subjects.sections._id": sectionId,
            "subjects.sections.chapters._id": chapterId
        }
    });
    let updateQuery = {
        $set: {
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].isActive": status,
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].contents.$[].isActive": status,

        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }, { "sectionId._id": sectionId }, { "chapterId._id": chapterId }],
        new: true
    };
    let created = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options);
    if (!created) {
        throw new NotFoundError(`Chapter not found`)
    }

    return created
}

const changeStatusOfContent = async (status, curriculumId, subjectId, sectionId, chapterId, titleId, contentId) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
            "subjects.sections._id": sectionId,
            "subjects.sections.chapters._id": chapterId,
            "subjects.sections.chapters.titles._id": titleId,
            "subjects.sections.chapters.titles.contents._id": contentId
        }
    });
    let updateQuery = {
        $set: {
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].titles.$[titleId].contents.$[contentId].isActive": status,

        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }, { "sectionId._id": sectionId }, { "chapterId._id": chapterId }, { "titleId._id": titleId }, { "contentId._id": contentId }],
        new: true
    };
    let created = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options);
    if (!created) {
        throw new NotFoundError(`Content not found`)
    }

    return created
}

const editSubject = async (curriculumId, subjectId, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
        }
    });
    let updateQuery = {
        $set: {
            "subjects.$[subjectId].title": details.title,
        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }],
        new: true
    };
    let created = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options);
    if (!created) {
        throw new NotFoundError(`Subject not found`)
    }
    let { _id, title } = created.subjects.find(subject => subject._id == subjectId);

    return { _id, title }
}

const editSection = async (curriculumId, subjectId, sectionId, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
            "subjects.sections._id": sectionId,
        }
    });
    let updateQuery = {
        $set: {
            "subjects.$[subjectId].sections.$[sectionId].title": details.title,
        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }, { "sectionId._id": sectionId }],
        new: true
    };
    let created = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options);
    if (!created) {
        throw new NotFoundError(`Section not found`)
    }
    let sections = created.subjects.find(subject => subject._id == subjectId).sections;
    let { _id, title } = sections.find(section => section._id == sectionId);

    return { _id, title }
}

const editChapter = async (curriculumId, subjectId, sectionId, chapterId, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
            "subjects.sections._id": sectionId,
            "subjects.sections.chapters._id": chapterId,
        }
    });
    let updateQuery = {
        $set: {
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].title": details.title,
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].tags": details.tags,
        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }, { "sectionId._id": sectionId }, { "chapterId._id": chapterId }],
        new: true
    };
    let curriculum = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options);
    if (!curriculum) {
        throw new NotFoundError(`Chapter not found`)
    }
    let created = {};
    curriculum.subjects.forEach(subject => {
        if (subject._id == subjectId) {
            subject.sections.forEach(section => {
                if (section._id == sectionId) {
                    let { _id, title, tags } = section.chapters.find(chapter => chapter._id == chapterId);
                    created = { _id, title, tags };
                }
            })
        }
    });

    return created
}

const editContent = async (curriculumId, subjectId, sectionId, chapterId, titleId, contentId, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
            "subjects.sections._id": sectionId,
            "subjects.sections.chapters._id": chapterId,
            "subjects.sections.chapters.titles._id": titleId,
            "subjects.sections.chapters.titles.contents._id": contentId
        }
    });
    let updateQuery = {
        $set: {
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].titles.$[titleId].contents.$[contentId].title": details.title,
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].titles.$[titleId].contents.$[contentId].type": details.type,
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].titles.$[titleId].contents.$[contentId].description": details.description,
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].titles.$[titleId].contents.$[contentId].faculty": details.faculty,
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].titles.$[titleId].contents.$[contentId].imageUrl": details.imageUrl,
        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }, { "sectionId._id": sectionId }, { "chapterId._id": chapterId }, { "titleId._id": titleId }, { "contentId._id": contentId }],
        new: true
    };
    let created = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options);
    if (!created) {
        throw new NotFoundError(`Content not found`)
    }
    let content;
    switch (details.type) {
        case VIDEO:
            content = await updateVideo(details.contentId, details);
            break;
        case NOTE:
            content = await updateNote(details.contentId, details);
            break;
        case LIVE:
            content = await updateLiveSession(details.contentId, details);
            break;
        default:
            break;
    }
    if (!content) {
        throw new NotFoundError(`Content not found`)
    }

    return content
}

const getChapterById = async (id) => {
    const response = await courseCurriculumDb.findCurriculumByChapterId(id);
    return response
}
const getCurriculumByCourseId = async (id) => {
    const curriculum = await courseCurriculumDb.findByCourseModuleId(id);
    if (!curriculum) {
        throw new NotFoundError(`Curriculum not found`)
    }
    return curriculum;
}

const deleteContent = async (curriculumId, subjectId, sectionId, chapterId, titleId, contentId, details) => {
    let contentType;
    switch (details.type) {
        case VIDEO:
            await deleteVideo(details.id);
            break;
        case NOTE:
            contentType = "notesCount"
            await deleteNote(details.id);
            break;
        case LIVE:
            await deleteLiveSession(details.id);
            break;
        default:
            break;
    }
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
            "subjects.sections._id": sectionId,
            "subjects.sections.chapters._id": chapterId,
            "subjects.sections.chapters.titles._id": titleId,
            "subjects.sections.chapters.titles.contents._id": contentId
        }
    });
    let updateQuery = {
        $inc: {
            "lecturesCount": -1,
            [contentType]: -1
        },
        $pull: {
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].titles.$[titleId].contents": { _id: contentId }
        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }, { "sectionId._id": sectionId }, { "chapterId._id": chapterId }, { "titleId._id": titleId }, { "contentId._id": contentId }],
        new: true
    };
    let curriculum = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options);
    if (!curriculum) {
        throw new NotFoundError(`Curriculum not found`)
    }

    return curriculum;
}

const editTitle = async (curriculumId, subjectId, sectionId, chapterId, titleId, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: curriculumId,
            "subjects._id": subjectId,
            "subjects.sections._id": sectionId,
            "subjects.sections.chapters._id": chapterId,
            "subjects.sections.chapters.titles._id": titleId
        }
    });
    let updateQuery = {
        $set: {
            "subjects.$[subjectId].sections.$[sectionId].chapters.$[chapterId].titles.$[titleId].title": details.title
        }
    };
    let options = {
        arrayFilters: [{ "subjectId._id": subjectId }, { "sectionId._id": sectionId }, { "chapterId._id": chapterId }, { "titleId._id": titleId }],
        new: true
    };
    let curriculum = await courseCurriculumDb.arrayUpdate(findRequest, updateQuery, options);
    if (!curriculum) {
        throw new NotFoundError(`Title not found`)
    }
    let created;
    curriculum.subjects.forEach(subject => {
        if (subject._id == subjectId) {
            subject.sections.forEach(section => {
                if (section._id == sectionId) {
                    section.chapters.forEach(chapter => {
                        if (chapter._id == chapterId) {
                            let { _id, title } = chapter.titles.find(title => title._id == titleId);
                            created = { _id, title }
                        }
                    })
                }
            })
        }
    });

    return created
}

const getSchedules = async (user, query) => {
    // if user role is student refer subscriptions
    let foundCouserIds = [];
    const foundCourses = {};
    const currrentDateTime = new Date().toISOString();
    if (user.role === 'student') {
        const subcriptions = await getSubcriptions({
            ...query,
            userId: user['_id'],
            isActive: true,
            planStartDate: { $lte: currrentDateTime },
            planEndDate: { $gte: currrentDateTime },
        });
        foundCouserIds = _.map(subcriptions['results'], (subcription) => { return subcription.courseId });
        _.each(subcriptions['results'], (subcription) => {
            foundCourses[subcription.courseId] = subcription;
        });
    } else {
        // to do - if user role is other than student refer institute and faculty
        // currently passing the courseId if present in the request query
        if (query.courseId) {
            foundCouserIds.push(query.courseId)
        }
    }
    foundCouserIds = _.uniq(foundCouserIds);
    const aggQueryArray = [{
        $match: {
            courseModuleId: {
                $in: foundCouserIds
            }
        }
    }, {
        $unwind: {
            path: '$subjects',
            preserveNullAndEmptyArrays: false
        }
    }, {
        $match: {
            'subjects.isActive': true
        }
    }, {
        $unwind: {
            path: '$subjects.sections',
            preserveNullAndEmptyArrays: false
        }
    }, {
        $match: {
            'subjects.sections.isActive': true
        }
    }, {
        $unwind: {
            path: '$subjects.sections.chapters',
            preserveNullAndEmptyArrays: false
        }
    }, {
        $match: {
            'subjects.sections.chapters.isActive': true
        }
    }, {
        $unwind: {
            path: '$subjects.sections.chapters.titles',
            preserveNullAndEmptyArrays: false
        }
    }, {
        $match: {
            'subjects.sections.chapters.titles.isActive': true
        }
    }, {
        $unwind: {
            path: '$subjects.sections.chapters.titles.contents',
            preserveNullAndEmptyArrays: false
        }
    }, {
        $match: {
            'subjects.sections.chapters.titles.contents.isActive': true,
            'subjects.sections.chapters.titles.contents.type': 'LIVE'
        }
    }, {
        $addFields: {
            contentObjectId: {
                $toObjectId: '$subjects.sections.chapters.titles.contents.contentId'
            }
        }
    }, {
        $lookup: {
            from: 'course_curriculum_live_sessions',
            localField: 'contentObjectId',
            foreignField: '_id',
            as: 'subjects.sections.chapters.titles.contents.live_session'
        }
    }, {
        $unwind: {
            path: '$subjects.sections.chapters.titles.contents.live_session',
            preserveNullAndEmptyArrays: false
        }
    }];
    let liveSessions = await courseCurriculumDb.aggregateQuery(aggQueryArray);

    if (user.role !== 'student') {
        return liveSessions['results'];
    }

    const schedules = [];
    _.each(liveSessions['results'], (liveSession) => {
        const startDateTime = liveSession.subjects.sections.chapters.titles.contents.live_session?.startDateTime?.toISOString();
        if (startDateTime > foundCourses[liveSession.courseModuleId].planStartDate.toISOString() && startDateTime < foundCourses[liveSession.courseModuleId].planEndDate.toISOString()) {
            schedules.push(liveSession)
        }
    })

    return schedules;
}

const getCurriculumById = async (id) => {
    const response = courseCurriculumDb.findById(id);
    if (!response) {
        throw new NotFoundError(`Curriculam not found`)
    }
    return response
}
//

const importFromCurriculum = async ({ destinationCurriculumId, destinationSubject, destinationSection, destinationChapter, destinationTitle, items, courseId }) => {
    let videos = items.filter(item => item.type == "video");
    let notes = items.filter(item => item.type == "notes");
    let videoDatas = [];
    let notesData = [];
    let promises = [];
    if (videos.length > 0) {
        videoDatas = await replicateVideo(videos, courseId)
        for (let i = 0; i < videoDatas.length; i++) {
            promises.push(await addContent(destinationCurriculumId, destinationSubject, destinationSection, destinationChapter, destinationTitle, "video", videoDatas[i]));
        }
    }
    if (notes.length > 0) {
        notesData = await replicateNote(notes, courseId)
        for (let i = 0; i < notesData.length; i++) {
            promises.push(await addContent(destinationCurriculumId, destinationSubject, destinationSection, destinationChapter, destinationTitle, "note", notesData[i]));
        }
    }
    let response = await Promise.all(promises);
    return response;
}

const deleteCurriculumByCourseId = async (id) => {
    const response = courseCurriculumDb.removeByCourseId(id);
    if (!response) {
        throw new NotFoundError(`Curriculam not found`)
    }
    return response
}

const getLiveSessionDetails = async (id) => {
    const response = await getliveSessionByid(id);
    return response
}

const addCurriculum = async (id) => {
    const response = await courseCurriculumDb.create({ courseModuleId: id });
    return response;
}

const getAllLiveSessions = async (type, searchParams) => {
    const response = await getLiveSessions(type, searchParams);
    return response;
}

module.exports = {
    updateCourseCurriculum,
    deleteCourseCurriculum,
    addSubject,
    addSection,
    addChapter,
    addContent,
    changeStatusOfSubject,
    changeStatusOfSection,
    changeStatusOfChapter,
    changeStatusOfContent,
    editSubject,
    editSection,
    editChapter,
    editContent,
    getChapterById,
    getCurriculumByCourseId,
    deleteContent,
    addTitle,
    editTitle,
    getSchedules,
    importFromCurriculum,
    deleteCurriculumByCourseId,
    addCurriculum,
    getCurriculumById,
    getLiveSessionDetails,
    addCurriculum,
    getAllLiveSessions
}
