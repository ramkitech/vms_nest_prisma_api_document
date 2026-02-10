// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
  stringOptional,
  stringUUIDMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
//import { FleetSpareParts } from "@api/services/fleet/fleet_spare_parts_service";
import { MasterSparePartCategory } from '../../../services/master/spare_part/master_spare_part_category_service';

const URL = 'master/spare_part/sub_category';

const ENDPOINTS = {
  // MasterSparePartSubCategory APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string, spare_part_category_id: string = '0'): string => `${URL}/cache/${organisation_id}?spare_part_category_id=${spare_part_category_id}`,
  cache_count: (organisation_id: string, spare_part_category_id: string = '0'): string => `${URL}/cache_count/${organisation_id}?spare_part_category_id=${spare_part_category_id}`,
};

// MasterSparePartSubCategory Interface
export interface MasterSparePartSubCategory extends Record<string, unknown> {
  // Primary Fields
  spare_part_sub_category_id: string;

  // Main Field Details
  sub_category_name: string;
  sub_category_code: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;

  spare_part_category_id: string;
  MasterSparePartCategory?: MasterSparePartCategory;

  // Relations - Child
  // Child - Fleet
  // FleetSpareParts?: FleetSpareParts[];

  // Relations - Child Count
  _count?: {
    FleetSpareParts?: number;
  };
}

// MasterSparePartSubCategory Create/Update Schema
export const MasterSparePartSubCategorySchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  spare_part_category_id: single_select_mandatory('MasterSparePartCategory'), // Single-Selection -> MasterSparePartCategory

  // Main Field Details
  sub_category_name: stringMandatory('Sub Category Name', 3, 50),
  sub_category_code: stringMandatory('Sub Category Code', 2, 10),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterSparePartSubCategoryDTO = z.infer<
  typeof MasterSparePartSubCategorySchema
>;

// MasterSparePartSubCategory Query Schema
export const SparePartSubCategoryQuerySchema = BaseQuerySchema.extend({
  // Self Table
  spare_part_sub_category_ids: multi_select_optional(
    'MasterSparePartSubCategory',
  ), // Multi-selection -> MasterSparePartSubCategory

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  spare_part_category_ids: multi_select_optional('MasterSparePartCategory'), // Multi-selection -> MasterSparePartCategory
});
export type SparePartSubCategoryQueryDTO = z.infer<
  typeof SparePartSubCategoryQuerySchema
>;

export const FindCacheSchema = z.object({
  spare_part_category_id: stringUUIDMandatory('spare_part_category_id'),
});
export type FindCacheDTO = z.infer<typeof FindCacheSchema>;

// Convert MasterSparePartSubCategory Data to API Payload
export const toMasterSparePartSubCategoryPayload = (row: MasterSparePartSubCategory): MasterSparePartSubCategoryDTO => ({
  organisation_id: row.organisation_id || '',
  spare_part_category_id: row.spare_part_category_id || '',

  sub_category_name: row.sub_category_name || '',
  sub_category_code: row.sub_category_code || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterSparePartSubCategory Payload
export const newMasterSparePartSubCategoryPayload = (): MasterSparePartSubCategoryDTO => ({
  organisation_id: '',
  spare_part_category_id: '',

  sub_category_name: '',
  sub_category_code: '',
  description: '',
  
  status: Status.Active,
});

// MasterSparePartSubCategory APIs
export const findMasterSparePartSubCategories = async (data: SparePartSubCategoryQueryDTO): Promise<FBR<MasterSparePartSubCategory[]>> => {
  return apiPost<FBR<MasterSparePartSubCategory[]>, SparePartSubCategoryQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterSparePartSubCategory = async (data: MasterSparePartSubCategoryDTO): Promise<SBR> => {
  return apiPost<SBR, MasterSparePartSubCategoryDTO>(ENDPOINTS.create, data);
};

export const updateMasterSparePartSubCategory = async (id: string, data: MasterSparePartSubCategoryDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterSparePartSubCategoryDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterSparePartSubCategory = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterSparePartSubCategoryCache = async (organisation_id: string, spare_part_category_id?: string): Promise<FBR<MasterSparePartSubCategory[]>> => {
  return apiGet<FBR<MasterSparePartSubCategory[]>>(ENDPOINTS.cache(organisation_id, spare_part_category_id));
};

export const getMasterSparePartSubCategoryCacheCount = async (organisation_id: string, spare_part_category_id?: string): Promise<FBR<MasterSparePartSubCategory[]>> => {
  return apiGet<FBR<MasterSparePartSubCategory[]>>(ENDPOINTS.cache_count(organisation_id, spare_part_category_id));
};

