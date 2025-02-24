import { TCreateTodoForm } from '@/app/create-todo';
import { TODO_URL } from '../constants/apiconstants';
import { apiSlice } from './apiClient';

type TTodoapiResponse = {
    data: TTodo[] | TTodo | string | null;
    isSuccess: boolean;
    statuscode: number | string;
    warningMessage: string | null;
    errorMessage: string | null;
    totalRecords: number | null;
    totalPages: number | null;
    recordsPerPage: number | null;
}

type TTodo = {
    _id: string;
    title: string;
    description: string;
    status: string;
    createdBy: string | null | undefined;
    assignedTo: string | null | undefined;
    createdAt: string;
    updatedAt: string;
}

type TQueryParams = {
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
}

export const todoApis = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllTodo: builder.query<TTodoapiResponse, TQueryParams>({
            query: () => ({
                url: `${TODO_URL}/`,
                method: 'GET',
            })
        }),
        getTodoDetails: builder.query<TTodoapiResponse, {todoId: string, queryParams: TQueryParams}>({
            query: ({ todoId, queryParams }) => {
                const queryString = new URLSearchParams(
                    Object.entries(queryParams).reduce((acc, [key, value]) => {
                        acc[key] = value.toString();
                        return acc;
                    }, {} as Record<string, string>)
                ).toString();

                return {
                    url: `${TODO_URL}/${todoId.toString()}?${queryString}`,
                    method: "GET",
                };
            },
        }),
        createTodo: builder.mutation<TTodoapiResponse, TCreateTodoForm>({
            query: ({ ...data }) => ({
                url: `${TODO_URL}/`,
                method: 'POST',
                body: data
            })
        }),
    })
})

export const { useGetAllTodoQuery, useGetTodoDetailsQuery, useCreateTodoMutation } = todoApis;