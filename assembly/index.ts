import { Product, listedProducts } from "./model";
import { ContractPromiseBatch, context } from "near-sdk-as";

export function setProduct(product: Product): void {
  let storedProduct = listedProducts.get(product.id);
  if (storedProduct !== null) {
    throw new Error(`a product with ${product.id} already exists`);
  }
  listedProducts.set(product.id, Product.fromPayload(product));
}

export function getProduct(id: string): Product | null {
  return listedProducts.get(id);
}

export function getProducts(): Product[] {
  return listedProducts.values();
}

export function buyProduct(productId: string): void {
  const product = getProduct(productId);
  if (product === null) {
    throw new Error(`no product with id ${productId}`);
  }
  if (product.price.toString() != context.attachedDeposit.toString()) {
    throw new Error(`attached deposit is not equal to the price of the product`);
  }
  ContractPromiseBatch.create(product.owner).transfer(context.attachedDeposit);
  product.incrementSoldAmount();
  listedProducts.set(product.id, product);
}
