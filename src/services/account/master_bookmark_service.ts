// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../core/Enums';
import { UserBookmark } from './user_bookmark_service';

// Other Models

// URL and Endpoints
const URL = 'account/master_bookmarks';

const ENDPOINTS = {
  create_module: `${URL}/module`,
  find_module: `${URL}/module/search`,
  update_module: (id: string) => `${URL}/module/${id}`,
  delete_module: (id: string) => `${URL}/module/${id}`,

  // Sub Module
  create_sub_module: `${URL}/sub_module`,
  find_sub_module: `${URL}/sub_module/search`,
  update_sub_module: (id: string) => `${URL}/sub_module/${id}`,
  delete_sub_module: (id: string) => `${URL}/sub_module/${id}`,

  // Page
  create_page: `${URL}/page`,
  find_page: `${URL}/page/search`,
  update_page: (id: string) => `${URL}/page/${id}`,
  delete_page: (id: string) => `${URL}/page/${id}`,
};

// Bookmark Interface
export interface MasterBookmarkModule extends Record<string, unknown> {
  // Primary Fields
  bookmark_module_id: string;
  module_name: string;
  module_icon_name: string;
  sort_order: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Child Relations
  MasterBookmarkSubModule?: MasterBookmarkSubModule[];
  MasterBookmarkPage?: MasterBookmarkPage[];
  UserBookmark?: UserBookmark[];

  // Count
  _count?: {
    MasterBookmarkSubModule?: number;
    MasterBookmarkPage?: number;
    UserBookmark?: number;
  };
}

export interface MasterBookmarkSubModule extends Record<string, unknown> {
  // Primary Fields
  bookmark_sub_module_id: string;

  sub_module_name: string;
  sub_module_icon_name: string;
  sort_order: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  bookmark_module_id: string;
  MasterBookmarkModule?: MasterBookmarkModule;
  module_name?: string;

  // Child Relations
  MasterBookmarkPage?: MasterBookmarkPage[];
  UserBookmark?: UserBookmark[];

  // Count
  _count?: {
    MasterBookmarkPage?: number;
    UserBookmark?: number;
  };
}

export interface MasterBookmarkPage extends Record<string, unknown> {
  // Primary Fields
  bookmark_page_id: string;

  page_name: string;
  page_icon_name: string;
  page_url: string;
  sort_order: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  bookmark_module_id: string;
  MasterBookmarkModule?: MasterBookmarkModule;
  module_name?: string;

  bookmark_sub_module_id: string;
  MasterBookmarkSubModule?: MasterBookmarkSubModule;
  sub_module_name?: string;

  // Child Relations
  UserBookmark?: UserBookmark[];

  // Count
  _count?: {
    UserBookmark?: number;
  };
}

export const MasterBookmarkModuleSchema = z.object({
  // Main Field Details
  module_name: stringMandatory('Module Name', 1, 100),
  module_icon_name: stringOptional('Module Icon Name', 0, 100),
  sort_order: z.coerce.number().optional().default(0),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterBookmarkModuleDTO = z.infer<
  typeof MasterBookmarkModuleSchema
>;

export const MasterBookmarkSubModuleSchema = z.object({
  // Relations - Parent
  bookmark_module_id: single_select_mandatory('MasterBookmarkModule'),

  // Main Field Details
  sub_module_name: stringMandatory('Sub Module Name', 1, 100),
  sub_module_icon_name: stringOptional('Sub Module Icon Name', 0, 100),
  sort_order: z.coerce.number().optional().default(0),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterBookmarkSubModuleDTO = z.infer<
  typeof MasterBookmarkSubModuleSchema
>;

export const MasterBookmarkPageSchema = z.object({
  // Relations - Parent
  bookmark_module_id: single_select_mandatory('MasterBookmarkModule'),
  bookmark_sub_module_id: single_select_mandatory('MasterBookmarkSubModule'),

  // Main Field Details
  page_name: stringMandatory('Page Name', 1, 100),
  page_icon_name: stringOptional('Page Icon Name', 0, 100),
  page_url: stringMandatory('Page URL', 1, 300),
  sort_order: z.coerce.number().optional().default(0),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterBookmarkPageDTO = z.infer<typeof MasterBookmarkPageSchema>;

export const MasterBookmarkModuleQuerySchema = BaseQuerySchema.extend({
  // Self Table
  bookmark_module_ids: multi_select_optional('MasterBookmarkModule'),
});
export type MasterBookmarkModuleQueryDTO = z.infer<
  typeof MasterBookmarkModuleQuerySchema
>;

export const MasterBookmarkSubModuleQuerySchema = BaseQuerySchema.extend({
  // Self Table
  bookmark_sub_module_ids: multi_select_optional('MasterBookmarkSubModule'),

  // Relations - Parent
  bookmark_module_ids: multi_select_optional('MasterBookmarkModule'),
});
export type MasterBookmarkSubModuleQueryDTO = z.infer<
  typeof MasterBookmarkSubModuleQuerySchema
>;

export const MasterBookmarkPageQuerySchema = BaseQuerySchema.extend({
  // Self Table
  bookmark_page_ids: multi_select_optional('MasterBookmarkPage'),

  // Relations - Parent
  bookmark_module_ids: multi_select_optional('MasterBookmarkModule'),
  bookmark_sub_module_ids: multi_select_optional('MasterBookmarkSubModule'),
});
export type MasterBookmarkPageQueryDTO = z.infer<
  typeof MasterBookmarkPageQuerySchema
>;

// Convert MasterBookmarkModule Data to API Payload
export const toMasterBookmarkModulePayload = (row: MasterBookmarkModule): MasterBookmarkModuleDTO => ({
  module_name: row.module_name || '',
  module_icon_name: row.module_icon_name || '',
  sort_order: row.sort_order || 0,

  status: row.status || Status.Active,
});

// Create New MasterBookmarkModule Payload
export const newMasterBookmarkModulePayload = (): MasterBookmarkModuleDTO => ({
  module_name: '',
  module_icon_name: '',
  sort_order: 0,

  status: Status.Active
});

// Convert MasterBookmarkSubModule data to a payload structure
export const toMasterBookmarkSubModulePayload = (row: MasterBookmarkSubModule): MasterBookmarkSubModuleDTO => ({
  bookmark_module_id: row.bookmark_module_id || '',

  sort_order: row.sort_order || 0,
  sub_module_name: row.sub_module_name || '',
  sub_module_icon_name: row.sub_module_icon_name || '',

  status: row.status || Status.Active,
});

// Generate New MasterBookmarkSubModule Payload
export const newMasterBookmarkSubModulePayload = (): MasterBookmarkSubModuleDTO => ({
  bookmark_module_id: '',

  sub_module_name: '',
  sub_module_icon_name: '',
  sort_order: 0,

  status: Status.Active
});

// Convert MasterBookmarkPage data to a payload structure
export const toMasterBookmarkPagePayload = (row: MasterBookmarkPage): MasterBookmarkPageDTO => ({
  bookmark_module_id: row.bookmark_module_id || '',
  bookmark_sub_module_id: row.bookmark_sub_module_id || '',

  sort_order: row.sort_order || 0,

  page_name: row.page_name || '',
  page_icon_name: row.page_icon_name || '',
  page_url: row.page_url || '',

  status: row.status || Status.Active
});

// Generate New MasterBookmarkPage Payload
export const newMasterBookmarkPagePayload = (): MasterBookmarkPageDTO => ({
  bookmark_module_id: '',
  bookmark_sub_module_id: '',

  sort_order: 0,
  page_name: '',
  page_icon_name: '',
  page_url: '',

  status: Status.Active
});

// API Methods
export const createMasterBookmarkModule = async (data: MasterBookmarkModuleDTO): Promise<SBR> => {
  return apiPost<SBR, MasterBookmarkModuleDTO>(ENDPOINTS.create_module, data);
};

export const findMasterBookmarkModule = async (data: MasterBookmarkModuleQueryDTO): Promise<FBR<MasterBookmarkModule[]>> => {
  return apiPost<FBR<MasterBookmarkModule[]>, MasterBookmarkModuleQueryDTO>(ENDPOINTS.find_module, data,);
};

export const updateMasterBookmarkModule = async (id: string, data: MasterBookmarkModuleDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterBookmarkModuleDTO>(ENDPOINTS.update_module(id), data);
};

export const deleteMasterBookmarkModule = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_module(id));
};

// MasterBookmarkSubModule APIs
export const createMasterBookmarkSubModule = async (data: MasterBookmarkSubModuleDTO): Promise<SBR> => {
  return apiPost<SBR, MasterBookmarkSubModuleDTO>(ENDPOINTS.create_sub_module, data);
};

export const findMasterBookmarkSubModule = async (data: MasterBookmarkSubModuleQueryDTO): Promise<FBR<MasterBookmarkSubModule[]>> => {
  return apiPost<FBR<MasterBookmarkSubModule[]>, MasterBookmarkSubModuleQueryDTO>(ENDPOINTS.find_sub_module, data,);
};

export const updateMasterBookmarkSubModule = async (id: string, data: MasterBookmarkSubModuleDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterBookmarkSubModuleDTO>(ENDPOINTS.update_sub_module(id), data);
};

export const deleteMasterBookmarkSubModule = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_sub_module(id));
};

// MasterBookmarkPage APIs
export const createMasterBookmarkPage = async (data: MasterBookmarkPageDTO): Promise<SBR> => {
  return apiPost<SBR, MasterBookmarkPageDTO>(ENDPOINTS.create_page, data);
};

export const findMasterBookmarkPage = async (data: MasterBookmarkPageQueryDTO): Promise<FBR<MasterBookmarkPage[]>> => {
  return apiPost<FBR<MasterBookmarkPage[]>, MasterBookmarkPageQueryDTO>(ENDPOINTS.find_page, data,);
};

export const updateMasterBookmarkPage = async (id: string, data: MasterBookmarkPageDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterBookmarkPageDTO>(ENDPOINTS.update_page(id), data);
};

export const deleteMasterBookmarkPage = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_page(id));
};