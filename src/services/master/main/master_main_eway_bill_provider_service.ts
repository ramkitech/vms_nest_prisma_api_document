// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'core/apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  multi_select_optional,
  stringMandatory,
  stringOptional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// URL and Endpoints
const URL = 'master/main/eway_bill_provider';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
};

// Master Main EWay Bill Provider Interface
export interface MasterMainEwayBillProvider extends Record<string, unknown> {
  // Primary Fields
  e_way_bill_provider_id: string;
  provider_name: string;
  provider_code?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;
}

// ✅ Master Main EWay Bill Provider Create/Update Schema
export const MasterMainEwayBillProviderSchema = z.object({
  provider_name: stringMandatory('Provider Name', 3, 100),
  provider_code: stringOptional('Provider Code', 0, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainEwayBillProviderDTO = z.infer<
  typeof MasterMainEwayBillProviderSchema
>;

// ✅ Master Main EWay Bill Provider Query Schema
export const MasterMainEwayBillProviderQuerySchema = BaseQuerySchema.extend({
  e_way_bill_provider_ids: multi_select_optional('MasterMainEWayBillProvider'),
});
export type MasterMainEwayBillProviderQueryDTO = z.infer<
  typeof MasterMainEwayBillProviderQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainEwayBillProviderPayload = (
  provider: MasterMainEwayBillProvider
): MasterMainEwayBillProviderDTO => ({
  provider_name: provider.provider_name,
  provider_code: provider.provider_code ?? '',
  status: provider.status,
});

// Generate a new payload with default values
export const newMasterMainEwayBillProviderPayload =
  (): MasterMainEwayBillProviderDTO => ({
    provider_name: '',
    provider_code: '',
    status: Status.Active,
  });

// API Methods
export const findMasterMainEwayBillProviders = async (
  data: MasterMainEwayBillProviderQueryDTO
): Promise<FBR<MasterMainEwayBillProvider[]>> => {
  return apiPost<
    FBR<MasterMainEwayBillProvider[]>,
    MasterMainEwayBillProviderQueryDTO
  >(ENDPOINTS.find, data);
};

export const createMasterMainEwayBillProvider = async (
  data: MasterMainEwayBillProviderDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainEwayBillProviderDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainEwayBillProvider = async (
  id: string,
  data: MasterMainEwayBillProviderDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainEwayBillProviderDTO>(
    ENDPOINTS.update(id),
    data
  );
};

export const deleteMasterMainEwayBillProvider = async (
  id: string
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Method
export const getMasterMainEwayBillProviderCache = async (): Promise<
  FBR<MasterMainEwayBillProvider[]>
> => {
  return apiGet<FBR<MasterMainEwayBillProvider[]>>(ENDPOINTS.cache);
};
