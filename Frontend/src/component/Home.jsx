import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-darkblue h-[100vh] w-full">
      <div>Home</div>
      <button onClick={() => navigate("/signin")}>signin</button>
    </div>
  );
};

export default Home;
