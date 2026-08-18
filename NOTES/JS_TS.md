https://javascript.info/
# 11 june 2026

## closures in js ts

A local variable is a "private" variable defined inside a function.
A global variable is a "public" variable defined outside a function.

Global variables live until the page is discarded, like when you navigate to another page or close the window.
Local variables have short lives. They are created when the function is invoked, and deleted when the function is finished.

A closure is a function that has access to the parent scope, after the parent function has closed.

Closures has historically been used to:

Create private variables
Preserve state between function calls
Simulate block-scoping before let and const existed
Implement certain design patterns like currying and memoization

modern js use class instead of closures


# 15 june 2026

## aync vs callback vs promises

- There are seven primitive data types in JavaScript (Number, BigInt, String, Boolean, Null, Undefined and Symbol) and then object
Seven of them are called “primitive”, because their values contain only a single thing

# 18 june 2026

Prototypes are the mechanism by which JavaScript objects inherit features from one another.
Every object in JavaScript has a built-in property, which is called its prototype. The prototype is itself an object, so the prototype will have its own prototype, making what's called a prototype chain. The chain ends when we reach a prototype that has null for its own prototype.
prototype is like class also

> type casting  : Number() -> Type(x) just like in php Type x or String x
> type Coercion is implicit(automatic) while type conversion is explicit(manual). both do same thing

# 24 june 2026

# 2 july 2026

# Install a package for production (dependencies)
npm install <package>

# Install all dependencies from package.json (production + dev)
npm install

# Install only production dependencies
npm install --omit=dev
# (older npm versions)
npm install --production

# Install a package as a development dependency (devDependencies)
npm install --save-dev <package>
# or
npm i -D <package>

# Install all dependencies including devDependencies
npm install


# 3 aug 2026
iife, closures

# 10 aug 2026
Code coverage:
1. Function coverage
2. Line coverage
3. Branch coverage
4. Statement coverage
https://web.dev/articles/ta-code-coverage

Testing:


# 18 aug 2026
**TypeScript is JavaScript’s runtime with a compile-time type checker**
Detecting errors in code without running it is referred to as static checking. Determining what’s an error and what’s not based on the kinds of values being operated on is known as static type checking.
TypeScript never changes the runtime behavior of JavaScript code. This means that if you move code from JavaScript to TypeScript, it is guaranteed to run the same way, even if TypeScript thinks that the code has type errors.
You should prefer interface. Use type when you need specific features.
