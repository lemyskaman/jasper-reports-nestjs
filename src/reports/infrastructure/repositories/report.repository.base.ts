// Base class: pure logic, no decorators
export class ReportRepositoryBase {
  protected readonly repo: any;
  constructor(repo: any) {
    this.repo = repo;
  }
  async save(report: any) {
    return this.repo.save(report);
  }
}
