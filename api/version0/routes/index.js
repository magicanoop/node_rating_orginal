const reportRouter = require('./report.routes');
const subscriptionRouter = require('./subscription.routes');
const groupRouter = require('./group.routes');

module.exports = (app) => {
  app.use("/api/v1/report", reportRouter);  
  app.use("/api/v1/subscription", subscriptionRouter);  
  app.use("/api/v1/group", groupRouter);  
};