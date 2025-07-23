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
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
//import { FleetIncidentManagement } from "@api/services/fleet/fleet_incident_management_service";

const URL = 'master/fleet/incident_severity';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Master Fleet Incident Severity Interface
export interface MasterFleetIncidentSeverity extends Record<string, unknown> {
  // Primary Fields
  fleet_incident_severity_id: string;
  fleet_incident_severity: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  // FleetIncidentManagement: FleetIncidentManagement[];

  // Count
  _count?: {
    FleetIncidentManagement: number;
  };
}

// ✅ Master Fleet Incident Severity Create/Update Schema
export const MasterFleetIncidentSeveritySchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  fleet_incident_severity: stringMandatory('Fleet Incident Severity', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetIncidentSeverityDTO = z.infer<typeof MasterFleetIncidentSeveritySchema>;

// ✅ Master Fleet Incident Severity Query Schema
export const MasterFleetIncidentSeverityQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  fleet_incident_severity_ids: multi_select_optional('Fleet Incident Severity'), // ✅ Multi-selection -> MasterFleetIncidentSeverity
});
export type MasterFleetIncidentSeverityQueryDTO = z.infer<typeof MasterFleetIncidentSeverityQuerySchema>;

// Convert existing data to a payload structure
export const toMasterFleetIncidentSeverityPayload = (severity: MasterFleetIncidentSeverity): MasterFleetIncidentSeverityDTO => ({
  organisation_id: severity.organisation_id ?? '',
  fleet_incident_severity: severity.fleet_incident_severity,
  status: severity.status,
});

// Generate a new payload with default values
export const newMasterFleetIncidentSeverityPayload = (): MasterFleetIncidentSeverityDTO => ({
  organisation_id: '',
  fleet_incident_severity: '',
  status: Status.Active,
});

// API Methods
export const findMasterFleetIncidentSeverities = async (
  data: MasterFleetIncidentSeverityQueryDTO
): Promise<FBR<MasterFleetIncidentSeverity[]>> => {
  return apiPost<FBR<MasterFleetIncidentSeverity[]>, MasterFleetIncidentSeverityQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterFleetIncidentSeverity = async (
  data: MasterFleetIncidentSeverityDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterFleetIncidentSeverityDTO>(ENDPOINTS.create, data);
};

export const updateMasterFleetIncidentSeverity = async (
  id: string,
  data: MasterFleetIncidentSeverityDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetIncidentSeverityDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFleetIncidentSeverity = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterFleetIncidentSeverityCache = async (
  organisation_id: string
): Promise<FBR<MasterFleetIncidentSeverity[]>> => {
  return apiGet<FBR<MasterFleetIncidentSeverity[]>>(ENDPOINTS.cache(organisation_id));
};
