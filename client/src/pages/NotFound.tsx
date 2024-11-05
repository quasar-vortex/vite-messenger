import React from "react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="flex-1 flex flex-col items-center justify-center">
      <div>
        <h2 className="text-4xl mb-4">Page Not Found</h2>
        <div className="flex gap-4 items-center">
          <NavLink className="btn btn-outline" to="/dash">
            Dash
          </NavLink>
          <NavLink className="btn btn-outline" to="/">
            Login
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
