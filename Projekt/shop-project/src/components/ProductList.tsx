import React, { useContext, useEffect, useState } from "react";
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
} from "@mui/material";

const ProductList: React.FC = () => {
  const { products, setProducts, addToCart } = useContext(AppContext)!;
  const [searchTerm, setSearchTerm] = useState<string>(""); // For product name search
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // For category filter

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
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
    <Container>
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
          <InputLabel>Filter by Category</InputLabel>
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
              <CardContent>
                <Typography variant="h5">{product.name}</Typography>
                <Typography>{product.description}</Typography>
                <Typography>Price: ${product.price}</Typography>
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

      {/* No products message */}
      {filteredProducts.length === 0 && (
        <Typography variant="h6" color="textSecondary" align="center">
          No products match your search.
        </Typography>
      )}
    </Container>
  );
};

export default ProductList;
