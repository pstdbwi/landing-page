export * from "./special-section";

export interface ISelect {
  value: string | number;
  label: string;
}

export interface ITable<T> {
  items: T[];
  total_items: number;
  total_pages: number;
  current_page: number;
  filters: Record<string, string>;
  size: number;
  page: number;
  total?: any;
}
