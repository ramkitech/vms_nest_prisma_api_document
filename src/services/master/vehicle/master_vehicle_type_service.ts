// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from 'core/apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// Other Models
import { UserOrganisation } from 'services/main/users/user_organisation_service';
import { MasterVehicle } from 'services/main/vehicle/master_vehicle_service';

// URL & Endpoints
const URL = 'master/vehicle/vehicle_type';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cacheChild: (organisation_id: string): string =>
    `${URL}/cache_child/${organisation_id}`,
  cacheCount: (organisation_id: string): string =>
    `${URL}/cache_count/${organisation_id}`,
};

// Vehicle Type Interface
export interface MasterVehicleType extends Record<string, unknown> {
  // Primary Fields
  vehicle_type_id: string;
  vehicle_type: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  MasterVehicle: MasterVehicle[];

  // Count
  _count?: {
    MasterVehicle: number;
  };
}

// ✅ Vehicle Type Create/Update Schema
export const MasterVehicleTypeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  vehicle_type: stringMandatory('Vehicle Type', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleTypeDTO = z.infer<typeof MasterVehicleTypeSchema>;

// ✅ Vehicle Type Query Schema
export const MasterVehicleTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_type_ids: multi_select_optional('Vehicle Type'), // ✅ Multi-selection -> MasterVehicleType
});
export type MasterVehicleTypeQueryDTO = z.infer<
  typeof MasterVehicleTypeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterVehicleTypePayload = (
  vehicleType: MasterVehicleType
): MasterVehicleTypeDTO => ({
  organisation_id: vehicleType.organisation_id ?? '',
  vehicle_type: vehicleType.vehicle_type,
  status: vehicleType.status,
});

// Generate a new payload with default values
export const newMasterVehicleTypePayload = (): MasterVehicleTypeDTO => ({
  organisation_id: '',
  vehicle_type: '',
  status: Status.Active,
});

// API Methods
export const findMasterVehicleTypes = async (
  data: MasterVehicleTypeQueryDTO
): Promise<FBR<MasterVehicleType[]>> => {
  return apiPost<FBR<MasterVehicleType[]>, MasterVehicleTypeQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterVehicleType = async (
  data: MasterVehicleTypeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleType = async (
  id: string,
  data: MasterVehicleTypeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterVehicleTypeCache = async (
  organisation_id: string
): Promise<FBR<MasterVehicleType[]>> => {
  return apiGet<FBR<MasterVehicleType[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleTypeCacheChild = async (
  organisation_id: string
): Promise<FBR<MasterVehicleType[]>> => {
  return apiGet<FBR<MasterVehicleType[]>>(
    ENDPOINTS.cacheChild(organisation_id)
  );
};

export const getMasterVehicleTypeCacheCount = async (
  organisation_id: string
): Promise<FBR<number>> => {
  return apiGet<FBR<number>>(ENDPOINTS.cacheCount(organisation_id));
};
