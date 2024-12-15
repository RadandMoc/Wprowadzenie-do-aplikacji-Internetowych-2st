import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import { useEffect, useState } from "react";
import Licznik from './components/Licznik';
import Blog from './components/blog';
import Article from './components/Article';
import AddArticle from './components/AddArticle';

function App() {

  // Przechowywanie artykułów w stanie lokalnym
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    // Wczytanie artykułów z localStorage
    const existingArticles = localStorage.getItem("articles");
    if (existingArticles) {
      setArticles(JSON.parse(existingArticles));
    } else {
      const sampleArticles = [
        { id: 1, title: "Przykładowy artykuł 1", content: "Treść pierwszego artykułu." },
        { id: 2, title: "Przykładowy artykuł 2", content: "Treść drugiego artykułu." },
        { id: 3, title: "Przykładowy artykuł 3", content: "Treść trzeciego artykułu." }
      ];
      localStorage.setItem("articles", JSON.stringify(sampleArticles));
      setArticles(sampleArticles);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <h1>Moja Aplikacja</h1>
        <nav>
          <Link to="/blog">Przejdź do bloga</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Licznik />} />
          <Route path="/blog" element={<Blog articles={articles} />} />
          <Route path="/article/:id" element={<Article articles={articles} />} />
          <Route path="/dodaj" element={<AddArticle setArticles={setArticles} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
