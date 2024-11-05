import { FiInfo, FiLock, FiMail, FiUser } from "react-icons/fi";

const Register = () => {
  return (
    <section className="flex-grow flex justify-center items-center">
      <div className="container max-w-7xl mx-auto px-6 py-12">
        <div className="bg-zinc-100 border-2 border-zinc-300 rounded-md shadow-md p-6 max-w-md mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Register</h2>
          <form className="space-y-4">
            <label className="input input-bordered flex items-center gap-2">
              <FiInfo />
              <input type="text" className="grow" placeholder="Firstname" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FiInfo />
              <input type="text" className="grow" placeholder="Lastname" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FiUser />
              <input type="text" className="grow" placeholder="Username" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FiMail />
              <input type="email" className="grow" placeholder="Email" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FiLock />
              <input type="password" className="grow" placeholder="Password" />
            </label>
            <div className="flex justify-center">
              <button type="submit" className="btn btn-primary">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
