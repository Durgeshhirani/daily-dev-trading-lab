process.loadEnvFile();
import express from 'express';

const port = process.env.PORT;


import webRoutes from '../src/routes/webRoutes.js';
import apiRoutes from '../src/routes/apiRoutes.ts';

let server = express();
server.use(express.json(
    {
        limit: '1mb'
    }
))
server.set("name", 'Durgesh');
server.set("port", process.env.PORT);

server.post('/see', (req, res) => {
    // res.setHeader('Content-Type', 'application/json')
    res.json({
        status: 200,
        data: req.method,
        name: server.get('name'),
        port: server.get('port')
    })
});

server.use('/api', webRoutes);
server.use('/ts', apiRoutes);

// server.use('/static', express.static(import.meta.dirname));


// 404 route handler
server.use((req, res) => {
    res.json({
        status: 404,
        message: 'can\'t found the route'
    })
});

// error handler
server.use((err, req, res, next) => {
    res.status(500).json({
        error: {
            message: err.message || "Internal Server Error",
            // Only include stack traces in development environments for security
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
});

let app = server.listen(port, () => {
    console.log(`server is running on ${port}`);

})


// process.on("SIGTERM", () => {

//     console.log("SIGTERM received");

//     server.close(() => {

//         console.log("HTTP server closed");

//         process.exit(0);
//     });
// });

// process.on("SIGINT", () => {

//     console.log("Ctrl+C received");

//     process.exitCode = 0;
// });

// Function to handle graceful shutdown
function gracefulShutdown(signal) {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    // 1. Stop accepting new connections
    app.close(() => {
        console.log("HTTP server closed.");

        // 2. Safely exit the process now that the event loop is clear
        process.exit(0);
    });

    // 3. Safety Timeout (Force exit if connections hang for too long)
    setTimeout(() => {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
    }, 10000); // 10 seconds
}

// Capture Ctrl+C (Terminal)
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Capture Kill/Heroku/Docker termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
