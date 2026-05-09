# Project Tracker

A full-stack Project & Task Management application built using the MERN ecosystem principles with a modern TypeScript-based architecture.

This application allows users to:
- Register and login
- Create and manage projects
- Create, update, and delete tasks
- Track task status and due dates
- Navigate projects and tasks using nested routing

---

# Tech Stack

## Frontend

- React
- TypeScript
- TanStack Router
- React Query
- React Hook Form
- Zod
- Tailwind CSS
- Lucide React
- SweetAlert2
- Vite

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT Authentication
- Clean Architecture

---

# Features

## Authentication

- User registration
- User login
- Protected routes
- Session handling
- JWT-based authentication

## Project Management

- Create project
- List projects
- Update project
- Delete project
- Project details

## Task Management

- Create task
- List tasks by project
- Update task
- Delete task
- Task status management
- Due date management

## UI Features

- Modal-based forms
- Form validation using Zod
- Loading states
- Empty states
- Error handling
- Toast notifications
- Responsive UI

---

# Frontend Architecture

```txt
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── lib/
│   ├── routes/
│   ├── index.css
│   └── main.tsx
```

## Frontend Folder Structure

### `app/`
Application-level configurations like router setup.

### `components/`
Reusable UI components.

### `features/`
Feature-based modules.
Example:
- auth
- project
- task

Each feature contains:
- API functions
- React Query hooks
- DTOs/types

### `lib/`
Shared utilities.
Example:
- api client
- toast utilities
- helpers

### `routes/`
All route pages.

---

# Backend Clean Architecture

```txt
backend/
├── src/
│   ├── application/
│   ├── domain/
│   ├── infrastructure/
│   ├── presentation/
│   ├── shared/
│   └── main.ts
```

## Backend Layers

### `domain/`
Contains core business logic.

Includes:
- entities
- interfaces
- repository contracts
- business rules

This layer does not depend on frameworks.

---

### `application/`
Contains application use cases.

Examples:
- create project
- update task
- login user

This layer coordinates domain logic.

---

### `infrastructure/`
Handles external services and implementations.

Examples:
- Prisma repositories
- database setup
- JWT service
- bcrypt service

---

### `presentation/`
Handles HTTP/API layer.

Examples:
- Express routes
- types
- middlewares
- errors
- utils

---

### `shared/`
Shared helpers and utilities.

Examples:
- error classes

---

# Installation Guide

## 1. Clone Repository

```bash
git clone <your-repository-url>
```

```bash
cd project_tracker
```

---

# Backend Setup

## 1. Navigate to backend

```bash
cd backend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Setup environment variables

Create `.env`

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

---

## 4. Run Prisma migrations

```bash
npx prisma migrate dev
```

---

## 5. Generate Prisma client

```bash
npx prisma generate
```

---

## 6. Start backend server

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:3000
```

---

# Frontend Setup

## 1. Navigate to frontend

```bash
cd frontend
```

## 2. Install dependencies

```bash
npm install
```

---

## 3. Start frontend server

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# API Overview

## Auth

- POST `/auth/register`
- POST `/auth/login`
- GET `/auth/me`

## Projects

- GET `/projects`
- GET `/projects/:id`
- POST `/projects`
- PATCH `/projects/:id`
- DELETE `/projects/:id`

## Tasks

- GET `/projects/:projectId/tasks`
- POST `/projects/:projectId/tasks`
- PATCH `/tasks/:taskId`
- DELETE `/tasks/:taskId`

---

# Validation

Frontend and backend use:

- Zod validation
- DTO pattern
- Strong TypeScript typing

---

# State Management

React Query is used for:

- server state management
- caching
- query invalidation
- loading/error states
- mutations

---

# Routing

TanStack Router is used for:

- protected routes
- nested routes
- route params
- navigation

---

# Future Improvements

- Task filtering
- Pagination
- Search
- Drag & drop tasks
- Real-time updates
- Role-based access control
- Unit testing
- Docker support

---

# Author

Sumesh J