import { configureStore } from "@reduxjs/toolkit";
import { dishesApi } from "../services/dishesApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
    reducer: {
        [dishesApi.reducerPath]: dishesApi.reducer,
    },
    devTools: import.meta.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([
        dishesApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;