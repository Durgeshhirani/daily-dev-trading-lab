
// ============================================================
// NODE:PROCESS CHEATSHEET
// Built-in Node.js process API
// ============================================================
//
// No installation required.
//
// ESM:
// import process from "node:process";
//
// CommonJS:
// const process = require("node:process");
//
// In Node.js, `process` is also available globally:
//
// console.log(process.version);
//
// ============================================================


import process from "node:process";


// ============================================================
// 1. ENVIRONMENT VARIABLES
// ============================================================

// Read environment variables.

const nodeEnv = process.env.NODE_ENV;
const port = process.env.PORT || 3000;

console.log(nodeEnv);
console.log(port);


// Common production pattern:
//
// NODE_ENV=production
// PORT=3000
// DATABASE_URL=...
// JWT_SECRET=...


// Set an environment variable for the current process.

process.env.APP_NAME = "my-api";

console.log(process.env.APP_NAME);


// IMPORTANT:
// process.env values are strings.

process.env.PORT = "3000";

console.log(typeof process.env.PORT); // string


// Convert when necessary:

const PORT = Number(process.env.PORT || 3000);


// ============================================================
// 2. ENVIRONMENT CONFIGURATION
// ============================================================

const config = {
    env: process.env.NODE_ENV || "development",

    port: Number(
        process.env.PORT || 3000
    ),

    databaseUrl:
        process.env.DATABASE_URL,

    jwtSecret:
        process.env.JWT_SECRET
};

console.log(config);


// Never hard-code production secrets:
//
// const JWT_SECRET = "my-secret"; // BAD
//
// Prefer:
//
// const JWT_SECRET = process.env.JWT_SECRET;


// ============================================================
// 3. CURRENT WORKING DIRECTORY
// ============================================================

// Directory from which Node.js was started.

console.log(process.cwd());


// Change working directory.
// Usually avoid doing this in application code.

process.chdir("/tmp");

console.log(process.cwd());


// ============================================================
// 4. PROCESS ID
// ============================================================

console.log(process.pid);


// Parent process ID.

console.log(process.ppid);


// Useful for:
// - process monitoring
// - debugging
// - child processes


// ============================================================
// 5. NODE.JS VERSION
// ============================================================

console.log(process.version);


// Detailed versions.

console.log(process.versions);

// Example:
// {
//     node: "xx.x.x",
//     v8: "...",
//     openssl: "...",
//     ...
// }


// ============================================================
// 6. PLATFORM / OS
// ============================================================

console.log(process.platform);

// linux
// win32
// darwin


console.log(process.arch);

// x64
// arm64
// etc.


// ============================================================
// 7. COMMAND-LINE ARGUMENTS
// ============================================================

// Example:
//
// node app.js --port=4000 production
//
// process.argv:
//
// [
//     "/path/to/node",
//     "/path/to/app.js",
//     "--port=4000",
//     "production"
// ]

console.log(process.argv);


// Simple argument example:

const args = process.argv.slice(2);

console.log(args);


// Parse a basic argument:

const nameIndex = args.indexOf("--name");

if (nameIndex !== -1) {

    const name = args[nameIndex + 1];

    console.log(name);
}


// For complex CLI arguments, use a dedicated CLI library.
// Examples: commander, yargs, minimist.


// ============================================================
// 8. PROCESS EXIT
// ============================================================

// Exit successfully.

process.exit(0);


// Exit with error.

// process.exit(1);


// IMPORTANT:
// Prefer setting process.exitCode instead of calling
// process.exit() immediately when possible.
//
// process.exit() terminates the process immediately and
// can interrupt pending I/O.


process.exitCode = 1;


// ============================================================
// 9. EXIT CODES
// ============================================================
//
// 0 → success
// non-zero → failure
//
// Common:
//
// process.exitCode = 0;
// process.exitCode = 1;
//
// Shell can inspect the exit code:
//
// node app.js
// echo $?
//
// ============================================================


// ============================================================
// 10. PROCESS EVENTS
// ============================================================

// Process is about to exit.

process.on("exit", code => {

    console.log(
        "Process exiting:",
        code
    );
});


// IMPORTANT:
// The "exit" event must remain synchronous.
// Do not perform asynchronous work here.
//
// process.on("exit", async () => {
//     await something(); // TOO LATE
// });


// ============================================================
// 11. SIGTERM / GRACEFUL SHUTDOWN
// ============================================================

process.on("SIGTERM", async () => {

    console.log("SIGTERM received");

    // Close:
    // - HTTP server
    // - database connections
    // - Redis
    // - queues
    // - other resources

    // await server.close();
    // await db.close();

    process.exitCode = 0;
});


// SIGINT = Ctrl+C.

process.on("SIGINT", () => {

    console.log("Ctrl+C received");

    process.exitCode = 0;
});


// ============================================================
// 12. GRACEFUL SHUTDOWN PATTERN
// ============================================================
//
// const server = app.listen(PORT);
//
// async function shutdown(signal) {
//
//     console.log(`${signal} received`);
//
//     server.close(async () => {
//
//         await db.close();
//
//         process.exit(0);
//
//     });
// }
//
// process.on("SIGTERM", shutdown);
// process.on("SIGINT", shutdown);
//
//
//
// Production flow:
//
// SIGTERM
//    ↓
// stop accepting requests
//    ↓
// finish existing requests
//    ↓
// close DB / Redis / queues
//    ↓
// exit
//
// ============================================================


// ============================================================
// 13. UNCAUGHT EXCEPTIONS
// ============================================================
//
// Synchronous exception that reaches the process level.
//
// Usually treat this as a fatal condition.

process.on("uncaughtException", error => {

    console.error(
        "Uncaught exception:",
        error
    );

    // Log/alert if necessary.
    // Usually terminate after cleanup.
});


// IMPORTANT:
// Do not use uncaughtException as normal error handling.
//
// Prefer:
//
// try {
//     ...
// } catch (error) {
//     ...
// }


// ============================================================
// 14. UNHANDLED PROMISE REJECTIONS
// ============================================================

process.on(
    "unhandledRejection",
    reason => {

        console.error(
            "Unhandled rejection:",
            reason
        );
    }
);


// Better application code:
//
// try {
//
//     await something();
//
// } catch (error) {
//
//     // Handle expected error.
//
// }


// ============================================================
// 15. WARNING EVENTS
// ============================================================

process.on("warning", warning => {

    console.warn(
        warning.name,
        warning.message
    );
});


// ============================================================
// 16. SEND SIGNAL
// ============================================================
//
// Send a signal to another process.

process.kill(
    process.pid,
    "SIGTERM"
);


// Common signals:
//
// SIGINT  → Ctrl+C
// SIGTERM → termination request
// SIGKILL → force kill (cannot be handled)
// SIGHUP  → terminal/session related
//
// Do not normally use SIGKILL for graceful shutdown.
//
// ============================================================


// ============================================================
// 17. MEMORY USAGE
// ============================================================

const memory = process.memoryUsage();

console.log(memory);

// {
//     rss,
//     heapTotal,
//     heapUsed,
//     external,
//     arrayBuffers
// }


// Common:

console.log(
    "Heap used:",
    memory.heapUsed
);

console.log(
    "RSS:",
    memory.rss
);


// Convert bytes → MB:

const heapUsedMB =
    memory.heapUsed / 1024 / 1024;

console.log(
    heapUsedMB.toFixed(2),
    "MB"
);


// ============================================================
// 18. CPU USAGE
// ============================================================

const cpu = process.cpuUsage();

console.log(cpu);

// {
//     user: ...,
//     system: ...
// }


// Measure CPU usage over a period:

const startCPU = process.cpuUsage();

setTimeout(() => {

    const usage =
        process.cpuUsage(startCPU);

    console.log(usage);

}, 1000);


// ============================================================
// 19. HIGH-RESOLUTION TIME
// ============================================================
//
// Useful for measuring elapsed time.

const start = process.hrtime.bigint();


// Simulate work.

setTimeout(() => {

    const end = process.hrtime.bigint();

    const elapsedMs =
        Number(end - start) / 1_000_000;

    console.log(
        `Elapsed: ${elapsedMs.toFixed(2)} ms`
    );

}, 100);


// Modern alternative for many timing cases:
//
// performance.now()
//
// But process.hrtime.bigint() is useful for
// high-resolution elapsed-time measurement.
//
// ============================================================


// ============================================================
// 20. PROCESS UPTIME
// ============================================================

console.log(
    process.uptime()
);

// Seconds since Node.js process started.


// ============================================================
// 21. PROCESS RESOURCE USAGE
// ============================================================

const usage = process.resourceUsage();

console.log(usage);

// Useful for:
// - CPU
// - memory-related monitoring
// - filesystem I/O
// - process diagnostics


// ============================================================
// 22. STANDARD INPUT / OUTPUT / ERROR
// ============================================================
//
// stdin  → input
// stdout → normal output
// stderr → error/log output
//
// They are streams.

console.log("Hello");
// Same general purpose as:
// process.stdout.write("Hello\n");

process.stderr.write(
    "Something went wrong\n"
);


// ============================================================
// 23. READ FROM STDIN
// ============================================================

process.stdin.setEncoding("utf8");

process.stdin.on("data", data => {

    console.log(
        "Input:",
        data
    );
});


// For normal backend applications, you usually won't
// manually read stdin.


// ============================================================
// 24. STDOUT WRITE
// ============================================================

process.stdout.write(
    "Hello from stdout\n"
);


// ============================================================
// 25. STDERR WRITE
// ============================================================

process.stderr.write(
    "Error message\n"
);


// ============================================================
// 26. STDIO IS A STREAM
// ============================================================

console.log(
    process.stdin.isTTY
);

console.log(
    process.stdout.isTTY
);


// ============================================================
// 27. STDIN / STDOUT TTY CHECK
// ============================================================
//
// Useful for CLI applications:
//
// if (process.stdin.isTTY) {
//     console.log("Interactive terminal");
// }
//
// if (process.stdout.isTTY) {
//     console.log("Running in terminal");
// }
//
// ============================================================


// ============================================================
// 28. DEBUGGING
// ============================================================

console.log(
    "PID:",
    process.pid
);

console.log(
    "Node:",
    process.version
);

console.log(
    "Platform:",
    process.platform
);

console.log(
    "Environment:",
    process.env.NODE_ENV
);


// ============================================================
// 29. PROCESS TITLE
// ============================================================

// Change the visible process title.

process.title = "my-node-api";

console.log(process.title);


// Useful for:
// - process managers
// - system monitoring
// - distinguishing processes


// ============================================================
// 30. NODE EXECUTABLE / SCRIPT PATH
// ============================================================

// Node executable path.

console.log(
    process.execPath
);


// Current script path.

console.log(
    process.argv[1]
);


// Node command-line options.

console.log(
    process.execArgv
);


// Example:
//
// node --inspect app.js
//
// process.execArgv
// → ["--inspect"]


// ============================================================
// 31. PROCESS ENVIRONMENT
// ============================================================

console.log(
    process.env
);


// Common environment variables:

const environment =
    process.env.NODE_ENV || "development";

const isProduction =
    environment === "production";

if (isProduction) {

    console.log(
        "Production mode"
    );
}


// ============================================================
// 32. ENV VALIDATION
// ============================================================

function requireEnv(name) {

    const value = process.env[name];

    if (!value) {

        throw new Error(
            `Missing environment variable: ${name}`
        );
    }

    return value;
}


// Example:
//
// const JWT_SECRET = requireEnv("JWT_SECRET");
// const DATABASE_URL = requireEnv("DATABASE_URL");


// ============================================================
// 33. NODE_ENV PATTERN
// ============================================================

const env =
    process.env.NODE_ENV || "development";

switch (env) {

    case "development":

        console.log(
            "Development configuration"
        );

        break;

    case "test":

        console.log(
            "Test configuration"
        );

        break;

    case "production":

        console.log(
            "Production configuration"
        );

        break;
}


// ============================================================
// 34. ASYNC LOCAL STORAGE
// ============================================================
//
// AsyncLocalStorage is available from node:async_hooks,
// not directly from node:process.
//
// Common use:
// - request ID
// - correlation ID
// - request-scoped context
//
// Example:
//
// import {
//     AsyncLocalStorage
// } from "node:async_hooks";
//
// const storage = new AsyncLocalStorage();
//
// storage.run(
//     { requestId: "abc123" },
//     async () => {
//
//         console.log(
//             storage.getStore()
//         );
//
//     }
// );
//
// ============================================================


// ============================================================
// 35. PROCESS ENV + CONFIG FILE PATTERN
// ============================================================

const config = Object.freeze({

    nodeEnv:
        process.env.NODE_ENV || "development",

    port:
        Number(process.env.PORT || 3000),

    logLevel:
        process.env.LOG_LEVEL || "info",

    databaseUrl:
        process.env.DATABASE_URL || null
});

console.log(config);


// ============================================================
// 36. WORKER / CLUSTER RELATED
// ============================================================
//
// process.pid
// process.ppid
//
// Useful when running multiple Node.js workers.
//
// Example:
//
// console.log({
//     pid: process.pid,
//     parentPid: process.ppid
// });





//
// For modern multi-process applications, use:
// - worker_threads
// - child_process
// - cluster (where appropriate)
//
// ============================================================


// ============================================================
// 37. SECURITY RULES
// ============================================================
//
// 1. Never commit secrets from process.env.
//
// 2. Don't print secrets:
//
// console.log(process.env);
// // BAD
//
// 3. Don't expose DATABASE_URL / JWT_SECRET in logs.
//
// 4. Validate required environment variables at startup.
//
// 5. Convert numeric environment values explicitly.
//
// 6. Treat all environment values as untrusted configuration.
//
// 7. Don't expose internal process information through
//    public API responses.
//
// 8. Don't use process.exit() as normal error handling.
//
// ============================================================


// ============================================================
// 38. STARTUP VALIDATION
// ============================================================

function validateConfig() {

    const required = [
        "DATABASE_URL",
        "JWT_SECRET"
    ];

    for (const name of required) {

        if (!process.env[name]) {

            throw new Error(
                `Missing ${name}`
            );
        }
    }
}


// Call before starting the server.
//
// validateConfig();
// app.listen(PORT);


// ============================================================
// 39. REAL-WORLD SHUTDOWN MANAGER
// ============================================================

let shuttingDown = false;

async function shutdown(signal) {

    if (shuttingDown) {
        return;
    }

    shuttingDown = true;

    console.log(
        `${signal} received`
    );

    try {

        // Example cleanup:
        //
        //      await server.close();
        //      await database.close();
        //      await redis.quit();
        //      await queue.close();

        console.log(
            "Cleanup completed"
        );

        process.exitCode = 0;

    } catch (error) {

        console.error(
            "Shutdown error:",
            error
        );

        process.exitCode = 1;
    }
}


process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
);

process.on(
    "SIGINT",
    () => shutdown("SIGINT")
);


// ============================================================
// 40. PROCESS-LEVEL ERROR HANDLING
// ============================================================
//
// These should be the LAST safety net,
// not the main error-handling mechanism.

process.on(
    "uncaughtException",
    error => {

        console.error(
            "FATAL:",
            error
        );

        process.exitCode = 1;
    }
);

process.on(
    "unhandledRejection",
    reason => {

        console.error(
            "UNHANDLED REJECTION:",
            reason
        );

        process.exitCode = 1;
    }
);


// ============================================================
// 41. REAL-WORLD NODE API STARTUP
// ============================================================
//
// Typical structure:
//
// validateConfig()
//      ↓
// initialize DB
//      ↓
// initialize Redis
//      ↓
// start Express server
//      ↓
// handle SIGTERM/SIGINT
//      ↓
// graceful cleanup
//
// Example:
//
// async function bootstrap() {
//
//     validateConfig();
//
//     await database.connect();
//
//     const server = app.listen(
//         PORT,
//         () => console.log(
//             `API running on ${PORT}`
//         )
//     );
//
//     async function shutdown(signal) {
//
//         console.log(
//             `${signal} received`
//         );
//
//         server.close(async () => {
//
//             await database.close();
//
//             process.exit(0);
//         });
//     }
//
//     process.on("SIGTERM", () => shutdown("SIGTERM"));
//     process.on("SIGINT", () => shutdown("SIGINT"));
// }
//
// bootstrap();
//
// ============================================================


// ============================================================
// 42. IMPORTANT PROCESS PROPERTIES
// ============================================================
//
// process.env
// process.argv
// process.pid
// process.ppid
// process.platform
// process.arch
// process.version
// process.versions
// process.cwd()
// process.execPath
// process.execArgv
// process.exitCode
// process.title
// process.stdin
// process.stdout
// process.stderr
//
// ============================================================


// ============================================================
// 43. IMPORTANT PROCESS METHODS
// ============================================================
//
// process.cwd()
//     Current working directory.
//
// process.chdir()
//     Change working directory.
//
// process.exit()
//     Immediately terminate process.
//
// process.kill()
//     Send signal to process.
//
// process.memoryUsage()
//     Memory statistics.
//
// process.cpuUsage()
//     CPU usage.
//
// process.resourceUsage()
//     Resource statistics.
//
// process.uptime()
//     Seconds since process started.
//
// process.hrtime.bigint()
//     High-resolution elapsed time.
//
// ============================================================


// ============================================================
// 44. IMPORTANT EVENTS
// ============================================================
//
// "exit"
//     Process is about to exit.
//
// "SIGINT"
//     Ctrl+C / interrupt.
//
// "SIGTERM"
//     Termination request.
//
// "uncaughtException"
//     Unhandled synchronous exception.
//
// "unhandledRejection"
//     Unhandled Promise rejection.
//
// "warning"
//     Node.js runtime warning.
//
// ============================================================


// ============================================================
// 45. QUICK REFERENCE
// ============================================================
//
// ENV:
//
// process.env.NODE_ENV
// process.env.PORT
// process.env.DATABASE_URL
//
//
// ARGS:
//
// process.argv
//
//
// PROCESS:
//
// process.pid
// process.ppid
// process.platform
// process.arch
// process.version
// process.versions
//
//
// PATH:
//
// process.cwd()
// process.chdir()
//
//
// EXIT:
//
// process.exitCode = 1;
// process.exit(1);
//
//
// SIGNAL:
//
// process.on("SIGTERM", handler);
// process.on("SIGINT", handler);
//
//
// ERROR:
//
// process.on("uncaughtException", handler);
// process.on("unhandledRejection", handler);
//
//
// MONITORING:
//
// process.memoryUsage()
// process.cpuUsage()
// process.resourceUsage()
// process.uptime()
//
//
// TIME:
//
// process.hrtime.bigint()
//
//
// STDIO:
//
// process.stdin
// process.stdout
// process.stderr
//
//
// EXECUTION:
//
// process.execPath
// process.execArgv
//
//
// TITLE:
//
// process.title
//
// ============================================================
//
// CORE MENTAL MODEL
//
// node:process gives your application access to the
// running Node.js process.
//
//
// CONFIGURATION
//      │
//      └── process.env
//
// EXECUTION
//      │
//      ├── process.argv
//      ├── process.pid
//      └── process.version
//
// SYSTEM
//      │
//      ├── process.platform
//      ├── process.arch
//      └── process.cwd()
//
// LIFECYCLE
//      │
//      ├── SIGTERM
//      ├── SIGINT
//      ├── exit
//      └── graceful shutdown
//
// DIAGNOSTICS
//      │
//      ├── memoryUsage()
//      ├── cpuUsage()
//      ├── resourceUsage()
//      └── uptime()
//
// I/O
//      │
//      ├── stdin
//      ├── stdout
//      └── stderr
//
// ============================================================
//
// MOST IMPORTANT THINGS TO REMEMBER
//
// 1. process.env → application configuration
//
// 2. process.argv → CLI arguments
//
// 3. process.on("SIGTERM", ...) → graceful shutdown
//
// 4. process.memoryUsage() → memory monitoring
//
// 5. process.cwd() → current working directory
//
// 6. process.exitCode → preferred way to indicate failure
//    when you can allow cleanup to finish
//
// 7. uncaughtException / unhandledRejection
//    → last-resort safety net, NOT normal error handling
//
// 8. Environment variables are strings.
//
// 9. Never log secrets from process.env.
//
// 10. In production, handle SIGTERM and clean up resources.
//
// ============================================================
