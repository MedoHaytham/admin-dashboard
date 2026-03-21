import apiSlice from "../api/apiSlice";

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/users/me',
      providesTags: ['Me']
    }),
    updateMe: builder.mutation({
      query: (credentials) => ({
        url: '/users/me',
        method: 'PATCH',
        body: { ...credentials },
      })
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: '/users/me/password',
        method: 'PATCH',
        body: { ...credentials },
      })
    }),
    getAddresses: builder.query({
      query: () => '/users/me/addresses',
      providesTags: ['Addresses']
    }),
    addAddress: builder.mutation({
      query: (credentials) => ({
        url: '/users/me/addresses',
        method: 'POST',
        body: { ...credentials },
      }),
      invalidatesTags: ['Addresses']
    }),
    updateAddress: builder.mutation({
      query: ({addressId, ...data}) => ({
        url: `/users/me/addresses/${addressId}`,
        method: 'PATCH',
        body: { ...data },
      }),
      invalidatesTags: ['Addresses']
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `/users/me/addresses/${addressId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Addresses']
    }),
    setDefaultAddress: builder.mutation({
      query: (addressId) => ({
        url: `/users/me/addresses/${addressId}/default`,
        method: 'PATCH',
      }),
      async onQueryStarted(addressId, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          userSlice.util.updateQueryData('getAddresses', undefined, (draft) => {
            const addresses = draft?.data?.addresses;
            if (!addresses) return;
            addresses.forEach(address => {
              address.isDefault = address._id === addressId;
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Addresses']
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/users/me',
        method: 'DELETE',
      })
    }),
  })
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = userSlice;