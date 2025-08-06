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
import { UserOrganisation } from '../../main/users/user_organisation_service';

// URL & Endpoints
const URL = 'master/expense/vendor_document_type';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Vendor Type Interface
export interface MasterVendorDocumentType extends Record<string, unknown> {
  // Primary Fields
  document_type_id: string;
  document_type: string; // Min: 3, Max: 100
  description?: string; // Optional, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;
}

// ✅ MasterVendorDocumentType Create/Update Schema
export const MasterVendorDocumentTypeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  document_type: stringMandatory('Document Type', 3, 100),
  description: stringOptional('Description', 0, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVendorDocumentTypeDTO = z.infer<
  typeof MasterVendorDocumentTypeSchema
>;

// ✅ MasterVendorDocumentType Query Schema
export const MasterVendorDocumentTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  document_type_ids: multi_select_optional('Document Type'), // ✅ Multi-selection -> MasterVendorDocumentType
});
export type MasterVendorDocumentTypeQueryDTO = z.infer<
  typeof MasterVendorDocumentTypeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterVendorDocumentTypePayload = (
  masterVendorDocumentType: MasterVendorDocumentType
): MasterVendorDocumentTypeDTO => ({
  organisation_id: masterVendorDocumentType.organisation_id ?? '',
  document_type: masterVendorDocumentType.document_type,
  description: masterVendorDocumentType.description ?? '',
  status: masterVendorDocumentType.status,
});

// Generate a new payload with default values
export const newMasterVendorDocumentTypePayload = (): MasterVendorDocumentTypeDTO => ({
  organisation_id: '',
  document_type: '',
  description: '',
  status: Status.Active,
});

// API Methods
export const findMasterVendorDocumentTypes = async (
  data: MasterVendorDocumentTypeQueryDTO
): Promise<FBR<MasterVendorDocumentType[]>> => {
  return apiPost<FBR<MasterVendorDocumentType[]>, MasterVendorDocumentTypeQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterVendorDocumentType = async (
  data: MasterVendorDocumentTypeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterVendorDocumentTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVendorDocumentType = async (
  id: string,
  data: MasterVendorDocumentTypeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterVendorDocumentTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVendorDocumentType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterVendorDocumentTypeCache = async (
  organisation_id: string
): Promise<FBR<MasterVendorDocumentType[]>> => {
  return apiGet<FBR<MasterVendorDocumentType[]>>(ENDPOINTS.cache(organisation_id));
};
