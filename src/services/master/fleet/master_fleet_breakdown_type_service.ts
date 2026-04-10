// Imports
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
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { FleetBreakdown } from 'src/services/fleet/breakdown_management/breakdown_management_service';

const URL = 'master/fleet/breakdown_type';

const ENDPOINTS = {
  // MasterFleetBreakdownType APIs
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // MasterFleetBreakdownType Cache
  find_cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterFleetBreakdownType Interface
export interface MasterFleetBreakdownType extends Record<string, unknown> {
  // Primary Field
  fleet_breakdown_type_id: string;

  // Main Field Details
  fleet_breakdown_type: string;
  description?: string;

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
  // Child - Fleet
  FleetBreakdown?: FleetBreakdown[];

  // Relations - Child Count
  _count?: {
    FleetBreakdown?: number;
  };
}

// MasterFleetBreakdownType Create/Update Schema
export const MasterFleetBreakdownTypeSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  fleet_breakdown_type: stringMandatory('Fleet Breakdown Type', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetBreakdownTypeDTO = z.infer<
  typeof MasterFleetBreakdownTypeSchema
>;

// MasterFleetBreakdownType Query Schema
export const MasterFleetBreakdownTypeQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fleet_breakdown_type_ids: multi_select_optional('MasterFleetBreakdownType'), // Multi-selection -> MasterFleetBreakdownType

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterFleetBreakdownTypeQueryDTO = z.infer<
  typeof MasterFleetBreakdownTypeQuerySchema
>;

// Convert MasterFleetBreakdownType Data to API Payload
export const toMasterFleetBreakdownTypePayload = (row: MasterFleetBreakdownType,): MasterFleetBreakdownTypeDTO => ({
  organisation_id: row.organisation_id || '',

  fleet_breakdown_type: row.fleet_breakdown_type || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterFleetBreakdownType Payload
export const newMasterFleetBreakdownTypePayload = (): MasterFleetBreakdownTypeDTO => ({
  organisation_id: '',

  fleet_breakdown_type: '',
  description: '',

  status: Status.Active,
});

// MasterFleetBreakdownType APIs
export const findMasterFleetBreakdownType = async (data: MasterFleetBreakdownTypeQueryDTO,): Promise<FBR<MasterFleetBreakdownType[]>> => {
  return apiPost<FBR<MasterFleetBreakdownType[]>, MasterFleetBreakdownTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterFleetBreakdownType = async (data: MasterFleetBreakdownTypeDTO,): Promise<SBR> => {
  return apiPost<SBR, MasterFleetBreakdownTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterFleetBreakdownType = async (id: string, data: MasterFleetBreakdownTypeDTO,): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetBreakdownTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFleetBreakdownType = async (id: string,): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// MasterFleetBreakdownType Cache
export const findMasterFleetBreakdownTypeCache = async (organisation_id: string,): Promise<FBR<MasterFleetBreakdownType[]>> => {
  return apiGet<FBR<MasterFleetBreakdownType[]>>(ENDPOINTS.find_cache(organisation_id));
};