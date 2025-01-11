import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Header: React.FC = () => {
  const { user } = useContext(AppContext)!;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Shop
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {user && (
          <Button color="inherit" component={Link} to="/orderHistory">
            Order History
          </Button>
        )}
        {user && (
          <Button color="inherit" component={Link} to="/cart">
            Cart
          </Button>
        )}
        
        <Button color="inherit" component={Link} to="/login">
          {user ? "Logout" : "Login"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
