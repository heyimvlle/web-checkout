export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_filename: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}
