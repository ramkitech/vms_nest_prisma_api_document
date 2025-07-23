// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
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
import { MasterVehicle } from 'services/main/vehicle/master_vehicle_service';

const URL = 'master/vehicle/status_type';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Vehicle Status Type Interface
export interface MasterVehicleStatusType extends Record<string, unknown> {
  // Primary Fields
  vehicle_status_type_id: string;
  vehicle_status_type: string; // Min: 3, Max: 100

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

// ✅ Vehicle Status Type Create/Update Schema
export const MasterVehicleStatusTypeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  vehicle_status_type: stringMandatory('Vehicle Status Type', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleStatusTypeDTO = z.infer<
  typeof MasterVehicleStatusTypeSchema
>;

// ✅ Vehicle Status Type Query Schema
export const MasterVehicleStatusTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_status_type_ids: multi_select_optional('Vehicle Status Type'), // ✅ Multi-selection -> MasterVehicleStatusType
});
export type MasterVehicleStatusTypeQueryDTO = z.infer<
  typeof MasterVehicleStatusTypeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterVehicleStatusTypePayload = (
  statusType: MasterVehicleStatusType
): MasterVehicleStatusTypeDTO => ({
  organisation_id: statusType.organisation_id ?? '',
  vehicle_status_type: statusType.vehicle_status_type,
  status: statusType.status,
});

// Generate a new payload with default values
export const newMasterVehicleStatusTypePayload =
  (): MasterVehicleStatusTypeDTO => ({
    organisation_id: '',
    vehicle_status_type: '',
    status: Status.Active,
  });

// API Methods
export const findMasterVehicleStatusTypes = async (
  data: MasterVehicleStatusTypeQueryDTO
): Promise<FBR<MasterVehicleStatusType[]>> => {
  return apiPost<
    FBR<MasterVehicleStatusType[]>,
    MasterVehicleStatusTypeQueryDTO
  >(ENDPOINTS.find, data);
};

export const createMasterVehicleStatusType = async (
  data: MasterVehicleStatusTypeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleStatusTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleStatusType = async (
  id: string,
  data: MasterVehicleStatusTypeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleStatusTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleStatusType = async (
  id: string
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterVehicleStatusTypeCache = async (
  organisation_id: string
): Promise<FBR<MasterVehicleStatusType[]>> => {
  return apiGet<FBR<MasterVehicleStatusType[]>>(
    ENDPOINTS.cache(organisation_id)
  );
};
