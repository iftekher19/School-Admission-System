# School Admission System

A web-based school admission management system built with React and ASP.NET Core. It manages class capacity, temporary seat reservations, admission confirmation, and student application history.

The system follows a **first-come-first-served** admission policy and uses PostgreSQL for persistent data storage.

## Features

- View available classes and seat availability.
- Create and manage classes.
- Reserve a seat through a temporary admission hold.
- Confirm admission before the hold expires.
- Automatically expire overdue holds and release reserved seats.
- Prevent students from having multiple active or confirmed applications.
- Prevent class capacity from being exceeded.
- View personal application history and status.
- English and Bangla language support.
- Responsive user interface.
- Docker-based application deployment.

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- DaisyUI
- React Hook Form

### Backend
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core
- PostgreSQL
- Npgsql

### Deployment
- Docker
- Docker Compose
- Nginx

## Project Structure

```text
School Admission System/
├── backend/
│   └── SchoolAdmission.Api/
│       ├── Controllers/
│       ├── Data/
│       ├── Helpers/
│       ├── Models/
│       ├── Services/
│       ├── Migrations/
│       ├── Dockerfile
│       └── Program.cs
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── utils/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── ASSUMPTIONS.md
```

## Getting Started

### Prerequisites

Docker Desktop with Docker Compose support.

No separate installation of Node.js, .NET SDK, or PostgreSQL is required to run the complete application through Docker.

### Run the Application

1. Clone the repository:

```bash
git clone <https://github.com/iftekher19/School-Admission-System.git>
```

2. Navigate to the project directory:

```bash
cd School-Admission-System
```

3. Build and start all services:

```bash
docker compose up --build
```

Docker Compose starts:
- PostgreSQL database
- ASP.NET Core backend
- React frontend served through Nginx

### Application URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Classes endpoint | http://localhost:8080/classes |
| OpenAPI document | http://localhost:8080/openapi/v1.json |

### Stop the Application

Press `Ctrl + C` in the terminal, or run:

```bash
docker compose down
```

### Database Persistence

PostgreSQL uses a named Docker volume (`postgres_data`) to persist application data.

Restarting the containers does not delete saved data.

**Important:** Do not use `docker compose down -v` unless you intentionally want to delete the database volume and its data.

## Student Identity

The system uses a 17-digit student registration number to identify students.

The student ID is provided through the `X-Student-Id` HTTP header for student-specific operations.

There is no separate login or registration system.



## Admission and Seat Management

- A student can have only one active or confirmed application.
- A temporary hold reserves one seat.
- The default hold duration is 600 seconds (10 minutes).
- Expired holds release their reserved seats.
- A confirmed application permanently occupies a seat.
- Repeated confirmation of the same hold does not increase the confirmed seat count.
- Seat allocation is protected against concurrent requests.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `HOLD_DURATION_SECONDS` | `600` | Duration of a temporary admission hold |
| `ConnectionStrings__DefaultConnection` | Configured in Docker Compose | PostgreSQL connection string |
| `ASPNETCORE_URLS` | `http://+:8080` | Backend listening address |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Frontend API base URL |

## Language Support

The application supports:
- English
- Bangla

The selected language is stored in browser local storage and remains selected when the page is refreshed.
