// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  single_select_mandatory,
  single_select_optional,
  multi_select_optional,
  stringMandatory,
  stringOptional,
  dynamicJsonSchema,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { FleetInspection } from './fleet_inspection_management_service';

const URL = 'fleet/inspection_management/inspection_form';

const ENDPOINTS = {
  // FleetInspectionForm APIs
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  update_form_data: (id: string): string => `${URL}/update_form_data/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // FleetInspectionForm Cache
  cache_simple: (organisation_id: string): string => `${URL}/cache_simple/${organisation_id}`,
};

// FleetInspectionForm Interface
export interface FleetInspectionForm extends Record<string, unknown> {
  // Primary Field
  inspection_form_id: string;

  // Main Field Details
  inspection_form_name: string;
  inspection_form_notes?: string;
  inspection_form_data: Record<string, unknown>;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;
  organisation_logo_url?: string;

  user_id?: string;
  User?: User;
  user_details?: string;
  user_image_url?: string;

  // Relations - Child
  // Child - Fleet
  FleetInspection?: FleetInspection[];

  // Relations - Child Count
  _count?: {
    FleetInspection?: number;
  };
}

// FleetInspectionFormSimple Interface
export interface FleetInspectionFormSimple extends Record<string, unknown> {
  inspection_form_id: string;
  inspection_form_name: string;

  // Relations - Child Count
  _count?: {};
}

// FleetInspectionForm Schema
export const FleetInspectionFormSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User

  // Main Field Details
  inspection_form_name: stringMandatory('Inspection Form Name', 3, 100),
  inspection_form_notes: stringOptional('Inspection Form Notes', 0, 500),
  inspection_form_data: dynamicJsonSchema('Inspection Form Data', {}),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetInspectionFormDTO = z.infer<typeof FleetInspectionFormSchema>;

// FleetInspectionForm Query Schema
export const FleetInspectionFormQuerySchema = BaseQuerySchema.extend({
  // Self Table
  inspection_form_ids: multi_select_optional('FleetInspectionForm'), // Multi-Selection -> FleetInspectionForm

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
});
export type FleetInspectionFormQueryDTO = z.infer<typeof FleetInspectionFormQuerySchema>;

// FleetInspectionForm Update Fields Schema
export const FleetInspectionFormFieldsSchema = z.object({
  inspection_form_data: dynamicJsonSchema('Inspection Form Data', {}),
});
export type FleetInspectionFormFieldsDTO = z.infer<typeof FleetInspectionFormFieldsSchema>;

// Convert FleetInspectionForm Data to API Payload
export const toFleetInspectionFormPayload = (row: FleetInspectionForm): FleetInspectionFormDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',

  inspection_form_name: row.inspection_form_name || '',
  inspection_form_notes: row.inspection_form_notes || '',
  inspection_form_data: row.inspection_form_data || {},

  status: row.status || Status.Active,
});

// Create New FleetInspectionForm Payload
export const newFleetInspectionFormPayload = (): FleetInspectionFormDTO => ({
  organisation_id: '',
  user_id: '',

  inspection_form_name: '',
  inspection_form_notes: '',
  inspection_form_data: {},

  status: Status.Active,
});

// FleetInspectionForm APIs
export const findFleetInspectionForm = async (data: FleetInspectionFormQueryDTO): Promise<FBR<FleetInspectionForm[]>> => {
  return apiPost<FBR<FleetInspectionForm[]>, FleetInspectionFormQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetInspectionForm = async (data: FleetInspectionFormDTO): Promise<SBR> => {
  return apiPost<SBR, FleetInspectionFormDTO>(ENDPOINTS.create, data);
};

export const updateFleetInspectionForm = async (id: string, data: FleetInspectionFormDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetInspectionFormDTO>(ENDPOINTS.update(id), data);
};

export const updateFleetInspectionFormData = async (id: string, data: FleetInspectionFormFieldsDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetInspectionFormFieldsDTO>(ENDPOINTS.update_form_data(id), data);
};

export const deleteFleetInspectionForm = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// FleetInspectionForm Cache
export const find_inspection_form_cache_simple = async (organisation_id: string): Promise<FBR<FleetInspectionFormSimple[]>> => {
  return apiGet<FBR<FleetInspectionFormSimple[]>>(ENDPOINTS.cache_simple(organisation_id));
};