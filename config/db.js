
const mongoose = require('mongoose');
const { logger } = require('./');
//const { runMigrations } = require('../migrationData/migrations');
// mongoose options
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: false,
  poolSize: 10,
  bufferMaxEntries: 0,
};
// mongodb environment variables
const { MONGO_HOSTNAME, DATABASE, MONGO_PORT, MONGO_DB_USER_NAME, MONGO_DB_PASSWORD } = process.env;
const dbConnectionURL = {
  LOCALURL: `mongodb://127.0.0.1:27017/neyyarapp_rating`,
};
//console.log(`mongodb://${MONGO_DB_USER_NAME}:${MONGO_DB_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${DATABASE}`);
module.exports = function connect() {

  mongoose.connect(dbConnectionURL.LOCALURL, options);
  // CONNECTION EVENTS
  // When successfully connected

  const db = mongoose.connection
  db.on('connected', function () {
    logger.info('Mongoose default connection open');
  });

  // If the connection throws an error
  db.on('error', function (err) {
    logger.error('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  db.on('disconnected', function () {
    logger.warn('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection 

  db.on('SIGINT', function () {
    db.close(function () {
      logger.error('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });

  db.once("open", () => {
    // we're connected !
    console.log("Mongodb Connection Successful");
    //runMigrations()
  });
}

