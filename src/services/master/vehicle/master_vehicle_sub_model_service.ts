// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
  stringOptional,
  stringUUIDMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterVehicleModel } from '../../../services/master/vehicle/master_vehicle_model_service';
import { MasterVehicleMake } from './master_vehicle_make_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';

const URL = 'master/vehicle/sub_model';

const ENDPOINTS = {
  // MasterVehicleSubModel APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string, vehicle_model_id?: string): string => `${URL}/cache/${organisation_id}?vehicle_model_id=${vehicle_model_id || '0'}`,
  cache_count: (organisation_id: string, vehicle_model_id?: string): string => `${URL}/cache_count/${organisation_id}?vehicle_model_id=${vehicle_model_id || '0'}`,
  cache_child: (organisation_id: string, vehicle_model_id?: string): string => `${URL}/cache_child/${organisation_id}?vehicle_model_id=${vehicle_model_id || '0'}`,
};

// MasterVehicleSubModel Interface
export interface MasterVehicleSubModel extends Record<string, unknown> {
  // Primary Fields
  vehicle_sub_model_id: string;

  // Main Field Details
  vehicle_sub_model: string;
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

  vehicle_make_id?: string;
  MasterVehicleMake?: MasterVehicleMake;
  vehicle_make?: string;

  vehicle_model_id: string;
  MasterVehicleModel?: MasterVehicleModel;
  vehicle_model?: string;

  // Relations - Child
  MasterVehicle?: MasterVehicle[];

  // Relations - Child Count
  _count?: {
    MasterVehicle?: number;
  };
}

// MasterVehicleSubModel Create/Update Schema
export const MasterVehicleSubModelSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  vehicle_make_id: single_select_mandatory('MasterVehicleMake'), // Single-Selection -> MasterVehicleMake
  vehicle_model_id: single_select_mandatory('MasterVehicleModel'), // Single-Selection -> MasterVehicleModel

  // Main Field Details
  vehicle_sub_model: stringMandatory('Vehicle Sub Model', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleSubModelDTO = z.infer<
  typeof MasterVehicleSubModelSchema
>;

// MasterVehicleSubModel Query Schema
export const MasterVehicleSubModelQuerySchema = BaseQuerySchema.extend({
  // Self Table
  vehicle_sub_model_ids: multi_select_optional('MasterVehicleSubModel'), // Multi-Selection -> MasterVehicleSubModel

  // Parents
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  vehicle_make_ids: multi_select_optional('MasterVehicleMake'), // Multi-Selection -> MasterVehicleMake
  vehicle_model_ids: multi_select_optional('MasterVehicleModel'), // Multi-Selection -> MasterVehicleModel
});
export type MasterVehicleSubModelQueryDTO = z.infer<
  typeof MasterVehicleSubModelQuerySchema
>;

export const FindCacheSchema = z.object({
  vehicle_model_id: stringUUIDMandatory('vehicle_model_id'),
});
export type FindCacheDTO = z.infer<typeof FindCacheSchema>;

// Convert MasterVehicleSubModel Data to API Payload
export const toMasterVehicleSubModelPayload = (row: MasterVehicleSubModel): MasterVehicleSubModelDTO => ({
  organisation_id: row.organisation_id || '',
  vehicle_make_id: row.vehicle_make_id || '',
  vehicle_model_id: row.vehicle_model_id || '',

  vehicle_sub_model: row.vehicle_sub_model || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterVehicleSubModel Payload
export const newMasterVehicleSubModelPayload = (): MasterVehicleSubModelDTO => ({
  organisation_id: '',
  vehicle_model_id: '',
  vehicle_make_id: '',

  vehicle_sub_model: '',
  description: '',

  status: Status.Active,
});

// MasterVehicleSubModel APIs
export const findMasterVehicleSubModels = async (data: MasterVehicleSubModelQueryDTO): Promise<FBR<MasterVehicleSubModel[]>> => {
  return apiPost<FBR<MasterVehicleSubModel[]>, MasterVehicleSubModelQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleSubModel = async (data: MasterVehicleSubModelDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleSubModelDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleSubModel = async (id: string, data: MasterVehicleSubModelDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleSubModelDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleSubModel = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVehicleSubModelCache = async (organisation_id: string, vehicle_model_id?: string): Promise<FBR<MasterVehicleSubModel[]>> => {
  return apiGet<FBR<MasterVehicleSubModel[]>>(ENDPOINTS.cache(organisation_id, vehicle_model_id));
};

export const getMasterVehicleSubModelCacheCount = async (organisation_id: string, vehicle_model_id?: string): Promise<FBR<MasterVehicleSubModel[]>> => {
  return apiGet<FBR<MasterVehicleSubModel[]>>(ENDPOINTS.cache_count(organisation_id, vehicle_model_id));
};

export const getMasterVehicleSubModelCacheChild = async (organisation_id: string, vehicle_model_id?: string): Promise<FBR<MasterVehicleSubModel[]>> => {
  return apiGet<FBR<MasterVehicleSubModel[]>>(ENDPOINTS.cache_child(organisation_id, vehicle_model_id));
};

