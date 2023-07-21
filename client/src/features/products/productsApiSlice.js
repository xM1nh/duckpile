import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";

const productsAdapter = createEntityAdapter({})

const initialState = productsAdapter.getInitialState()

const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query({
            query: page => `/api/v1/products?page=${page}&count=25`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedProducts = responseData.products.map(product => {
                    product.id = product.product_id
                    return product
                })
                return productsAdapter.setAll(initialState, loadedProducts)
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
            query: productId => `/api/v1/products/product/${productId}`,
            providesTags: (result, error, arg) => [{type: 'Product', id: arg}]
        }),
        addNewProductPost: builder.mutation({
            query: initPost => ({
                url: '/api/v1/products/create',
                method: 'POST',
                body: initPost
            }),
            invalidatesTags: ['Product']
        }),
        editProduct: builder.mutation({
            query: ({product_id: id, ...body}) => ({
                url: `/api/v1/products/product/${id}/update`,
                method: 'POST',
                body: body
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
    useAddNewProductPostMutation,
    useEditProductMutation,
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