# Task Manager API

This is a beginner Node.js and Express API built as part of my Code Platoon learning lab.

The goal of this project is to learn the basic CRUD pattern used in backend web development.

## What This API Does

This API manages a simple list of tasks.

Right now, the tasks are stored in memory inside `server.js`. That means the data resets when the server restarts. Later, this project can be upgraded to use PostgreSQL so tasks are saved permanently.

## What CRUD Means

CRUD stands for:

```text
Create
Read
Update
Delete

## Routes

| Method | Route | What it does |
|---|---|---|
| GET | `/tasks` | Shows all tasks |
| GET | `/tasks/:id` | Shows one task by ID |
| POST | `/tasks` | Creates a new task |
| PUT | `/tasks/:id` | Updates a task |
| DELETE | `/tasks/:id` | Deletes a task |

## Install

```bash
npm install


## PostgreSQL Database

This project now uses PostgreSQL for persistent task storage.

The API connects to PostgreSQL using the `pg` package and this Docker Compose environment variable:

```text
DATABASE_URL=postgres://task_user:task_password@db:5432/task_manager

## Health Check

This route checks whether the API is running and whether PostgreSQL is connected.

```bash
curl http://localhost:3001/health

## Running the App

Start the backend API and PostgreSQL database:

```bash
docker compose up -d --build

## Project Structure

task-manager-api/
├── server.js
├── compose.yaml
├── Dockerfile
├── package.json
├── db/
│   └── init.sql
└── frontend/
    ├── index.html
    ├── styles.css
    └── app.js
