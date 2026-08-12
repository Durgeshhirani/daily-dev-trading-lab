// ============================================================
// NODE:FS CHEATSHEET
// File system operations in Node.js
// ============================================================
// node:fs handles server-side data persistence, log management, and system-level automation.It is the primary tool for moving data between memory and permanent physical storage.
// No installation required.
//NOTE: Please use fs/promises not fs
// Modern async API:
// import { promises as fs } from "node:fs";
//
// CommonJS:
// const fs = require("node:fs");
//
// Also available:
// import fs from "node:fs";
//
// ============================================================


import fs from "node:fs";
import { promises as fsp } from "node:fs";
import path from "node:path";


// ============================================================
// 1. PATH BASICS
// ============================================================

// __dirname is available in CommonJS.
// In ESM, use import.meta.url.

const currentDir = process.cwd();

const filePath = path.join(
    currentDir,
    "data",
    "users.json"
);

console.log(filePath);


// ============================================================
// 2. CHECK IF FILE / DIRECTORY EXISTS
// ============================================================

// Modern approach: access() inside try/catch.
// Avoid exists() for race-sensitive operations.

try {

    await fsp.access(filePath);

    console.log("File exists");

} catch {

    console.log("File does not exist");

}


// ============================================================
// 3. CREATE DIRECTORY
// ============================================================

// Creates one directory.

await fsp.mkdir(
    path.join(currentDir, "data"),
    { recursive: true }
);

// recursive: true
// → also creates missing parent directories.


// ============================================================
// 4. WRITE FILE
// ============================================================

// Creates file if it doesn't exist.
// Replaces existing content.

await fsp.writeFile(
    filePath,
    "Hello Node.js",
    "utf8"
);


// ============================================================
// 5. WRITE JSON
// ============================================================

const users = [
    { id: 1, name: "John" },
    { id: 2, name: "Alice" }
];

await fsp.writeFile(
    filePath,
    JSON.stringify(users, null, 2),
    "utf8"
);


// ============================================================
// 6. READ FILE
// ============================================================

// Returns string when encoding is specified.

const text = await fsp.readFile(
    filePath,
    "utf8"
);

console.log(text);


// Without encoding → Buffer.

const buffer = await fsp.readFile(filePath);

console.log(buffer);


// ============================================================
// 7. READ JSON FILE
// ============================================================

const jsonText = await fsp.readFile(
    filePath,
    "utf8"
);

const data = JSON.parse(jsonText);

console.log(data);


// ============================================================
// 8. APPEND TO FILE
// ============================================================

// Adds content to the end.

await fsp.appendFile(
    filePath,
    "\nNew line",
    "utf8"
);


// ============================================================
// 9. RENAME / MOVE
// ============================================================

const newPath = path.join(
    currentDir,
    "data",
    "users-renamed.json"
);

await fsp.rename(
    filePath,
    newPath
);


// ============================================================
// 10. COPY
// ============================================================

await fsp.copyFile(
    newPath,
    filePath
);


// ============================================================
// 11. DELETE FILE
// ============================================================

await fsp.unlink(filePath);


// ============================================================
// 12. DELETE DIRECTORY
// ============================================================

// recursive: true → delete contents too.

await fsp.rm(
    path.join(currentDir, "data"),
    {
        recursive: true,
        force: true
    }
);


// ============================================================
// 13. FILE / DIRECTORY INFORMATION
// ============================================================

const stats = await fsp.stat(newPath);

console.log(stats.size);        // bytes
console.log(stats.isFile());    // true / false
console.log(stats.isDirectory());
console.log(stats.mtime);       // modified time
console.log(stats.ctime);       // metadata change time


// ============================================================
// 14. FILE PERMISSIONS / MODE
// ============================================================

const stats2 = await fsp.stat(newPath);

console.log(stats2.mode);


// Change permissions.
// 0o644 = owner read/write, others read.

await fsp.chmod(
    newPath,
    0o644
);


// ============================================================
// 15. OPEN FILE
// ============================================================

// Useful when you need lower-level file operations.

const handle = await fsp.open(
    newPath,
    "r"
);

console.log(handle.fd);

await handle.close();


// ============================================================
// 16. COMMON FILE FLAGS
// ============================================================
//
// "r"   → read
// "w"   → write / truncate
// "a"   → append
// "r+"  → read + write
// "w+"  → read + write / truncate
// "a+"  → read + append
// "wx"  → create, fail if exists
//
// ============================================================


// ============================================================
// 17. SYNCHRONOUS API
// ============================================================
//
// Useful for:
// - startup scripts
// - CLI tools
// - simple configuration loading
//
// Avoid blocking sync operations in request handlers.

const syncText = fs.readFileSync(
    newPath,
    "utf8"
);

console.log(syncText);


// Sync write.

fs.writeFileSync(
    newPath,
    "Hello",
    "utf8"
);


// Sync append.

fs.appendFileSync(
    newPath,
    "\nWorld",
    "utf8"
);


// ============================================================
// 18. ASYNC vs SYNC
// ============================================================
//
// PREFERRED for servers:
//
// await fsp.readFile(...);
//
// AVOID inside request handlers:
//
// fs.readFileSync(...);
//
// Sync APIs block the Node.js event loop.
// ============================================================


// ============================================================
// 19. CALLBACK API
// ============================================================
//
// Older/common codebases may use callbacks.
//
// fs.readFile(
//     newPath,
//     "utf8",
//     (error, data) => {
//
//         if (error) {
//             console.error(error);
//             return;
//         }
//
//         console.log(data);
//     }
// );
//
// Modern code:
// await fsp.readFile(...);
//
// ============================================================


// ============================================================
// 20. ERROR HANDLING
// ============================================================

try {

    const content = await fsp.readFile(
        "does-not-exist.txt",
        "utf8"
    );

    console.log(content);

} catch (error) {

    if (error.code === "ENOENT") {

        console.log("File not found");

    } else if (error.code === "EACCES") {

        console.log("Permission denied");

    } else {

        console.error("File error:", error);
    }
}


// ============================================================
// 21. COMMON FS ERROR CODES
// ============================================================
//
// ENOENT  → file/directory doesn't exist
// EEXIST  → already exists
// EACCES  → permission denied
// EPERM   → operation not permitted
// ENOTDIR → expected directory but got file
// EISDIR  → expected file but got directory
//
// ============================================================


// ============================================================
// 22. LIST DIRECTORY
// ============================================================

const entries = await fsp.readdir(
    currentDir
);

console.log(entries);


// Get file type too.

const detailedEntries = await fsp.readdir(
    currentDir,
    {
        withFileTypes: true
    }
);

for (const entry of detailedEntries) {

    console.log(
        entry.name,
        entry.isFile(),
        entry.isDirectory()
    );
}


// ============================================================
// 23. FIND FILES IN DIRECTORY
// ============================================================

for (const entry of detailedEntries) {

    if (entry.isFile()) {

        console.log(
            "File:",
            entry.name
        );
    }
}


// ============================================================
// 24. CREATE TEMPORARY DIRECTORY
// ============================================================

const tempDir = await fsp.mkdtemp(
    path.join(currentDir, "tmp-")
);

console.log(tempDir);


// ============================================================
// 25. FILE STREAM — READ
// ============================================================
//
// Best for large files.
// Does NOT load the entire file into memory.

const readStream = fs.createReadStream(
    newPath,
    {
        encoding: "utf8"
    }
);

readStream.on("data", chunk => {

    console.log(chunk);

});

readStream.on("end", () => {

    console.log("Reading complete");

});

readStream.on("error", error => {

    console.error(error);

});


// ============================================================
// 26. FILE STREAM — WRITE
// ============================================================

const writeStream = fs.createWriteStream(
    path.join(currentDir, "output.txt")
);

writeStream.write("Hello\n");
writeStream.write("World\n");

writeStream.end();


// ============================================================
// 27. PIPE
// ============================================================
//
// Common for copying/serving large files.

const source = fs.createReadStream(
    newPath
);

const destination = fs.createWriteStream(
    path.join(currentDir, "copy.json")
);

source.pipe(destination);


// ============================================================
// 28. STREAM + HTTP
// ============================================================
//
// Typical backend pattern:
//
// HTTP request
//      ↓
// createReadStream()
//      ↓
// pipe()
//      ↓
// HTTP response
//
// Example:
//
// const server = http.createServer((req, res) => {
//
//     const stream = fs.createReadStream(
//         "./large-file.pdf"
//     );
//
//     stream.pipe(res);
//
// });
//
// ============================================================


// ============================================================
// 29. FILE WATCHING
// ============================================================
//
// Useful for development/config changes.
// Not a replacement for a reliable job/event system.

const watcher = fs.watch(
    currentDir,
    (eventType, filename) => {

        console.log(
            eventType,
            filename
        );

    }
);


// Stop watching:
//
// watcher.close();


// ============================================================
// 30. JSON FILE STORAGE PATTERN
// ============================================================
//
// Useful for small CLI/config/local tools.
// NOT a replacement for a database.

async function saveUsers(file, users) {

    await fsp.writeFile(
        file,
        JSON.stringify(users, null, 2),
        "utf8"
    );
}

async function loadUsers(file) {

    try {

        const content = await fsp.readFile(
            file,
            "utf8"
        );

        return JSON.parse(content);

    } catch (error) {

        if (error.code === "ENOENT") {
            return [];
        }

        throw error;
    }
}


// ============================================================
// 31. SAFE PATH HANDLING
// ============================================================
//
// Avoid directly trusting user-supplied file paths.
//
// BAD:
//
// const file = path.join(
//     uploadDir,
//     req.query.filename
// );
//
// User input could attempt:
//
// ../../etc/passwd
//
// Validate/normalize and ensure the final path remains
// inside the intended directory.

function safeFilePath(baseDir, filename) {

    const base = path.resolve(baseDir);

    const target = path.resolve(
        baseDir,
        filename
    );

    if (
        target !== base &&
        !target.startsWith(base + path.sep)
    ) {

        throw new Error(
            "Invalid file path"
        );
    }

    return target;
}


// ============================================================
// 32. UPLOAD DIRECTORY
// ============================================================

const uploadDir = path.join(
    currentDir,
    "uploads"
);

await fsp.mkdir(
    uploadDir,
    {
        recursive: true
    }
);


// ============================================================
// 33. COPY UPLOADED FILE
// ============================================================

const uploadedFile = safeFilePath(
    uploadDir,
    "example.txt"
);

await fsp.copyFile(
    newPath,
    uploadedFile
);


// ============================================================
// 34. ATOMIC-STYLE FILE REPLACEMENT
// ============================================================
//
// Useful when replacing configuration/data files.
//
// Write temporary file first,
// then rename it.

const tempFile = `${newPath}.tmp`;

await fsp.writeFile(
    tempFile,
    JSON.stringify(
        { updated: true },
        null,
        2
    ),
    "utf8"
);

await fsp.rename(
    tempFile,
    newPath
);


// ============================================================
// 35. COMMON PRODUCTION PATTERN
// ============================================================
//
// Ensure directory exists:
//
// await fsp.mkdir(dir, { recursive: true });
//
// Build path:
//
// const file = path.join(dir, filename);
//
// Write:
//
// await fsp.writeFile(file, data);
//
// Read:
//
// const data = await fsp.readFile(file, "utf8");
//
// Delete:
//
// await fsp.unlink(file);
//
// Large file:
//
// fs.createReadStream(file);
//
// ============================================================


// ============================================================
// 36. COMMON OPTIONS
// ============================================================
//
// readFile/writeFile:
//
// "utf8"
// "ascii"
// "base64"
// "hex"
// Buffer
//
// mkdir:
//
// recursive: true
//
// readdir:
//
// withFileTypes: true
//
// rm:
//
// recursive: true
// force: true
//
// createReadStream:
//
// encoding
// highWaterMark
//
// ============================================================


// ============================================================
// 37. IMPORTANT SECURITY RULES
// ============================================================
//
// 1. Never trust user-supplied paths.
//
// 2. Prevent path traversal.
//
// 3. Validate uploaded filenames.
//
// 4. Restrict upload directories.
//
// 5. Validate file type/size before processing.
//
// 6. Don't expose sensitive files.
//
// 7. Avoid storing secrets in arbitrary files.
//
// 8. Use appropriate file permissions.
//
// 9. Avoid synchronous FS calls in request handlers.
//
// 10. For large files, use streams.
//
// ============================================================


// ============================================================
// 38. REAL-WORLD FILE SERVICE
// ============================================================

class FileService {

    constructor(baseDir) {

        this.baseDir = path.resolve(baseDir);
    }


    async init() {

        await fsp.mkdir(
            this.baseDir,
            {
                recursive: true
            }
        );
    }


    getPath(filename) {

        return safeFilePath(
            this.baseDir,
            filename
        );
    }


    async save(filename, data) {

        const file = this.getPath(filename);

        await fsp.writeFile(
            file,
            data
        );

        return file;
    }


    async read(filename) {

        const file = this.getPath(filename);

        return fsp.readFile(
            file,
            "utf8"
        );
    }


    async delete(filename) {

        const file = this.getPath(filename);

        await fsp.unlink(file);
    }


    async exists(filename) {

        try {

            await fsp.access(
                this.getPath(filename)
            );

            return true;

        } catch {

            return false;
        }
    }
}


// Usage:
//
// const files = new FileService("./storage");
//
// await files.init();
//
// await files.save(
//     "hello.txt",
//     "Hello Node.js"
// );
//
// console.log(
//     await files.read("hello.txt")
// );
//
// await files.delete("hello.txt");


// ============================================================
// QUICK REFERENCE
// ============================================================
//
// IMPORT
//
// import fs from "node:fs";
// import { promises as fsp } from "node:fs";
//
//
// FILE CRUD
//
// fsp.readFile()
// fsp.writeFile()
// fsp.appendFile()
// fsp.rename()
// fsp.copyFile()
// fsp.unlink()
// fsp.rm()
//
//
// DIRECTORY
//
// fsp.mkdir()
// fsp.readdir()
// fsp.rmdir()       // legacy; prefer rm()
// fsp.mkdtemp()
//
//
// INFO
//
// fsp.stat()
// fsp.lstat()
// fsp.access()
//
//
// PERMISSIONS
//
// fsp.chmod()
//
//
// LOW LEVEL
//
// fsp.open()
//
//
// STREAMS
//
// fs.createReadStream()
// fs.createWriteStream()
// stream.pipe()
//
//
// WATCH
//
// fs.watch()
//
//
// SYNC
//
// fs.readFileSync()
// fs.writeFileSync()
// fs.appendFileSync()
//
//
// COMMON OBJECTS
//
// fs.Stats
// fs.Dirent
// fs.promises.FileHandle
// ReadStream
// WriteStream
//
//
// IMPORTANT OPTIONS
//
// encoding: "utf8"
// recursive: true
// withFileTypes: true
// force: true
// flag: "r" / "w" / "a"
// mode: 0o644
//
//
// COMMON ERRORS
//
// ENOENT
// EEXIST
// EACCES
// EPERM
// ENOTDIR
// EISDIR
//
//
// MOST IMPORTANT RULE
//
// Small file:
//
// await fsp.readFile()
//
// Large file:
//
// fs.createReadStream()
//
// Server code:
//
// Prefer async APIs.
// Avoid readFileSync()/writeFileSync() in request handlers.
//
// ============================================================
//
// CORE MENTAL MODEL
//
// node:fs
//    │
//    ├── files
//    │    ├── read
//    │    ├── write
//    │    ├── append
//    │    ├── copy
//    │    ├── rename
//    │    └── delete
//    │
//    ├── directories
//    │    ├── mkdir
//    │    ├── readdir
//    │    └── rm
//    │
//    ├── metadata
//    │    ├── stat
//    │    └── access
//    │
//    └── streams
//         ├── createReadStream
//         ├── createWriteStream
//         └── pipe
//
// ============================================================
