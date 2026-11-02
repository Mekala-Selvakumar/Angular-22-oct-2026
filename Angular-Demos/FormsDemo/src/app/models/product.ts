export interface Product {
    id: number;
    name: string;
    sku?: string;
    category: string;
    price: number;
    stockQuantity: number;
}

export type ProductDraft = Omit<Product, 'id'>;