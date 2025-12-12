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

const URL = 'master/fleet/incident_severity';

const ENDPOINTS = {
  // MasterFleetIncidentSeverity APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterFleetIncidentSeverity Interface
export interface MasterFleetIncidentSeverity extends Record<string, unknown> {
  // Primary Fields
  fleet_incident_severity_id: string;
  fleet_incident_severity: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  // Child - Fleet
  FleetIncidentManagement?: FleetIncidentManagement[];

  // Relations - Child Count
  _count?: {
    FleetIncidentManagement?: number;
  };
}

// MasterFleetIncidentSeverity Create/Update Schema
export const MasterFleetIncidentSeveritySchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  fleet_incident_severity: stringMandatory('Fleet Incident Severity', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetIncidentSeverityDTO = z.infer<
  typeof MasterFleetIncidentSeveritySchema
>;

// MasterFleetIncidentSeverity Query Schema
export const MasterFleetIncidentSeverityQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  fleet_incident_severity_ids: multi_select_optional(
    'MasterFleetIncidentSeverity',
  ), // Multi-selection -> MasterFleetIncidentSeverity
});
export type MasterFleetIncidentSeverityQueryDTO = z.infer<
  typeof MasterFleetIncidentSeverityQuerySchema
>;

// Convert MasterFleetIncidentSeverity Data to API Payload
export const toMasterFleetIncidentSeverityPayload = (row: MasterFleetIncidentSeverity): MasterFleetIncidentSeverityDTO => ({
  organisation_id: row.organisation_id || '',
  fleet_incident_severity: row.fleet_incident_severity || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterFleetIncidentSeverity Payload
export const newMasterFleetIncidentSeverityPayload = (): MasterFleetIncidentSeverityDTO => ({
  organisation_id: '',
  fleet_incident_severity: '',
  description: '',
  status: Status.Active,
});

// MasterFleetIncidentSeverity APIs
export const findMasterFleetIncidentSeverities = async (data: MasterFleetIncidentSeverityQueryDTO): Promise<FBR<MasterFleetIncidentSeverity[]>> => {
  return apiPost<FBR<MasterFleetIncidentSeverity[]>, MasterFleetIncidentSeverityQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterFleetIncidentSeverity = async (data: MasterFleetIncidentSeverityDTO): Promise<SBR> => {
  return apiPost<SBR, MasterFleetIncidentSeverityDTO>(ENDPOINTS.create, data);
};

export const updateMasterFleetIncidentSeverity = async (id: string, data: MasterFleetIncidentSeverityDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetIncidentSeverityDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFleetIncidentSeverity = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterFleetIncidentSeverityCache = async (organisation_id: string): Promise<FBR<MasterFleetIncidentSeverity[]>> => {
  return apiGet<FBR<MasterFleetIncidentSeverity[]>>(ENDPOINTS.cache(organisation_id));
};

