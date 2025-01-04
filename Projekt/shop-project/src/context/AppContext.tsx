import React, { createContext, useState, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  quantity?: number;
}

interface User {
  username: string;
  role: "admin" | "user";
}

interface AppContextProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: Product[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  user: User | null;
  login: (username: string, password: string) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string) => {};

  const addToCart = (product: Product, quantity: number) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      // Jeśli produkt już jest w koszyku, zwiększ jego ilość
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + quantity }
            : item
        )
      );
    } else {
      // Jeśli produkt jest nowy, dodaj go z ilością
      setCart((prev) => [...prev, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        user,
        login,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
