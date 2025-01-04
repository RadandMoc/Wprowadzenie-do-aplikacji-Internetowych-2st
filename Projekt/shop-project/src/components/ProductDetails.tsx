import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Container, Typography, Button } from "@mui/material";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useContext(AppContext)!;

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <Typography>Product not found</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4">{product.name}</Typography>
      <Typography>{product.description}</Typography>
      <Typography>Price: ${product.price}</Typography>
      <Typography>Stock: {product.stock}</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => addToCart(product, 1)}
      >
        Add to Cart
      </Button>
    </Container>
  );
};

export default ProductDetails;
