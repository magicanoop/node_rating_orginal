const configs = Object.freeze({
    MEMBER_CATEGORIES_LIMIT: 10,
    COURSE_NAME_LIMIT: 60,
    DESCRIPTION_LIMIT: 1000,
    LEARNING_POINT_LIMIT: 200,
    LEARNING_POINTS_LIMIT: 10,
    TAG_LIMIT: 30,
    TAGS_LIMIT: 10,
    PRESIGNED_URL_EXPIRY_TIME: 3000,
    S3_OBJECT_ACL_PUBLIC: "public-read",
    S3_OBJECT_ACL_PRIVATE: "private",
    STORAGE_PATH: "assets/",
    ZOOM_REST_API : "https://api.zoom.us/v2/",
    API_VERSION: "1.0.0",
});

module.exports = configs;