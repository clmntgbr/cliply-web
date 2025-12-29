export interface HydraView {
  first?: string;
  last?: string;
  next?: string;
  previous?: string;
}

export interface Hydra<TData> {
  member: TData[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  view?: HydraView;
}
