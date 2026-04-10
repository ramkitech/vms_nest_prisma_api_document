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
    single_select_mandatory,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../core/Enums';
import { UserOrganisation } from '../main/users/user_organisation_service';

const URL = 'website/exclusive_feature_access';

const ENDPOINTS = {
    // ExclusiveFeatureAccess APIs
    find: `${URL}/search`,
    create: URL,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,
};

// ExclusiveFeatureAccess Interface
export interface ExclusiveFeatureAccess extends Record<string, unknown> {
    // Primary Field
    exclusive_feature_access_id: string;

    // Main Field Details
    subject: string;
    message?: string;

    // Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;
    organisation_logo_url?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;
}

// ExclusiveFeatureAccess Create/Update Schema
export const ExclusiveFeatureAccessSchema = z.object({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

    // Main Field Details
    subject: stringMandatory('Subject', 3, 100),
    message: stringOptional('Message', 0, 500),

    // Metadata
    status: enumMandatory('Status', Status, Status.Active),
});
export type ExclusiveFeatureAccessDTO = z.infer<
    typeof ExclusiveFeatureAccessSchema
>;

// ExclusiveFeatureAccess Query Schema
export const ExclusiveFeatureAccessQuerySchema = BaseQuerySchema.extend({
    // Self Table
    exclusive_feature_access_ids: multi_select_optional('ExclusiveFeatureAccess'), // Multi-selection -> ExclusiveFeatureAccess

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
});
export type ExclusiveFeatureAccessQueryDTO = z.infer<
    typeof ExclusiveFeatureAccessQuerySchema
>;

// Convert existing data to a payload structure
export const toExclusiveFeatureAccessPayload = (row: ExclusiveFeatureAccess): ExclusiveFeatureAccessDTO => ({
    subject: row.subject || '',
    message: row.message || '',

    // Relations - Parent
    organisation_id: row.organisation_id || '',

    // Metadata
    status: row.status,
});

// Generate a new payload with default values
export const newExclusiveFeatureAccessPayload = (): ExclusiveFeatureAccessDTO => ({
    subject: '',
    message: '',

    // Relations - Parent
    organisation_id: '',

    // Metadata
    status: Status.Active,
});

// API Methods
export const findExclusiveFeatureAccess = async (data: ExclusiveFeatureAccessQueryDTO): Promise<FBR<ExclusiveFeatureAccess[]>> => {
    return apiPost<FBR<ExclusiveFeatureAccess[]>, ExclusiveFeatureAccessQueryDTO>(ENDPOINTS.find, data);
};

export const createDemo = async (data: ExclusiveFeatureAccessDTO): Promise<SBR> => {
    return apiPost<SBR, ExclusiveFeatureAccessDTO>(ENDPOINTS.create, data);
};

export const updateExclusiveFeatureAccess = async (id: string, data: ExclusiveFeatureAccessDTO): Promise<SBR> => {
    return apiPatch<SBR, ExclusiveFeatureAccessDTO>(ENDPOINTS.update(id), data);
};

export const deleteExclusiveFeatureAccess = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};
