import React, { useState } from "react";
import Przycisk from "./Przycisk";

const NowyLicznik: React.FC = () => {
  const [licznik, setLicznik] = useState(0);

  return (
    <div>
      <h2>Licznik: {licznik}</h2>
      <Przycisk onClick={() => setLicznik(licznik + 1)} />
    </div>
  );
};

export default NowyLicznik;
