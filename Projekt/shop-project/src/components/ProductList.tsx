import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";

const ProductList: React.FC = () => {
  const { products, setProducts, addToCart } = useContext(AppContext)!;

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [setProducts]);

  return (
    <Container>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} md={6} lg={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{product.name}</Typography>
                <Typography>{product.description}</Typography>
                <Typography>${product.price}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addToCart(product, 1)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
