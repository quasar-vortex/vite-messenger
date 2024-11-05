import { Outlet, useLocation } from "react-router-dom";
import {
  FiUser,
  FiUsers,
  FiLayers,
  FiMessageCircle,
  FiSettings,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const navLinks = [
  {
    to: "/dash/profile",
    label: "Profile",
    icon: FiUser,
  },
  {
    to: "/dash/Friends",
    label: "Friends",
    icon: FiUsers,
  },
  {
    to: "/dash/messages",
    label: "Messages",
    icon: FiMessageCircle,
  },
  {
    to: "/dash/rooms",
    label: "Rooms",
    icon: FiLayers,
  },
];

const SideBar = () => {
  return (
    <aside className="border-r-2 border-zinc-300 flex basis-[20%] max-w-32 flex-col justify-between">
      <div className="p-4">
        <NavLink
          className=" block text-center text-lg font-semibold hover:text-zinc-700 text-zinc-900 duration-200"
          to="/dash"
        >
          Vite M
        </NavLink>
      </div>
      <ul className="p-4 flex flex-col justify-center items-center gap-4">
        {navLinks.map(({ icon: Icon, label, to }) => (
          <li key={label} className="w-full">
            <NavLink
              to={to}
              className="flex flex-col gap-1 items-center duration-200 hover:bg-zinc-300 p-2 rounded-md bg-zinc-200"
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="p-4 flex justify-center">
        <button className="flex flex-col gap-1 items-center duration-200 hover:bg-zinc-300 p-2 rounded-md bg-zinc-200">
          <FiSettings />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
const PlaceHolder = () => {
  return (
    <div className="flex flex-col justify-center h-full p-4">
      <div className="max-w-md mx-auto flex items-center flex-col">
        <h2 className="text-3xl font-bold leading-snug mb-4 text-center">
          Try adding a friend to message or view available rooms.
        </h2>
        <div className="flex gap-4">
          <NavLink
            style={{ fontSize: "1.125rem" }}
            className="btn btn-primary"
            to="/dash/friends"
          >
            View Friends
          </NavLink>
          <NavLink
            style={{ fontSize: "1.125rem" }}
            className="btn btn-neutral"
            to="/dash/rooms"
          >
            View Rooms
          </NavLink>
        </div>
      </div>
    </div>
  );
};
const DashLayout = () => {
  const { pathname } = useLocation();
  return (
    <>
      <div className="flex min-h-screen justify-between">
        <SideBar />
        <main className="flex-1 flex flex-col ">
          {pathname === "/dash" || pathname === "/dash/" ? (
            <PlaceHolder />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </>
  );
};

export default DashLayout;
