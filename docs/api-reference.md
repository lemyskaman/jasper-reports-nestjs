# API Reference

This document provides a complete reference for all API endpoints in the Jasper Reports NestJS project.

## Products Endpoints

### List Products
- **GET /products**
- **Response:** Array of Product objects

### Get Product by ID
- **GET /products/:id**
- **Response:** Product object
- **Errors:** 404 if not found

### Create Product
- **POST /products**
- **Body:** `{ name: string, price: number }`
- **Response:** Created Product object
- **Errors:** 400 for validation errors

### Delete Product
- **DELETE /products/:id**
- **Response:** Success message
- **Errors:** 404 if not found

## Reports Endpoints

### List Reports
- **GET /reports**
- **Response:** Array of Report objects

### Get Report by ID
- **GET /reports/:id**
- **Response:** Report object
- **Errors:** 404 if not found

### Upload Report
- **POST /reports/upload**
- **Body:** Multipart file upload (`.jrxml` or `.jasper`)
- **Response:** Uploaded Report object
- **Errors:** 400 for invalid file

### Process Report
- **POST /reports/process/:filename**
- **Body:** Optional parameters for report generation
- **Response:** PDF file
- **Errors:** 404 if report not found, 500 for processing errors

## Error Codes
- **400**: Bad Request (validation, upload errors)
- **404**: Not Found (missing product/report)
- **500**: Internal Server Error (processing failures)

## Example Request/Response
```json
// POST /products
{
  "name": "Sample Product",
  "price": 19.99
}
```

```json
// Response
{
  "id": 1,
  "name": "Sample Product",
  "price": 19.99
}
```

## See Also
- [Postman Collection](./postman.md)
- [Testing](./testing.md)

