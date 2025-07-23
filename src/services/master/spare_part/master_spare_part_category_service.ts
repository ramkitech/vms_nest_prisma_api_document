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
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
//import { FleetSpareParts } from "@api/services/fleet/fleet_spare_parts_service";
import { MasterSparePartSubCategory } from '../../../services/master/spare_part/master_spare_part_sub_category_service';

const URL = 'master/spare_part/category';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache_admin: `${URL}/cache`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_child: (organisation_id: string): string =>
    `${URL}/cache_child/${organisation_id}`,
  cache_count: (organisation_id: string): string =>
    `${URL}/cache_count/${organisation_id}`,
};

// Spare Part Category Interface
export interface MasterSparePartCategory extends Record<string, unknown> {
  // Primary Fields
  spare_part_category_id: string;
  category_name: string; // Min: 3, Max: 50
  category_code: string; // Min: 2, Max: 10

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  MasterSparePartSubCategory: MasterSparePartSubCategory[];
  //FleetSpareParts: FleetSpareParts[];

  // Count
  _count?: {
    MasterSparePartSubCategory: number;
    FleetSpareParts: number;
  };
}

// ✅ Spare Part Category Create/Update Schema
export const MasterSparePartCategorySchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  category_name: stringMandatory('Category Name', 3, 50),
  category_code: stringMandatory('Category Code', 2, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterSparePartCategoryDTO = z.infer<
  typeof MasterSparePartCategorySchema
>;

// ✅ Spare Part Category Query Schema
export const SparePartCategoryQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  spare_part_category_ids: multi_select_optional('Spare Part Category'), // ✅ Multi-selection -> MasterSparePartCategory
});
export type SparePartCategoryQueryDTO = z.infer<
  typeof SparePartCategoryQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterSparePartCategoryPayload = (
  category: MasterSparePartCategory
): MasterSparePartCategoryDTO => ({
  organisation_id: category.organisation_id ?? '',
  category_name: category.category_name,
  category_code: category.category_code,
  status: category.status,
});

// Generate a new payload with default values
export const newMasterSparePartCategoryPayload =
  (): MasterSparePartCategoryDTO => ({
    organisation_id: '',
    category_name: '',
    category_code: '',
    status: Status.Active,
  });

// API Methods
export const findMasterSparePartCategories = async (
  data: SparePartCategoryQueryDTO
): Promise<FBR<MasterSparePartCategory[]>> => {
  return apiPost<FBR<MasterSparePartCategory[]>, SparePartCategoryQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterSparePartCategory = async (
  data: MasterSparePartCategoryDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterSparePartCategoryDTO>(ENDPOINTS.create, data);
};

export const updateMasterSparePartCategory = async (
  id: string,
  data: MasterSparePartCategoryDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterSparePartCategoryDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterSparePartCategory = async (
  id: string
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterSparePartCategoryCacheAdmin = async (): Promise<
  FBR<MasterSparePartCategory[]>
> => {
  return apiGet<FBR<MasterSparePartCategory[]>>(ENDPOINTS.cache_admin);
};

export const getMasterSparePartCategoryCache = async (
  organisation_id: string
): Promise<FBR<MasterSparePartCategory[]>> => {
  return apiGet<FBR<MasterSparePartCategory[]>>(
    ENDPOINTS.cache(organisation_id)
  );
};

export const getMasterSparePartCategoryCacheChild = async (
  organisation_id: string
): Promise<FBR<MasterSparePartCategory[]>> => {
  return apiGet<FBR<MasterSparePartCategory[]>>(
    ENDPOINTS.cache_child(organisation_id)
  );
};

export const getMasterSparePartCategoryCacheCount = async (
  organisation_id: string
): Promise<FBR<number>> => {
  return apiGet<FBR<number>>(ENDPOINTS.cache_count(organisation_id));
};
