import apiSlice from "../api/apiSlice";

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/users/me',
      providesTags: ['Me']
    }),
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users']
    }),
    updateMe: builder.mutation({
      query: (credentials) => ({
        url: '/users/me',
        method: 'PATCH',
        body: { ...credentials },
      })
    }),
    updateUser: builder.mutation({
      query: ({userId, ...data}) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
        body: { ...data },
      }),
      invalidatesTags: ['Users']
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users']
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: '/users/me/password',
        method: 'PATCH',
        body: { ...credentials },
      })
    }),
  })
});

export const {
  useGetMeQuery,
  useGetUsersQuery,
  useUpdateMeMutation,
  useUpdatePasswordMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userSlice;