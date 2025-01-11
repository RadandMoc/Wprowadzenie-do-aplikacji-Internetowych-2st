import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
} from "@mui/material";

interface Order {
  id: number;
  product: string;
  quantity: number;
  order_date: number;
}

type OrderGroup = Order[];

const OrderHistory: React.FC = () => {
  const { fetchOrderHistory } = useContext(AppContext)!;

  // Ponieważ mamy wiele grup, a każda grupa to tablica obiektów Order
  const [groupedOrders, setGroupedOrders] = useState<OrderGroup[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);

  useEffect(() => {
    const getOrderHistory = async () => {
      const orderHistory = await fetchOrderHistory();
      // Załóżmy, że backend zwraca tablicę tablic (czyli OrderGroup[])
      setGroupedOrders(orderHistory);
    };

    getOrderHistory();
  }, [fetchOrderHistory]);

  const handleToggleGroup = (index: number) => {
    setExpandedGroup(expandedGroup === index ? null : index);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>
      {groupedOrders.length > 0 ? (
        (console.log(groupedOrders),
        (
          <List>
            {groupedOrders.map((group, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                {}
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleToggleGroup(index)}>
                    <ListItemText
                      primary={`Order #${index + 1}`}
                      secondary={
                        group.length > 0
                          ? `Date: ${group[0].order_date}`
                          : "No orders in this group"
                      }
                    />
                  </ListItemButton>
                </ListItem>

                <Collapse
                  in={expandedGroup === index}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {/* tu już TS wie, że order to typ Order */}
                    {group.map((order) => (
                      <ListItem key={order.id} sx={{ pl: 4 }}>
                        <ListItemText
                          primary={`Product: ${order.product}`}
                          secondary={`Quantity: ${order.quantity}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ))}
          </List>
        ))
      ) : (
        <Typography>No orders found.</Typography>
      )}
    </Container>
  );
};

export default OrderHistory;
