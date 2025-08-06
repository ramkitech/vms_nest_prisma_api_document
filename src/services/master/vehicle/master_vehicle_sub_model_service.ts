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
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterVehicleModel } from '../../../services/master/vehicle/master_vehicle_model_service';
import { MasterVehicle } from '../../../services/main/vehicle/master_vehicle_service';

const URL = 'master/vehicle/sub_model';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string, vehicle_model_id?: string): string =>
    `${URL}/cache/${organisation_id}?vehicle_model_id=${
      vehicle_model_id || '0'
    }`,
};

// Vehicle Sub-Model Interface
export interface MasterVehicleSubModel extends Record<string, unknown> {
  // Primary Fields
  vehicle_sub_model_id: string;
  vehicle_sub_model: string; // Min: 3, Max: 100
  description?: string; // Optional, Max: 300

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;
  vehicle_model_id: string;
  MasterVehicleModel?: MasterVehicleModel;

  // Relations - Child
  MasterVehicle: MasterVehicle[];

  // Count
  _count?: {
    MasterVehicle: number;
  };
}

// ✅ Vehicle Sub-Model Create/Update Schema
export const MasterVehicleSubModelSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  vehicle_make_id: single_select_mandatory('Vehicle Make'), // ✅ Mandatory selection -> MasterVehicleModel
  vehicle_model_id: single_select_mandatory('Vehicle Model'), // ✅ Mandatory selection -> MasterVehicleModel
  vehicle_sub_model: stringMandatory('Vehicle Sub Model', 3, 100),
  description: stringOptional('Description', 0, 100),
  status: enumMandatory('Status', Status, Status.Active), // ✅ Mandatory status field
});
export type MasterVehicleSubModelDTO = z.infer<
  typeof MasterVehicleSubModelSchema
>;

// ✅ Vehicle Sub-Model Query Schema
export const MasterVehicleSubModelQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_make_ids: multi_select_optional('Vehicle Make'), // ✅ Multi-selection -> MasterVehicleMake
  vehicle_model_ids: multi_select_optional('Vehicle Model'), // ✅ Multi-selection -> MasterVehicleModel
  vehicle_sub_model_ids: multi_select_optional('Vehicle Sub Model'), // ✅ Multi-selection -> MasterVehicleSubModel
});
export type MasterVehicleSubModelQueryDTO = z.infer<
  typeof MasterVehicleSubModelQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterVehicleSubModelPayload = (
  row: MasterVehicleSubModel
): MasterVehicleSubModelDTO => ({
  organisation_id: row.organisation_id ?? '',
  vehicle_make_id: row.MasterVehicleModel?.vehicle_make_id || '',
  vehicle_model_id: row.vehicle_model_id,
  vehicle_sub_model: row.vehicle_sub_model,
  description: row.description || '',
  status: row.status,
});

// Generate a new payload with default values
export const newMasterVehicleSubModelPayload =
  (): MasterVehicleSubModelDTO => ({
    organisation_id: '',
    vehicle_make_id: '',
    vehicle_model_id: '',
    vehicle_sub_model: '',
    description: '',
    status: Status.Active,
  });

// API Methods
export const findMasterVehicleSubModels = async (
  data: MasterVehicleSubModelQueryDTO
): Promise<FBR<MasterVehicleSubModel[]>> => {
  return apiPost<FBR<MasterVehicleSubModel[]>, MasterVehicleSubModelQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterVehicleSubModel = async (
  data: MasterVehicleSubModelDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleSubModelDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleSubModel = async (
  id: string,
  data: MasterVehicleSubModelDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleSubModelDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleSubModel = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterVehicleSubModelCache = async (
  organisation_id: string,
  vehicle_model_id?: string
): Promise<FBR<MasterVehicleSubModel[]>> => {
  return apiGet<FBR<MasterVehicleSubModel[]>>(
    ENDPOINTS.cache(organisation_id, vehicle_model_id)
  );
};
