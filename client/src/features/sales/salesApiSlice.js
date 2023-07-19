import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";

const salesAdapter = createEntityAdapter({})

const initialState = salesAdapter.getInitialState()

const salesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSales: builder.query({
            query: () => '/api/v1/sales',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedSales = responseData.map(sale => {
                    sale.id = sale.sale_id
                    return sale
                })
                return salesAdapter.setAll(initialState, loadedSales)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'Sale', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Sale', id}))
                    ]
                } else return [{type: 'Sale', id: 'LIST'}]
            }
        })
    })
})

export const {
    useGetSalesQuery
} = salesApiSlice

export const selectSalesResult = salesApiSlice.endpoints.getSales.select()

const selectSalesData = createSelector(
    selectSalesResult,
    salesResult => salesResult.data
)

export const {
    selectAll: selectAllSales,
    selectById: selectSaleById,
    selectIds: selectSaleIds
} = salesAdapter.getSelectors(state => selectSalesData(state) ?? initialState)