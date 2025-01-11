import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const OrderHistory: React.FC = () => {
  const { fetchOrderHistory } = useContext(AppContext)!;
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const getOrderHistory = async () => {
      const orderHistory = await fetchOrderHistory();
      setOrders(orderHistory);
    };

    getOrderHistory();
  }, [fetchOrderHistory]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>
      {orders.length > 0 ? (
        <List>
          {orders.map((order) => (
            <ListItem key={order.id}>
              <ListItemText
                primary={`Product: ${order.product}`}
                secondary={`Quantity: ${order.quantity} - Date: ${order.date}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No orders found.</Typography>
      )}
    </Container>
  );
};

export default OrderHistory;
