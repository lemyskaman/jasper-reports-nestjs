# Jasper Reports NestJS API

A modular, production-ready NestJS backend for uploading, storing, and processing JasperReports (`.jrxml` and `.jasper` files) and managing a products table in PostgreSQL. The project uses a clean hexagonal architecture, vertical slice modularity, and is fully Dockerized for easy local and production deployment.

## Project Structure

```
jasper-reports-nestjs/
├── src/
│   ├── app.module.ts           # Root module
│   ├── main.ts                 # Application entry point
│   ├── products/               # Products feature module
│   │   ├── application/        # Controllers, DTOs, use-cases
│   │   │   ├── controllers/    # API controllers
│   │   │   ├── dtos/           # Data Transfer Objects
│   │   │   └── use-cases/      # Application services
│   │   ├── domain/             # Domain entities and ports
│   │   │   ├── product.entity.ts          # Domain entity
│   │   │   └── product.repository.port.ts # Repository interface
│   │   └── infrastructure/     # ORM entities, repositories
│   │       ├── entities/       # TypeORM entities
│   │       └── repositories/   # Repository implementations
│   ├── reports/                # Reports feature module
│   │   ├── application/        # Controllers, DTOs, use-cases
│   │   │   ├── controllers/    # API controllers
│   │   │   ├── dtos/           # Data Transfer Objects
│   │   │   └── use-cases/      # Application services
│   │   ├── domain/             # Domain entities and ports
│   │   │   ├── report.entity.ts          # Domain entity
│   │   │   └── report.repository.port.ts # Repository interface
│   │   └── infrastructure/     # ORM entities, repositories
│   │       ├── entities/       # TypeORM entities
│   │       └── repositories/   # Repository implementations
│   └── shared/                 # Shared infrastructure (DB, Jasper, Storage)
│       └── infrastructure/
│           ├── database/       # TypeORM config, seeds
│           ├── jasper/         # Jasper service stub
│           └── storage/        # File storage service
├── docs/                       # Documentation
│   ├── coding-style-guide.md   # Coding standards
│   ├── extended-llm-instructions.md # Additional instructions
│   └── architecture-diagram.md # Architecture diagrams
├── Dockerfile                  # Production Docker build
├── Dockerfile.dev              # Development Docker build (with Jasper libs)
├── docker-compose.yml          # Multi-service orchestration
├── package.json                # NPM scripts and dependencies
```

## Hexagonal Architecture

This project follows the Hexagonal Architecture (Ports and Adapters) pattern, which provides several benefits:

1. **Separation of Concerns**: The business logic is isolated from external concerns like databases and UI.
2. **Testability**: Domain logic can be tested without infrastructure dependencies.
3. **Flexibility**: Infrastructure implementations can be swapped without affecting the domain.

The architecture is organized into three main layers:

### Domain Layer
- Contains business entities and business logic
- Defines interfaces (ports) that the domain requires from the outside world
- Has no dependencies on other layers

### Application Layer
- Contains use cases that orchestrate the domain entities
- Translates between the domain and the outside world using DTOs
- Depends only on the domain layer

### Infrastructure Layer
- Contains implementations of the interfaces defined by the domain
- Includes controllers, repositories, ORM entities, and external services
- Adapts external concerns to the needs of the domain

For detailed architecture diagrams, see [Architecture Diagrams](./docs/architecture-diagram.md).

## Dependency Installation

- Node.js 18+ and npm required for local development
- Docker and Docker Compose required for containerized setup

Install Node dependencies:
```sh
npm install
```

## Project Installation & Usage

### Local Development
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the app:
   ```sh
   npm run start:dev
   ```

### Docker Development
1. Build and start the containers:
   ```sh
   docker-compose up -d
   ```
2. The API will be available at http://localhost:3000

## API Endpoints

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get a product by ID
- `POST /products` - Create a new product
- `DELETE /products/:id` - Delete a product

### Reports
- `GET /reports` - List all reports
- `GET /reports/:id` - Get a report by ID
- `POST /reports/upload` - Upload a report file
- `POST /reports/process/:filename` - Process a report and generate PDF

## Testing

Run unit tests:
```sh
npm run test
```

Run e2e tests:
```sh
npm run test:e2e
```

## License

MIT
