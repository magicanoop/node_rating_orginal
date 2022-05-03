const {
    addNote,
    updateNote,
    getNote,
    sendNoteAddedNotification
} = require('./note.service');
const singleContentService = require('../../version0/services/singleContent.service');

exports.saveNoteDetails = async (httpRequest) => {
    const { body, user } = httpRequest;
    
    body.createdByUser = user?._id ?? "";
    const response = await addNote(body);
    
    if (response?.title) {
        await singleContentService.updateContentIfFound(
            response.courseId, { name: response.title }
        );
    }

    sendNoteAddedNotification(response);

    return {
        statusCode: 200,
        data: response,
        message: 'Note added successfully'
    }
}

exports.updateNoteDetails = async (httpRequest) => {
    const { body, params, user } = httpRequest;
    
    body.updatedByUser = user?._id ?? "";
    const response = await updateNote(params.noteId, body);    

    if (response?.title) {
        await singleContentService.updateContentIfFound(
            response.courseId, { name: response.title }
        );
    }

    return {
        statusCode: 200,
        data: response,
        message: 'Note updated successfully'
    }
}

exports.getNoteDetails = async (httpRequest) => {
    const { params } = httpRequest;
    let response = await getNote(params.noteId);
    if (!response) {
        return {
            statusCode: 404,
            data: response,
            message: 'Note not found'
        }
    }

    return {
        statusCode: 200,
        data: response,
        message: 'Note retrieved successfully'
    }
}
