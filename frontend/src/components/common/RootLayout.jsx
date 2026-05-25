import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

/* Hides Navbar on pages that don't' have "/admin" or "/judge", those pages show the Sidebar instead */
function renderNavigation(){
  const path = window.location.pathname;
  if (path.startsWith("/admin/") || path.startsWith("/judge/")) {
    return null;
  } else {
    return <Navbar />;
  }
}

/* Hides footer when the Sidebar is visible */
function shouldShowFooter() {
  const path = window.location.pathname;
  return !(path.startsWith("/admin/") || path.startsWith("/judge/"));
}

function RootLayout() {

  return (
    <div className="root-layout">
      {renderNavigation()}
      <div className="content">
        <main>
          <Outlet />
        </main>
      </div>
      {shouldShowFooter() && <Footer />}
    </div>
  );
}

export default RootLayout;