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
  is_superuser: boolean;
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
    } else if (storedAccessToken) {
      // Jeśli jest token, ale nie ma danych użytkownika, pobierz dane użytkownika
      axios
        .get("http://localhost:8000/user/", {
          headers: { Authorization: `Token ${storedAccessToken}` },
        })
        .then((response) => {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          // Wczytaj istniejący koszyk z localStorage
          const storedCart = localStorage.getItem(
            `cart_${response.data.username}`
          );
          if (storedCart) {
            setCart(JSON.parse(storedCart));
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          logout();
        });
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
            // Wczytaj istniejący koszyk z localStorage
            const storedCart = localStorage.getItem(
              `cart_${userResponse.data.username}`
            );
            if (storedCart) {
              setCart(JSON.parse(storedCart));
            }
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
        alert("Not enough stock available");
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: updatedQuantity }
            : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity && item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  const increaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: (item.quantity || 0) + 1 }
          : item
      )
    );
  };

  const addReview = async (productId: number, review: Review) => {
    if (!accessToken) {
      console.error("Brak tokenu uwierzytelniającego.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/review/add/",
        {
          product_id: productId,
          username: review.username,
          rating: review.rating,
          comment: review.comment,
          date: review.date,
        },
        {
          headers: { Authorization: `Token ${accessToken}` },
        }
      );
      // Aktualizujemy lokalnie (lub można wywołać GET, by pobrać świeże dane)
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId
            ? {
                ...p,
                reviews: [...(p.reviews || []), review],
              }
            : p
        )
      );
    } catch (error) {
      console.error("Błąd dodawania recenzji:", error);
    }
  };

  const purchaseAll = async () => {
    if (!user || !accessToken) {
      alert("You need to be logged in to make a purchase.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8000/order/addAll/",
        {
          user_id: user.id,
          cart: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        alert("Purchase successful!");
        setCart([]);
      }
    } catch (error) {
      console.error("Error making purchase:", error);
      alert("Failed to make purchase. Please try again.");
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
