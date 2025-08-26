/**
 * Report domain entity
 * This is the core domain entity that represents a report in the business domain.
 * It is completely independent of any infrastructure concerns like databases.
 */
export class Report {
  private _id?: number;
  private _filename: string;
  private _originalname: string;
  private _uploadedAt: Date;

  constructor(params: {
    id?: number;
    filename: string;
    originalname: string;
    uploadedAt?: Date;
  }) {
    this._id = params.id;
    this._filename = params.filename;
    this._originalname = params.originalname;
    this._uploadedAt = params.uploadedAt || new Date();
    this.validateReport();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get filename(): string {
    return this._filename;
  }

  get originalname(): string {
    return this._originalname;
  }

  get uploadedAt(): Date {
    return this._uploadedAt;
  }

  // Domain logic and validation
  private validateReport(): void {
    if (!this._filename || this._filename.trim().length === 0) {
      throw new Error('Report filename cannot be empty');
    }

    if (!this._originalname || this._originalname.trim().length === 0) {
      throw new Error('Report original name cannot be empty');
    }
  }

  // Domain methods
  updateFilename(filename: string): void {
    this._filename = filename;
    this.validateReport();
  }

  updateOriginalname(originalname: string): void {
    this._originalname = originalname;
    this.validateReport();
  }
}
