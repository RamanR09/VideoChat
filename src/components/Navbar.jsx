import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-gray-800 p-4 text-white flex justify-between">
    <h1 className="text-xl font-bold">Video Chat App</h1>
    <div>
      <Link className="mx-2" to="/">
        Home
      </Link>
      <Link className="mx-2" to="/join">
        Join Room
      </Link>
    </div>
  </nav>
);

export default Navbar;
