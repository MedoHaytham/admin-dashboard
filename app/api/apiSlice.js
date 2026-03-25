import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://e-commerce-backend-geri.onrender.com/api",
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = Cookies.get("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  const url = typeof args === "string" ? args : args.url;

  const isAuthRoute =
    url === "/auth/login" ||
    url === "/auth/register" ||
    url === "/auth/refresh";

  if (result?.error?.status === 401 && !isAuthRoute) {
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    if (refreshResult?.data) {
      const { accessToken } = refreshResult.data?.data;
      Cookies.set('accessToken', accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        Cookies.remove('accessToken');
      }
      return refreshResult;
    }
  }
  return result;
}

const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Me', 'Users', 'Products', 'Categories', 'Orders'],
  endpoints: () => ({}),
});

export default apiSlice;