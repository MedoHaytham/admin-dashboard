import apiSlice from "../api/apiSlice";

const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/orders/all?limit=0",
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetOrdersQuery } = orderSlice;