import { createSelector } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";

const inventoryApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getInventory: builder.query({
            query: () => '/api/v1/inventory',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 60,
            providesTags: ['Inventory']
        }),
    })
})

export const {
    useGetInventoryQuery,
} = inventoryApiSlice

export const selectInventoryResult = inventoryApiSlice.endpoints.getInventory.select()

const selectInventoryData = createSelector(
    selectInventoryResult,
    inventoryResult => inventoryResult.data
)