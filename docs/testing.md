# Testing Strategy

This document describes the testing approach for the Jasper Reports NestJS project.

## Philosophy
- **Test-First**: Write unit tests before implementing code.
- **NestJS Best Practices**: Use `@nestjs/testing` utilities for modules, controllers, and services.
- **Coverage**: Aim for high coverage of domain logic, controllers, and adapters.

## Types of Tests
- **Unit Tests**: Test domain entities, services, and use-cases in isolation.
- **Integration Tests**: Test repositories, database interactions, and Jasper CLI integration.
- **E2E Tests**: Test full API flows using HTTP requests.

## Running Tests
- **Unit/Integration**: `npm run test`
- **E2E**: `npm run test:e2e`

## Example Test (Product Service)
```typescript
// product.service.spec.ts
it('should create a product', async () => {
  const result = await service.create({ name: 'Test', price: 10 });
  expect(result.name).toBe('Test');
  expect(result.price).toBe(10);
});
```

## Coverage Reports
- Run `npm run test -- --coverage` for coverage details.

## See Also
- [API Reference](./api-reference.md)
- [Coding Style Guide](./coding-style-guide.md)

