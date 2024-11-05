import { NavLink } from "react-router-dom";

type Props = {
  links: { label: string; to: string }[];
};
const NavBar = ({ links }: Props) => {
  return (
    <header className="shadow-md bg-zinc-200">
      <div className="container max-w-7xl mx-auto h-14 px-6">
        <nav className="h-full flex justify-between items-center">
          <div>
            <NavLink
              className="text-lg font-semibold hover:text-zinc-700 text-zinc-900 duration-200"
              to="/"
            >
              Vite Messenger
            </NavLink>
          </div>
          <ul className="flex gap-4 items-center">
            {links.map((l) => (
              <li key={l.label}>
                <NavLink className="hover:underline" to={l.to}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
