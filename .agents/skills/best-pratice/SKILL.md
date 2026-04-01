---
name: antigravity
description: Enforces clean, readable, maintainable code using language-specific best practices, design principles, and rigorous standards. Use when generating, refactoring, or architecting code.
---

# Antigravity Skill: Code Quality & Architecture Expert

When writing, refactoring, or architecting code, apply the following "Antigravity" principles to ensure the code remains lightweight, scalable, and robust. Always adapt these rules to the specific programming language and framework being used.

## 1. Programming Paradigms & Structure
* **Favor Functional/Declarative:** Default to functional programming patterns. Prioritize pure functions, modularization, and iteration over duplicated code.
* **Avoid Unnecessary Classes:** Unless mandated by the framework (e.g., Angular, traditional Java), avoid heavy class-based OOP inheritance. Keep designs lightweight.
* **Single Responsibility:** Ensure every function, component, or module does exactly one thing well.

## 2. Naming Conventions & Consistency
* **Descriptive Variables:** Use highly descriptive variable and function names. Use auxiliary verbs for booleans (e.g., `isLoading`, `hasError`, `canSubmit`).
* **Standardized Casing:** Strictly follow the standard casing for the language/framework (e.g., lowercase with dashes for frontend directories like `components/auth-wizard`).
* **Syntax Cleanliness:** Avoid unnecessary curly braces in simple conditionals. Export consistently (e.g., favor named exports in JavaScript/TypeScript).

## 3. Strict Type Safety
* **Enforce Types Everywhere:** Maximize type safety. In TypeScript, enable strict mode, prefer `interfaces` over `types`, and use `const` objects instead of `enums`. 
* **Language-Specific Typing:** In Python, utilize type hints and validation libraries like Pydantic. In PHP, declare `strict_types=1`. Avoid "any" or loose typing fallbacks.

## 4. Error Handling & Validation
* **Guard Clauses (Early Returns):** Handle errors, edge cases, and invalid states at the very beginning of a function. 
* **Avoid Deep Nesting:** Use early returns to prevent deeply nested `if/else` statements. Always place the "happy path" last for maximum readability.
* **Structured Errors:** Use custom, structured error types rather than throwing generic exceptions.

## 5. Testability & Automation
* **Test-Ready Code:** Write code that is inherently easy to test (e.g., passing dependencies as arguments, avoiding hidden side effects).
* **Automation Mindset:** Assume the code will run through strict CI/CD pipelines. Write code that passes static type checking and aggressive linting.

## 6. Performance & Optimization
* **Resource Efficiency:** Use code-splitting and lazy loading for non-critical resources in front-end applications. 
* **Language-Specific Optimization:** Leverage built-in concurrency features safely when advantageous (e.g., Go routines, Rust async/await, Node.js worker threads).

## 7. Security by Default
* **Zero Trust Inputs:** Sanitize and validate all external inputs unconditionally.
* **Least Privilege:** Request and implement only the absolute minimum permissions required to execute a task.
* **Secure Communications:** Always enforce secure protocols (HTTPS, WSS) and modern authentication standards (OAuth 2.0, JWT).

## How to execute a request using Antigravity:
1.  **Analyze Context:** Identify the language, framework, and explicit user requirements.
2.  **Plan:** Mentally map the architecture using the 7 principles above before writing.
3.  **Generate:** Output the requested code with clear comments explaining *why* certain architectural choices were made (e.g., "Using an early return here to handle the null case and keep the happy path flat").