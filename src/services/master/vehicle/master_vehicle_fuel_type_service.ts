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
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterVehicle } from '../../../services/main/vehicle/master_vehicle_service';

const URL = 'master/vehicle/fuel_type';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Vehicle Fuel Type Interface
export interface MasterVehicleFuelType extends Record<string, unknown> {
  // Primary Fields
  vehicle_fuel_type_id: string;
  vehicle_fuel_type: string; // Min: 3, Max: 100

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

// ✅ Vehicle Fuel Type Create/Update Schema
export const MasterVehicleFuelTypeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  vehicle_fuel_type: stringMandatory('Vehicle Fuel Type', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleFuelTypeDTO = z.infer<
  typeof MasterVehicleFuelTypeSchema
>;

// ✅ Vehicle Fuel Type Query Schema
export const MasterVehicleFuelTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_fuel_type_ids: multi_select_optional('Vehicle Fuel Type'), // ✅ Multi-selection -> MasterVehicleFuelType
});
export type MasterVehicleFuelTypeQueryDTO = z.infer<
  typeof MasterVehicleFuelTypeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterVehicleFuelTypePayload = (
  fuelType: MasterVehicleFuelType
): MasterVehicleFuelTypeDTO => ({
  organisation_id: fuelType.organisation_id ?? '',
  vehicle_fuel_type: fuelType.vehicle_fuel_type,
  status: fuelType.status,
});

// Generate a new payload with default values
export const newMasterVehicleFuelTypePayload =
  (): MasterVehicleFuelTypeDTO => ({
    organisation_id: '',
    vehicle_fuel_type: '',
    status: Status.Active,
  });

// API Methods
export const findMasterVehicleFuelTypes = async (
  data: MasterVehicleFuelTypeQueryDTO
): Promise<FBR<MasterVehicleFuelType[]>> => {
  return apiPost<FBR<MasterVehicleFuelType[]>, MasterVehicleFuelTypeQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterVehicleFuelType = async (
  data: MasterVehicleFuelTypeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleFuelTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleFuelType = async (
  id: string,
  data: MasterVehicleFuelTypeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleFuelTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleFuelType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterVehicleFuelTypeCache = async (
  organisation_id: string
): Promise<FBR<MasterVehicleFuelType[]>> => {
  return apiGet<FBR<MasterVehicleFuelType[]>>(ENDPOINTS.cache(organisation_id));
};
