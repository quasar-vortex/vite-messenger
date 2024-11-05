import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-zinc-200 p-6">
      <div className="container max-w-7xl mx-auto flex flex-col gap-4 items-center sm:flex-row justify-between mb-4">
        <div>
          <NavLink
            className="text-lg font-bold hover:text-zinc-700 text-zinc-900 duration-200"
            to="/"
          >
            Vite Messenger
          </NavLink>
        </div>
        <ul className="flex gap-4 flex-col sm:flex-row">
          <NavLink className="hover:underline" to="/">
            Home
          </NavLink>
          <NavLink className="hover:underline" to="/login">
            Login
          </NavLink>
          <NavLink className="hover:underline" to="/register">
            Register
          </NavLink>
        </ul>
      </div>
      <p className="text-center font-semibold text-zinc-700 text-sm">
        Jeremy Barber &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
