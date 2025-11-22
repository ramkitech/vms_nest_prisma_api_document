// Imports
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BaseCommonFile, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringMandatory,
    stringOptional,
    enumMandatory,
    single_select_mandatory,
    multi_select_optional,
    enumArrayOptional,
    numberOptional,
    nestedArrayOfObjectsOptional,
    dateMandatory,
    single_select_optional,
    dateOptional,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { FileType, IssueSeverity, IssueSource, IssueStatus, Priority, Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';

import { FleetIncidentManagement } from '../incident_management/incident_management_service';
import { FleetServiceManagement } from '../service_management/fleet_service_management_service';

const URL = 'fleet/issue_management/issues';

const ENDPOINTS = {

    // AWS S3 PRESIGNED
    issue_file_presigned_url: `${URL}/issue_file_presigned_url`,

    // File
    create_issue_file: `${URL}/create_issue_file`,
    remove_issue_file: (id: string): string => `${URL}/remove_issue_file/${id}`,

    find: `${URL}/search`,
    create: `${URL}`,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    create_comment: `${URL}/create_comment`,
    find_comment: `${URL}/comment/search`,
    update_comment: (id: string): string => `${URL}/update_comment/${id}`,
    delete_comment: (id: string): string => `${URL}/delete_comment/${id}`,
};

// ✅ FleetIssueManagement Interface
export interface FleetIssueManagement extends Record<string, unknown> {
    // ✅ Primary Fields
    vehicle_issue_id: string;
    vehicle_sub_issue_id: number;

    issue_code?: string;

    // Issue Details
    issue_title: string;
    issue_description?: string;
    issue_status: IssueStatus;
    issue_priority: Priority;
    issue_severity: IssueSeverity;
    report_date: string;
    report_date_f: string;
    resolved_date?: string;
    resolved_date_f?: string;
    odometer_reading?: number;
    due_date?: string;
    due_date_f?: string;
    due_odometer_reading?: number;
    issue_source: IssueSource;

    // ✅ Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // ✅ Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    user_id: string;
    User?: User;

    vehicle_id: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;

    driver_id?: string;
    MasterDriver?: MasterDriver;
    driver_details?: string;

    vehicle_incident_id?: string;
    FleetIncidentManagement?: FleetIncidentManagement;

    inspection_id?: string;
    // FleetInspection?: FleetInspection;

    service_management_id?: string;
    FleetServiceManagement?: FleetServiceManagement;

    job_card_id?: string;
    // FleetServiceJobCard?: FleetServiceJobCard;

    // Count Child
    FleetIssueManagementFile: FleetIssueManagementFile[];
    FleetIssueManagementComment?: FleetIssueManagementComment[];
    FleetIssueManagementHistory?: FleetIssueManagementHistory[];

    // ✅ Count (Child Relations)
    _count?: {
        FleetIssueManagementComment: number;
        FleetIssueManagementFile: number;
        FleetIssueManagementHistory: number;
    };
}

// FleetIssueManagementHistory
export interface FleetIssueManagementHistory extends Record<string, unknown> {
    vehicle_issue_history_id: string;
    old_issue_status: IssueStatus;
    new_issue_status: IssueStatus;
    change_reason?: string;
    change_notes?: string;
    change_date: string;
    change_date_f: string;

    // ✅ Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // ✅ Relations
    vehicle_issue_id: string;
    FleetIssueManagement?: FleetIssueManagement;

    // ✅ Count (Child Relations)
    _count?: {
    };
}

// FleetIssueManagementComment
export interface FleetIssueManagementComment extends Record<string, unknown> {
    vehicle_issue_comment_id: string;

    comment_text: string;
    comment_description?: string;

    // ✅ Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // ✅ Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    vehicle_issue_id: string;
    FleetIssueManagement?: FleetIssueManagement;

    // ✅ Count (Child Relations)
    _count?: {
    };
}

// ✅ FleetIssueManagementFile Interface
export interface FleetIssueManagementFile extends BaseCommonFile {
    // Primary Fields
    fleet_issue_management_file_id: string;

    // ✅ Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    vehicle_issue_id: string;
    FleetIssueManagement?: FleetIssueManagement;
}

// ✅ FleetIssueManagementFile Schema
export const FleetIssueManagementFileSchema = BaseFileSchema.extend({
    organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vehicle_issue_id: single_select_optional('FleetIssueManagement'), // ✅ Single-Selection -> FleetIssueManagement
});
export type FleetIssueManagementFileDTO = z.infer<
    typeof FleetIssueManagementFileSchema
>;

// ✅ FleetIssueManagement Create/Update Schema
export const FleetIssueManagementSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    user_id: single_select_mandatory('User'), // ✅ Single-Selection -> User
    vehicle_id: single_select_mandatory('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
    driver_id: single_select_optional('MasterDriver'), // ✅ Single-Selection -> MasterDriver
    vehicle_incident_id: single_select_optional('FleetIncidentManagement'), // ✅ Single-Selection -> FleetIncidentManagement
    inspection_id: single_select_optional('FleetInspection'), // ✅ Single-Selection -> FleetInspection
    service_management_id: single_select_optional('FleetServiceManagement'), // ✅ Single-Selection -> FleetServiceManagement

    // Issue Details
    issue_title: stringMandatory('Issue Title', 1, 100),
    issue_description: stringOptional('Issue Description', 0, 2000),
    issue_status: enumMandatory('Issue Status', IssueStatus, IssueStatus.Open),
    issue_priority: enumMandatory(
        'Issue Priority',
        Priority,
        Priority.NoPriority,
    ),
    issue_severity: enumMandatory(
        'Issue Severity',
        IssueSeverity,
        IssueSeverity.Minor,
    ),

    report_date: dateMandatory('Report Date'),
    resolved_date: dateOptional('Resolved Date'),
    odometer_reading: numberOptional('Odometer Reading'),
    due_date: dateOptional('Due Date'),
    due_odometer_reading: numberOptional('Due Odometer Reading'),
    issue_source: enumMandatory('Issue Source', IssueSource, IssueSource.Direct),

    // Other
    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),

    FleetIssueManagementFileSchema: nestedArrayOfObjectsOptional(
        'FleetIssueManagementFileSchema',
        FleetIssueManagementFileSchema,
        [],
    ),
});
export type FleetIssueManagementDTO = z.infer<
    typeof FleetIssueManagementSchema
>;

// ✅ FleetIssueManagement Query Schema
export const FleetIssueManagementQuerySchema = BaseQuerySchema.extend({
    vehicle_issue_ids: multi_select_optional('FleetIssueManagement'), // ✅ Multi-Selection -> FleetIssueManagement

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    user_ids: multi_select_optional('User'), // ✅ Multi-Selection -> User
    vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-Selection -> MasterVehicle
    driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-Selection -> MasterDriver

    vehicle_incident_ids: multi_select_optional('FleetIncidentManagement'), // ✅ Multi-Selection -> FleetIncidentManagement
    inspection_ids: multi_select_optional('FleetInspection'), // ✅ Multi-Selection -> FleetInspection
    service_management_ids: multi_select_optional('FleetServiceManagement'), // ✅ Multi-Selection -> FleetServiceManagement

    issue_status: enumArrayOptional('Issue Status', IssueStatus),
    issue_priority: enumArrayOptional('Issue Priority', Priority),
    issue_severity: enumArrayOptional('Issue Severity', IssueSeverity),
    issue_source: enumArrayOptional('Issue Source', IssueSource),

    from_date: dateMandatory('From Date'),
    to_date: dateMandatory('To Date'),
});
export type FleetIssueManagementQueryDTO = z.infer<
    typeof FleetIssueManagementQuerySchema
>;

// ✅ FleetIssueManagementComment Create/Update Schema
export const FleetIssueManagementCommentSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vehicle_issue_id: single_select_mandatory('FleetIssueManagement'), // ✅ Single-Selection -> FleetIssueManagement

    comment_text: stringMandatory('Comment Text', 3, 100),
    comment_description: stringMandatory('Comment Description', 0, 500),
    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetIssueManagementCommentDTO = z.infer<
    typeof FleetIssueManagementCommentSchema
>;

// ✅ FleetIssueManagementComment Query Schema
export const FleetIssueManagementCommentQuerySchema = BaseQuerySchema.extend({
    vehicle_issue_comment_ids: multi_select_optional(
        'FleetIssueManagementComment',
    ), // ✅ Multi-Selection -> FleetIssueManagementComment

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    vehicle_issue_ids: multi_select_optional('FleetIssueManagement'), // ✅ Multi-Selection -> FleetIssueManagement
});
export type FleetIssueManagementCommentQueryDTO = z.infer<
    typeof FleetIssueManagementCommentQuerySchema
>;



// ✅ Convert FleetIssueManagement Data to API Payload
export const toFleetIssueManagementPayload = (row: FleetIssueManagement): FleetIssueManagementDTO => ({
    // Issue Details
    issue_title: row.issue_title || '',
    issue_description: row.issue_description || '',
    issue_status: row.issue_status || IssueStatus.Open,
    issue_priority: row.issue_priority || Priority.NoPriority,
    issue_severity: row.issue_severity || IssueSeverity.Minor,
    report_date: row.report_date || '',
    resolved_date: row.resolved_date || '',
    odometer_reading: row.odometer_reading || 0,
    due_date: row.due_date || '',
    due_odometer_reading: row.due_odometer_reading || 0,
    issue_source: row.issue_source || IssueSource.Direct,

    // Relations
    organisation_id: row.organisation_id || '',
    user_id: row.user_id || '',
    vehicle_id: row.vehicle_id || '',
    driver_id: row.driver_id || '',
    vehicle_incident_id: row.vehicle_incident_id || '',
    inspection_id: row.inspection_id || '',
    service_management_id: row.service_management_id || '',

    status: Status.Active,
    time_zone_id: '', // Needs to be provided manually

    FleetIssueManagementFileSchema: row.FleetIssueManagementFile?.map((file) => ({
        fleet_issue_management_file_id: file.fleet_issue_management_file_id ?? '',

        usage_type: (file.usage_type || '').trim(),
        file_type: file.file_type || FileType.Image,
        file_url: (file.file_url || '').trim(),
        file_key: (file.file_key || '').trim(),
        file_name: (file.file_name || '').trim(),
        file_description: (file.file_description || '').trim(),
        file_size: file.file_size || 0,
        file_metadata: file.file_metadata || {},

        status: file.status,
        added_date_time: file.added_date_time,
        modified_date_time: file.modified_date_time,

        organisation_id: file.organisation_id ?? '',

        vehicle_issue_id: file.vehicle_issue_id ?? '',
    })) ?? [],
});

// ✅ Create New FleetIssueManagement Payload
export const newFleetIssueManagementPayload = (): FleetIssueManagementDTO => ({
    issue_title: '',
    issue_description: '',
    issue_status: IssueStatus.Open,
    issue_priority: Priority.NoPriority,
    issue_severity: IssueSeverity.Minor,
    report_date: '',
    resolved_date: '',
    odometer_reading: 0,
    due_date: '',
    due_odometer_reading: 0,
    issue_source: IssueSource.Direct,

    organisation_id: '',
    user_id: '',
    vehicle_id: '',
    driver_id: '',
    vehicle_incident_id: '',
    inspection_id: '',
    service_management_id: '',

    status: Status.Active,
    time_zone_id: '', // Needs to be provided manually

    FleetIssueManagementFileSchema: [],
});

// ✅ Convert FleetIssueManagementComment Data to API Payload
export const toFleetIssueManagementCommentPayload = (row: FleetIssueManagementComment): FleetIssueManagementCommentDTO => ({
    comment_text: row.comment_text || '',
    comment_description: row.comment_description || '',

    organisation_id: row.organisation_id || '',
    vehicle_issue_id: row.vehicle_issue_id || '',

    status: Status.Active,
});

// ✅ Create New FleetIssueManagementComment Payload
export const newFleetIssueManagementCommentPayload = (): FleetIssueManagementCommentDTO => ({
    comment_text: '',
    comment_description: '',

    organisation_id: '',
    vehicle_issue_id: '',

    status: Status.Active,
});

// Generate presigned URL for file uploads
export const get_issue_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
    return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.issue_file_presigned_url, data);
};

// File API Methods
export const create_issue_file = async (data: FleetIssueManagementFileDTO): Promise<SBR> => {
    return apiPost<SBR, FleetIssueManagementFileDTO>(ENDPOINTS.create_issue_file, data);
};

export const remove_issue_file = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_issue_file(id));
};

// API Methods
export const findFleetIssueManagement = async (data: FleetIssueManagementQueryDTO): Promise<FBR<FleetIssueManagement[]>> => {
    return apiPost<FBR<FleetIssueManagement[]>, FleetIssueManagementQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetIssueManagement = async (data: FleetIssueManagementDTO): Promise<SBR> => {
    return apiPost<SBR, FleetIssueManagementDTO>(ENDPOINTS.create, data);
};

export const updateFleetIssueManagement = async (id: string, data: FleetIssueManagementDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetIssueManagementDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetIssueManagement = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// FleetIssueManagementComment
export const findFleetIssueManagementComment = async (data: FleetIssueManagementCommentQueryDTO): Promise<FBR<FleetIssueManagementComment[]>> => {
    return apiPost<FBR<FleetIssueManagementComment[]>, FleetIssueManagementCommentQueryDTO>(ENDPOINTS.find_comment, data);
};

export const createFleetIssueManagementComment = async (data: FleetIssueManagementCommentDTO): Promise<SBR> => {
    return apiPost<SBR, FleetIssueManagementCommentDTO>(ENDPOINTS.create_comment, data);
};

export const updateFleetIssueManagementComment = async (id: string, data: FleetIssueManagementCommentDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetIssueManagementCommentDTO>(ENDPOINTS.update_comment(id), data);
};

export const deleteFleetIssueManagementComment = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete_comment(id));
};