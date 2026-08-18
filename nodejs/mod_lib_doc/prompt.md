Create a single, practical JavaScript/TypeScript reference file for pg.

Goal:
I want a compact "developer cheatsheet" that I can keep beside me while coding. It should cover the most commonly used 20% of pg that handles roughly 80% of real-world usage.

Requirements:

1. Start with installation/import/setup if applicable.

2. Show the core API:
   - Most important classes/functions/methods
   - Important properties
   - Important options/configuration
   - Common arguments and return values

3. Cover the most common real-world operations/patterns:
   - Basic usage
   - CRUD where applicable
   - Configuration
   - Error handling
   - Async usage
   - Lifecycle/cleanup
   - Common integrations/patterns
   - Security considerations where relevant

4. Include only APIs that are:
   - Commonly used
   - Important to understand
   - Likely to appear in real production code
   - Useful for interviews/backend development

5. Do NOT try to document the entire API.
   Avoid obscure, rarely-used, deprecated, or highly advanced APIs unless they are important for production.

6. Use short comments only.
   Comments should explain WHAT something does or WHEN to use it.
   Avoid long theoretical explanations.

7. Prefer executable examples over pseudo-code.

8. Put related examples together logically:
   Setup
   → Core API
   → Common operations
   → Advanced/common patterns
   → Error handling
   → Real-world example
   → Quick reference

9. End with a compact QUICK REFERENCE section containing:
   - Important methods
   - Important properties
   - Important classes
   - Important options
   - Common patterns

10. Make the file self-contained and syntactically valid wherever practical.
    If an example requires external credentials, files, environment variables, or infrastructure, clearly mark those parts.

11. Adapt the structure to pg.
    Do NOT blindly use the same sections for every package.
    For example:
    - HTTP libraries → requests, responses, headers, routing, streams
    - Database libraries → connection, queries, transactions, pooling
    - Redis → keys, strings, hashes, expiration, transactions, pub/sub
    - Auth libraries → sign, verify, tokens, expiration, middleware
    - Frameworks → setup, architecture, routing, middleware, DI, lifecycle
    - Testing libraries → setup, assertions, mocks, fixtures, lifecycle

12. If pg has multiple commonly used APIs/approaches, prioritize the modern/recommended approach and briefly identify older/common alternatives when useful.

13. Assume I already understand basic JavaScript.
    Focus on practical pg usage, not teaching JavaScript itself.

14. Target:
    - Node.js backend development
    - TypeScript/JavaScript
    - Production development
    - Technical interviews
    - Learning the underlying library rather than blindly copying code

Output ONLY the complete reference file in one code block.

Use concise section comments like:

// ============================================================
// SECTION
// ============================================================

Keep it compact enough that I can realistically use it as a reference file.