import React from "react";

interface PrzyciskProps {
  onClick: () => void;
}

const Przycisk: React.FC<PrzyciskProps> = ({ onClick }) => {
  return <button onClick={onClick}>Dodaj</button>;
};

export default Przycisk;
