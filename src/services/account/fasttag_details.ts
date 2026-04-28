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
import { MasterMainFasttagBank } from '../master/main/master_main_fasttag_bank_service';

// URL and Endpoints
const URL = 'account/fasttag_details';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// FASTagDetails Interface
export interface FASTagDetails extends Record<string, unknown> {
  // Primary Fields
  fasttag_details_id: string;
  api_client_id: string; // Min: 3, Max: 100
  api_key: string; // Min: 3, Max: 100
  api_secret: string; // Min: 3, Max: 100
  description: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  fasttag_bank_id: string;
  MasterMainFASTagBank?: MasterMainFasttagBank;
  bank_name?: string;
  bank_code?: string;

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


// FASTagDetail Create/Update Schema
export const FasttagDetailSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_mandatory('User'), // Single-Selection -> User
  fasttag_bank_id: single_select_mandatory('MasterMainFASTagBank'), // Single-Selection -> MasterMainFASTagBank

  // Main Field Details
  api_client_id: stringOptional('API Client ID', 0, 100),
  api_key: stringOptional('API Key', 0, 100),
  api_secret: stringOptional('API Secret', 0, 100),
  description: stringOptional('Description', 0, 500),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FasttagDetailDTO = z.infer<typeof FasttagDetailSchema>;

// FasttagDetail Query Schema
export const FasttagDetailQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fasttag_details_ids: multi_select_optional('FASTagDetails'), // Multi-selection -> FASTagDetails

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-selection -> User
  fasttag_bank_ids: multi_select_optional('MasterMainFASTagBank'), // Multi-selection -> MasterMainFASTagBank
});
export type FasttagDetailQueryDTO = z.infer<typeof FasttagDetailQuerySchema>;


// Convert existing data to a payload structure
export const toFasttagDetailPayload = (row: FASTagDetails): FasttagDetailDTO => ({
  organisation_id: row.organisation_id,
  user_id: row.user_id,
  fasttag_bank_id: row.fasttag_bank_id,

  api_client_id: row.api_client_id ?? '',
  api_key: row.api_key ?? '',
  api_secret: row.api_secret ?? '',
  description: row.description ?? '',

  status: row.status|| Status.Active,
});


// Generate a new payload with default values
export const newFasttagDetailPayload = (): FasttagDetailDTO => ({
  organisation_id: '',
  user_id: '',
  fasttag_bank_id: '',
  api_client_id: '',
  api_key: '',
  api_secret: '',
  description: '',
  status: Status.Active
});

// API Methods
export const findFasttagDetails = async (data: FasttagDetailQueryDTO): Promise<FBR<FASTagDetails[]>> => {
  return apiPost<FBR<FASTagDetails[]>, FasttagDetailQueryDTO>(ENDPOINTS.find, data);
};

export const createFasttagDetailMark = async (data: FasttagDetailDTO): Promise<SBR> => {
  return apiPost<SBR, FasttagDetailDTO>(ENDPOINTS.create, data);
};

export const updateFasttagDetail = async (
  id: string,
  data: FasttagDetailDTO
): Promise<SBR> => {
  return apiPatch<SBR, FasttagDetailDTO>(ENDPOINTS.update(id), data);
};

export const deleteFasttagDetail = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
