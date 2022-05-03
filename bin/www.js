const http = require("http");
const dotenv = require("dotenv");
const cluster = require('cluster');
const os = require('os');
const numCPUs = 1;

dotenv.config({ path: `.env` })

const app = require('../app');
const { logger } = require("../config");

if (cluster.isMaster) {
    logger.info(`Master ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
        logger.warn(`Forking process number ${i}...`);
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {
        // Replace the dead worker, we're not sentimental
        logger.error(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {

    const port = process.env.PORT;
    app.set("port", port);

    const server = http.createServer(app);

    function onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }

        const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                logger.error(error, `${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case "EADDRINUSE":
                logger.error(error, `${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        const addr = server.address();
        const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
        logger.info(bind, "Server running on %s");
    }

    /**
     * Listen on provided port, on all network interfaces.
     */


    server.listen(port);

    server.on("error", onError);
    server.on("listening", onListening);

}