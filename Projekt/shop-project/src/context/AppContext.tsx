import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  quantity?: number;
  reviews?: Review[];
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
  fetchOrderHistory: () => Promise<any[]>;
  deleteReview: (reviewId: number) => void;
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
      axios
        .get("http://localhost:8000/user/", {
          headers: { Authorization: `Bearer ${storedAccessToken}` },
        })
        .then((response) => {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
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

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        username,
        password,
      });
      const { access, refresh } = response.data;
      setAccessToken(access);
      setRefreshToken(refresh);
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      const userResponse = await axios.get("http://localhost:8000/user/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      const user = userResponse.data;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      const storedCart = localStorage.getItem(`cart_${user.username}`);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Login error:", error);
    }
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

  const fetchOrderHistory = async () => {
    if (!accessToken) {
      console.error("Brak tokenu uwierzytelniającego.");
      return;
    }
    try {
      console.log(accessToken);
      const response = await axios.get("http://localhost:8000/user/orders/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Błąd pobierania historii zamówień:", error);
      return [];
    }
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
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity:
                item.quantity && item.quantity > 1 ? item.quantity - 1 : 1,
            }
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
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
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

  const deleteReview = async (reviewId: number) => {
    if (!accessToken) {
      console.error("Brak tokenu uwierzytelniającego.");
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/review/delete/${reviewId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,
          reviews: product.reviews?.filter((review) => review.id !== reviewId),
        }))
      );
    } catch (error) {
      console.error("Błąd usuwania recenzji:", error);
    }
  };

  const purchaseAll = async () => {
    if (!user || !accessToken) {
      alert("You need to be logged in to make a purchase.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/order/add/",
        {
          user_id: user.id,
          cart: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
        fetchOrderHistory,
        deleteReview,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        purchaseAll,
        user,
        login,
        logout,
        accessToken,
        refreshToken,
        isLoggedIn: () => !!user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
