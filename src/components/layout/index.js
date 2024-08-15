import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";


export default function Layout({ children }) {

  const { pathname } = useLocation();
  const loginRoute = pathname.toLowerCase() === "/forgotpassword" || pathname.toLowerCase() === "/signup" || pathname.toLowerCase() === "/login" || pathname.toLowerCase() === "/";
  const userType = localStorage.getItem("userType");

  return (
    <div>
      {!loginRoute && <Navbar userType={userType} />}
      {children}
      {!loginRoute && <Footer userType={userType} />}
    </div>
  );
}