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

interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addReview, addToCart } = useContext(AppContext)!;
  const [product, setProduct] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/products/${id}/`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Error fetching product details:", error));
  }, [id]);

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
      username: "current_user", // Tutaj można użyć danych zalogowanego użytkownika
      rating,
      comment,
      date: new Date().toISOString(),
    };

    addReview(product.id, newReview);
    setComment("");
    setRating(5);
    setError("");
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
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
              <Typography>
                <strong>{review.username}</strong> - {review.date}
              </Typography>
              <Rating value={review.rating} readOnly />
              <Typography>{review.comment}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No reviews yet.</Typography>
        )}
      </Box>

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
        <Typography variant="h6" gutterBottom>
          Product stock: {product.stock}
        </Typography>
        <TextField
          label="Quantity"
          fullWidth
          value={quantity}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value > remainingStock) {
              alert(`Cannot add more than ${remainingStock} of this product.`);
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
      </Box>
    </Container>
  );
};

export default ProductDetails;
