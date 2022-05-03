const { doDuring } = require("async");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.ratings= require('./ratings.model')(mongoose);
db.users= require('./users.model')(mongoose);

module.exports = db;