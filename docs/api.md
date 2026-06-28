# API Documentation

This document describes the available API endpoints for the PressHouse CMS.

## General Information
- **Base URL**: `/api`
- **Authentication**: JWT (JSON Web Token) required for most Admin/Staff endpoints. Pass in the `Authorization` header as `Bearer <token>`.

## Admin Endpoints

### News
* `GET /api/articles`: Get all news articles.
* `POST /api/articles`: Create a new article. (Auth required)

### Violations
* `GET /api/violations`: Get all violation reports.
* `POST /api/violations`: Submit a new violation report.
* `DELETE /api/violations/:id`: Delete a violation report. (Auth required)

### Projects
* `GET /api/projects`: Get all projects.
* `POST /api/projects`: Create a new project. (Auth required)
* `PUT /api/projects/:id`: Update an existing project. (Auth required)
* `DELETE /api/projects/:id`: Delete a project. (Auth required)

### Subscribers
* `POST /api/subscribers`: Subscribe to the newsletter.
