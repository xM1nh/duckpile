import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";

const customersAdapter = createEntityAdapter({})

const initialState = customersAdapter.getInitialState({
    totalCount: null
})

const customersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCustomers: builder.query({
            query: page => `/api/v1/customers?page=${page}&count=25`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedCustomers = responseData.customers.map(customer => {
                    customer.id = customer.customer_id
                    return customer
                })

                const normalizedData = customersAdapter.setAll(initialState, loadedCustomers)
                const response = {
                    ...normalizedData,
                    totalCount: responseData.count
                }
                
                return response
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'Customer', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Customer', id}))
                    ]
                } else return [{type: 'Customer', id: 'LIST'}]
            }
        }),
        getCustomer: builder.query({
            query: id => `/api/v1/customers/${id}`,
            providesTags: (resutl, error, arg) => [{type: 'Customer', id: arg.id}]
        }),
        addNewCustomer: builder.mutation({
            query: initCusotmer => ({
                url: '/api/v1/customers/',
                method: 'POST',
                body: initCusotmer
            }),
            invalidatesTags: ['Customer']
        }),
        editCustomer: builder.mutation({
            query: ({customer_id: id, ...body}) => ({
                url: `/api/v1/customers/${id}`,
                method: 'PUT',
                body: body
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Customer', id: arg.id}
            ]
        }),
        deleteCustomer: builder.mutation({
            query: id => ({
                url: `/api/v1/customers/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Customer', id: arg.id}
            ]
        })
    })
})

export const {
    useGetCustomersQuery,
    useGetCustomerQuery,
    useAddNewCustomerMutation,
    useEditCustomerMutation,
    useDeleteCustomerMutation
} = customersApiSlice

export const selectCustomersResult = customersApiSlice.endpoints.getCustomers.select()

const selectCustomersData = createSelector(
    selectCustomersResult,
    customersResult => customersResult.data
)

export const {
    selectAll: selectAllCustomers,
    selectById: selectCustomerById,
    selectIds: selectCustomerIds
} = customersAdapter.getSelectors(state => selectCustomersData(state) ?? initialState)