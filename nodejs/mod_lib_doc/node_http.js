// node:http + node:https CHEATSHEET
// Run: node http-cheatsheet.js

import http from "node:http";
// import https from "node:https";
// import fs from "node:fs";

// ============================================================
// SERVER
// ============================================================

const server = http.createServer(async (req, res) => {

    // ---------------- REQUEST ----------------

    console.log(req.method);        // GET, POST, PUT...
    console.log(req.url);           // /users?page=2
    console.log(req.headers);       // request headers
    console.log(req.httpVersion);   // 1.1, 2.0

    // URL + query params
    const url = new URL(req.url, `http://${req.headers.host}`);

    console.log(url.pathname);              // /users
    console.log(url.searchParams.get("page")); // 2


    // ---------------- RESPONSE ----------------

    res.statusCode = 200;

    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Powered-By", "Node");

    // Cookies
    res.setHeader("Set-Cookie", "session=abc123; HttpOnly");


    // ---------------- ROUTING ----------------

    if (req.method === "GET" && url.pathname === "/") {

        res.end(JSON.stringify({
            message: "Home"
        }));

        return;
    }


    // GET /users
    if (req.method === "GET" && url.pathname === "/users") {

        res.end(JSON.stringify([
            { id: 1, name: "John" },
            { id: 2, name: "Alice" }
        ]));

        return;
    }


    // GET /users/:id
    if (
        req.method === "GET" &&
        url.pathname.startsWith("/users/")
    ) {

        const id = Number(url.pathname.split("/")[2]);

        res.end(JSON.stringify({
            id,
            name: "John"
        }));

        return;
    }


    // ---------------- REQUEST BODY ----------------
    // req.body does NOT exist in raw Node.
    // Request body arrives as a stream.

    if (req.method === "POST" && url.pathname === "/users") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {

                const data = JSON.parse(body);

                res.statusCode = 201;

                res.end(JSON.stringify({
                    message: "User created",
                    data
                }));

            } catch {

                res.statusCode = 400;

                res.end(JSON.stringify({
                    message: "Invalid JSON"
                }));
            }
        });

        return;
    }


    // ---------------- HEADERS + STATUS ----------------

    if (url.pathname === "/created") {

        res.writeHead(201, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Created"
        }));

        return;
    }


    // ---------------- REDIRECT ----------------

    if (url.pathname === "/redirect") {

        res.writeHead(302, {
            Location: "/"
        });

        res.end();

        return;
    }


    // ---------------- 404 ----------------

    res.statusCode = 404;

    res.end(JSON.stringify({
        message: "Route not found"
    }));
});


// ============================================================
// SERVER EVENTS / METHODS
// ============================================================

server.on("error", error => {
    console.error("Server error:", error);
});

server.listen(3000, () => {
    console.log("HTTP server: http://localhost:3000");
});

// server.close();       // Stop server
// server.address();     // Server address


// Graceful shutdown
process.on("SIGTERM", () => {

    server.close(() => {
        console.log("Server closed");
        process.exit(0);
    });

});


// ============================================================
// REQUEST / RESPONSE EVENTS
// ============================================================
//
// req.on("data", chunk => {})
// req.on("end", () => {})
// req.on("error", err => {})
// req.on("aborted", () => {})
//
// res.on("finish", () => {})  // Response completely sent
// res.on("close", () => {})   // Connection closed
//
// ============================================================


// ============================================================
// STREAMING
// ============================================================

// Send large file without loading entire file into RAM:
//
// const stream = fs.createReadStream("./large-file.txt");
// stream.pipe(res);


// ============================================================
// HTTP CLIENT
// ============================================================

// Simple GET
http.get("http://example.com", response => {

    let data = "";

    response.on("data", chunk => {
        data += chunk;
    });

    response.on("end", () => {
        console.log(data);
    });

}).on("error", console.error);


// ============================================================
// HTTP REQUEST
// ============================================================

const options = {
    hostname: "example.com",
    port: 80,
    path: "/",
    method: "GET"
};

const request = http.request(options, response => {

    response.on("data", chunk => {
        console.log(chunk.toString());
    });

});

request.on("error", console.error);

request.end();


// ============================================================
// HTTP POST REQUEST
// ============================================================

const postData = JSON.stringify({
    name: "John"
});

const postOptions = {
    hostname: "example.com",
    port: 80,
    path: "/users",
    method: "POST",

    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData)
    }
};

const postRequest = http.request(
    postOptions,
    response => {

        response.on("data", chunk => {
            console.log(chunk.toString());
        });

    }
);

postRequest.on("error", console.error);

postRequest.write(postData);
postRequest.end();


// ============================================================
// HTTPS CLIENT
// ============================================================

// https.get("https://example.com", response => {
//     response.on("data", chunk => {
//         console.log(chunk.toString());
//     });
// });


// ============================================================
// HTTPS SERVER
// ============================================================
//
// Requires SSL certificate + private key.
//
// const sslOptions = {
//     key: fs.readFileSync("./private-key.pem"),
//     cert: fs.readFileSync("./certificate.pem")
// };
//
// const httpsServer = https.createServer(
//     sslOptions,
//     (req, res) => {
//         res.end("HTTPS");
//     }
// );
//
// httpsServer.listen(443);


// ============================================================
// QUICK MEMORY
// ============================================================
//
// SERVER
// http.createServer()
// server.listen()
// server.close()
// server.address()
//
// REQUEST
// req.method
// req.url
// req.headers
// req.httpVersion
// req.on("data")
// req.on("end")
//
// RESPONSE
// res.statusCode
// res.setHeader()
// res.writeHead()
// res.write()
// res.end()
//
// URL
// new URL()
// url.pathname
// url.searchParams.get()
//
// CLIENT
// http.get()
// http.request()
// https.get()
// https.request()
//
// STREAM
// req → readable stream
// res → writable stream
// stream.pipe(res)
//
// ============================================================
// IMPORTANT:
// Express/NestJS sit ABOVE this HTTP layer.
// Understanding this makes req/res/middleware/routing much easier.
// ============================================================