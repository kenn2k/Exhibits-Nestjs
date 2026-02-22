export interface IExhibit {
  id: number;
  image: string;
  description: string;
}

export interface PaginatedExhibits<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}
