import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DishPostBody, DishPostResponse } from '../types/dishes'

// Define a service using a base URL and expected endpoints
export const dishesApi = createApi({
    reducerPath: 'dishesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes' }),
    endpoints: (builder) => ({
        postDish: builder.mutation<DishPostResponse, DishPostBody>({
            query: (DishPostBody: DishPostBody) => ({
                url: `/`,
                method: 'POST',
                body: DishPostBody,
            }),
        }),
    })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { usePostDishMutation } = dishesApi