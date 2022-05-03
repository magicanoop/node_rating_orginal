const config = require("config");
const jwtServices = require("./../services/jwtServices");
const responseHelper = require("./responseHelper");
const responseMessages = require("./../constants/messages");
const { question, course, institute, result } = require("../models");
const logger = require('./../../../config/winston.config')
const path = require("path");
const excel = require('node-excel-export');
const pdf = require("html-pdf");
const multer = require('multer');
const { response } = require("express");

const divOpen = "<div style='margin: 50px; min-height : 100vh; border : 1px solid black; padding : 50px ; font-size : 2rem'>";
const divClose = "</div>";
/**
 * To genrate a PDF from HTML tag/string
 * @param {data} object - defines the data to show in PDF
 */
const genrateHtmlTemplate = (data) => {
  try {
    let htmlString = "";
    if (Array.isArray(data)) {
      data.forEach((question) => {
        Object.keys(question).forEach((key) => {
          htmlString += question[key] + "<br>";
        });
      });
    } else {
      Object.keys(data).forEach((key) => {
        htmlString += data[key] + "<br>";
      });
    }
    return divOpen + htmlString + divClose;
  } catch (error) {
    console.log(error);
    return;
  }
};


const getFacultyIdsFromCourse = (courseDetails) => {
  let facultyObj = courseDetails.faculties;
  if (facultyObj && facultyObj.length > 0) {
    return facultyObj.map((item) => item.facultyId);
  } else {
    throw responseHelper.createCustomResponse(404, responseMessages.notFound);
  }
};

const getContentIdFromSection = (sections, sectionId, contentType) => {
  let section = sections.filter((section) => {
    if (section.isActive) {
      return section._id == sectionId;
    }
  });
  if (section.length > 0) {
    section = section[0];
    if (section && section[contentType] && section[contentType].length > 0) {
      return section[contentType].map((video) => {
        if (video.isActive) {
          return video.id;
        }
      });
    } else {
      throw responseHelper.createCustomResponse(404, responseMessages.notFound);
    }
  } else {
    throw responseHelper.createCustomResponse(404, responseMessages.notFound);
  }
};

const getActiveContentLength = (sections, type) => {
  let count = 0;
  if (sections.length > 0) {
    sections.forEach((section) => {
      count += section.hasOwnProperty(type) ? getActiveLength(section[type]) : 0;
    });
  }
  return count;
};

const getActiveLength = (contentList) => {
  let count = 0;
  if (contentList.length > 0) {
    contentList.forEach((content) => {
      count += content.isActive ? 1 : 0;
    });
  }
  return count;
};

const getSectionUpdateBody = (body, type) => {
  let updateBody = {};
  if (body.hasOwnProperty("isActive")) {
    updateBody[`${type}.$.isActive`] = body.isActive;
  }
  if (body.hasOwnProperty("name")) {
    updateBody[`${type}.$.name`] = body.name;
  }
  if (body.hasOwnProperty("videos")) {
    updateBody[`${type}.$.videos`] = body.videos;
    updateBody[`${type}.$.videoCount`] = getActiveLength(body.videos);
  }
  if (body.hasOwnProperty("tests")) {
    updateBody[`${type}.$.tests`] = body.tests;
    updateBody[`${type}.$.testCount`] = getActiveLength(body.tests);
  }
  if (body.hasOwnProperty("notes")) {
    updateBody[`${type}.$.notes`] = body.notes;
    updateBody[`${type}.$.notesCount`] = getActiveLength(body.notes);
  }
  return updateBody;
};

const getSectionCreateBody = (body) => {
  let updateBody = {};
  if (body.hasOwnProperty("isActive")) {
    updateBody[`isActive`] = body.isActive;
  }
  if (body.hasOwnProperty("name")) {
    updateBody[`name`] = body.name;
  }
  if (body.hasOwnProperty("videos")) {
    updateBody[`videos`] = body.videos;
    updateBody[`videoCount`] = getActiveLength(body.videos);
  }
  if (body.hasOwnProperty("tests")) {
    updateBody[`tests`] = body.tests;
    updateBody[`testCount`] = getActiveLength(body.tests);
  }
  if (body.hasOwnProperty("notes")) {
    updateBody[`notes`] = body.notes;
    updateBody[`notesCount`] = getActiveLength(body.notes);
  }
  return updateBody;
};

const processCouseResults = (topCourses, institutes) => {
  let result = [];
  topCourses.forEach((topCourse) => {
    let instituteName = "";
    institutes.forEach((institute) => {
      if (topCourse.institutionId == institute._id) {
        instituteName = institute.name;
      }
    });
    result.push({
      ...topCourse.toObject(),
      instituteName,
    });
  });
  return result;
};

const processCouseLanguageResults = (topCourses, institutes) => {
  let result = [];
  topCourses.forEach((topCourse) => {
    let languageName = "";
    institutes.forEach((institute) => {
      if (topCourse.languageId == institute._id) {
        languageName = institute.name;
      }
    });
    result.push({
      ...topCourse,
      languageName,
    });
  });
  return result;
};
const processPlanTaxResults = (plans, taxs) => {
  let result = [];
  plans.forEach((plan) => {
    let taxObj = {};
    taxs.forEach((taxResp) => {
      if (plan._id == taxResp.planId) {
        taxObj = taxResp;
      }
    });
    result.push({
      ...plan.toObject(),
      taxObj,
    });
  });
  return result;
};

const getRelatedIdsFromCourse = (courseDetails) => {
  let facultyObj = courseDetails.relatedCourse;
  if (facultyObj && facultyObj.length > 0) {
    return facultyObj.map((item) => item.courseId);
  } else {
    throw responseHelper.createCustomResponse(404, responseMessages.notFound);
  }
};

const processPlanAndCourseResults = (plans, courses) => {
  let result = [];
  courses.forEach((course) => {
    let plan = {};
    plans.forEach((planItem) => {
      if (planItem.courseId == course.id) {
        plan = planItem;
      }
    });
    result.push({
      ...course.toObject(),
      plan,
    });
  });
  return result;
};

const getContentIdsFromCurriculum = (curriculums, type) => {
  let ids = [];
  curriculums.forEach((curriculum) => {
    if (curriculum.section.length > 0) {
      curriculum.section.forEach((section) => {
        if (section[type].length > 0) {
          section[type].forEach((content) => {
            ids.push(content.id);
          });
        }
      });
    }
  });
  return ids;
};

const processSingleContentResults = (singleContents, owners) => {
  let result = [];
  singleContents.forEach((singleContent) => {
    let owner = "";
    owners.forEach((ownerObj) => {
      if (ownerObj._id == singleContent.ownerId) {
        owner = ownerObj.name;
      }
    });
    if (singleContent.constructor.name === "model") {
      singleContent = singleContent.toObject();
    }
    result.push({
      ...singleContent,
      owner,
    });
  });
  return result;
};

const processCouseSectionResults = (topCourses, institutes) => {
  let result = [];
  topCourses.forEach((topCourse) => {
    let sectionName = "";
    institutes.forEach((institute) => {
      if (topCourse.sectionId == institute._id) {
        sectionName = institute.name;
      }
    });
    result.push({
      ...topCourse,
      sectionName,
    });
  });
  return result;
};

const processCousePlanResults = (topCourses, plansReponse) => {
  let result = [];
  topCourses.forEach((topCourse) => {
    let plan = {};
    plansReponse.forEach((planObj) => {
      if (topCourse._id == planObj.courseId) {
        plan = planObj;
      }
    });
    result.push({
      ...topCourse,
      plan,
    });
  });
  return result;
};

const processContentSectionResults = (contents, sections) => {
  let result = [];
  contents.forEach((content) => {
    sections.forEach((section) => {
      if (content.sectionId == section._id) {
        result.push({
          section: section,
          contents: content.contents,
          count: content.count,
        });
      }
    });
  });
  return result;
};

const processBookmarkResult = (contents, bookmarks) => {
  let result = [];
  bookmarks.forEach((bookmark) => {
    contents.forEach((content) => {
      if (content.id == bookmark.itemId) {
        result.push({ ...content.toObject(), bookmarkId: bookmark.id, curriculumId: bookmark.curriculumId });
      }
    });
  });
  return result;
};

const getCoursePeriod = (subscription, courseObj) => {
  courseObj.isExpired = true;
  courseObj.remainingDays = 0;
  courseObj.isSubscribed = false;
  if (subscription) {
    let endDate = new Date(subscription.planEndDate);
    courseObj.isSubscribed = true;
    if (new Date() < endDate) {
      const diffTime = Math.abs(endDate - new Date());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      courseObj.remainingDays = diffDays;
      courseObj.isExpired = false;
    }
  }
  return courseObj;
};
const processMycoursesResult = (subscriptions, courses) => {
  let resultSet = [];
  if (subscriptions.length > 0) {
    courses.forEach((course) => {
      let sub = null;
      subscriptions.forEach((subscription) => {
        if (course._id == subscription.courseId || course._id == subscription.curriculumId) {
          sub = subscription;
        }
      });
      resultSet.push(getCoursePeriod(sub, course.toObject()));
    });
    return resultSet;
  } else {
    courses.forEach((course) => {
      let sub = null;
      resultSet.push(getCoursePeriod(sub, course.toObject()));
    });
    return resultSet;
  }
};

const processSingleContentResult = (subscriptions, courses) => {
  let resultSet = [];
  if (subscriptions.length > 0) {
    courses.forEach((course) => {
      let sub = null;
      subscriptions.forEach((subscription) => {
        if (course._id == subscription.courseId || course._id == subscription.curriculumId) {
          sub = subscription;
        }
      });
      resultSet.push(getCoursePeriod(sub, course));
    });
    return resultSet;
  } else {
    courses.forEach((course) => {
      let sub = null;
      resultSet.push(getCoursePeriod(sub, course));
    });
    return resultSet;
  }
};

const createManyAnswerObjects = (questions, userId, testId, attemptNo, testDetails) => {
  let order = 0;
  let res = [];
  testDetails.questionSections.forEach(section => {
    let questionNo = 0;
    section.questionIds.forEach(questionId => {
      questions.results.forEach((question) => {
        if (questionId == question._id) {
          questionNo++;
          res.push({
            questionId: question._id,
            userId,
            testId,
            attemptNo,
            order: order++,
            questionNo
          });
        }
      });
    })
  });
  return res;
};

const processQuestionAndAnswers = (answers, questions) => {
  let result = [];
  answers.forEach((answer) => {
    questions.forEach((question) => {
      if (question._id == answer.questionId) {
        question = getQuestionAndAnswer(question)
        result.push({
          ...question.toObject(),
          userAnswer: answer.toObject(),
        });
      }
    });
  });
  return result;
};

const processRankAndUsers = (users, results, totalMark) => {
  let response = [];
  results.forEach((result) => {
    users.forEach((user) => {
      if (result._id == user._id) {
        response.push({
          user: user.toObject(),
          result: result.items[0],
          totalMark,
        });
      }
    });
  });
  return response;
};

const docContentParser = (headers, rows) => {
  let out = {};
  let opArray = [];
  if (headers.length === rows.length) {
    for (let i = 0; i < headers.length; i++) {
      let key = headers[i];
      if (key.match(/<p>([^<]+)<\/p>/) && key.match(/<p>([^<]+)<\/p>/).length > 0) {
        key = key.match(/<p>([^<]+)<\/p>/)[1];
        if (key == "SL_NO") {
          if (Object.keys(out).length > 0) {
            opArray.push(out);
            out = {};
          }
        }
        out[key] = rows[i].replace(/[\n\t]+/g, "<br/>");
      }
    }
    opArray.push(out);
  }

  return opArray;
};

// const getDownloadUrl = (url) => {
//   let obj = {};
//   resolutions.forEach(resolution => { obj[resolution] = url });
//   return obj;
// }

const getStreamUrls = (url) => {
  let fileName = path.basename(url).split('.').slice(0, -1).join('.');
  let baseUrl = `${config.cloudFront.url}${config.s3.outputPath}/${fileName}/HLS/`;
  let extension = ".m3u8"
  let obj = {
    default: `${baseUrl}${fileName}${extension}`
  }
  // resolutions.forEach(resolution => { obj[resolution] = `${baseUrl}${fileName}_${resolution}${extension}` });
  // return obj;
  return `${baseUrl}${fileName}${extension}`;
}

const getDownloadUrl = (url) => {
  let fileName = path.basename(url).split('.').slice(0, -1).join('.');
  let baseUrl = `${config.cloudFront.url}${config.s3.outputPath}/${fileName}/MP4/`;
  let extension = ".mp4"
  let obj = {
    default: `${baseUrl}${fileName}${extension}`
  }
  // resolutions.forEach(resolution => { obj[resolution] = `${baseUrl}${fileName}_${resolution}${extension}` });
  // return obj;
  return `${baseUrl}${fileName}${extension}`;
}

const getContentAndSubscriptionDetails = (subscription, courseObj, contents, type) => {
  courseObj.isExpired = true;
  courseObj.remainingDays = 0;
  courseObj.isSubscribed = false;
  if (subscription) {
    let endDate = new Date(subscription.planEndDate);
    courseObj.isSubscribed = true;
    if (new Date() < endDate) {
      const diffTime = Math.abs(endDate - new Date());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      courseObj.remainingDays = diffDays;
      courseObj.isExpired = false;
      if (type == "videos") {
        contents = contents.map((content) => {
          let contentObj = content.toObject();
          contentObj.downloadUrl = getDownloadUrl(contentObj.url)
          contentObj.url = getStreamUrls(contentObj.url);
          // contentObj.streamUrls = getStreamUrls(videoDetails.url)
          return contentObj;
        });
      }
    }
  }
  if (courseObj.isExpired && courseObj.remainingDays <= 0) {
    contents = contents.map((content) => {
      let contentObj = content.toObject();
      contentObj.url = "";
      contentObj.downloadUrl = ""
      return contentObj;
    });
  }
  return {
    content: contents,
    subscriptionDetails: courseObj,
  };
};

const getPerfomance = (total, accured) => {
  let percentage = (accured / total) * 100;

  if (percentage >= 90) {
    return "Excellent";
  }
  if (percentage >= 75) {
    return "Very Good";
  }
  if (percentage >= 50) {
    return "Good";
  }
  if (percentage >= 30) {
    return "Reasonable";
  }
  return "Bad";
};

const getScoreOfBEstResult = (obtaineMarksofanAttempt, resultItems) => {
  let bestResultScore = obtaineMarksofanAttempt.find(attemptDetails => (attemptDetails._id.testId == resultItems.testId && attemptDetails._id.attemptNo == resultItems.attemptNo));
  return bestResultScore.totalMarkObtained;
}
const processMyTestResults = (tests, results, obtaineMarksofanAttempt) => {
  let response = [];
  if (tests.length > 0) {
    tests.forEach((test) => {
      results.forEach((result) => {
        if (test._id == result._id) {
          let obj = {};
          let bestResult = result.items[0];
          let totalMark = test.totalMark;
          let markAccured = bestResult.items.score;
          obj.testDetails = test;
          obj.totalRank = bestResult.totalRank;
          obj.totalParticipants = bestResult.participants.length;
          obj.rankAcquired = bestResult.rank + 1;
          obj.perfomance = getPerfomance(totalMark, markAccured);
          let resultItems = bestResult.items
          if (obtaineMarksofanAttempt && obtaineMarksofanAttempt.length > 0) {
            resultItems.score = getScoreOfBEstResult(obtaineMarksofanAttempt, resultItems)
          }
          obj.bestResult = resultItems;
          response.push(obj);
        }
      });
    });
  }
  return response;
};

const isCategoryUsedInCourse = (categoryIds, courses) => {
  return new Promise((resolve) => {
    categoryIds.forEach((categoryId) => {
      courses.forEach((course) => {
        if (course.categories.indexOf(categoryId) > -1) {
          resolve(true);
        }
      });
    });
    resolve(false);
  });
};

const processBookmarkSubscription = (bookmarks, curriculums, type) => {
  let result = [];
  bookmarks.forEach((bookmark) => {
    curriculums.forEach((curriculum) => {
      if (curriculum._id == bookmark.curriculumId) {
        bookmark.isExpired = curriculum.isExpired;
        bookmark.remainingDays = curriculum.remainingDays;
        bookmark.isSubscribed = curriculum.isSubscribed;
        bookmark.curriculumType = curriculum.type
        if (type == "video") {
          bookmark.url = getStreamUrls(bookmark.url)
          bookmark.downloadUrl = getDownloadUrl(bookmark.url)
        }
        if (bookmark.isExpired && bookmark.remainingDays <= 0) {
          bookmark.url = "";
          bookmark.downloadUrl = "";
        }
        if (curriculum.hasOwnProperty("content")) {
          bookmark.type = "single_content";
        } else {
          bookmark.type = "course";
        }
        result.push(bookmark);
      }
    });
  });
  return result;
};

const getActiveFromSections = (sections) => {
  let days = [];
  sections.forEach((day) => {
    if (day.isActive) {
      if (day.videos.length > 0) {
        day.videos = day.videos.filter((day) => day.isActive);
      }
      if (day.notes.length > 0) {
        day.notes = day.notes.filter((day) => day.isActive);
      }
      if (day.tests.length > 0) {
        day.tests = day.tests.filter((day) => day.isActive);
      }
      if (day.tests.length > 0 || day.notes.length > 0 || day.videos.length > 0) days.push(day);
    }
  });
  return days;
};

const getActiveCurriculum = (curriculum) => {
  if (curriculum.days.length > 0) {
    curriculum.days = getActiveFromSections(curriculum.days);
  }
  if (curriculum.section.length > 0) {
    curriculum.section = getActiveFromSections(curriculum.section);
  }
  if (curriculum.dates.length > 0) {
    curriculum.dates = getActiveFromSections(curriculum.dates);
  }

  curriculum.videoCount = getActiveContentLength(curriculum?.section ?? [], "videos");
  curriculum.notesCount = getActiveContentLength(curriculum?.section ?? [], "notes");
  curriculum.testCount = getActiveContentLength(curriculum?.section ?? [], "tests");

  if (curriculum.dates.length > 0 || curriculum.section.length > 0 || curriculum.days.length > 0) {
    return curriculum;
  } else {
    return null;
  }
};
const hasPlan = (plans, curriculum) => {
  let hasPlan = false;
  plans.forEach((plan) => {
    if (plan.curriculumId == curriculum._id && plan.isActive) {
      hasPlan = true;
    }
  });
  return hasPlan;
};
const processStudentsCurriculumResult = (subscriptions, courses, plans) => {
  let resultSet = [];
  if (subscriptions.length > 0) {
    courses.forEach((course) => {
      let sub = null;
      subscriptions.forEach((subscription) => {
        if (course._id == subscription.courseId || course._id == subscription.curriculumId) {
          sub = subscription;
        }
      });
      let activeCurriculum = getActiveCurriculum(course.toObject());
      if (activeCurriculum) {
        resultSet.push(getCoursePeriod(sub, activeCurriculum));
      }
    });
  } else {
    courses.forEach((course) => {
      let activeCurriculum = getActiveCurriculum(course.toObject());
      if (activeCurriculum) {
        resultSet.push(getCoursePeriod(null, getActiveCurriculum(course.toObject())));
      }
    });
  }
  if (plans) {
    let result = [];
    resultSet.forEach((resultObj) => {
      if (hasPlan(plans, resultObj)) {
        result.push(resultObj);
      }
    });
    return result;
  } else {
    return resultSet;
  }
};

const getClosestClass = (batch) => {
  var temp = batch.occurrences.map((d) => Math.abs(new Date() - new Date(d.start_time).getTime()));
  var idx = temp.indexOf(Math.min(...temp));
  const closest = batch.occurrences[idx];
  return {
    meetingDetails: batch.meetingDetails,
    occurrence: closest,
  };
};
const processLiveClass = (liveClass, liveBatch) => {
  let response = [];
  liveClass.forEach((live) => {
    liveBatch.forEach((batch) => {
      if (batch.liveId == live._id) {
        let nextClass = getClosestClass(batch);
        response.push({
          ...live.toObject(),
          ...nextClass,
        });
      }
    });
  });
  return response;
};

let getSectionFromTest = (test, sectionId) => {
  let section = {};
  if (test.questionSections.length) {
    test.questionSections.forEach((questionSection) => {
      if (questionSection._id == sectionId) {
        section = questionSection;
      }
    });
  }
  return section;
};

const processCourseAndCurriculum = (cuorses, curriculums) => {
  let response = [];
  curriculums.forEach((curriculum) => {
    cuorses.forEach((cuorse) => {
      if (cuorse._id == curriculum.courseId) {
        response.push({
          ...cuorse,
          curriculumId: curriculum._id,
        });
      }
    });
  });
  return response;
};

const getQuestionIdsFromTest = (questionSections) => {
  let ids = [];
  questionSections.forEach((section) => {
    if (section.questionIds.length > 0) {
      ids = ids.concat(section.questionIds);
    }
  });
  return ids;
};
const getQuestionAndAnswer = (question) => {
  if (question.options.length > 0) {
    question.options = question.options.filter(option => option.value.length > 0);
    return question
  }
}
const addQuestionsInSection = (questions, questionIds) => {
  let questionList = [];
  questionIds.forEach((questionId) => {
    let questionObj = {};
    questions.forEach((question) => {
      if (questionId == question._id) {
        questionObj = getQuestionAndAnswer(question);
        questionList.push(questionObj);
      }
    });
  });
  return questionList;
};
const addQuestionsIntoSection = (questionSections, allQuestions) => {
  let ids = [];
  questionSections.forEach((section) => {
    section = section.toObject();
    if (section.questionIds.length > 0) {
      section.questions = addQuestionsInSection(allQuestions, section.questionIds);
      ids.push(section);
    }
  });
  return ids;
};

const getNearestOccurance = (occurrences) => {
  if (!occurrences || occurrences.length === 0) return {};
  const today = new Date();
  const closest = occurrences.reduce((a, b) => (a.start_time - today < b.start_time - today ? a : b));
  return closest;
};
const processLiveClassAndBatchResultWithoutUser = (liveClasses) => {
  let results = [];
  liveClasses.forEach((liveClass) => {
    let liveClassObj = liveClass.toObject();
    let closestOccurance = getNearestOccurance(liveClass.occurrences);
    liveClassObj.occurrence = closestOccurance;
    liveClassObj.meetingDetails = liveClass.meetingDetails;
    results.push(liveClassObj);
  });
  return results;
};

const processLiveClassAndBatchResultWithUser = (liveClasses, liveBatches, userId) => {
  let results = [];
  liveClasses.forEach((liveClass) => {
    let liveClassObj = liveClass.toObject();
    let closestOccurance = getNearestOccurance(liveClass.occurrences);
    liveClassObj.occurrence = closestOccurance;
    delete liveClassObj["occurrences"];
    if (userId && liveBatches.length > 0) {
      liveBatches.forEach((liveBatch) => {
        if (liveClass._id == liveBatch.liveId) {
          liveClassObj.meetingDetails = liveBatch.meetingDetails;
        }
      });
    } else {
      liveClassObj.meetingDetails = {};
    }
    results.push(liveClassObj);
  });
  return results;
};

const processLiveClassResults = (liveClasses, userId) => {
  let results = [];
  liveClasses.forEach((liveClass) => {
    let liveClassObj = liveClass;
    let closestOccurance = getNearestOccurance(liveClassObj.occurrences);
    liveClassObj.occurrence = closestOccurance;
    liveClassObj.isSubscribed = liveClassObj?.users
      && liveClassObj.users.length > 0
      && liveClassObj.users.includes(userId);
    delete liveClassObj["occurrences"];
    if (!userId) {
      delete liveClassObj["meetingDetails"];
    }
    results.push(liveClassObj);
  });
  return results;
};

const processAnswersOfAnAttempt = (testDetails, answersOfAnAttempt) => {
  testDetails = testDetails.toObject();
  let result = [];
  testDetails.questionSections.forEach((section) => {
    if (section.questionIds.length > 0) {
      let sectionResults = [];
      let sectionScore = 0;
      section.questionIds.forEach((questionId) => {
        answersOfAnAttempt.forEach((answer) => {
          if (answer._id == questionId) {
            sectionScore += answer.userAnswer.score;
            sectionResults.push(answer);
          }
        });
      });
      section.questions = sectionResults;
      section.sectionScore = sectionScore;
    }
  });
  return testDetails;
};

const processCourseTypeAndCurriculum = (courses, curriculums) => {
  let results = [];
  courses.forEach((course) => {
    let curriculumObj = [];
    let courseObj = course;
    if (curriculums.length > 0) {
      curriculums.forEach((curriculum) => {
        if (course._id == curriculum._id) {
          curriculumObj = curriculum.items;
        }
      });
    }
    courseObj.curriculums = curriculumObj;
    results.push(courseObj);
  });
  return results;
};

const processCommentResults = (parentCmnts, chilCmnts) => {
  let result = [];
  parentCmnts.forEach((parentCmnt) => {
    parentCmnt = parentCmnt.toObject();
    let childs = [];
    if (chilCmnts.length > 0) {
      chilCmnts.forEach((chilCmnt) => {
        if (parentCmnt._id == chilCmnt.parentCommentId) {
          childs.push(chilCmnt);
        }
      });
    }
    parentCmnt.replies = childs;
    result.push(parentCmnt);
  });
  return result;
};

const proccessPdf = (data, res) => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
  let html = genrateHtmlTemplate(data);
  logger.info("PDF generation started " + html)
  pdf.create(html).toStream(function (err, stream) {
    if (err) {
      res.status(500).send(responseHelper.createCustomResponse(500, "Fail to create pdf", err))
    } else {
      stream.pipe(res);
    }
  });
  return;
};

const processResultofAnAttempt = (testDetails, answersOfAnAttempt) => {
  testDetails = testDetails.toObject();
  let result = [];
  testDetails.questionSections.forEach((section) => {
    if (section.questionIds.length > 0) {
      let sectionResults = [];
      let sectionScore = 0;
      section.questionIds.forEach((questionId) => {
        answersOfAnAttempt.forEach((answer) => {
          if (answer.questionId == questionId) {
            sectionResults.push(answer);
          }
        });
      });
      section.answers = sectionResults;
    }
  });
  return testDetails;
};

const processFacultyCoursesAndCurriculum = (curriculums, courses) => {
  let results = [];
  courses.forEach((course) => {
    let courseObj = course.toObject();
    let curriculumId = "";
    if (curriculums.length > 0) {
      curriculums.forEach((curriculum) => {
        if (curriculum.courseId == courseObj._id) {
          curriculumId = curriculum.curriculumId;
        }
      });
    }
    courseObj.curriculumId = curriculumId;
    results.push(courseObj);
  });
  return results;
};

const processSingleContentGroupResult = (subscriptions, contentGroups) => {
  if (subscriptions.length > 0) {
    contentGroups.forEach((contentGroup) => {
      let resultSet = [];
      contentGroup.contents.forEach(course => {
        let sub = null;
        subscriptions.forEach((subscription) => {
          if (course._id == subscription.courseId || course._id == subscription.curriculumId) {
            sub = subscription;
          }
        });
        resultSet.push(getCoursePeriod(sub, course));
      })
      contentGroup.items = resultSet;
    });
    return contentGroups;
  } else {
    contentGroups.forEach((contentGroup) => {
      let resultSet = [];
      contentGroup.contents.forEach(course => {
        let sub = null;
        resultSet.push(getCoursePeriod(sub, course));
      })
      contentGroup.items = resultSet;
    });
    return contentGroups;
  }
};

const processCourseListAndDetailsList = (courses, [languages, institutes, curriculums, categories]) => {
  let newResults = courses.map((course) => {
    course = course.toObject()
    let instituteName = ""
    let languageName = ""
    let curriculumList = []
    let categoryList = []
    if (institutes && institutes.length > 0) {
      let instituteDetails = institutes.find(institute => institute._id == course.institutionId)
      instituteName = instituteDetails?.name || ""
    }
    if (languages && languages.length > 0) {
      let languageDetails = languages.find(language => language._id == course.languageId)
      languageName = languageDetails?.name || ""
    }
    if (curriculums && curriculums.length > 0) {
      let languageDetails = curriculums.find(curriculum => curriculum._id == course._id)
      curriculumList = languageDetails?.items || []
    }
    if (categories && categories.length > 0) {
      let categoryDetails = []
      categories.map(category => {
        course.categories.map(cat => {
          if (category._id == cat) {
            categoryDetails.push(category.name)
          }
        })
      });
      categoryList = categoryDetails
    }
    course.instituteName = instituteName;
    course.languageName = languageName;
    course.curriculums = curriculumList;
    course.categoryName = categoryList;
    return course;
  })
  return newResults
};

// function to generate and download excel
const exportExcel = (res, sheets = [], fileName = 'report.xlsx') => {
  // Create the excel report.
  // This function will return Buffer
  const report = excel.buildExport(sheets);

  // You can then return this straight
  res.attachment(fileName); // This is sails.js specific (in general you need to set headers)
  return res.send(report);
}

const processSubscribedCourses = (subscriptions, courses, curriculms, plans) => {
  let resultSet = [];
  if (plans.length > 0) {
    plans.forEach(plan => {
      let subscription = subscriptions.find(subscription => subscription.planId == plan._id)
      let curriculum = curriculms.find(curriculm => curriculm._id == plan.curriculumId);
      if (subscription && curriculum) {
        let course = courses.find(course => course._id == curriculum.courseId)
        if (course) {
          let result = getCoursePeriod(subscription, course.toObject());
          resultSet.push({
            ...result,
            curriculumId: curriculum._id,
            curriculumType: curriculum.type
          })
        }
      }
    })
    return resultSet;
  }
  return resultSet
};

const randomGenerator = (n, pattern) => {
  let alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers = '0123456789',
    characters = alphabets + numbers,
    alphabetsLength = alphabets.length,
    numbersLength = numbers.length,
    charactersLength = characters.length,
    pick = 'A';

  var randomString = '';

  for (var i = 0; i < n; i++) {
    if (typeof pattern != 'undefined' && /^[ADad]+$/.test(pattern) && typeof pattern[i] != 'undefined')
      pick = pattern[i];

    if (pick == 'A' || pick == 'a')
      character = alphabets.charAt(Math.floor(Math.random() * alphabetsLength));
    else if (pick == 'D' || pick == 'd')
      character = numbers.charAt(Math.floor(Math.random() * numbersLength));
    else
      character = characters.charAt(Math.floor(Math.random() * charactersLength));

    randomString += character;

    pick = null;
  }

  return randomString;
};

const validateSingleFile = (req, file, callback, allowedFileTypes) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (!allowedFileTypes.includes(extension)) {
    req.fileValidationError = `File not supported! Allowed file types: ${allowedFileTypes.concat()}`;
    return callback(null, false);
  }
  callback(null, true);
};

const singleUpload = (fieldName, allowedFileTypes = []) => {
  let storage = multer.memoryStorage();
  return storage ? multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
      validateSingleFile(req, file, callback, allowedFileTypes);
    }
  }).single(fieldName) : null;
};

const processForumpostsResult = (forumposts, likeDetails, creators, userId) => {
  try {
    let resultSet = [];
    forumposts.forEach(forumpost => {
      let responses = {
        isLiked: false,
        isDisLiked: false,
        isCreator: false
      }
      let creatorObj = {
        role: '',
        _id: "",
        name: '',
        imageUrl: ''
      }
      if (creators.length > 0) {
        let creator = creators.find(creator => creator._id == forumpost.createdBy || creator.userId == forumpost.createdBy);
        if (creator) {
          creatorObj = creator;
        }
      }
      let likeDetaild = likeDetails.find(likeDetail => likeDetail.toObject().itemId == forumpost._id);
      responses.isLiked = likeDetaild ? true : false
      responses.isCreator = (userId && forumpost.createdBy == userId.toString()) ? true : false;
      if (forumpost.constructor.name === 'model') {
        forumpost = forumpost.toObject()
      }
      forumpost.response = responses
      delete creatorObj.userId
      forumpost.creator = creatorObj
      resultSet.push(forumpost)
    })
    return resultSet;
  } catch (error) {
    throw error
  }
};

const processForumpostsCommentsResult = (forumpostComments, creators, userId) => {
  let resultSet = [];
  forumpostComments.forEach(forumpost => {
    let creator = {
      role: '',
      _id: "",
      name: '',
      imageUrl: ''
    }
    let responses = {
      isCreator: false
    }
    creator = creators.find(creator => creator._id == forumpost.createdBy || creator.userId == forumpost.createdBy);
    responses.isCreator = (forumpost.createdBy == userId.toString()) ? true : false;
    forumpost = forumpost.toObject()
    delete creator.userId
    forumpost.creator = creator
    forumpost.responses = responses

    resultSet.push(forumpost)
  })
  return resultSet;
};

const processCoursesOfAuserCourses = (subscriptions, courses, curriculms) => {
  let resultSet = [];
  if (curriculms.length > 0) {
    curriculms.forEach(curriculum => {
      let subscription = subscriptions.find(subscription => subscription.curriculumId == curriculum._id)
      if (curriculum) {
        let course = courses.find(course => course._id == curriculum.courseId)
        if (course) {
          let result = getCoursePeriod(subscription, course.toObject());
          resultSet.push({
            ...result,
            curriculumId: curriculum._id,
            curriculumType: curriculum.type
          })
        }
      }
    })
    return resultSet;
  }
  return resultSet
};

const processConfigsAndCategory = (configs, categories) => {
  let resultSet = [];
  if (categories.length > 0) {
    configs.forEach(config => {
      let categoryData = categories.find(category => category._id == config.categoryId)
      resultSet.push({ ...config.toObject(), category: categoryData })
    })
    return resultSet;
  }
  return resultSet
};

module.exports = {
  getFacultyIdsFromCourse,
  getContentIdFromSection,
  getSectionUpdateBody,
  getSectionCreateBody,
  processCouseResults,
  processCouseLanguageResults,
  processPlanTaxResults,
  getRelatedIdsFromCourse,
  processPlanAndCourseResults,
  getContentIdsFromCurriculum,
  processSingleContentResults,
  processCouseSectionResults,
  processCousePlanResults,
  processContentSectionResults,
  processBookmarkResult,
  processMycoursesResult,
  getCoursePeriod,
  createManyAnswerObjects,
  processQuestionAndAnswers,
  processRankAndUsers,
  docContentParser,
  getContentAndSubscriptionDetails,
  processSingleContentResult,
  processMyTestResults,
  isCategoryUsedInCourse,
  processBookmarkSubscription,
  processStudentsCurriculumResult,
  processLiveClass,
  getSectionFromTest,
  processCourseAndCurriculum,
  getQuestionIdsFromTest,
  addQuestionsIntoSection,
  processLiveClassAndBatchResultWithoutUser,
  processLiveClassAndBatchResultWithUser,
  processAnswersOfAnAttempt,
  processCourseTypeAndCurriculum,
  processLiveClassResults,
  processCommentResults,
  proccessPdf,
  processResultofAnAttempt,
  processFacultyCoursesAndCurriculum,
  processSingleContentGroupResult,
  getStreamUrls,
  processCourseListAndDetailsList,
  exportExcel,
  getDownloadUrl,
  processSubscribedCourses,
  randomGenerator,
  singleUpload,
  processForumpostsResult,
  processForumpostsCommentsResult,
  processCoursesOfAuserCourses,
  getNearestOccurance,
  processConfigsAndCategory
};
