import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define el tipo para el producto
interface Product {
  id: number; // El id es un número (int)
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string; // Este campo es opcional, ya que mencionaste que no tienes imágenes por ahora
}

// Define el tipo para el contexto del carrito
interface CartContextType {
  cart: Product[]; // Un arreglo de productos en el carrito
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  cartCount: number; // Este es el contador de productos en el carrito
}


const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  //AGREGAR PRODUCTO AL CARRITO
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, stock: item.stock + 1 } // Incrementa el stock si el producto ya está en el carrito
            : item
        );
      }
      return [...prevCart, { ...product, stock: 1 }]; // Si el producto no está en el carrito, lo agrega con un stock inicial de 1
    });
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Función para limpiar el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Función para obtener el total del carrito
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.stock, 0);
  };

  // Función para contar los productos en el carrito
  const cartCount = cart.reduce((count, item) => count + item.stock, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
