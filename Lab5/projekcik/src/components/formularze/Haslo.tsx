import React, { useState } from "react";

const Haslo: React.FC = () => {
  const [haslo, setHaslo] = useState("");
  const [powtorzHaslo, setPowtorzHaslo] = useState("");

  const getMessage = () => {
    if (!haslo && !powtorzHaslo) return "Proszę wprowadzić hasło";
    if (haslo !== powtorzHaslo) return "Hasła nie są zgodne";
    return "";
  };

  return (
    <div>
      <input
        type="password"
        value={haslo}
        onChange={(e) => setHaslo(e.target.value)}
        placeholder="Hasło"
      />
      <input
        type="password"
        value={powtorzHaslo}
        onChange={(e) => setPowtorzHaslo(e.target.value)}
        placeholder="Powtórz hasło"
      />
      <div>{getMessage()}</div>
    </div>
  );
};

export default Haslo;
