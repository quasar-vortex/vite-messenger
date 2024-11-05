import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const navLinks = [
  {
    to: "/register",
    label: "Register",
  },
  {
    to: "/",
    label: "Login",
  },
  {
    to: "/dash",
    label: "Dash",
  },
];
const Layout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen justify-between">
        <NavBar links={navLinks} />
        <main className="flex-1 flex flex-col  bg-zinc-100">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
