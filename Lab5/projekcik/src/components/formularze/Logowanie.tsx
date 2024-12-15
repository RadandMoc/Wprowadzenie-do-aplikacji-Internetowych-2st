import React, { useState } from "react";

const Logowanie: React.FC = () => {
  const [haslo, setHaslo] = useState("");
  const [powtorzHaslo, setPowtorzHaslo] = useState("");
  const [uzytkownik, setUzytkownik] = useState("");

  const isButtonDisabled = () => {
    return !uzytkownik || !haslo || !powtorzHaslo;
  };

  const handleLogin = () => {
    if (haslo !== powtorzHaslo) {
      alert("Hasła nie są zgodne");
    } else {
      alert("Zalogowano poprawnie");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={uzytkownik}
        onChange={(e) => setUzytkownik(e.target.value)}
        placeholder="Nazwa użytkownika"
      />
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
      <button disabled={isButtonDisabled()} onClick={handleLogin}>
        Logowanie
      </button>
    </div>
  );
};

export default Logowanie;
