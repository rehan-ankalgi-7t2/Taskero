import { Model, Document, FilterQuery, SortOrder } from "mongoose";

interface SortOption {
    field: string;
    order: "asc" | "desc";
}

interface PaginationResult<T> {
    success: boolean;
    data: T[];
    page?: number;
    pageSize?: number;
    totalPages?: number;
    totalDocuments: number;
}

const pagination = async <T extends Document>(
    model: Model<T>,
    page?: number,
    pageSize?: number,
    sortOption: SortOption | null = null,
    selectionQuery: Record<string, 0 | 1> = { updatedAt: 0 },
    query: FilterQuery<T> = {}
): Promise<PaginationResult<T> | false> => {
    try {
        const sortObject: Record<string, SortOrder> = {};
        if (sortOption?.field && sortOption?.order) {
            sortObject[sortOption.field] = sortOption.order === "desc" ? -1 : 1;
        }

        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const totalDocuments = await model.countDocuments(query);
            const totalPages = Math.ceil(totalDocuments / pageSize);

            const documents = await model.find(query, selectionQuery).sort(sortObject).skip(skip).limit(pageSize);

            return {
                success: true,
                data: documents,
                page,
                pageSize,
                totalPages,
                totalDocuments,
            };
        }

        // If no pagination parameters provided, return all documents
        const documents = await model.find(query, selectionQuery).sort(sortObject);

        return {
            success: true,
            data: documents,
            totalDocuments: documents.length,
        };
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.error("Pagination Error:", error);
        return false;
    }
};

const aggregateWithPagination = async <T>(
    model: Model<T>,
    pipeline: any[],
    page?: number,
    pageSize?: number
): Promise<PaginationResult<T> | false> => {
    try {
        if (!page || !pageSize) {
            const results = await model.aggregate(pipeline);
            return {
                success: true,
                data: results,
                totalDocuments: results.length,
            };
        }

        // Get total document count using aggregation
        const totalCount = await model.aggregate([...pipeline, { $count: "totalCount" }]);
        const totalDocuments = totalCount.length > 0 ? totalCount[0].totalCount : 0;

        // Apply pagination
        const paginatedPipeline = [...pipeline, { $skip: (page - 1) * pageSize }, { $limit: pageSize }];
        const results = await model.aggregate(paginatedPipeline);

        return {
            success: true,
            data: results,
            totalPages: Math.ceil(totalDocuments / pageSize),
            page,
            pageSize,
            totalDocuments,
        };
    } catch (error) {
        process.env.NODE_ENV === 'development' &&  console.error("Aggregation Error:", error);
        return false;
    }
};


export { pagination, aggregateWithPagination };
