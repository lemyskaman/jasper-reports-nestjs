# Jasper Reports NestJS API

A modular, production-ready NestJS backend for uploading, storing, and processing JasperReports (`.jrxml` and `.jasper` files) and managing a products table in PostgreSQL. The project uses a clean hexagonal architecture, vertical slice modularity, and is fully Dockerized for easy local and production deployment.

---

## Quick Links
- [Architecture](docs/architecture-diagram.md)
- [Coding Style Guide](docs/coding-style-guide.md)
- [API Reference](docs/api-reference.md)
- [Testing Strategy](docs/testing.md)
- [Jasper Integration](docs/jasper-integration.md)
- [Docker Security](docs/docker-security.md)
- [Postman Usage](docs/postman.md)
- [Extended LLM Instructions](docs/extended-llm-instructions.md)

---

## Project Overview
- **Products**: CRUD operations for products (name, price, etc.)
- **Reports**: Upload, store, process JasperReports files, generate PDFs
- **Architecture**: Vertical Slice Clean Architecture, Hexagonal (Ports & Adapters), SOLID/DRY
- **Testing**: Unit, integration, and e2e tests, test-first approach
- **Docker**: Secure, multi-stage builds, non-root user, dev/prod separation
- **Postman**: Collection and environment for local API testing

---

## Quickstart
### Local Development
```sh
npm install
npm run start:dev
```

### Docker Development
```sh
docker-compose up -d
```
API available at [http://localhost:3000](http://localhost:3000)

### Testing
```sh
npm run test      # Unit/Integration
npm run test:e2e  # End-to-End
```

---

## Architecture Summary
This project uses **Vertical Slice Clean Architecture** and **Hexagonal (Ports & Adapters)**. See [Architecture Diagram](docs/architecture-diagram.md) for details and embedded diagrams.

---

## Coding Standards
All code follows the [Coding Style Guide](docs/coding-style-guide.md), enforcing SOLID, DRY, and NestJS best practices.

---

## API Reference
All endpoints, request/response schemas, and error codes are documented in [API Reference](docs/api-reference.md).

---

## Testing
Test-first strategy, coverage, and instructions are in [Testing Strategy](docs/testing.md).

---

## JasperReports Integration
JasperReports flow, CLI usage, and PDF generation are explained in [Jasper Integration](docs/jasper-integration.md).

---

## Docker Security
Production images use a non-root user and follow best practices. See [Docker Security](docs/docker-security.md).

---

## Postman Usage
Import the provided collection and environment for local API testing. See [Postman Usage](docs/postman.md).

---

## Contributor & LLM Instructions
See [Extended LLM Instructions](docs/extended-llm-instructions.md) for contributor and automation guidelines.

---

## License
MIT
