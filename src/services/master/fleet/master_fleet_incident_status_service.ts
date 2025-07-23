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
//import { FleetIncidentManagement } from "@api/services/fleet/fleet_incident_management_service";

const URL = 'master/fleet/incident_status';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Master Fleet Incident Status Interface
export interface MasterFleetIncidentStatus extends Record<string, unknown> {
  // Primary Fields
  fleet_incident_status_id: string;
  fleet_incident_status: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  //FleetIncidentManagement: FleetIncidentManagement[];

  // Count
  _count?: {
    FleetIncidentManagement: number;
  };
}

// ✅ Master Fleet Incident Status Create/Update Schema
export const MasterFleetIncidentStatusSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  fleet_incident_status: stringMandatory('Fleet Incident Status', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetIncidentStatusDTO = z.infer<typeof MasterFleetIncidentStatusSchema>;

// ✅ Master Fleet Incident Status Query Schema
export const MasterFleetIncidentStatusQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  fleet_incident_status_ids: multi_select_optional('Fleet Incident Status'), // ✅ Multi-selection -> MasterFleetIncidentStatus
});
export type MasterFleetIncidentStatusQueryDTO = z.infer<typeof MasterFleetIncidentStatusQuerySchema>;

// Convert existing data to a payload structure
export const toMasterFleetIncidentStatusPayload = (status: MasterFleetIncidentStatus): MasterFleetIncidentStatusDTO => ({
  organisation_id: status.organisation_id ?? '',
  fleet_incident_status: status.fleet_incident_status,
  status: status.status,
});

// Generate a new payload with default values
export const newMasterFleetIncidentStatusPayload = (): MasterFleetIncidentStatusDTO => ({
  organisation_id: '',
  fleet_incident_status: '',
  status: Status.Active,
});

// API Methods
export const findMasterFleetIncidentStatuses = async (
  data: MasterFleetIncidentStatusQueryDTO
): Promise<FBR<MasterFleetIncidentStatus[]>> => {
  return apiPost<FBR<MasterFleetIncidentStatus[]>, MasterFleetIncidentStatusQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterFleetIncidentStatus = async (
  data: MasterFleetIncidentStatusDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterFleetIncidentStatusDTO>(ENDPOINTS.create, data);
};

export const updateMasterFleetIncidentStatus = async (
  id: string,
  data: MasterFleetIncidentStatusDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetIncidentStatusDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFleetIncidentStatus = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterFleetIncidentStatusCache = async (
  organisation_id: string
): Promise<FBR<MasterFleetIncidentStatus[]>> => {
  return apiGet<FBR<MasterFleetIncidentStatus[]>>(ENDPOINTS.cache(organisation_id));
};
