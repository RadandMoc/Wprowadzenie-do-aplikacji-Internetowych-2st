import React from "react";

interface ProduktProps {
  nazwa: string;
}

const Produkt: React.FC<ProduktProps> = ({ nazwa }) => {
  return <div>{nazwa}</div>;
};

export default Produkt;
