import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";

const AddProductPage: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<string | File>("");
  const [error, setError] = useState("");

  const validateInputs = () => {
    if (!name || !description || !price || !category || !stock) {
      setError("Wszystkie pola są wymagane.");
      return false;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      setError("Cena musi być liczbą z maksymalnie dwoma miejscami po przecinku.");
      return false;
    }
    if (!/^\d+$/.test(stock)) {
      setError("Stan musi być liczbą całkowitą.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock", stock);
      if (typeof image !== "string") {
        formData.append("image", image);
      }
      await axios.post("http://localhost:8000/product/add/", formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      alert("Dodano produkt.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5">Dodaj nowy produkt</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Nazwa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Opis"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Cena"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Kategoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Stan"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" component="label" sx={{ my: 2 }}>
        Wybierz zdjęcie
        <input
          type="file"
          hidden
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImage(e.target.files[0]);
            }
          }}
        />
      </Button>
      <br />
      <Button variant="contained" onClick={handleSubmit}>
        Dodaj produkt
      </Button>
    </Container>
  );
};

export default AddProductPage;