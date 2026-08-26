export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  success: false;
  statusCode: number;
  path: string;
  timestamp: string;
  message: string | string[];
}
