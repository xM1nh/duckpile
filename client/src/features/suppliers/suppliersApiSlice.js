import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";

const suppliersAdapter = createEntityAdapter({})

const initialState = suppliersAdapter.getInitialState({
    totalCount: null
})

const suppliersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSuppliers: builder.query({
            query: ({page, count}) => `/api/v1/suppliers?page=${page}&count=${count}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedSuppliers = responseData.suppliers.map(supplier => {
                    supplier.id = supplier.supplier_id
                    return supplier
                })

                const normalizedData = suppliersAdapter.setAll(initialState, loadedSuppliers)
                const response = {
                    ...normalizedData,
                    totalCount: responseData.count
                }
                
                return response
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'Supplier', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Supplier', id}))
                    ]
                } else return [{type: 'Supplier', id: 'LIST'}]
            }
        }),
        getSupplier: builder.query({
            query: id => `/api/v1/suppliers/${id}`,
            providesTags: (resutl, error, arg) => [{type: 'Supplier', id: arg.id}]
        }),
        addNewSupplier: builder.mutation({
            query: initCusotmer => ({
                url: '/api/v1/suppliers/',
                method: 'POST',
                body: initCusotmer
            }),
            invalidatesTags: ['Supplier']
        }),
        editSupplier: builder.mutation({
            query: ({supplier_id: id, ...body}) => ({
                url: `/api/v1/suppliers/${id}`,
                method: 'PUT',
                body: body
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Supplier', id: arg.id}
            ]
        }),
        deleteSupplier: builder.mutation({
            query: id => ({
                url: `/api/v1/suppliers/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Supplier', id: arg.id}
            ]
        })
    })
})

export const {
    useGetSuppliersQuery,
    useGetSupplierQuery,
    useAddNewSupplierMutation,
    useEditSupplierMutation,
    useDeleteSupplierMutation
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