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

const URL = 'master/bus/class';

const ENDPOINTS = {
  // MasterClass APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterClass Interface
export interface MasterClass extends Record<string, unknown> {
  // Primary Fields
  class_id: string;
  class_name: string;
  description?: string;

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

// MasterClass Create/Update Schema
export const MasterClassSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  class_name: stringMandatory('Class Name', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterClassDTO = z.infer<typeof MasterClassSchema>;

// MasterClass Query Schema
export const MasterClassQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  class_ids: multi_select_optional('MasterClass'), // ✅ Multi-selection -> MasterClass
});
export type MasterClassQueryDTO = z.infer<typeof MasterClassQuerySchema>;

// Convert MasterClass Data to API Payload
export const toMasterClassPayload = (row: MasterClass): MasterClassDTO => ({
  organisation_id: row.organisation_id || '',
  class_name: row.class_name || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterClass Payload
export const newMasterClassPayload = (): MasterClassDTO => ({
  organisation_id: '',
  class_name: '',
  description: '',
  status: Status.Active
});

// MasterClass APIs
export const findMasterClass = async (data: MasterClassQueryDTO): Promise<FBR<MasterClass[]>> => {
  return apiPost<FBR<MasterClass[]>, MasterClassQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterClass = async (data: MasterClassDTO): Promise<SBR> => {
  return apiPost<SBR, MasterClassDTO>(ENDPOINTS.create, data);
};

export const updateMasterClass = async (id: string, data: MasterClassDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterClassDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterClass = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterClassCache = async (organisation_id: string): Promise<FBR<MasterClass[]>> => {
  return apiGet<FBR<MasterClass[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterClassCacheCount = async (organisation_id: string): Promise<FBR<MasterClass>> => {
  return apiGet<FBR<MasterClass>>(ENDPOINTS.cache_count(organisation_id));
};

