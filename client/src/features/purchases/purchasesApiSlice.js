import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";

const purchasesAdapter = createEntityAdapter({})

const initialState = purchasesAdapter.getInitialState()

const purchasesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPurchases: builder.query({
            query: () => '/api/v1/purchases',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedPurchases = responseData.map(purchase => {
                    purchase.id = purchase.purchase_id
                    return purchase
                })
                return purchasesAdapter.setAll(initialState, loadedPurchases)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'Purchase', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Purchase', id}))
                    ]
                } else return [{type: 'Purchase', id: 'LIST'}]
            }
        })
    })
})

export const {
    useGetPurchasesQuery
} = purchasesApiSlice

export const selectPurchasesResult = purchasesApiSlice.endpoints.getPurchases.select()

const selectPurchasesData = createSelector(
    selectPurchasesResult,
    purchasesResult => purchasesResult.data
)

export const {
    selectAll: selectAllPurchases,
    selectById: selectPurchasesById,
    selectIds: selectPurchaseIds
} = purchasesAdapter.getSelectors(state => selectPurchasesData(state) ?? initialState)