import React, { useState, useEffect } from "react";

const Licznik: React.FC = () => {
  // Odczytanie stanu z localStorage lub ustawienie domyślnej wartości
  const storedCount = localStorage.getItem("count");
  const initialCount = storedCount ? parseInt(storedCount, 10) : 0;

  const [licznik, setLicznik] = useState(initialCount);

  // Zapis stanu do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem("count", licznik.toString());
  }, [licznik]);

  return (
    <div>
      <h2>Licznik: {licznik}</h2>
      <button onClick={() => setLicznik(licznik + 1)}>Dodaj</button>
    </div>
  );
};

export default Licznik;
