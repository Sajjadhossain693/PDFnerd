# PDFnerd

> **All-in-one PDF workspace for editing, conversion, analysis, academic
> workflows, privacy, accessibility, and AI-assisted document work.**

PDFnerd is a full-stack web application built with **React + Vite** on
the frontend, **Node.js + Express** on the backend, and **MongoDB
Atlas** for persistent data. It combines everyday PDF utilities with
specialized workspaces for academic documents, PDF health,
accessibility, privacy, study workflows, AI assistance, and one-click
automation.

------------------------------------------------------------------------

## Table of Contents

-   [1. Project Overview](#1-project-overview)
-   [2. Core Goals](#2-core-goals)
-   [3. Main Features](#3-main-features)
-   [4. Specialized Workspaces](#4-specialized-workspaces)
-   [5. Technology Stack](#5-technology-stack)
-   [6. System Architecture](#6-system-architecture)
-   [7. Application Architecture](#7-application-architecture)
-   [8. Project Structure](#8-project-structure)
-   [9. Frontend Architecture](#9-frontend-architecture)
-   [10. Backend Architecture](#10-backend-architecture)
-   [11. Request and Data Flow](#11-request-and-data-flow)
-   [12. Database Architecture](#12-database-architecture)
-   [13. API Reference](#13-api-reference)
-   [14. Authentication](#14-authentication)
-   [15. File Processing](#15-file-processing)
-   [16. Security](#16-security)
-   [17. Environment Variables](#17-environment-variables)
-   [18. Local Development](#18-local-development)
-   [19. Production Deployment](#19-production-deployment)
-   [20. Vercel Configuration](#20-vercel-configuration)
-   [21. Render Configuration](#21-render-configuration)
-   [22. MongoDB Atlas](#22-mongodb-atlas)
-   [23. Git and GitHub](#23-git-and-github)
-   [24. Build and Quality Checks](#24-build-and-quality-checks)
-   [25. Troubleshooting](#25-troubleshooting)
-   [26. Important Production Rules](#26-important-production-rules)
-   [27. Future Improvements](#27-future-improvements)
-   [28. License](#28-license)

------------------------------------------------------------------------

# 1. Project Overview

PDFnerd is designed as a modern PDF productivity platform.

The application has two major layers:

``` text
                    PDFnerd
                       |
          +------------+------------+
          |                         |
          v                         v
     React Frontend            Express API
       (Vite)                  (Node.js)
          |                         |
          |                    +----+----+
          |                    |         |
          |                    v         v
          |                MongoDB   File System
          |                 Atlas     /uploads
          |                           /output
          |
          +------ REST/JSON + multipart requests ------+
```

The frontend is responsible for the user interface, navigation,
workspace interactions, file selection, progress states, authentication
state, and API communication.

The backend is responsible for authentication, validation, PDF
processing, specialized workspace operations, database access, file
management, security middleware, rate limiting, and API responses.

------------------------------------------------------------------------

# 2. Core Goals

PDFnerd aims to provide:

-   Simple PDF tools for everyday users.
-   Specialized workflows for students and academic documents.
-   PDF health and repair analysis.
-   Accessibility auditing.
-   Privacy scanning and sanitization.
-   Study-oriented PDF processing.
-   AI-assisted document workflows.
-   One-click workflow automation.
-   Secure user authentication.
-   Responsive desktop and mobile experiences.
-   A modular architecture that can be extended with new PDF tools.

------------------------------------------------------------------------

# 3. Main Features

## PDF Utilities

The application currently contains routes/components for:

-   Merge PDF
-   Split PDF
-   Compress PDF
-   JPG to PDF
-   Rotate PDF
-   Watermark PDF
-   Protect PDF
-   Unlock PDF
-   Delete PDF pages
-   Extract PDF pages
-   Add page numbers
-   Generic tool handling
-   PDF processing history for authenticated users

## Platform Features

-   User registration
-   User login
-   Forgot password flow
-   Password reset
-   Authenticated user profile retrieval
-   Dashboard
-   Pricing page
-   About page
-   Contact page
-   Privacy Policy
-   Terms of Service
-   Tool discovery page
-   Unified workspace

------------------------------------------------------------------------

# 4. Specialized Workspaces

PDFnerd provides specialized workspaces in addition to traditional PDF
utilities.

### Academic Studio

Designed for academic document creation and processing.

Capabilities include:

-   Academic templates
-   University data
-   Cover-page generation
-   Academic document generation
-   Academic text tools
-   Structured document building

### PDF Health & Doctor

Designed to inspect PDF health and provide repair-oriented processing.

Capabilities include:

-   PDF health analysis
-   PDF doctor/healing workflow
-   Health reports

### Accessibility & Compliance

Designed to audit PDFs for accessibility-related issues.

Capabilities include:

-   Accessibility audit
-   Accessibility reports
-   Structured compliance feedback

### Privacy & Security

Designed to inspect and sanitize sensitive PDF metadata/content.

Capabilities include:

-   Privacy scanning
-   Privacy reports
-   PDF sanitization

### Exam & Study Mode

Designed for study-focused PDF processing.

Capabilities include:

-   Study material generation
-   PDF-based questions/answers
-   Document-based study assistance

### AI PDF Assistant

Provides a dedicated interface for AI-assisted PDF workflows.

### One-Click Workflows

Provides reusable workflow presets and automated multi-step PDF
processing.

------------------------------------------------------------------------

# 5. Technology Stack

## Frontend

  Technology        Purpose
  ----------------- ----------------------------
  React 19          UI
  Vite              Frontend build/dev server
  React Router      Client-side routing
  Axios             API communication
  Tailwind CSS      Utility styling
  Framer Motion     Animations/interactions
  React Dropzone    File uploads
  React Hot Toast   User notifications
  Heroicons         Icons
  Bootstrap Icons   Additional icons
  jsPDF             Client-side PDF generation
  html2canvas       HTML-to-image rendering
  Oxlint            Linting

## Backend

  Technology           Purpose
  -------------------- -----------------------------
  Node.js              Runtime
  Express              REST API
  MongoDB Atlas        Database
  Mongoose             MongoDB ODM
  JWT                  Authentication
  bcryptjs             Password hashing
  Multer               Multipart file uploads
  pdf-lib              PDF manipulation
  Sharp                Image processing
  Helmet               HTTP security headers
  CORS                 Cross-origin access
  express-rate-limit   Rate limiting
  express-validator    Request validation
  Morgan               Development logging
  node-cron            Cleanup scheduling
  UUID                 Unique file/job identifiers

## Deployment

-   Frontend: Vercel
-   Backend: Render
-   Database: MongoDB Atlas
-   Source control: GitHub

------------------------------------------------------------------------

# 6. System Architecture

PDFnerd follows a client-server architecture.

``` text
                         INTERNET
                            |
                            v
                    +---------------+
                    |    Vercel     |
                    | React + Vite  |
                    +-------+-------+
                            |
                    HTTPS REST API
                            |
                            v
                    +---------------+
                    |    Render     |
                    | Node/Express  |
                    +-------+-------+
                            |
              +-------------+-------------+
              |                           |
              v                           v
       +-------------+             +-------------+
       | MongoDB     |             | File System |
       | Atlas       |             | uploads     |
       +-------------+             | output      |
                                   +-------------+
```

### Architectural responsibilities

**Frontend** - Presentation - Routing - User interaction - Local UI
state - File selection - API requests - Authentication state

**Backend** - API endpoints - Authentication - Authorization -
Validation - PDF processing - File storage - Database operations -
Security middleware - Rate limiting - Cleanup jobs

**Database** - Users - Documents - Processing history - Reports -
Academic templates - Universities - Workflows - Processing jobs -
Document versions

------------------------------------------------------------------------

# 7. Application Architecture

A simplified request lifecycle:

``` text
User
 |
 v
React Page
 |
 v
Service Layer
 |
 v
Axios
 |
 | HTTPS
 v
Express Router
 |
 v
Middleware
 |---- CORS
 |---- Helmet
 |---- Rate Limiter
 |---- Authentication
 |---- Upload Validation
 |
 v
Controller / Route Handler
 |
 v
Service Layer
 |
 +----> MongoDB
 |
 +----> PDF/Image Processing
 |
 +----> File System
 |
 v
JSON / File Response
 |
 v
React UI
```

This separation keeps UI logic, API logic, business logic, and
persistence responsibilities organized.

------------------------------------------------------------------------

# 8. Project Structure

``` text
PDFnerd/
│
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── diu_crest_logo.png
│   │   │   ├── diu_crest_logo_base64.js
│   │   │   ├── diu_header_combo.png
│   │   │   ├── diu_header_logo_base64.js
│   │   │   └── hero.png
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── home/
│   │   │   ├── layout/
│   │   │   ├── tool/
│   │   │   └── ui/
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── WorkspaceContext.jsx
│   │   │
│   │   ├── data/
│   │   │   ├── academicTemplates.js
│   │   │   ├── tools.js
│   │   │   ├── universities.js
│   │   │   └── workflows.js
│   │   │
│   │   ├── pages/
│   │   │   ├── academic/
│   │   │   ├── accessibility/
│   │   │   ├── ai/
│   │   │   ├── auth/
│   │   │   ├── health/
│   │   │   ├── privacy/
│   │   │   ├── study/
│   │   │   ├── tool/
│   │   │   ├── workflows/
│   │   │   ├── workspace/
│   │   │   └── general pages
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── pdfService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   ├── constants.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── pdfController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── AcademicTemplate.js
│   │   ├── AccessibilityReport.js
│   │   ├── Document.js
│   │   ├── DocumentVersion.js
│   │   ├── PDFHealthReport.js
│   │   ├── PrivacyReport.js
│   │   ├── ProcessingHistory.js
│   │   ├── ProcessingJob.js
│   │   ├── University.js
│   │   ├── User.js
│   │   └── Workflow.js
│   │
│   ├── routes/
│   │   ├── academicRoutes.js
│   │   ├── accessibilityRoutes.js
│   │   ├── authRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── pdfRoutes.js
│   │   ├── privacyRoutes.js
│   │   ├── studyRoutes.js
│   │   └── workflowRoutes.js
│   │
│   ├── services/
│   │   ├── academicService.js
│   │   ├── accessibilityService.js
│   │   ├── authService.js
│   │   ├── healthService.js
│   │   ├── pdfService.js
│   │   ├── privacyService.js
│   │   ├── studyService.js
│   │   └── workflowService.js
│   │
│   ├── utils/
│   │   ├── fileCleanup.js
│   │   ├── statsTracker.js
│   │   └── validators.js
│   │
│   ├── data/
│   │   └── stats.json
│   │
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── package.json
├── vercel.json
├── start-all.bat
└── README.md
```

------------------------------------------------------------------------

# 9. Frontend Architecture

The frontend is a Vite-powered React single-page application.

## Entry point

``` text
client/src/main.jsx
        |
        v
client/src/App.jsx
        |
        v
React Router
        |
        v
Layout + Pages
```

## Important frontend layers

### Components

Reusable UI is stored under:

``` text
client/src/components/
```

Examples:

-   Navbar
-   Footer
-   Layout
-   FileUploader
-   FileList
-   ProgressBar
-   ToolCard
-   Tilt3DCard
-   Interactive3DStage
-   RecommendedActions

### Pages

Feature-level screens are stored under:

``` text
client/src/pages/
```

Each major workspace has its own page/module.

### Context

Global application state is handled through:

``` text
AuthContext.jsx
WorkspaceContext.jsx
```

### Services

API-related logic is separated into:

``` text
client/src/services/
```

The main Axios instance is defined in:

``` text
client/src/services/api.js
```

The API base URL is controlled by:

``` text
VITE_API_URL
```

------------------------------------------------------------------------

# 10. Backend Architecture

The backend is an Express REST API.

## Main server

``` text
server/server.js
```

The server configures:

-   dotenv
-   Express
-   Helmet
-   CORS
-   JSON parsing
-   URL-encoded parsing
-   rate limiting
-   API routes
-   error handling
-   database connection
-   statistics tracking
-   server startup
-   cleanup jobs

## Routes

Routes are grouped by domain:

``` text
/api/auth
/api/pdf
/api/academic
/api/health-check
/api/accessibility
/api/privacy
/api/study
/api/workflows
```

## Services

Business logic is separated into service modules:

``` text
server/services/
```

This prevents route files from becoming large and difficult to maintain.

## Models

MongoDB/Mongoose models are stored under:

``` text
server/models/
```

------------------------------------------------------------------------

# 11. Request and Data Flow

## Example: PDF compression

``` text
User selects PDF
       |
       v
React FileUploader
       |
       v
FormData
       |
       v
Axios POST
       |
       v
POST /api/pdf/compress
       |
       v
Multer validates upload
       |
       v
Rate limiter
       |
       v
PDF controller
       |
       v
PDF service
       |
       v
Compressed PDF
       |
       v
Output file
       |
       v
API response
       |
       v
Frontend download/result UI
```

## Example: Academic cover page

``` text
Academic Studio
       |
       v
User enters academic information
       |
       v
POST /api/academic/generate-cover
       |
       v
Academic service
       |
       v
PDF generation
       |
       v
Generated PDF
       |
       v
Frontend result
```

------------------------------------------------------------------------

# 12. Database Architecture

MongoDB Atlas is used as the primary persistent database.

The project contains Mongoose models for:

``` text
User
Document
DocumentVersion
ProcessingHistory
ProcessingJob
AcademicTemplate
University
PDFHealthReport
AccessibilityReport
PrivacyReport
Workflow
```

Conceptually:

``` text
User
 |
 +---- Documents
 |       |
 |       +---- Document Versions
 |
 +---- Processing History
 |
 +---- Processing Jobs
 |
 +---- Reports
 |       |
 |       +---- PDF Health
 |       +---- Accessibility
 |       +---- Privacy
 |
 +---- Workflow activity
```

The configured application database is intended to be:

``` text
pdfinity
```

------------------------------------------------------------------------

# 13. API Reference

## Health

``` http
GET /api/health
```

Returns backend health/status information.

------------------------------------------------------------------------

## Authentication

### Register

``` http
POST /api/auth/register
```

### Login

``` http
POST /api/auth/login
```

### Current user

``` http
GET /api/auth/me
```

### Forgot password

``` http
POST /api/auth/forgot-password
```

### Reset password

``` http
POST /api/auth/reset-password/:token
```

------------------------------------------------------------------------

## PDF Tools

``` http
POST /api/pdf/merge
POST /api/pdf/split
POST /api/pdf/compress
POST /api/pdf/rotate
POST /api/pdf/delete-pages
POST /api/pdf/extract-pages
POST /api/pdf/watermark
POST /api/pdf/page-numbers
POST /api/pdf/protect
POST /api/pdf/unlock
POST /api/pdf/jpg-to-pdf
```

Authenticated history:

``` http
GET    /api/pdf/history
DELETE /api/pdf/history/:id
```

File download:

``` http
GET /api/pdf/download/:filename
```

------------------------------------------------------------------------

## Academic

``` http
GET  /api/academic/templates
GET  /api/academic/universities
POST /api/academic/generate-cover
POST /api/academic/build-document
```

------------------------------------------------------------------------

## PDF Health

``` http
POST /api/health-check/analyze
POST /api/health-check/doctor-heal
```

------------------------------------------------------------------------

## Accessibility

``` http
POST /api/accessibility/audit
```

------------------------------------------------------------------------

## Privacy

``` http
POST /api/privacy/scan
POST /api/privacy/sanitize
```

------------------------------------------------------------------------

## Study

``` http
POST /api/study/generate
POST /api/study/ask
```

------------------------------------------------------------------------

## Workflows

``` http
GET  /api/workflows/presets
POST /api/workflows/execute
```

------------------------------------------------------------------------

# 14. Authentication

PDFnerd uses JWT-based authentication.

The general flow is:

``` text
Register/Login
     |
     v
Backend validates credentials
     |
     v
Password verification / hashing
     |
     v
JWT generated
     |
     v
Frontend stores authentication state
     |
     v
Axios interceptor attaches token
     |
     v
Protected API request
```

Passwords must never be stored in plaintext.

The backend uses `bcryptjs` for password hashing.

The JWT secret is supplied through:

``` text
JWT_SECRET
```

Never commit the production JWT secret to GitHub.

------------------------------------------------------------------------

# 15. File Processing

PDFnerd processes uploaded documents through the backend.

Upload middleware is handled by:

``` text
server/middleware/upload.js
```

The backend uses:

-   Multer for multipart uploads
-   pdf-lib for PDF manipulation
-   Sharp for image processing

Typical temporary locations include:

``` text
server/uploads/
server/output/
```

Generated files should be treated as temporary unless the application
explicitly persists them.

A cleanup utility is provided:

``` text
server/utils/fileCleanup.js
```

The cleanup interval is controlled by:

``` text
TEMP_FILE_TTL_MINUTES
```

------------------------------------------------------------------------

# 16. Security

The backend includes several security layers.

## Helmet

Security headers are configured with Helmet.

## CORS

Production CORS is controlled through:

``` text
CLIENT_URL
```

The deployed frontend origin must exactly match the production client
URL.

## Rate limiting

The backend uses `express-rate-limit`.

Separate limiting is used for sensitive/authenticated operations where
appropriate.

## Validation

Request validation uses:

``` text
express-validator
```

and project-level validation helpers.

## Authentication middleware

Protected resources use authentication middleware.

## Upload validation

Uploaded files pass through upload middleware before processing.

## Password security

Passwords are hashed using bcrypt.

## Secrets

Secrets belong in environment variables, never source files.

------------------------------------------------------------------------

# 17. Environment Variables

Create:

``` text
server/.env
```

from:

``` text
server/.env.example
```

Example structure:

``` env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:5173

MAX_FILE_SIZE_FREE=10485760
MAX_FILE_SIZE_PREMIUM=104857600

MAX_FILES_FREE=5
MAX_FILES_PREMIUM=50

TEMP_FILE_TTL_MINUTES=60
```

For production, use production values.

### Frontend environment

Create:

``` text
client/.env
```

or configure the variable in Vercel:

``` env
VITE_API_URL=https://<your-render-service>/api
```

Do not put private secrets in frontend environment variables.

Anything beginning with `VITE_` is intended to be exposed to the
browser.

------------------------------------------------------------------------

# 18. Local Development

## Requirements

Recommended:

-   Node.js 20+
-   npm
-   Git
-   MongoDB Atlas account or local MongoDB

The current project uses modern Node/React/Vite versions, so a current
LTS Node release is recommended.

## 1. Clone

``` bash
git clone https://github.com/Sajjadhossain693/PDFnerd.git
cd PDFnerd
```

## 2. Install frontend

``` bash
cd client
npm install
```

## 3. Install backend

Open another terminal:

``` bash
cd server
npm install
```

## 4. Configure backend

Create:

``` text
server/.env
```

and provide the required variables.

## 5. Start backend

``` bash
cd server
npm start
```

Backend:

``` text
http://localhost:5000
```

Health check:

``` text
http://localhost:5000/api/health
```

## 6. Start frontend

``` bash
cd client
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

The Vite development server proxies `/api` requests to:

``` text
http://localhost:5000
```

------------------------------------------------------------------------

# 19. Production Deployment

PDFnerd is designed to be deployed as:

``` text
GitHub
  |
  +----> Vercel
  |        |
  |        +---- React frontend
  |
  +----> Render
           |
           +---- Express backend
                    |
                    +---- MongoDB Atlas
```

## Current production services

Frontend:

``` text
https://pdf-nerd.vercel.app/
```

Backend:

``` text
https://pdfnerd.onrender.com
```

Backend health endpoint:

``` text
https://pdfnerd.onrender.com/api/health
```

------------------------------------------------------------------------

# 20. Vercel Configuration

The frontend lives inside:

``` text
client/
```

Recommended Vercel settings:

``` text
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

Production environment variable:

``` env
VITE_API_URL=https://pdfnerd.onrender.com/api
```

If React Router pages return 404 after a direct refresh, configure SPA
fallback through the repository's Vercel configuration.

------------------------------------------------------------------------

# 21. Render Configuration

The backend lives inside:

``` text
server/
```

Recommended Render settings:

``` text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Production environment variables should include:

``` env
NODE_ENV=production
MONGODB_URI=<production MongoDB connection string>
JWT_SECRET=<production secret>
JWT_EXPIRE=7d
CLIENT_URL=https://pdf-nerd.vercel.app
```

The backend listens on:

``` js
process.env.PORT || 5000
```

Render supplies the production `PORT`.

------------------------------------------------------------------------

# 22. MongoDB Atlas

MongoDB Atlas is the production database provider.

Recommended configuration:

``` text
Database: pdfinity
```

The backend connects through:

``` text
MONGODB_URI
```

Example format:

``` text
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/pdfinity
```

Never commit the real connection string.

For production, use the smallest practical database permissions and
restrict network access whenever the deployment architecture allows it.

------------------------------------------------------------------------

# 23. Git and GitHub

The source repository is:

``` text
https://github.com/Sajjadhossain693/PDFnerd.git
```

Basic workflow:

``` bash
git status

git add .

git commit -m "describe the change"

git push origin main
```

After pushing:

-   Vercel can create a new frontend deployment.
-   Render can deploy backend changes if automatic deployment is
    enabled.

Always check deployment logs after major changes.

------------------------------------------------------------------------

# 24. Build and Quality Checks

## Frontend build

``` bash
cd client
npm run build
```

## Frontend lint

``` bash
cd client
npm run lint
```

## Frontend preview

``` bash
cd client
npm run preview
```

## Backend production start

``` bash
cd server
npm start
```

## Root build

The root package provides:

``` bash
npm run build
```

which delegates to the client build.

------------------------------------------------------------------------

# 25. Troubleshooting

## Problem: `Cannot find module`

Check that the correct package is inside the correct `package.json`.

For example:

``` text
server/package.json
```

must contain backend dependencies such as:

``` text
dotenv
express
mongoose
cors
helmet
```

Then run:

``` bash
cd server
npm install
```

------------------------------------------------------------------------

## Problem: MongoDB `ENOTFOUND`

Check:

``` text
MONGODB_URI
```

Make sure:

-   Cluster hostname is correct.
-   Username is correct.
-   Password is correct.
-   Database name is correct.
-   Atlas network access allows the deployment server.
-   Special characters in passwords are URL-encoded when necessary.

------------------------------------------------------------------------

## Problem: CORS error

Check that:

``` text
CLIENT_URL
```

exactly matches the frontend origin.

Example:

``` text
https://pdf-nerd.vercel.app
```

Do not accidentally configure:

``` text
https://pdf-nerd.vercel.app/
```

if the application compares exact origins.

Also verify that the latest backend deployment contains the current CORS
configuration.

------------------------------------------------------------------------

## Problem: Frontend cannot reach API

Check:

``` text
VITE_API_URL
```

It should point to the backend API root:

``` text
https://pdfnerd.onrender.com/api
```

Not:

``` text
https://pdfnerd.onrender.com
```

when the Axios instance expects the `/api` prefix.

------------------------------------------------------------------------

## Problem: Page works on mobile but not desktop

Check desktop-specific:

-   `z-index`
-   `pointer-events`
-   absolute/fixed overlays
-   transformed elements
-   3D CSS
-   hover states
-   media queries
-   responsive breakpoints
-   transparent elements covering buttons
-   event propagation
-   React Router navigation
-   Chrome-specific hit-testing

Interactive cards such as `Tilt3DCard` should be tested in normal
desktop Chrome as well as mobile/responsive mode.

------------------------------------------------------------------------

## Problem: Vercel is showing old code

Check:

1.  GitHub contains the latest commit.
2.  Vercel has created a deployment for the latest commit.
3.  Deployment status is `Ready`.
4.  Browser cache is not serving an old build.
5.  Vercel project root directory is correct.
6.  `client` is selected as the root directory.
7.  Build output is `dist`.

------------------------------------------------------------------------

## Problem: Render uses the wrong directory

For this repository, backend deployment should use:

``` text
Root Directory: server
```

Otherwise Render may run the root package instead of the backend package
and miss server dependencies.

------------------------------------------------------------------------

# 26. Important Production Rules

## Never commit secrets

Do NOT commit:

``` text
.env
.env.local
.env.production
```

especially files containing:

-   MongoDB passwords
-   JWT secrets
-   API keys
-   private credentials

Commit only safe templates such as:

``` text
.env.example
```

------------------------------------------------------------------------

## Do not commit generated dependencies

Never upload:

``` text
node_modules/
```

to GitHub.

Both:

``` text
client/node_modules/
server/node_modules/
```

must remain ignored.

------------------------------------------------------------------------

## Do not rely on committed build output

Vercel should build:

``` text
client/
```

from source.

The generated:

``` text
client/dist/
```

should generally not be treated as the source of truth.

------------------------------------------------------------------------

## Temporary files

Do not intentionally commit generated PDF uploads or temporary output
files.

Use runtime-created directories and cleanup jobs.

------------------------------------------------------------------------

# 27. Future Improvements

Possible future development areas:

### PDF Editor

-   Visual PDF editor
-   Text editing
-   Annotation
-   Highlighting
-   Drawing
-   Signature
-   Form filling

### AI

-   Better PDF question answering
-   Document summarization
-   Citation-aware answers
-   OCR
-   Multi-document chat
-   Structured extraction

### Processing

-   Background job queue
-   Progress tracking
-   Larger files
-   Batch processing
-   Cloud object storage

### Security

-   Stronger production CORS policies
-   CSRF strategy where applicable
-   Account verification
-   Refresh-token rotation
-   Audit logging
-   More granular authorization
-   Malware scanning for uploads

### Infrastructure

-   Cloud storage instead of local disk
-   Redis-backed rate limiting
-   Queue workers
-   Monitoring
-   Error tracking
-   Automated tests
-   CI/CD pipelines

### UX

-   Better desktop hit-testing
-   Accessibility improvements
-   Keyboard navigation
-   Offline-friendly UI states
-   More polished loading/error states

------------------------------------------------------------------------

# 28. License

This project is licensed under the **MIT License** unless a different
license is specified by the project owner.

------------------------------------------------------------------------

## Quick Reference

### Local frontend

``` text
http://localhost:5173
```

### Local backend

``` text
http://localhost:5000
```

### Local backend health

``` text
http://localhost:5000/api/health
```

### Production frontend

``` text
https://pdf-nerd.vercel.app/
```

### Production backend

``` text
https://pdfnerd.onrender.com
```

### Production API

``` text
https://pdfnerd.onrender.com/api
```

### Repository

``` text
https://github.com/Sajjadhossain693/PDFnerd.git
```

------------------------------------------------------------------------

## Project Architecture Summary

``` text
                         PDFnerd
                            |
             +--------------+--------------+
             |                             |
             v                             v
       React + Vite                  Node + Express
       Vercel                        Render
             |                             |
             | REST / HTTPS                |
             +--------------+--------------+
                            |
                +-----------+-----------+
                |                       |
                v                       v
          MongoDB Atlas            PDF Processing
                                   + File System
                |
                v
       Users / Documents /
       Reports / History /
       Workflows / Academic Data
```

**PDFnerd = PDF utilities + specialized workspaces + secure backend +
cloud database + production deployment.**
