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

const URL = 'master/expense/vendor_tag';

const ENDPOINTS = {
  // MasterVendorTag APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterVendorTag Interface
export interface MasterVendorTag extends Record<string, unknown> {
  // Primary Fields
  vendor_tag_id: string;

  // Main Field Details
  vendor_tag: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
}

// MasterVendorTag Create/Update Schema
export const MasterVendorTagSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  vendor_tag: stringMandatory('Vendor Tag', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVendorTagDTO = z.infer<typeof MasterVendorTagSchema>;

// MasterVendorTag Query Schema
export const MasterVendorTagQuerySchema = BaseQuerySchema.extend({
  // Self Table
  vendor_tag_ids: multi_select_optional('MasterVendorTag'), // Multi-selection -> MasterVendorTag

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterVendorTagQueryDTO = z.infer<
  typeof MasterVendorTagQuerySchema
>;

// Convert MasterVendorTag Data to API Payload
export const toMasterVendorTagPayload = (row: MasterVendorTag): MasterVendorTagDTO => ({
  organisation_id: row.organisation_id || '',

  vendor_tag: row.vendor_tag || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterVendorTag Payload
export const newMasterVendorTagPayload = (): MasterVendorTagDTO => ({
  organisation_id: '',

  vendor_tag: '',
  description: '',

  status: Status.Active,
});

// MasterVendorTag APIs
export const findMasterVendorTags = async (data: MasterVendorTagQueryDTO): Promise<FBR<MasterVendorTag[]>> => {
  return apiPost<FBR<MasterVendorTag[]>, MasterVendorTagQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVendorTag = async (data: MasterVendorTagDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVendorTagDTO>(ENDPOINTS.create, data);
};

export const updateMasterVendorTag = async (id: string, data: MasterVendorTagDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVendorTagDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVendorTag = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVendorTagCache = async (organisation_id: string): Promise<FBR<MasterVendorTag[]>> => {
  return apiGet<FBR<MasterVendorTag[]>>(ENDPOINTS.cache(organisation_id));
};
