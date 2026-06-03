import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function RootLayout() {
  const { pathname } = useLocation();
  const isAdminOrJudge = pathname.startsWith("/admin") || pathname.startsWith("/judge");

  return (
    <div className="root-layout">
      {!isAdminOrJudge && <Navbar />}
      <div className="content">
        <main>
          <Outlet />
        </main>
      </div>
      {!isAdminOrJudge && <Footer />}
    </div>
  );
}

export default RootLayout;