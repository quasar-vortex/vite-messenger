import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFields, loginModel, LoginModel } from "../models/loginModel";
import { useLoginMutation, useRegisterMutation } from "../store/api/authApi";
import { useDispatch } from "react-redux";
import { setCreds } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import {
  registerFields,
  registerModel,
  RegisterModel,
} from "../models/registerModel";

const Login = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { handleSubmit, register, formState } = useForm<RegisterModel>({
    resolver: zodResolver(registerModel),
  });
  const [handleRegisterRequest, { isLoading }] = useRegisterMutation();
  const handleLogin = async (data: RegisterModel) => {
    try {
      const { tokens, user } = await handleRegisterRequest(data).unwrap();
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
          <h2 className="text-4xl font-bold mb-8 text-center">Register</h2>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {registerFields.map((field, index) => (
              <FormField
                key={index}
                error={
                  formState.errors[field.name as keyof RegisterModel]?.message
                }
                icon={field.icon}
                type={field.type}
                placeholder={field.placeholder}
                {...register(field.name as keyof RegisterModel)}
              />
            ))}
            <div className="flex justify-center">
              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-primary"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
