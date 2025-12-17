// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BR, AWSPresignedUrl } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterVehicle } from '../../../services/main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';

const URL = 'master/organisation/sub_company';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  organisation_sub_company_logo_presigned_url: (fileName: string): string => `${URL}/organisation_sub_company_logo_presigned_url/${fileName}`,

  // File Uploads
  update_organisation_sub_company_logo: (id: string): string => `${URL}/update_organisation_sub_company_logo/${id}`,
  delete_organisation_sub_company_logo: (id: string): string => `${URL}/delete_organisation_sub_company_logo/${id}`,

  // OrganisationSubCompany APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// OrganisationSubCompany Interface
export interface OrganisationSubCompany extends Record<string, unknown> {
  // Primary Field
  organisation_sub_company_id: string;

  // Profile Image/Logo
  logo_key?: string;
  logo_url?: string;
  logo_name?: string;

  // Main Field Details
  sub_company_name: string;
  sub_company_GSTIN: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  MasterVehicle?: MasterVehicle[];
  MasterDriver?: MasterDriver[];

  // Relations - Child Count
  _count?: {
    MasterVehicle?: number;
    MasterDriver?: number;
  };
}

// OrganisationSubCompany Create/Update Schema
export const OrganisationSubCompanySchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Profile Image/Logo
  logo_url: stringOptional('Logo URL', 0, 300),
  logo_key: stringOptional('Logo Key', 0, 300),
  logo_name: stringOptional('Logo Name', 0, 300),

  // Main Field Details
  sub_company_name: stringMandatory('Sub Company Name', 3, 100),
  sub_company_GSTIN: stringMandatory('Sub Company GSTIN', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationSubCompanyDTO = z.infer<
  typeof OrganisationSubCompanySchema
>;

// OrganisationSubCompany Query Schema
export const OrganisationSubCompanyQuerySchema = BaseQuerySchema.extend({
  // Self Table
  organisation_sub_company_ids: multi_select_optional('OrganisationSubCompany'), // Multi-selection -> OrganisationSubCompany

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type OrganisationSubCompanyQueryDTO = z.infer<
  typeof OrganisationSubCompanyQuerySchema
>;

// OrganisationSubCompany Logo Schema
export const SubCompanyLogoSchema = z.object({
  // Profile Image/Logo
  logo_url: stringMandatory('User Image URL', 0, 300),
  logo_key: stringMandatory('User Image Key', 0, 300),
  logo_name: stringMandatory('User Image Name', 0, 300),
});
export type SubCompanyLogoDTO = z.infer<typeof SubCompanyLogoSchema>;

// Convert OrganisationSubCompany Data to API Payload
export const toOrganisationSubCompanyPayload = (row: OrganisationSubCompany): OrganisationSubCompanyDTO => ({
  organisation_id: row.organisation_id || '',

  logo_url: row.logo_url || '',
  logo_key: row.logo_key || '',
  logo_name: row.logo_name || '',

  sub_company_name: row.sub_company_name || '',
  sub_company_GSTIN: row.sub_company_GSTIN || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New OrganisationSubCompany Payload
export const newOrganisationSubCompanyPayload = (): OrganisationSubCompanyDTO => ({
  organisation_id: '',

  logo_url: '',
  logo_key: '',
  logo_name: '',

  sub_company_name: '',
  sub_company_GSTIN: '',
  description: '',

  status: Status.Active,
});

// AWS S3 PRESIGNED
export const get_organisation_sub_company_logo_presigned_url = async (fileName: string): Promise<BR<AWSPresignedUrl>> => {
  return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.organisation_sub_company_logo_presigned_url(fileName));
};

// File Uploads
export const update_organisation_sub_company_logo = async (id: string, data: SubCompanyLogoDTO): Promise<SBR> => {
  return apiPatch<SBR, SubCompanyLogoDTO>(ENDPOINTS.update_organisation_sub_company_logo(id), data);
};

export const delete_organisation_sub_company_logo = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_organisation_sub_company_logo(id));
};

// OrganisationSubCompany APIs
export const findOrganisationSubCompanyies = async (data: OrganisationSubCompanyQueryDTO): Promise<FBR<OrganisationSubCompany[]>> => {
  return apiPost<FBR<OrganisationSubCompany[]>, OrganisationSubCompanyQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationSubCompany = async (data: OrganisationSubCompanyDTO): Promise<SBR> => {
  return apiPost<SBR, OrganisationSubCompanyDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationSubCompany = async (id: string, data: OrganisationSubCompanyDTO): Promise<SBR> => {
  return apiPatch<SBR, OrganisationSubCompanyDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationSubCompany = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getOrganisationSubCompanyCache = async (organisation_id: string): Promise<FBR<OrganisationSubCompany[]>> => {
  return apiGet<FBR<OrganisationSubCompany[]>>(ENDPOINTS.cache(organisation_id));
};

export const getOrganisationSubCompanyCacheCount = async (organisation_id: string): Promise<FBR<OrganisationSubCompany[]>> => {
  return apiGet<FBR<OrganisationSubCompany[]>>(ENDPOINTS.cache_count(organisation_id));
};

export const getOrganisationSubCompanyCacheChild = async (organisation_id: string): Promise<FBR<OrganisationSubCompany[]>> => {
  return apiGet<FBR<OrganisationSubCompany[]>>(ENDPOINTS.cache_child(organisation_id));
};
