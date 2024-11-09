import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFields, loginModel, LoginModel } from "../models/loginModel";
import { useLoginMutation } from "../store/api/authApi";
import { useDispatch } from "react-redux";
import { setCreds } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import useAutoRefresh from "../hooks/useAutoRefresh";

const Login = () => {
  useAutoRefresh();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { handleSubmit, register, formState } = useForm<LoginModel>({
    resolver: zodResolver(loginModel),
    defaultValues: {
      email: import.meta.env.PROD ? "" : import.meta.env.VITE_EMAIL,
      password: import.meta.env.PROD ? "" : import.meta.env.VITE_PASSWORD,
    },
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
            {loginFields.map((field, index) => (
              <FormField
                key={index}
                error={
                  formState.errors[field.name as keyof LoginModel]?.message
                }
                icon={field.icon}
                type={field.type}
                placeholder={field.placeholder}
                {...register(field.name as keyof LoginModel)}
              />
            ))}
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
