import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";

const suppliersAdapter = createEntityAdapter({})

const initialState = suppliersAdapter.getInitialState()

const suppliersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSuppliers: builder.query({
            query: () => '/api/v1/suppliers',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedSuppliers = responseData.map(supplier => {
                    supplier.id = supplier.supplier_id
                    return supplier
                })
                return suppliersAdapter.setAll(initialState, loadedSuppliers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'Supplier', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Supplier', id}))
                    ]
                } else return [{type: 'Supplier', id: 'LIST'}]
            }
        })
    })
})

export const {
    useGetSuppliersQuery
} = suppliersApiSlice

export const selectSuppliersResult = suppliersApiSlice.endpoints.getSuppliers.select()

const selectSuppliersData = createSelector(
    selectSuppliersResult,
    suppliersResult => suppliersResult.data
)

export const {
    selectAll: selectAllSuppliers,
    selectById: selectSupplierById,
    selectIds: selectSupplierIds
} = suppliersAdapter.getSelectors(state => selectSuppliersData(state) ?? initialState)