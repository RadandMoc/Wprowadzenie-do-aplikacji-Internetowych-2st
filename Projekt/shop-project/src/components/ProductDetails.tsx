import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Rating,
} from "@mui/material";
import axios from "axios";

interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addReview, addToCart, deleteReview, user } = useContext(AppContext)!;
  const [product, setProduct] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editingRating, setEditingRating] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/products/${id}/`);
        const productData = await response.json();
        setProduct(productData);

        const accessToken = localStorage.getItem("accessToken");
        if (user && accessToken) {
          const purchaseResponse = await axios.get(
            `http://localhost:8000/product/${id}/has_purchased/`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          console.log(purchaseResponse.data.hasPurchased);
          setHasPurchased(purchaseResponse.data.hasPurchased);
        }

        if (user) {
          const userReview = productData.reviews.find(
            (review: any) => review.username === user.username
          );
          setHasReviewed(!!userReview);
        }
      } catch (error) {
        console.error(
          "Error fetching product or checking purchase status:",
          error
        );
      }
    };

    fetchData();
  }, [id, user]);

  if (!product) {
    return <Typography>Product not found.</Typography>;
  }

  const handleAddReview = () => {
    if (!comment.trim() || !rating) {
      setError("Please provide both a rating and a comment.");
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      username: user?.username || "Guest",
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };

    addReview(product.id, newReview);

    // Następnie aktualizujemy lokalnie listę recenzji, żeby natychmiast wyświetlić nowy komentarz:
    setProduct({
      ...product,
      reviews: [...product.reviews, newReview], // dołączamy nowy review
    });

    // Resetujemy formularz
    setComment("");
    setRating(5);
    setError("");

    // Po pomyślnym dodaniu recenzji
    window.location.reload();
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleDeleteReview = (reviewId: number) => {
    deleteReview(reviewId);

    setProduct((prevProduct: any) => ({
      ...prevProduct,
      reviews: prevProduct.reviews.filter(
        (review: Review) => review.id !== reviewId
      ),
    }));

    // Po pomyślnym dodaniu recenzji
    window.location.reload();
  };

  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setEditingRating(review.rating);
    setEditingComment(review.comment);
  };

  const handleUpdateReview = async (reviewId: number) => {
    try {
      // przykładowy PUT do backendu (endpoint wg dodanego widoku UpdateReview)
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:8000/review/update/${reviewId}/`,
        { rating: editingRating, comment: editingComment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      window.location.reload();
    } catch (error) {
      console.error("Review update error:", error);
    }
  };

  const remainingStock = product.stock - (product.quantity || 0);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Price: ${product.price}
      </Typography>

      {product.image && (
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <img
            src={`http://localhost:8000/media/${product.image}`}
            alt={product.name}
            style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
          />
        </Box>
      )}

      <Typography variant="body1" gutterBottom>
        {product.description}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Reviews</Typography>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review: Review) => (
            <Box key={review.id} sx={{ mb: 2, p: 2, border: "1px solid #ddd" }}>
              {editingReviewId === review.id ? (
                <>
                  <Rating
                    value={editingRating}
                    onChange={(_, newValue) => setEditingRating(newValue)}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={editingComment}
                    onChange={(e) => setEditingComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleUpdateReview(review.id)}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Typography>
                    <strong>{review.username}</strong> - {review.date}
                  </Typography>
                  <Rating value={review.rating} readOnly />
                  <Typography>{review.comment}</Typography>
                  {/* Admin edytuje tylko własne opinie; usuwać może dalej wszystko */}
                  {user && user.username === review.username && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditReview(review)}
                    >
                      Edit
                    </Button>
                  )}
                  {(user?.is_superuser ||
                    user?.username === review.username) && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete
                    </Button>
                  )}
                </>
              )}
            </Box>
          ))
        ) : (
          <Typography>No reviews yet.</Typography>
        )}
      </Box>

      {hasPurchased && !hasReviewed && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Add a Review</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleAddReview}>
            Submit Review
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Product stock: {product.stock}
        </Typography>

        {user && (
          <>
            <TextField
              label="Quantity"
              fullWidth
              value={quantity}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > remainingStock) {
                  alert(
                    `Cannot add more than ${remainingStock} of this product.`
                  );
                  return;
                }
                setQuantity(value);
              }}
              type="number"
              sx={{ mb: 2 }}
              InputProps={{
                inputProps: { min: 0 },
                sx: {
                  "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                    display: "none",
                  },
                  "input[type=number]": {
                    MozAppearance: "textfield",
                  },
                },
              }}
            />
            <Button variant="contained" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetails;
