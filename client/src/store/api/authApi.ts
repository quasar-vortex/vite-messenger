import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RegisterModel } from "../../models/registerModel";
import { User } from "../../types";
import { RootState } from "../store";
import { LoginModel } from "../../models/loginModel";
import { removeCreds, setCreds } from "../slices/authSlice";

type AuthResponse = {
  user: User;
  tokens: {
    accessToken: string;
  };
};

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  })(args, api, extraOptions);

  // Check if the request failed for auth reasons
  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    // Attempt to refresh the token
    const refreshResult = await api.dispatch(
      authApi.endpoints.refresh.initiate()
    );

    if (refreshResult.data) {
      // Store the new token in state or local storage if needed
      api.dispatch(setCreds(refreshResult.data.tokens.accessToken));

      // Retry the original request with the new token
      result = await fetchBaseQuery({
        baseUrl: "http://localhost:5000/api/v1",
        prepareHeaders: (headers, { getState }) => {
          const token = (getState() as RootState).auth.accessToken;
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          return headers;
        },
        credentials: "include",
      })(args, api, extraOptions);
    } else {
      // Handle the refresh failure (e.g., redirect to login)
      api.dispatch(removeCreds());
    }
  }

  return result;
};

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
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
    refresh: builder.query<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
        headers: {
          credentials: "include",
        },
      }),
    }),
    logoff: builder.query<{ message: string }, null | void>({
      query: () => ({
        url: "/auth/logoff",
        method: "GET",
        headers: {
          credentials: "include",
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useRefreshQuery,
  useLoginMutation,
  useLogoffQuery,
  useRegisterMutation,
} = authApi;
