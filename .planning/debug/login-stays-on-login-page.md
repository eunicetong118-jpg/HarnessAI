---
status: investigating
trigger: "Login stays on /login page after clicking login despite 200 OK"
symptoms:
  expected: "Redirect to /dashboard (user) or /admin (admin)"
  actual: "Stays on /login page"
  errors: "TypeError: token.role is not a function (in server logs), data-auth-ext-processed warning (browser)"
  timeline: "Started after implementing Auth UI"
  reproduction: "Login at http://localhost:4000/login"
created: "2026-04-30"
updated: "2026-04-30"
---

# Current Focus
hypothesis: "NextAuth session callback property access is still failing or middleware is blocking redirect"
next_action: "gather initial evidence"
