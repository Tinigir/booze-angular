export interface IPaginatedResponse<IData> {
  data: IData[];
  pagination: {
    count: number;
    pages: number;
  };
}
