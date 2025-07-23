// Imports
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
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';

// URL & Endpoints
const URL = 'master/expense/vendor_type';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Vendor Type Interface
export interface MasterVendorType extends Record<string, unknown> {
  // Primary Fields
  vendor_type_id: string;
  vendor_type: string; // Min: 3, Max: 100
  description?: string; // Optional, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;
}

// ✅ Vendor Type Create/Update Schema
export const MasterVendorTypeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  vendor_type: stringMandatory('Vendor Type', 3, 100),
  description: stringOptional('Description', 0, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVendorTypeDTO = z.infer<typeof MasterVendorTypeSchema>;

// ✅ Vendor Type Query Schema
export const MasterVendorTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  vendor_type_ids: multi_select_optional('Vendor Type'), // ✅ Multi-selection -> MasterVendorType
});
export type MasterVendorTypeQueryDTO = z.infer<
  typeof MasterVendorTypeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterVendorTypePayload = (
  vendorType: MasterVendorType
): MasterVendorTypeDTO => ({
  organisation_id: vendorType.organisation_id ?? '',
  vendor_type: vendorType.vendor_type,
  description: vendorType.description ?? '',
  status: vendorType.status,
});

// Generate a new payload with default values
export const newMasterVendorTypePayload = (): MasterVendorTypeDTO => ({
  organisation_id: '',
  vendor_type: '',
  description: '',
  status: Status.Active,
});

// API Methods
export const findMasterVendorTypes = async (
  data: MasterVendorTypeQueryDTO
): Promise<FBR<MasterVendorType[]>> => {
  return apiPost<FBR<MasterVendorType[]>, MasterVendorTypeQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterVendorType = async (
  data: MasterVendorTypeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterVendorTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVendorType = async (
  id: string,
  data: MasterVendorTypeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterVendorTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVendorType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterVendorTypeCache = async (
  organisation_id: string
): Promise<FBR<MasterVendorType[]>> => {
  return apiGet<FBR<MasterVendorType[]>>(ENDPOINTS.cache(organisation_id));
};
