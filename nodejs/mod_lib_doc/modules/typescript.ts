// ============================================================
// TYPESCRIPT + TS-NODE CHEATSHEET
// Practical Node.js backend development reference
// ============================================================
//
// INSTALL
//
// npm install -D typescript ts-node @types/node
//
// Initialize TypeScript:
//
// npx tsc --init
//
// Run a TypeScript file:
//
// npx ts-node src/index.ts
//
// Or:
//
// npx ts-node --transpile-only src/index.ts
//
// package.json:
//
// {
//   "scripts": {
//     "dev": "ts-node src/index.ts",
//     "build": "tsc",
//     "start": "node dist/index.js"
//   }
// }
//
// IMPORTANT:
// TypeScript = language/compiler/type system
// ts-node   = executes TypeScript directly in Node.js
//
// Production normally:
// .ts → tsc → .js → Node.js
//
// ============================================================


// ============================================================
// 1. BASIC TYPESCRIPT
// ============================================================

const name: string = "John";

const age: number = 25;

const active: boolean = true;

const nothing: null = null;

const notDefined: undefined = undefined;


// Type inference usually makes explicit types unnecessary:

const username = "john"; // string
const count = 10;        // number
const isAdmin = false;   // boolean


// Avoid `any` unless necessary:

let data: any = "hello";

data = 123;
data.foo.bar(); // TypeScript cannot protect you


// Prefer `unknown` for unknown external data:

let input: unknown = "hello";

if (typeof input === "string") {
    console.log(input.toUpperCase());
}


// ============================================================
// 2. ARRAYS
// ============================================================

const names: string[] = [
    "John",
    "Jane"
];

const numbers: Array<number> = [
    1,
    2,
    3
];


// Objects in arrays:

type User = {
    id: number;
    name: string;
};

const users: User[] = [
    {
        id: 1,
        name: "John"
    }
];


// ============================================================
// 3. OBJECT TYPES
// ============================================================

type Product = {
    id: number;
    name: string;
    price: number;
};

const product: Product = {
    id: 1,
    name: "Laptop",
    price: 50000
};


// Optional property:

type CreateUser = {
    name: string;
    email: string;
    age?: number;
};


// Read-only property:

type Config = {
    readonly port: number;
};

const config: Config = {
    port: 3000
};

// config.port = 4000; // Error


// ============================================================
// 4. TYPE ALIASES
// ============================================================

type ID = number;

type Email = string;

type UserRole =
    | "admin"
    | "user"
    | "moderator";


const role: UserRole = "admin";


// Union:

type IDValue = string | number;

let id: IDValue = 10;

id = "abc";


// Intersection:

type Timestamps = {
    createdAt: Date;
    updatedAt: Date;
};

type Entity = Product & Timestamps;


// ============================================================
// 5. INTERFACES
// ============================================================
//
// Common for object contracts/classes.
//
// ============================================================

interface UserInterface {

    id: number;

    name: string;

    email: string;

    age?: number;
}


const user: UserInterface = {
    id: 1,
    name: "John",
    email: "john@example.com"
};


// Interface extension:

interface Admin extends UserInterface {

    permissions: string[];
}


const admin: Admin = {
    id: 1,
    name: "John",
    email: "john@example.com",
    permissions: [
        "users.read",
        "users.write"
    ]
};


// ============================================================
// 6. TYPE vs INTERFACE
// ============================================================
//
// type:
//
// type User = {
//     id: number;
// };
//
// interface:
//
// interface User {
//     id: number;
// }
//
// Both are commonly used.
//
// Practical rule:
//
// type      → unions, intersections, aliases
// interface → object/class contracts
//
// Don't waste time choosing between them for simple objects.
//
// ============================================================


// ============================================================
// 7. FUNCTIONS
// ============================================================

function add(
    a: number,
    b: number
): number {

    return a + b;
}


const result = add(10, 20);


// Arrow function:

const multiply = (
    a: number,
    b: number
): number => {

    return a * b;
};


// Optional parameter:

function greet(
    name: string,
    greeting?: string
): string {

    return `${greeting || "Hello"} ${name}`;
}


// Default parameter:

function createUser(
    name: string,
    role: string = "user"
): User {

    return {
        id: Date.now(),
        name
    };
}


// ============================================================
// 8. VOID / NEVER
// ============================================================

// void → function doesn't return a useful value.

function logMessage(
    message: string
): void {

    console.log(message);
}


// never → function never successfully returns.

function throwError(
    message: string
): never {

    throw new Error(message);
}


// Common use:
//
// function assert(condition: boolean): asserts condition
//
// See assertion section below.


// ============================================================
// 9. OBJECT DESTRUCTURING TYPES
// ============================================================

function printUser({
    id,
    name
}: User): void {

    console.log(id, name);
}


// ============================================================
// 10. ENUMS
// ============================================================
//
// Usually prefer union literals for simple application values.
//
// ============================================================

type Status =
    | "pending"
    | "active"
    | "completed";


// Instead of:
//
// enum Status {
//     Pending,
//     Active,
//     Completed
// }
//
// ============================================================


// ============================================================
// 11. CLASSES
// ============================================================

class UserService {

    private users: User[] = [];


    addUser(user: User): void {

        this.users.push(user);
    }


    getUsers(): User[] {

        return this.users;
    }
}


const userService =
    new UserService();


// ============================================================
// 12. ACCESS MODIFIERS
// ============================================================

class Account {

    public id: number;

    private password: string;

    protected type: string;


    constructor(
        id: number,
        password: string
    ) {

        this.id = id;
        this.password = password;
        this.type = "user";
    }


    public login(): boolean {

        return true;
    }


    private verifyPassword(): boolean {

        return true;
    }
}


// public
//     accessible everywhere
//
// private
//     accessible only inside class
//
// protected
//     class + subclasses
//
// ============================================================


// ============================================================
// 13. PARAMETER PROPERTIES
// ============================================================

class UserModel {

    constructor(
        public id: number,
        public name: string,
        private password: string
    ) { }
}


const model =
    new UserModel(
        1,
        "John",
        "secret"
    );


// ============================================================
// 14. GENERICS
// ============================================================
//
// Reusable type-safe code.
//
// ============================================================

function identity<T>(
    value: T
): T {

    return value;
}


const numberValue =
    identity<number>(10);

const stringValue =
    identity<string>("hello");


// TypeScript can infer T:

const inferred =
    identity(123);


// ============================================================
// 15. GENERIC API RESPONSE
// ============================================================

type ApiResponse<T> = {

    success: boolean;

    data: T;

    message?: string;
};


const response: ApiResponse<User> = {

    success: true,

    data: {
        id: 1,
        name: "John"
    }
};


// ============================================================
// 16. GENERIC REPOSITORY
// ============================================================

interface Repository<T> {

    findById(id: number): Promise<T | null>;

    findAll(): Promise<T[]>;

    create(data: T): Promise<T>;

    delete(id: number): Promise<void>;
}


// ============================================================
// 17. PROMISE / ASYNC
// ============================================================

async function getUser(
    id: number
): Promise<User | null> {

    // database/API call

    return {
        id,
        name: "John"
    };
}


async function example(): Promise<void> {

    const user =
        await getUser(1);

    if (!user) {
        return;
    }

    console.log(user.name);
}


// ============================================================
// 18. ERROR HANDLING
// ============================================================

try {

    throw new Error("Something failed");

} catch (error) {

    // catch variables are commonly `unknown`.

    if (error instanceof Error) {

        console.error(
            error.message
        );
    }
}


// ============================================================
// 19. UNKNOWN ERROR HANDLER
// ============================================================

function getErrorMessage(
    error: unknown
): string {

    if (error instanceof Error) {

        return error.message;
    }

    return String(error);
}


try {

    throw new Error("Database failed");

} catch (error) {

    console.error(
        getErrorMessage(error)
    );
}


// ============================================================
// 20. TYPE NARROWING
// ============================================================

function printValue(
    value: string | number
): void {

    if (typeof value === "string") {

        console.log(
            value.toUpperCase()
        );

    } else {

        console.log(
            value.toFixed(2)
        );
    }
}


// Common narrowing tools:
//
// typeof
// instanceof
// in
// equality checks
// custom type guards
//
// ============================================================


// ============================================================
// 21. TYPE GUARDS
// ============================================================

function isUser(
    value: unknown
): value is User {

    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        "name" in value
    );
}


const dataFromApi: unknown = {
    id: 1,
    name: "John"
};


if (isUser(dataFromApi)) {

    console.log(
        dataFromApi.name
    );
}


// ============================================================
// 22. DISCRIMINATED UNIONS
// ============================================================
//
// Very useful for API/service states.
//
// ============================================================

type Result<T> =
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        error: string;
    };


function getResult():
    Result<User> {

    return {
        success: true,
        data: {
            id: 1,
            name: "John"
        }
    };
}


const result2 =
    getResult();


if (result2.success) {

    console.log(
        result2.data
    );

} else {

    console.error(
        result2.error
    );
}


// ============================================================
// 23. OPTIONAL CHAINING / NULLISH
// ============================================================

type Profile = {
    user?: {
        address?: {
            city?: string;
        };
    };
};


const profile: Profile = {};

const city =
    profile.user?.address?.city;


// Nullish coalescing:

const displayCity =
    city ?? "Unknown";


// `??` only falls back for:
// null / undefined
//
// `||` also falls back for:
// "", 0, false, null, undefined


// ============================================================
// 24. KEYOF
// ============================================================

type UserKeys = keyof User;

// "id" | "name"


function getProperty<
    T,
    K extends keyof T
>(
    object: T,
    key: K
): T[K] {

    return object[key];
}


const userName =
    getProperty(
        {
            id: 1,
            name: "John"
        },
        "name"
    );


// ============================================================
// 25. UTILITY TYPES
// ============================================================
//
// These are extremely common in backend development.
//
// ============================================================

type UserWithoutId =
    Omit<User, "id">;


type UserPartial =
    Partial<User>;


type RequiredUser =
    Required<User>;


type ReadonlyUser =
    Readonly<User>;


type UserOnlyName =
    Pick<User, "name">;


// ============================================================
// 26. RECORD
// ============================================================

type RolePermissions =
    Record<
        UserRole,
        string[]
    >;


const permissions: RolePermissions = {

    admin: [
        "users.read",
        "users.write"
    ],

    user: [
        "users.read"
    ],

    moderator: [
        "users.read",
        "users.write"
    ]
};


// ============================================================
// 27. RETURN TYPE / PARAMETERS
// ============================================================

function createProduct(
    name: string,
    price: number
): Product {

    return {
        id: Date.now(),
        name,
        price
    };
}


type CreateProductParams =
    Parameters<typeof createProduct>;


type ProductReturn =
    ReturnType<typeof createProduct>;


// ============================================================
// 28. AS CONST
// ============================================================

const roles = [
    "admin",
    "user",
    "moderator"
] as const;


// typeof roles[number]
//
// → "admin" | "user" | "moderator"


type Role =
    typeof roles[number];


// ============================================================
// 29. TYPE ASSERTION
// ============================================================

const value: unknown =
    "hello";


const text =
    value as string;


// Use assertions only when you KNOW the runtime value.
//
// Bad:
//
// const user = data as User;
//
// if data came from an untrusted API, validate it first.
//
// ============================================================


// ============================================================
// 30. NON-NULL ASSERTION
// ============================================================

const element =
    document.getElementById("app")!;


// `!` tells TypeScript:
// "I know this isn't null."
//
// Avoid unnecessary use in backend code.
//
// ============================================================


// ============================================================
// 31. ABSTRACT CLASSES
// ============================================================

abstract class BaseRepository<T> {

    abstract findById(
        id: number
    ): Promise<T | null>;

    abstract create(
        data: T
    ): Promise<T>;
}


class UserRepository
    extends BaseRepository<User> {

    async findById(
        id: number
    ): Promise<User | null> {

        return null;
    }


    async create(
        data: User
    ): Promise<User> {

        return data;
    }
}


// ============================================================
// 32. DEPENDENCY INJECTION PATTERN
// ============================================================

interface UserRepositoryContract {

    findById(
        id: number
    ): Promise<User | null>;
}


class UserService2 {

    constructor(
        private repository:
            UserRepositoryContract
    ) { }


    async getUser(
        id: number
    ): Promise<User | null> {

        return this.repository.findById(id);
    }
}


// ============================================================
// 33. NODE.JS TYPES
// ============================================================
//
// Install:
//
// npm install -D @types/node
//
// Then:
//
// import fs from "node:fs/promises";
//
// TypeScript understands Node APIs.
//
// ============================================================

import process from "node:process";
import fs from "node:fs/promises";


async function readConfig(): Promise<string> {

    return fs.readFile(
        "./config.json",
        "utf8"
    );
}


console.log(
    process.env.NODE_ENV
);


// ============================================================
// 34. EXPRESS TYPE PATTERN
// ============================================================
//
// npm install express
// npm install -D @types/express
//
// Example:
//
// import express, {
//     Request,
//     Response,
//     NextFunction
// } from "express";
//
// const app = express();
//
// app.get(
//     "/users/:id",
//     (
//         req: Request,
//         res: Response
//     ) => {
//
//         const id = Number(
//             req.params.id
//         );
//
//         res.json({
//             id
//         });
//     }
// );
//
// ============================================================


// ============================================================
// 35. ENVIRONMENT VARIABLES
// ============================================================
//
// process.env values are:
//
// string | undefined
//
// Example:
//
// const port = Number(
//     process.env.PORT || 3000
// );
//
// Better:
//
// function requiredEnv(
//     name: string
// ): string {
//
//     const value = process.env[name];
//
//     if (!value) {
//
//         throw new Error(
//             `Missing ${name}`
//         );
//     }
//
//     return value;
// }
//
// const DATABASE_URL =
//     requiredEnv("DATABASE_URL");
//
// ============================================================


// ============================================================
// 36. MODULE IMPORTS
// ============================================================
//
// Common ESM:
//
// import express from "express";
//
// import {
//     readFile
// } from "node:fs/promises";
//
// import type {
//     Request,
//     Response
// } from "express";
//
// `import type` is removed during compilation.
//
// ============================================================


// ============================================================
// 37. TYPE-ONLY IMPORTS
// ============================================================

import type {
    User as ExternalUser
} from "./types.js";


// Keep runtime imports separate from type imports.
//
// import express from "express";
// import type { Request } from "express";
//
// ============================================================


// ============================================================
// 38. TS CONFIGURATION
// ============================================================
//
// Recommended backend baseline:
//
// tsconfig.json:
//
// {
//   "compilerOptions": {
//
//     "target": "ES2022",
//
//     "module": "NodeNext",
//
//     "moduleResolution": "NodeNext",
//
//     "rootDir": "./src",
//
//     "outDir": "./dist",
//
//     "strict": true,
//
//     "esModuleInterop": true,
//
//     "skipLibCheck": true,
//
//     "sourceMap": true
//   },
//
//   "include": [
//     "src/**/*.ts"
//   ]
// }
//
// ============================================================


// ============================================================
// 39. IMPORTANT TS CONFIG OPTIONS
// ============================================================
//
// target
//     JavaScript version generated.
//
// module
//     Module system.
//
// moduleResolution
//     How imports are resolved.
//
// rootDir
//     Source directory.
//
// outDir
//     Compiled JavaScript directory.
//
// strict
//     Enables strict type checking.
//
// esModuleInterop
//     Easier CommonJS/ESM interoperability.
//
// skipLibCheck
//     Skip checking declaration files.
//
// sourceMap
//     Better debugging of compiled TS.
//
// noEmit
//     Type-check without generating JS.
//
// ============================================================


// ============================================================
// 40. TS-NODE
// ============================================================
//
// Run:
//
// npx ts-node src/index.ts
//
// Pass Node options:
//
// npx ts-node --inspect src/index.ts
//
// Type-checking can be skipped:
//
// npx ts-node --transpile-only src/index.ts
//
// IMPORTANT:
//
// --transpile-only
//     Faster startup, less type checking.
//
// Useful for development, but don't treat it as a
// replacement for proper type checking.
//
// ============================================================


// ============================================================
// 41. TS-NODE WITH ENVIRONMENT
// ============================================================
//
// Example:
//
// NODE_ENV=development \
// npx ts-node src/index.ts
//
// Windows PowerShell:
//
// $env:NODE_ENV="development"
// npx ts-node src/index.ts
//
// ============================================================


// ============================================================
// 42. DEVELOPMENT vs PRODUCTION
// ============================================================
//
// DEVELOPMENT:
//
// .ts
//   ↓
// ts-node
//   ↓
// Node.js
//
//
// PRODUCTION:
//
// .ts
//   ↓
// tsc
//   ↓
// .js
//   ↓
// Node.js
//
// Commands:
//
// npm run build
// npm start
//
// ============================================================


// ============================================================
// 43. PACKAGE.JSON SCRIPT
// ============================================================
//
// {
//   "scripts": {
//
//     "dev":
//       "ts-node src/index.ts",
//
//     "typecheck":
//       "tsc --noEmit",
//
//     "build":
//       "tsc",
//
//     "start":
//       "node dist/index.js"
//   }
// }
//
// Recommended workflow:
//
// npm run dev
// npm run typecheck
// npm run build
//
// ============================================================


// ============================================================
// 44. TYPE CHECK WITHOUT BUILD
// ============================================================
//
// npx tsc --noEmit
//
// Useful in:
//
// CI
// pre-commit
// development
//
// ============================================================


// ============================================================
// 45. RUNTIME VALIDATION
// ============================================================
//
// TypeScript types disappear at runtime.
//
// This:
//
// type User = {
//     id: number;
// };
//
// does NOT validate:
//
// JSON
// HTTP requests
// database results
// environment variables
// external APIs
//
// For untrusted runtime data, use a validation library.
//
// Common choices:
//
// Zod
// Valibot
// Joi
//
// Pattern:
//
// unknown
//    ↓
// validate
//    ↓
// typed data
//
// ============================================================


// ============================================================
// 46. API REQUEST PATTERN
// ============================================================
//
// Example concept:
//
// async function createUser(
//     body: unknown
// ): Promise<User> {
//
//     // Validate body first.
//     const data = validateUser(body);
//
//     return userService.create(data);
// }
//
// Don't blindly:
//
// const data = req.body as CreateUser;
//
// ============================================================


// ============================================================
// 47. DATABASE RESULT PATTERN
// ============================================================
//
// Treat database/external data as runtime data.
//
// Example:
//
// const result: unknown =
//     await database.query(...);
//
// validate/transform result
// before trusting it as a domain type.
//
// ============================================================


// ============================================================
// 48. OPTIONAL RESULT
// ============================================================

async function findUser(
    id: number
): Promise<User | null> {

    if (id === 1) {

        return {
            id: 1,
            name: "John"
        };
    }

    return null;
}


async function example2() {

    const user =
        await findUser(100);

    if (!user) {

        console.log(
            "User not found"
        );

        return;
    }

    console.log(
        user.name
    );
}


// ============================================================
// 49. CUSTOM ERROR
// ============================================================

class NotFoundError
    extends Error {

    constructor(
        message: string
    ) {

        super(message);

        this.name =
            "NotFoundError";
    }
}


function getUserOrThrow(
    user: User | null
): User {

    if (!user) {

        throw new NotFoundError(
            "User not found"
        );
    }

    return user;
}


// ============================================================
// 50. TYPE ASSERTION FUNCTION
// ============================================================

function assertDefined<T>(
    value: T | null | undefined
): asserts value is T {

    if (
        value === null ||
        value === undefined
    ) {

        throw new Error(
            "Value is required"
        );
    }
}


const maybeUser:
    User | null = null;


// assertDefined(maybeUser);
//
// After successful assertion,
// TypeScript knows it is User.
//
// ============================================================


// ============================================================
// 51. FUNCTION OVERLOADS
// ============================================================
//
// Useful when one function supports multiple typed inputs.
//
// ============================================================

function getValue(
    id: number
): User | null;

function getValue(
    email: string
): User | null;

function getValue(
    value: number | string
): User | null {

    return null;
}


const userById =
    getValue(1);

const userByEmail =
    getValue("john@example.com");


// ============================================================
// 52. MAPPED TYPES
// ============================================================

type OptionalUser = {
    [K in keyof User]?: User[K];
};


// Equivalent idea to Partial<User>.
//
// Usually use built-in utility types when available.
//
// ============================================================


// ============================================================
// 53. COMMON BACKEND DTO PATTERN
// ============================================================

type CreateUserDto = {

    name: string;

    email: string;

    password: string;
};


type UpdateUserDto =
    Partial<CreateUserDto>;


// Entity:

type UserEntity = {

    id: number;

    name: string;

    email: string;

    passwordHash: string;

    createdAt: Date;

    updatedAt: Date;
};


// Keep DTOs and database entities separate when useful.
//
// ============================================================


// ============================================================
// 54. SERVICE / CONTROLLER PATTERN
// ============================================================

interface UserServiceContract {

    findById(
        id: number
    ): Promise<User | null>;

    create(
        data: CreateUserDto
    ): Promise<User>;
}


class UserController {

    constructor(
        private service:
            UserServiceContract
    ) { }


    async getById(
        id: number
    ): Promise<User> {

        const user =
            await this.service.findById(id);

        if (!user) {

            throw new NotFoundError(
                "User not found"
            );
        }

        return user;
    }
}


// ============================================================
// 55. COMMON TYPES TO MEMORIZE
// ============================================================
//
// string
// number
// boolean
// null
// undefined
// unknown
// any
// void
// never
// object
//
// string[]
// Array<T>
//
// T | null
// T | undefined
// T & U
//
// keyof T
// typeof value
// Partial<T>
// Required<T>
// Pick<T, K>
// Omit<T, K>
// Record<K, T>
// ReturnType<T>
// Parameters<T>
//
// Promise<T>
//
// ============================================================


// ============================================================
// 56. COMMON TS INTERVIEW CONCEPTS
// ============================================================
//
// TYPE INFERENCE
//     TypeScript automatically determines types.
//
// UNION
//     string | number
//
// INTERSECTION
//     User & Timestamps
//
// GENERIC
//     Repository<T>
//
// TYPE GUARD
//     value is User
//
// UNKNOWN
//     Safer alternative to any.
//
// ANY
//     Disables type checking.
//
// NEVER
//     Function cannot successfully return.
//
// OPTIONAL
//     property?: string
//
// READONLY
//     readonly id: number
//
// KEYOF
//     Union of object keys.
//
// TYPEOF
//     Get type from existing value.
//
// UTILITY TYPES
//     Partial, Pick, Omit, Record, etc.
//
// ============================================================


// ============================================================
// 57. COMMON MISTAKES
// ============================================================
//
// BAD:
//
// const user = data as User;
//
// // Claims data is User without validation.
//
//
//
// BAD:
//
// const value: any = req.body;
//
// // Removes most TypeScript protection.
//
//
//
// BAD:
//
// catch (error) {
//
//     error.message;
// }
//
// // error may be unknown.
//
//
//
// GOOD:
//
// catch (error) {
//
//     if (error instanceof Error) {
//
//         console.error(error.message);
//     }
// }
//
// ============================================================


// ============================================================
// 58. REAL-WORLD PROJECT STRUCTURE
// ============================================================
//
// src/
//
// ├── config/
// │   └── env.ts
// │
// ├── controllers/
// │   └── user.controller.ts
// │
// ├── services/
// │   └── user.service.ts
// │
// ├── repositories/
// │   └── user.repository.ts
// │
// ├── types/
// │   └── user.ts
// │
// ├── middleware/
// │   └── auth.ts
// │
// ├── routes/
// │   └── user.routes.ts
// │
// └── index.ts
//
// ============================================================


// ============================================================
// 59. TYPICAL STARTUP
// ============================================================

type AppConfig = {

    port: number;

    environment: string;
};


function loadConfig(): AppConfig {

    return {

        port:
            Number(
                process.env.PORT || 3000
            ),

        environment:
            process.env.NODE_ENV ||
            "development"
    };
}


async function bootstrap(): Promise<void> {

    const config =
        loadConfig();

    console.log(
        `Starting in ${config.environment}`
    );

    console.log(
        `Port: ${config.port}`
    );

    // Initialize:
    //
    // database
    // redis
    // express
    // routes
    // queues
    //
    // then start server
}


bootstrap().catch(
    (error: unknown) => {

        console.error(error);

        process.exitCode = 1;
    }
);


// ============================================================
// 60. TS-NODE QUICK COMMANDS
// ============================================================
//
// Install:
//
// npm install -D typescript ts-node @types/node
//
// Initialize:
//
// npx tsc --init
//
// Run:
//
// npx ts-node src/index.ts
//
// Fast transpile:
//
// npx ts-node --transpile-only src/index.ts
//
// Type-check:
//
// npx tsc --noEmit
//
// Build:
//
// npx tsc
//
// Run compiled code:
//
// node dist/index.js
//
// ============================================================


// ============================================================
// 61. QUICK REFERENCE — CORE TYPES
// ============================================================
//
// string
// number
// boolean
// unknown
// any
// null
// undefined
// void
// never
//
// T[]
// Array<T>
// Promise<T>
// T | U
// T & U
//
// ============================================================


// ============================================================
// 62. QUICK REFERENCE — OBJECT TYPES
// ============================================================
//
// type User = {
//
//     id: number;
//
//     name: string;
//
//     email?: string;
//
//     readonly createdAt: Date;
// };
//
// interface User {
//
//     id: number;
//
//     name: string;
// }
//
// ============================================================


// ============================================================
// 63. QUICK REFERENCE — GENERICS
// ============================================================
//
// function identity<T>(
//     value: T
// ): T;
//
// interface Repository<T> {
//
//     findById(
//         id: number
//     ): Promise<T | null>;
// }
//
// type Response<T> = {
//
//     data: T;
// };
//
// ============================================================


// ============================================================
// 64. QUICK REFERENCE — UTILITY TYPES
// ============================================================
//
// Partial<T>
// Required<T>
// Readonly<T>
// Pick<T, K>
// Omit<T, K>
// Record<K, T>
// ReturnType<T>
// Parameters<T>
//
// ============================================================


// ============================================================
// 65. QUICK REFERENCE — NARROWING
// ============================================================
//
// typeof
//
// if (typeof value === "string") {}
//
//
// instanceof
//
// if (error instanceof Error) {}
//
//
// in
//
// if ("id" in value) {}
//
//
// Custom:
//
// function isUser(
//     value: unknown
// ): value is User {}
//
// ============================================================


// ============================================================
// 66. QUICK REFERENCE — TS CONFIG
// ============================================================
//
// strict: true
// target: ES2022
// module: NodeNext
// moduleResolution: NodeNext
// rootDir: ./src
// outDir: ./dist
// esModuleInterop: true
// skipLibCheck: true
// sourceMap: true
//
// ============================================================


// ============================================================
// 67. QUICK REFERENCE — TS-NODE
// ============================================================
//
// ts-node
//     Execute TypeScript directly.
//
// ts-node --transpile-only
//     Faster execution without type checking.
//
// tsc
//     TypeScript compiler.
//
// tsc --noEmit
//     Type-check only.
//
// ============================================================


// ============================================================
// 68. QUICK REFERENCE — BACKEND PATTERNS
// ============================================================
//
// Request
//     ↓
// unknown
//     ↓
// validation
//     ↓
// DTO
//     ↓
// service
//     ↓
// repository
//     ↓
// entity
//
//
// External data
//     ↓
// unknown
//     ↓
// validate
//     ↓
// typed object
//
//
// Errors:
//
// try {
//     await operation();
// } catch (error) {
//
//     if (error instanceof Error) {
//         console.error(error.message);
//     }
// }
//
// ============================================================


// ============================================================
// 69. MOST IMPORTANT RULES
// ============================================================
//
// 1. Enable `strict: true`.
//
// 2. Prefer inference over unnecessary type annotations.
//
// 3. Avoid `any`.
//
// 4. Use `unknown` for untrusted data.
//
// 5. Validate runtime data; TypeScript does NOT validate it.
//
// 6. Use unions for fixed sets of values:
//
//    type Role = "admin" | "user";
//
// 7. Use generics for reusable type-safe code.
//
// 8. Use utility types instead of rewriting similar types.
//
// 9. Treat `as` assertions as an escape hatch.
//
// 10. Keep DTOs, entities, and domain types separate when
//     the application becomes complex.
//
// 11. TypeScript protects code at compile time;
//     it does not change JavaScript runtime behavior.
//
// 12. `ts-node` is mainly convenient for development.
//     Build with `tsc` for a conventional production setup.
//
// ============================================================
//
// CORE MENTAL MODEL
//
// TypeScript
//     │
//     ├── Types
//     │    ├── primitives
//     │    ├── objects
//     │    ├── unions
//     │    ├── intersections
//     │    └── generics
//     │
//     ├── Safety
//     │    ├── narrowing
//     │    ├── type guards
//     │    └── strict mode
//     │
//     ├── Reuse
//     │    ├── interfaces
//     │    ├── utility types
//     │    └── generics
//     │
//     └── Node.js
//          ├── @types/node
//          ├── tsconfig
//          └── runtime validation
//
//
// ts-node
//     │
//     └── .ts → execute directly during development
//
// tsc
//     │
//     └── .ts → .js for production
//
// ============================================================
