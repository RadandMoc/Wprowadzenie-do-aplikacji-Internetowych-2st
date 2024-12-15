import React, { useState } from "react";

const Licznik: React.FC = () => {
  const [licznik, setLicznik] = useState(0);

  return (
    <div>
      <h2>Licznik: {licznik}</h2>
      <button onClick={() => setLicznik(licznik + 1)}>Dodaj</button>
    </div>
  );
};

export default Licznik;
