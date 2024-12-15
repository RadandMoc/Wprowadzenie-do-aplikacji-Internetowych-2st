import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddArticle: React.FC<{ setArticles: React.Dispatch<React.SetStateAction<any[]>> }> = ({ setArticles }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleAddArticle = () => {
    const newArticle = { id: Date.now(), title, content };

    // Pobranie obecnych artykułów i dodanie nowego
    const currentArticles = JSON.parse(localStorage.getItem("articles") || "[]");
    const updatedArticles = [...currentArticles, newArticle];
    
    // Zapisz nowe artykuły w localStorage
    localStorage.setItem("articles", JSON.stringify(updatedArticles));

    // Zaktualizowanie stanu w aplikacji
    setArticles(updatedArticles);

    // Przekierowanie do bloga
    navigate("/blog");
  };

  return (
    <div>
      <h2>Dodaj artykuł</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tytuł artykułu"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Treść artykułu"
      />
      <button onClick={handleAddArticle}>Dodaj artykuł</button>
    </div>
  );
};

export default AddArticle;
