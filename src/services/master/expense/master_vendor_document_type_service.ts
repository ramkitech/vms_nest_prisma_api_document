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
import { FleetVendorDocument } from 'src/services/fleet/vendor_management/fleet_vendor_service';

// URL & Endpoints
const URL = 'master/expense/vendor_document_type';

const ENDPOINTS = {
  // MasterVendorDocumentType APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterVendorDocumentType Interface
export interface MasterVendorDocumentType extends Record<string, unknown> {
  // Primary Fields
  document_type_id: string;

  // Main Field Details
  document_type: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
}

// MasterVendorDocumentType Create/Update Schema
export const MasterVendorDocumentTypeSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  document_type: stringMandatory('Document Type', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVendorDocumentTypeDTO = z.infer<
  typeof MasterVendorDocumentTypeSchema
>;

// MasterVendorDocumentType Query Schema
export const MasterVendorDocumentTypeQuerySchema = BaseQuerySchema.extend({
  // Self Table
  document_type_ids: multi_select_optional('MasterVendorDocumentType'), // Multi-Selection -> MasterVendorDocumentType

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
});
export type MasterVendorDocumentTypeQueryDTO = z.infer<
  typeof MasterVendorDocumentTypeQuerySchema
>;

// Convert MasterVendorDocumentType Data to API Payload
export const toMasterVendorDocumentTypePayload = (row: MasterVendorDocumentType): MasterVendorDocumentTypeDTO => ({
  organisation_id: row.organisation_id || '',

  document_type: row.document_type || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterVendorDocumentType Payload
export const newMasterVendorDocumentTypePayload = (): MasterVendorDocumentTypeDTO => ({
  organisation_id: '',

  document_type: '',
  description: '',

  status: Status.Active,
});

// MasterVendorDocumentType APIs
export const findMasterVendorDocumentTypes = async (data: MasterVendorDocumentTypeQueryDTO): Promise<FBR<MasterVendorDocumentType[]>> => {
  return apiPost<FBR<MasterVendorDocumentType[]>, MasterVendorDocumentTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVendorDocumentType = async (data: MasterVendorDocumentTypeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVendorDocumentTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVendorDocumentType = async (id: string, data: MasterVendorDocumentTypeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVendorDocumentTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVendorDocumentType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVendorDocumentTypeCache = async (organisation_id: string): Promise<FBR<MasterVendorDocumentType[]>> => {
  return apiGet<FBR<MasterVendorDocumentType[]>>(ENDPOINTS.cache(organisation_id));
};

