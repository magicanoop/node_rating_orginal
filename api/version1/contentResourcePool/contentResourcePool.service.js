const videoService =  require('../videos/video.service');
const noteService =  require('../notes/note.service');
const BuildQueryRequest = require('./../../queryBuilder');
const buildQueryRequest = new BuildQueryRequest(require("regex-escape"), { asc: 1, desc: -1 })
const ContentResourcePoolUploadModel = require('./models/content_resource_pool_upload.model');
const makeContentResourcePoolUploadDb = require('./DOA/contentResourcePoolUploadDAO');
const ContentResourcePoolModel = require('./models/content_resource_pool.model');
const makeContentResourcePoolDb = require('./DOA/contentResourcePoolDAO');
const { v4: uuidv4 } = require('uuid');
const {startMultipartUpload,createPresignedUrl} =  require('../fileUpload/fileUpload.service');
const courseService = require('../course/course.service');
const curriculumService = require('../curriculum/curriculum.service');
const cloudFrontService = require('../cloudFront/cloudFront.service');
const categoryService = require('../category/category.service.js');
const { ObjectId } = require('mongoose').Types;
const queryBuilder = require('../../version0/services/queryBuilder.service');
const db = require('../../version0/models');
const Institute = db.institute;
const Faculty = db.faculty;
const envConfig = require('config');

const ContentResourcePoolUploadDb = makeContentResourcePoolUploadDb({ ContentResourcePoolUploadModel });
const ContentResourcePoolDb = makeContentResourcePoolDb({ ContentResourcePoolModel });

const startUploadContents = async (contents) => {
    let promises = [];
    if (contents.length > 0) {
        contents.forEach((content) => {
            promises.push(startUpload(content));
        });
    }

    if (promises.length > 0) return await Promise.all(promises);
    return null;
  
}

const contentsUploadCompleted = async (userId, contents) => {
    let promises = [];
    if (contents.length > 0) {
        contents.forEach((content) => {
            promises.push(uploadCompleted(userId, content));
        });
    }
    if (promises.length > 0) return await Promise.all(promises);
    return null; 
}

const uploadCompleted = async (userId, content) => {
    let upload = await ContentResourcePoolUploadDb.findByCondition({ guid: content.guid });
    if(!upload) return null;
    upload.status = content.status;
    upload.url = content?.url ?? null;

    if (content.status == "completed") {
        let resourcePool = await ContentResourcePoolDb.findByCondition({ guid: content.guid });
        let ContentResource={
            guid:upload.guid,
            fileName:upload.fileName
        }
        if (!resourcePool) resourcePool = await ContentResourcePoolDb.create(ContentResource)
        resourcePool.instituteId = upload.instituteId;
        resourcePool.contentType = upload.contentType;
        resourcePool.guid = upload.guid;
        resourcePool.fileName = upload.fileName;
        if(content.languageId) {
            resourcePool.title = [{
                languageId: content.languageId,
                value: upload.fileName
            }];
        }

        resourcePool.createdBy = userId;
        await ContentResourcePoolDb.findByIdAndUpdate(resourcePool._id,resourcePool);
        upload.contentPoolId = resourcePool._id;
        await ContentResourcePoolUploadDb.findByIdAndUpdate(upload._id,upload);
        return resourcePool;
    }

    await ContentResourcePoolUploadDb.findByIdAndUpdate(upload._id,upload);
    return null;
}

const updateManyContents = async (contents) => {
    let promises = [];
    if (contents.length > 0) {
        contents.forEach((content) => {
            promises.push(updateContent(content));
        });
    }
    if (promises.length > 0) return await Promise.all(promises);
    return null;
}

const updateContent = async (content) => {
    const resourcePool = await ContentResourcePoolDb.findByIdAndUpdate(content._id,content);
    await updateContentUploadByContentPoolId(content._id, content);
    return resourcePool;
}

const updateContentUploadByContentPoolId = async (contentPoolId, content) => {
    return await ContentResourcePoolUploadDb.findOneAndUpdate({contentPoolId} ,
        {
            trancodeRequired: content?.trancodeRequired ?? false,
            transcodeQuality: content?.transcodeQuality ?? [],
            transcodeFileType: content?.transcodeFileType ?? []
        }
    );
}

const startUpload = async (content) => {
    let uploadResp = await ContentResourcePoolUploadDb.createUpload(content)
    let multipartUploadStart = await startMultipartUpload(content.extension, uploadResp.guid, uploadResp.fileType)
    uploadResp = await ContentResourcePoolUploadDb.findByIdAndUpdate(uploadResp._id,{url:multipartUploadStart.url})
    return {
        ...uploadResp.toObject(),
        uploadDetails : multipartUploadStart
    }
}

const attachContentRelatedData = (contents, relations) => {
    const { institutes, uploads, categories, subjects, faculties } = relations;
    contents.map(content => {
        let uploadData = null;
        let instituteName = null;
        let categoryNames = [];
        let subjectNames = [];
        let facultyNames = [];

        // institute name
        institutes.map(institute => {
            if (content.instituteId == institute._id) {
                instituteName = { _id: institute._id, name: institute.name };
            }
        });
        content._doc.instituteName = instituteName;

        // upload data
        uploads.map(upload => {
            if (content.id == upload.contentPoolId) {
                uploadData = {
                    _id: upload._id,
                    url: upload.url,
                    trancodeRequired: upload.trancodeRequired,
                    transcodeQuality: upload.transcodeQuality,
                    transcodeFileType: upload.transcodeFileType
                };
            }
        });
        content._doc.upload = uploadData;

        // category names
        content?.categories?.length > 0 && categories?.length > 0 && categories.map(category => {
            if (content.categories.includes(category._id)) {
                categoryNames.push({ _id: category._id, name: category.name });
            }
        });
        content._doc.categoryNames = categoryNames;

        // subject names
        content?.subjects?.length > 0 && subjects?.length > 0 && subjects.map(subject => {
            if (content.subjects.includes(subject._id)) {
                subjectNames.push({ _id: subject._id, name: subject.name });
            }
        });
        content._doc.subjectNames = subjectNames;

        // faculty names
        content?.faculties?.length > 0 && faculties?.length > 0 && faculties.map(faculty => {
            if (content.faculties.includes(faculty._id)) {
                facultyNames.push({ _id: faculty._id, name: faculty.name });
            }
        });
        content._doc.facultyNames = facultyNames;
        content._doc.url = content._doc?.upload?.url ? cloudFrontService.getStreamUrls(content._doc?.upload?.url) : "";
    });

    return contents;
}

const processContentRelatedDataAndAggregations = async (contents) => {
    let aggregations = {};
    if (contents?.length > 0) {
        let searchRequest = null;
        // institutes data
        const instituteIds = contents.map(content => content.instituteId)
            .filter(id => ObjectId.isValid(id));
        let filters = {
            _id: instituteIds
        };
        const institutes = await queryBuilder.getQueryResults(Institute, null, { filters }, false);

        // uploads data
        const contentPoolIds = contents.map(content => content.id)
            .filter(id => ObjectId.isValid(id));
        filters = {
            contentPoolId: contentPoolIds
        };
        
        searchRequest = buildQueryRequest({ filters });
        const { results: uploads } = await ContentResourcePoolUploadDb.search(searchRequest);

        // categories data
        const categoryIds = contents.map(content => content.categories).flat()
            .filter(id => ObjectId.isValid(id));
        filters = {
            _id: categoryIds
        };
        const { results: categories } = await categoryService.listMinimalCategory({ filters });//await queryBuilder.getQueryResults(Category, null, { filters }, false);

        // subjects data
        // const subjectIds = contents.map(content => content.subjects).flat()
        //     .filter(id => ObjectId.isValid(id));
        // filters = {
        //     _id: subjectIds
        // };
        const subjects = [];//await queryBuilder.getQueryResults(Subject, null, { filters }, false);

        // faculties data
        const facultyIds = contents.map(content => content.faculties).flat()
            .filter(id => ObjectId.isValid(id));
        filters = {
            _id: facultyIds
        };
        const faculties = await queryBuilder.getQueryResults(Faculty, null, { filters }, false);

        contents = attachContentRelatedData(
            contents, {
                institutes, uploads, categories, subjects, faculties
            }
        );

        aggregations = { subjects, categories, faculties };
    }

    return { results: contents, aggregations };
}

const getAllContents = async (searchParams,query) => {
    let user={}
    let instituteId = searchParams?.instituteId ?? null;
    if (user?.role == "institute") {
        const institute = await Institute.findOne({ userId: user._id });
        if (!institute) throw { message: "Institution not found", httpcode: 404 };
        instituteId = institute._id.toString();
    }

    if(instituteId) {
        if(searchParams.filters) searchParams.filters.instituteId = instituteId;
        else searchParams.filters = { instituteId };
    }
    
    searchParams.select = 'title.value description fileName tags';
    let searchRequest = buildQueryRequest(searchParams);
    let contents = await ContentResourcePoolDb.adminSearch(searchRequest);

    let { results, aggregations } = await processContentRelatedDataAndAggregations(contents?.results ?? []);
    contents.results = results;
    contents.aggregations = aggregations;

    return contents;
}

const deleteContents = async (contents) => {
    let promises = [];
    contents.forEach(content => {
        promises.push(deleteContentAndRelatedData(content));
    });

    return await Promise.all(promises);
};

const deleteContentAndRelatedData = async (content) => {
    switch (content.contentType) {
            case "video": return await videoService.deleteById(content.contentId);
            case "note": return await noteService.deleteById(content.contentId);
        }
    return false;
}

const importContentsFromVideos = async (searchParams) => {
    if(!searchParams?.query?.size) searchParams.query.size = 100;
    if(!searchParams?.query?.page) searchParams.query.page = 0;
    let searchRequest = buildQueryRequest(searchParams);
    const videosResults = await videoService.getVideos(null,searchRequest);
    const videos = videosResults?.results ?? null;
    if(!videos || videos.length == 0) {
        return {
            message: "Videos not found",
            totalPages: videosResults?.total ? Math.ceil(videosResults?.total / searchParams?.query?.size) : 0
        };
    }

    const response = await this.moveContentsToContentPool(videos);

    const successCount = response.reduce((a, v) => (v === true ? a + 1 : a), 0);
    const failureCount = response.reduce((a, v) => (v !== true ? a + 1 : a), 0);
    return {
        message: `${successCount} imported, ${failureCount} failed`,
        totalPages: videosResults?.total ? Math.ceil(videosResults?.total / searchParams?.query?.size) : 0
    };
}


exports.moveContentsToContentPool = async (videos) => {
    //const language = await Language.findOne({ name: /^english$/i });
    const language ={
        _id:""
    }
    return await Promise.all(videos.map(async (video) => {
        if(!video?.url) return { message: "Url missing" };
        const contentFound = await ContentResourcePoolUploadDb.findByCondition({ url: video?.url });
        if(contentFound) return { message: "Already found" };
        const course = video.courseId
                ? await courseService.getCourseModule(video.courseId)
                : {};
        const data = {
            instituteId: course ? course?.institutionId : "",
            contentType: "video",
            guid: uuidv4(),
            fileName: video?.title ?? "",
            duration: video?.duration ?? 0,
            title: (language && video?.name)
            ? [
                {
                    languageId: language._id,
                    value: video?.name ?? ""
                }
            ] : [],
            description: video?.description ?? "",
            thumbnail: video?.thumbnail ?? "",
            tags: video?.tags ?? [],
            categories: video?.categories ?? [],
            faculties: video?.facultyId ? [video?.facultyId] : [],
            createdBy: video?.createdByUser ?? "",
            updatedBy: video?.updatedByUser ?? "",
            createdAt: video?.createdAt ?? "",
            updatedAt: video?.updatedAt ?? ""
        };
        
        let contentPool = await ContentResourcePoolDb.create(data);
            
        const uploadData = {
                instituteId: data.instituteId,
                guid: data.guid,
                contentPoolId: contentPool._id,
                url: video?.url,
                fileName: data.fileName,
                contentType: data.contentType,
                status: "completed",
                startedAt: data.createdAt,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            };
        await ContentResourcePoolUploadDb.create(uploadData);
        return true;
    }));
}

const uploadThumbnail = async (postDetails, path) => {
    let fileName = `${uuidv4()}.${postDetails.extension}`
    let filePath = `${path}/${fileName}`;
    let response = await createPresignedUrl(filePath, postDetails.contentType);
    return response
}

const importContentsToCurriculum = async (data) => {
    const curriculum = await checkCurriculumChapter(data.chapterId);
    if(!curriculum) return null;
    const response =  await copyAndImportContents(curriculum,data.curriculumId, data.subjectId, data.sectionId, data.chapterId,data.titleId, data.contentIds);
    return response;
}

const checkCurriculumChapter = async (chapterId,) => {
    return await curriculumService.getChapterById(chapterId)
}

const copyAndImportContents = async (curriculum,curriculumId, subjectId, sectionId, chapterId,titleId, contentIds) => {
    // let promises = [];
    let promises = contentIds.map(contentId => saveContentToCurriculum(curriculum,curriculumId, subjectId, sectionId,chapterId,titleId,contentId));
    return await Promise.all(promises);
}
const saveContentToCurriculum = async (curriculum,curriculumId, subjectId, sectionId, chapterId,titleId, contentId) => {
    let content = await getContentById(contentId);
    if(!content) return null;
    let data = {
        title: content.title[0].value,
        courseId: curriculum.courseModuleId,
        thumbnail: content.thumbnail,
        duration: content.duration,
        tags: content.tags,
        description: content.description,
        categories: content.categories,
        type: content.contentType =="video" ? "video" : "note",
        contentType: content.contentType=="video" ? "videos" : "notes"
    };
    let uploadData = await ContentResourcePoolUploadDb.findByCondition({ contentPoolId: content._id });
    if(uploadData) data.url = uploadData?.url;
    return await curriculumService.addContent(curriculumId, subjectId, sectionId, chapterId, titleId, data.type, data)
}

const getContentById = async (contentId) => {
    return ContentResourcePoolDb.findByCondition({
        _id: contentId
    });
}

const createManyContents = async (contents) => {
    let videos = contents.filter(content => content.type == "video")
    let response
    if (videos.length > 0) {
        response = await videoService.insertMany(contents);
    }
    return response;
  
}

const getSignedCookie = async (contentId) => {
    let upload = await ContentResourcePoolUploadDb.findByCondition({
        contentPoolId: contentId,
        contentType: "video"
    });

    if (!upload) return { streamUrl: "" };

    let url = cloudFrontService.getStreamUrls(upload.url);
    let cookie = await cloudFrontService.createSignedCookie(url, envConfig.cloudFront.signedCookie.maxAge);
    return {
        streamUrl: url,
        cookie
    };
}

module.exports = {
    createManyContents,
    startUploadContents,
    contentsUploadCompleted,
    updateManyContents,
    getAllContents,
    deleteContents,
    importContentsFromVideos,
    uploadThumbnail,
    importContentsToCurriculum,
    getSignedCookie
}