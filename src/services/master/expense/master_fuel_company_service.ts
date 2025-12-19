// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

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
import { FleetVendorFuelStation } from 'src/services/fleet/vendor_management/fleet_vendor_fuel_station';

const URL = 'master/expense/fuel_company';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  master_fuel_company_presigned_url: (fileName: string): string => `${URL}/master_fuel_company_presigned_url/${fileName}`,

  // File Uploads
  update_master_fuel_company_logo: (id: string): string => `${URL}/update_master_fuel_company_logo/${id}`,
  delete_master_fuel_company_logo: (id: string): string => `${URL}/delete_master_fuel_company_logo/${id}`,

  // MasterFuelCompany APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterFuelCompany Type Interface
export interface MasterFuelCompany extends Record<string, unknown> {
  // Primary Fields
  fuel_company_id: string;

  // Main Field Details
  company_name: string;
  description?: string;

  // Logo
  logo_url?: string;
  logo_key?: string;
  logo_name?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;

  country_id: string;
  MasterMainCountry?: MasterMainCountry;
  country_name?: string;

  // Relations - Child
  // Child - Fleet
  FleetVendorFuelStation?: FleetVendorFuelStation[]

  // Relations - Child Count
  _count?: {
    FleetVendorFuelStation?: number;
  };
}

// MasterFuelCompany Create/Update Schema
export const MasterFuelCompanySchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  country_id: single_select_mandatory('MasterMainCountry'), // Single-Selection -> MasterMainCountry

  // Profile Image/Logo
  logo_url: stringOptional('Logo URL', 0, 300),
  logo_key: stringOptional('Logo Key', 0, 300),
  logo_name: stringOptional('Logo Name', 0, 300),

  // Main Field Details
  company_name: stringMandatory('Company Name', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFuelCompanyDTO = z.infer<typeof MasterFuelCompanySchema>;

// MasterFuelCompany Query Schema
export const MasterFuelCompanyQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fuel_company_ids: multi_select_optional('MasterFuelCompany'), // Multi-Selection -> MasterFuelCompany

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  country_ids: multi_select_optional('MasterMainCountry'), // Multi-Selection -> MasterMainCountry
});
export type MasterFuelCompanyQueryDTO = z.infer<
  typeof MasterFuelCompanyQuerySchema
>;

// MasterFuelCompany Logo Schema
export const FuelCompanyLogoSchema = z.object({
  // Profile Image/Logo
  logo_url: stringMandatory('User Image URL', 0, 300),
  logo_key: stringMandatory('User Image Key', 0, 300),
  logo_name: stringMandatory('User Image Name', 0, 300),
});
export type FuelCompanyLogoDTO = z.infer<typeof FuelCompanyLogoSchema>;

// Convert MasterFuelCompany Data to API Payload
export const toMasterFuelCompanyPayload = (row: MasterFuelCompany): MasterFuelCompanyDTO => ({
  organisation_id: row.organisation_id || '',
  country_id: row.country_id || '',

  company_name: row.company_name || '',
  description: row.description || '',

  logo_url: row.logo_url || '',
  logo_key: row.logo_key || '',
  logo_name: row.logo_name || '',

  status: row.status || Status.Active,
});

// Create New MasterFuelCompany Payload
export const newMasterFuelCompanyPayload = (): MasterFuelCompanyDTO => ({
  organisation_id: '',
  country_id: '',

  company_name: '',
  description: '',

  logo_url: '',
  logo_key: '',
  logo_name: '',

  status: Status.Active,
});

// AWS S3 PRESIGNED
export const get_master_fuel_company_presigned_url = async (fileName: string): Promise<BR<AWSPresignedUrl>> => {
  return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.master_fuel_company_presigned_url(fileName));
};

// File Uploads
export const update_master_fuel_company_logo = async (id: string, data: FuelCompanyLogoDTO): Promise<SBR> => {
  return apiPatch<SBR, FuelCompanyLogoDTO>(ENDPOINTS.update_master_fuel_company_logo(id), data);
};

export const delete_master_fuel_company_logo = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_master_fuel_company_logo(id));
};

// MasterFuelCompany APIs
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

// Cache APIs
export const getMasterFuelCompanyCache = async (organisation_id: string): Promise<FBR<MasterFuelCompany[]>> => {
  return apiGet<FBR<MasterFuelCompany[]>>(ENDPOINTS.cache(organisation_id));
};

