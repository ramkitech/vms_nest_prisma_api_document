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
//import { FleetIncidentManagement } from "@api/services/fleet/fleet_incident_management_service";

const URL = 'master/fleet/insurance_claim_status';

const ENDPOINTS = {
  // MasterFleetInsuranceClaimStatus APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterFleetInsuranceClaimStatus Interface
export interface MasterFleetInsuranceClaimStatus
  extends Record<string, unknown> {
  // Primary Fields
  fleet_insurance_claim_status_id: string;

  // Main Field Details
  fleet_insurance_claim_status: string;
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

// MasterFleetInsuranceClaimStatus Create/Update Schema
export const MasterFleetInsuranceClaimStatusSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  fleet_insurance_claim_status: stringMandatory(
    'Fleet Insurance Claim Status',
    3,
    100,
  ),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetInsuranceClaimStatusDTO = z.infer<
  typeof MasterFleetInsuranceClaimStatusSchema
>;

// MasterFleetInsuranceClaimStatus Query Schema
export const MasterFleetInsuranceClaimStatusQuerySchema =
  BaseQuerySchema.extend({
    // Self Table
    fleet_insurance_claim_status_ids: multi_select_optional(
      'MasterFleetInsuranceClaimStatus',
    ), // Multi-selection -> MasterFleetInsuranceClaimStatus

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  });
export type MasterFleetInsuranceClaimStatusQueryDTO = z.infer<
  typeof MasterFleetInsuranceClaimStatusQuerySchema
>;

// Convert MasterFleetInsuranceClaimStatus Data to API Payload
export const toMasterFleetInsuranceClaimStatusPayload = (row: MasterFleetInsuranceClaimStatus): MasterFleetInsuranceClaimStatusDTO => ({
  organisation_id: row.organisation_id || '',

  fleet_insurance_claim_status: row.fleet_insurance_claim_status || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterFleetInsuranceClaimStatus Payload
export const newMasterFleetInsuranceClaimStatusPayload = (): MasterFleetInsuranceClaimStatusDTO => ({
  organisation_id: '',

  fleet_insurance_claim_status: '',
  description: '',

  status: Status.Active,
});

// MasterFleetInsuranceClaimStatus APIs
export const findMasterFleetInsuranceClaimStatuses = async (data: MasterFleetInsuranceClaimStatusQueryDTO): Promise<FBR<MasterFleetInsuranceClaimStatus[]>> => {
  return apiPost<FBR<MasterFleetInsuranceClaimStatus[]>, MasterFleetInsuranceClaimStatusQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterFleetInsuranceClaimStatus = async (data: MasterFleetInsuranceClaimStatusDTO): Promise<SBR> => {
  return apiPost<SBR, MasterFleetInsuranceClaimStatusDTO>(ENDPOINTS.create, data);
};

export const updateMasterFleetInsuranceClaimStatus = async (id: string, data: MasterFleetInsuranceClaimStatusDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetInsuranceClaimStatusDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFleetInsuranceClaimStatus = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterFleetInsuranceClaimStatusCache = async (organisation_id: string): Promise<FBR<MasterFleetInsuranceClaimStatus[]>> => {
  return apiGet<FBR<MasterFleetInsuranceClaimStatus[]>>(ENDPOINTS.cache(organisation_id));
};

