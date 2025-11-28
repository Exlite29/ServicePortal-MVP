1. Overview
This POC demonstrates a customer portal enabling users to view ServiceM8 bookings, attachments, and communicate with staff. It is built as a Single Page Application (SPA) using React 18, TypeScript, and Tailwind CSS.

2. Architecture & Design Decisions
Runtime Constraints & Adaptation
The provided coding environment restricts the creation of a traditional Backend-for-Frontend (BFF) architecture (Node/Express) that usually runs separately.

Adaptation: I implemented a "Service Layer Pattern" (services/portalService.ts).
Reasoning: This creates a clean interface that mimics backend calls. The UI components are agnostic to whether the data comes from fetch('/api/jobs') or a local mock delay. This allows the MVP to be fully functional immediately without setting up a complex local server environment.
Frontend Stack
React 18: Used createRoot for modern rendering.
TypeScript: Enforced strict typing for Job, User, and Message entities to ensure code quality and reduce runtime errors.
Tailwind CSS: Selected for rapid UI development. The "mobile-first" approach was used to ensure the portal looks good on phones (crucial for customers checking bookings on the go).
Mock Data Strategy
I mocked the ServiceM8 data structure based on standard Field Service Management objects:

Jobs/Bookings: Contain status, dates, and technicians.
Attachments: Linked via UUIDs.
Messages: Threaded view with sender types (CLIENT vs STAFF).
3. Assumptions
Authentication: Real authentication (OAuth/JWT) is simulated via a simple credential check against constants.
ServiceM8 API: Direct browser-to-API calls to ServiceM8 are often blocked by CORS or unsafe due to exposed API keys. The portalService mimics the response shape of a hypothetical Express Proxy that would handle the actual ServiceM8 authentication.
