import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

interface Shape {
  id: string;
  type: "Square" | "Rectangle" | "Circle";
}

interface Props {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
}

const ShapesList: React.FC<Props> = ({ shapes, setShapes }) => {
  const [filter, setFilter] = useState<string>("");

  const addShape = (type: "Square" | "Rectangle" | "Circle") => {
    setShapes([...shapes, { id: uuidv4(), type }]);
  };

  const removeShape = (id: string) => {
    setShapes(shapes.filter(shape => shape.id !== id));
  };

  const filteredShapes = filter
    ? shapes.filter(shape => shape.type === filter)
    : shapes;

  return (
    <div>
      <div>
        <button onClick={() => addShape("Square")}>Dodaj kwadrat</button>
        <button onClick={() => addShape("Rectangle")}>Dodaj prostokąt</button>
        <button onClick={() => addShape("Circle")}>Dodaj koło</button>
      </div>

      <div>
        <label>
          Filtruj kształty:
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">Wszystkie</option>
            <option value="Square">Kwadraty</option>
            <option value="Rectangle">Prostokąty</option>
            <option value="Circle">Koła</option>
          </select>
        </label>
      </div>

      <ul>
        {filteredShapes.map(shape => (
          <motion.li
            key={shape.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            style={{ margin: "10px 0" }}
          >
            <div
              style={{
                width: "50px",
                height: shape.type === "Rectangle" ? "30px" : "50px",
                borderRadius: shape.type === "Circle" ? "50%" : "0",
                backgroundColor: "lightblue",
              }}
            ></div>
            <div>Rodzaj: {shape.type}</div>
            <div>
              <Link to={`/details/${shape.id}`}>Szczegóły</Link>
            </div>
            <button onClick={() => removeShape(shape.id)}>Usuń</button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default ShapesList;
