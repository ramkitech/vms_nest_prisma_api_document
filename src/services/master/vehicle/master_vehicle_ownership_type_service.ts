// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';

const URL = 'master/vehicle/ownership_type';

const ENDPOINTS = {
  // MasterVehicleOwnershipType APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// MasterVehicleOwnershipType Interface
export interface MasterVehicleOwnershipType extends Record<string, unknown> {
  // Primary Fields
  vehicle_ownership_type_id: string;
  ownership_type: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
}

// ✅ MasterVehicleOwnershipType Create/Update Schema
export const MasterVehicleOwnershipTypeSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  ownership_type: stringMandatory('Ownership Type', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleOwnershipTypeDTO = z.infer<
  typeof MasterVehicleOwnershipTypeSchema
>;

// ✅ MasterVehicleOwnershipType Query Schema
export const MasterVehicleOwnershipTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ownership_type_ids: multi_select_optional(
    'MasterVehicleOwnershipType',
  ), // ✅ Multi-selection -> MasterVehicleOwnershipType
});
export type MasterVehicleOwnershipTypeQueryDTO = z.infer<
  typeof MasterVehicleOwnershipTypeQuerySchema
>;

// Convert MasterVehicleOwnershipType Data to API Payload
export const toMasterVehicleOwnershipTypePayload = (row: MasterVehicleOwnershipType): MasterVehicleOwnershipTypeDTO => ({
  organisation_id: row.organisation_id || '',

  ownership_type: row.ownership_type || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterVehicleOwnershipType Payload
export const newMasterVehicleOwnershipTypePayload = (): MasterVehicleOwnershipTypeDTO => ({
  organisation_id: '',
  ownership_type: '',
  description: '',
  status: Status.Active,
});

// MasterVehicleOwnershipType APIs
export const findMasterVehicleOwnershipTypes = async (data: MasterVehicleOwnershipTypeQueryDTO): Promise<FBR<MasterVehicleOwnershipType[]>> => {
  return apiPost<FBR<MasterVehicleOwnershipType[]>, MasterVehicleOwnershipTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleOwnershipType = async (data: MasterVehicleOwnershipTypeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleOwnershipTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleOwnershipType = async (id: string, data: MasterVehicleOwnershipTypeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleOwnershipTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleOwnershipType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVehicleOwnershipTypeCache = async (organisation_id: string): Promise<FBR<MasterVehicleOwnershipType[]>> => {
  return apiGet<FBR<MasterVehicleOwnershipType[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleOwnershipTypeCacheCount = async (organisation_id: string): Promise<FBR<MasterVehicleOwnershipType>> => {
  return apiGet<FBR<MasterVehicleOwnershipType>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleOwnershipTypeCacheChild = async (organisation_id: string): Promise<FBR<MasterVehicleOwnershipType[]>> => {
  return apiGet<FBR<MasterVehicleOwnershipType[]>>(ENDPOINTS.cache_child(organisation_id));
};

