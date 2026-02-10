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
  stringUUIDMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterVehicleMake } from '../../../services/master/vehicle/master_vehicle_make_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { MasterVehicleSubModel } from './master_vehicle_sub_model_service';

const URL = 'master/vehicle/model';

const ENDPOINTS = {
  // MasterVehicleModel APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string, vehicle_make_id: string = ''): string => `${URL}/cache/${organisation_id}?vehicle_make_id=${vehicle_make_id}`,
  cache_count: (organisation_id: string, vehicle_make_id: string = ''): string => `${URL}/cache_count/${organisation_id}?vehicle_make_id=${vehicle_make_id}`,
  cache_child: (organisation_id: string, vehicle_make_id: string = ''): string => `${URL}/cache_child/${organisation_id}?vehicle_make_id=${vehicle_make_id}`,
};

// MasterVehicleModel Interface
export interface MasterVehicleModel extends Record<string, unknown> {
  // Primary Fields
  vehicle_model_id: string;

  // Main Field Details
  vehicle_model: string;
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

  vehicle_make_id: string;
  MasterVehicleMake: MasterVehicleMake;
  vehicle_make?: string;

  // Relations - Child
  MasterVehicleSubModel?: MasterVehicleSubModel[];
  MasterVehicle?: MasterVehicle[];

  // Relations - Child Count
  _count?: {
    MasterVehicleSubModel?: number;
    MasterVehicle?: number;
  };
}

// MasterVehicleModel Create/Update Schema
export const MasterVehicleModelSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  vehicle_make_id: single_select_mandatory('Vehicle Make'), // Single-Selection -> MasterVehicleMake

  // Main Field Details
  vehicle_model: stringMandatory('Vehicle Model', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleModelDTO = z.infer<typeof MasterVehicleModelSchema>;

// MasterVehicleModel Query Schema
export const MasterVehicleModelQuerySchema = BaseQuerySchema.extend({
  // Self Table
  vehicle_model_ids: multi_select_optional('MasterVehicleModel'), // Multi-Selection -> MasterVehicleModel

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  vehicle_make_ids: multi_select_optional('MasterVehicleMake'), // Multi-Selection -> MasterVehicleMake
});
export type MasterVehicleModelQueryDTO = z.infer<
  typeof MasterVehicleModelQuerySchema
>;

export const FindCacheSchema = z.object({
  vehicle_make_id: stringUUIDMandatory('vehicle_make_id'),
});
export type FindCacheDTO = z.infer<typeof FindCacheSchema>;

// Convert MasterVehicleModel Data to API Payload
export const toMasterVehicleModelPayload = (row: MasterVehicleModel): MasterVehicleModelDTO => ({
  organisation_id: row.organisation_id || '',
  vehicle_make_id: row.vehicle_make_id || '',

  vehicle_model: row.vehicle_model || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterVehicleModel Payload
export const newMasterVehicleModelPayload = (): MasterVehicleModelDTO => ({
  organisation_id: '',
  vehicle_make_id: '',

  vehicle_model: '',
  description: '',

  status: Status.Active,
});

// MasterVehicleModel APIs
export const findMasterVehicleModels = async (data: MasterVehicleModelQueryDTO): Promise<FBR<MasterVehicleModel[]>> => {
  return apiPost<FBR<MasterVehicleModel[]>, MasterVehicleModelQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleModel = async (data: MasterVehicleModelDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleModelDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleModel = async (id: string, data: MasterVehicleModelDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleModelDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleModel = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVehicleModelCache = async (organisation_id: string, vehicle_make_id?: string): Promise<FBR<MasterVehicleModel[]>> => {
  return apiGet<FBR<MasterVehicleModel[]>>(ENDPOINTS.cache(organisation_id, vehicle_make_id));
};

export const getMasterVehicleModelCacheCount = async (organisation_id: string, vehicle_make_id?: string): Promise<FBR<MasterVehicleModel[]>> => {
  return apiGet<FBR<MasterVehicleModel[]>>(ENDPOINTS.cache_count(organisation_id, vehicle_make_id));
};

export const getMasterVehicleModelCacheChild = async (organisation_id: string, vehicle_make_id?: string): Promise<FBR<MasterVehicleModel[]>> => {
  return apiGet<FBR<MasterVehicleModel[]>>(ENDPOINTS.cache_child(organisation_id, vehicle_make_id));
};

