// Imports
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BaseCommonFile, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  enumArrayOptional,
  getAllEnums,
  single_select_mandatory,
  single_select_optional,
  multi_select_optional,
  stringOptional,
  numberOptional,
  dateMandatory,
  dynamicJsonSchema,
  doubleOptionalLatLng,
  nestedArrayOfObjectsOptional,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { FileType, InspectionPriority, InspectionStatus, InspectionType, Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterMainLandMark } from 'src/services/master/main/master_main_landmark_service';
import { FleetService } from 'src/services/fleet/service_management/fleet_service_service';
import { FleetIssue } from 'src/services/fleet/issue_management/issue_management_service';
import { FleetInspectionForm } from './fleet_inspection_form_service';

const URL = 'fleet/inspection_management/fleet_inspection';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  inspection_file_presigned_url: `${URL}/inspection_file_presigned_url`,

  // File Uploads
  create_inspection_file: `${URL}/create_inspection_file`,
  remove_inspection_file: (id: string): string => `${URL}/remove_inspection_file/${id}`,

  // FleetInspection APIs
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  inspection_dashboard: `${URL}/inspection_dashboard`,
};

// FleetInspection Interface
export interface FleetInspection extends Record<string, unknown> {
  // Primary Field
  inspection_id: string;
  inspection_sub_id: number;
  inspection_code?: string;

  // Main Field Details
  inspection_date: string;
  inspection_date_f?: string;
  inspection_type: InspectionType;
  inspection_priority: InspectionPriority;
  inspection_status: InspectionStatus;
  inspection_notes?: string;

  odometer_reading?: number;

  // Location Details
  latitude?: number;
  longitude?: number;
  google_location?: string;

  landmark_id?: string;
  MasterMainLandMark?: MasterMainLandMark;
  landmark_location?: string;
  landmark_distance?: number;

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

  inspection_form_id?: string;
  FleetInspectionForm?: FleetInspectionForm;
  inspection_form_name?: string;
  inspection_data?: Record<string, unknown>;

  service_id?: string;
  FleetService?: FleetService;

  // Relations - Child
  // Child - Fleet
  FleetIssue?: FleetIssue[];
  FleetInspectionFile?: FleetInspectionFile[];

  // Relations - Child Count
  _count?: {
    FleetIssue?: number;
    FleetInspectionFile?: number;
  };
}

// FleetInspectionFile Interface
export interface FleetInspectionFile extends BaseCommonFile {
  // Primary Field
  inspection_file_id: string;

  // Usage Type -> Inspection Images, Inspection Videos, Inspection Documents

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

  inspection_id: string;
  FleetInspection?: FleetInspection;

  // Relations - Child Count
  _count?: {};
}

// InspectionDashboard Interface
export interface InspectionDashboard extends Record<string, unknown> {
  vehicle_id: string;
  vehicle_number: string;
  vehicle_type: string;
  inspections_count: number;

  // Relations - Child Count
  _count?: {};
}

// FleetInspectionFile Schema
export const FleetInspectionFileSchema = BaseFileSchema.extend({
  // Relations - Parent
  organisation_id: single_select_optional('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  inspection_id: single_select_optional('FleetInspection'), // Single-Selection -> FleetInspection
});
export type FleetInspectionFileDTO = z.infer<typeof FleetInspectionFileSchema>;

// FleetInspection Create/Update Schema
export const FleetInspectionSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  vehicle_id: single_select_mandatory('MasterVehicle'), // Single-Selection -> MasterVehicle
  driver_id: single_select_optional('MasterDriver'), // Single-Selection -> MasterDriver

  inspection_form_id: single_select_optional('FleetInspectionForm'), // Single-Selection -> FleetInspectionForm
  service_id: single_select_optional('FleetService'), // Single-Selection -> FleetService

  // Main Field Details
  inspection_date: dateMandatory('Inspection Date'),
  inspection_type: enumMandatory('Inspection Type', InspectionType, InspectionType.Regular),
  inspection_priority: enumMandatory('Inspection Priority', InspectionPriority, InspectionPriority.NoPriority),
  inspection_status: enumMandatory('Inspection Status', InspectionStatus, InspectionStatus.Pending),
  inspection_notes: stringOptional('Inspection Notes', 0, 500),

  inspection_data: dynamicJsonSchema('Inspection Data', {}),

  odometer_reading: numberOptional('Odometer Reading'),

  // Location Details
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  google_location: stringOptional('Google Location', 0, 500),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),

  // Files
  FleetInspectionFileSchema: nestedArrayOfObjectsOptional('FleetInspectionFileSchema', FleetInspectionFileSchema, []),

  // Other
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FleetInspectionDTO = z.infer<typeof FleetInspectionSchema>;

// FleetInspection Query Schema
export const FleetInspectionQuerySchema = BaseQuerySchema.extend({
  // Self Table
  inspection_ids: multi_select_optional('FleetInspection'), // Multi-Selection -> FleetInspection

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // Multi-Selection -> MasterDriver
  inspection_form_ids: multi_select_optional('FleetInspectionForm'), // Multi-Selection -> FleetInspectionForm
  service_ids: multi_select_optional('FleetService'), // Multi-Selection -> FleetService

  // Enums
  inspection_type: enumArrayOptional('Inspection Type', InspectionType, getAllEnums(InspectionType)),
  inspection_priority: enumArrayOptional('Inspection Priority', InspectionPriority, getAllEnums(InspectionPriority)),
  inspection_status: enumArrayOptional('Inspection Status', InspectionStatus, getAllEnums(InspectionStatus)),

  // Dates
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetInspectionQueryDTO = z.infer<typeof FleetInspectionQuerySchema>;

// FleetInspectionDashBoard Query Schema
export const FleetInspectionDashBoardQuerySchema = BaseQuerySchema.extend({
  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetInspectionDashBoardQueryDTO = z.infer<typeof FleetInspectionDashBoardQuerySchema>;

// Convert FleetInspection Data to API Payload
export const toFleetInspectionPayload = (row: FleetInspection): FleetInspectionDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',
  vehicle_id: row.vehicle_id || '',
  driver_id: row.driver_id || '',

  inspection_form_id: row.inspection_form_id || '',
  service_id: row.service_id || '',

  inspection_date: row.inspection_date || '',
  inspection_type: row.inspection_type || InspectionType.Regular,
  inspection_priority: row.inspection_priority || InspectionPriority.NoPriority,
  inspection_status: row.inspection_status || InspectionStatus.Pending,
  inspection_notes: row.inspection_notes || '',

  inspection_data: row.inspection_data || {},

  odometer_reading: row.odometer_reading || 0,

  latitude: row.latitude || 0,
  longitude: row.longitude || 0,
  google_location: row.google_location || '',

  status: row.status || Status.Active,

  FleetInspectionFileSchema: row.FleetInspectionFile?.map((file) => ({
    inspection_file_id: file.inspection_file_id || '',

    // Usage Type -> Inspection Images, Inspection Videos, Inspection Documents
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
    inspection_id: file.inspection_id || '',
  })) || [],

  time_zone_id: '',
});

// Create New FleetInspection Payload
export const newFleetInspectionPayload = (): FleetInspectionDTO => ({
  organisation_id: '',
  user_id: '',
  vehicle_id: '',
  driver_id: '',

  inspection_form_id: '',
  service_id: '',

  inspection_date: '',
  inspection_type: InspectionType.Regular,
  inspection_priority: InspectionPriority.NoPriority,
  inspection_status: InspectionStatus.Pending,
  inspection_notes: '',

  inspection_data: {},

  odometer_reading: 0,

  latitude: 0,
  longitude: 0,
  google_location: '',

  status: Status.Active,

  FleetInspectionFileSchema: [],

  time_zone_id: '',
});

// AWS S3 PRESIGNED
export const get_inspection_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.inspection_file_presigned_url, data);
};

// File Uploads
export const create_inspection_file = async (data: FleetInspectionFileDTO): Promise<SBR> => {
  return apiPost<SBR, FleetInspectionFileDTO>(ENDPOINTS.create_inspection_file, data);
};

export const remove_inspection_file = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_inspection_file(id));
};

// FleetInspection APIs
export const findFleetInspection = async (data: FleetInspectionQueryDTO): Promise<FBR<FleetInspection[]>> => {
  return apiPost<FBR<FleetInspection[]>, FleetInspectionQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetInspection = async (data: FleetInspectionDTO): Promise<SBR> => {
  return apiPost<SBR, FleetInspectionDTO>(ENDPOINTS.create, data);
};

export const updateFleetInspection = async (id: string, data: FleetInspectionDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetInspectionDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetInspection = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const inspection_dashboard = async (data: FleetInspectionDashBoardQueryDTO): Promise<FBR<InspectionDashboard[]>> => {
  return apiPost<FBR<InspectionDashboard[]>, FleetInspectionDashBoardQueryDTO>(ENDPOINTS.inspection_dashboard, data);
};