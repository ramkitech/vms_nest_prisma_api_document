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

const URL = 'master/vehicle/associated_to';

const ENDPOINTS = {
  // MasterVehicleAssociatedTo APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

//  MasterVehicleAssociatedTo Interface
export interface MasterVehicleAssociatedTo extends Record<string, unknown> {
  // Primary Fields
  vehicle_associated_to_id: string;
  associated_to: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
}

// ✅ MasterVehicleAssociatedTo Create/Update Schema
export const MasterVehicleAssociatedToSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  associated_to: stringMandatory('Associated To', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleAssociatedToDTO = z.infer<
  typeof MasterVehicleAssociatedToSchema
>;

// ✅ MasterVehicleAssociatedTo Query Schema
export const MasterVehicleAssociatedToQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_associated_to_ids: multi_select_optional('MasterVehicleAssociatedTo'), // ✅ Multi-selection -> MasterVehicleAssociatedTo
});
export type MasterVehicleAssociatedToQueryDTO = z.infer<
  typeof MasterVehicleAssociatedToQuerySchema
>;

// Convert MasterVehicleAssociatedTo Data to API Payload
export const toMasterVehicleAssociatedToPayload = (row: MasterVehicleAssociatedTo): MasterVehicleAssociatedToDTO => ({
  organisation_id: row.organisation_id || '',

  associated_to: row.associated_to || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterVehicleAssociatedTo Payload
export const newMasterVehicleAssociatedToPayload = (): MasterVehicleAssociatedToDTO => ({
  organisation_id: '',
  associated_to: '',
  description: '',
  status: Status.Active,
});

// MasterVehicleAssociatedTo APIs
export const findMasterVehicleAssociatedTos = async (data: MasterVehicleAssociatedToQueryDTO): Promise<FBR<MasterVehicleAssociatedTo[]>> => {
  return apiPost<FBR<MasterVehicleAssociatedTo[]>, MasterVehicleAssociatedToQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleAssociatedTo = async (data: MasterVehicleAssociatedToDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleAssociatedToDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleAssociatedTo = async (id: string, data: MasterVehicleAssociatedToDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleAssociatedToDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleAssociatedTo = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVehicleAssociatedToCache = async (organisation_id: string): Promise<FBR<MasterVehicleAssociatedTo[]>> => {
  return apiGet<FBR<MasterVehicleAssociatedTo[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleAssociatedToCacheCount = async (organisation_id: string): Promise<FBR<MasterVehicleAssociatedTo>> => {
  return apiGet<FBR<MasterVehicleAssociatedTo>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleAssociatedToCacheChild = async (organisation_id: string): Promise<FBR<MasterVehicleAssociatedTo[]>> => {
  return apiGet<FBR<MasterVehicleAssociatedTo[]>>(ENDPOINTS.cache_child(organisation_id));
};

