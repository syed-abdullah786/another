import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <>
      <nav className="w-full bg-blue-400 h-fit overflow-hidden">
        <div className="py-4 lg:px-8 px-4 h-16 m-auto text-white flex items-center justify-between">
          <div>
            <h1 className="lg:text-2xl text-xl uppercase tracking-wider cursor-pointer font-bold">
              Dashboard
            </h1>
          </div>
          <div
            className="flex lg:gap-8 gap-6 uppercase tracking-wider cursor-pointer text-lg items-center"
            id="navItems"
          >
            <Link to="/" className="text-white no-underline">
              <span className="group">
                Home
                <div
                  className={
                    currentPath == "/"
                      ? `w-0 w-full h-0.5 bg-white ease-in-out duration-500`
                      : `w-0 group-hover:w-full h-0.5 bg-white ease-in-out duration-500`
                  }
                ></div>
              </span>
            </Link>
            <Link to="/refresh" className="text-white no-underline">
              <span className="group">
                Refresh
                <div
                  className={
                    currentPath == "/refresh"
                      ? `w-0 w-full h-0.5 bg-white ease-in-out duration-500`
                      : `w-0 group-hover:w-full h-0.5 bg-white ease-in-out duration-500`
                  }
                ></div>
              </span>
            </Link>
            <Link to="/schedule" className="text-white no-underline">
              <span className="group">
                Schedule
                <div
                  className={
                    currentPath == "/schedule"
                      ? `w-0 w-full h-0.5 bg-white ease-in-out duration-500`
                      : `w-0 group-hover:w-full h-0.5 bg-white ease-in-out duration-500`
                  }
                ></div>
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
