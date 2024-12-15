import React from "react";
import Produkt from "./Produkt";

const NowyKoszyk: React.FC = () => {
  const produkty = ["Jabłko", "Gruszka", "Pomidor", "Ogórek", "Banany"];

  return (
    <div>
      <h2>Nowy Koszyk</h2>
      {produkty.map((nazwa, index) => (
        <Produkt key={index} nazwa={nazwa} />
      ))}
    </div>
  );
};

export default NowyKoszyk;
