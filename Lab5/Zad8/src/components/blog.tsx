import React from "react";
import { Link } from "react-router-dom";

const Blog: React.FC<{ articles: any[] }> = ({ articles }) => {
  return (
    <div>
      <h2>Blog</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <Link to={`/article/${article.id}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
      <Link to="/dodaj">Dodaj nowy artykuł</Link>
      <br />
      {/* Link do powrotu do strony głównej (licznika) */}
      <Link to="/">Powrót do licznika</Link>
    </div>
  );
};

export default Blog;
