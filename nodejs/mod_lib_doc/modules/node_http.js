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
// For downloading instead of streaming:
// res.setHeader(
//     'Content-Disposition',
//     'attachment; filename="all_libs.md"'
// );


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


/*
Common req.headers

| Header                   | Example value               | Purpose                          |
| ------------------------ | --------------------------- | -------------------------------- |
| `host`                   | `example.com`               | Host/domain requested            |
| `user-agent`             | `Mozilla/5.0...`            | Browser/client information       |
| `accept`                 | `application/json`          | Response formats client accepts  |
| `accept-language`        | `en-US,en;q=0.9`            | Preferred languages              |
| `accept-encoding`        | `gzip, br`                  | Compression formats supported    |
| `authorization`          | `Bearer eyJ...`             | Authentication credentials       |
| `content-type`           | `application/json`          | Request body format              |
| `content-length`         | `245`                       | Request body size in bytes       |
| `cookie`                 | `token=abc; theme=dark`     | Cookies sent by client           |
| `origin`                 | `https://example.com`       | Origin of browser request        |
| `referer`                | `https://example.com/users` | Previous page                    |
| `connection`             | `keep-alive`                | Connection behavior              |
| `cache-control`          | `no-cache`                  | Cache instructions               |
| `if-none-match`          | `"abc123"`                  | ETag cache validation            |
| `if-modified-since`      | `Wed, 12 Aug...`            | Date-based cache validation      |
| `if-match`               | `"abc123"`                  | Conditional request              |
| `if-unmodified-since`    | `Wed, 12 Aug...`            | Conditional request              |
| `range`                  | `bytes=0-1000`              | Request partial content          |
| `accept-ranges`          | `bytes`                     | Range support                    |
| `x-forwarded-for`        | `1.2.3.4`                   | Original client IP through proxy |
| `x-forwarded-proto`      | `https`                     | Original protocol through proxy  |
| `x-forwarded-host`       | `example.com`               | Original host through proxy      |
| `x-real-ip`              | `1.2.3.4`                   | Client IP added by proxy         |
| `upgrade`                | `websocket`                 | Protocol upgrade request         |
| `sec-websocket-key`      | `abc...`                    | WebSocket handshake              |
| `sec-websocket-version`  | `13`                        | WebSocket protocol version       |
| `sec-websocket-protocol` | `chat`                      | WebSocket subprotocol            |
| `sec-fetch-site`         | `same-origin`               | Browser fetch context            |
| `sec-fetch-mode`         | `cors`                      | Browser fetch mode               |
| `sec-fetch-dest`         | `empty`                     | Browser fetch destination        |
| `dnt`                    | `1`                         | Do-not-track preference          |
| `pragma`                 | `no-cache`                  | Legacy cache control             |
| `via`                    | `1.1 proxy`                 | Proxy information                |
| `te`                     | `trailers`                  | Transfer encoding support        |
| `expect`                 | `100-continue`              | Expectation before sending body  |
| `transfer-encoding`      | `chunked`                   | Transfer encoding                |

| Property                      | Example                           |
| ----------------------------- | --------------------------------- |
| `req.headers`                 | `{ host: 'localhost:3000', ... }` |
| `req.rawHeaders`              | `['Host', 'localhost:3000', ...]` |
| `req.headers.host`            | `'localhost:3000'`                |
| `req.headers.authorization`   | `'Bearer abc123'`                 |
| `req.headers["content-type"]` | `'application/json'`              |
| `req.headers.cookie`          | `'token=abc'`                     |



req.headers       → convenient object
req.rawHeaders    → original header pairs


res.setHeader() = set a response header that your server will send to the client.

| Header                             | Example                        | Purpose                    |
| ---------------------------------- | ------------------------------ | -------------------------- |
| `Content-Type`                     | `application/json`             | Response data format       |
| `Content-Length`                   | `1234`                         | Response size              |
| `Content-Encoding`                 | `gzip`                         | Compression used           |
| `Cache-Control`                    | `no-cache`                     | Cache behavior             |
| `ETag`                             | `"abc123"`                     | Cache validation           |
| `Last-Modified`                    | HTTP date                      | Resource modification time |
| `Location`                         | `/login`                       | Redirect destination       |
| `Set-Cookie`                       | `token=abc; HttpOnly`          | Set browser cookie         |
| `Access-Control-Allow-Origin`      | `*`                            | CORS origin                |
| `Access-Control-Allow-Methods`     | `GET,POST`                     | Allowed HTTP methods       |
| `Access-Control-Allow-Headers`     | `Authorization,Content-Type`   | Allowed request headers    |
| `Access-Control-Allow-Credentials` | `true`                         | Allow cookies/auth         |
| `Access-Control-Expose-Headers`    | `X-Total-Count`                | Expose headers to browser  |
| `Access-Control-Max-Age`           | `86400`                        | CORS preflight cache       |
| `X-Powered-By`                     | `Node.js`                      | Server identification      |
| `WWW-Authenticate`                 | `Bearer`                       | Authentication challenge   |
| `Content-Disposition`              | `attachment; filename="a.pdf"` | Download/inline behavior   |
| `Content-Range`                    | `bytes 0-999/5000`             | Partial response           |
| `Accept-Ranges`                    | `bytes`                        | Range support              |
| `Vary`                             | `Accept-Encoding`              | Cache variation            |
| `Connection`                       | `keep-alive`                   | Connection behavior        |
| `Transfer-Encoding`                | `chunked`                      | Transfer mechanism         |
| `Retry-After`                      | `120`                          | Retry delay                |
| `Server`                           | `Node.js`                      | Server information         |

Content-Type possiblities:
| Content-Type                        | Meaning          |
| ----------------------------------- | ---------------- |
| `application/json`                  | JSON             |
| `application/xml`                   | XML              |
| `application/pdf`                   | PDF              |
| `application/octet-stream`          | Binary data      |
| `application/x-www-form-urlencoded` | HTML form data   |
| `multipart/form-data`               | File/form upload |
| `text/html`                         | HTML             |
| `text/plain`                        | Plain text       |
| `text/css`                          | CSS              |
| `text/javascript`                   | JavaScript       |
| `image/png`                         | PNG image        |
| `image/jpeg`                        | JPEG image       |
| `image/gif`                         | GIF image        |
| `image/webp`                        | WebP image       |
| `audio/mpeg`                        | MP3              |
| `video/mp4`                         | MP4              |

Set-Cookie possiblilities:
res.setHeader("Set-Cookie", "token=abc");
res.setHeader("Set-Cookie", [
    "token=abc123; HttpOnly; Secure; SameSite=Strict; Path=/",
    "theme=dark; Max-Age=3600; Path=/"
]);
| Attribute  | Example               | Purpose               |
| ---------- | --------------------- | --------------------- |
| `HttpOnly` | `token=abc; HttpOnly` | Prevent JS access     |
| `Secure`   | `token=abc; Secure`   | HTTPS only            |
| `SameSite` | `SameSite=Strict`     | Cross-site protection |
| `Path`     | `Path=/`              | Cookie path           |
| `Domain`   | `Domain=example.com`  | Cookie domain         |
| `Max-Age`  | `Max-Age=3600`        | Lifetime in seconds   |
| `Expires`  | `Expires=Wed,...`     | Expiration date       |

Cors Headers:
res.setHeader("Access-Control-Allow-Origin", "https://example.com");
res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
| Header                             | Example                      | Purpose                       |
| ---------------------------------- | ---------------------------- | ----------------------------- |
| `Access-Control-Allow-Origin`      | `*`                          | Allowed origin                |
| `Access-Control-Allow-Methods`     | `GET,POST,PUT,DELETE`        | Allowed methods               |
| `Access-Control-Allow-Headers`     | `Content-Type,Authorization` | Allowed request headers       |
| `Access-Control-Allow-Credentials` | `true`                       | Allow credentials             |
| `Access-Control-Expose-Headers`    | `X-Total-Count`              | Headers browser JS can access |
| `Access-Control-Max-Age`           | `86400`                      | Preflight cache duration      |

res.writeHead() can be used in three forms.
| Syntax                                          | Example                           | Meaning                           |
| ----------------------------------------------- | --------------------------------- | --------------------------------- |
| `writeHead(statusCode)`                         | `res.writeHead(200)`              | Status only                       |
| `writeHead(statusCode, headers)`                | `res.writeHead(200, {...})`       | Status + headers                  |
| `writeHead(statusCode, statusMessage, headers)` | `res.writeHead(200, "OK", {...})` | Status + custom message + headers |


related methods:
| Method/property        | Purpose                  | Example                                             |
| ---------------------- | ------------------------ | --------------------------------------------------- |
| `res.setHeader()`      | Set header               | `res.setHeader("Content-Type", "application/json")` |
| `res.getHeader()`      | Get header               | `res.getHeader("Content-Type")`                     |
| `res.getHeaders()`     | Get all headers          | `res.getHeaders()`                                  |
| `res.getHeaderNames()` | Get header names         | `res.getHeaderNames()`                              |
| `res.hasHeader()`      | Check header             | `res.hasHeader("Content-Type")`                     |
| `res.removeHeader()`   | Remove header            | `res.removeHeader("X-Test")`                        |
| `res.writeHead()`      | Send status + headers    | `res.writeHead(200, {...})`                         |
| `res.flushHeaders()`   | Send headers immediately | `res.flushHeaders()`                                |
| `res.headersSent`      | Check whether sent       | `res.headersSent`                                   |


res.setHeader()
        ↓
Configure response headers

res.writeHead()
        ↓
Send HTTP status + headers

res.end()
        ↓
Finish response


req.* = incoming
res.* = outgoing
req.headers = client → server headers
res.setHeader() = prepare server → client headers
res.writeHead() = send status + headers
*/
