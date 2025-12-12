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

const URL = 'master/vehicle/status_type';

const ENDPOINTS = {
  // MasterVehicleStatusType APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// MasterVehicleStatusType Interface
export interface MasterVehicleStatusType extends Record<string, unknown> {
  // Primary Fields
  vehicle_status_type_id: string;
  status_type: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
}

// MasterVehicleStatusType Create/Update Schema
export const MasterVehicleStatusTypeSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  status_type: stringMandatory('Status Type', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleStatusTypeDTO = z.infer<
  typeof MasterVehicleStatusTypeSchema
>;

// MasterVehicleStatusType Query Schema
export const MasterVehicleStatusTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  vehicle_status_type_ids: multi_select_optional('MasterVehicleStatusType'), // Multi-selection -> MasterVehicleStatusType
});
export type MasterVehicleStatusTypeQueryDTO = z.infer<
  typeof MasterVehicleStatusTypeQuerySchema
>;

// Convert MasterVehicleStatusType Data to API Payload
export const toMasterVehicleStatusTypePayload = (row: MasterVehicleStatusType): MasterVehicleStatusTypeDTO => ({
  organisation_id: row.organisation_id || '',
  status_type: row.status_type || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterVehicleStatusType Payload
export const newMasterVehicleStatusTypePayload = (): MasterVehicleStatusTypeDTO => ({
  organisation_id: '',
  status_type: '',
  description: '',
  status: Status.Active,
});

// MasterVehicleStatusType APIs
export const findMasterVehicleStatusTypes = async (data: MasterVehicleStatusTypeQueryDTO): Promise<FBR<MasterVehicleStatusType[]>> => {
  return apiPost<FBR<MasterVehicleStatusType[]>, MasterVehicleStatusTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleStatusType = async (data: MasterVehicleStatusTypeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleStatusTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleStatusType = async (id: string, data: MasterVehicleStatusTypeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleStatusTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleStatusType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVehicleStatusTypeCache = async (organisation_id: string): Promise<FBR<MasterVehicleStatusType[]>> => {
  return apiGet<FBR<MasterVehicleStatusType[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleStatusTypeCacheCount = async (organisation_id: string): Promise<FBR<MasterVehicleStatusType>> => {
  return apiGet<FBR<MasterVehicleStatusType>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleStatusTypeCacheChild = async (organisation_id: string): Promise<FBR<MasterVehicleStatusType[]>> => {
  return apiGet<FBR<MasterVehicleStatusType[]>>(ENDPOINTS.cache_child(organisation_id));
};
