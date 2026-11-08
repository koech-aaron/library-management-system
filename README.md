
# Library Management System

## Project Overview

This project implements the data layer for a Library Management System using Prisma ORM and a hosted PostgreSQL database on Supabase.

## Technologies Used

- Node.js
- TypeScript
- Prisma ORM 7
- PostgreSQL
- Supabase
- NestJS

## Database Models

The database contains three main components:

- **User:** Stores user information, email addresses and roles.
- **Genre:** Stores book categories.
- **Book:** Stores book information and references its genre.

The Role enum defines two user roles: PATRON and LIBRARIAN.

## Schema Decisions

The Book model references Genre through a foreign key (`genreId`) instead of embedding genre information directly into each book.

This design creates a one-to-many relationship: one genre can have many books, while each book belongs to one genre.

Using a separate Genre table avoids data duplication, improves consistency and makes it easier to update or manage book categories. It also allows PostgreSQL to enforce referential integrity through foreign-key constraints.

## Database Setup

1. Install dependencies:

   `npm install`

2. Configure your database connection in `api/.env` using the Supabase connection details.

3. Apply migrations:

   `npx prisma migrate dev`

4. Generate the Prisma Client:

   `npx prisma generate`

5. Seed the database:

   `npx prisma db seed`

## Seed Data

The database is populated with:

- 4 genres
- 16 sample books

## Prisma Service

The PrismaService extends PrismaClient and implements NestJS lifecycle hooks to connect to and disconnect from the database.

## Prisma ORM vs Document Databases

Prisma works well with relational databases such as PostgreSQL because it provides structured models, relationships, migrations and foreign-key constraints.

A document database such as MongoDB stores data in flexible document structures, making it useful when records have varying fields or nested data.

For this library system, Prisma with PostgreSQL is suitable because books, genres, users and reviews have clear relationships and benefit from relational data integrity.