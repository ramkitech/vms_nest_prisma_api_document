// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  multi_select_optional,
  stringOptional,
  doubleOptionalLatLng,
  single_select_mandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { FleetServiceTask } from 'src/services/fleet/service_management/fleet_service_service';

const URL = 'master/fleet/service_part';

const ENDPOINTS = {
  // MasterFleetServicePart APIs
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // MasterFleetServicePart Cache
  find_cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterFleetServicePart Interface
export interface MasterFleetServicePart extends Record<string, unknown> {
  // Primary Field
  fleet_service_part_id: string;

  // Main Field Details
  part_name?: string;
  description?: string;
  part_amount?: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;
  organisation_logo_url?: string;

  // Relations - Child
  FleetServiceTask?: FleetServiceTask[];

  // Relations - Child Count
  _count?: {
    FleetServiceTask?: number;
  };
}

// MasterFleetServicePart Create/Update Schema
export const MasterFleetServicePartSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  part_name: stringOptional('Part Name', 0, 100),
  description: stringOptional('Description', 0, 500),
  part_amount: doubleOptionalLatLng('Part Amount'),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetServicePartDTO = z.infer<typeof MasterFleetServicePartSchema>;

// MasterFleetServicePart Query Schema
export const MasterFleetServicePartQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fleet_service_part_ids: multi_select_optional('MasterFleetServicePart'), // Multi-selection -> MasterFleetServicePart

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterFleetServicePartQueryDTO = z.infer<typeof MasterFleetServicePartQuerySchema>;

// Convert MasterFleetServicePart Data to API Payload
export const toMasterFleetServicePartPayload = (row: MasterFleetServicePart,): MasterFleetServicePartDTO => ({
  organisation_id: row.organisation_id || '',

  part_name: row.part_name || '',
  description: row.description || '',
  part_amount: row.part_amount || 0,

  status: row.status || Status.Active,
});

// Create New MasterFleetServicePart Payload
export const newMasterFleetServicePartPayload = (): MasterFleetServicePartDTO => ({
  organisation_id: '',

  part_name: '',
  description: '',
  part_amount: 0,

  status: Status.Active,
});

// MasterFleetServicePart APIs
export const findMasterFleetServicePart = async (data: MasterFleetServicePartQueryDTO,): Promise<FBR<MasterFleetServicePart[]>> => {
  return apiPost<FBR<MasterFleetServicePart[]>, MasterFleetServicePartQueryDTO>(ENDPOINTS.find, data,);
};

export const createMasterFleetServicePart = async (data: MasterFleetServicePartDTO,): Promise<SBR> => {
  return apiPost<SBR, MasterFleetServicePartDTO>(ENDPOINTS.create, data);
};

export const updateMasterFleetServicePart = async (id: string, data: MasterFleetServicePartDTO,): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetServicePartDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFleetServicePart = async (id: string,): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// MasterFleetServicePart Cache
export const findMasterFleetServicePartCache = async (organisation_id: string,): Promise<FBR<MasterFleetServicePart[]>> => {
  return apiGet<FBR<MasterFleetServicePart[]>>(ENDPOINTS.find_cache(organisation_id));
};
