import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { selectUserInfo } from "../store/slices/authSlice";

const EditProfile = () => {
  const { bio, userName, firstName, lastName, email, avatarUrl, registeredAt } =
    useSelector(selectUserInfo)!;
  return (
    <section className="mx-auto w-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 border-b-2 mb-4 border-zinc-300">
        <h1 className="text-xl font-semibold">Profile</h1>
        <div className=" dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-outline m-1">
            Options
          </div>
          <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>
              <NavLink to="/dash/profile/edit">Edit</NavLink>
            </li>
            <li>
              <NavLink to="/dash/profile/delete">Delete</NavLink>
            </li>
          </ul>
        </div>
      </header>

      <div className="p-4 flex flex-col items-center justify-center">
        {/* User Info Section */}
        <div className="bg-zinc-100 flex flex-col items-center  border-2 border-zinc-300 p-6 rounded-lg shadow-md w-full max-w-lg">
          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
              <img src={avatarUrl || "https://i.pravatar.cc/200"} />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-semibold">
            {userName || "username"}
          </h2>
          <p className="text-gray-700 mt-1 text-center">
            {bio || "There is no bio to share :("}{" "}
          </p>

          {/* User Details */}
          <div className="flex flex-col space-y-2 mt-6 self-start bg-zinc-200 w-full p-4 rounded-md shadow-md">
            <span className="font-bold">First Name:</span> {firstName}
            <span className="font-bold">Last Name:</span> {lastName}
            <span className="font-bold">Email:</span> {email}
            <span className="font-bold">Date Joined:</span>{" "}
            {new Date(registeredAt).toDateString()}
          </div>
          <form></form>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;
