// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringMandatory,
    stringOptional,
    single_select_mandatory,
    single_select_optional,
    multi_select_optional,
    enumMandatory,
    dateMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';

// --------------------------------------------------------------
// URL & ENDPOINTS
// --------------------------------------------------------------
const URL = 'notice_board';

const ENDPOINTS = {
    create: URL,
    find: `${URL}/search`,
    update: (id: string): string => `${URL}/${id}`,
    remove: (id: string): string => `${URL}/${id}`,
};

// --------------------------------------------------------------
// Interfaces
// --------------------------------------------------------------

// ✅ OrganisationNoticeBoard Interface
export interface OrganisationNoticeBoard extends Record<string, unknown> {
    // Primary Fields
    notice_id: string;

    // Basic Info
    notice_date_time: string;
    notice_date_time_f: string;
    notice_subject: string;
    notice_description?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    organisation_branch_id?: string;
    OrganisationBranch?: OrganisationBranch;

    // Counts (if used in future relations)
    _count?: Record<string, number>;
}

// --------------------------------------------------------------
// Zod Schemas
// --------------------------------------------------------------

// ✅ OrganisationNoticeBoard Create/Update Schema
export const OrganisationNoticeBoardSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  organisation_branch_id: single_select_optional('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch

  notice_date_time: dateMandatory('Notice Date Time'),

  notice_subject: stringMandatory('Notice Subject', 3, 100),
  notice_description: stringOptional('Notice Description', 0, 500),

  // Other
  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type OrganisationNoticeBoardDTO = z.infer<
  typeof OrganisationNoticeBoardSchema
>;

// ✅ OrganisationNoticeBoard Query Schema
export const OrganisationNoticeBoardQuerySchema = BaseQuerySchema.extend({
  notice_ids: multi_select_optional('OrganisationNoticeBoard'), // ✅ Multi-selection -> OrganisationNoticeBoard

  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-selection -> OrganisationBranch
});
export type OrganisationNoticeBoardQueryDTO = z.infer<
  typeof OrganisationNoticeBoardQuerySchema
>;


// --------------------------------------------------------------
// Payload Helpers
// --------------------------------------------------------------

// Convert existing data to DTO
export const toOrganisationNoticeBoardPayload = (row: OrganisationNoticeBoard): OrganisationNoticeBoardDTO => ({
    organisation_id: row.organisation_id || '',
    organisation_branch_id: row.organisation_branch_id || '',

    notice_date_time: row.notice_date_time || '',
    notice_subject: row.notice_subject || '',
    notice_description: row.notice_description || '',

    status: row.status,
    time_zone_id: '', // Needs to be provided manually
});

// New payload with default values
export const newOrganisationNoticeBoardPayload = (): OrganisationNoticeBoardDTO => ({
    organisation_id: '',
    organisation_branch_id: '',

    notice_date_time: '',
    notice_subject: '',
    notice_description: '',

    status: Status.Active,
    time_zone_id: '', // Needs to be provided manually
});

// --------------------------------------------------------------
// API Methods
// --------------------------------------------------------------
export const findOrganisationNoticeBoard = async (data: OrganisationNoticeBoardQueryDTO): Promise<FBR<OrganisationNoticeBoard[]>> => {
    return apiPost<FBR<OrganisationNoticeBoard[]>, OrganisationNoticeBoardQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationNoticeBoard = async (data: OrganisationNoticeBoardDTO): Promise<SBR> => {
    return apiPost<SBR, OrganisationNoticeBoardDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationNoticeBoard = async (id: string, data: OrganisationNoticeBoardDTO): Promise<SBR> => {
    return apiPatch<SBR, OrganisationNoticeBoardDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationNoticeBoard = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove(id));
};
