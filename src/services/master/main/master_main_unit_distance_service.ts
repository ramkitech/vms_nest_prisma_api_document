// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';

const URL = 'master/main/unit_distance';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
};

// Master Main Unit Distance Interface
export interface MasterMainUnitDistance extends Record<string, unknown> {
  // Primary Fields
  unit_id: string;
  unit_name: string; // Min: 1, Max: 20
  unit_code: string; // Min: 1, Max: 10

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  UserOrganisation: UserOrganisation[];

  // Count
  _count?: {
    UserOrganisation: number;
  };
}

// ✅ Master Main Unit Distance Create/Update Schema
export const MasterMainUnitDistanceSchema = z.object({
  unit_name: stringMandatory('Unit Name', 1, 50),
  unit_code: stringMandatory('Unit Code', 1, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainUnitDistanceDTO = z.infer<
  typeof MasterMainUnitDistanceSchema
>;

// ✅ Master Main Unit Distance Query Schema
export const MasterMainUnitDistanceQuerySchema = BaseQuerySchema.extend({
  unit_ids: multi_select_optional('Unit Distance'), // ✅ Multi-selection -> MasterMainUnitDistance
});
export type MasterMainUnitDistanceQueryDTO = z.infer<
  typeof MasterMainUnitDistanceQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainUnitDistancePayload = (
  unitDistance: MasterMainUnitDistance
): MasterMainUnitDistanceDTO => ({
  unit_name: unitDistance.unit_name,
  unit_code: unitDistance.unit_code,
  status: unitDistance.status,
});

// Generate a new payload with default values
export const newMasterMainUnitDistancePayload =
  (): MasterMainUnitDistanceDTO => ({
    unit_name: '',
    unit_code: '',
    status: Status.Active,
  });

// API Methods
export const findMasterMainUnitDistances = async (
  data: MasterMainUnitDistanceQueryDTO
): Promise<FBR<MasterMainUnitDistance[]>> => {
  return apiPost<FBR<MasterMainUnitDistance[]>, MasterMainUnitDistanceQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainUnitDistance = async (
  data: MasterMainUnitDistanceDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainUnitDistanceDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainUnitDistance = async (
  id: string,
  data: MasterMainUnitDistanceDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainUnitDistanceDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainUnitDistance = async (
  id: string
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterMainUnitDistanceCache = async (): Promise<
  FBR<MasterMainUnitDistance[]>
> => {
  return apiGet<FBR<MasterMainUnitDistance[]>>(ENDPOINTS.cache);
};
