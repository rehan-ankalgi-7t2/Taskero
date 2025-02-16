export type ResponseObject<T = any> = {
    data?: T | null;
    isSuccess: boolean;
    statusCode: number;
    errorMessage?: string | null;
    warningMessage?: string | null;
    totalRecords?: number | null;
    totalPages?: number | null;
    recordsPerPage?: number | null;
}

const handleResponse = <T>(
    data: T | null = null,
    isSuccess: boolean = false,
    statusCode: number = 500,
    errorMessage: string | null = null,
    warningMessage: string | null = null,
    totalRecords: number | null = null,
    totalPages: number | null = null,
    recordsPerPage: number | null = null
): ResponseObject<T> => ({
    data,
    isSuccess,
    statusCode,
    errorMessage,
    warningMessage,
    totalRecords,
    totalPages,
    recordsPerPage
});

export default handleResponse;