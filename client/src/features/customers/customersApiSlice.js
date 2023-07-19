import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";

const customersAdapter = createEntityAdapter({})

const initialState = customersAdapter.getInitialState()

const customersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCustomers: builder.query({
            query: () => '/api/v1/customers',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedCustomers = responseData.map(customer => {
                    customer.id = customer.customer_id
                    return customer
                })
                return customersAdapter.setAll(initialState, loadedCustomers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'Customer', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Customer', id}))
                    ]
                } else return [{type: 'Customer', id: 'LIST'}]
            }
        })
    })
})

export const {
    useGetCustomersQuery
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