import React, { useContext, useState } from "react";
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

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addReview } = useContext(AppContext)!;

  const product = products.find((p) => p.id === Number(id));

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [error, setError] = useState("");

  if (!product) {
    return <Typography>Product not found.</Typography>;
  }

  const handleAddReview = () => {
    if (!comment.trim() || !rating) {
      setError("Please provide both a rating and a comment.");
      return;
    }

    const newReview = {
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
            src={product.image}
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
          product.reviews.map((review) => (
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
      </Box>
    </Container>
  );
};

export default ProductDetails;
