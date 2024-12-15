import React, { useState } from "react";

interface User {
  id: number;
  username: string;
  fullName: string;
}

interface KomentarzProps {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: User;
}

const Komentarz: React.FC<KomentarzProps> = ({ body, likes, user }) => {
  const [likeCount, setLikeCount] = useState(likes);

  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
      <h4>{user.fullName} (@{user.username})</h4>
      <p>{body}</p>
      <div>
        <button onClick={() => setLikeCount((prev) => prev + 1)}>👍</button>
        <button onClick={() => setLikeCount((prev) => Math.max(prev - 1, 0))}>👎</button>
        <span> Likes: {likeCount}</span>
      </div>
    </div>
  );
};

export default Komentarz;
