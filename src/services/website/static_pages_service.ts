// Axios
import { apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringOptional,
  enumMandatory,
  multi_select_optional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// URL and Endpoints
const URL = 'website/static_pages';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Static Page Interface
export interface StaticPage extends Record<string, unknown> {
  // Primary Fields
  page_id: string;
  page_name?: string; // Max: 50
  page_code?: string; // Max: 50
  page_url?: string; // Max: 200
  page_content?: string; // Max: 500

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;
}

// ✅ Static Page Create/Update Schema
export const StaticPageSchema = z.object({
  page_name: stringOptional('Page Name', 0, 50),
  page_code: stringOptional('Page Code', 0, 50),
  page_url: stringOptional('Page URL', 0, 200),
  page_content: stringOptional('Page Content', 0, 500),
  status: enumMandatory('Status', Status, Status.Active),
});
export type StaticPageDTO = z.infer<typeof StaticPageSchema>;

// ✅ Static Page Query Schema
export const StaticPageQuerySchema = BaseQuerySchema.extend({
  page_ids: multi_select_optional('Page'), // ✅ Multi-selection -> StaticPage
});
export type StaticPageQueryDTO = z.infer<typeof StaticPageQuerySchema>;

// Convert existing data to a payload structure
export const toStaticPagePayload = (page: StaticPage): StaticPageDTO => ({
  page_name: page.page_name ?? '',
  page_code: page.page_code ?? '',
  page_url: page.page_url ?? '',
  page_content: page.page_content ?? '',
  status: page.status,
});

// Generate a new payload with default values
export const newStaticPagePayload = (): StaticPageDTO => ({
  page_name: '',
  page_code: '',
  page_url: '',
  page_content: '',
  status: Status.Active,
});

// API Methods
export const findStaticPages = async (
  data: StaticPageQueryDTO
): Promise<FBR<StaticPage[]>> => {
  return apiPost<FBR<StaticPage[]>, StaticPageQueryDTO>(ENDPOINTS.find, data);
};

export const createStaticPage = async (data: StaticPageDTO): Promise<SBR> => {
  return apiPost<SBR, StaticPageDTO>(ENDPOINTS.create, data);
};

export const updateStaticPage = async (
  id: string,
  data: StaticPageDTO
): Promise<SBR> => {
  return apiPatch<SBR, StaticPageDTO>(ENDPOINTS.update(id), data);
};

export const deleteStaticPage = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
