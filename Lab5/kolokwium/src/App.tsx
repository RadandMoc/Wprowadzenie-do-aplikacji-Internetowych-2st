import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ShapesList from "./components/ShapesList";
import ShapeDetails from "./components/ShapeDetails";
import { v4 as uuidv4 } from "uuid";

interface Shape {
  id: string;
  type: "Square" | "Rectangle" | "Circle";
}

const App: React.FC = () => {
  const [shapes, setShapes] = useState<Shape[]>([
    { id: uuidv4(), type: "Square" },
    { id: uuidv4(), type: "Rectangle" },
    { id: uuidv4(), type: "Circle" },
  ]);

  return (
    <Router>
      <div>
        <h1>Shape Manager</h1>
        <Routes>
          <Route
            path="/"
            element={<ShapesList shapes={shapes} setShapes={setShapes} />}
          />
          <Route
            path="/details/:id"
            element={<ShapeDetails shapes={shapes} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
