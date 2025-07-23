// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  multi_select_optional,
  stringMandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// URL and Endpoints
const URL = 'master/main/fasttag_bank';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
};

// Master Main Fasttag Bank Interface
export interface MasterMainFasttagBank extends Record<string, unknown> {
  // Primary Fields
  fasttag_bank_id: string;
  bank_name: string;
  bank_code?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;
}

// ✅ Master Main Fasttag Bank Create/Update Schema
export const MasterMainFasttagSchema = z.object({
  bank_name: stringMandatory('Bank Name', 3, 100),
  bank_code: stringOptional('Bank Code', 0, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainFasttagDTO = z.infer<typeof MasterMainFasttagSchema>;

// ✅ Master Main Fasttag Bank Query Schema
export const MasterMainFasttagQuerySchema = BaseQuerySchema.extend({
  fasttag_bank_ids: multi_select_optional('MasterMainFasttagBank'),
});
export type MasterMainFasttagQueryDTO = z.infer<
  typeof MasterMainFasttagQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainFasttagPayload = (
  fasttagBank: MasterMainFasttagBank
): MasterMainFasttagDTO => ({
  bank_name: fasttagBank.bank_name,
  bank_code: fasttagBank.bank_code ?? '',
  status: fasttagBank.status,
});

// Generate a new payload with default values
export const newMasterMainFasttagPayload = (): MasterMainFasttagDTO => ({
  bank_name: '',
  bank_code: '',
  status: Status.Active,
});

// API Methods
export const findMasterMainFasttagBanks = async (
  data: MasterMainFasttagQueryDTO
): Promise<FBR<MasterMainFasttagBank[]>> => {
  return apiPost<FBR<MasterMainFasttagBank[]>, MasterMainFasttagQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainFasttagBank = async (
  data: MasterMainFasttagDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainFasttagDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainFasttagBank = async (
  id: string,
  data: MasterMainFasttagDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainFasttagDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainFasttagBank = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Method
export const getMasterMainFasttagBankCache = async (): Promise<
  FBR<MasterMainFasttagBank[]>
> => {
  return apiGet<FBR<MasterMainFasttagBank[]>>(ENDPOINTS.cache);
};
