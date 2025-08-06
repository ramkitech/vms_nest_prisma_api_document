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
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { MasterVehicle } from '../../main/vehicle/master_vehicle_service';

const URL = 'master/vehicle/vehicle_document_type';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

//  MasterVehicleDocumentType Interface
export interface MasterVehicleDocumentType extends Record<string, unknown> {
  // Primary Fields
  document_type_id: string;
  document_type: string; // Min: 3, Max: 100
  description?: string; // Optional, Max: 300

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  // VehicleDocument: VehicleDocument[];

  // Count
  _count?: {
    VehicleDocument: number;
  };
}

// ✅ MasterVehicleDocumentType Create/Update Schema
export const MasterVehicleDocumentTypeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  document_type: stringMandatory('Document Type', 3, 100),
  description: stringOptional('Description', 0, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleDocumentTypeDTO = z.infer<
  typeof MasterVehicleDocumentTypeSchema
>;

// ✅ MasterVehicleDocumentType Query Schema
export const MasterVehicleDocumentTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  document_type_ids: multi_select_optional('Document Type'), // ✅ Multi-selection -> MasterVehicleDocumentType
});
export type MasterVehicleDocumentTypeQueryDTO = z.infer<
  typeof MasterVehicleDocumentTypeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterVehicleDocumentTypePayload = (
  row: MasterVehicleDocumentType
): MasterVehicleDocumentTypeDTO => ({
  organisation_id: row.organisation_id ?? '',
  document_type: row.document_type,
  description: row.description || '',
  status: row.status,
});

// Generate a new payload with default values
export const newMasterVehicleDocumentTypePayload =
  (): MasterVehicleDocumentTypeDTO => ({
    organisation_id: '',
    document_type: '',
    description: '',
    status: Status.Active,
  });

// API Methods
export const findMasterVehicleDocumentTypes = async (
  data: MasterVehicleDocumentTypeQueryDTO
): Promise<FBR<MasterVehicleDocumentType[]>> => {
  return apiPost<FBR<MasterVehicleDocumentType[]>, MasterVehicleDocumentTypeQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterVehicleDocumentType = async (
  data: MasterVehicleDocumentTypeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleDocumentTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleDocumentType = async (
  id: string,
  data: MasterVehicleDocumentTypeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleDocumentTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleDocumentType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterVehicleDocumentTypeCache = async (
  organisation_id: string
): Promise<FBR<MasterVehicleDocumentType[]>> => {
  return apiGet<FBR<MasterVehicleDocumentType[]>>(ENDPOINTS.cache(organisation_id));
};
