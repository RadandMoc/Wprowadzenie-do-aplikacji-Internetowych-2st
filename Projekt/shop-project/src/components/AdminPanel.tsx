import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Container, Typography, List, ListItem, ListItemText, Button } from "@mui/material";

const AdminPanel: React.FC = () => {
  const { products, setProducts, user } = useContext(AppContext)!;

  if (user?.role !== "admin") {
    return <Typography>You do not have access to this page.</Typography>;
  }

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <List>
        {products.map((product) => (
          <ListItem key={product.id}>
            <ListItemText primary={product.name} />
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteProduct(product.id)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default AdminPanel;
