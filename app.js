const express = require('express');
const helmet = require("helmet");
process.env["NODE_CONFIG_DIR"] = __dirname + "/config/environmentConfig/";
const env = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
global.appRoot = path.resolve(__dirname);

const app = express();

const { errorConverter, errorHandler } = require('./api/middlewares/error-handler');
const dbConnect = require('./config/db');
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/public', express.static('public'));

//protect against vulnerability
app.use(helmet());
app.use(express.json());
var corsOption = {
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: true,
  exposedHeaders: "token",
  preflightContinue: false,
}; 
app.use(cors(corsOption));

 env.config();

// connect db
dbConnect();

var listener = app.listen(8888, function(){
  console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});
app.get('/', (req, res) => {
  res.status(200).send('Api server set and running for Neyyar Admin')
});
app.use("/api/admin", require('./api'));

app.use((req, res, next) => {
  const error = new Error("Path not found");
  error.status = 404;
  next(error);
});


app.use(errorConverter);
app.use(errorHandler);


module.exports = app;
