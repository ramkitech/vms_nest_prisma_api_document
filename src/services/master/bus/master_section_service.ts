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

const URL = 'master/bus/section';

const ENDPOINTS = {
  // MasterSection APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterSection Interface
export interface MasterSection extends Record<string, unknown> {
  // Primary Fields
  section_id: string;

  // Main Field Details
  section_name: string;
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
  Student?: Student[];

  // Relations - Child Count
  _count?: {
    Student?: number;
  };
}

// MasterSection Create/Update Schema
export const MasterSectionSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  section_name: stringMandatory('Section Name', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterSectionDTO = z.infer<typeof MasterSectionSchema>;

// MasterSection Query Schema
export const MasterSectionQuerySchema = BaseQuerySchema.extend({
  // Self Table
  section_ids: multi_select_optional('MasterSection'), // Multi-selection -> MasterSection

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterSectionQueryDTO = z.infer<typeof MasterSectionQuerySchema>;

// Convert MasterSection Data to API Payload
export const toMasterSectionPayload = (row: MasterSection): MasterSectionDTO => ({
  organisation_id: row.organisation_id || '',

  section_name: row.section_name || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterSection Payload
export const newMasterSectionPayload = (): MasterSectionDTO => ({
  organisation_id: '',

  section_name: '',
  description: '',

  status: Status.Active
});

// MasterSection APIs
export const findMasterSection = async (data: MasterSectionQueryDTO): Promise<FBR<MasterSection[]>> => {
  return apiPost<FBR<MasterSection[]>, MasterSectionQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterSection = async (data: MasterSectionDTO): Promise<SBR> => {
  return apiPost<SBR, MasterSectionDTO>(ENDPOINTS.create, data);
};

export const updateMasterSection = async (id: string, data: MasterSectionDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterSectionDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterSection = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterSectionCache = async (organisation_id: string): Promise<FBR<MasterSection[]>> => {
  return apiGet<FBR<MasterSection[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterSectionCacheCount = async (organisation_id: string): Promise<FBR<MasterSection>> => {
  return apiGet<FBR<MasterSection>>(ENDPOINTS.cache_count(organisation_id));
};

