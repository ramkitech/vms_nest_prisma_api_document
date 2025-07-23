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

const URL = 'master/fleet/insurance_claim_status';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Master Fleet Insurance Claim Status Interface
export interface MasterFleetInsuranceClaimStatus
  extends Record<string, unknown> {
  // Primary Fields
  fleet_insurance_claim_status_id: string;
  fleet_insurance_claim_status: string; // Min: 3, Max: 100

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

// ✅ Master Fleet Insurance Claim Status Create/Update Schema
export const MasterFleetInsuranceClaimStatusSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  fleet_insurance_claim_status: stringMandatory(
    'Fleet Insurance Claim Status',
    3,
    100
  ),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetInsuranceClaimStatusDTO = z.infer<
  typeof MasterFleetInsuranceClaimStatusSchema
>;

// ✅ Master Fleet Insurance Claim Status Query Schema
export const MasterFleetInsuranceClaimStatusQuerySchema =
  BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
    fleet_insurance_claim_status_ids: multi_select_optional(
      'Fleet Insurance Claim Status'
    ), // ✅ Multi-selection -> MasterFleetInsuranceClaimStatus
  });
export type MasterFleetInsuranceClaimStatusQueryDTO = z.infer<
  typeof MasterFleetInsuranceClaimStatusQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterFleetInsuranceClaimStatusPayload = (
  claimStatus: MasterFleetInsuranceClaimStatus
): MasterFleetInsuranceClaimStatusDTO => ({
  organisation_id: claimStatus.organisation_id ?? '',
  fleet_insurance_claim_status: claimStatus.fleet_insurance_claim_status,
  status: claimStatus.status,
});

// Generate a new payload with default values
export const newMasterFleetInsuranceClaimStatusPayload =
  (): MasterFleetInsuranceClaimStatusDTO => ({
    organisation_id: '',
    fleet_insurance_claim_status: '',
    status: Status.Active,
  });

// API Methods
export const findMasterFleetInsuranceClaimStatuses = async (
  data: MasterFleetInsuranceClaimStatusQueryDTO
): Promise<FBR<MasterFleetInsuranceClaimStatus[]>> => {
  return apiPost<
    FBR<MasterFleetInsuranceClaimStatus[]>,
    MasterFleetInsuranceClaimStatusQueryDTO
  >(ENDPOINTS.find, data);
};

export const createMasterFleetInsuranceClaimStatus = async (
  data: MasterFleetInsuranceClaimStatusDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterFleetInsuranceClaimStatusDTO>(
    ENDPOINTS.create,
    data
  );
};

export const updateMasterFleetInsuranceClaimStatus = async (
  id: string,
  data: MasterFleetInsuranceClaimStatusDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetInsuranceClaimStatusDTO>(
    ENDPOINTS.update(id),
    data
  );
};

export const deleteMasterFleetInsuranceClaimStatus = async (
  id: string
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterFleetInsuranceClaimStatusCache = async (
  organisation_id: string
): Promise<FBR<MasterFleetInsuranceClaimStatus[]>> => {
  return apiGet<FBR<MasterFleetInsuranceClaimStatus[]>>(
    ENDPOINTS.cache(organisation_id)
  );
};
