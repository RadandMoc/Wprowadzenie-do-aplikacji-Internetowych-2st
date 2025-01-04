import React from "react";
import { useParams, Link } from "react-router-dom";

interface Shape {
  id: string;
  type: "Square" | "Rectangle" | "Circle";
}

interface Props {
  shapes: Shape[];
}

const ShapeDetails: React.FC<Props> = ({ shapes }) => {
  const { id } = useParams();
  const shape = shapes.find(shape => shape.id === id);

  if (!shape) {
    return (
      <div>
        <h2>Błąd</h2>
        <p>Nie znaleziono kształtu o ID: {id}</p>
        <Link to="/">Powrót do listy</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Szczegóły kształtu</h2>
      <p>ID: {shape.id}</p>
      <p>Rodzaj: {shape.type}</p>
      <div
        style={{
          width: "100px",
          height: shape.type === "Rectangle" ? "60px" : "100px",
          borderRadius: shape.type === "Circle" ? "50%" : "0",
          backgroundColor: "lightblue",
        }}
      ></div>
      <Link to="/">Powrót do listy</Link>
    </div>
  );
};

export default ShapeDetails;
