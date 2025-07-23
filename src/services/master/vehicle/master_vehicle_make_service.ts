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
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterVehicleModel } from '../../../services/master/vehicle/master_vehicle_model_service';
import { MasterVehicle } from '../../../services/main/vehicle/master_vehicle_service';

const URL = 'master/vehicle/make';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache_admin: `${URL}/cache`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_child: (organisation_id: string): string =>
    `${URL}/cache_child/${organisation_id}`,
};

// Vehicle Make Interface
export interface MasterVehicleMake extends Record<string, unknown> {
  // Primary Fields
  vehicle_make_id: string;
  vehicle_make: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  MasterVehicleModel: MasterVehicleModel[];
  MasterVehicle: MasterVehicle[];

  // Count
  _count?: {
    MasterVehicleModel: number;
    MasterVehicle: number;
  };
}

// ✅ Vehicle Make Create/Update Schema
export const MasterVehicleMakeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  vehicle_make: stringMandatory('Vehicle Make', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleMakeDTO = z.infer<typeof MasterVehicleMakeSchema>;

// ✅ Vehicle Make Query Schema
export const MasterVehicleMakeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_make_ids: multi_select_optional('Vehicle Make'), // ✅ Multi-selection -> MasterVehicleMake
});
export type MasterVehicleMakeQueryDTO = z.infer<
  typeof MasterVehicleMakeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterVehicleMakePayload = (
  vehicleMake: MasterVehicleMake
): MasterVehicleMakeDTO => ({
  organisation_id: vehicleMake.organisation_id ?? '',
  vehicle_make: vehicleMake.vehicle_make,
  status: vehicleMake.status,
});

// Generate a new payload with default values
export const newMasterVehicleMakePayload = (): MasterVehicleMakeDTO => ({
  organisation_id: '',
  vehicle_make: '',
  status: Status.Active,
});

// API Methods
export const findMasterVehicleMakes = async (
  data: MasterVehicleMakeQueryDTO
): Promise<FBR<MasterVehicleMake[]>> => {
  return apiPost<FBR<MasterVehicleMake[]>, MasterVehicleMakeQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterVehicleMake = async (
  data: MasterVehicleMakeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleMakeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleMake = async (
  id: string,
  data: MasterVehicleMakeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleMakeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleMake = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterVehicleMakeCacheAdmin = async (): Promise<
  FBR<MasterVehicleMake[]>
> => {
  return apiGet<FBR<MasterVehicleMake[]>>(ENDPOINTS.cache_admin);
};

export const getMasterVehicleMakeCache = async (
  organisation_id: string
): Promise<FBR<MasterVehicleMake[]>> => {
  return apiGet<FBR<MasterVehicleMake[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleMakeCacheChild = async (
  organisation_id: string
): Promise<FBR<MasterVehicleMake[]>> => {
  return apiGet<FBR<MasterVehicleMake[]>>(
    ENDPOINTS.cache_child(organisation_id)
  );
};
