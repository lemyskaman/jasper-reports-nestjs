
/**
 * Product domain entity
 * This is the core domain entity that represents a product in the business domain.
 * It is completely independent of any infrastructure concerns like databases.
 */
export class Product {
  private _id?: number;
  private _name: string;
  private _price: number;
  private _description?: string;

  constructor(params: {
    id?: number;
    name: string;
    price: number;
    description?: string;
  }) {
    this._id = params.id;
    this._name = params.name;
    this._price = params.price;
    this._description = params.description;
    this.validateProduct();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get description(): string | undefined {
    return this._description;
  }

  // Domain logic and validation
  private validateProduct(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }

    if (this._price < 0) {
      throw new Error('Product price cannot be negative');
    }
  }

  // Domain methods
  updateName(name: string): void {
    this._name = name;
    this.validateProduct();
  }

  updatePrice(price: number): void {
    this._price = price;
    this.validateProduct();
  }

  updateDescription(description?: string): void {
    this._description = description;
  }
}