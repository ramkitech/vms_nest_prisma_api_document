// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

const URL = 'master/main/sim_provider';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
};

// Master Main SimProvider Interface
export interface MasterMainSimProvider extends Record<string, unknown> {
  // Primary Fields
  sim_provider_id: string;
  provider_name: string; // Min: 3, Max: 50
  country_notes: string; // Min: 2, Max: 10

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Count
  _count?: object;
}

// ✅ Master Main SimProvider Create/Update Schema
export const MasterMainSimProviderSchema = z.object({
  provider_name: stringMandatory('Provider Name', 3, 100),
  country_notes: stringMandatory('Country Notes', 2, 200),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainSimProviderDTO = z.infer<
  typeof MasterMainSimProviderSchema
>;

// ✅ Master Main SimProvider Query Schema
export const MasterMainSimProviderQuerySchema = BaseQuerySchema.extend({
  sim_provider_ids: multi_select_optional('SimProvider'), // ✅ Multi-selection -> MasterMainSimProvider
});
export type MasterMainSimProviderQueryDTO = z.infer<
  typeof MasterMainSimProviderQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainSimProviderPayload = (
  row: MasterMainSimProvider
): MasterMainSimProviderDTO => ({
  provider_name: row.provider_name,
  country_notes: row.country_notes,
  status: row.status,
});

// Generate a new payload with default values
export const newMasterMainSimProviderPayload =
  (): MasterMainSimProviderDTO => ({
    provider_name: '',
    country_notes: '',
    status: Status.Active,
  });

// API Methods
export const findMasterMainSimProviders = async (
  data: MasterMainSimProviderQueryDTO
): Promise<FBR<MasterMainSimProvider[]>> => {
  return apiPost<FBR<MasterMainSimProvider[]>, MasterMainSimProviderQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainSimProvider = async (
  data: MasterMainSimProviderDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainSimProviderDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainSimProvider = async (
  id: string,
  data: MasterMainSimProviderDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainSimProviderDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainSimProvider = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterMainSimProviderCache = async (): Promise<
  FBR<MasterMainSimProvider[]>
> => {
  return apiGet<FBR<MasterMainSimProvider[]>>(ENDPOINTS.cache);
};
