// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
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
  description?: string; // Optional, Max: 300

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

// ✅ MasterTripPartyType Create/Update Schema
export const MasterTripPartyTypeSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  party_type: stringMandatory('Party Type', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterTripPartyTypeDTO = z.infer<typeof MasterTripPartyTypeSchema>;

// ✅ MasterTripPartyType Query Schema
export const MasterTripPartyTypeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  party_type_ids: multi_select_optional('MasterTripPartyType'), // ✅ Multi-selection -> MasterTripPartyType
});
export type MasterTripPartyTypeQueryDTO = z.infer<
  typeof MasterTripPartyTypeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterTripPartyTypePayload = (row: MasterTripPartyType): MasterTripPartyTypeDTO => ({
  organisation_id: row.organisation_id ?? '',
  party_type: row.party_type,
  description: row.description || '',
  status: row.status,
});

// Generate a new payload with default values
export const newMasterTripPartyTypePayload = (): MasterTripPartyTypeDTO => ({
  organisation_id: '',
  party_type: '',
  description: '',
  status: Status.Active,
});

// API Methods
export const findMasterTripPartyTypes = async (data: MasterTripPartyTypeQueryDTO): Promise<FBR<MasterTripPartyType[]>> => {
  return apiPost<FBR<MasterTripPartyType[]>, MasterTripPartyTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterTripPartyType = async (data: MasterTripPartyTypeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterTripPartyTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterTripPartyType = async (id: string, data: MasterTripPartyTypeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterTripPartyTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterTripPartyType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterTripPartyTypeCache = async (organisation_id: string): Promise<FBR<MasterTripPartyType[]>> => {
  return apiGet<FBR<MasterTripPartyType[]>>(ENDPOINTS.cache(organisation_id));
};

