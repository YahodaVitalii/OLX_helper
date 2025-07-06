export interface ProductServiceInterface {
  create(productId: number, data: unknown): Promise<unknown>;
  update(productId: number, data: unknown): Promise<unknown>;
  findOne(productId: number): Promise<unknown>;
  //generateDescription(productId: number): Promise<string>;
}
