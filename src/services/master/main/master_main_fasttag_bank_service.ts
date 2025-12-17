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

const URL = 'master/main/fasttag_bank';

const ENDPOINTS = {
  // MasterMainFasttagBank APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: `${URL}/cache`,
};

// MasterMainFasttagBank Interface
export interface MasterMainFasttagBank extends Record<string, unknown> {
  // Primary Fields
  fasttag_bank_id: string;

  // Main Field Details
  bank_name: string;
  bank_code?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  // Child - Main
  // FasttagDetails?: FasttagDetails[];

  // Relations - Child Count
  _count?: {
    FasttagDetails?: number;
  };
}

// MasterMainFasttagBank Create/Update Schema
export const MasterMainFasttagBankSchema = z.object({
  // Main Field Details
  bank_name: stringMandatory('Bank Name', 3, 100),
  bank_code: stringOptional('Bank Code', 0, 10),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainFasttagBankDTO = z.infer<
  typeof MasterMainFasttagBankSchema
>;

// MasterMainFasttagBank Query Schema
export const MasterMainFasttagBankQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fasttag_bank_ids: multi_select_optional('MasterMainFasttagBank'), // Multi-selection -> MasterMainFasttagBank
});
export type MasterMainFasttagBankQueryDTO = z.infer<
  typeof MasterMainFasttagBankQuerySchema
>;

// Convert MasterMainFasttagBank Data to API Payload
export const toMasterMainFasttagPayload = (row: MasterMainFasttagBank): MasterMainFasttagBankDTO => ({
  bank_name: row.bank_name || '',
  bank_code: row.bank_code || '',

  status: row.status || Status.Active,
});

// Create New MasterMainFasttagBank Payload
export const newMasterMainFasttagPayload = (): MasterMainFasttagBankDTO => ({
  bank_name: '',
  bank_code: '',
  
  status: Status.Active,
});

// MasterMainFasttagBank APIs
export const findMasterMainFasttagBanks = async (data: MasterMainFasttagBankQueryDTO): Promise<FBR<MasterMainFasttagBank[]>> => {
  return apiPost<FBR<MasterMainFasttagBank[]>, MasterMainFasttagBankQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainFasttagBank = async (data: MasterMainFasttagBankDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainFasttagBankDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainFasttagBank = async (id: string, data: MasterMainFasttagBankDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainFasttagBankDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainFasttagBank = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterMainFasttagBankCache = async (): Promise<FBR<MasterMainFasttagBank[]>> => {
  return apiGet<FBR<MasterMainFasttagBank[]>>(ENDPOINTS.cache);
};

