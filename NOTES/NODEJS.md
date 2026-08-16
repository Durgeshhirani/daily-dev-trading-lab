# 11 june 2026

event loop deep dive
┌───────────────────────────┐
   │           timers          │
   └─────────────┬─────────────┘
                 │
                 v
   ┌───────────────────────────┐
┌─>│     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │      close callbacks      │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤           timers          │
   └───────────────────────────┘


# 18 june 2026
nodejs is asynchronous event-driven JavaScript runtime
'node:http' is usedd for web server and express also use this

A Node.js app runs in a single process, without creating a new thread for every request. Node.js provides a set of asynchronous I/O primitives in its standard library that prevent JavaScript code from blocking. In addition, libraries in Node.js are generally written using non-blocking paradigms. Accordingly, blocking behavior is the exception rather than the norm in Node.js.


## errors
use async/await and try-catch statements, or .catch() errors in promises.
> Programmer errors are the errors caused by the programmer’s mistakes while writing a program
1. Array index out of bounds — trying to access the seventh element of the array when only six are available
2. Syntax errors — failing to close the curly braces while defining a JavaScript function
3. Reference errors — accessing a function or variables that are not defined
4. Deprecation errors and warnings — calling an asynchronous function without a callback
5. Type error — x object is not iterable
6. Failing to handle operational errors

> Operational errors are issues during runtime due to external factors that can interrupt the program’s normal flow
1. Unable to connect server/database
2. Request timeout
3. Invalid input from the user
4. Socket hang-up
5. 500 response from a server
6. File not found

> system errors usually occur when an application violates an operating system constraint. For example, a system error will occur if an application attempts to read a file that does not exist.
> User Specified Errors is created by extending the base Error object like custom errors for more verbosity
> assertion errors is build in module for testing errors


# 27 june 2026
module system in nodejs projects
with and without nestjs
- in nodejs we do it manually but in nestjs it is provided by default.
in module.js
module.exports = {
    prefix: '/users',
    router: require('./routes'),
};
in app.js
const users = require('./modules/users');
const auth = require('./modules/auth');

app.use(users.prefix, users.router);
app.use(auth.prefix, auth.router);

## Data structures in js

- everything is object except null and undefined.
- undefined indicates the absence of a value, while null indicates the absence of an object 
- js has almost all dsa in it https://github.com/trekhleb/javascript-algorithms
- Arrays, Maps, Sets, Json
> Maps are unique key objects, , Sets are unique value Arrays.

# JavaScript Data Structures Cheat Sheet

| Data Structure | Used For                            | Stores          | Ordered           | Iterable        | Key Characteristics                |
| -------------- | ----------------------------------- | --------------- | ----------------- | --------------- | ---------------------------------- |
| **Array**      | Lists, collections, queues, stacks  | Any values      | ✅ Yes             | ✅ Yes           | Indexed, dynamic size              |
| **Object**     | Configuration, JSON, records        | Key-value pairs | ❌ No              | ❌ No (directly) | Keys are strings/symbols           |
| **Map**        | Dictionaries, caches, lookup tables | Key-value pairs | ✅ Insertion order | ✅ Yes           | Keys can be any type               |
| **WeakMap**    | Private object metadata             | Object → Value  | ❌ No              | ❌ No            | Keys are weakly referenced objects |
| **Set**        | Unique values, removing duplicates  | Unique values   | ✅ Insertion order | ✅ Yes           | No duplicate values                |
| **WeakSet**    | Track object references             | Objects only    | ❌ No              | ❌ No            | Weakly referenced objects          |
| **Stack**      | Undo, browser history, recursion    | Any values      | LIFO              | Depends         | Last In First Out                  |

---

# 1. Array

### Used For

* Product lists
* User lists
* Orders
* Comments
* Queue
* Stack

---

## Methods

| Method            | What it does                | Example                      |
| ----------------- | --------------------------- | ---------------------------- |
| `push()`          | Add at end                  | `arr.push(5)`                |
| `pop()`           | Remove last                 | `arr.pop()`                  |
| `shift()`         | Remove first                | `arr.shift()`                |
| `unshift()`       | Add at beginning            | `arr.unshift(1)`             |
| `splice()`        | Insert/remove elements      | `arr.splice(2,1)`            |
| `slice()`         | Copy part of array          | `arr.slice(1,3)`             |
| `concat()`        | Merge arrays                | `arr.concat(arr2)`           |
| `join()`          | Convert to string           | `arr.join(",")`              |
| `includes()`      | Check value                 | `arr.includes(5)`            |
| `indexOf()`       | Find first index            | `arr.indexOf(5)`             |
| `lastIndexOf()`   | Find last index             | `arr.lastIndexOf(5)`         |
| `find()`          | Find first matching element | `arr.find(x=>x.id===1)`      |
| `findIndex()`     | Find index                  | `arr.findIndex(x=>x>10)`     |
| `findLast()`      | Find last matching element  | `arr.findLast(x=>x>10)`      |
| `findLastIndex()` | Find last index             | `arr.findLastIndex(x=>x>10)` |
| `map()`           | Transform items             | `arr.map(x=>x*2)`            |
| `filter()`        | Filter items                | `arr.filter(x=>x>10)`        |
| `reduce()`        | Reduce to one value         | `arr.reduce((a,b)=>a+b)`     |
| `reduceRight()`   | Reduce from right           | `arr.reduceRight(...)`       |
| `forEach()`       | Loop                        | `arr.forEach(console.log)`   |
| `some()`          | Any match?                  | `arr.some(x=>x>5)`           |
| `every()`         | All match?                  | `arr.every(x=>x>5)`          |
| `sort()`          | Sort array                  | `arr.sort()`                 |
| `reverse()`       | Reverse array               | `arr.reverse()`              |
| `flat()`          | Flatten array               | `arr.flat()`                 |
| `flatMap()`       | Map + flatten               | `arr.flatMap(...)`           |
| `fill()`          | Fill values                 | `arr.fill(0)`                |
| `copyWithin()`    | Copy inside array           | `arr.copyWithin(0,2)`        |
| `keys()`          | Iterator of indexes         | `arr.keys()`                 |
| `values()`        | Iterator of values          | `arr.values()`               |
| `entries()`       | Iterator of index/value     | `arr.entries()`              |
| `at()`            | Access by index             | `arr.at(-1)`                 |
| `toSorted()`      | Immutable sort              | `arr.toSorted()`             |
| `toReversed()`    | Immutable reverse           | `arr.toReversed()`           |
| `toSpliced()`     | Immutable splice            | `arr.toSpliced()`            |
| `with()`          | Replace element immutably   | `arr.with(2,100)`            |

---

# 2. Object

### Used For

* User profile
* API response
* Configuration
* JSON

```js
const user = {
    id: 1,
    name: "John"
}
```

---

## Methods

| Method                       | Purpose             | Example                         |
| ---------------------------- | ------------------- | ------------------------------- |
| `Object.keys()`              | Get keys            | `Object.keys(user)`             |
| `Object.values()`            | Get values          | `Object.values(user)`           |
| `Object.entries()`           | Get key/value pairs | `Object.entries(user)`          |
| `Object.fromEntries()`       | Reverse entries     | `Object.fromEntries(arr)`       |
| `Object.assign()`            | Merge objects       | `Object.assign({},a,b)`         |
| `Object.create()`            | Create object       | `Object.create(proto)`          |
| `Object.freeze()`            | Make immutable      | `Object.freeze(obj)`            |
| `Object.seal()`              | Prevent add/remove  | `Object.seal(obj)`              |
| `Object.hasOwn()`            | Check property      | `Object.hasOwn(obj,"name")`     |
| `Object.is()`                | Compare values      | `Object.is(a,b)`                |
| `Object.defineProperty()`    | Define property     | `Object.defineProperty(...)`    |
| `Object.getPrototypeOf()`    | Get prototype       | `Object.getPrototypeOf(obj)`    |
| `Object.setPrototypeOf()`    | Set prototype       | `Object.setPrototypeOf(obj,p)`  |
| `Object.preventExtensions()` | Stop adding props   | `Object.preventExtensions(obj)` |
| `delete`                     | Remove property     | `delete obj.age`                |

---

# 3. Map

### Used For

* Cache
* Database lookup
* Session store
* Fast lookup

```js
const map = new Map();
```

---

## Methods

| Method      | Purpose            | Example            |
| ----------- | ------------------ | ------------------ |
| `set()`     | Add/update         | `map.set("id",1)`  |
| `get()`     | Get value          | `map.get("id")`    |
| `has()`     | Exists?            | `map.has("id")`    |
| `delete()`  | Remove             | `map.delete("id")` |
| `clear()`   | Remove all         | `map.clear()`      |
| `keys()`    | Keys iterator      | `map.keys()`       |
| `values()`  | Values iterator    | `map.values()`     |
| `entries()` | Key/value iterator | `map.entries()`    |
| `forEach()` | Loop               | `map.forEach(...)` |
| `size`      | Number of entries  | `map.size`         |

---

# 4. WeakMap

### Used For

* Private class data
* DOM metadata
* Hidden object information

---

## Methods

| Method     | Purpose    | Example            |
| ---------- | ---------- | ------------------ |
| `set()`    | Add value  | `wm.set(obj,data)` |
| `get()`    | Read value | `wm.get(obj)`      |
| `has()`    | Exists?    | `wm.has(obj)`      |
| `delete()` | Remove     | `wm.delete(obj)`   |

No iteration.

---

# 5. Set

### Used For

* Remove duplicates
* Unique IDs
* Tags
* Permissions

```js
const set = new Set();
```

---

## Methods

| Method      | Purpose         | Example            |
| ----------- | --------------- | ------------------ |
| `add()`     | Add value       | `set.add(10)`      |
| `delete()`  | Remove          | `set.delete(10)`   |
| `has()`     | Exists?         | `set.has(10)`      |
| `clear()`   | Remove all      | `set.clear()`      |
| `keys()`    | Iterator        | `set.keys()`       |
| `values()`  | Iterator        | `set.values()`     |
| `entries()` | Iterator        | `set.entries()`    |
| `forEach()` | Loop            | `set.forEach(...)` |
| `size`      | Number of items | `set.size`         |

---

# 6. WeakSet

### Used For

* Store visited objects
* DOM tracking
* Circular reference detection

---

## Methods

| Method     | Purpose    | Example          |
| ---------- | ---------- | ---------------- |
| `add()`    | Add object | `ws.add(obj)`    |
| `delete()` | Remove     | `ws.delete(obj)` |
| `has()`    | Exists?    | `ws.has(obj)`    |

No iteration.

---

# 7. Stack (Custom)

### Used For

* Browser history
* Undo/Redo
* Function call stack
* Expression evaluation
* DFS (Depth-First Search)

Usually implemented with an `Array`.

```js
const stack = [];
```

---

## Methods

| Method      | Purpose             | Example                                     |
| ----------- | ------------------- | ------------------------------------------- |
| `push()`    | Push item           | `stack.push(10)`                            |
| `pop()`     | Remove top          | `stack.pop()`                               |
| `peek()`    | View top (custom)   | `stack.at(-1)` or `stack[stack.length - 1]` |
| `isEmpty()` | Empty? (custom)     | `stack.length===0`                          |
| `size()`    | Count (custom)      | `stack.length`                              |
| `clear()`   | Remove all (custom) | `stack.length = 0`                          |

---

# Which One Should You Use?

| Situation                    | Best Choice | Example                                                 |
| ---------------------------- | ----------- | ------------------------------------------------------- |
| List of products             | **Array**   | `[{id:1},{id:2}]`                                       |
| User profile                 | **Object**  | `{name:"John", age:25}`                                 |
| Fast lookup by any key type  | **Map**     | Cache by object or ID                                   |
| Private metadata for objects | **WeakMap** | Associate hidden data with DOM nodes or class instances |
| Remove duplicates            | **Set**     | `[1,2,2,3] → Set`                                       |
| Track processed objects      | **WeakSet** | Mark visited objects during traversal                   |
| Undo/Redo, browser history   | **Stack**   | Push actions, pop last action                           |

## Quick Decision Guide

| Need                                                          | Use       |
| ------------------------------------------------------------- | --------- |
| Ordered collection of items                                   | `Array`   |
| Structured record with named fields                           | `Object`  |
| Dictionary with keys of any type                              | `Map`     |
| Unique values                                                 | `Set`     |
| Hidden metadata tied to object lifetimes                      | `WeakMap` |
| Track object membership without preventing garbage collection | `WeakSet` |
| Last-in, first-out processing                                 | `Stack`   |

# 29 june 2026
# Async programming
Asynchronous code means that things can happen independently of the main program flow, async functions in JavaScript are processed in the background without blocking other requestsq

# 1 jul 2026
Asynchronous programming is a technique that enables your program to start a potentially long-running task and still be able to be responsive to other events while that task runs, rather than having to wait until that task has finished. 

async: 
1. promises
2. async/ await
3. callbacks
4. setTimeout
5. setInterval
6. setImmediate
7. process.nextTick

async means the function always returns a Promise and allows await to be used inside it. It does not mean the function runs in a separate process or thread.

await pauses the execution of that particular async function until the Promise settles, then continues with the result. It does not block the Node.js event loop or the entire application.


# 2 july 2026
## worker threads (multi threading)
- bullmq, Piscina are used instead of node:worker_threads
| Tool               | Analogy                        | Responsibility                                                                                |
| ------------------ | ------------------------------ | --------------------------------------------------------------------------------------------- |
| **BullMQ**         | Receptionist / Project Manager | Keeps a list of jobs, schedules them, retries failures, assigns work to workers.              |
| **BullMQ Worker**  | Employee                       | Takes one job from the queue and decides how to perform it.                                   |
| **worker_threads** | Specialist assistant           | Helps with one CPU-intensive task in parallel.                                                |
| **Piscina**        | Team manager                   | Maintains a pool of specialist assistants so you don't have to hire a new one for every task. |

API
  │
  ▼
BullMQ Queue
  │
  ▼
BullMQ Worker
  │
  ├── If job is I/O-bound (DB, email, HTTP)
  │      └── Execute directly
  │
  └── If job is CPU-bound
         └── Piscina
                │
                ▼
          worker_threads

### Worker threads:
- Worker is for creating new threads
- parentPort is for workers files to communicate back to main file where worker called
- workerData is for giving initial configuration while creating a worker 
- myWorker.postMessage("david") is for sending arguments or calling to initiate the function process
- myWorker.on("message", () => {}) message, error, exit, online
- isMainthread will be if it's in main thread or worker thread
- threadId will give id for particular worker
- MessageChannel , MessagePort

on main.js
let myWorker = new Worker("./download-worker.js", import.meta.url,
{
   type: "module",
   fileName: "data.csv",
   name: "david"
}
);
myWorker.postMessage("david");
 myWorker.on("message", () => {}) message, error, exit, online
and in worker.js
parentPort.on("message", async (data) => {});

### BullMQ


### Piscina

SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';




shivam kumar policy bazaar sector 44 gurgaon


https://tccms.trai.gov.in/Queries.aspx?cid=1



## events
import EventEmitter from "node:events";

const emitter = new EventEmitter();

emitter.on("start", () => {});
emitter.removeAllListeners("start",() => {});
emitter.emit("start", arguments);
emitter.eventNames();
emitter.once("start, () => {});

# 12 aug 2026
### Node modules:
1. node:http (imp)
2. node:fs (imp)
3. node:path (imp)
4. node:crypto (imp)
5. node:events (imp)
6. node:stream (imp)
7. node:buffer
8. node:url
9. node:os
10. node:child_process
11. node:worker_threads
12. node:process (imp)
13. node:util


### libraries:
1. express (imp)
2. fastify (imp)
3. typescript, -D ts-node (imp)
4. nestjs (imp)
| Package                    | Purpose                           |
| -------------------------- | --------------------------------- |
| `@nestjs/common`           | Controllers, decorators, services |
| `@nestjs/core`             | Nest application                  |
| `@nestjs/platform-express` | Express adapter                   |
| `@nestjs/platform-fastify` | Fastify adapter                   |
| `@nestjs/config`           | Environment configuration         |
| `@nestjs/jwt`              | JWT                               |
| `@nestjs/passport`         | Authentication                    |
| `@nestjs/swagger`          | OpenAPI/Swagger                   |
| `@nestjs/typeorm`          | TypeORM integration               |
| `@nestjs/schedule`         | Cron/scheduled jobs               |
| `@nestjs/bullmq`           | Queues                            |
| `@nestjs/throttler`        | Rate limiting                     |
5. pg (imp)
6. prisma @prisma/client (imp)
7. typeorm (imp)
9. jsonwebtoken (imp)
10. bcrypt/bcryptjs (imp)
11. helmet
12. cors (imp)
13. express-rate-limit (imp)
14. zod (imp)
15. pino/winston for logging (imp)
15. ioredis (imp)
16. bullmq (imp)
17. fetch/axios (imp)
18. dotenv
19. multer (imp)
20. stripe/razorpay (imp)
21. -D jest/supertest/vitest (imp)
22. -D playwright
23. socket.io (imp)
24. nodemailer 
25. date-fns/dayjs
26. crypto.randomUUID()
27. nodemon, tsx, ts-node, eslint, prettier, husky, lint-staged
28. oauth/keycloak
29. mongoose

