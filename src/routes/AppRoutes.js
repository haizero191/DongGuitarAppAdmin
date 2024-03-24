import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import Product_M from "../component/Product_M/Product_M";
import Home_S from "../component/Home_S/Home_S";
import Tags_M from "../component/Tags_M/Tags_M";
import AuthAPI from "../apis/Auth/AuthAPI";
import Order_M from "../component/Order_M/Order_M";
import Home from "../pages/Home/Home";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await AuthAPI.checkAuth();
      if (response.success) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    fetchData();
  });

  if (isAuthenticated === null) {
    return <></>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return <Outlet />; // Render protected content if authenticated
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Router */}
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Home/>}/>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="dashboard" element={<Dashboard />}>
          <Route path="home-setting" element={<Home_S />} />
          {/* <Route path="order-management" element={<Order_M />} /> */}
          <Route path="product-management" element={<Product_M />} />
          <Route path="tags-management" element={<Tags_M />} />
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
     
    </Routes>
  );
};

export default AppRoutes;
