// import { createApi } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/apiconstants";

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["Internals", "Product", "User", "Order"],
    endpoints: (builder) => ({}),
});