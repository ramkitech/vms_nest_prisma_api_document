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
import { FleetIncidentManagement } from 'src/services/fleet/incident_management/incident_management_service';

const URL = 'master/fleet/incident_status';

const ENDPOINTS = {
  // MasterFleetIncidentStatus APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterFleetIncidentStatus Interface
export interface MasterFleetIncidentStatus extends Record<string, unknown> {
  // Primary Fields
  fleet_incident_status_id: string;

  // Main Field Details
  fleet_incident_status: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;

  // Relations - Child
  // Child - Fleet
  FleetIncidentManagement?: FleetIncidentManagement[]

  // Relations - Child Count
  _count?: {
    FleetIncidentManagement?: number;
  };
}

// MasterFleetIncidentStatus Create/Update Schema
export const MasterFleetIncidentStatusSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  fleet_incident_status: stringMandatory('Fleet Incident Status', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetIncidentStatusDTO = z.infer<
  typeof MasterFleetIncidentStatusSchema
>;

// MasterFleetIncidentStatus Query Schema
export const MasterFleetIncidentStatusQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fleet_incident_status_ids: multi_select_optional('MasterFleetIncidentStatus'), // Multi-selection -> MasterFleetIncidentStatus

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterFleetIncidentStatusQueryDTO = z.infer<
  typeof MasterFleetIncidentStatusQuerySchema
>;

// Convert MasterFleetIncidentStatus Data to API Payload
export const toMasterFleetIncidentStatusPayload = (row: MasterFleetIncidentStatus): MasterFleetIncidentStatusDTO => ({
  organisation_id: row.organisation_id || '',

  fleet_incident_status: row.fleet_incident_status || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterFleetIncidentStatus Payload
export const newMasterFleetIncidentStatusPayload = (): MasterFleetIncidentStatusDTO => ({
  organisation_id: '',

  fleet_incident_status: '',
  description: '',

  status: Status.Active,
});

// MasterFleetIncidentStatus APIs
export const findMasterFleetIncidentStatuses = async (data: MasterFleetIncidentStatusQueryDTO): Promise<FBR<MasterFleetIncidentStatus[]>> => {
  return apiPost<FBR<MasterFleetIncidentStatus[]>, MasterFleetIncidentStatusQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterFleetIncidentStatus = async (data: MasterFleetIncidentStatusDTO): Promise<SBR> => {
  return apiPost<SBR, MasterFleetIncidentStatusDTO>(ENDPOINTS.create, data);
};

export const updateMasterFleetIncidentStatus = async (id: string, data: MasterFleetIncidentStatusDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetIncidentStatusDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFleetIncidentStatus = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterFleetIncidentStatusCache = async (organisation_id: string): Promise<FBR<MasterFleetIncidentStatus[]>> => {
  return apiGet<FBR<MasterFleetIncidentStatus[]>>(ENDPOINTS.cache(organisation_id));
};

