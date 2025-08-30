# 🛠️ Laptop Management System (OLX Helper)

A NestJS backend service for managing OLX product images, orders, and integrations with Nova Poshta & OLX APIs.
---

## 📖 Description
OLX Helper is built with **NestJS** and **Prisma** to manage products, images, and orders for OLX listings.  
It ensures proper image ordering, prevents conflicts, and integrates with **Nova Poshta** for parcel tracking and **OLX API** for advertisement monitoring.

## 🛠️ Tech Stack

This project is built with a modern and scalable backend architecture:

- **Backend Framework**: [NestJS](https://nestjs.com/) – Progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Language**: [TypeScript](https://www.typescriptlang.org/) – Strictly typed JavaScript for better maintainability.
- **Database**: [PostgreSQL](https://www.postgresql.org/) – Reliable and powerful relational database.
- **ORM**: [Prisma](https://www.prisma.io/) – Type-safe database ORM with schema-driven approach.
- **Storage**: [AWS S3](https://aws.amazon.com/s3/) – Scalable cloud object storage for images and assets.
- **Containerization**: [Docker](https://www.docker.com/) – Consistent development and deployment environment.
- **Code Quality**: [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) – Linting and formatting for clean, readable code.
- **Testing**: [Jest](https://jestjs.io/) – Unit and integration testing.
- **Package Manager**: [npm](https://www.npmjs.com/) – Dependency management.

## Project setup

```bash
# clone the repository
$ git clone https://github.com/your-username/laptop-management-system.git

# installing dependencies
$ npm install

```
You can also run the project via Docker using the prebuilt image on Docker Hub:

```bash
# pull the image
$ docker pull vitaliiiii/laptop-management-system:latest

# run the container
$ docker run -d \
  --name laptop-management-system \
  -p 3000:3000 \
  --env-file .env \
  vitaliiiii/laptop-management-system:latest
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
🔑 Environment Variables
------------------------

Before running the project, create a `.env` file in the root directory.  
You can copy the template from `.env.example`:

```bash
cp .env.example .env
```

Example of .env file:
```bash
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/laptop_management
JWT_SECRET=your-jwt-secret
S3_ACCESS_KEY=your-aws-access-key
S3_SECRET_KEY=your-aws-secret-key
S3_REGION=us-east-1
S3_BUCKET=your-bucket-name

```

## 📖 API Documentation

The API documentation is available via Swagger.
Once the application is running, open:

`https://your_link/api/docs`


This interactive Swagger UI allows you to:

Explore all available endpoints

Test API requests directly

Review request and response formats

## Support

If you need any help with this app, please [write here](mailto:agodavitalij@gmail.com).

## Stay in touch

- Author - [Vitalii Yahoda](https://www.linkedin.com/in/vitaliiyahoda/)

