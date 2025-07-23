// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'core/apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// Other Models
import { UserOrganisation } from 'services/main/users/user_organisation_service';
import { MasterVehicleMake } from 'services/master/vehicle/master_vehicle_make_service';
import { MasterVehicle } from 'services/main/vehicle/master_vehicle_service';
import { MasterVehicleSubModel } from 'services/master/vehicle/master_vehicle_sub_model_service';

const URL = 'master/vehicle/model';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string, vehicle_make_id: string = ''): string =>
    `${URL}/cache/${organisation_id}?vehicle_make_id=${vehicle_make_id}`,
};

// Vehicle Model Interface
export interface MasterVehicleModel extends Record<string, unknown> {
  // Primary Fields
  vehicle_model_id: string;
  vehicle_model: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  vehicle_make_id: string;
  MasterVehicleMake: MasterVehicleMake;

  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  MasterVehicleSubModel: MasterVehicleSubModel[];
  MasterVehicle: MasterVehicle[];

  // Count
  _count?: {
    MasterVehicleSubModel: number;
    MasterVehicle: number;
  };
}

// ✅ Vehicle Model Create/Update Schema
export const MasterVehicleModelSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  vehicle_make_id: single_select_mandatory('Vehicle Make'), // ✅ Single-selection -> MasterVehicleMake
  vehicle_model: stringMandatory('Vehicle Model', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleModelDTO = z.infer<typeof MasterVehicleModelSchema>;

// ✅ Vehicle Model Query Schema
export const MasterVehicleModelQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_make_ids: multi_select_optional('Vehicle Make'), // ✅ Multi-selection -> MasterVehicleMake
  vehicle_model_ids: multi_select_optional('Vehicle Model'), // ✅ Multi-selection -> MasterVehicleModel
});
export type MasterVehicleModelQueryDTO = z.infer<
  typeof MasterVehicleModelQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterVehicleModelPayload = (
  vehicleModel: MasterVehicleModel
): MasterVehicleModelDTO => ({
  organisation_id: vehicleModel.organisation_id ?? '',
  vehicle_make_id: vehicleModel.vehicle_make_id,
  vehicle_model: vehicleModel.vehicle_model,
  status: vehicleModel.status,
});

// Generate a new payload with default values
export const newMasterVehicleModelPayload = (): MasterVehicleModelDTO => ({
  organisation_id: '',
  vehicle_make_id: '',
  vehicle_model: '',
  status: Status.Active,
});

// API Methods
export const findMasterVehicleModels = async (
  data: MasterVehicleModelQueryDTO
): Promise<FBR<MasterVehicleModel[]>> => {
  return apiPost<FBR<MasterVehicleModel[]>, MasterVehicleModelQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterVehicleModel = async (
  data: MasterVehicleModelDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleModelDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleModel = async (
  id: string,
  data: MasterVehicleModelDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleModelDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleModel = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterVehicleModelCache = async (
  organisation_id: string,
  vehicle_make_id?: string
): Promise<FBR<MasterVehicleModel[]>> => {
  return apiGet<FBR<MasterVehicleModel[]>>(
    ENDPOINTS.cache(organisation_id, vehicle_make_id)
  );
};
