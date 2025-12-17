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
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { MasterVehicleModel } from './master_vehicle_model_service';
import { MasterVehicleSubModel } from './master_vehicle_sub_model_service';

const URL = 'master/vehicle/make';

const ENDPOINTS = {
  // MasterVehicleMake APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// MasterVehicleMake Interface
export interface MasterVehicleMake extends Record<string, unknown> {
  // Primary Fields
  vehicle_make_id: string;

  // Main Field Details
  vehicle_make: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  MasterVehicleModel?: MasterVehicleModel[];
  MasterVehicleSubModel?: MasterVehicleSubModel[];
  MasterVehicle?: MasterVehicle[];

  // Relations - Child Count
  _count?: {
    MasterVehicleModel?: number;
    MasterVehicleSubModel?: number;
    MasterVehicle?: number;
  };
}

// MasterVehicleMake Create/Update Schema
export const MasterVehicleMakeSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  vehicle_make: stringMandatory('Vehicle Make', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleMakeDTO = z.infer<typeof MasterVehicleMakeSchema>;

// MasterVehicleMake Query Schema
export const MasterVehicleMakeQuerySchema = BaseQuerySchema.extend({
  // Self Table
  vehicle_make_ids: multi_select_optional('MasterVehicleMake'), // Multi-Selection -> MasterVehicleMake

  // Relations - Parent
  organisation_ids: multi_select_optional('Organisation'), // Multi-Selection -> UserOrganisation
});
export type MasterVehicleMakeQueryDTO = z.infer<
  typeof MasterVehicleMakeQuerySchema
>;

// Convert MasterVehicleMake Data to API Payload
export const toMasterVehicleMakePayload = (row: MasterVehicleMake): MasterVehicleMakeDTO => ({
  organisation_id: row.organisation_id || '',

  vehicle_make: row.vehicle_make || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterVehicleMake Payload
export const newMasterVehicleMakePayload = (): MasterVehicleMakeDTO => ({
  organisation_id: '',

  vehicle_make: '',
  description: '',

  status: Status.Active,
});

// MasterVehicleMake APIs
export const findMasterVehicleMakes = async (data: MasterVehicleMakeQueryDTO): Promise<FBR<MasterVehicleMake[]>> => {
  return apiPost<FBR<MasterVehicleMake[]>, MasterVehicleMakeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleMake = async (data: MasterVehicleMakeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleMakeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleMake = async (id: string, data: MasterVehicleMakeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleMakeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleMake = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


// Cache APIs
export const getMasterVehicleMakeCache = async (organisation_id: string): Promise<FBR<MasterVehicleMake[]>> => {
  return apiGet<FBR<MasterVehicleMake[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleMakeCacheCount = async (organisation_id: string): Promise<FBR<MasterVehicleMake>> => {
  return apiGet<FBR<MasterVehicleMake>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleMakeCacheChild = async (organisation_id: string): Promise<FBR<MasterVehicleMake[]>> => {
  return apiGet<FBR<MasterVehicleMake[]>>(ENDPOINTS.cache_child(organisation_id));
};


