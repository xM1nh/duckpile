import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";

const productsAdapter = createEntityAdapter({})

const initialState = productsAdapter.getInitialState({
    totalCount: null
})

const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query({
            query: ({page, count}) => `/api/v1/products?page=${page}&count=${count}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedProducts = responseData.products.map(product => {
                    product.id = product.product_id
                    return product
                })

                const normalizedData = productsAdapter.setAll(initialState, loadedProducts)
                const response = {
                    ...normalizedData,
                    totalCount: responseData.count
                }

                return response
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'Product', id: 'PARTIAL-LIST'},
                        ...result.ids.map(id => ({type: 'Product', id}))
                    ]
                } else return [{type: 'Product', id: 'PARTIAL-LIST'}]
            }
        }),
        getProduct: builder.query({
            query: id => `/api/v1/products/${id}`,
            providesTags: (result, error, arg) => [
                {type: 'Product', id: arg.id}
            ]
        }),
        addNewProduct: builder.mutation({
            query: initPost => ({
                url: '/api/v1/products',
                method: 'POST',
                body: initPost
            }),
            invalidatesTags: ['Product']
        }),
        editProduct: builder.mutation({
            query: ({product_id: id, ...body}) => ({
                url: `/api/v1/products/${id}`,
                method: 'PUT',
                body: body
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Product', id: arg.id}
            ]
        }),
        deleteProduct: builder.mutation({
            query: id => ({
                url: `api/v1/products/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Product', id: arg.id}
            ] 
        })
    })
})

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useAddNewProductMutation,
    useEditProductMutation,
    useDeleteProductMutation
} = productsApiSlice

export const selectProductsResult = productsApiSlice.endpoints.getProducts.select()

const selectProductsData = createSelector(
    selectProductsResult,
    productsResult => productsResult.data
)

export const {
    selectAll: selectAllProducts,
    selectById: selectProductById,
    selectIds: selectProductIds
} = productsAdapter.getSelectors(state => selectProductsData(state) ?? initialState)