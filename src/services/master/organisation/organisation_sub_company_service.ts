// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// Other Models
import { UserOrganisation } from 'services/main/users/user_organisation_service';
import { MasterVehicle } from 'services/main/vehicle/master_vehicle_service';

const URL = 'master/organisation/sub_company';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_child: (organisation_id: string): string =>
    `${URL}/cache_child/${organisation_id}`,
  cache_count: (organisation_id: string): string =>
    `${URL}/cache_count/${organisation_id}`,
};

// Organisation Sub Company Interface
export interface OrganisationSubCompany extends Record<string, unknown> {
  // Primary Fields
  organisation_sub_company_id: string;
  sub_company_name: string; // Min: 3, Max: 100
  sub_company_logo_url?: string;
  sub_company_logo_key?: string;
  sub_company_GSTIN: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation: UserOrganisation;

  // Relations - Child
  MasterVehicle: MasterVehicle[];

  // Count
  _count?: {
    MasterVehicle: number;
  };
}

// ✅ Organisation Sub Company Create/Update Schema
export const OrganisationSubCompanySchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  sub_company_name: stringMandatory('Sub Company Name', 3, 100),
  sub_company_logo_url: stringOptional('Sub Company Logo URL', 0, 300),
  sub_company_logo_key: stringOptional('Sub Company Logo Key', 0, 300),
  sub_company_GSTIN: stringMandatory('Sub Company GSTIN', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationSubCompanyDTO = z.infer<
  typeof OrganisationSubCompanySchema
>;

// ✅ Organisation Sub Company Query Schema
export const OrganisationSubCompanyQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  organisation_sub_company_ids: multi_select_optional(
    'Organisation Sub Company'
  ), // ✅ Multi-selection -> OrganisationSubCompany
});
export type OrganisationSubCompanyQueryDTO = z.infer<
  typeof OrganisationSubCompanyQuerySchema
>;

// Convert existing data to a payload structure
export const toOrganisationSubCompanyPayload = (
  subCompany: OrganisationSubCompany
): OrganisationSubCompanyDTO => ({
  organisation_id: subCompany.organisation_id,
  sub_company_name: subCompany.sub_company_name,
  sub_company_logo_url: subCompany.sub_company_logo_url || '',
  sub_company_logo_key: subCompany.sub_company_logo_key || '',
  sub_company_GSTIN: subCompany.sub_company_GSTIN,
  status: subCompany.status,
});

// Generate a new payload with default values
export const newOrganisationSubCompanyPayload =
  (): OrganisationSubCompanyDTO => ({
    organisation_id: '',
    sub_company_name: '',
    sub_company_logo_url: '',
    sub_company_logo_key: '',
    sub_company_GSTIN: '',
    status: Status.Active,
  });

// API Methods
export const findOrganisationSubCompanies = async (
  data: OrganisationSubCompanyQueryDTO
): Promise<FBR<OrganisationSubCompany[]>> => {
  return apiPost<FBR<OrganisationSubCompany[]>, OrganisationSubCompanyQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createOrganisationSubCompany = async (
  data: OrganisationSubCompanyDTO
): Promise<SBR> => {
  return apiPost<SBR, OrganisationSubCompanyDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationSubCompany = async (
  id: string,
  data: OrganisationSubCompanyDTO
): Promise<SBR> => {
  return apiPatch<SBR, OrganisationSubCompanyDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationSubCompany = async (
  id: string
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getOrganisationSubCompanyCache = async (
  organisation_id: string
): Promise<FBR<OrganisationSubCompany[]>> => {
  return apiGet<FBR<OrganisationSubCompany[]>>(
    ENDPOINTS.cache(organisation_id)
  );
};

export const getOrganisationSubCompanyCacheChild = async (
  organisation_id: string
): Promise<FBR<OrganisationSubCompany[]>> => {
  return apiGet<FBR<OrganisationSubCompany[]>>(
    ENDPOINTS.cache_child(organisation_id)
  );
};

export const getOrganisationSubCompanyCacheCount = async (
  organisation_id: string
): Promise<FBR<OrganisationSubCompany[]>> => {
  return apiGet<FBR<OrganisationSubCompany[]>>(
    ENDPOINTS.cache_count(organisation_id)
  );
};
