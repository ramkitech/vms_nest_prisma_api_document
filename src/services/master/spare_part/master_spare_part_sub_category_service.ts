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
import { MasterSparePartCategory } from '../../../services/master/spare_part/master_spare_part_category_service';

const URL = 'master/spare_part/sub_category';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (
    organisation_id: string,
    spare_part_category_id: string = '0'
  ): string =>
    `${URL}/cache/${organisation_id}?spare_part_category_id=${spare_part_category_id}`,
};

// Spare Part Sub-Category Interface
export interface MasterSparePartSubCategory extends Record<string, unknown> {
  // Primary Fields
  spare_part_sub_category_id: string;
  sub_category_name: string; // Min: 3, Max: 50
  sub_category_code: string; // Min: 2, Max: 10

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;
  spare_part_category_id: string;
  MasterSparePartCategory?: MasterSparePartCategory;

  // Relations - Child
  //FleetSpareParts: FleetSpareParts[];

  // Count
  _count?: {
    FleetSpareParts: number;
  };
}

// ✅ Spare Part Sub-Category Create/Update Schema
export const MasterSparePartSubCategorySchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  spare_part_category_id: single_select_mandatory('Spare Part Category'), // ✅ Single-selection -> MasterSparePartCategory
  sub_category_name: stringMandatory('Sub Category Name', 3, 50),
  sub_category_code: stringMandatory('Sub Category Code', 2, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterSparePartSubCategoryDTO = z.infer<
  typeof MasterSparePartSubCategorySchema
>;

// ✅ Spare Part Sub-Category Query Schema
export const SparePartSubCategoryQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  spare_part_category_ids: multi_select_optional('Spare Part Category'), // ✅ Multi-selection -> MasterSparePartCategory
  spare_part_sub_category_ids: multi_select_optional('Spare Part Sub-Category'), // ✅ Multi-selection -> MasterSparePartSubCategory
});
export type SparePartSubCategoryQueryDTO = z.infer<
  typeof SparePartSubCategoryQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterSparePartSubCategoryPayload = (
  subCategory: MasterSparePartSubCategory
): MasterSparePartSubCategoryDTO => ({
  organisation_id: subCategory.organisation_id ?? '',
  spare_part_category_id: subCategory.spare_part_category_id,
  sub_category_name: subCategory.sub_category_name,
  sub_category_code: subCategory.sub_category_code,
  status: subCategory.status,
});

// Generate a new payload with default values
export const newMasterSparePartSubCategoryPayload =
  (): MasterSparePartSubCategoryDTO => ({
    organisation_id: '',
    spare_part_category_id: '',
    sub_category_name: '',
    sub_category_code: '',
    status: Status.Active,
  });

// API Methods
export const findMasterSparePartSubCategories = async (
  data: SparePartSubCategoryQueryDTO
): Promise<FBR<MasterSparePartSubCategory[]>> => {
  return apiPost<
    FBR<MasterSparePartSubCategory[]>,
    SparePartSubCategoryQueryDTO
  >(ENDPOINTS.find, data);
};

export const createMasterSparePartSubCategory = async (
  data: MasterSparePartSubCategoryDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterSparePartSubCategoryDTO>(ENDPOINTS.create, data);
};

export const updateMasterSparePartSubCategory = async (
  id: string,
  data: MasterSparePartSubCategoryDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterSparePartSubCategoryDTO>(
    ENDPOINTS.update(id),
    data
  );
};

export const deleteMasterSparePartSubCategory = async (
  id: string
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterSparePartSubCategoryCache = async (
  organisation_id: string,
  spare_part_category_id?: string
): Promise<FBR<MasterSparePartSubCategory[]>> => {
  return apiGet<FBR<MasterSparePartSubCategory[]>>(
    ENDPOINTS.cache(organisation_id, spare_part_category_id)
  );
};
