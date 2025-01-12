import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  CardActionArea,
  CardMedia,
} from "@mui/material";
import axios from "axios";

const ProductList: React.FC = () => {
  const { products, user, setProducts, addToCart } = useContext(AppContext)!;
  const [searchTerm, setSearchTerm] = useState<string>(""); // For product name search
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // For category filter

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        console.log("token", token);
        const response = await axios.get("http://localhost:8000/products/", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [setProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setSelectedCategory(e.target.value);
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    return matchesName && matchesCategory;
  });

  // Extract unique categories for dropdown
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>

      {/* Search and Category Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FormControl fullWidth>
          <InputLabel shrink>Filter by Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            displayEmpty
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Product Grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} md={6} lg={4} key={product.id}>
            <Card>
              {/* Klikalna warstwa przenosząca do szczegółów produktu */}
              <CardActionArea component={Link} to={`/product/${product.id}`}>
                {product.image && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={`http://localhost:8000/${product.image}`} // Użyj poprawnej ścieżki do obrazka
                    alt={product.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    Price: ${product.price}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardContent>
                {user && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addToCart(product, 1)}
                  >
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No products message */}
      {filteredProducts.length === 0 && (
        <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          sx={{ mt: 4 }}
        >
          No products match your search.
        </Typography>
      )}
    </Container>
  );
};

export default ProductList;
