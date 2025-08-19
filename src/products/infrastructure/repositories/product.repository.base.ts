// Base class: pure logic, no decorators
export class ProductRepositoryBase {
  protected readonly repo: any;
  constructor(repo: any) {
    this.repo = repo;
  }
  async save(product: any) {
    return this.repo.save(product);
  }
  async findAll() {
    return this.repo.find();
  }
}
