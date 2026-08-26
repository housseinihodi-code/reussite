export declare class PaginationDto {
    page: number;
    limit: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    get skip(): number;
}
export interface PaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
