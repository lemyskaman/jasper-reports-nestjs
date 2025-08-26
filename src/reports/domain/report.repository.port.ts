import { Report } from './report.entity';

/**
 * Report Repository Port (Interface)
 * This is the contract that any report repository implementation must fulfill.
 * It defines the operations that can be performed on the Report domain entity.
 * Following the Dependency Inversion Principle, the domain defines what it needs
 * from the infrastructure layer, not the other way around.
 */
export interface ReportRepositoryPort {
  /**
   * Find all reports
   * @returns Promise resolving to an array of Report domain entities
   */
  findAll(): Promise<Report[]>;

  /**
   * Find a report by its ID
   * @param id The ID of the report to find
   * @returns Promise resolving to the Report domain entity or null if not found
   */
  findById(id: number): Promise<Report | null>;

  /**
   * Save a report
   * @param report The Report domain entity to save
   * @returns Promise resolving to the saved Report domain entity
   */
  save(report: Report): Promise<Report>;

  /**
   * Delete a report
   * @param id The ID of the report to delete
   * @returns Promise resolving to boolean indicating success
   */
  delete(id: number): Promise<boolean>;
}