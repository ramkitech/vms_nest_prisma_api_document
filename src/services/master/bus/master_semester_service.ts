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
import { User } from '../../main/users/user_service';
import { Student } from 'src/services/fleet/bus_mangement/student';

const URL = 'master/bus/semester';

const ENDPOINTS = {
  // MasterSemester APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterSemester Interface
export interface MasterSemester extends Record<string, unknown> {
  // Primary Fields
  semester_id: string;
  semester_name: string; // Min: 3, Max: 100
  description?: string; // Optional, Max: 300

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // Children
  // Child - Fleet
  Student?: Student[];

  // Relations - Child Count
  _count?: {
    Student?: number;
  };
}

// MasterSemester Create/Update Schema
export const MasterSemesterSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  semester_name: stringMandatory('Semester Name', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterSemesterDTO = z.infer<typeof MasterSemesterSchema>;

// MasterSemester Query Schema
export const MasterSemesterQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  semester_ids: multi_select_optional('MasterSemester'), // Multi-selection -> MasterSemester
});
export type MasterSemesterQueryDTO = z.infer<typeof MasterSemesterQuerySchema>;

// Convert MasterSemester Data to API Payload
export const toMasterSemesterPayload = (row: MasterSemester): MasterSemesterDTO => ({
  organisation_id: row.organisation_id || '',
  semester_name: row.semester_name || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterSemester Payload
export const newMasterSemesterPayload = (): MasterSemesterDTO => ({
  organisation_id: '',
  semester_name: '',
  description: '',
  status: Status.Active
});

// MasterSemester APIs
export const findMasterSemester = async (data: MasterSemesterQueryDTO): Promise<FBR<MasterSemester[]>> => {
  return apiPost<FBR<MasterSemester[]>, MasterSemesterQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterSemester = async (data: MasterSemesterDTO): Promise<SBR> => {
  return apiPost<SBR, MasterSemesterDTO>(ENDPOINTS.create, data);
};

export const updateMasterSemester = async (id: string, data: MasterSemesterDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterSemesterDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterSemester = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterSemesterCache = async (organisation_id: string): Promise<FBR<MasterSemester[]>> => {
  return apiGet<FBR<MasterSemester[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterSemesterCacheCount = async (organisation_id: string): Promise<FBR<MasterSemester>> => {
  return apiGet<FBR<MasterSemester>>(ENDPOINTS.cache_count(organisation_id));
};

