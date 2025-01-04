import React, { createContext, useState, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  quantity?: number; // Ilość produktu w koszyku (opcjonalne)
  reviews?: Review[]; // Tablica recenzji (opcjonalna)
}

interface Review {
  id: number;
  username: string;
  comment: string;
  rating: number;
  date: string;
}

interface User {
  username: string;
  password: string;
  role: "admin" | "user";
}

interface AppContextProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: Product[];
  addToCart: (product: Product, quantity: number) => void;
  addReview: (productId: number, review: Review) => void;
  removeFromCart: (productId: number) => void;
  user: User | null;
  login: (username: string, password: string) => void;
  accessToken: string | null;
  refreshToken: string | null;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const login = (username: string, password: string) => {
    fetch("/data/users.json")
      .then((res) => res.json())
      .then((users) => {
        const foundUser = users.find(
          (u: User) => u.username === username && u.password === password
        );
        if (foundUser) {
          setUser(foundUser);
          // Symulacja generowania tokenów
          setAccessToken("fakeAccessToken123");
          setRefreshToken("fakeRefreshToken456");
        } else {
          alert("Invalid credentials");
        }
      });
  };

  const addToCart = (product: Product, quantity: number) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + quantity }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const addReview = (productId: number, review: Review) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              reviews: product.reviews
                ? [...product.reviews, review]
                : [review],
            }
          : product
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        cart,
        addToCart,
        addReview,
        removeFromCart,
        user,
        login,
        accessToken,
        refreshToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;