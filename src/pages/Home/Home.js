import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";

const Home = () => {
  const navigate = useNavigate();


  const navigateToDashboard = () => {
    navigate('/dashboard/product-management')
  }

  return (
    <div className="Home">
      <div className="home-container">
        <h2>Login success !</h2>
        <h1>Wellcome Admin</h1>
        <div className="title">
          <p>Trang quản trị thuộc sở hữu của <span>dongguitar.com</span></p>
        </div>
        <div className="button" onClick={() => navigateToDashboard()}>
          <button>Tới trang quản lý</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
