# Web Application Security Basics

Fundamental habits for building secure applications.

## Password Storage
- **Hash and Salt**: Never store plain text. Use unique salts per user.
- **Slow Algorithms**: Use Argon2, bcrypt, or scrypt to defend against GPU-based cracking.
- **Entropy over Complexity**: Encourage long passwords (up to 160 chars) over restrictive character sets.

## Authentication & Session Management
- **Safe Authentication**: Use secure channels (HTTPS) and avoid leaking user existence in error messages (e.g., "invalid user or password" instead of "user not found").
- **Session Security**: Use `HttpOnly` and `Secure` flags. Implement CSRF protection.
- **Two-Factor (2FA)**: Move beyond passwords for high-stringency requirements.

## Principles
- **Cross-functional Concern**: Security must be baked in, not bolted on.
- **Least Privilege**: Only grant necessary permissions at every layer (DB, App, OS).
- **External Secrets**: Avoid storing passwords for external services; use delegated auth (OAuth) where possible.
