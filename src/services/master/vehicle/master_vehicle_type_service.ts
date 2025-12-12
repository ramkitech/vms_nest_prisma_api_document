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

const URL = 'master/vehicle/vehicle_type';

const ENDPOINTS = {
  // MasterVehicleType APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// MasterVehicleType Interface
export interface MasterVehicleType extends Record<string, unknown> {
  // Primary Fields
  vehicle_type_id: string;
  vehicle_type: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
}

// MasterVehicleType Create/Update Schema
export const MasterVehicleTypeSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  vehicle_type: stringMandatory('Vehicle Type', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleTypeDTO = z.infer<typeof MasterVehicleTypeSchema>;

// MasterVehicleType Query Schema
export const MasterVehicleTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  vehicle_type_ids: multi_select_optional('MasterVehicleType'), // Multi-selection -> MasterVehicleType
});
export type MasterVehicleTypeQueryDTO = z.infer<
  typeof MasterVehicleTypeQuerySchema
>;

// Convert MasterVehicleType Data to API Payload
export const toMasterVehicleTypePayload = (row: MasterVehicleType): MasterVehicleTypeDTO => ({
  organisation_id: row.organisation_id || '',

  vehicle_type: row.vehicle_type || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterVehicleType Payload
export const newMasterVehicleTypePayload = (): MasterVehicleTypeDTO => ({
  organisation_id: '',
  vehicle_type: '',
  description: '',
  status: Status.Active,
});

// MasterVehicleType APIs
export const findMasterVehicleTypes = async (data: MasterVehicleTypeQueryDTO): Promise<FBR<MasterVehicleType[]>> => {
  return apiPost<FBR<MasterVehicleType[]>, MasterVehicleTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleType = async (data: MasterVehicleTypeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleType = async (id: string, data: MasterVehicleTypeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVehicleTypeCache = async (organisation_id: string): Promise<FBR<MasterVehicleType[]>> => {
  return apiGet<FBR<MasterVehicleType[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleTypeCacheCount = async (organisation_id: string): Promise<FBR<MasterVehicleType>> => {
  return apiGet<FBR<MasterVehicleType>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleTypeCacheChild = async (organisation_id: string): Promise<FBR<MasterVehicleType[]>> => {
  return apiGet<FBR<MasterVehicleType[]>>(ENDPOINTS.cache_child(organisation_id));
};

