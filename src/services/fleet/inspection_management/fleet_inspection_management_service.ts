// Imports
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BaseCommonFile, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumArrayOptional,
  numberOptional,
  nestedArrayOfObjectsOptional,
  dateMandatory,
  single_select_optional,
  getAllEnums,
  dynamicJsonSchema,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { InspectionActionStatus, InspectionPriority, InspectionStatus, InspectionType, PaymentStatus, ServiceStatus, ServiceType, Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';

import { FleetIssueManagement } from '../issue_management/issue_management_service';
import { FleetServiceManagement } from '../service_management/fleet_service_management_service';
import { FleetInspectionForm } from './fleet_inspection_form_service';
import { FleetInspectionSchedule } from './fleet_inspection_schedule_service';

const URL = 'fleet/inspection_management/inspections';

const ENDPOINTS = {

  // AWS S3 PRESIGNED
  inspection_file_presigned_url: `${URL}/inspection_file_presigned_url`,

  // File
  create_inspection_file: `${URL}/create_inspection_file`,
  remove_inspection_file: (id: string): string => `${URL}/remove_inspection_file/${id}`,

  find: `${URL}/search`,
  find_check_pending: `${URL}/check_pending`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// ✅ FleetInspection Interface
export interface FleetInspection extends Record<string, unknown> {
  inspection_id: string;

  inspection_type: InspectionType;
  inspection_date: string;
  inspection_date_f: string;
  inspection_priority: InspectionPriority;
  inspection_status: InspectionStatus;

  odometer_reading: number;

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  driver_id?: string;
  MasterDriver?: MasterDriver;
  driver_details?: string;

  inspector_id: string;
  InspectorUser?: User;

  inspection_form_id?: string;
  FleetInspectionForm?: FleetInspectionForm;
  inspection_form_name?: string;
  inspection_data: Record<string, unknown>;

  service_management_id?: string;
  FleetServiceManagement?: FleetServiceManagement;

  inspection_schedule_id?: string;
  FleetInspectionSchedule?: FleetInspectionSchedule;
  inspection_schedule_name?: string;
  inspection_schedule_start_date?: string;
  inspection_schedule_due_date?: string;

  FleetIssueManagement: FleetIssueManagement[]
  FleetInspectionFile: FleetInspectionFile[];

  // Relations - Child
  _count?: {
    FleetInspectionFile: number;
    FleetIssueManagement: number;
  };
}

// ✅ FleetInspectionFile Interface
export interface FleetInspectionFile extends BaseCommonFile {
  // Primary Fields
  fleet_inspection_file_id: string;

  // ✅ Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  inspection_id: string;
  FleetInspection?: FleetInspection;
}

// ✅ FleetInspectionFile Schema
export const FleetInspectionFileSchema = BaseFileSchema.extend({
  organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  inspection_id: single_select_optional('FleetInspection'), // ✅ Single-Selection -> FleetInspection
});
export type FleetInspectionFileDTO = z.infer<typeof FleetInspectionFileSchema>;

// ✅ FleetInspection Create/Update Schema
export const FleetInspectionSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  vehicle_id: single_select_mandatory('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
  driver_id: single_select_optional('MasterDriver'), // ✅ Single-Selection -> MasterDriver
  inspector_id: single_select_optional('User'), // ✅ Single-Selection -> User

  inspection_form_id: single_select_mandatory('FleetInspectionForm'), // ✅ Single-Selection -> FleetInspectionForm
  service_management_id: single_select_optional('FleetServiceManagement'), // ✅ Single-Selection -> FleetServiceManagement

  inspection_type: enumMandatory(
    'Inspection Type',
    InspectionType,
    InspectionType.Regular,
  ),
  inspection_date: dateMandatory('Inspection Date'),
  inspection_priority: enumMandatory(
    'Inspection Priority',
    InspectionPriority,
    InspectionPriority.NoPriority,
  ),
  inspection_status: enumMandatory(
    'Inspection Status',
    InspectionStatus,
    InspectionStatus.Pending,
  ),

  inspection_data: dynamicJsonSchema('Inspection Data', {}),

  odometer_reading: numberOptional('Odometer Reading'),

  // Other
  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),

  FleetInspectionFileSchema: nestedArrayOfObjectsOptional(
    'FleetInspectionFileSchema',
    FleetInspectionFileSchema,
    [],
  ),
});
export type FleetInspectionDTO = z.infer<typeof FleetInspectionSchema>;

// ✅ FleetInspection Query Schema
export const FleetInspectionQuerySchema = BaseQuerySchema.extend({
  inspection_ids: multi_select_optional('FleetInspection'), // ✅ Multi-Selection -> FleetInspection

  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-Selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-Selection -> MasterDriver
  inspection_form_ids: multi_select_optional('FleetInspectionForm'), // ✅ Multi-Selection -> FleetInspectionForm
  service_management_ids: multi_select_optional('FleetServiceManagement'), // ✅ Multi-Selection -> FleetServiceManagement
  inspection_schedule_ids: multi_select_optional('FleetInspectionSchedule'), // ✅ Multi-Selection -> FleetInspectionSchedule

  inspection_type: enumArrayOptional(
    'Inspection Type',
    InspectionType,
    getAllEnums(InspectionType),
  ),
  inspection_priority: enumArrayOptional(
    'Inspection Priority',
    InspectionPriority,
    getAllEnums(InspectionPriority),
  ),
  inspection_status: enumArrayOptional(
    'Inspection Status',
    InspectionStatus,
    getAllEnums(InspectionStatus),
  ),
  inspection_action_status: enumArrayOptional(
    'Inspection Action Status',
    InspectionActionStatus,
    getAllEnums(InspectionActionStatus),
  ),
});
export type FleetInspectionQueryDTO = z.infer<
  typeof FleetInspectionQuerySchema
>;

// ✅ FleetInspectionCheckPending Query Schema
export const FleetInspectionCheckPendingQuerySchema = BaseQuerySchema.extend({
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-Selection -> MasterVehicle
});
export type FleetInspectionCheckPendingQueryDTO = z.infer<
  typeof FleetInspectionCheckPendingQuerySchema
>;

// ✅ Convert FleetInspection Data to API Payload
export const toFleetInspectionPayload = (row: FleetInspection): FleetInspectionDTO => ({
  organisation_id: row.organisation_id || '',
  vehicle_id: row.vehicle_id || '',
  driver_id: row.driver_id || '',
  inspector_id: row.inspector_id || '',
  inspection_form_id: row.inspection_form_id || '',
  service_management_id: row.service_management_id || '',

  inspection_type: row.inspection_type || InspectionType.Regular,
  inspection_date: row.inspection_date || '',
  inspection_priority: row.inspection_priority || InspectionPriority.NoPriority,
  inspection_status: row.inspection_status || InspectionStatus.Pending,

  inspection_data: row.inspection_data || {},
  odometer_reading: row.odometer_reading || 0,

  status: row.status || Status.Active,
  time_zone_id: '', // Needs to be provided manually

  FleetInspectionFileSchema: row.FleetInspectionFile?.map((file) => ({
    fleet_inspection_file_id: file.fleet_inspection_file_id ?? '',

    usage_type: file.usage_type,

    file_type: file.file_type,
    file_url: file.file_url || '',
    file_key: file.file_key || '',
    file_name: file.file_name || '',
    file_description: file.file_description || '',
    file_size: file.file_size || 0,
    file_metadata: file.file_metadata ?? {},

    status: file.status,
    added_date_time: file.added_date_time,
    modified_date_time: file.modified_date_time,

    organisation_id: file.organisation_id ?? '',
    inspection_id: file.inspection_id ?? '',
  })) ?? [],
});

// ✅ Create New FleetInspection Payload
export const newFleetInspectionPayload = (): FleetInspectionDTO => ({
  organisation_id: '',
  vehicle_id: '',
  driver_id: '',
  inspector_id: '',
  inspection_form_id: '',
  service_management_id: '',

  inspection_type: InspectionType.Regular,
  inspection_date: '',
  inspection_priority: InspectionPriority.NoPriority,
  inspection_status: InspectionStatus.Pending,

  inspection_data: {},
  odometer_reading: 0,

  status: Status.Active,
  time_zone_id: '', // Needs to be provided manually

  FleetInspectionFileSchema: []
});

// Generate presigned URL for file uploads
export const get_inspection_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.inspection_file_presigned_url, data);
};

// File API Methods
export const create_service_file = async (data: FleetInspectionFileDTO): Promise<SBR> => {
  return apiPost<SBR, FleetInspectionFileDTO>(ENDPOINTS.create_inspection_file, data);
};

export const remove_service_file = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_inspection_file(id));
};

// FleetInspection
export const findFleetInspection = async (data: FleetInspectionQueryDTO): Promise<FBR<FleetInspection[]>> => {
  return apiPost<FBR<FleetInspection[]>, FleetInspectionQueryDTO>(ENDPOINTS.find, data);
};

export const find_check_pending = async (data: FleetInspectionCheckPendingQueryDTO): Promise<FBR<FleetInspection[]>> => {
  return apiPost<FBR<FleetInspection[]>, FleetInspectionCheckPendingQueryDTO>(ENDPOINTS.find_check_pending, data);
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