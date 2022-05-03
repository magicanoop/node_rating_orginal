const NoteModel = require('./models/note.model');
const makeNoteDb = require('./DAO/noteDAO');
const { NotFoundError } = require('../../../utils/api_error_util');
const BuildQueryRequest = require('./../../queryBuilder');
const buildQueryRequest = new BuildQueryRequest(require("regex-escape"), { asc: 1, desc: -1 });
const notificationManagerService = require('../../version0/services/notificationManagerService');
const inappNotificationHandler = require('../../version0/services/inappNotificationHandler');
const {
    users: Users,
    subscription: Subscription
} = require('../../version0/models');
const {
    NOTE
} = require('./../../../utils/enums');

const noteModuleDb = makeNoteDb({ NoteModel });

const facultyService = require('../../version0/services/faculty.service');
const CourseModuleModel = require('../course/models/course_module.model');
const makeCourseModelDb = require('../course/DAO/courseModuleDAO');
const courseModuleDb = makeCourseModelDb({ CourseModuleModel });

const getNotes = async (condition,searchParams) => {
    let searchRequest = buildQueryRequest(searchParams);
    const response = await noteModuleDb.findByCondition(searchRequest,condition);
    return response
}

const getNoteContentDetails = async (note) => {
    note = note.toObject();
    let faculty = await facultyService.findFacultyById(note.facultyId);
    note.faculty = {
        facultyId: note.facultyId,
        facultyName: faculty?.name ?? ""
    }
    let course = await courseModuleDb.findById(note.courseId);
    note.course = {
        courseId: note.courseId,
        courseName: course?.name ?? ""
    }

    return note;
}

const getNote = async (id) => {
    const note = await noteModuleDb.findOneById(id);
    if (!note) throw new NotFoundError("Note not found");
    return await getNoteContentDetails(note);
}

const addNote = async (details) => {
    const response = await noteModuleDb.insert(details);
    return response;
}

const updateNote = async (id, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: id,
        }
    });
    let options = {
        new: true
    };
    const response = await noteModuleDb.update(findRequest, details, options);
    return response;
}

const deleteNote = async (id) => {
    const response = await noteModuleDb.remove(id);
    return response;
}

const deleteById = async (id) => {
    const response = await noteModuleDb.deleteById(id);
    return response;
}

const sendNoteAddedNotification = async (noteDetails) => {
    let subscriptions = await Subscription.find({ courseId: noteDetails.courseId });
    let userIds = subscriptions.map(item => item.userId);
    let user = await Users.find({ _id:{ $in: userIds }, deviceToken: { $exists: true }});
    let deviceToken = user.map(item => item.deviceToken);
    
    if (deviceToken.length > 0) {
        await notificationManagerService.enqueueNotification("noteAdded", noteDetails, deviceToken);
    }

    let promises = [];
    for (let i = 0; i < userIds.length; i++) {
        promises.push(inappNotificationHandler.noteAddedNotification({
            ...noteDetails.toObject(),
            userId: userIds[i]
        }));
    }

    await Promise.all(promises);

    return true;
}

const replicateNote= async (items,courseId) => {
    let noteData = [];
    let filters = {
        _id: items.map(item => item.id)
    }
    let searchRequest = buildQueryRequest({filters});
    let notes = await noteModuleDb.findByCondition(searchRequest,null);
    
    if(notes.results.length>0){
        let replicas = notes.results.map(note=>{
            delete note._id;
            note.courseId = courseId;
            note.type=NOTE;
            return note;
        });
        noteData= replicas;
    }
    
    return noteData;
}
module.exports = {
    getNotes,
    getNote,
    addNote,
    updateNote,
    deleteById,
    deleteNote,
    sendNoteAddedNotification,
    replicateNote
}