// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// Other Models
import { MasterMainCountry } from 'services/master/main/master_main_country_service';
import { UserOrganisation } from 'services/main/users/user_organisation_service';

const URL = 'master/main/time_zone';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (country_id: string): string =>
    `${URL}/cache?country_id=${country_id}`,
};

// Master Main Time Zone Interface
export interface MasterMainTimeZone extends Record<string, unknown> {
  // Primary Fields
  time_zone_id: string;
  time_zone_code: string; // Min: 2, Max: 50
  time_zone_identifier?: string; // Optional, Max: 100
  time_zone_abbrevation: string; // Min: 2, Max: 100
  time_zone_utc: string; // Min: 2, Max: 100
  time_zone_offset: string; // Min: 2, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  country_id: string;
  MasterMainCountry?: MasterMainCountry;

  // Relations - Child
  UserOrganisation: UserOrganisation[];

  // Count
  _count?: {
    UserOrganisation: number;
  };
}

// ✅ Master Main Time Zone Create/Update Schema
export const MasterMainTimeZoneSchema = z.object({
  country_id: single_select_mandatory('Country'), // ✅ Single-selection -> MasterMainCountry
  time_zone_identifier: stringOptional('Time Zone Identifier', 0, 100),
  time_zone_code: stringMandatory('Time Zone Code', 2, 50),
  time_zone_abbrevation: stringMandatory('Time Zone Abbreviation', 2, 100),
  time_zone_utc: stringMandatory('Time Zone Offset', 2, 100),
  time_zone_offset: stringMandatory('Time Zone Offset', 2, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainTimeZoneDTO = z.infer<typeof MasterMainTimeZoneSchema>;

// ✅ Master Main Time Zone Query Schema
export const MasterMainTimeZoneQuerySchema = BaseQuerySchema.extend({
  country_ids: multi_select_optional('Country'), // ✅ Multi-selection -> MasterMainCountry
  time_zone_ids: multi_select_optional('Time Zone'), // ✅ Multi-selection -> MasterMainTimeZone
});
export type MasterMainTimeZoneQueryDTO = z.infer<
  typeof MasterMainTimeZoneQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainTimeZonePayload = (
  timeZone: MasterMainTimeZone
): MasterMainTimeZoneDTO => ({
  country_id: timeZone.country_id,
  time_zone_identifier: timeZone.time_zone_identifier ?? '',
  time_zone_code: timeZone.time_zone_code,
  time_zone_abbrevation: timeZone.time_zone_abbrevation,
  time_zone_utc: timeZone.time_zone_utc,
  time_zone_offset: timeZone.time_zone_offset,
  status: timeZone.status,
});

// Generate a new payload with default values
export const newMasterMainTimeZonePayload = (): MasterMainTimeZoneDTO => ({
  country_id: '',
  time_zone_identifier: '',
  time_zone_code: '',
  time_zone_abbrevation: '',
  time_zone_utc: '',
  time_zone_offset: '',
  status: Status.Active,
});

// API Methods
export const findMasterMainTimeZones = async (
  data: MasterMainTimeZoneQueryDTO
): Promise<FBR<MasterMainTimeZone[]>> => {
  return apiPost<FBR<MasterMainTimeZone[]>, MasterMainTimeZoneQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainTimeZone = async (
  data: MasterMainTimeZoneDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainTimeZoneDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainTimeZone = async (
  id: string,
  data: MasterMainTimeZoneDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainTimeZoneDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainTimeZone = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterMainTimeZoneCache = async (
  country_id: string
): Promise<FBR<MasterMainTimeZone[]>> => {
  return apiGet<FBR<MasterMainTimeZone[]>>(ENDPOINTS.cache(country_id));
};
