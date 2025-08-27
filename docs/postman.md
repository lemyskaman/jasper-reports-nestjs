# Postman Usage Guide

This document explains how to use the provided Postman collection and environment to test the Jasper Reports NestJS API locally.

## Files
- **postman-collection.json**: Contains all API requests for products and reports.
- **postman-environment.json**: Contains environment variables for local testing (e.g., base URL, auth tokens).

## How to Import
1. Open Postman.
2. Click **Import** and select `postman-collection.json`.
3. Import `postman-environment.json` as an environment.
4. Select the environment before running requests.

## Usage
- All endpoints (products, reports) are pre-configured.
- Variables like `baseUrl` make switching environments easy.
- Example requests include file uploads and PDF downloads.

## Troubleshooting
- Ensure the API is running locally (`http://localhost:3000`).
- Check environment variables for correct values.

## See Also
- [API Reference](./api-reference.md)
- [Testing](./testing.md)

