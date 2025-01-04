import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Container, TextField, Button, Typography } from "@mui/material";

const Login: React.FC = () => {
  const { login, logout, isLoggedIn, user } = useContext(AppContext)!;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (username && password) {
      login(username, password);
      setError(null);
    } else {
      setError("Please enter both username and password.");
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {isLoggedIn() ? `Welcome, ${user?.username}` : "Login"}
      </Typography>
      {isLoggedIn() ? (
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </>
      )}
    </Container>
  );
};

export default Login;
