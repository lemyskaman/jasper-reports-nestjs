# Hexagonal Architecture Diagram

This document provides a visual representation of the hexagonal architecture (ports and adapters) implemented in this project.

## Domain Layer

```plantuml
@startuml

package "Domain Layer" {
  class "Product" as ProductEntity {
    - id: number
    - name: string
    - price: number
    - description: string
    + validateProduct(): void
    + updateName(name: string): void
    + updatePrice(price: number): void
    + updateDescription(description: string): void
  }
  
  class "Report" as ReportEntity {
    - id: number
    - filename: string
    - originalname: string
    - uploadedAt: Date
    + validateReport(): void
    + updateFilename(filename: string): void
    + updateOriginalname(originalname: string): void
  }
  
  interface "ProductRepositoryPort" as ProductRepoPort {
    + findAll(): Promise<Product[]>
    + findById(id: number): Promise<Product | null>
    + save(product: Product): Promise<Product>
    + delete(id: number): Promise<boolean>
  }
  
  interface "ReportRepositoryPort" as ReportRepoPort {
    + findAll(): Promise<Report[]>
    + findById(id: number): Promise<Report | null>
    + save(report: Report): Promise<Report>
    + delete(id: number): Promise<boolean>
  }
  
  ProductEntity -- ProductRepoPort
  ReportEntity -- ReportRepoPort
}

@enduml
```

## Application Layer

```plantuml
@startuml

package "Application Layer" {
  class "ProductService" as ProductService {
    - productRepo: ProductRepositoryPort
    + findAll(): Promise<ProductDto[]>
    + findById(id: number): Promise<ProductDto | null>
    + create(dto: CreateProductDto): Promise<ProductDto>
    + delete(id: number): Promise<boolean>
    - toDto(product: Product): ProductDto
  }
  
  class "ReportsService" as ReportsService {
    - reportRepo: ReportRepositoryPort
    - storageService: StorageService
    + saveReportFile(file: Express.Multer.File): Promise<ReportDto>
    + listReports(): Promise<ReportDto[]>
    + findById(id: number): Promise<ReportDto | null>
    + deleteReport(id: number): Promise<boolean>
    - toDto(report: Report): ReportDto
  }
  
  class "ProductDto" as ProductDto {
    + id: number
    + name: string
    + price: number
    + description: string
  }
  
  class "CreateProductDto" as CreateProductDto {
    + name: string
    + price: number
    + description?: string
  }
  
  class "ReportDto" as ReportDto {
    + id: number
    + filename: string
    + originalname: string
    + uploadedAt: Date
  }
  
  class "UploadReportDto" as UploadReportDto {
    + filename: string
    + originalname: string
  }
  
  ProductService -- ProductDto
  ProductService -- CreateProductDto
  ReportsService -- ReportDto
  ReportsService -- UploadReportDto
}

@enduml
```

## Infrastructure Layer

```plantuml
@startuml

package "Infrastructure Layer" {
  class "ProductRepository" as ProductRepo {
    - repo: Repository<ProductOrmEntity>
    + findAll(): Promise<Product[]>
    + findById(id: number): Promise<Product | null>
    + save(product: Product): Promise<Product>
    + delete(id: number): Promise<boolean>
    - toDomainEntity(ormEntity: ProductOrmEntity): Product
    - toOrmEntity(domainEntity: Product): ProductOrmEntity
  }
  
  class "ReportRepository" as ReportRepo {
    - repo: Repository<ReportOrmEntity>
    + findAll(): Promise<Report[]>
    + findById(id: number): Promise<Report | null>
    + save(report: Report): Promise<Report>
    + delete(id: number): Promise<boolean>
    - toDomainEntity(ormEntity: ReportOrmEntity): Report
    - toOrmEntity(domainEntity: Report): ReportOrmEntity
  }
  
  class "ProductOrmEntity" as ProductOrmEntity {
    + id: number
    + name: string
    + price: number
    + description: string
  }
  
  class "ReportOrmEntity" as ReportOrmEntity {
    + id: number
    + filename: string
    + originalname: string
    + uploadedAt: Date
  }
  
  class "ProductsController" as ProductsController {
    - productService: ProductService
    + findAll(): Promise<ProductDto[]>
    + findOne(id: number): Promise<ProductDto>
    + create(dto: CreateProductDto): Promise<ProductDto>
    + remove(id: number): Promise<void>
  }
  
  class "ReportsController" as ReportsController {
    - reportsService: ReportsService
    - jasperService: JasperService
    + listReports(): Promise<ReportDto[]>
    + getReport(id: number): Promise<ReportDto>
    + uploadReport(file: Express.Multer.File): Promise<ReportDto>
    + processReport(filename: string, params: any, res: Response): Promise<void>
  }
  
  ProductRepo -- ProductOrmEntity
  ReportRepo -- ReportOrmEntity
  ProductsController -- ProductRepo
  ReportsController -- ReportRepo
}

@enduml
```

## Complete Architecture

```plantuml
@startuml

package "Domain Layer" {
  class "Product" as ProductEntity
  class "Report" as ReportEntity
  interface "ProductRepositoryPort" as ProductRepoPort
  interface "ReportRepositoryPort" as ReportRepoPort
  
  ProductEntity -- ProductRepoPort
  ReportEntity -- ReportRepoPort
}

package "Application Layer" {
  class "ProductService" as ProductService
  class "ReportsService" as ReportsService
  class "ProductDto" as ProductDto
  class "CreateProductDto" as CreateProductDto
  class "ReportDto" as ReportDto
  class "UploadReportDto" as UploadReportDto
  
  ProductService -- ProductDto
  ProductService -- CreateProductDto
  ReportsService -- ReportDto
  ReportsService -- UploadReportDto
  
  ProductService -down-> ProductRepoPort : uses
  ReportsService -down-> ReportRepoPort : uses
}

package "Infrastructure Layer" {
  class "ProductRepository" as ProductRepo
  class "ReportRepository" as ReportRepo
  class "ProductOrmEntity" as ProductOrmEntity
  class "ReportOrmEntity" as ReportOrmEntity
  class "ProductsController" as ProductsController
  class "ReportsController" as ReportsController
  
  ProductRepo -- ProductOrmEntity
  ReportRepo -- ReportOrmEntity
  ProductsController -- ProductService : uses
  ReportsController -- ReportsService : uses
  
  ProductRepo .up.|> ProductRepoPort : implements
  ReportRepo .up.|> ReportRepoPort : implements
}

@enduml
```

## Dependency Flow

```plantuml
@startuml

package "Domain Layer" {
  [Domain Entities] as DE
  [Repository Ports] as RP
}

package "Application Layer" {
  [Application Services] as AS
  [DTOs] as DTO
}

package "Infrastructure Layer" {
  [Controllers] as CTRL
  [Repository Implementations] as REPO
  [ORM Entities] as ORM
  [Database] as DB
}

CTRL --> AS : uses
AS --> RP : depends on
AS --> DE : uses
AS --> DTO : returns
REPO .up.> RP : implements
REPO --> ORM : uses
REPO --> DE : maps to/from
ORM --> DB : persisted in

@enduml
```

This architecture follows the Hexagonal Architecture (Ports and Adapters) pattern, where:

1. The Domain Layer contains the core business logic and defines what it needs from the outside world through ports (interfaces).
2. The Application Layer orchestrates the use of domain entities to fulfill use cases and translates between the domain and the outside world.
3. The Infrastructure Layer implements the adapters that fulfill the ports defined by the domain layer.

The key benefit is that the Domain Layer has no dependencies on the Infrastructure Layer, making it easier to test and maintain.