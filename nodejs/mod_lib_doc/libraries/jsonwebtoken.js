
// ============================================================
// JSONWEBTOKEN (JWT) CHEATSHEET
// Package: jsonwebtoken
// Docs: https://github.com/auth0/node-jsonwebtoken
// ============================================================

// Install:
// npm install jsonwebtoken
//
// TypeScript:
// npm install jsonwebtoken
// npm install -D @types/jsonwebtoken


// ============================================================
// 1. IMPORT
// ============================================================

import jwt from "jsonwebtoken";

// CommonJS:
// const jwt = require("jsonwebtoken");


// ============================================================
// 2. SECRET
// ============================================================

// Use a strong secret from environment variables in production.

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-secret";


// ============================================================
// 3. SIGN / CREATE TOKEN
// ============================================================

// jwt.sign(payload, secret, options)

const token = jwt.sign(
    {
        userId: 123,
        role: "user"
    },
    JWT_SECRET,
    {
        expiresIn: "15m"
    }
);

console.log("Token:", token);


// ============================================================
// 4. COMMON SIGN OPTIONS
// ============================================================

const tokenWithOptions = jwt.sign(
    {
        userId: 123
    },
    JWT_SECRET,
    {
        expiresIn: "15m",       // 15 minutes
        issuer: "my-api",       // Who issued the token
        audience: "my-client",  // Intended recipient
        subject: "123",         // Subject/user ID
        algorithm: "HS256"      // HMAC + SHA-256
    }
);


// ============================================================
// 5. EXPIRATION EXAMPLES
// ============================================================

// expiresIn accepts seconds or time strings.

jwt.sign({ userId: 123 }, JWT_SECRET, {
    expiresIn: 60             // 60 seconds
});

jwt.sign({ userId: 123 }, JWT_SECRET, {
    expiresIn: "15m"
});

jwt.sign({ userId: 123 }, JWT_SECRET, {
    expiresIn: "7d"
});


// ============================================================
// 6. VERIFY TOKEN
// ============================================================

// VERIFY = validate signature + expiration + options.
//
// Returns decoded payload if valid.
// Throws an error if invalid.

try {

    const payload = jwt.verify(
        token,
        JWT_SECRET
    );

    console.log("Valid token:", payload);

} catch (error) {

    console.log("Invalid token");

}


// ============================================================
// 7. VERIFY WITH OPTIONS
// ============================================================

try {

    const payload = jwt.verify(
        token,
        JWT_SECRET,
        {
            algorithms: ["HS256"],
            issuer: "my-api",
            audience: "my-client"
        }
    );

    console.log(payload);

} catch (error) {

    console.error(error);

}


// ============================================================
// 8. DECODE TOKEN
// ============================================================

// decode() DOES NOT verify the signature.
//
// Use it for inspection only.
// Never use decoded data for authentication/authorization.

const decoded = jwt.decode(token);

console.log(decoded);


// Decode complete token including header.

const complete = jwt.decode(token, {
    complete: true
});

console.log(complete);

/*
{
    header: {
        alg: "HS256",
        typ: "JWT"
    },
    payload: {
        userId: 123,
        role: "user",
        iat: ...
        exp: ...
    },
    signature: "..."
}
*/


// ============================================================
// 9. TOKEN STRUCTURE
// ============================================================
//
// JWT:
//
// HEADER.PAYLOAD.SIGNATURE
//
// Example:
//
// eyJhbGciOiJIUzI1NiJ9
// .
// eyJ1c2VySWQiOjEyM30
// .
// signature
//
// IMPORTANT:
// JWT payload is encoded, NOT encrypted.
// Do not put passwords, secrets, or sensitive data in it.
//
// ============================================================


// ============================================================
// 10. COMMON PAYLOAD
// ============================================================

const authToken = jwt.sign(
    {
        sub: "123",        // Standard subject claim
        role: "user",
        permissions: ["read"]
    },
    JWT_SECRET,
    {
        expiresIn: "15m",
        issuer: "my-api",
        audience: "my-client"
    }
);


// ============================================================
// 11. STANDARD JWT CLAIMS
// ============================================================
//
// iss  = issuer
// sub  = subject
// aud  = audience
// exp  = expiration time
// nbf  = not valid before
// iat  = issued at
// jti  = JWT ID
//
// jsonwebtoken automatically handles iat/exp when configured.
//
// ============================================================


// ============================================================
// 12. ACCESS TOKEN + REFRESH TOKEN
// ============================================================

// Short-lived access token.

const accessToken = jwt.sign(
    {
        sub: "123",
        role: "user"
    },
    JWT_SECRET,
    {
        expiresIn: "15m"
    }
);


// Long-lived refresh token.

const refreshToken = jwt.sign(
    {
        sub: "123",
        type: "refresh"
    },
    JWT_SECRET,
    {
        expiresIn: "7d"
    }
);


// ============================================================
// 13. AUTHORIZATION HEADER
// ============================================================
//
// Client normally sends:
//
// Authorization: Bearer <token>
//
// Extract the token:

function extractBearerToken(req) {

    const header = req.headers.authorization;

    if (!header) {
        return null;
    }

    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
        return null;
    }

    return token;
}


// ============================================================
// 14. EXPRESS AUTH MIDDLEWARE
// ============================================================

function authenticate(req, res, next) {

    const token = extractBearerToken(req);

    if (!token) {

        return res.status(401).json({
            message: "Authentication required"
        });
    }

    try {

        const payload = jwt.verify(
            token,
            JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        // Attach authenticated user to request.
        req.user = payload;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}


// Usage:
//
// app.get("/profile", authenticate, (req, res) => {
//     res.json({
//         user: req.user
//     });
// });


// ============================================================
// 15. AUTHENTICATION vs AUTHORIZATION
// ============================================================
//
// Authentication:
// "Who are you?"
//
// jwt.verify()
//      ↓
// req.user
//
// Authorization:
// "What are you allowed to do?"
//
// Example:

function requireAdmin(req, res, next) {

    if (req.user?.role !== "admin") {

        return res.status(403).json({
            message: "Forbidden"
        });
    }

    next();
}


// Usage:
//
// app.delete(
//     "/users/:id",
//     authenticate,
//     requireAdmin,
//     handler
// );


// ============================================================
// 16. COMMON VERIFY ERRORS
// ============================================================
//
// TokenExpiredError
// JsonWebTokenError
// NotBeforeError
//
// Handle separately when useful.

try {

    jwt.verify(token, JWT_SECRET);

} catch (error) {

    if (error instanceof jwt.TokenExpiredError) {

        console.log("Token expired");

    } else if (error instanceof jwt.JsonWebTokenError) {

        console.log("Invalid token");

    } else {

        console.log("JWT error");

    }
}


// ============================================================
// 17. TOKEN EXPIRATION
// ============================================================

try {

    jwt.verify(token, JWT_SECRET);

} catch (error) {

    if (error instanceof jwt.TokenExpiredError) {

        console.log("Access token expired");

    }
}


// ============================================================
// 18. ASYNC / CALLBACK API
// ============================================================
//
// jsonwebtoken supports callbacks for sign/verify.
//
// Useful when using asynchronous signing with some key
// configurations or integrating with callback-based code.
//
// Most normal HMAC usage can remain synchronous.

jwt.sign(
    { userId: 123 },
    JWT_SECRET,
    { expiresIn: "15m" },
    (error, token) => {

        if (error) {

            console.error(error);

            return;
        }

        console.log(token);
    }
);


jwt.verify(
    token,
    JWT_SECRET,
    (error, payload) => {

        if (error) {

            console.error(error);

            return;
        }

        console.log(payload);
    }
);


// ============================================================
// 19. ASYMMETRIC KEYS — RS256
// ============================================================
//
// HS256:
// Same secret signs + verifies.
//
// RS256:
// Private key signs.
// Public key verifies.
//
// Common when multiple services need to verify tokens.
//
// Example:
//
// const privateKey = fs.readFileSync("./private.pem");
// const publicKey = fs.readFileSync("./public.pem");
//
// const token = jwt.sign(
//     { sub: "123" },
//     privateKey,
//     {
//         algorithm: "RS256",
//         expiresIn: "15m"
//     }
// );
//
// const payload = jwt.verify(
//     token,
//     publicKey,
//     {
//         algorithms: ["RS256"]
//     }
// );


// ============================================================
// 20. ALGORITHM RESTRICTION
// ============================================================
//
// Explicitly restrict accepted algorithms when verifying.
//
// Good:

jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"]
});

//
// Avoid blindly accepting whatever algorithm the token declares.
//
// ============================================================


// ============================================================
// 21. JWT ID (jti)
// ============================================================
//
// Useful when implementing token tracking/revocation.

const tokenWithJti = jwt.sign(
    {
        sub: "123"
    },
    JWT_SECRET,
    {
        expiresIn: "15m",
        jwtid: "unique-token-id"
    }
);


// ============================================================
// 22. NOT BEFORE (nbf)
// ============================================================
//
// Token becomes valid only after a specified time.

const futureToken = jwt.sign(
    {
        sub: "123"
    },
    JWT_SECRET,
    {
        notBefore: "10s",
        expiresIn: "15m"
    }
);


// ============================================================
// 23. COMMON AUTH FLOW
// ============================================================
//
// LOGIN
//
// email/password
//      ↓
// verify password
//      ↓
// jwt.sign()
//      ↓
// access token
//
//
// REQUEST
//
// Authorization: Bearer <token>
//      ↓
// jwt.verify()
//      ↓
// req.user
//      ↓
// authorization check
//      ↓
// controller
//
//
// REFRESH
//
// refresh token
//      ↓
// verify
//      ↓
// issue new access token
//
// ============================================================


// ============================================================
// 24. SIMPLE LOGIN EXAMPLE
// ============================================================

function login(user) {

    // Password should already be verified
    // using bcrypt/argon2 before this point.

    return jwt.sign(
        {
            sub: String(user.id),
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: "15m",
            issuer: "my-api",
            audience: "my-client"
        }
    );
}


// ============================================================
// 25. SIMPLE PROTECTED REQUEST
// ============================================================

function verifyAccessToken(token) {

    return jwt.verify(
        token,
        JWT_SECRET,
        {
            algorithms: ["HS256"],
            issuer: "my-api",
            audience: "my-client"
        }
    );
}


// ============================================================
// 26. SECURITY RULES
// ============================================================
//
// 1. Never put passwords/secrets in JWT payload.
//
// 2. JWT payload is NOT encrypted.
//
// 3. Always verify before trusting payload.
//
// 4. Never use jwt.decode() for authentication.
//
// 5. Use a strong secret.
//
// 6. Store secrets in environment variables/secret manager.
//
// 7. Keep access tokens short-lived.
//
// 8. Restrict accepted algorithms.
//
// 9. Validate issuer/audience where appropriate.
//
// 10. Use HTTPS.
//
// 11. Prefer secure cookie configuration when using
//     cookie-based authentication.
//
// 12. Have a refresh-token/revocation strategy for
//     long-lived sessions.
//
// ============================================================


// ============================================================
// 27. COMMON OPTIONS QUICK REFERENCE
// ============================================================
//
// jwt.sign(payload, secret, options)
//
// expiresIn
// issuer
// audience
// subject
// algorithm
// notBefore
// jwtid
// header
//
// jwt.verify(token, secret, options)
//
// algorithms
// issuer
// audience
// subject
// maxAge
// clockTolerance
// clockTimestamp
//
// ============================================================


// ============================================================
// 28. MOST IMPORTANT API
// ============================================================
//
// jwt.sign()
//     Create/sign a JWT.
//
// jwt.verify()
//     Verify signature + validate claims.
//
// jwt.decode()
//     Decode without verification.
//
// jwt.TokenExpiredError
//     Token expired.
//
// jwt.JsonWebTokenError
//     Invalid JWT.
//
// jwt.NotBeforeError
//     Token used before valid time.
//
// ============================================================


// ============================================================
// 29. QUICK REFERENCE
// ============================================================
//
// CREATE
//
// jwt.sign(
//     payload,
//     secret,
//     { expiresIn: "15m" }
// );
//
//
// VERIFY
//
// jwt.verify(
//     token,
//     secret,
//     { algorithms: ["HS256"] }
// );
//
//
// DECODE
//
// jwt.decode(token);
//
//
// COMPLETE DECODE
//
// jwt.decode(token, {
//     complete: true
// });
//
//
// BEARER TOKEN
//
// Authorization: Bearer <token>
//
//
// ACCESS TOKEN
//
// expiresIn: "15m"
//
//
// REFRESH TOKEN
//
// expiresIn: "7d"
//
//
// COMMON CLAIMS
//
// sub
// iss
// aud
// exp
// iat
// nbf
// jti
//
//
// COMMON ALGORITHMS
//
// HS256 → shared secret
// RS256 → private/public key
//
// ============================================================
// CORE MENTAL MODEL
// ============================================================
//
// jwt.sign()
//      ↓
// HEADER + PAYLOAD + SIGNATURE
//      ↓
//       JWT
//
// JWT
//      ↓
// jwt.verify()
//      ↓
// Valid payload
//
// IMPORTANT:
//
// decode()  = read
// verify()  = trust
//
// Never confuse the two.
// ============================================================

