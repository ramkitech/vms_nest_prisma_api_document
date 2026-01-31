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
    // Primary Fields
    first_name: string;
    last_name?: string;
    mobile?: string;
    country_code?: string;
    email?: string;
    message?: string;

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
    first_name: stringMandatory('First Name', 3, 100),
    last_name: stringOptional('Last Name', 0, 100),
    mobile: stringOptional('Mobile', 0, 20),
    country_code: stringOptional('Country Code', 0, 20),
    email: stringOptional('Email', 0, 100),
    message: stringOptional('Message', 0, 500),

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
    first_name: stringMandatory('First Name', 3, 100),
    last_name: stringOptional('Last Name', 0, 100),
    mobile: stringOptional('Mobile', 0, 20),
    country_code: stringOptional('Country Code', 0, 20),
    email: stringOptional('Email', 0, 100),
    message: stringOptional('Message', 0, 500),
});
export type RequestDemoCreateDTO = z.infer<typeof RequestDemoCreateSchema>;

// Convert existing data to a payload structure
export const toFaqPayload = (request_demo: RequestDemo): RequestDemoDTO => ({
    first_name: request_demo.first_name || '',
    last_name: request_demo.last_name || '',
    mobile: request_demo.mobile || '',
    country_code: request_demo.country_code || '',
    email: request_demo.email || '',
    message: request_demo.message || '',

    // Admin Details
    admin_message: request_demo.admin_message || '',
    admin_view: request_demo.admin_view || YesNo.No,

    // Metadata
    status: request_demo.status,
});

// Generate a new payload with default values
export const newFaqPayload = (): RequestDemoDTO => ({
    first_name: '',
    last_name: '',
    mobile: '',
    country_code: '',
    email: '',
    message: '',

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
