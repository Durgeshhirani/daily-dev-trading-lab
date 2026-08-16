// ============================================================
// NODE:PATH CHEATSHEET
// Cross-platform file and directory path utilities
// ============================================================
//
// No installation required.
//
// ESM:
// import path from "node:path";
//
// CommonJS:
// const path = require("node:path");
//
// ============================================================


import path from "node:path";


// ============================================================
// 1. BASIC PATH CREATION
// ============================================================

// Join path segments safely for the current OS.

const filePath = path.join(
    "uploads",
    "users",
    "profile.jpg"
);

console.log(filePath);

// Linux/macOS:
// uploads/users/profile.jpg
//
// Windows:
// uploads\users\profile.jpg


// Prefer path.join() over manually concatenating:
//
// BAD:
// const file = "uploads/" + userId + "/" + filename;
//
// GOOD:
const file = path.join(
    "uploads",
    String(123),
    "profile.jpg"
);


// ============================================================
// 2. RESOLVE ABSOLUTE PATH
// ============================================================

// Converts path into an absolute path.

const absolutePath = path.resolve(
    "uploads",
    "profile.jpg"
);

console.log(absolutePath);


// path.resolve() starts from the current working directory
// when the path is relative.

console.log(process.cwd());


// ============================================================
// 3. __dirname / CURRENT FILE DIRECTORY
// ============================================================
//
// CommonJS:
//
// console.log(__dirname);
//
// In ESM, use import.meta.url:
//
// import { fileURLToPath } from "node:url";
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// ============================================================


// ============================================================
// 4. ESM __filename / __dirname PATTERN
// ============================================================

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__filename);
console.log(__dirname);


// Build path relative to current source file:

const configPath = path.join(
    __dirname,
    "config",
    "app.json"
);

console.log(configPath);


// ============================================================
// 5. BASENAME
// ============================================================

// Get the final part of a path.

console.log(
    path.basename(
        "/uploads/users/profile.jpg"
    )
);

// profile.jpg


// Remove extension:

console.log(
    path.basename(
        "/uploads/users/profile.jpg",
        ".jpg"
    )
);

// profile


// ============================================================
// 6. DIRNAME
// ============================================================

// Get parent directory.

console.log(
    path.dirname(
        "/uploads/users/profile.jpg"
    )
);

// /uploads/users


// Very commonly used with fs:

const parentDir = path.dirname(
    configPath
);


// ============================================================
// 7. EXTNAME
// ============================================================

// Get file extension.

console.log(
    path.extname("profile.jpg")
);

// .jpg


console.log(
    path.extname("archive.tar.gz")
);

// .gz


// No extension:

console.log(
    path.extname("README")
);

// ""


// ============================================================
// 8. PARSE
// ============================================================

// Break path into components.

const parsed = path.parse(
    "/uploads/users/profile.jpg"
);

console.log(parsed);

/*
{
    root: "/",
    dir: "/uploads/users",
    base: "profile.jpg",
    ext: ".jpg",
    name: "profile"
}
*/


// ============================================================
// 9. FORMAT
// ============================================================

// Build a path from parsed components.

const formatted = path.format({
    dir: "/uploads/users",
    name: "profile",
    ext: ".jpg"
});

console.log(formatted);

// /uploads/users/profile.jpg


// ============================================================
// 10. PATH PARTS
// ============================================================

const parsedPath = path.parse(
    "/home/user/file.txt"
);

const root = parsedPath.root;
const dir = parsedPath.dir;
const base = parsedPath.base;
const ext = parsedPath.ext;
const name = parsedPath.name;

console.log({
    root,
    dir,
    base,
    ext,
    name
});


// ============================================================
// 11. NORMALIZE
// ============================================================

// Cleans redundant separators and "." / ".." segments.

console.log(
    path.normalize(
        "/users//john/./documents/../photo.jpg"
    )
);

// /users/john/photo.jpg


// Useful when receiving/constructing paths from multiple pieces.


// ============================================================
// 12. RELATIVE
// ============================================================

// Find relative path from one location to another.

const from = "/home/user/project";
const to = "/home/user/project/uploads/file.txt";

console.log(
    path.relative(from, to)
);

// uploads/file.txt


// ============================================================
// 13. IS ABSOLUTE
// ============================================================

console.log(
    path.isAbsolute("/home/user/file.txt")
);

// true

console.log(
    path.isAbsolute("uploads/file.txt")
);

// false


// ============================================================
// 14. JOIN vs RESOLVE
// ============================================================

// join()
// → combines path segments.
//
// resolve()
// → creates an absolute path.

console.log(
    path.join(
        "project",
        "uploads",
        "file.txt"
    )
);

console.log(
    path.resolve(
        "project",
        "uploads",
        "file.txt"
    )
);


// Important difference:

console.log(
    path.join("/a", "/b")
);

// /a/b on POSIX

console.log(
    path.resolve("/a", "/b")
);

// /b
//
// resolve() processes from right to left and an absolute
// segment resets the path.


/*
MENTAL MODEL:

path.join()
    "Put these pieces together."

path.resolve()
    "Give me the absolute location."
*/


// ============================================================
// 15. SEPARATORS
// ============================================================

// Platform-specific separator.

console.log(path.sep);

// Linux/macOS → /
// Windows      → \


// PATH delimiter used in environment variables.

console.log(path.delimiter);

// Linux/macOS → :
// Windows      → ;


// ============================================================
// 16. POSIX vs WINDOWS PATH
// ============================================================
//
// path.posix → always POSIX-style
// path.win32 → always Windows-style
//
// Usually use:
//
// path.join()
// path.resolve()
//
// for the current operating system.
//
// ============================================================

console.log(
    path.posix.join(
        "users",
        "john",
        "file.txt"
    )
);

// users/john/file.txt


console.log(
    path.win32.join(
        "users",
        "john",
        "file.txt"
    )
);

// users\john\file.txt


// ============================================================
// 17. FILE EXTENSION VALIDATION
// ============================================================

function isImageFile(filename) {

    const ext = path
        .extname(filename)
        .toLowerCase();

    return [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ].includes(ext);
}


console.log(
    isImageFile("photo.JPG")
);

// true


// ============================================================
// 18. CHANGE FILE EXTENSION
// ============================================================

function changeExtension(filename, extension) {

    const parsed = path.parse(filename);

    return path.format({
        ...parsed,
        base: undefined,
        ext: extension
    });
}

console.log(
    changeExtension(
        "report.txt",
        ".json"
    )
);

// report.json


// Simpler/common approach:

function replaceExtension(filename, extension) {

    return path.join(
        path.dirname(filename),
        path.basename(
            filename,
            path.extname(filename)
        ) + extension
    );
}


// ============================================================
// 19. FILE PATH WITH NODE:FS
// ============================================================
//
// node:path usually works together with node:fs.
//
// Example:
//
// import { promises as fs } from "node:fs";
//
// const uploadDir = path.join(
//     process.cwd(),
//     "uploads"
// );
//
// await fs.mkdir(
//     uploadDir,
//     { recursive: true }
// );
//
// const filePath = path.join(
//     uploadDir,
//     "profile.jpg"
// );
//
// await fs.readFile(filePath);
//
// ============================================================


// ============================================================
// 20. PROJECT ROOT PATH
// ============================================================

// Based on current working directory:

const projectRoot = process.cwd();

const uploadsDir = path.join(
    projectRoot,
    "uploads"
);

const logsDir = path.join(
    projectRoot,
    "logs"
);

const configDir = path.join(
    projectRoot,
    "config"
);


// ============================================================
// 21. PATH RELATIVE TO SOURCE FILE
// ============================================================

const assetsDir = path.join(
    __dirname,
    "assets"
);

const templatePath = path.join(
    assetsDir,
    "email.html"
);


// Useful when files should be relative to the source file,
// rather than wherever `node` was launched from.


// ============================================================
// 22. SAFE USER FILE PATH
// ============================================================
//
// Never blindly combine user input with a filesystem path.
//
// BAD:
//
// const file = path.join(
//     uploadDir,
//     req.params.filename
// );
//
// A malicious filename could attempt:
//
// ../../../../etc/passwd
//
// ============================================================

function safePath(baseDir, userPath) {

    const base = path.resolve(baseDir);

    const target = path.resolve(
        baseDir,
        userPath
    );

    if (
        target !== base &&
        !target.startsWith(
            base + path.sep
        )
    ) {

        throw new Error(
            "Invalid path"
        );
    }

    return target;
}


// Example:

const safeFile = safePath(
    uploadsDir,
    "users/123/photo.jpg"
);

console.log(safeFile);


// ============================================================
// 23. PATH TRAVERSAL
// ============================================================
//
// Dangerous:
//
// /uploads/../../secret.txt
//
// Common malicious input:
//
// ../
// ../../
// ..\
//
// Always validate paths when they contain user input.
//
// IMPORTANT:
// path.normalize() alone is NOT sufficient security.
//
// Prefer resolving the final path and checking that it
// remains inside the intended directory.
//
// ============================================================


// ============================================================
// 24. USER-SUPPLIED FILENAME
// ============================================================
//
// Better approach for uploads:
// Generate your own filename.
//
// Example:

import crypto from "node:crypto";

const generatedFilename =
    crypto.randomUUID() + ".jpg";

const uploadPath = path.join(
    uploadsDir,
    generatedFilename
);

console.log(uploadPath);


// Don't use arbitrary user filenames as trusted paths.


// ============================================================
// 25. PATH EXTENSION + MIME TYPE
// ============================================================
//
// Extension alone is not reliable security.
//
// Example:
//
// image.jpg.exe
//
// or:
//
// malicious.jpg
//
// For uploads, validate:
// - extension
// - MIME type
// - file contents/signature
// - file size
//
// ============================================================


// ============================================================
// 26. COMMON PATH PATTERNS
// ============================================================

// Project file:

const packageJson = path.join(
    projectRoot,
    "package.json"
);


// Log file:

const appLog = path.join(
    projectRoot,
    "logs",
    "app.log"
);


// User upload:

const userUpload = path.join(
    projectRoot,
    "uploads",
    "users",
    "123",
    "avatar.jpg"
);


// Temporary file:

const tempFile = path.join(
    projectRoot,
    "tmp",
    "processing.json"
);


// ============================================================
// 27. PATH NORMALIZATION
// ============================================================

const messyPath =
    "uploads//users/123/../456/avatar.jpg";

const cleanPath =
    path.normalize(messyPath);

console.log(cleanPath);

// uploads/users/456/avatar.jpg


// ============================================================
// 28. RELATIVE URL vs FILESYSTEM PATH
// ============================================================
//
// Filesystem path:
//
// path.join(
//     "uploads",
//     "image.jpg"
// );
//
// URL path:
//
// "/uploads/image.jpg"
//
// Don't use filesystem paths for URLs blindly.
//
// Windows:
//
// path.join("uploads", "image.jpg")
// → uploads\image.jpg
//
// HTTP URL needs:
//
// /uploads/image.jpg
//
// ============================================================


// ============================================================
// 29. PATH TO URL
// ============================================================
//
// For ESM file URLs, use node:url.
//
// import {
//     pathToFileURL
// } from "node:url";
//
// const url = pathToFileURL(
//     "/home/user/project/file.js"
// );
//
// ============================================================


// ============================================================
// 30. URL TO PATH
// ============================================================
//
// import {
//     fileURLToPath
// } from "node:url";
//
// const filename = fileURLToPath(
//     import.meta.url
// );
//
// Common ESM pattern:
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// ============================================================


// ============================================================
// 31. COMMON ERRORS / EDGE CASES
// ============================================================
//
// path.basename("")
// path.dirname("")
// path.extname("")
//
// may return empty/current-directory-style results depending
// on the operation.
//
// Don't assume every input is a valid file path.
//
// Validate application input before constructing paths.
//
// ============================================================


// ============================================================
// 32. PATH PARSING EXAMPLE
// ============================================================

function getFileInfo(filePath) {

    const parsed = path.parse(filePath);

    return {
        directory: parsed.dir,
        filename: parsed.base,
        name: parsed.name,
        extension: parsed.ext
    };
}


console.log(
    getFileInfo(
        "/uploads/users/avatar.png"
    )
);


// ============================================================
// 33. REAL-WORLD FILE SERVICE
// ============================================================

class FilePathService {

    constructor(baseDir) {

        this.baseDir =
            path.resolve(baseDir);
    }


    file(filename) {

        return safePath(
            this.baseDir,
            filename
        );
    }


    upload(userId, filename) {

        return this.file(
            path.join(
                "users",
                String(userId),
                filename
            )
        );
    }


    log(filename) {

        return this.file(
            path.join(
                "logs",
                filename
            )
        );
    }
}


const paths =
    new FilePathService(
        path.join(
            process.cwd(),
            "storage"
        )
    );


console.log(
    paths.upload(
        123,
        "avatar.jpg"
    )
);

console.log(
    paths.log(
        "app.log"
    )
);


// ============================================================
// 34. EXPRESS + PATH
// ============================================================
//
// Very common:
//
// import express from "express";
//
// const app = express();
//
// const publicDir = path.join(
//     process.cwd(),
//     "public"
// );
//
// app.use(
//     express.static(publicDir)
// );
//
// ============================================================


// ============================================================
// 35. NODE:FS + PATH
// ============================================================
//
// Typical backend pattern:
//
// import {
//     promises as fs
// } from "node:fs";
//
// const dir = path.join(
//     process.cwd(),
//     "uploads"
// );
//
// await fs.mkdir(
//     dir,
//     { recursive: true }
// );
//
// const file = path.join(
//     dir,
//     "image.jpg"
// );
//
// await fs.writeFile(
//     file,
//     data
// );
//
// ============================================================


// ============================================================
// 36. IMPORTANT FUNCTIONS
// ============================================================
//
// path.join()
//     Join path segments.
//
// path.resolve()
//     Create absolute path.
//
// path.normalize()
//     Normalize path.
//
// path.relative()
//     Get relative path.
//
// path.isAbsolute()
//     Check absolute path.
//
// path.basename()
//     Get final filename.
//
// path.dirname()
//     Get parent directory.
//
// path.extname()
//     Get extension.
//
// path.parse()
//     Break path into components.
//
// path.format()
//     Build path from components.
//
// ============================================================


// ============================================================
// 37. IMPORTANT PROPERTIES
// ============================================================
//
// path.sep
//     Platform-specific path separator.
//
// path.delimiter
//     Platform-specific PATH delimiter.
//
// path.posix
//     POSIX path implementation.
//
// path.win32
//     Windows path implementation.
//
// ============================================================


// ============================================================
// 38. PARSED PATH OBJECT
// ============================================================
//
// path.parse("/home/user/file.txt")
//
// {
//     root: "/",
//     dir: "/home/user",
//     base: "file.txt",
//     ext: ".txt",
//     name: "file"
// }
//
// ============================================================


// ============================================================
// 39. QUICK REFERENCE
// ============================================================
//
// JOIN
//
// path.join(
//     "uploads",
//     "users",
//     "avatar.jpg"
// );
//
//
// ABSOLUTE
//
// path.resolve(
//     "uploads",
//     "avatar.jpg"
// );
//
//
// FILENAME
//
// path.basename(
//     "/uploads/avatar.jpg"
// );
//
//
// DIRECTORY
//
// path.dirname(
//     "/uploads/avatar.jpg"
// );
//
//
// EXTENSION
//
// path.extname(
//     "avatar.jpg"
// );
//
//
// PARSE
//
// path.parse(
//     "/uploads/avatar.jpg"
// );
//
//
// FORMAT
//
// path.format({
//     dir: "/uploads",
//     name: "avatar",
//     ext: ".jpg"
// });
//
//
// NORMALIZE
//
// path.normalize(
//     "/uploads//users/../avatar.jpg"
// );
//
//
// RELATIVE
//
// path.relative(
//     "/project",
//     "/project/uploads/file.jpg"
// );
//
//
// ABSOLUTE CHECK
//
// path.isAbsolute(
//     "/project/file.txt"
// );
//
//
// PLATFORM
//
// path.sep
// path.delimiter
// path.posix
// path.win32
//
// ============================================================
//
// MOST IMPORTANT DIFFERENCE
//
// path.join()
//     Combine paths.
//
// path.resolve()
//     Produce absolute path.
//
// path.basename()
//     Get filename.
//
// path.dirname()
//     Get parent directory.
//
// path.extname()
//     Get extension.
//
// path.parse()
//     Break path apart.
//
// path.format()
//     Build path.
//
// path.relative()
//     Find path between locations.
//
// path.normalize()
//     Clean path.
//
// path.isAbsolute()
//     Check whether absolute.
//
// ============================================================
//
// SECURITY
//
// User input
//     ↓
// path.resolve()
//     ↓
// verify it stays inside allowed directory
//     ↓
// node:fs
//
// Never:
//
// path.join(uploadDir, userInput)
//
// without validating userInput.
//
// ============================================================
//
// CORE MENTAL MODEL
//
// node:path does NOT read, write, create, or delete files.
//
// It ONLY works with path strings.
//
//
// node:path
//     │
//     ├── Build
//     │    ├── join()
//     │    └── format()
//     │
//     ├── Convert
//     │    ├── resolve()
//     │    ├── normalize()
//     │    └── relative()
//     │
//     ├── Inspect
//     │    ├── basename()
//     │    ├── dirname()
//     │    ├── extname()
//     │    └── parse()
//     │
//     └── Platform
//          ├── sep
//          ├── delimiter
//          ├── posix
//          └── win32
//
// ============================================================
//
// MOST IMPORTANT RULE:
//
// Use path.join()/path.resolve() instead of manually
// concatenating filesystem paths.
//
// node:path → creates/manipulates paths
// node:fs   → actually accesses the filesystem
//
// ============================================================
