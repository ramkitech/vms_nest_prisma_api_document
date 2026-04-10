// Imports
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BaseCommonFile, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  enumArrayOptional,
  single_select_mandatory,
  single_select_optional,
  multi_select_optional,
  stringMandatory,
  stringOptional,
  numberOptional,
  dateMandatory,
  dateOptional,
  nestedArrayOfObjectsOptional,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { FileType, IssueStatus, IssueSeverity, IssueSource, Priority, Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { FleetIncident } from '../incident_management/incident_management_service';
import { FleetInspection } from '../inspection_management/fleet_inspection_management_service';
import { FleetService } from '../service_management/fleet_service_service';
import { FleetBreakdown } from '../breakdown_management/breakdown_management_service';


const URL = 'fleet/issue_management/fleet_issue';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  issue_file_presigned_url: `${URL}/issue_file_presigned_url`,

  // File Uploads
  create_issue_file: `${URL}/create_issue_file`,
  remove_issue_file: (id: string): string => `${URL}/remove_issue_file/${id}`,

  // FleetIssue APIs
  find: `${URL}/fleet_issue/search`,
  create: `${URL}/fleet_issue`,
  update: (id: string): string => `${URL}/fleet_issue/${id}`,
  delete: (id: string): string => `${URL}/fleet_issue/${id}`,

  fleet_issue_dashboard: `${URL}/fleet_issue_dashboard`,

  // FleetIssueComment APIs
  find_comment: `${URL}/fleet_issue_comment/search`,
  create_comment: `${URL}/fleet_issue_comment`,
  update_comment: (id: string): string => `${URL}/fleet_issue_comment/${id}`,
  delete_comment: (id: string): string => `${URL}/fleet_issue_comment/${id}`,
};

// FleetIssue Interface
export interface FleetIssue extends Record<string, unknown> {
  // Primary Field
  issue_id: string;
  issue_sub_id: number;
  issue_code?: string;

  // Issue Details
  issue_title: string;
  issue_description?: string;
  issue_status: IssueStatus;
  issue_priority: Priority;
  issue_severity: IssueSeverity;
  odometer_reading?: number;
  report_date: string;
  report_date_f?: string;
  resolved_date?: string;
  resolved_date_f?: string;
  due_date?: string;
  due_date_f?: string;
  due_odometer_reading?: number;
  issue_source: IssueSource;

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

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  driver_id?: string;
  MasterDriver?: MasterDriver;
  driver_details?: string;
  driver_image_url?: string;

  incident_id?: string;
  FleetIncident?: FleetIncident;

  inspection_id?: string;
  FleetInspection?: FleetInspection;

  service_id?: string;
  FleetService?: FleetService;

  breakdown_id?: string;
  FleetBreakdown?: FleetBreakdown;

  // Relations - Child
  // Child - Fleet
  FleetIssueComment?: FleetIssueComment[];
  FleetIssueFile?: FleetIssueFile[];
  FleetIssueHistory?: FleetIssueHistory[];

  // Relations - Child Count
  _count?: {
    FleetIssueComment?: number;
    FleetIssueFile?: number;
    FleetIssueHistory?: number;
  };
}

// FleetIssueFile Interface
export interface FleetIssueFile extends BaseCommonFile {
  // Primary Field
  issue_file_id: string;

  // Usage Type -> Issue Images, Issue Videos, Issue Documents

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

  issue_id: string;
  FleetIssue?: FleetIssue;

  // Relations - Child Count
  _count?: {};
}

// FleetIssueHistory Interface
export interface FleetIssueHistory extends Record<string, unknown> {
  // Primary Field
  issue_history_id: string;

  // Main Field Details
  old_issue_status: IssueStatus;
  new_issue_status: IssueStatus;
  change_date: string;
  change_date_f?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  issue_id: string;
  FleetIssue?: FleetIssue;

  // Relations - Child Count
  _count?: {};
}

// FleetIssueComment Interface
export interface FleetIssueComment extends Record<string, unknown> {
  // Primary Field
  issue_comment_id: string;

  // Main Field Details
  comment_text: string;
  comment_description?: string;

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

  issue_id: string;
  FleetIssue?: FleetIssue;

  // Relations - Child Count
  _count?: {};
}

// IssueDashboard Interface
export interface IssueDashboard extends Record<string, unknown> {
  date: string;
  total_count: number;
  open: number;
  closed: number;
  resolved: number;
  overdue: number;
  reopen: number;

  // Relations - Child Count
  _count?: {};
}

// FleetIssueFile Schema
export const FleetIssueFileSchema = BaseFileSchema.extend({
  // Relations - Parent
  organisation_id: single_select_optional('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  issue_id: single_select_optional('FleetIssue'), // Single-Selection -> FleetIssue
});
export type FleetIssueFileDTO = z.infer<typeof FleetIssueFileSchema>;

// FleetIssue Create/Update Schema
export const FleetIssueSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  vehicle_id: single_select_mandatory('MasterVehicle'), // Single-Selection -> MasterVehicle
  driver_id: single_select_optional('MasterDriver'), // Single-Selection -> MasterDriver

  incident_id: single_select_optional('FleetIncident'), // Single-Selection -> FleetIncident
  breakdown_id: single_select_optional('FleetBreakdown'), // Single-Selection -> FleetBreakdown
  inspection_id: single_select_optional('FleetInspection'), // Single-Selection -> FleetInspection
  service_id: single_select_optional('FleetService'), // Single-Selection -> FleetService

  // Issue Details
  issue_title: stringMandatory('Issue Title', 1, 100),
  issue_description: stringOptional('Issue Description', 0, 2000),
  issue_status: enumMandatory('Issue Status', IssueStatus, IssueStatus.Open),
  issue_priority: enumMandatory('Issue Priority', Priority, Priority.NoPriority),
  issue_severity: enumMandatory('Issue Severity', IssueSeverity, IssueSeverity.Minor),

  report_date: dateMandatory('Report Date'),
  resolved_date: dateOptional('Resolved Date'),
  odometer_reading: numberOptional('Odometer Reading'),
  due_date: dateOptional('Due Date'),
  due_odometer_reading: numberOptional('Due Odometer Reading'),
  issue_source: enumMandatory('Issue Source', IssueSource, IssueSource.Direct),

  // Files
  FleetIssueFileSchema: nestedArrayOfObjectsOptional('FleetIssueFileSchema', FleetIssueFileSchema, []),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),

  // Other
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FleetIssueDTO = z.infer<typeof FleetIssueSchema>;

// FleetIssue Query Schema
export const FleetIssueQuerySchema = BaseQuerySchema.extend({
  // Self Table
  issue_ids: multi_select_optional('FleetIssue'), // Multi-Selection -> FleetIssue

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // Multi-Selection -> MasterDriver

  incident_ids: multi_select_optional('FleetIncident'), // Multi-Selection -> FleetIncident
  breakdown_ids: multi_select_optional('FleetBreakdown'), // Multi-Selection -> FleetBreakdown
  inspection_ids: multi_select_optional('FleetInspection'), // Multi-Selection -> FleetInspection
  service_ids: multi_select_optional('FleetService'), // Multi-Selection -> FleetService

  // Enums
  issue_status: enumArrayOptional('Issue Status', IssueStatus),
  issue_priority: enumArrayOptional('Issue Priority', Priority),
  issue_severity: enumArrayOptional('Issue Severity', IssueSeverity),
  issue_source: enumArrayOptional('Issue Source', IssueSource),

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetIssueQueryDTO = z.infer<typeof FleetIssueQuerySchema>;

// FleetIssueDashBoard Query Schema
export const FleetIssueDashBoardQuerySchema = BaseQuerySchema.extend({
  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetIssueDashBoardQueryDTO = z.infer<typeof FleetIssueDashBoardQuerySchema>;

// FleetIssueComment Create/Update Schema
export const FleetIssueCommentSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  issue_id: single_select_mandatory('FleetIssue'), // Single-Selection -> FleetIssue

  // Main Field Details
  comment_text: stringMandatory('Comment Text', 3, 100),
  comment_description: stringOptional('Comment Description', 0, 500),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetIssueCommentDTO = z.infer<typeof FleetIssueCommentSchema>;

// FleetIssueComment Query Schema
export const FleetIssueCommentQuerySchema = BaseQuerySchema.extend({
  // Self Table
  issue_comment_ids: multi_select_optional('FleetIssueComment'), // Multi-Selection -> FleetIssueComment

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
  issue_ids: multi_select_optional('FleetIssue'), // Multi-Selection -> FleetIssue
});
export type FleetIssueCommentQueryDTO = z.infer<typeof FleetIssueCommentQuerySchema>;

// Convert FleetIssue Data to API Payload
export const toFleetIssuePayload = (row: FleetIssue): FleetIssueDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',
  vehicle_id: row.vehicle_id || '',
  driver_id: row.driver_id || '',

  incident_id: row.incident_id || '',
  breakdown_id: row.breakdown_id || '',
  inspection_id: row.inspection_id || '',
  service_id: row.service_id || '',

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

  FleetIssueFileSchema: row.FleetIssueFile?.map((file) => ({
    issue_file_id: file.issue_file_id || '',

    // Usage Type -> Issue Images, Issue Videos, Issue Documents
    usage_type: file.usage_type || '',

    file_type: file.file_type || FileType.Image,

    file_url: file.file_url || '',
    file_key: file.file_key || '',
    file_name: file.file_name || '',
    file_description: file.file_description || '',
    file_size: file.file_size || 0,
    file_metadata: file.file_metadata || {},

    status: file.status || Status.Active,
    added_date_time: file.added_date_time,
    modified_date_time: file.modified_date_time,

    organisation_id: file.organisation_id || '',
    user_id: file.user_id || '',
    issue_id: file.issue_id || '',
  })) || [],

  status: row.status || Status.Active,
  time_zone_id: '',
});

// Create New FleetIssue Payload
export const newFleetIssuePayload = (): FleetIssueDTO => ({
  organisation_id: '',
  user_id: '',
  vehicle_id: '',
  driver_id: '',

  incident_id: '',
  breakdown_id: '',
  inspection_id: '',
  service_id: '',

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

  FleetIssueFileSchema: [],

  status: Status.Active,
  time_zone_id: '',
});

// Convert FleetIssueComment Data to API Payload
export const toFleetIssueCommentPayload = (row: FleetIssueComment): FleetIssueCommentDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',
  issue_id: row.issue_id || '',

  comment_text: row.comment_text || '',
  comment_description: row.comment_description || '',

  status: row.status || Status.Active,
});

// Create New FleetIssueComment Payload
export const newFleetIssueCommentPayload = (): FleetIssueCommentDTO => ({
  organisation_id: '',
  user_id: '',
  issue_id: '',

  comment_text: '',
  comment_description: '',

  status: Status.Active,
});

// AWS S3 PRESIGNED
export const get_issue_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.issue_file_presigned_url, data);
};

// File Uploads
export const create_issue_file = async (data: FleetIssueFileDTO): Promise<SBR> => {
  return apiPost<SBR, FleetIssueFileDTO>(ENDPOINTS.create_issue_file, data);
};

export const remove_issue_file = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_issue_file(id));
};

// FleetIssue APIs
export const findFleetIssue = async (data: FleetIssueQueryDTO): Promise<FBR<FleetIssue[]>> => {
  return apiPost<FBR<FleetIssue[]>, FleetIssueQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetIssue = async (data: FleetIssueDTO): Promise<SBR> => {
  return apiPost<SBR, FleetIssueDTO>(ENDPOINTS.create, data);
};

export const updateFleetIssue = async (id: string, data: FleetIssueDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetIssueDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetIssue = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const fleet_issue_dashboard = async (data: FleetIssueDashBoardQueryDTO): Promise<FBR<IssueDashboard[]>> => {
  return apiPost<FBR<IssueDashboard[]>, FleetIssueDashBoardQueryDTO>(ENDPOINTS.fleet_issue_dashboard, data);
};

// FleetIssueComment APIs
export const findFleetIssueComment = async (data: FleetIssueCommentQueryDTO): Promise<FBR<FleetIssueComment[]>> => {
  return apiPost<FBR<FleetIssueComment[]>, FleetIssueCommentQueryDTO>(ENDPOINTS.find_comment, data);
};

export const createFleetIssueComment = async (data: FleetIssueCommentDTO): Promise<SBR> => {
  return apiPost<SBR, FleetIssueCommentDTO>(ENDPOINTS.create_comment, data);
};

export const updateFleetIssueComment = async (id: string, data: FleetIssueCommentDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetIssueCommentDTO>(ENDPOINTS.update_comment(id), data);
};

export const deleteFleetIssueComment = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_comment(id));
};