export interface IPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginatedData<T> {
  success?: boolean;
  data: T[];
  pagination: IPagination;
}
