// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// Other Models
import { UserOrganisation } from 'services/main/users/user_organisation_service';
//import { FleetTripParty } from "@api/services/fleet/fleet_trip_party_service";

const URL = 'master/trip/party_type';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Trip Party Type Interface
export interface MasterTripPartyType extends Record<string, unknown> {
  // Primary Fields
  party_type_id: string;
  party_type: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  //FleetTripParty: FleetTripParty[];

  // Count
  _count?: {
    FleetTripParty: number;
  };
}

// ✅ Trip Party Type Create/Update Schema
export const MasterTripPartyTypeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  party_type: stringMandatory('Party Type', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterTripPartyTypeDTO = z.infer<typeof MasterTripPartyTypeSchema>;

// ✅ Trip Party Type Query Schema
export const MasterTripPartyTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  party_type_ids: multi_select_optional('Party Type'), // ✅ Multi-selection -> MasterTripPartyType
});
export type MasterTripPartyTypeQueryDTO = z.infer<
  typeof MasterTripPartyTypeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterTripPartyTypePayload = (
  tripPartyType: MasterTripPartyType
): MasterTripPartyTypeDTO => ({
  organisation_id: tripPartyType.organisation_id ?? '',
  party_type: tripPartyType.party_type,
  status: tripPartyType.status,
});

// Generate a new payload with default values
export const newMasterTripPartyTypePayload = (): MasterTripPartyTypeDTO => ({
  organisation_id: '',
  party_type: '',
  status: Status.Active,
});

// API Methods
export const findMasterTripPartyTypes = async (
  data: MasterTripPartyTypeQueryDTO
): Promise<FBR<MasterTripPartyType[]>> => {
  return apiPost<FBR<MasterTripPartyType[]>, MasterTripPartyTypeQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterTripPartyType = async (
  data: MasterTripPartyTypeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterTripPartyTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterTripPartyType = async (
  id: string,
  data: MasterTripPartyTypeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterTripPartyTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterTripPartyType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterTripPartyTypeCache = async (
  organisation_id: string
): Promise<FBR<MasterTripPartyType[]>> => {
  return apiGet<FBR<MasterTripPartyType[]>>(ENDPOINTS.cache(organisation_id));
};
