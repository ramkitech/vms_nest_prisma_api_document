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
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { Student } from 'src/services/fleet/bus_mangement/student';

const URL = 'master/bus/year';

const ENDPOINTS = {
  // MasterYear APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterYear Interface
export interface MasterYear extends Record<string, unknown> {
  // Primary Fields
  year_id: string;

  // Main Field Details
  year_name: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;

  // Relations - Children
  // Child - Fleet
  Student?: Student[];

  // Relations - Child Count
  _count?: {
    Student?: number;
  };
}

// MasterYear Create/Update Schema
export const MasterYearSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  year_name: stringMandatory('Year Name', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterYearDTO = z.infer<typeof MasterYearSchema>;

// MasterYear Query Schema
export const MasterYearQuerySchema = BaseQuerySchema.extend({
  // Self Table
  year_ids: multi_select_optional('MasterYear'), // Multi-selection -> MasterYear

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterYearQueryDTO = z.infer<typeof MasterYearQuerySchema>;

// Convert MasterYear Data to API Payload
export const toMasterYearPayload = (row: MasterYear): MasterYearDTO => ({
  organisation_id: row.organisation_id || '',

  year_name: row.year_name || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterYear Payload
export const newMasterYearPayload = (): MasterYearDTO => ({
  organisation_id: '',

  year_name: '',
  description: '',

  status: Status.Active
});

// MasterYear APIs
export const findMasterYear = async (data: MasterYearQueryDTO): Promise<FBR<MasterYear[]>> => {
  return apiPost<FBR<MasterYear[]>, MasterYearQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterYear = async (data: MasterYearDTO): Promise<SBR> => {
  return apiPost<SBR, MasterYearDTO>(ENDPOINTS.create, data);
};

export const updateMasterYear = async (id: string, data: MasterYearDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterYearDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterYear = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterYearCache = async (organisation_id: string): Promise<FBR<MasterYear[]>> => {
  return apiGet<FBR<MasterYear[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterYearCacheCount = async (organisation_id: string): Promise<FBR<MasterYear>> => {
  return apiGet<FBR<MasterYear>>(ENDPOINTS.cache_count(organisation_id));
};

