import React, { useState, useEffect } from "react";

const Odliczanie: React.FC = () => {
  const [czas, setCzas] = useState(15.0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && czas > 0) {
      interval = setInterval(() => {
        setCzas((prev) => Math.max(prev - 0.1, 0));
      }, 100);
    } else if (czas === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, czas]);

  return (
    <div>
      <div>{czas.toFixed(1)} sek</div>
      <button
        onClick={() => setIsRunning((prev) => !prev)}
        disabled={czas === 0}
      >
        {czas === 0 ? "Odliczanie zakończone" : isRunning ? "STOP" : "START"}
      </button>
    </div>
  );
};

export default Odliczanie;
