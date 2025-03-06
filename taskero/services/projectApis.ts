import { TCreateTodoForm } from '@/app/create-todo';
import { PROJECTS_URL } from '../constants/apiconstants';
import { apiSlice } from './apiClient';

type TProjectapiResponse = {
    data: TProject[] | TProject | string | null;
    isSuccess: boolean;
    statuscode: number | string;
    warningMessage: string | null;
    errorMessage: string | null;
    totalRecords: number | null;
    totalPages: number | null;
    recordsPerPage: number | null;
}

type TProjectActivity = {
    action: "Project Created" | "Task Added" | "Task Updated" | "Task Completed" | "User Assigned" | "Status Changed" | "Priority Updated";
    performedBy: string;
    timestamp: Date;
    details?: string;
};

type TProject = {
    _id: string;
    tintColor: string;
    title: string;
    description?: string;
    assignedUsers: string[];
    status: "Pending" | "In Progress" | "Completed";
    priority: "Low" | "Medium" | "High";
    dueDate?: Date;
    createdBy: string;
    activities: TProjectActivity[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

type TQueryParams = {
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
}

export const todoApis = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllProjects: builder.query<TProjectapiResponse, TQueryParams>({
            query: (queryParams) => {
                const queryString = new URLSearchParams(
                    Object.entries(queryParams).reduce((acc, [key, value]) => {
                        acc[key] = value.toString();
                        return acc;
                    }, {} as Record<string, string>)
                ).toString();

                return {
                    url: `${PROJECTS_URL}/?${queryString}`,
                    method: "GET",
                };
            }
        }),
        getProjectDetails: builder.query<TProjectapiResponse, {todoId: string, queryParams: TQueryParams}>({
            query: ({ todoId, queryParams }) => {
                const queryString = new URLSearchParams(
                    Object.entries(queryParams).reduce((acc, [key, value]) => {
                        acc[key] = value.toString();
                        return acc;
                    }, {} as Record<string, string>)
                ).toString();

                return {
                    url: `${PROJECTS_URL}/${todoId.toString()}?${queryString}`,
                    method: "GET",
                };
            },
        }),
    })
})

export const { useGetAllProjectsQuery, useGetProjectDetailsQuery } = todoApis;