import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import { Outlet } from "react-router-dom";
import { useLocation, useNavigate} from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [endpoint, setEnpoint] = useState("")

  const onNavigate = (endpoint) => {
    navigate(endpoint)
  }

  useEffect(() => {
    const endpoint = currentPath.split('/')[2];
    if(endpoint) {
        setEnpoint(endpoint)
    }
  })

  return (
    <div className="Dashboard">
      <div className="side">
        <div className="side-nav-list">
          <div className="side-nav-item">
            <i className="bi bi-house-gear-fill"></i>
          </div>
          <div className={"side-nav-item " + (endpoint === 'product-management' ? 'nav-item-active' : "") } onClick={() => onNavigate('product-management')}>
            <i className="bi bi-box-fill"></i>
          </div>
          <div className={"side-nav-item " + (endpoint === 'tags-management' ? 'nav-item-active' : "") } onClick={() => onNavigate('tags-management')}>
            <i className="bi bi-tag-fill"></i>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="main-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
