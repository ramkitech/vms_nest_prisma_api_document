// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// Other Models
import { MasterMainCountry } from 'services/master/main/master_main_country_service';
import { UserOrganisation } from 'services/main/users/user_organisation_service';

const URL = 'master/main/currency';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (country_id: string): string =>
    `${URL}/cache?country_id=${country_id}`,
};

// Master Main Currency Interface
export interface MasterMainCurrency extends Record<string, unknown> {
  // Primary Fields
  currency_id: string;
  currency_name: string; // Min: 3, Max: 100
  currency_symbol?: string; // Optional, Max: 10
  currency_code: string; // Min: 2, Max: 10

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  country_id: string;
  MasterMainCountry?: MasterMainCountry;

  // Relations - Child
  UserOrganisation: UserOrganisation[];

  // Count
  _count?: {
    UserOrganisation: number;
  };
}

// ✅ Master Main Currency Create/Update Schema
export const MasterMainCurrencySchema = z.object({
  country_id: single_select_mandatory('Country'), // ✅ Single-selection -> MasterMainCountry
  currency_name: stringMandatory('Currency Name', 3, 100),
  currency_code: stringMandatory('Currency Code', 2, 10),
  currency_symbol: stringOptional('Currency Symbol', 0, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainCurrencyDTO = z.infer<typeof MasterMainCurrencySchema>;

// ✅ Master Main Currency Query Schema
export const MasterMainCurrencyQuerySchema = BaseQuerySchema.extend({
  country_ids: multi_select_optional('Country'), // ✅ Multi-selection -> MasterMainCountry
  currency_ids: multi_select_optional('Currency'), // ✅ Multi-selection -> MasterMainCurrency
});
export type MasterMainCurrencyQueryDTO = z.infer<
  typeof MasterMainCurrencyQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainCurrencyPayload = (
  currency: MasterMainCurrency
): MasterMainCurrencyDTO => ({
  country_id: currency.country_id,
  currency_name: currency.currency_name,
  currency_symbol: currency.currency_symbol ?? '',
  currency_code: currency.currency_code,
  status: currency.status,
});

// Generate a new payload with default values
export const newMasterMainCurrencyPayload = (): MasterMainCurrencyDTO => ({
  country_id: '',
  currency_name: '',
  currency_symbol: '',
  currency_code: '',
  status: Status.Active,
});

// API Methods
export const findMasterMainCurrencies = async (
  data: MasterMainCurrencyQueryDTO
): Promise<FBR<MasterMainCurrency[]>> => {
  return apiPost<FBR<MasterMainCurrency[]>, MasterMainCurrencyQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainCurrency = async (
  data: MasterMainCurrencyDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainCurrencyDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainCurrency = async (
  id: string,
  data: MasterMainCurrencyDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainCurrencyDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainCurrency = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterMainCurrencyCache = async (
  country_id: string
): Promise<FBR<MasterMainCurrency[]>> => {
  return apiGet<FBR<MasterMainCurrency[]>>(ENDPOINTS.cache(country_id));
};
