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

const URL = 'master/vehicle/fuel_removal_reason';

const ENDPOINTS = {
  // MasterVehicleFuelRemovalReason APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

//  MasterVehicleFuelRemovalReason Interface
export interface MasterVehicleFuelRemovalReason extends Record<string, unknown> {
  // Primary Fields
  fuel_removal_reason_id: string;
  removal_reason: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
}

// MasterVehicleFuelRemovalReason Create/Update Schema
export const MasterVehicleFuelRemovalReasonSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  removal_reason: stringMandatory('Removal Reason', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleFuelRemovalReasonDTO = z.infer<
  typeof MasterVehicleFuelRemovalReasonSchema
>;

// MasterVehicleFuelRemovalReason Query Schema
export const MasterVehicleFuelRemovalReasonQuerySchema = BaseQuerySchema.extend(
  {
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
    fuel_removal_reason_ids: multi_select_optional(
      'MasterVehicleFuelRemovalReason',
    ), // Multi-selection -> MasterVehicleFuelRemovalReason
  },
);
export type MasterVehicleFuelRemovalReasonQueryDTO = z.infer<
  typeof MasterVehicleFuelRemovalReasonQuerySchema
>;

// Convert MasterVehicleFuelRemovalReason Data to API Payload
export const toMasterVehicleFuelRemovalReasonPayload = (row: MasterVehicleFuelRemovalReason): MasterVehicleFuelRemovalReasonDTO => ({
  organisation_id: row.organisation_id || '',

  removal_reason: row.removal_reason || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterVehicleFuelRemovalReason Payload
export const newMasterVehicleFuelRemovalReasonPayload = (): MasterVehicleFuelRemovalReasonDTO => ({
  organisation_id: '',
  removal_reason: '',
  description: '',
  status: Status.Active,
});

// MasterVehicleFuelRemovalReason APIs
export const findMasterVehicleFuelRemovalReasons = async (data: MasterVehicleFuelRemovalReasonQueryDTO): Promise<FBR<MasterVehicleFuelRemovalReason[]>> => {
  return apiPost<FBR<MasterVehicleFuelRemovalReason[]>, MasterVehicleFuelRemovalReasonQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleFuelRemovalReason = async (data: MasterVehicleFuelRemovalReasonDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleFuelRemovalReasonDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleFuelRemovalReason = async (id: string, data: MasterVehicleFuelRemovalReasonDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleFuelRemovalReasonDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleFuelRemovalReason = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVehicleFuelRemovalReasonCache = async (organisation_id: string): Promise<FBR<MasterVehicleFuelRemovalReason[]>> => {
  return apiGet<FBR<MasterVehicleFuelRemovalReason[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleFuelRemovalReasonCacheCount = async (organisation_id: string): Promise<FBR<MasterVehicleFuelRemovalReason>> => {
  return apiGet<FBR<MasterVehicleFuelRemovalReason>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleFuelRemovalReasonCacheChild = async (organisation_id: string): Promise<FBR<MasterVehicleFuelRemovalReason[]>> => {
  return apiGet<FBR<MasterVehicleFuelRemovalReason[]>>(ENDPOINTS.cache_child(organisation_id));
};

