import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
} from "@mui/material";

const Cart: React.FC = () => {
  const { cart, removeFromCart, decreaseQuantity, increaseQuantity } =
    useContext(AppContext)!;

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      <List>
        {cart.map((item) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={item.name}
              secondary={`Price: $${item.price} | Quantity: ${
                item.quantity || 1
              }`}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => decreaseQuantity(item.id)}
            >
              Decrease Quantity
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => increaseQuantity(item.id)}
            >
              Increase Quantity
            </Button>
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
    </Container>
  );
};

export default Cart;
