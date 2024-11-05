import { FiLock, FiMail } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginModel, LoginModel } from "../lib/models/loginModel";
import { useLoginMutation } from "../store/api/authApi";
import { useDispatch } from "react-redux";
import { setCreds } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { handleSubmit, register, formState } = useForm<LoginModel>({
    resolver: zodResolver(loginModel),
  });
  const [handleLoginRequest, { isLoading }] = useLoginMutation();
  const handleLogin = async (data: LoginModel) => {
    try {
      const { tokens, user } = await handleLoginRequest(data).unwrap();
      dispatch(setCreds({ tokens, user }));
      nav("/dash");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="flex-grow flex justify-center items-center">
      <div className="container max-w-7xl mx-auto px-6 py-12">
        <div className="bg-zinc-100 border-2 border-zinc-300 rounded-md shadow-md p-6 max-w-md mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Login</h2>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <label className="input input-bordered flex items-center gap-2">
              <FiMail />
              <input
                {...register("email")}
                type="email"
                className="grow"
                placeholder="Email"
              />
            </label>
            {formState.errors["email"]?.message && (
              <span className="text-red-600 font-bold text-sm mt-2 inline-block">
                {formState.errors["email"]?.message}
              </span>
            )}
            <label className="input input-bordered flex items-center gap-2">
              <FiLock />
              <input
                {...register("password")}
                type="password"
                className="grow"
                placeholder="Password"
              />
            </label>
            {formState.errors["password"]?.message && (
              <span className="text-red-600 font-bold text-sm inline-block">
                {formState.errors["password"]?.message}
              </span>
            )}
            <div className="flex justify-center">
              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
