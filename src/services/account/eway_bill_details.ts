// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringOptional,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../core/Enums';

// Other Models
import { UserOrganisation } from '../main/users/user_organisation_service';
import { User } from '../main/users/user_service';
import { MasterMainEwayBillProvider } from '../master/main/master_main_eway_bill_provider_service';

// URL and Endpoints
const URL = 'account/eway_bill_details';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// EWayBillDetails Interface
export interface EWayBillDetails extends Record<string, unknown> {
  // Primary Fields
  eway_bill_details_id: string;
  api_client_id: string;
  api_key: string;
  api_secret: string;
  description: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  e_way_bill_provider_id: string;
  MasterMainEWayBillProvider?: MasterMainEwayBillProvider;
  provider_name?: string;
  provider_code?: string;

  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;
  organisation_logo_url?: string;

  user_id: string;
  User?: User;
  user_details?: string;
  user_image_url?: string;
}

// EWayBillDetails Create/Update Schema
export const EWayBillDetailsSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_mandatory('User'), // Single-Selection -> User
  e_way_bill_provider_id: single_select_mandatory('MasterMainEWayBillProvider'), // Single-Selection -> MasterMainEWayBillProvider

  // Main Field Details
  api_client_id: stringOptional('API Client ID', 0, 100),
  api_key: stringOptional('API Key', 0, 100),
  api_secret: stringOptional('API Secret', 0, 100),
  description: stringOptional('Description', 0, 500),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type EWayBillDetailsDTO = z.infer<typeof EWayBillDetailsSchema>;

// EWayBillDetails Query Schema
export const EWayBillDetailsQuerySchema = BaseQuerySchema.extend({
  // Self Table
  eway_bill_details_ids: multi_select_optional('EWayBillDetails'), // Multi-Selection -> EWayBillDetails

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-selection -> User
  e_way_bill_provider_ids: multi_select_optional('MasterMainEWayBillProvider'), // Multi-selection -> MasterMainEWayBillProvider
});
export type EWayBillDetailsQueryDTO = z.infer<
  typeof EWayBillDetailsQuerySchema
>;

// Convert existing data to a payload structure
export const toEWayBillDetailsPayload = (row: EWayBillDetails): EWayBillDetailsDTO => ({
  organisation_id: row.organisation_id,
  user_id: row.user_id,
  e_way_bill_provider_id: row.e_way_bill_provider_id,

  api_client_id: row.api_client_id ?? '',
  api_key: row.api_key ?? '',
  api_secret: row.api_secret ?? '',
  description: row.description ?? '',

  status: row.status || Status.Active,
});

// Generate a new payload with default values
export const newEWayBillDetailsPayload = (): EWayBillDetailsDTO => ({
  e_way_bill_provider_id: '',
  organisation_id: '',
  user_id: '',

  api_client_id: '',
  api_key: '',
  api_secret: '',
  description: '',

  status: Status.Active,
});

// API Methods
export const findEWayBillDetails = async (data: EWayBillDetailsQueryDTO): Promise<FBR<EWayBillDetails[]>> => {
  return apiPost<FBR<EWayBillDetails[]>, EWayBillDetailsQueryDTO>(ENDPOINTS.find, data);
};

export const createEWayBillDetails = async (data: EWayBillDetailsDTO): Promise<SBR> => {
  return apiPost<SBR, EWayBillDetailsDTO>(ENDPOINTS.create, data);
};

export const updateEWayBillDetails = async (id: string, data: EWayBillDetailsDTO): Promise<SBR> => {
  return apiPatch<SBR, EWayBillDetailsDTO>(ENDPOINTS.update(id), data);
};

export const deleteEWayBillDetails = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
