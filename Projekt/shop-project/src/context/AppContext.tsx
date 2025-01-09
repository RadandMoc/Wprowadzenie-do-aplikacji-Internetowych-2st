import React, { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

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
  id: number;
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
  decreaseQuantity: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  purchaseAll: () => void;
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: () => boolean;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedUser && storedAccessToken && storedRefreshToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      const storedCart = localStorage.getItem(
        `cart_${JSON.parse(storedUser).username}`
      );
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const login = (username: string, password: string) => {
    axios
      .post("http://localhost:8000/login/", { username, password })
      .then((response) => {
        const { token } = response.data;
        setAccessToken(token);
        localStorage.setItem("accessToken", token);
        // Pobierz dane użytkownika z bazy danych
        axios
          .get("http://localhost:8000/user/", {
            headers: { Authorization: `Token ${token}` },
          })
          .then((userResponse) => {
            setUser(userResponse.data);
            localStorage.setItem("user", JSON.stringify(userResponse.data));
          });
      })
      .catch((error) => {
        alert("Invalid credentials");
      });
  };

  const logout = () => {
    if (user) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setCart([]);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const isLoggedIn = () => {
    return user !== null && accessToken !== null;
  };

  const addToCart = (product: Product, quantity: number) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      const updatedQuantity = (existingProduct.quantity || 0) + quantity;

      if (updatedQuantity > product.stock) {
        alert(`Cannot add more than ${product.stock} of this product.`);
        return;
      }

      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, quantity: updatedQuantity } : item
        )
      );
    } else {
      if (quantity > product.stock) {
        alert(`Cannot add more than ${product.stock} of this product.`);
        return;
      }

      setCart((prev) => [...prev, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && (item.quantity || 1) > 1
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
    );
  };

  const increaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && (item.quantity || 1) < item.stock
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
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

  const purchaseAll = async () => {
    if (!user) {
      alert("You need to be logged in to make a purchase.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/order/addAll/", {
        user_id: user.id,
        cart: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });
      setCart([]);
      alert("Purchase successful!");
    } catch (error) {
      console.error("Error purchasing items:", error);
      alert("There was an error processing your purchase.");
    }
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
        decreaseQuantity,
        increaseQuantity,
        purchaseAll,
        user,
        login,
        logout,
        accessToken,
        refreshToken,
        isLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
