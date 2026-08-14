
// ============================================================
// EXPRESS.JS CHEATSHEET
// Package: express
// ============================================================
//
// Install:
// npm install express
//
// Express 5.x
//
// Run:
// node express-cheatsheet.js
//
// ============================================================


import express from "express";


// ============================================================
// 1. APP SETUP
// ============================================================

const app = express();

const PORT = process.env.PORT || 3000;


// ============================================================
// 2. BUILT-IN MIDDLEWARE
// ============================================================

// Parse JSON request bodies.
app.use(express.json());

// Parse HTML form bodies.
app.use(express.urlencoded({ extended: true }));

// Serve static files.
// app.use(express.static("public"));


// ============================================================
// 3. APP CONFIGURATION
// ============================================================

app.set("port", PORT);

// Read configuration.
console.log(app.get("port"));

// Common:
// app.set("trust proxy", 1);
// app.set("case sensitive routing", true);
// app.set("strict routing", true);


// ============================================================
// 4. REQUEST OBJECT — req
// ============================================================

app.get("/request-info", (req, res) => {

    console.log(req.method);       // GET
    console.log(req.url);          // /request-info?name=John
    console.log(req.originalUrl);
    console.log(req.path);
    console.log(req.protocol);     // http / https
    console.log(req.hostname);
    console.log(req.ip);

    console.log(req.headers);
    console.log(req.get("Content-Type"));

    console.log(req.query);        // ?page=2&limit=10

    res.json({
        method: req.method,
        url: req.originalUrl,
        query: req.query,
        ip: req.ip
    });
});


// ============================================================
// 5. RESPONSE OBJECT — res
// ============================================================

app.get("/response", (req, res) => {

    // Status code
    res.status(200);

    // JSON
    res.json({
        message: "Success"
    });

    // Other common methods:
    //
    // res.send("Hello");
    // res.end();
    // res.redirect("/login");
    // res.sendStatus(404);
    // res.sendFile(filePath);
});


// ============================================================
// 6. ROUTES
// ============================================================

// GET
app.get("/users", (req, res) => {

    res.json({
        message: "Get users"
    });
});

// POST
app.post("/users", (req, res) => {

    res.status(201).json({
        message: "Create user",
        body: req.body
    });
});

// PUT
app.put("/users/:id", (req, res) => {

    res.json({
        message: "Replace user",
        id: req.params.id,
        body: req.body
    });
});

// PATCH
app.patch("/users/:id", (req, res) => {

    res.json({
        message: "Update user",
        id: req.params.id,
        body: req.body
    });
});

// DELETE
app.delete("/users/:id", (req, res) => {

    res.json({
        message: "Delete user",
        id: req.params.id
    });
});


// ============================================================
// 7. ROUTE PARAMETERS
// ============================================================

app.get("/products/:id", (req, res) => {

    const id = req.params.id;

    res.json({
        id
    });
});


// Multiple parameters:
//
// GET /users/10/posts/20

app.get("/users/:userId/posts/:postId", (req, res) => {

    const { userId, postId } = req.params;

    res.json({
        userId,
        postId
    });
});


// ============================================================
// 8. QUERY PARAMETERS
// ============================================================
//
// GET /users?page=2&limit=10&search=john

app.get("/search", (req, res) => {

    const {
        page = 1,
        limit = 10,
        search
    } = req.query;

    res.json({
        page,
        limit,
        search
    });
});


// ============================================================
// 9. REQUEST BODY
// ============================================================
//
// express.json() must be registered before the route.

app.post("/body", (req, res) => {

    console.log(req.body);

    res.json({
        received: req.body
    });
});


// ============================================================
// 10. HEADERS
// ============================================================

app.get("/headers", (req, res) => {

    // All headers
    console.log(req.headers);

    // Specific header
    const authorization = req.get("Authorization");

    res.json({
        authorization
    });
});


// ============================================================
// 11. RESPONSE HEADERS
// ============================================================

app.get("/custom-header", (req, res) => {

    res.set("X-Custom-Header", "hello");

    res.set({
        "X-App-Version": "1.0",
        "Cache-Control": "no-store"
    });

    res.json({
        message: "Headers set"
    });
});


// ============================================================
// 12. COOKIES
// ============================================================
//
// For convenient req.cookies / res.cookie(), install:
//
// npm install cookie-parser
//
// import cookieParser from "cookie-parser";
// app.use(cookieParser());
//
// Then:
//
// res.cookie("session", "abc123", {
//     httpOnly: true,
//     secure: true,
//     sameSite: "strict",
//     maxAge: 60 * 60 * 1000
// });
//
// req.cookies.session
//
// ============================================================


// ============================================================
// 13. ROUTER
// ============================================================

const userRouter = express.Router();

userRouter.get("/", (req, res) => {

    res.json({
        message: "All users"
    });
});

userRouter.get("/:id", (req, res) => {

    res.json({
        id: req.params.id
    });
});

userRouter.post("/", (req, res) => {

    res.status(201).json({
        user: req.body
    });
});

// Mount router.
app.use("/users-v2", userRouter);


// ============================================================
// 14. ROUTER-LEVEL MIDDLEWARE
// ============================================================

const adminRouter = express.Router();

adminRouter.use((req, res, next) => {

    console.log("Admin middleware");

    next();
});

adminRouter.get("/dashboard", (req, res) => {

    res.json({
        message: "Admin dashboard"
    });
});

app.use("/admin", adminRouter);


// ============================================================
// 15. MIDDLEWARE
// ============================================================
//
// Middleware:
//
// req → middleware → next() → route → res

function logger(req, res, next) {

    console.log(
        req.method,
        req.originalUrl
    );

    next();
}

app.use(logger);


// ============================================================
// 16. AUTHENTICATION MIDDLEWARE
// ============================================================

function authenticate(req, res, next) {

    const token = req.get("Authorization");

    if (!token) {

        return res.status(401).json({
            message: "Authentication required"
        });
    }

    // Verify token here.
    // req.user = decodedUser;

    next();
}

app.get(
    "/protected",
    authenticate,
    (req, res) => {

        res.json({
            message: "Protected resource"
        });
    }
);


// ============================================================
// 17. MULTIPLE MIDDLEWARE
// ============================================================

function middleware1(req, res, next) {

    console.log("Middleware 1");

    next();
}

function middleware2(req, res, next) {

    console.log("Middleware 2");

    next();
}

app.get(
    "/multiple",
    middleware1,
    middleware2,
    (req, res) => {

        res.json({
            message: "Done"
        });
    }
);


// ============================================================
// 18. ASYNC ROUTES — EXPRESS 5
// ============================================================
//
// Express 5 forwards rejected promises to error middleware.

app.get("/async", async (req, res) => {

    const data = await Promise.resolve({
        message: "Async response"
    });

    res.json(data);
});


// ============================================================
// 19. ERROR HANDLING
// ============================================================

// Route can throw/reject.

app.get("/error", async () => {

    throw new Error("Something went wrong");
});


// Error middleware MUST have 4 arguments.

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        message: "Internal Server Error"
    });
});


// ============================================================
// 20. 404 HANDLER
// ============================================================
//
// Put after all routes.

app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });
});


// ============================================================
// 21. ERROR + 404 ORDER
// ============================================================
//
// Recommended structure:
//
// app.use(express.json());
//
// app.use(logger);
//
// routes...
//
// app.use((req, res) => {
//     res.status(404).json(...);
// });
//
// app.use((err, req, res, next) => {
//     res.status(500).json(...);
// });
//
// Error middleware should be after routes.
// ============================================================


// ============================================================
// 22. SEND DIFFERENT RESPONSE TYPES
// ============================================================

// Text:
//
// res.send("Hello");
//
// JSON:
//
// res.json({ message: "Hello" });
//
// Status + JSON:
//
// res.status(201).json(data);
//
// Status only:
//
// res.sendStatus(204);
//
// Redirect:
//
// res.redirect("/login");
//
// File:
//
// res.sendFile("/absolute/path/file.pdf");
//
// Stream:
//
// stream.pipe(res);
//
// ============================================================


// ============================================================
// 23. STATIC FILES
// ============================================================
//
// Serve:
//
// public/index.html
// public/style.css
// public/app.js
//
// using:
//
// app.use(express.static("public"));
//
// Optional URL prefix:
//
// app.use("/static", express.static("public"));
//
// ============================================================


// ============================================================
// 24. CORS
// ============================================================
//
// Requires:
//
// npm install cors
//
// import cors from "cors";
//
// app.use(cors());
//
// Production:
//
// app.use(cors({
//     origin: "https://example.com",
//     credentials: true
// }));
//
// ============================================================


// ============================================================
// 25. SECURITY HEADERS
// ============================================================
//
// Common production middleware:
//
// npm install helmet
//
// import helmet from "helmet";
//
// app.use(helmet());
//
// ============================================================


// ============================================================
// 26. REQUEST SIZE LIMIT
// ============================================================
//
// Prevent unnecessarily large JSON requests.

app.use(express.json({
    limit: "1mb"
}));


// ============================================================
// 27. REQUEST TIME / RESPONSE HEADERS
// ============================================================

app.use((req, res, next) => {

    res.set(
        "X-Request-Started",
        new Date().toISOString()
    );

    next();
});


// ============================================================
// 28. CONTENT NEGOTIATION
// ============================================================

app.get("/format", (req, res) => {

    res.format({

        json: () => {
            res.json({
                message: "JSON"
            });
        },

        html: () => {
            res.send("<h1>Hello</h1>");
        },

        text: () => {
            res.send("Hello");
        },

        default: () => {
            res.status(406).send("Not Acceptable");
        }
    });
});


// ============================================================
// 29. FILE DOWNLOAD
// ============================================================
//
// res.download(filePath)
//
// Example:
//
// app.get("/download", (req, res, next) => {
//
//     res.download(
//         "/absolute/path/report.pdf",
//         "report.pdf",
//         error => {
//             if (error) next(error);
//         }
//     );
//
// });
//
// ============================================================


// ============================================================
// 30. REQUEST LIFECYCLE
// ============================================================
//
// Client
//   ↓
// Express
//   ↓
// app.use() middleware
//   ↓
// authentication
//   ↓
// validation
//   ↓
// route
//   ↓
// controller/service
//   ↓
// res.json()
//   ↓
// client
//
// Error:
//
// any middleware/route
//   ↓
// next(error) / thrown error
//   ↓
// error middleware
//   ↓
// response
//
// ============================================================


// ============================================================
// 31. REQUEST EVENTS
// ============================================================

app.post("/upload-info", (req, res) => {

    req.on("aborted", () => {
        console.log("Client aborted request");
    });

    req.on("close", () => {
        console.log("Request closed");
    });

    res.json({
        message: "Request received"
    });
});


// ============================================================
// 32. RESPONSE EVENTS
// ============================================================

app.get("/response-events", (req, res) => {

    res.on("finish", () => {
        console.log("Response sent");
    });

    res.on("close", () => {
        console.log("Connection closed");
    });

    res.json({
        message: "OK"
    });
});


// ============================================================
// 33. ROUTE CHAINING
// ============================================================

app.route("/profile")

    .get((req, res) => {

        res.json({
            method: "GET"
        });

    })

    .post((req, res) => {

        res.status(201).json({
            method: "POST"
        });

    })

    .put((req, res) => {

        res.json({
            method: "PUT"
        });

    });


// ============================================================
// 34. CONTROLLER + SERVICE PATTERN
// ============================================================
//
// Express should usually handle HTTP concerns.
// Business logic can live in services.
//
// Controller:
//
// app.get("/users/:id", async (req, res, next) => {
//
//     try {
//
//         const user = await userService.findById(
//             req.params.id
//         );
//
//         res.json(user);
//
//     } catch (error) {
//
//         next(error);
//
//     }
// });
//
// Service:
//
// async function findById(id) {
//     return db.query(...);
// }
//
// ============================================================


// ============================================================
// 35. VALIDATION PATTERN
// ============================================================
//
// Common libraries:
//
// Zod
// Joi
// express-validator
//
// Example shape:
//
// app.post("/users", validateUser, controller);
//
// Validation should happen before business logic.
// ============================================================


// ============================================================
// 36. GRACEFUL SHUTDOWN
// ============================================================

const server = app.listen(
    PORT,
    () => {

        console.log(
            `API running on http://localhost:${PORT}`
        );
    }
);


// Close HTTP server during shutdown.

process.on("SIGTERM", () => {

    console.log("SIGTERM received");

    server.close(() => {

        console.log("HTTP server closed");

        process.exit(0);
    });
});


// ============================================================
// 37. COMMON PRODUCTION MIDDLEWARE STACK
// ============================================================
//
// import helmet from "helmet";
// import cors from "cors";
// import cookieParser from "cookie-parser";
//
// app.use(helmet());
//
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true
// }));
//
// app.use(express.json({
//     limit: "1mb"
// }));
//
// app.use(express.urlencoded({
//     extended: true,
//     limit: "1mb"
// }));
//
// app.use(cookieParser());
//
// app.use(requestLogger);
//
// app.use("/api/users", userRoutes);
//
// app.use(notFoundHandler);
//
// app.use(errorHandler);
//
// ============================================================


// ============================================================
// 38. COMMON HTTP STATUS CODES
// ============================================================
//
// 200 → OK
// 201 → Created
// 204 → No Content
//
// 400 → Bad Request
// 401 → Unauthorized
// 403 → Forbidden
// 404 → Not Found
// 405 → Method Not Allowed
// 409 → Conflict
// 422 → Unprocessable Content
// 429 → Too Many Requests
//
// 500 → Internal Server Error
// 502 → Bad Gateway
// 503 → Service Unavailable
//
// ============================================================


// ============================================================
// 39. SECURITY RULES
// ============================================================
//
// 1. Use HTTPS in production.
//
// 2. Use helmet.
//
// 3. Configure CORS explicitly.
//
// 4. Limit request body size.
//
// 5. Validate request body/query/params.
//
// 6. Authenticate protected routes.
//
// 7. Authorize based on user permissions.
//
// 8. Never trust req.body / req.query / req.params.
//
// 9. Don't expose stack traces in production.
//
// 10. Rate-limit public/sensitive endpoints.
//
// 11. Keep secrets in environment variables/secret managers.
//
// 12. Validate uploaded files.
//
// ============================================================


// ============================================================
// 40. REAL-WORLD CRUD API STRUCTURE
// ============================================================
//
// routes/users.routes.js
//
// router.get("/", controller.getUsers);
// router.get("/:id", controller.getUser);
// router.post("/", controller.createUser);
// router.patch("/:id", controller.updateUser);
// router.delete("/:id", controller.deleteUser);
//
// controller
//      ↓
// service
//      ↓
// repository/database
//
// Example:

const users = [];

app.get("/api/users", (req, res) => {

    res.json(users);
});

app.get("/api/users/:id", (req, res) => {

    const id = Number(req.params.id);

    const user = users.find(
        user => user.id === id
    );

    if (!user) {

        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
});

app.post("/api/users", (req, res) => {

    const user = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };

    users.push(user);

    res.status(201).json(user);
});

app.patch("/api/users/:id", (req, res) => {

    const id = Number(req.params.id);

    const user = users.find(
        user => user.id === id
    );

    if (!user) {

        return res.status(404).json({
            message: "User not found"
        });
    }

    Object.assign(
        user,
        req.body
    );

    res.json(user);
});

app.delete("/api/users/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = users.findIndex(
        user => user.id === id
    );

    if (index === -1) {

        return res.status(404).json({
            message: "User not found"
        });
    }

    users.splice(index, 1);

    res.status(204).end();
});


// ============================================================
// 41. TYPESCRIPT TYPING
// ============================================================
//
// npm install express
//
// import express, {
//     Request,
//     Response,
//     NextFunction
// } from "express";
//
// app.get(
//     "/users",
//     (req: Request, res: Response) => {
//
//         res.json({
//             users: []
//         });
//     }
// );
//
// Custom request:
//
// interface AuthRequest extends Request {
//     user: {
//         id: number;
//         role: string;
//     };
// }
//
// ============================================================


// ============================================================
// 42. IMPORTANT EXPRESS OBJECTS
// ============================================================
//
// app
// router
// req
// res
//
// Request
// Response
// NextFunction
//
// ============================================================


// ============================================================
// 43. MOST IMPORTANT APP METHODS
// ============================================================
//
// app.use()
// app.get()
// app.post()
// app.put()
// app.patch()
// app.delete()
// app.all()
// app.route()
// app.listen()
// app.set()
// app.get()
// app.locals
//
// ============================================================


// ============================================================
// 44. MOST IMPORTANT ROUTER METHODS
// ============================================================
//
// express.Router()
//
// router.use()
// router.get()
// router.post()
// router.put()
// router.patch()
// router.delete()
// router.route()
//
// ============================================================


// ============================================================
// 45. MOST IMPORTANT REQUEST PROPERTIES
// ============================================================
//
// req.method
// req.url
// req.originalUrl
// req.path
// req.params
// req.query
// req.body
// req.headers
// req.cookies
// req.ip
// req.protocol
// req.hostname
//
// ============================================================


// ============================================================
// 46. MOST IMPORTANT RESPONSE METHODS
// ============================================================
//
// res.status()
// res.json()
// res.send()
// res.end()
// res.set()
// res.get()
// res.redirect()
// res.sendStatus()
// res.sendFile()
// res.download()
// res.cookie()
//
// ============================================================


// ============================================================
// 47. MOST IMPORTANT BUILT-IN MIDDLEWARE
// ============================================================
//
// express.json()
// express.urlencoded()
// express.static()
//
// ============================================================


// ============================================================
// 48. MIDDLEWARE TYPES
// ============================================================
//
// Application-level:
//
// app.use(middleware);
//
// Router-level:
//
// router.use(middleware);
//
// Route-level:
//
// app.get(
//     "/users",
//     auth,
//     validate,
//     controller
// );
//
// Error-level:
//
// app.use(
//     (err, req, res, next) => {}
// );
//
// ============================================================


// ============================================================
// 49. QUICK REFERENCE
// ============================================================
//
// SETUP
//
// const app = express();
//
// app.listen(3000);
//
//
// BODY
//
// app.use(express.json());
//
// req.body
//
//
// ROUTING
//
// app.get(path, handler)
// app.post(path, handler)
// app.put(path, handler)
// app.patch(path, handler)
// app.delete(path, handler)
//
// router.get()
// router.post()
//
//
// PARAMETERS
//
// req.params
// req.query
//
//
// REQUEST
//
// req.body
// req.headers
// req.method
// req.url
// req.ip
//
//
// RESPONSE
//
// res.status(200)
// res.json(data)
// res.send(data)
// res.end()
// res.redirect()
// res.sendFile()
// res.download()
// res.set()
//
//
// MIDDLEWARE
//
// app.use()
// next()
//
// Error:
//
// app.use((err, req, res, next) => {})
//
//
// ROUTER
//
// const router = express.Router();
//
// app.use("/api/users", router);
//
//
// STATIC
//
// app.use(express.static("public"));
//
//
// ASYNC
//
// app.get("/", async (req, res) => {
//     const data = await service();
//     res.json(data);
// });
//
//
// COMMON API FLOW
//
// Request
//    ↓
// Middleware
//    ↓
// Authentication
//    ↓
// Validation
//    ↓
// Router
//    ↓
// Controller
//    ↓
// Service
//    ↓
// Database
//    ↓
// Response
//
// ============================================================
//
// CORE MENTAL MODEL
//
// Express = HTTP routing + middleware abstraction
//              over Node.js HTTP.
//
// req  → incoming HTTP request
// res  → outgoing HTTP response
// next → continue middleware chain
//
// app.use()    → middleware
// app.get()    → route
// router      → route grouping
// req.body    → request data
// req.params  → URL parameters
// req.query   → query string
// res.json()  → JSON response
// error middleware → centralized errors
//
// ============================================================
