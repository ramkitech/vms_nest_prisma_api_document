// Imports
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
import { MasterMainCountry } from '../main/master_main_country_service';

// URL & Endpoints
const URL = 'master/expense/fuel_company';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterFuelCompany Type Interface
export interface MasterFuelCompany extends Record<string, unknown> {
  // Primary Fields
  fuel_company_id: string;
  company_name: string; // Min: 3, Max: 100
  description?: string; // Optional, Max: 100

  // Logo
  logo_url: String;
  logo_key: String;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  country_id?: string;
  MasterMainCountry?: MasterMainCountry;
}

// ✅ MasterFuelCompany Create/Update Schema
export const MasterFuelCompanySchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  country_id: single_select_mandatory('MasterMainCountry'), // ✅ Single-Selection -> MasterMainCountry
  company_name: stringMandatory('Company Name', 3, 100),
  description: stringOptional('Description', 0, 300),
  logo_url: stringOptional('Logo URL', 0, 300),
  logo_key: stringOptional('Logo Key', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFuelCompanyDTO = z.infer<typeof MasterFuelCompanySchema>;

// ✅ MasterFuelCompany Query Schema
export const MasterFuelCompanyQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  country_ids: multi_select_optional('MasterMainCountry'), // ✅ Multi-Selection -> MasterMainCountry
  fuel_company_ids: multi_select_optional('MasterFuelCompany'), // ✅ Multi-Selection -> MasterFuelCompany
});
export type MasterFuelCompanyQueryDTO = z.infer<
  typeof MasterFuelCompanyQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterFuelCompanyPayload = (row: MasterFuelCompany): MasterFuelCompanyDTO => ({
  organisation_id: row.organisation_id ?? '',
  country_id: row.country_id ?? '',
  company_name: row.company_name,
  logo_url: '',
  logo_key: '',
  description: row.description ?? '',
  status: row.status,
});

// Generate a new payload with default values
export const newMasterFuelCompanyPayload = (): MasterFuelCompanyDTO => ({
  organisation_id: '',
  country_id: '',
  company_name: '',
  description: '',
  logo_url: '',
  logo_key: '',
  status: Status.Active,
});

// API Methods
export const findMasterFuelCompanys = async (data: MasterFuelCompanyQueryDTO): Promise<FBR<MasterFuelCompany[]>> => {
  return apiPost<FBR<MasterFuelCompany[]>, MasterFuelCompanyQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterFuelCompany = async (data: MasterFuelCompanyDTO): Promise<SBR> => {
  return apiPost<SBR, MasterFuelCompanyDTO>(ENDPOINTS.create, data);
};

export const updateMasterFuelCompany = async (id: string, data: MasterFuelCompanyDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterFuelCompanyDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFuelCompany = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterFuelCompanyCache = async (organisation_id: string): Promise<FBR<MasterFuelCompany[]>> => {
  return apiGet<FBR<MasterFuelCompany[]>>(ENDPOINTS.cache(organisation_id));
};

