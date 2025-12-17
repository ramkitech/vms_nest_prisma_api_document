// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { MasterMainCountry } from '../../../services/master/main/master_main_country_service';
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';

const URL = 'master/main/currency';

const ENDPOINTS = {
  // MasterMainCurrency APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (country_id: string): string => `${URL}/cache?country_id=${country_id}`,
};

// MasterMainCurrency Interface
export interface MasterMainCurrency extends Record<string, unknown> {
  // Primary Fields
  currency_id: string;

  // Main Field Details
  currency_name: string;
  currency_symbol?: string;
  currency_code: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  country_id: string;
  MasterMainCountry?: MasterMainCountry;
  country_name?: string;

  // Relations - Child
  UserOrganisation?: UserOrganisation[];

  // Relations - Child Count
  _count?: {
    UserOrganisation?: number;
  };
}

// MasterMainCurrency Create/Update Schema
export const MasterMainCurrencySchema = z.object({
  // Relations - Parent
  country_id: single_select_mandatory('MasterMainCountry'), // Single-Selection -> MasterMainCountry

  // Main Field Details
  currency_name: stringMandatory('Currency Name', 3, 100),
  currency_symbol: stringOptional('Currency Symbol', 0, 10),
  currency_code: stringMandatory('Currency Code', 2, 10),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainCurrencyDTO = z.infer<typeof MasterMainCurrencySchema>;

// MasterMainCurrency Query Schema
export const MasterMainCurrencyQuerySchema = BaseQuerySchema.extend({
  // Self Table
  currency_ids: multi_select_optional('MasterMainCurrency'), // Multi-selection -> MasterMainCurrency

  // Relations - Parent
  country_ids: multi_select_optional('MasterMainCountry'), // Multi-selection -> MasterMainCountry
});
export type MasterMainCurrencyQueryDTO = z.infer<
  typeof MasterMainCurrencyQuerySchema
>;

// Convert MasterMainCurrency Data to API Payload
export const toMasterMainCurrencyPayload = (row: MasterMainCurrency): MasterMainCurrencyDTO => ({
  country_id: row.country_id || '',

  currency_name: row.currency_name || '',
  currency_symbol: row.currency_symbol || '',
  currency_code: row.currency_code || '',

  status: row.status || Status.Active,
});

// Create New MasterMainCurrency Payload
export const newMasterMainCurrencyPayload = (): MasterMainCurrencyDTO => ({
  country_id: '',

  currency_name: '',
  currency_symbol: '',
  currency_code: '',

  status: Status.Active,
});

// MasterMainCurrency APIs
export const findMasterMainCurrencies = async (data: MasterMainCurrencyQueryDTO): Promise<FBR<MasterMainCurrency[]>> => {
  return apiPost<FBR<MasterMainCurrency[]>, MasterMainCurrencyQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainCurrency = async (data: MasterMainCurrencyDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainCurrencyDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainCurrency = async (id: string, data: MasterMainCurrencyDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainCurrencyDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainCurrency = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterMainCurrencyCache = async (country_id: string): Promise<FBR<MasterMainCurrency[]>> => {
  return apiGet<FBR<MasterMainCurrency[]>>(ENDPOINTS.cache(country_id));
};

