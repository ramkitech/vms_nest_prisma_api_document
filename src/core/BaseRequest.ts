import { LoadChild, LoadParents, PAGING } from '../core/Enums';

export interface BaseFindParams extends Record<string, unknown> {
  search?: string;
  load_child?: LoadChild;
  load_parents?: LoadParents;
  paging?: PAGING;
  page_index?: number;
  page_count?: number;
}

// Default values for BaseFindParams
export const DefaultBaseFindParams: BaseFindParams = {
  search: '',
  status: 'Active,Inactive',
  load_child: LoadChild.No,
  load_parents: LoadParents.No,
  paging: PAGING.Yes,
  page_index: 0,
  page_count: 100,
};

export const withDefaults = <T extends Record<string, unknown>>(
  defaults: T,
  overrides: Partial<T> = {}
): T => {
  return { ...defaults, ...overrides };
};
