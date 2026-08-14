process.loadEnvFile();
import express from 'express';

const port = process.env.PORT;
console.log(process.env);


import webRoutes from '../src/routes/webRoutes.js';

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

server.listen(port, () => {
    console.log(`server is running on ${port}`);

})


process.on("SIGTERM", () => {

    console.log("SIGTERM received");

    server.close(() => {

        console.log("HTTP server closed");

        process.exit(0);
    });
});

process.on("SIGINT", () => {

    console.log("Ctrl+C received");

    process.exitCode = 0;
});