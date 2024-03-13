import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.scss";
import axios from "axios";
import AuthAPI from "../../apis/Auth/AuthAPI";

const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async () => {
    if (username && password) {
      var Login_User_Result = await AuthAPI.login(username, password)
      if(Login_User_Result.success) {
        localStorage.setItem("DONGGUITAR_JWT_ACCESS_TOKEN", Login_User_Result.accessToken);
        localStorage.setItem("DONGGUITAR_JWT_REFRESH_TOKEN", Login_User_Result.refreshToken);
        navigate(`/`);
      }
      // var result = await axios.post("http://localhost:4000/api/auth/login", {
      //   username: username,
      //   password: password,
      // });
      // if (result.data.success) {
      //   console.log("Login result", result);
      //   
      //   
      // }
    } else {
      alert("Vui lòng điền đầy đủ thông tin đăng nhập !");
    }
  };

  const handleChange = (event) => {
    if (event.target.name === "username") setUsername(event.target.value);
    if (event.target.name === "password") setPassword(event.target.value);
  };

  return (
    <div className="Login">
      <div className="login-container">
        <div className="left-content">
          <h1>Have a nice day !</h1>
          <div className="gif">
            <img src="https://media0.giphy.com/media/xTiTnnnWvRXTeXx3wc/source.gif" />
          </div>
        </div>

        <div className="login-form">
          <h2 className="underline-title">LOGIN ADMIN</h2>
          <div className="field-login">
            <p>Username</p>
            <input
              type="text"
              name="username"
              onChange={(event) => handleChange(event)}
            />
          </div>
          <div className="field-login">
            <p>Password</p>
            <input
              type="password"
              name="password"
              onChange={(event) => handleChange(event)}
            />
          </div>
          <div className="btn-login">
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
