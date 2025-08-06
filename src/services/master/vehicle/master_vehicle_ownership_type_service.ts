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
import { MasterVehicle } from '../../../services/main/vehicle/master_vehicle_service';

const URL = 'master/vehicle/ownership_type';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Vehicle Ownership Type Interface
export interface MasterVehicleOwnershipType extends Record<string, unknown> {
  // Primary Fields
  vehicle_ownership_type_id: string;
  vehicle_ownership_type: string; // Min: 3, Max: 100
  description?: string; // Optional, Max: 300

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

// ✅ Vehicle Ownership Type Create/Update Schema
export const MasterVehicleOwnershipTypeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  vehicle_ownership_type: stringMandatory('Vehicle Ownership Type', 3, 100),
  description: stringOptional('Description', 0, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleOwnershipTypeDTO = z.infer<
  typeof MasterVehicleOwnershipTypeSchema
>;

// ✅ Vehicle Ownership Type Query Schema
export const MasterVehicleOwnershipTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ownership_type_ids: multi_select_optional('Vehicle Ownership Type'), // ✅ Multi-selection -> MasterVehicleOwnershipType
});
export type MasterVehicleOwnershipTypeQueryDTO = z.infer<
  typeof MasterVehicleOwnershipTypeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterVehicleOwnershipTypePayload = (
  row: MasterVehicleOwnershipType
): MasterVehicleOwnershipTypeDTO => ({
  organisation_id: row.organisation_id ?? '',
  vehicle_ownership_type: row.vehicle_ownership_type,
  description: row.description || '',
  status: row.status,
});

// Generate a new payload with default values
export const newMasterVehicleOwnershipTypePayload =
  (): MasterVehicleOwnershipTypeDTO => ({
    organisation_id: '',
    vehicle_ownership_type: '',
    description: '',
    status: Status.Active,
  });

// API Methods
export const findMasterVehicleOwnershipTypes = async (
  data: MasterVehicleOwnershipTypeQueryDTO
): Promise<FBR<MasterVehicleOwnershipType[]>> => {
  return apiPost<
    FBR<MasterVehicleOwnershipType[]>,
    MasterVehicleOwnershipTypeQueryDTO
  >(ENDPOINTS.find, data);
};

export const createMasterVehicleOwnershipType = async (
  data: MasterVehicleOwnershipTypeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleOwnershipTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleOwnershipType = async (
  id: string,
  data: MasterVehicleOwnershipTypeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleOwnershipTypeDTO>(
    ENDPOINTS.update(id),
    data
  );
};

export const deleteMasterVehicleOwnershipType = async (
  id: string
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterVehicleOwnershipTypeCache = async (
  organisation_id: string
): Promise<FBR<MasterVehicleOwnershipType[]>> => {
  return apiGet<FBR<MasterVehicleOwnershipType[]>>(
    ENDPOINTS.cache(organisation_id)
  );
};
