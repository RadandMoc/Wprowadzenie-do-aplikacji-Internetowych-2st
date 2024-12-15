import React, { useState, useEffect } from "react";

const Licznik: React.FC = () => {
  const [licznik, setLicznik] = useState(0);

  useEffect(() => {
    console.log(`Licznik zwiększył się do ${licznik}`);
  }, [licznik]);

  useEffect(() => {
    console.log("Hello world");
  }, []);

  return (
    <div>
      <h2>Licznik: {licznik}</h2>
      <button onClick={() => setLicznik(licznik + 1)}>Dodaj</button>
    </div>
  );
};

export default Licznik;
