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

const URL = 'master/fleet/incident_type';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Master Fleet Incident Type Interface
export interface MasterFleetIncidentType extends Record<string, unknown> {
  // Primary Fields
  fleet_incident_type_id: string;
  fleet_incident_type: string; // Min: 3, Max: 100

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

// ✅ Master Fleet Incident Type Create/Update Schema
export const MasterFleetIncidentTypeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  fleet_incident_type: stringMandatory('Fleet Incident Type', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetIncidentTypeDTO = z.infer<
  typeof MasterFleetIncidentTypeSchema
>;

// ✅ Master Fleet Incident Type Query Schema
export const MasterFleetIncidentTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  fleet_incident_type_ids: multi_select_optional('Fleet Incident Type'), // ✅ Multi-selection -> MasterFleetIncidentType
});
export type MasterFleetIncidentTypeQueryDTO = z.infer<
  typeof MasterFleetIncidentTypeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterFleetIncidentTypePayload = (
  type: MasterFleetIncidentType
): MasterFleetIncidentTypeDTO => ({
  organisation_id: type.organisation_id ?? '',
  fleet_incident_type: type.fleet_incident_type,
  status: type.status,
});

// Generate a new payload with default values
export const newMasterFleetIncidentTypePayload =
  (): MasterFleetIncidentTypeDTO => ({
    organisation_id: '',
    fleet_incident_type: '',
    status: Status.Active,
  });

// API Methods
export const findMasterFleetIncidentTypes = async (
  data: MasterFleetIncidentTypeQueryDTO
): Promise<FBR<MasterFleetIncidentType[]>> => {
  return apiPost<
    FBR<MasterFleetIncidentType[]>,
    MasterFleetIncidentTypeQueryDTO
  >(ENDPOINTS.find, data);
};

export const createMasterFleetIncidentType = async (
  data: MasterFleetIncidentTypeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterFleetIncidentTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterFleetIncidentType = async (
  id: string,
  data: MasterFleetIncidentTypeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetIncidentTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFleetIncidentType = async (
  id: string
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterFleetIncidentTypeCache = async (
  organisation_id: string
): Promise<FBR<MasterFleetIncidentType[]>> => {
  return apiGet<FBR<MasterFleetIncidentType[]>>(
    ENDPOINTS.cache(organisation_id)
  );
};
