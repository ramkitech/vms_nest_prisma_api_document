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
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { MasterVehicle } from '../../main/vehicle/master_vehicle_service';

const URL = 'master/vehicle/fuel_unit';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

//  MasterVehicleFuelUnit Interface
export interface MasterVehicleFuelUnit extends Record<string, unknown> {
  // Primary Fields
  vehicle_fuel_unit_id: string;
  fuel_unit: string; // Min: 3, Max: 100
  description?: string; // Optional, Max: 300

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  MasterVehicle_PrimaryFuelType: MasterVehicle[]
  MasterVehicle_SecondaryFuelType: MasterVehicle[]
  // FleetFuelStationRate:            FleetFuelStationRate[]
  // FleetFuelRefills:                FleetFuelRefills[]
  // FleetFuelRemovals:               FleetFuelRemovals[]

  // Count
  _count?: {
    MasterVehicle_PrimaryFuelType: number;
    MasterVehicle_SecondaryFuelType: number;
    FleetFuelStationRate: number;
    FleetFuelRefills: number;
    FleetFuelRemovals: number;
  };
}

// ✅ MasterVehicleFuelUnit Create/Update Schema
export const MasterVehicleFuelUnitSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  fuel_unit: stringMandatory('Fuel Unit', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleFuelUnitDTO = z.infer<
  typeof MasterVehicleFuelUnitSchema
>;

// ✅ MasterVehicleFuelUnit Query Schema
export const MasterVehicleFuelUnitQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  fuel_unit_ids: multi_select_optional('MasterVehicleFuelUnit'), // ✅ Multi-selection -> MasterVehicleFuelUnit
});
export type MasterVehicleFuelUnitQueryDTO = z.infer<
  typeof MasterVehicleFuelUnitQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterVehicleFuelUnitPayload = (row: MasterVehicleFuelUnit): MasterVehicleFuelUnitDTO => ({
  organisation_id: row.organisation_id ?? '',
  fuel_unit: row.fuel_unit,
  description: row.description || '',
  status: row.status,
});

// Generate a new payload with default values
export const newMasterVehicleFuelUnitPayload = (): MasterVehicleFuelUnitDTO => ({
  organisation_id: '',
  fuel_unit: '',
  description: '',
  status: Status.Active,
});

// API Methods
export const findMasterVehicleFuelUnits = async (data: MasterVehicleFuelUnitQueryDTO): Promise<FBR<MasterVehicleFuelUnit[]>> => {
  return apiPost<FBR<MasterVehicleFuelUnit[]>, MasterVehicleFuelUnitQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleFuelUnit = async (data: MasterVehicleFuelUnitDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleFuelUnitDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleFuelUnit = async (id: string, data: MasterVehicleFuelUnitDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleFuelUnitDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleFuelUnit = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterVehicleFuelUnitCache = async (organisation_id: string): Promise<FBR<MasterVehicleFuelUnit[]>> => {
  return apiGet<FBR<MasterVehicleFuelUnit[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleFuelUnitCacheCount = async (organisation_id: string): Promise<FBR<MasterVehicleFuelUnit>> => {
  return apiGet<FBR<MasterVehicleFuelUnit>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleFuelUnitCacheChild = async (organisation_id: string): Promise<FBR<MasterVehicleFuelUnit[]>> => {
  return apiGet<FBR<MasterVehicleFuelUnit[]>>(ENDPOINTS.cache_child(organisation_id));
};

