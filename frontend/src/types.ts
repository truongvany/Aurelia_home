export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
}

export interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface ChatMessage {
  _id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}
