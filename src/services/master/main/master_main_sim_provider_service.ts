// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';
import { MasterSim } from 'src/services/main/sims/master_sim_service';

const URL = 'master/main/sim_provider';

const ENDPOINTS = {
  // MasterMainSimProvider APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: `${URL}/cache`,
};

// MasterMainSimProvider Interface
export interface MasterMainSimProvider extends Record<string, unknown> {
  // Primary Fields
  sim_provider_id: string;
  provider_name: string;
  country_notes: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  // Child - Main
  MasterSim?: MasterSim[];

  // Relations - Child Count
  _count?: {
    MasterSim?: number;
  };
}

// ✅ MasterMainSimProvider Create/Update Schema
export const MasterMainSimProviderSchema = z.object({
  provider_name: stringMandatory('Provider Name', 1, 100),
  country_notes: stringOptional('Country Notes', 1, 200),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainSimProviderDTO = z.infer<
  typeof MasterMainSimProviderSchema
>;

// ✅ MasterMainSimProvider Query Schema
export const MasterMainSimProviderQuerySchema = BaseQuerySchema.extend({
  sim_provider_ids: multi_select_optional('Sim Provider'), // ✅ Multi-selection -> MasterMainSimProvider
});
export type MasterMainSimProviderQueryDTO = z.infer<
  typeof MasterMainSimProviderQuerySchema
>;

// Convert MasterMainSimProvider Data to API Payload
export const toMasterMainSimProviderPayload = (row: MasterMainSimProvider): MasterMainSimProviderDTO => ({
  provider_name: row.provider_name || '',
  country_notes: row.country_notes || '',
  status: row.status || Status.Active,
});

// Create New MasterMainSimProvider Payload
export const newMasterMainSimProviderPayload = (): MasterMainSimProviderDTO => ({
  provider_name: '',
  country_notes: '',
  status: Status.Active,
});

// MasterMainSimProvider APIs
export const findMasterMainSimProviders = async (data: MasterMainSimProviderQueryDTO): Promise<FBR<MasterMainSimProvider[]>> => {
  return apiPost<FBR<MasterMainSimProvider[]>, MasterMainSimProviderQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainSimProvider = async (data: MasterMainSimProviderDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainSimProviderDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainSimProvider = async (id: string, data: MasterMainSimProviderDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainSimProviderDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainSimProvider = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterMainSimProviderCache = async (): Promise<FBR<MasterMainSimProvider[]>> => {
  return apiGet<FBR<MasterMainSimProvider[]>>(ENDPOINTS.cache);
};

