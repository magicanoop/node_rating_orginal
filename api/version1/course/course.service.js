const CourseMasterModel = require('./models/course_master.model');
const CourseModuleModel = require('./models/course_module.model');
const makeCourseDb = require('./DAO/courseMasterDAO');
const makeCourseModelDb = require('./DAO/courseModuleDAO');
const { NotFoundError, BadRequestError } = require('../../../utils/api_error_util');

const courseMasterDb = makeCourseDb({ CourseMasterModel });
const courseModuleDb = makeCourseModelDb({ CourseModuleModel });

const BuildQueryRequest = require('./../../queryBuilder');
const buildQueryRequest = new BuildQueryRequest(require("regex-escape"), { asc: 1, desc: -1 })

const instituteService = require('../../version0/services/institute.service');
const categoryService = require('../category/category.service');
const curriculumService = require('../curriculum/curriculum.service');
const subscriptionService = require('../../version0/services/subscriptionService');
const userService = require('../../version0/services/user.services');
const facultyService = require('../../version0/services/faculty.service');
const planService = require('../plan/plan.service');
const db = require('../../version0/models');
const User = db.users;

const CurriculumModel = require('../curriculum/models/course_curriculum.model');
const makeCurriculumDb = require('../curriculum/DAO/curriculumDAO');

const courseCurriculumDb = makeCurriculumDb({ CurriculumModel });

const excelToJson = require("convert-excel-to-json");

const { subscription: SubscriptionModel } = require('../../version0/models');

const categoryDetails = (categoryIds, course, field) => {
    let categoryDetails = []
    categoryIds.forEach(category => {
        course[field].forEach(cat => {
            if (category._id == cat) {
                categoryDetails.push({ _id: category._id, title: category.title })
            }
        })
    });
    return categoryDetails;
}

const processCourseListAndDetailsList = (courses, [institutes, mainCategories, subCategories]) => {
    if (Array.isArray(courses)) {
        let newResults = courses.map((course) => {
            course = course.toObject()
            let instituteName = ""
            let mainCategoryList = []
            let subCategoryList = []
            if (institutes && institutes.length > 0) {
                let instituteDetails = institutes.find(institute => institute._id == course.instituteId)
                instituteName = instituteDetails?.name || ""
            }
            if (mainCategories && mainCategories.length > 0) {
                mainCategoryList = categoryDetails(mainCategories, course, "mainCategories")
            }
            if (subCategories && subCategories.length > 0) {
                subCategoryList = categoryDetails(subCategories, course, "subCategories")
            }
            course.instituteName = instituteName;
            course.mainCategories = mainCategoryList;
            course.subCategories = subCategoryList;
            return course;
        })
        return newResults
    } else {
        let course = courses.toObject();
        let instituteName = ""
        let mainCategoryList = []
        let subCategoryList = []
        if (institutes && institutes.length > 0) {
            let instituteDetails = institutes.find(institute => institute._id == course.instituteId)
            instituteName = instituteDetails?.name || ""
        }
        if (mainCategories && mainCategories.length > 0) {
            mainCategoryList = categoryDetails(mainCategories, course, "mainCategories")
        }
        if (subCategories && subCategories.length > 0) {
            subCategoryList = categoryDetails(subCategories, course, "subCategories")
        }
        course.instituteName = instituteName;
        course.mainCategories = mainCategoryList;
        course.subCategories = subCategoryList;
        return course;
    }

};

const getCourseContentDetails = async (queryResult, fields = ["mainCategories", "subCategories", "institute"]) => {
    let promiseArray = [];
    if (Array.isArray(queryResult.results)) {
        if (fields.includes("institute")) {
            let instituteIds = queryResult.results.map((course) => course.instituteId);
            promiseArray.push(instituteService.getInstituteDetailsForCourses(instituteIds));
        }
        if (fields.includes("mainCategories")) {
            let mainCategoriesIds = queryResult.results.map((course) => course.mainCategories);
            promiseArray.push(categoryService.getCateriesForCourses(mainCategoriesIds));
        }
        if (fields.includes("subCategories")) {
            let subCategoriesIds = queryResult.results.map((course) => course.subCategories);
            promiseArray.push(categoryService.getCateriesForCourses(subCategoriesIds));
        }
        let detailedResults = await Promise.all(promiseArray);
        let courseDetailedList = processCourseListAndDetailsList(queryResult.results, detailedResults);
        return courseDetailedList;
    } else {
        if (fields.includes("institute")) {
            let instituteId = queryResult.instituteId;
            promiseArray.push(instituteService.getInstituteDetailsForCourses(instituteId));
        }
        if (fields.includes("mainCategories")) {
            let mainCategoriesIds = queryResult.mainCategories;
            promiseArray.push(categoryService.getCateriesForCourses(mainCategoriesIds));
        }
        if (fields.includes("subCategories")) {
            let subCategoriesIds = queryResult.subCategories;
            promiseArray.push(categoryService.getCateriesForCourses(subCategoriesIds));
        }
        let detailedResults = await Promise.all(promiseArray);
        let courseDetailedList = processCourseListAndDetailsList(queryResult, detailedResults);
        return courseDetailedList;
    }
}

const addCourseMaster = (details) => {
    return courseMasterDb.insert(details);
}

const updateCourseMaster = async (id, details) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: id,
        }
    });
    let options = {
        new: true
    };
    const response = await courseMasterDb.update(findRequest, details, options);
    if (!response) {
        throw new NotFoundError(`Course Master not found`)
    }
    return response
}

const deleteCourseMaster = async (id) => {
    let findRequest = buildQueryRequest({ filters: { courseMasterId: id }, select: '_id courseMasterId' });
    let coursmodules = await courseModuleDb.findByCourseMaster(findRequest);
    let subscription = await SubscriptionModel.find({
        courseId: {
            $in: coursmodules.results?.map(courseModule => courseModule._id)
        },
        isActive: true
    });
    if (subscription.length) throw new BadRequestError(`Course is subscribed`)
    await courseModuleDb.deleteMany(id);
    const response = await courseMasterDb.remove(id);
    if (!response) throw new NotFoundError(`Course Master not found`)
    return response
}

const addCourseModel = async (details) => {
    let searchRequest = buildQueryRequest({
        filters: {
            courseMasterId: details.courseMasterId,
            moduleType: details.moduleType,
            planType: details.planType
        }
    });
    const course = await courseModuleDb.findByCourseMaster(searchRequest);
    if (course.results.length) throw new BadRequestError(`Course already exists`)
    const response = await courseModuleDb.insert(details);
    let findRequest = buildQueryRequest({
        filters: {
            _id: response.courseMasterId,
        }
    });
    let updateQuery = {
        $push: {
            "courseModules": {
                type: response.moduleType,
                moduleId: response._id
            }
        }
    };
    let options = {
        new: true
    };
    await courseMasterDb.update(findRequest, updateQuery, options);
    if (response.planType == "FREE") {
        let curriculum = await curriculumService.addCurriculum(response._id)
        await planService.addPlan({
            courseMasterId: response.courseMasterId,
            courseModuleId: response._id,
            courseCurriculumId: curriculum._id,
            price: 0,
            duration: 180
        })
    }
    return response
}

const moduleNameValidator = async (name, moduleType, planType, id = null) => {
    const response = await courseModuleDb.findByName(name, moduleType, planType);
    if (response && id && response._id != id) {
        throw new Error(`name already exists`);
    }
    if (response && !id) {
        throw new Error(`name already exists`);
    }
    return;
}
const masterNameValidator = async (name, id = null) => {
    const response = await courseMasterDb.findByName(name);
    if (response && id && response._id != id) {
        throw new Error(`name already exists`);
    }
    if (response && !id) {
        throw new Error(`name already exists`);
    }
    return;
}

const adminSearch =  async(searchParams) => {
    searchParams.searchFields = ['name']
    let searchRequest = await buildQueryRequest(searchParams);
    const courseMasters= await courseMasterDb.adminSearch(searchRequest)
    let detailedResults = await getCourseContentDetails(courseMasters);
    let findRequest = buildQueryRequest({
        filters: { courseMasterId: { $in: detailedResults.map(courseMaster => courseMaster._id) } },
        select: '-createdAt -updatedAt -state -country -promotionPoints -location'
    });
    const courseModules = await courseModuleDb.findByCourseMaster(findRequest);
    const response = detailedResults?.map(courseMaster => {
        courseMaster = courseMaster
        let courseList = []
        if (courseModules && courseModules.results.length > 0) {
            let courses = courseModules.results.filter(courseModule => courseModule.courseMasterId == courseMaster._id)
            courseList = courses ?? [];
        }
        courseMaster.courseModules = courseList;
        return courseMaster;
    })

    return {results:response,total:courseMasters.total}
}

const updateCoursemodule = async (id, details) => {
    let searchRequest = buildQueryRequest({
        filters: {
            courseMasterId: details.courseMasterId,
            moduleType: details.moduleType,
            planType: details.planType
        }
    });
    const course = await courseModuleDb.findByCourseMaster(searchRequest);
    if (course.results.length) throw new BadRequestError(`Course already exists`)
    let findRequest = buildQueryRequest({
        filters: {
            _id: id,
        }
    });
    let options = {
        new: true
    };
    const response = await courseModuleDb.update(findRequest, details, options);
    if (!response) {
        throw new NotFoundError(`Course Module not found`)
    }
    return response
}

const deleteCoursemodule = async (id) => {
    const subscription = await SubscriptionModel.findOne({ courseId: id, isActive: true })
    if (subscription) throw new BadRequestError(`Course is subscribed`)
    const response = await courseModuleDb.remove(id);
    let findRequest = buildQueryRequest({
        filters: {
            _id: response.courseMasterId,
        }
    });
    let updateQuery = {
        $pull: {
            "courseModules": {
                moduleId: response._id
            }
        }
    };
    let options = {
        new: true
    };
    await courseMasterDb.update(findRequest, updateQuery, options);
    await curriculumService.deleteCurriculumByCourseId(id);
    if (!response) {
        throw new NotFoundError(`Course Module not found`)
    }
    return response
}

const getAllCourseMasters = async () => {
    let searchRequest = buildQueryRequest({
        sort: {
            createdAt: 'desc'
        }
    })
    const courseMasters = await courseMasterDb.findAll(searchRequest);
    let detailedResults = await getCourseContentDetails(courseMasters);
    let findRequest = buildQueryRequest({
        filters: { courseMasterId: { $in: detailedResults.map(courseMaster => courseMaster._id) } },
        select: '-createdAt -updatedAt -state -country -promotionPoints -location'
    });
    const courseModules = await courseModuleDb.findByCourseMaster(findRequest);
    const response = detailedResults?.map(courseMaster => {
        courseMaster = courseMaster
        let courseList = []
        if (courseModules && courseModules.results.length > 0) {
            let courses = courseModules.results.filter(courseModule => courseModule.courseMasterId == courseMaster._id)
            courseList = courses ?? [];
        }
        courseMaster.courseModules = courseList;
        return courseMaster;
    })

    return response
}

const getAllCourseModules = async (searchParams) => {
    searchParams.select = '-createdAt -updatedAt -state -country -promotionPoints -location'
    let findRequest = buildQueryRequest(searchParams);
    const response = await courseModuleDb.findByCourseMaster(findRequest);
    return response
}

const getCourseModule = async (id) => {
    let response = await courseModuleDb.findById(id);
    if (!response) throw new NotFoundError(`Course not found`);
    let curriculum = await courseCurriculumDb.findByCourseModuleId(id);;
    let detailedResult = await getCourseContentDetails(response);
    detailedResult.curriculumId = curriculum?._id ?? "";
    return detailedResult
}

const softDeleteCourseModule = async (id) => {
    let message = "This content has been deleted"
    let findRequest = buildQueryRequest({
        filters: {
            _id: id,
        }
    });
    let updateQuery = {
        $set: {
            "name": message,
            "description": message,
            "imageUrl": message,
            "isDeleted": true
        }
    };
    let options = {
        new: true
    };
    const response = await courseModuleDb.update(findRequest, updateQuery, options);
    if (!response) {
        throw new NotFoundError(`Course Module not found`)
    }
    return response
}

const activateCourseModule = async (id) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: id,
        }
    });
    let updateQuery = {
        $set: {
            "isActive": true
        }
    };
    let options = {
        new: true
    };
    const response = await courseModuleDb.update(findRequest, updateQuery, options);
    if (!response) {
        throw new NotFoundError(`Course Module not found`)
    }
    return response
}

const deactivateCourseModule = async (id) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: id,
        }
    });
    let updateQuery = {
        $set: {
            "isActive": false
        }
    };
    let options = {
        new: true
    };
    const response = await courseModuleDb.update(findRequest, updateQuery, options);
    if (!response) {
        throw new NotFoundError(`Course Module not found`)
    }
    return response
}

const makeCourseModulePrivate = async (id) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: id,
        }
    });
    let updateQuery = {
        $set: {
            "isPrivate": true
        }
    };
    let options = {
        new: true
    };
    const response = await courseModuleDb.update(findRequest, updateQuery, options);
    if (!response) {
        throw new NotFoundError(`Course Module not found`)
    }
    return response
}

const makeCourseModulePublic = async (id) => {
    let findRequest = buildQueryRequest({
        filters: {
            _id: id,
        }
    });
    let updateQuery = {
        $set: {
            "isPrivate": false
        }
    };
    let options = {
        new: true
    };
    const response = await courseModuleDb.update(findRequest, updateQuery, options);
    if (!response) {
        throw new NotFoundError(`Course Module not found`)
    }
    return response
}

const getCourseMaster = async (id) => {
    const queryResult = await courseMasterDb.findById(id);
    if (!queryResult) {
        throw new NotFoundError(`Course Master not found`)
    }
    let detailedResult = await getCourseContentDetails(queryResult);
    return detailedResult
}

const getSubscriberCountByCourse = async (query) => {
    let response = await subscriptionService.findSubscriptionByQuery(query);
    let userIds = response.results.map(subscription => subscription.userId);
    let users = await userService.findUsersByQuery({
        _id: {
            $in: userIds
        }
    })
    return users.length;
};

const getCourseOverView = async (id) => {
    let totalLearnersQuery = {
        filters: {
            courseId: id
        }
    };
    let course = await getCourseModule(id);
    if (!course) throw new NotFoundError(`Course not found`);
    let totalLearners = await getSubscriberCountByCourse(totalLearnersQuery);
    let date = new Date(Date.now());
    let courseCompletdQuery = {
        filters: {
            courseId: id,
            isActive: true,
            planEndDate: {
                $lt: date,
            },
        }
    };
    let totalCourseCompletd = await getSubscriberCountByCourse(courseCompletdQuery);
    let filters = {
        courseMasterId: course.courseMasterId,
        _id: { $ne: id }
    }
    const courses = await getAllCourseModules({ filters })

    return {
        totalLearners,
        totalCourseCompletd,
        courses: courses.results

    };
}

const getFacultyByCourseId = async (id) => {
    let course = await courseModuleDb.findById(id);
    if (!course) throw new NotFoundError(`Course not found`)
    let response = await facultyService.getFacultyList(course.faculties.map(faculty => faculty));
    return response;
}

const getStudentUserAccount = async (data) => {
    try {
        const { name, emailId, phoneNumber } = data;
        let phone = phoneNumber.toString();
        if (!phone.startsWith("+91")) {
            phone = `+91${phone}`;
        }

        let user = await User.findOne({
            role: "student",
            $or: [{ emailId }, { phoneNumber }, { phoneNumber: phone }],
        });

        if (!user) {
            const student = await userService.createStudent({
                name,
                emailId,
                phoneNumber: phone,
                role: "student",
                isActive: true
            });
            user = student && student.httpcode == 200 ? student.data : null;
        }

        return user;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

const enrollStudentToCourse = async (data, plans) => {
    let selectedPlan = plans.filter((plan) => plan.duration == data.duration);
    if (selectedPlan.length == 0) throw new NotFoundError(`Plan not found`);
    const user = await getStudentUserAccount(data);
    if (!user) throw new NotFoundError(`Could'nt Create User`)

    let subscriptionDetails = {
        type: "course",
        userId: user._id.toString(),
        planId: selectedPlan[0]._id.toString(),
        remainingDays: data.remainingDays,
    };

    const response = await subscriptionService.enroll(subscriptionDetails, true);
    return response ? response.userId : "";
};

const processStudentExcelData = (file) => {
    return excelToJson({
        source: file.buffer,
        header: {
            // Is the number of rows that will be skipped and will not be present at our result object.
            // Counting from top to bottom
            rows: 1,
        },
        columnToKey: {
            A: "name",
            B: "emailId",
            C: "phoneNumber",
            D: "duration",
            E: "remainingDays",
        },
    });
};

const iterateStudentsThroughSheets = async (sheets, plans) => {
    let promises = [];
    for (const key in sheets) {
        if (Object.hasOwnProperty.call(sheets, key)) {
            const rows = sheets[key];
            rows.forEach((row) => {
                promises.push(enrollStudentToCourse(row, plans));
            });
        }
    }
    return await Promise.all(promises)
}

const importStudents = async (curriculumId, file) => {
    const curriculum = await curriculumService.getCurriculumById(curriculumId);

    if (!curriculum) throw new NotFoundError(`Curriculum not found`)
    // if (curriculum.type !== "paid") throw responseHelper.createCustomResponse(404, responseMessages.studentImportCouldntImportToThisCurriculum);

    let plans = await planService.findByCondition({
        courseModuleId: curriculum.courseModuleId,
        courseCurriculumId: curriculum._id.toString(),
    });
    plans = plans.results;
    if (!plans || plans.length == 0) {
        throw new NotFoundError(`Plan not found`)
    }

    const sheets = processStudentExcelData(file);
    return await iterateStudentsThroughSheets(sheets, plans);
};



module.exports = {
    addCourseMaster,
    updateCourseMaster,
    deleteCourseMaster,
    addCourseModel,
    moduleNameValidator,
    masterNameValidator,
    adminSearch,
    updateCoursemodule,
    deleteCoursemodule,
    getAllCourseMasters,
    getAllCourseModules,
    getCourseModule,
    softDeleteCourseModule,
    deactivateCourseModule,
    activateCourseModule,
    makeCourseModulePrivate,
    makeCourseModulePublic,
    getCourseMaster,
    getCourseOverView,
    getFacultyByCourseId,
    importStudents
}