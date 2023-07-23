import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";

export const salesAdapter = createEntityAdapter({})

export const initialState = salesAdapter.getInitialState({
    totalCount: null,
    mostBuyedProduct: null,
    mostBuyedCustomer: null
})

export const salesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSales: builder.query({
            query: ({page, count}) => `/api/v1/sales?page=${page}&count=${count}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedSales = responseData.sales.map(sale => {
                    sale.id = sale.sale_id
                    return sale
                })
                const normalizedData = salesAdapter.setAll(initialState, loadedSales)

                const result = {
                    ...normalizedData,
                    totalCount: responseData.count,
                    mostBuyedProduct: responseData.mostBuyedProduct,
                    mostBuyedCustomer: responseData.mostBuyedCustomer
                }

                return result
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'Sale', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Sale', id}))
                    ]
                } else return [{type: 'Sale', id: 'LIST'}]
            }
        }),
        getSale: builder.query({
            query: id => `/api/v1/sales/${id}`,
            providesTags: (result, error, arg) => [
                {type: 'Sale', id: arg.id}
            ]
        }),
        addNewSale: builder.mutation({
            query: sale => ({
                url: `/api/v1/sales`,
                method: 'POST',
                body: sale
            }),
            invalidatesTags: ['Sale']
        }),
        editSale: builder.mutation({
            query: sale => ({
                url: `/api/v1/sales/${sale.sale_id}`,
                method: 'PUT',
                body: sale
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Sale', id: arg.id}
            ]
        }),
        deleteSale: builder.mutation({
            query: id => ({
                url: `/api/v1/sales/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Sale', id: arg.id}
            ] 
        })
    })
})

export const selectSalesResult = salesApiSlice.endpoints.getSales.select()

const selectSalesData = createSelector(
    selectSalesResult,
    salesResult => salesResult.data
)

export const selectSalesFromProductId = createSelector(
    [selectSalesResult, (state, productId) => productId],   
    (sales, productId) => {
        const result = []
        if (sales.data) {
            for (const id of sales.data.ids) {
                const found = sales.data.entities[id].products.find(product => 
                    product.product_id === productId)
                if (found) result.push(sales.data.entities[id])
            }
            return result
        } else {
            return result
        }
    }
)

export const selectSalesFromCustomerId = createSelector(
    [selectSalesResult, (state, customerId) => customerId],
    (sales, customerId) => {
        const result = []
        if (sales.data) {
            for (const id of sales.data.ids) {
                console.log(sales.data.entities[id])
                if (sales.data.entities[id].customer_id === customerId) 
                    result.push(sales.data.entities[id])
            }
            return result
        } else {
            return result
        }
    }
)

export const {
    selectAll: selectAllSales,
    selectById: selectSaleById,
    selectIds: selectSaleIds
} = salesAdapter.getSelectors(state => selectSalesData(state) ?? initialState)

export const {
    useGetSalesQuery,
    useGetSaleQuery,
    useAddNewSaleMutation,
    useEditSaleMutation,
    useDeleteSaleMutation,
} = salesApiSlice