import { Product } from './product.entity';

/**
 * Product Repository Port (Interface)
 * This is the contract that any product repository implementation must fulfill.
 * It defines the operations that can be performed on the Product domain entity.
 * Following the Dependency Inversion Principle, the domain defines what it needs
 * from the infrastructure layer, not the other way around.
 */
export interface ProductRepositoryPort {
  /**
   * Find all products
   * @returns Promise resolving to an array of Product domain entities
   */
  findAll(): Promise<Product[]>;

  /**
   * Find a product by its ID
   * @param id The ID of the product to find
   * @returns Promise resolving to the Product domain entity or null if not found
   */
  findById(id: number): Promise<Product | null>;

  /**
   * Save a product
   * @param product The Product domain entity to save
   * @returns Promise resolving to the saved Product domain entity
   */
  save(product: Product): Promise<Product>;

  /**
   * Delete a product
   * @param id The ID of the product to delete
   * @returns Promise resolving to boolean indicating success
   */
  delete(id: number): Promise<boolean>;
}