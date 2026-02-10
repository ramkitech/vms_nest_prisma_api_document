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
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';

const URL = 'master/vehicle/fuel_type';

const ENDPOINTS = {
  // MasterVehicleFuelType APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// MasterVehicleFuelType Interface
export interface MasterVehicleFuelType extends Record<string, unknown> {
  // Primary Fields
  vehicle_fuel_type_id: string;

  // Main Field Details
  fuel_type: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;

  // Relations - Child
  // Child - MasterVehicle
  MasterVehicle_PrimaryFuelType?: MasterVehicle[];

  // Relations - Child Count
  _count?: {
    MasterVehicle_PrimaryFuelType?: number;
  };
}

// MasterVehicleFuelType Create/Update Schema
export const MasterVehicleFuelTypeSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  fuel_type: stringMandatory('Fuel Type', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleFuelTypeDTO = z.infer<
  typeof MasterVehicleFuelTypeSchema
>;

// MasterVehicleFuelType Query Schema
export const MasterVehicleFuelTypeQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fuel_type_ids: multi_select_optional('MasterVehicleFuelType'), // Multi-selection -> MasterVehicleFuelType

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterVehicleFuelTypeQueryDTO = z.infer<
  typeof MasterVehicleFuelTypeQuerySchema
>;

// Convert MasterVehicleFuelType Data to API Payload
export const toMasterVehicleFuelTypePayload = (row: MasterVehicleFuelType): MasterVehicleFuelTypeDTO => ({
  organisation_id: row.organisation_id || '',

  fuel_type: row.fuel_type || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterVehicleFuelType Payload
export const newMasterVehicleFuelTypePayload = (): MasterVehicleFuelTypeDTO => ({
  organisation_id: '',

  fuel_type: '',
  description: '',
  
  status: Status.Active,
});

// MasterVehicleFuelType APIs
export const findMasterVehicleFuelTypes = async (data: MasterVehicleFuelTypeQueryDTO): Promise<FBR<MasterVehicleFuelType[]>> => {
  return apiPost<FBR<MasterVehicleFuelType[]>, MasterVehicleFuelTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleFuelType = async (data: MasterVehicleFuelTypeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleFuelTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleFuelType = async (id: string, data: MasterVehicleFuelTypeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleFuelTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleFuelType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVehicleFuelTypeCache = async (organisation_id: string): Promise<FBR<MasterVehicleFuelType[]>> => {
  return apiGet<FBR<MasterVehicleFuelType[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleFuelTypeCacheCount = async (organisation_id: string): Promise<FBR<MasterVehicleFuelType>> => {
  return apiGet<FBR<MasterVehicleFuelType>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleFuelTypeCacheChild = async (organisation_id: string): Promise<FBR<MasterVehicleFuelType[]>> => {
  return apiGet<FBR<MasterVehicleFuelType[]>>(ENDPOINTS.cache_child(organisation_id));
};

