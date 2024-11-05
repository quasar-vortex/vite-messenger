import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RegisterModel } from "../../lib/models/registerModel";
import { User } from "../../types";
import { RootState } from "../store";
import { LoginModel } from "../../lib/models/loginModel";

type AuthResponse = {
  user: User;
  tokens: {
    accessToken: string;
  };
};

const myBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include", // To include HTTP-only cookies
});

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: myBaseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterModel>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginModel>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    logoff: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useRefreshMutation,
  useLoginMutation,
  useLogoffMutation,
  useRegisterMutation,
} = authApi;
