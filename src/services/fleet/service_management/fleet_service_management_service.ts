// Imports
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BaseCommonFile, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
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
    getAllEnums,
    doubleOptional,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { PaymentStatus, ServiceStatus, ServiceType, Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';

import { FleetVendor } from '../vendor_management/fleet_vendor_service';
import { FleetVendorServiceCenter } from '../vendor_management/fleet_vendor_service_center';
import { MasterFleetServiceTask } from 'src/services/master/fleet/master_fleet_service_task_service';

const URL = 'fleet/service/service_management';

const ENDPOINTS = {

    // AWS S3 PRESIGNED
    service_file_presigned_url: `${URL}/service_file_presigned_url`,

    // File
    create_service_file: `${URL}/create_service_file`,
    remove_service_file: (id: string): string => `${URL}/remove_service_file/${id}`,

    find: `${URL}/search`,
    create: `${URL}`,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    find_task: `${URL}/task/search`,
    create_task: `${URL}/task`,
    update_task: (id: string): string => `${URL}/task/${id}`,
    delete_task: (id: string): string => `${URL}/task/${id}`,
};

// ✅ FleetServiceManagement Interface
export interface FleetServiceManagement extends Record<string, unknown> {
    service_management_id: string;
    service_management_sub_id: number;
    service_management_code: string;

    service_status: ServiceStatus;
    service_type: ServiceType;

    service_date: string;
    service_date_f: string;
    service_start_date?: string;
    service_start_date_f?: string;
    service_complete_date?: string;
    service_complete_date_f?: string;

    odometer_reading?: number;
    fuel?: number;

    // Estimated Costs
    estimated_labor_cost?: number;
    estimated_parts_cost?: number;
    estimated_total_cost?: number;
    estimated_notes?: string;

    // Actual Costs
    actual_labor_cost?: number;
    actual_parts_cost?: number;
    actual_total_cost?: number;
    final_notes?: string;

    is_inhouse_service: YesNo;

    // Rating
    rating?: number;
    rating_comments?: string;

    // Warranty Information
    warranty_related_information?: string;

    // Payment Information
    payment_related_information?: string;
    payment_status: PaymentStatus;
    payment_method?: string;

    // Next Schedule
    next_odometer_reading?: number;
    next_service_schedule_date?: string;

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

    vendor_id?: string;
    FleetVendor?: FleetVendor;
    vendor_name?: string;

    service_center_id?: string;
    FleetVendorServiceCenter?: FleetVendorServiceCenter;
    center_name?: string;

    FleetServiceManagementFile: FleetServiceManagementFile[];

    // Relations - Child
    _count?: {
        FleetServiceManagementTask: number;
        FleetServiceManagementFile: number;
        FleetIssueManagement: number;
    };
}

// ✅ FleetServiceManagementTask Interface
export interface FleetServiceManagementTask extends Record<string, unknown> {
    fleet_service_management_task_id: string;

    task_cost?: number;
    labor_cost?: number;
    parts_cost?: number;
    task_notes?: string;

    // ✅ Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations
    service_management_id: string;
    FleetServiceManagement?: FleetServiceManagement;

    fleet_service_task_id: string;
    MasterFleetServiceTask?: MasterFleetServiceTask;
    fleet_service_task?: string;

    // Relations - Child
    _count?: {
    };
}

// ✅ FleetServiceManagementFile Interface
export interface FleetServiceManagementFile extends BaseCommonFile {
    // Primary Fields
    fleet_service_management_file_id: string;

    // ✅ Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    service_management_id: string;
    FleetServiceManagement?: FleetServiceManagement;
}

// ✅ FleetServiceManagementFile Schema
export const FleetServiceManagementFileSchema = BaseFileSchema.extend({
  organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  service_management_id: single_select_optional('FleetServiceManagement'), // ✅ Single-Selection -> FleetServiceManagement
});
export type FleetServiceManagementFileDTO = z.infer<
  typeof FleetServiceManagementFileSchema
>;

// ✅ FleetServiceManagement Create/Update Schema
export const FleetServiceManagementSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  user_id: single_select_mandatory('User'), // ✅ Single-Selection -> User
  vehicle_id: single_select_mandatory('MasterVehicle'), // ✅ Single-Selection -> Vehicle
  driver_id: single_select_optional('MasterDriver'), // ✅ Single-Selection -> MasterDriver
  vendor_id: single_select_optional('FleetVendor'), // ✅ Single-Selection -> FleetVendor
  service_center_id: single_select_optional('FleetVendorServiceCenter'), // ✅ Single-Selection -> FleetVendorServiceCenter
  service_schedule_id: single_select_optional('FleetServiceSchedule'), // ✅ Single-Selection -> FleetServiceSchedule

  service_status: enumMandatory(
    'Service Status',
    ServiceStatus,
    ServiceStatus.Pending,
  ),
  service_type: enumMandatory(
    'Service Type',
    ServiceType,
    ServiceType.Preventive,
  ),

  service_date: dateMandatory('Service Date'),
  service_start_date: dateOptional('Service Start Date'),
  service_complete_date: dateOptional('Service Complete Date'),

  odometer_reading: numberOptional('Odometer Reading'),
  fuel: doubleOptional('Fuel'),

  // Estimated Costs
  estimated_labor_cost: doubleOptional('Estimated Labor Cost'),
  estimated_parts_cost: doubleOptional('Estimated Parts Cost'),
  estimated_total_cost: doubleOptional('Estimated Total Cost'),
  estimated_notes: stringOptional('Estimated Notes', 0, 2000),

  // Actual Costs
  actual_labor_cost: doubleOptional('Actual Labor Cost'),
  actual_parts_cost: doubleOptional('Actual Parts Cost'),
  actual_total_cost: doubleOptional('Actual Total Cost'),
  final_notes: stringOptional('Final Notes', 0, 2000),

  is_inhouse_service: enumMandatory('Is Inhouse Service', YesNo, YesNo.No),

  // Rating
  rating: numberOptional('Rating'),
  rating_comments: stringOptional('Rating Comments', 0, 2000),

  // Warranty Information
  warranty_related_information: stringOptional(
    'Warranty Related Information',
    0,
    500,
  ),

  // Payment Information
  payment_related_information: stringOptional(
    'Payment Related Information',
    0,
    500,
  ),
  payment_status: enumMandatory(
    'Payment Status',
    PaymentStatus,
    PaymentStatus.Pending,
  ),
  payment_method: stringOptional('Payment Method', 0, 50),

  // Next Schedule
  next_odometer_reading: numberOptional('Next Odometer Reading'),
  next_service_schedule_date: dateOptional('Next Service Schedule Date'),

  // Other
  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),

  FleetServiceManagementFileSchema: nestedArrayOfObjectsOptional(
    'FleetServiceManagementFileSchema',
    FleetServiceManagementFileSchema,
    [],
  ),
});
export type FleetServiceManagementDTO = z.infer<
  typeof FleetServiceManagementSchema
>;

// ✅ FleetServiceManagement Query Schema
export const FleetServiceManagementQuerySchema = BaseQuerySchema.extend({
  service_management_ids: multi_select_optional('FleetServiceManagement'), // ✅ Multi-Selection -> FleetServiceManagement

  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // ✅ Multi-Selection -> User
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-Selection -> Vehicle
  driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-Selection -> MasterDriver

  vendor_ids: multi_select_optional('FleetVendor'), // ✅ Multi-Selection -> FleetVendor
  service_center_ids: multi_select_optional('FleetVendorServiceCenter'), // ✅ Multi-Selection -> FleetVendorServiceCenter

  service_status: enumArrayOptional(
    'Service Status',
    ServiceStatus,
    getAllEnums(ServiceStatus),
  ),
  service_type: enumArrayOptional(
    'Service Type',
    ServiceType,
    getAllEnums(ServiceType),
  ),
  is_inhouse_service: enumArrayOptional(
    'Is Inhouse Service',
    YesNo,
    getAllEnums(YesNo),
  ),
  payment_status: enumArrayOptional(
    'Payment Status',
    PaymentStatus,
    getAllEnums(PaymentStatus),
  ),

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetServiceManagementQueryDTO = z.infer<
  typeof FleetServiceManagementQuerySchema
>;

// ✅ FleetServiceManagementTask Create/Update Schema
export const FleetServiceManagementTaskSchema = z.object({
  fleet_service_task_id: single_select_mandatory('MasterFleetServiceTask'), // ✅ Single-Selection -> MasterFleetServiceTask
  service_management_id: single_select_mandatory('FleetServiceManagement'), // ✅ Single-Selection -> FleetServiceManagement

  task_cost: doubleOptional('Task Cost', 3),
  labor_cost: doubleOptional('Labor Cost', 3),
  parts_cost: doubleOptional('Parts Cost', 3),
  task_notes: stringOptional('Task Notes', 0, 2000),

  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetServiceManagementTaskDTO = z.infer<
  typeof FleetServiceManagementTaskSchema
>;

// ✅ FleetServiceManagementTask Query Schema
export const FleetServiceManagementTaskQuerySchema = BaseQuerySchema.extend({
  fleet_service_management_task_ids: multi_select_optional(
    'FleetServiceManagementTask',
  ), // ✅ Multi-Selection -> FleetServiceManagementTask

  service_management_ids: multi_select_optional('FleetServiceManagement'), // ✅ Multi-Selection -> FleetServiceManagement
  fleet_service_task_ids: multi_select_optional('MasterFleetServiceTask'), // ✅ Multi-Selection -> MasterFleetServiceTask
});
export type FleetServiceManagementTaskQueryDTO = z.infer<
  typeof FleetServiceManagementTaskQuerySchema
>;

// ✅ Convert FleetServiceManagement Data to API Payload
export const toFleetServiceManagementPayload = (row: FleetServiceManagement): FleetServiceManagementDTO => ({
    service_status: row.service_status || ServiceStatus.Pending,
    service_type: row.service_type || ServiceType.Preventive,

    service_date: row.service_date || '',
    service_start_date: row.service_start_date || '',
    service_complete_date: row.service_complete_date || '',

    odometer_reading: row.odometer_reading || 0,
    fuel: row.fuel || 0,

    // Estimated Costs
    estimated_labor_cost: row.estimated_labor_cost || 0,
    estimated_parts_cost: row.estimated_parts_cost || 0,
    estimated_total_cost: row.estimated_total_cost || 0,
    estimated_notes: row.estimated_notes || '',

    // Actual Costs
    actual_labor_cost: row.actual_labor_cost || 0,
    actual_parts_cost: row.actual_parts_cost || 0,
    actual_total_cost: row.actual_total_cost || 0,
    final_notes: row.final_notes || '',

    is_inhouse_service: row.is_inhouse_service || YesNo.No,

    // Rating
    rating: row.rating || 0,
    rating_comments: row.rating_comments || '',

    // Warranty Information
    warranty_related_information: row.warranty_related_information || '',

    // Payment Information
    payment_related_information: row.payment_related_information || '',
    payment_status: row.payment_status || PaymentStatus.Pending,
    payment_method: row.payment_method || '',

    // Next Schedule
    next_odometer_reading: row.next_odometer_reading || 0,
    next_service_schedule_date: row.next_service_schedule_date || '',

    status: Status.Active,

    // Relations
    organisation_id: row.organisation_id || '',
    user_id: row.user_id || '',
    vehicle_id: row.vehicle_id || '',
    driver_id: row.driver_id || '',
    vendor_id: row.vendor_id || '',
    service_center_id: row.service_center_id || '',

    FleetServiceManagementFileSchema: row.FleetServiceManagementFile?.map((file) => ({
        fleet_service_management_file_id: file.fleet_service_management_file_id ?? '',

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
        service_management_id: file.service_management_id ?? '',
    })) ?? [],
    time_zone_id: '',
    service_schedule_id: ''
});

// ✅ Create New FleetServiceManagement Payload
export const newFleetServiceManagementPayload = (): FleetServiceManagementDTO => ({
    organisation_id: '',
    user_id: '',
    vehicle_id: '',
    driver_id: '',
    vendor_id: '',
    service_center_id: '',

    service_status: ServiceStatus.Pending,
    service_type: ServiceType.Preventive,
    service_date: '',
    service_start_date: '',
    service_complete_date: '',

    odometer_reading: 0,
    fuel: 0,

    estimated_labor_cost: 0,
    estimated_parts_cost: 0,
    estimated_total_cost: 0,
    estimated_notes: '',

    actual_labor_cost: 0,
    actual_parts_cost: 0,
    actual_total_cost: 0,
    final_notes: '',

    is_inhouse_service: YesNo.No,

    rating: 0,
    rating_comments: '',

    warranty_related_information: '',

    payment_related_information: '',
    payment_status: PaymentStatus.Pending,
    payment_method: '',

    next_odometer_reading: 0,
    next_service_schedule_date: '',

    status: Status.Active,

    FleetServiceManagementFileSchema: [],
    service_schedule_id: '',
    time_zone_id: ''
});

// ✅ Convert FleetServiceManagementTask Data to API Payload
export const toFleetServiceManagementTaskPayload = (row: FleetServiceManagementTask): FleetServiceManagementTaskDTO => ({
    task_cost: row.task_cost || 0,
    labor_cost: row.labor_cost || 0,
    parts_cost: row.parts_cost || 0,
    task_notes: row.task_notes || '',

    fleet_service_task_id: row.fleet_service_task_id || '',
    service_management_id: row.service_management_id || '',
    status: Status.Active,
});

// ✅ Create New FleetServiceManagementTask Payload
export const newFleetServiceManagementTaskPayload = (): FleetServiceManagementTaskDTO => ({
    task_cost: 0,
    labor_cost: 0,
    parts_cost: 0,
    task_notes: '',

    status: Status.Active,

    service_management_id: '',
    fleet_service_task_id: '',
});


// Generate presigned URL for file uploads
export const get_service_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
    return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.service_file_presigned_url, data);
};

// File API Methods
export const create_service_file = async (data: FleetServiceManagementFileDTO): Promise<SBR> => {
    return apiPost<SBR, FleetServiceManagementFileDTO>(ENDPOINTS.create_service_file, data);
};

export const remove_service_file = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_service_file(id));
};

// FleetServiceManagement
export const findFleetServiceManagement = async (data: FleetServiceManagementQueryDTO): Promise<FBR<FleetServiceManagement[]>> => {
    return apiPost<FBR<FleetServiceManagement[]>, FleetServiceManagementQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetServiceManagement = async (data: FleetServiceManagementDTO): Promise<SBR> => {
    return apiPost<SBR, FleetServiceManagementDTO>(ENDPOINTS.create, data);
};

export const updateFleetServiceManagement = async (id: string, data: FleetServiceManagementDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetServiceManagementDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetServiceManagement = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// FleetServiceManagementTask
export const findFleetServiceManagementTask = async (data: FleetServiceManagementTaskQueryDTO): Promise<FBR<FleetServiceManagementTask[]>> => {
    return apiPost<FBR<FleetServiceManagementTask[]>, FleetServiceManagementTaskQueryDTO>(ENDPOINTS.find_task, data);
};

export const createFleetServiceManagementTask = async (data: FleetServiceManagementTaskDTO): Promise<SBR> => {
    return apiPost<SBR, FleetServiceManagementTaskDTO>(ENDPOINTS.create_task, data);
};

export const updateFleetServiceManagementTask = async (id: string, data: FleetServiceManagementTaskDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetServiceManagementTaskDTO>(ENDPOINTS.update_task(id), data);
};

export const deleteFleetServiceManagementTask = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete_task(id));
};