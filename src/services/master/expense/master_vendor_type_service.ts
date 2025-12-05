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

const URL = 'master/expense/vendor_type';

const ENDPOINTS = {
  // MasterVendorType APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// VendorType Interface
export interface MasterVendorType extends Record<string, unknown> {
  // Primary Fields
  vendor_type_id: string;
  vendor_type: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
}

// ✅ MasterVendorType Create/Update Schema
export const MasterVendorTypeSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  vendor_type: stringMandatory('Vendor Type', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVendorTypeDTO = z.infer<typeof MasterVendorTypeSchema>;

// ✅ MasterVendorType Query Schema
export const MasterVendorTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  vendor_type_ids: multi_select_optional('MasterVendorType'), // ✅ Multi-selection -> MasterVendorType
});
export type MasterVendorTypeQueryDTO = z.infer<
  typeof MasterVendorTypeQuerySchema
>;

// Convert MasterVendorType Data to API Payload
export const toMasterVendorTypePayload = (row: MasterVendorType): MasterVendorTypeDTO => ({
  organisation_id: row.organisation_id || '',
  vendor_type: row.vendor_type || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterVendorType Payload
export const newMasterVendorTypePayload = (): MasterVendorTypeDTO => ({
  organisation_id: '',
  vendor_type: '',
  description: '',
  status: Status.Active,
});

// MasterVendorType APIs
export const findMasterVendorTypes = async (data: MasterVendorTypeQueryDTO): Promise<FBR<MasterVendorType[]>> => {
  return apiPost<FBR<MasterVendorType[]>, MasterVendorTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVendorType = async (data: MasterVendorTypeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVendorTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVendorType = async (id: string, data: MasterVendorTypeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVendorTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVendorType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVendorTypeCache = async (organisation_id: string): Promise<FBR<MasterVendorType[]>> => {
  return apiGet<FBR<MasterVendorType[]>>(ENDPOINTS.cache(organisation_id));
};
