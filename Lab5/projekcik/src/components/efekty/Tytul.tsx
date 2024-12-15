import React, { useState, useEffect } from "react";

const Tytul: React.FC = () => {
  const [tytul, setTytul] = useState("");

  useEffect(() => {
    document.title = tytul;
  }, [tytul]);

  return (
    <div>
      <input
        type="text"
        value={tytul}
        onChange={(e) => setTytul(e.target.value)}
        placeholder="Wpisz tytuł strony"
      />
    </div>
  );
};

export default Tytul;
