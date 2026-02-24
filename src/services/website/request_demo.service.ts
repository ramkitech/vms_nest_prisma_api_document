// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringOptional,
    enumMandatory,
    multi_select_optional,
    stringMandatory,
    enumArrayOptional,
    getAllEnums,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../core/Enums';

const URL = 'website/request_demo';

const ENDPOINTS = {
    // RequestDemo APIs
    find: `${URL}/search`,
    create: URL,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    create_request: `${URL}/create_request`,
};

// RequestDemo Interface
export interface RequestDemo extends Record<string, unknown> {
    // Primary Field
    request_demo_id: string;

    // main Field Details
    name: string;
    mobile?: string;
    email?: string;
    message?: string;
    city?: string;

    // Admin Details
    admin_message?: string;
    admin_view: YesNo;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;
}

// RequestDemo Create/Update Schema
export const RequestDemoSchema = z.object({
  // Main Field Details
  name: stringMandatory('Name', 3, 100),
  mobile: stringOptional('Mobile', 0, 20),
  email: stringOptional('Email', 0, 100),
  message: stringOptional('Message', 0, 500),
  city: stringOptional('City', 0, 100),

  // Admin Details
  admin_message: stringOptional('Admin Message', 0, 1000),
  admin_view: enumMandatory('Admin View', YesNo, YesNo.No),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type RequestDemoDTO = z.infer<typeof RequestDemoSchema>;

// RequestDemo Query Schema
export const RequestDemoQuerySchema = BaseQuerySchema.extend({
  // Self Table
  request_demo_ids: multi_select_optional('RequestDemo'), // Multi-selection -> RequestDemo

  // Enums
  admin_view: enumArrayOptional('Admin View', YesNo, getAllEnums(YesNo)),
});
export type RequestDemoQueryDTO = z.infer<typeof RequestDemoQuerySchema>;

// RequestDemo Create Schema
export const RequestDemoCreateSchema = z.object({
  // Main Field Details
  name: stringMandatory('Name', 3, 100),
  mobile: stringOptional('Mobile', 0, 20),
  email: stringOptional('Email', 0, 100),
  message: stringOptional('Message', 0, 500),
  city: stringOptional('City', 0, 100),
});
export type RequestDemoCreateDTO = z.infer<typeof RequestDemoCreateSchema>;

// Convert existing data to a payload structure
export const todRequestDemoPayload = (row: RequestDemo): RequestDemoDTO => ({
    name: row.name || '',
    mobile: row.mobile || '',
    email: row.email || '',
    message: row.message || '',
    city: row.city || '',

    // Admin Details
    admin_message: row.admin_message || '',
    admin_view: row.admin_view || YesNo.No,

    // Metadata
    status: row.status,
});

// Generate a new payload with default values
export const newdRequestDemoPayload = (): RequestDemoDTO => ({
    name: '',
    mobile: '',
    email: '',
    message: '',
    city: '',

    // Admin Details
    admin_message: '',
    admin_view: YesNo.No,

    // Metadata
    status: Status.Active,
});

// API Methods
export const findRequestDemo = async (data: RequestDemoQueryDTO): Promise<FBR<RequestDemo[]>> => {
    return apiPost<FBR<RequestDemo[]>, RequestDemoQueryDTO>(ENDPOINTS.find, data);
};

export const createDemo = async (data: RequestDemoDTO): Promise<SBR> => {
    return apiPost<SBR, RequestDemoDTO>(ENDPOINTS.create, data);
};

export const updateRequestDemo = async (id: string, data: RequestDemoDTO): Promise<SBR> => {
    return apiPatch<SBR, RequestDemoDTO>(ENDPOINTS.update(id), data);
};

export const deleteRequestDemo = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const createRequestDemo = async (data: RequestDemoCreateDTO): Promise<FBR<RequestDemo[]>> => {
    return apiPost<FBR<RequestDemo[]>, RequestDemoCreateDTO>(ENDPOINTS.create_request, data);
};
