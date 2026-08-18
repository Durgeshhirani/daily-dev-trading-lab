// ============================================================
// PG (node-postgres) CHEATSHEET
// PostgreSQL client for Node.js
// ============================================================
//
// INSTALL
//
// npm install pg
//
// TypeScript:
//
// npm install pg
// npm install -D @types/pg
//
// Modern import:
//
// import { Pool, Client } from "pg";
//
// CommonJS:
//
// const { Pool, Client } = require("pg");
//
// Recommended for backend APIs:
// Use Pool for most applications.
//
// ============================================================


// ============================================================
// 1. IMPORT
// ============================================================

import { Pool, Client } from "pg";


// ============================================================
// 2. DATABASE CONFIGURATION
// ============================================================
//
// Environment variables:
//
// DATABASE_URL=postgresql://user:password@localhost:5432/mydb
//
// Or separate values:
//
// PGHOST=localhost
// PGPORT=5432
// PGDATABASE=mydb
// PGUSER=postgres
// PGPASSWORD=password
//
// Never hardcode production passwords.
//
// ============================================================


// ============================================================
// 3. CREATE A POOL
// ============================================================
//
// Pool is the normal choice for web servers.
//
// It maintains multiple reusable database connections.
//
// ============================================================

const pool = new Pool({

    host:
        process.env.PGHOST || "localhost",

    port:
        Number(process.env.PGPORT || 5432),

    database:
        process.env.PGDATABASE || "mydb",

    user:
        process.env.PGUSER || "postgres",

    password:
        process.env.PGPASSWORD || "password",

    max: 10,

    idleTimeoutMillis: 30_000,

    connectionTimeoutMillis: 5_000
});


// ============================================================
// 4. CONNECTION STRING
// ============================================================
//
// Common production configuration:
//
// const pool = new Pool({
//     connectionString:
//         process.env.DATABASE_URL
// });
//
// SSL is often required by cloud PostgreSQL:
//
// const pool = new Pool({
//     connectionString:
//         process.env.DATABASE_URL,
//
//     ssl: {
//         rejectUnauthorized: false
//     }
// });
//
// Prefer the SSL configuration recommended by your provider.
//
// ============================================================


// ============================================================
// 5. TEST CONNECTION
// ============================================================

async function testDatabase(): Promise<void> {

    try {

        const result =
            await pool.query(
                "SELECT NOW()"
            );

        console.log(
            result.rows[0]
        );

    } catch (error) {

        console.error(
            "Database connection failed:",
            error
        );
    }
}


// ============================================================
// 6. pool.query()
// ============================================================
//
// Most common API.
//
// query(
//     text,
//     values?
// )
//
// Returns:
//
// {
//     rows,
//     rowCount,
//     fields,
//     command,
//     ...
// }
//
// ============================================================

const result =
    await pool.query(
        "SELECT * FROM users"
    );

console.log(result.rows);


// ============================================================
// 7. PARAMETERIZED QUERIES
// ============================================================
//
// ALWAYS use parameters for user-controlled values.
//
// GOOD:

const userId = 10;

const result2 =
    await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [userId]
    );


// BAD:
//
// const result = await pool.query(
//     `SELECT * FROM users WHERE id = ${ userId } `
// );
//
// Risk:
// SQL injection.
//
// ============================================================


// ============================================================
// 8. MULTIPLE PARAMETERS
// ============================================================

const email =
    "john@example.com";

const role =
    "admin";


const result3 =
    await pool.query(
        `
SELECT *
    FROM users
        WHERE email = $1
          AND role = $2
    `,
        [
            email,
            role
        ]
    );


// ============================================================
// 9. SELECT
// ============================================================

const users =
    await pool.query(
        `
SELECT
id,
    name,
    email
        FROM users
        ORDER BY id DESC
    `
    );

console.log(users.rows);


// ============================================================
// 10. SELECT ONE
// ============================================================

async function findUser(
    id: number
) {

    const result =
        await pool.query(
            `
SELECT
id,
    name,
    email
            FROM users
            WHERE id = $1
            LIMIT 1
    `,
            [id]
        );

    return result.rows[0] ?? null;
}


// ============================================================
// 11. INSERT
// ============================================================
//
// RETURNING is extremely useful.
//
// ============================================================

const inserted =
    await pool.query(
        `
        INSERT INTO users(
        name,
        email
    )
VALUES($1, $2)
RETURNING *
    `,
        [
            "John",
            "john@example.com"
        ]
    );

console.log(
    inserted.rows[0]
);


// ============================================================
// 12. UPDATE
// ============================================================

const updated =
    await pool.query(
        `
        UPDATE users
SET
name = $1,
    email = $2,
    updated_at = NOW()
        WHERE id = $3
RETURNING *
    `,
        [
            "John Updated",
            "john@example.com",
            10
        ]
    );

console.log(
    updated.rows[0] ?? null
);


// ============================================================
// 13. DELETE
// ============================================================

const deleted =
    await pool.query(
        `
        DELETE FROM users
        WHERE id = $1
RETURNING *
    `,
        [10]
    );

console.log(
    deleted.rows[0] ?? null
);


// ============================================================
// 14. rowCount
// ============================================================
//
// Useful for UPDATE / DELETE.
//
// ============================================================

const result4 =
    await pool.query(
        `
        DELETE FROM users
        WHERE id = $1
    `,
        [10]
    );

if (result4.rowCount === 0) {

    console.log(
        "User not found"
    );
}


// ============================================================
// 15. COMMAND
// ============================================================

const result5 =
    await pool.query(
        `
        UPDATE users
        SET name = $1
        WHERE id = $2
    `,
        ["John", 10]
    );

console.log(
    result5.command
);

// UPDATE


// ============================================================
// 16. POOL CLIENT
// ============================================================
//
// Use pool.connect() when you need:
//
// - transactions
// - multiple queries on the same connection
// - session-specific operations
//
// ============================================================

const client =
    await pool.connect();

try {

    const result =
        await client.query(
            "SELECT NOW()"
        );

    console.log(
        result.rows[0]
    );

} finally {

    client.release();
}


// IMPORTANT:
//
// pool.connect()
//     ↓
// client
//     ↓
// client.query()
//     ↓
// client.release()
//
// Always release the client.
//
// ============================================================


// ============================================================
// 17. TRANSACTION
// ============================================================
//
// Basic transaction:
//
// BEGIN
// queries...
// COMMIT
//
// On failure:
//
// ROLLBACK
//
// ============================================================

async function transferMoney(
    fromId: number,
    toId: number,
    amount: number
): Promise<void> {

    const client =
        await pool.connect();

    try {

        await client.query(
            "BEGIN"
        );


        await client.query(
            `
            UPDATE accounts
            SET balance = balance - $1
            WHERE id = $2
    `,
            [
                amount,
                fromId
            ]
        );


        await client.query(
            `
            UPDATE accounts
            SET balance = balance + $1
            WHERE id = $2
    `,
            [
                amount,
                toId
            ]
        );


        await client.query(
            "COMMIT"
        );

    } catch (error) {

        await client.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        client.release();
    }
}


// ============================================================
// 18. TRANSACTION RULE
// ============================================================
//
// IMPORTANT:
//
// Do NOT do:
//
// await pool.query("BEGIN");
// await pool.query(...);
// await pool.query(...);
//
// Transactions must use the SAME client.
//
// Correct:
//
// const client = await pool.connect();
//
// await client.query("BEGIN");
// await client.query(...);
// await client.query(...);
// await client.query("COMMIT");
//
// ============================================================


// ============================================================
// 19. TRANSACTION WITH VALIDATION
// ============================================================

async function createOrder(
    userId: number,
    productId: number,
    quantity: number
) {

    const client =
        await pool.connect();

    try {

        await client.query(
            "BEGIN"
        );


        const product =
            await client.query(
                `
                SELECT id, price
                FROM products
                WHERE id = $1
                FOR UPDATE
    `,
                [productId]
            );


        if (product.rowCount === 0) {

            throw new Error(
                "Product not found"
            );
        }


        const order =
            await client.query(
                `
                INSERT INTO orders(
        user_id,
        product_id,
        quantity
    )
VALUES($1, $2, $3)
RETURNING *
    `,
                [
                    userId,
                    productId,
                    quantity
                ]
            );


        await client.query(
            "COMMIT"
        );


        return order.rows[0];

    } catch (error) {

        await client.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        client.release();
    }
}


// ============================================================
// 20. CLIENT CLASS
// ============================================================
//
// Client creates a single PostgreSQL connection.
//
// Useful for:
//
// - scripts
// - migrations
// - one-off jobs
// - special connection handling
//
// For normal web APIs, prefer Pool.
//
// ============================================================

const client = new Client({

    connectionString:
        process.env.DATABASE_URL
});


// Connect:
//
// await client.connect();
//
// Query:
//
// await client.query(
//     "SELECT NOW()"
// );
//
// Disconnect:
//
// await client.end();
//
// ============================================================


// ============================================================
// 21. CLIENT LIFECYCLE
// ============================================================

async function runClientExample() {

    const client =
        new Client({
            connectionString:
                process.env.DATABASE_URL
        });

    try {

        await client.connect();

        const result =
            await client.query(
                "SELECT NOW()"
            );

        console.log(
            result.rows[0]
        );

    } finally {

        await client.end();
    }
}


// ============================================================
// 22. POOL LIFECYCLE
// ============================================================
//
// Graceful shutdown:
//
// await pool.end();
//
// Example:
//
// process.on(
//     "SIGTERM",
//     async () => {
//
//         await pool.end();
//
//         process.exit(0);
//     }
// );
//
// ============================================================


// ============================================================
// 23. ERROR HANDLING
// ============================================================

try {

    await pool.query(
        "SELECT * FROM users"
    );

} catch (error) {

    console.error(
        "Database error:",
        error
    );

    throw error;
}


// ============================================================
// 24. POSTGRES ERROR PROPERTIES
// ============================================================
//
// pg database errors commonly contain:
//
// error.code
// error.message
// error.detail
// error.constraint
// error.table
// error.column
//
// Example:
//
// try {
//
//     await pool.query(...);
//
// } catch (error: any) {
//
//     if (error.code === "23505") {
//
//         console.log(
//             "Unique constraint violation"
//         );
//     }
//
//     throw error;
// }
//
// Better TypeScript:
//
// catch (error: unknown) {
//
//     if (
//         error &&
//         typeof error === "object" &&
//         "code" in error
//     ) {
//
//         console.log(error.code);
//     }
// }
//
// ============================================================


// ============================================================
// 25. COMMON POSTGRES ERROR CODES
// ============================================================
//
// 23505
//     unique_violation
//
// 23503
//     foreign_key_violation
//
// 23502
//     not_null_violation
//
// 23514
//     check_violation
//
// 22P02
//     invalid_text_representation
//
// 40001
//     serialization_failure
//
// 40P01
//     deadlock_detected
//
// ============================================================


// ============================================================
// 26. INSERT + CONFLICT
// ============================================================
//
// PostgreSQL UPSERT.
//
// ============================================================

const upsert =
    await pool.query(
        `
        INSERT INTO users(
        email,
        name
    )
VALUES($1, $2)
        ON CONFLICT(email)
        DO UPDATE SET
name = EXCLUDED.name
RETURNING *
    `,
        [
            "john@example.com",
            "John"
        ]
    );


// ============================================================
// 27. PAGINATION
// ============================================================

const page = 2;
const limit = 20;
const offset = (
    page - 1
) * limit;


const paginated =
    await pool.query(
        `
SELECT *
    FROM users
        ORDER BY id DESC
        LIMIT $1
        OFFSET $2
    `,
        [
            limit,
            offset
        ]
    );


// For very large datasets, consider keyset/cursor pagination
// instead of large OFFSET values.
//
// ============================================================


// ============================================================
// 28. COUNT
// ============================================================

const countResult =
    await pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM users
    `
    );

const count =
    countResult.rows[0].count;


// ============================================================
// 29. JOIN
// ============================================================

const orders =
    await pool.query(
        `
SELECT
o.id,
    o.total,
    u.id AS user_id,
        u.name AS user_name
        FROM orders o
        JOIN users u
            ON u.id = o.user_id
        WHERE u.id = $1
    `,
        [10]
    );


// ============================================================
// 30. ARRAY PARAMETERS
// ============================================================
//
// pg can pass JavaScript arrays to PostgreSQL.
//
// ============================================================

const ids = [
    1,
    2,
    3
];


const usersByIds =
    await pool.query(
        `
SELECT *
    FROM users
        WHERE id = ANY($1:: int[])
    `,
        [ids]
    );


// ============================================================
// 31. JSON / JSONB
// ============================================================

const metadata = {
    theme: "dark",
    notifications: true
};


await pool.query(
    `
    INSERT INTO users(
        name,
        metadata
    )
VALUES($1, $2)
    `,
    [
        "John",
        metadata
    ]
);


// pg serializes JavaScript objects for JSON/JSONB columns.


// ============================================================
// 32. DATE / TIMESTAMP
// ============================================================

const result6 =
    await pool.query(
        `
SELECT
id,
    created_at
        FROM users
        WHERE created_at >= $1
    `,
        [
            new Date()
        ]
    );


// ============================================================
// 33. NULL VALUES
// ============================================================

await pool.query(
    `
    INSERT INTO users(
        name,
        phone
    )
VALUES($1, $2)
    `,
    [
        "John",
        null
    ]
);


// Use IS NULL in SQL:
//
// WHERE phone IS NULL
//
// NOT:
//
// WHERE phone = NULL
//
// ============================================================


// ============================================================
// 34. DYNAMIC VALUES
// ============================================================
//
// Values can be parameterized:
//
// WHERE id = $1
//
// SQL identifiers cannot normally be parameterized:
//
// ORDER BY $1
//
// For dynamic column/table names, whitelist allowed values.
//
// ============================================================

const allowedSortColumns = {

    name: "name",

    createdAt: "created_at",

    id: "id"
} as const;


type SortColumn =
    keyof typeof allowedSortColumns;


function getSortColumn(
    column: SortColumn
): string {

    return allowedSortColumns[column];
}


const sort =
    getSortColumn("createdAt");


await pool.query(
    `
SELECT *
    FROM users
    ORDER BY ${sort} DESC
    `
);


// IMPORTANT:
// Only interpolate values from a trusted whitelist.
//
// ============================================================


// ============================================================
// 35. QUERY RESULT
// ============================================================
//
// const result = await pool.query(...);
//
// result.rows
//     Returned records.
//
// result.rowCount
//     Number of affected/returned rows.
//
// result.command
//     SELECT / INSERT / UPDATE / DELETE.
//
// result.fields
//     Column metadata.
//
// ============================================================


// ============================================================
// 36. QUERY CONFIG OBJECT
// ============================================================
//
// Useful when query becomes more explicit.
//
// ============================================================

const result7 =
    await pool.query({

        text: `
SELECT *
    FROM users
            WHERE id = $1
    `,

        values: [10]
    });


// Equivalent:
//
// await pool.query(
//     "SELECT * FROM users WHERE id = $1",
//     [10]
// );
//
// ============================================================


// ============================================================
// 37. NAMED QUERY
// ============================================================
//
// Useful for repeated queries.
//
// ============================================================

const namedResult =
    await pool.query({

        name: "find-user-by-id",

        text: `
SELECT *
    FROM users
            WHERE id = $1
    `,

        values: [10]
    });


// pg can use PostgreSQL prepared statements for named queries.
//
// Don't add names randomly to every query; use when beneficial.
//
// ============================================================


// ============================================================
// 38. POOL EVENTS
// ============================================================
//
// Useful for monitoring/debugging.
//
// ============================================================

pool.on(
    "error",
    (error) => {

        console.error(
            "Unexpected idle client error:",
            error
        );
    }
);


// Common pool events:
//
// connect
// acquire
// remove
// error
//
// ============================================================


// ============================================================
// 39. POOL CONFIGURATION
// ============================================================
//
// const pool = new Pool({
//
//     connectionString,
//
//     max: 10,
//
//     min: 0,
//
//     idleTimeoutMillis: 30000,
//
//     connectionTimeoutMillis: 5000
// });
//
// Important:
//
// max
//     Maximum connections in pool.
//
// min
//     Minimum connections kept around.
//
// idleTimeoutMillis
//     Close idle connections after this time.
//
// connectionTimeoutMillis
//     Fail connection attempt after this time.
//
// ============================================================


// ============================================================
// 40. POOL SIZE
// ============================================================
//
// Don't blindly set:
//
// max: 100
//
// Total DB connections matter:
//
// application instances
// × pool max
// = possible DB connections
//
// Example:
//
// 5 API instances
// × 10 pool connections
// = up to 50 DB connections
//
// Check PostgreSQL max_connections and leave room for:
//
// - admin
// - migrations
// - background jobs
// - monitoring
//
// ============================================================


// ============================================================
// 41. SIMPLE REPOSITORY
// ============================================================

type User = {

    id: number;

    name: string;

    email: string;
};


class UserRepository {

    async findById(
        id: number
    ): Promise<User | null> {

        const result =
            await pool.query<User>(
                `
SELECT
id,
    name,
    email
                FROM users
                WHERE id = $1
    `,
                [id]
            );

        return result.rows[0] ?? null;
    }


    async findAll(): Promise<User[]> {

        const result =
            await pool.query<User>(
                `
SELECT
id,
    name,
    email
                FROM users
                ORDER BY id DESC
    `
            );

        return result.rows;
    }


    async create(
        name: string,
        email: string
    ): Promise<User> {

        const result =
            await pool.query<User>(
                `
                INSERT INTO users(
        name,
        email
    )
VALUES($1, $2)
RETURNING
id,
    name,
    email
        `,
                [
                    name,
                    email
                ]
            );

        return result.rows[0];
    }


    async update(
        id: number,
        name: string
    ): Promise<User | null> {

        const result =
            await pool.query<User>(
                `
                UPDATE users
SET
name = $1,
    updated_at = NOW()
                WHERE id = $2
RETURNING
id,
    name,
    email
        `,
                [
                    name,
                    id
                ]
            );

        return result.rows[0] ?? null;
    }


    async delete(
        id: number
    ): Promise<boolean> {

        const result =
            await pool.query(
                `
                DELETE FROM users
                WHERE id = $1
    `,
                [id]
            );

        return (
            result.rowCount ?? 0
        ) > 0;
    }
}


// ============================================================
// 42. TYPESCRIPT GENERIC QUERY
// ============================================================
//
// pool.query<User>()
//
// This tells TypeScript what each row looks like.
//
// It does NOT validate database data at runtime.
//
// ============================================================

const typedResult =
    await pool.query<User>(
        "SELECT id, name, email FROM users"
    );


const typedUser =
    typedResult.rows[0];


// typedUser.id
// typedUser.name
// typedUser.email


// ============================================================
// 43. TRANSACTION HELPER
// ============================================================
//
// Useful to avoid repeating BEGIN/COMMIT/ROLLBACK.
//
// ============================================================

async function withTransaction<T>(
    callback: (
        client: import("pg").PoolClient
    ) => Promise<T>
): Promise<T> {

    const client =
        await pool.connect();

    try {

        await client.query(
            "BEGIN"
        );

        const result =
            await callback(client);

        await client.query(
            "COMMIT"
        );

        return result;

    } catch (error) {

        await client.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        client.release();
    }
}


// Usage:

const transactionResult =
    await withTransaction(
        async (client) => {

            const user =
                await client.query(
                    `
                    INSERT INTO users(
        name,
        email
    )
VALUES($1, $2)
RETURNING *
    `,
                    [
                        "John",
                        "john@example.com"
                    ]
                );

            return user.rows[0];
        }
    );


// ============================================================
// 44. FOR UPDATE
// ============================================================
//
// Locks selected rows until transaction ends.
//
// Common for:
//
// - money transfers
// - inventory
// - counters
// - preventing concurrent modifications
//
// Example:
//
// SELECT *
// FROM products
// WHERE id = $1
// FOR UPDATE;
//
// Must be used inside a transaction.
//
// ============================================================


// ============================================================
// 45. DEADLOCK / SERIALIZATION RETRIES
// ============================================================
//
// Production systems may encounter:
//
// 40001 → serialization_failure
// 40P01 → deadlock_detected
//
// Retry logic can be appropriate for these specific errors.
//
// Don't blindly retry every database error.
//
// ============================================================


// ============================================================
// 46. CONNECTION HEALTH CHECK
// ============================================================

async function healthCheck(): Promise<boolean> {

    try {

        await pool.query(
            "SELECT 1"
        );

        return true;

    } catch {

        return false;
    }
}


// ============================================================
// 47. GRACEFUL SHUTDOWN
// ============================================================

async function shutdown(
    signal: string
): Promise<void> {

    console.log(
        `${signal}: shutting down`
    );

    await pool.end();

    process.exit(0);
}


process.on(
    "SIGINT",
    () => shutdown("SIGINT")
);

process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
);


// ============================================================
// 48. DATABASE TIMEOUTS
// ============================================================
//
// Pool connection timeout:
//
// connectionTimeoutMillis
//
// PostgreSQL query timeout can also be configured at the
// PostgreSQL level or per session/query.
//
// Example:
//
// await pool.query(
//     `
//     SET statement_timeout = 5000
//     `
// );
//
// Be careful with session-level settings when using pools.
//
// ============================================================


// ============================================================
// 49. SQL SECURITY
// ============================================================
//
// ALWAYS parameterize:
//
// WHERE id = $1
//
// NEVER:
//
// WHERE id = ${id}
//
//
//
// Parameterize:
//
// INSERT values
// UPDATE values
// WHERE values
// search strings
// dates
// numbers
//
//
//
// For dynamic identifiers:
//
// table names
// column names
// ORDER BY
//
// use a strict whitelist.
//
// ============================================================


// ============================================================
// 50. PASSWORDS / SECRETS
// ============================================================
//
// Never:
//
// const pool = new Pool({
//     password: "myProductionPassword"
// });
//
// Prefer:
//
// process.env.DATABASE_URL
//
// and a secret manager in production.
//
// Never commit:
//
// .env
// database passwords
// private certificates
//
// ============================================================


// ============================================================
// 51. SQL QUERY STYLE
// ============================================================
//
// Prefer explicit columns:
//
// SELECT
//     id,
//     name,
//     email
// FROM users
//
// instead of:
//
// SELECT *
// FROM users
//
// especially in production application code.
//
// Benefits:
//
// - predictable result shape
// - less data
// - easier TypeScript types
// - safer schema changes
//
// ============================================================


// ============================================================
// 52. PAGINATION + COUNT
// ============================================================

async function listUsers(
    page: number,
    limit: number
) {

    const offset =
        (page - 1) * limit;

    const result =
        await pool.query<User>(
            `
            SELECT
                id,
                name,
                email
            FROM users
            ORDER BY id DESC
            LIMIT $1
            OFFSET $2
            `,
            [
                limit,
                offset
            ]
        );

    return {
        data: result.rows,
        page,
        limit
    };
}


// ============================================================
// 53. BATCH INSERT
// ============================================================
//
// Avoid generating SQL with untrusted values.
//
// For a small number of rows:
//
// INSERT INTO users (name, email)
// VALUES
//     ($1, $2),
//     ($3, $4),
//     ($5, $6);
//
// For very large imports, PostgreSQL COPY is usually more
// appropriate.
//
// ============================================================


// ============================================================
// 54. COMMON pg ARCHITECTURE
// ============================================================
//
// Express / NestJS
//        │
//        ▼
// Controller
//        │
//        ▼
// Service
//        │
//        ▼
// Repository
//        │
//        ▼
// pg Pool
//        │
//        ▼
// PostgreSQL
//
// One shared Pool is normally created for the application.
//
// Don't create a new Pool per request.
//
// ============================================================


// ============================================================
// 55. COMMON MISTAKES
// ============================================================
//
// BAD:
//
// app.get("/users", async () => {
//
//     const pool = new Pool(...);
//
// });
//
// Creates pools repeatedly.
//
//
//
// GOOD:
//
// const pool = new Pool(...);
//
// // Reuse it everywhere.
//
//
//
// BAD:
//
// const client = await pool.connect();
//
// await client.query(...);
//
// // forgot release()
//
//
//
// GOOD:
//
// try {
//
//     await client.query(...);
//
// } finally {
//
//     client.release();
// }
//
//
//
// BAD:
//
// await pool.query("BEGIN");
//
// await pool.query(...);
//
//
//
// GOOD:
//
// const client = await pool.connect();
//
// await client.query("BEGIN");
// await client.query(...);
// await client.query("COMMIT");
//
// ============================================================


// ============================================================
// 56. IMPORTANT CLASSES
// ============================================================
//
// Pool
//     Connection pool.
//
// Client
//     Single PostgreSQL connection.
//
// PoolClient
//     Client obtained from pool.connect().
//
// QueryResult<T>
//     Result returned by query.
//
// QueryConfig
//     { text, values, name, ... }
//
// ============================================================


// ============================================================
// 57. IMPORTANT POOL METHODS
// ============================================================
//
// pool.query()
//     Execute query.
//
// pool.connect()
//     Acquire client.
//
// pool.end()
//     Shut down pool.
//
// ============================================================


// ============================================================
// 58. IMPORTANT CLIENT METHODS
// ============================================================
//
// client.connect()
//     Connect.
//
// client.query()
//     Execute query.
//
// client.release()
//     Return pooled client.
//
// client.end()
//     Close standalone Client.
//
// ============================================================


// ============================================================
// 59. IMPORTANT RESULT PROPERTIES
// ============================================================
//
// result.rows
//     Array of returned records.
//
// result.rowCount
//     Number of affected/returned rows.
//
// result.command
//     SQL command.
//
// result.fields
//     Column metadata.
//
// ============================================================


// ============================================================
// 60. IMPORTANT POOL OPTIONS
// ============================================================
//
// connectionString
//
// host
//
// port
//
// database
//
// user
//
// password
//
// max
//     Maximum pool connections.
//
// min
//     Minimum pool connections.
//
// idleTimeoutMillis
//
// connectionTimeoutMillis
//
// ssl
//
// ============================================================


// ============================================================
// 61. IMPORTANT QUERY PATTERNS
// ============================================================
//
// SELECT:
//
// const result = await pool.query(
//     "SELECT * FROM users WHERE id = $1",
//     [id]
// );
//
//
// INSERT:
//
// const result = await pool.query(
//     `
//     INSERT INTO users (name)
//     VALUES ($1)
//     RETURNING *
//     `,
//     [name]
// );
//
//
// UPDATE:
//
// const result = await pool.query(
//     `
//     UPDATE users
//     SET name = $1
//     WHERE id = $2
//     RETURNING *
//     `,
//     [name, id]
// );
//
//
// DELETE:
//
// const result = await pool.query(
//     `
//     DELETE FROM users
//     WHERE id = $1
//     `,
//     [id]
// );
//
// ============================================================


// ============================================================
// 62. TRANSACTION QUICK REFERENCE
// ============================================================
//
// const client = await pool.connect();
//
// try {
//
//     await client.query("BEGIN");
//
//     await client.query(...);
//     await client.query(...);
//
//     await client.query("COMMIT");
//
// } catch (error) {
//
//     await client.query("ROLLBACK");
//
//     throw error;
//
// } finally {
//
//     client.release();
// }
//
// ============================================================


// ============================================================
// 63. SQL INJECTION QUICK REFERENCE
// ============================================================
//
// NEVER:
//
// `SELECT * FROM users WHERE id = ${id}`
//
//
//
// ALWAYS:
//
// `SELECT * FROM users WHERE id = $1`
//
// [id]
//
//
// Dynamic identifiers:
//
// whitelist → interpolate trusted identifier
//
// ============================================================


// ============================================================
// 64. PERFORMANCE QUICK REFERENCE
// ============================================================
//
// Use Pool.
//
// Reuse one application-wide pool.
//
// Don't create Pool per request.
//
// Use parameterized queries.
//
// Select only required columns.
//
// Add proper PostgreSQL indexes.
//
// Use EXPLAIN ANALYZE for slow queries.
//
// Keep transactions short.
//
// Don't hold a connection while doing unrelated work.
//
// Tune pool size based on:
//
// application instances
// × pool max
// ≤ PostgreSQL connection capacity
//
// ============================================================


// ============================================================
// 65. PRODUCTION MENTAL MODEL
// ============================================================
//
// Application
//      │
//      ▼
//     Pool
//      │
//      ├── Client 1
//      ├── Client 2
//      ├── Client 3
//      └── ...
//           │
//           ▼
//       PostgreSQL
//
// Normal query:
//
// pool.query()
//
// Transaction:
//
// pool.connect()
//      ↓
// client.query("BEGIN")
//      ↓
// multiple client.query()
//      ↓
// COMMIT / ROLLBACK
//      ↓
// client.release()
//
// ============================================================


// ============================================================
// 66. MOST IMPORTANT RULES
// ============================================================
//
// 1. Use Pool for normal backend applications.
//
// 2. Create one shared Pool, not one per request.
//
// 3. Parameterize values with $1, $2, etc.
//
// 4. Never concatenate untrusted input into SQL.
//
// 5. Transactions must use the same client.
//
// 6. Always release a client in finally.
//
// 7. Use RETURNING when you need inserted/updated rows.
//
// 8. Check rowCount when an operation may affect zero rows.
//
// 9. Whitelist dynamic SQL identifiers.
//
// 10. Keep transactions short.
//
// 11. Configure pool size according to actual DB capacity.
//
// 12. Store credentials in environment variables/secrets.
//
// 13. Use explicit SELECT columns in production code.
//
// 14. Type query results with QueryResult<T> / pool.query<T>(),
//     but remember TypeScript does not validate database data.
//
// 15. Use indexes and EXPLAIN ANALYZE for performance;
//     increasing pool size is not a replacement for good SQL.
//
// ============================================================


// ============================================================
// CORE 20% TO MEMORIZE
// ============================================================
//
// import { Pool } from "pg";
//
// const pool = new Pool({
//     connectionString:
//         process.env.DATABASE_URL
// });
//
//
//
// // Query
//
// const result = await pool.query(
//     "SELECT * FROM users WHERE id = $1",
//     [id]
// );
//
//
//
// // Result
//
// result.rows;
// result.rowCount;
//
//
//
// // Insert
//
// await pool.query(
//     `
//     INSERT INTO users (name)
//     VALUES ($1)
//     RETURNING *
//     `,
//     [name]
// );
//
//
//
// // Update
//
// await pool.query(
//     `
//     UPDATE users
//     SET name = $1
//     WHERE id = $2
//     RETURNING *
//     `,
//     [name, id]
// );
//
//
//
// // Delete
//
// await pool.query(
//     "DELETE FROM users WHERE id = $1",
//     [id]
// );
//
//
//
// // Transaction
//
// const client = await pool.connect();
//
// try {
//
//     await client.query("BEGIN");
//
//     await client.query(...);
//     await client.query(...);
//
//     await client.query("COMMIT");
//
// } catch (error) {
//
//     await client.query("ROLLBACK");
//
//     throw error;
//
// } finally {
//
//     client.release();
// }
//
//
//
// // Shutdown
//
// await pool.end();
//
// ============================================================
