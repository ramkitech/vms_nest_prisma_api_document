// Imports
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import {
  SBR,
  FBR,
  BaseCommonFile,
  AWSPresignedUrl,
  BR,
} from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  single_select_mandatory,
  single_select_optional,
  stringOptional,
  enumMandatory,
  numberOptional,
  dateMandatory,
  dateOptional,
  enumArrayOptional,
  multi_select_optional,
  nestedArrayOfObjectsOptional,
  getAllEnums,
  doubleOptional,
} from '../../../zod_utils/zod_utils';
import {
  BaseFileSchema,
  BaseQuerySchema,
  FilePresignedUrlDTO,
} from '../../../zod_utils/zod_base_schema';

// Enums
import {
  FileType,
  PaymentStatus,
  ReminderType,
  ServiceStatus,
  ServiceType,
  Status,
  YesNo,
} from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { FleetVendor } from 'src/services/fleet/vendor_management/fleet_vendor_service';
import { FleetWorkshop } from 'src/services/fleet/workshop_management/fleet_workshop_service';
import { FleetIssue } from 'src/services/fleet/issue_management/issue_management_service';
import { FleetVendorServiceCenter } from '../vendor_management/fleet_vendor_service_center';
import { FleetInspection } from '../inspection_management/fleet_inspection_management_service';
import { MasterFleetServiceTask } from 'src/services/master/fleet/master_fleet_service_task_service';
import { MasterFleetServicePart } from 'src/services/master/fleet/master_fleet_service_part_service';

const URL = 'fleet/service_management/fleet_service_management';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  service_file_presigned_url: `${URL}/service_file_presigned_url`,

  // File Uploads
  create_service_file: `${URL}/create_service_file`,
  remove_service_file: (id: string): string => `${URL}/remove_service_file/${id}`,

  // FleetService APIs
  find: `${URL}/fleet_service_management/search`,
  create: `${URL}/fleet_service_management`,
  update: (id: string): string => `${URL}/fleet_service_management/${id}`,
  delete: (id: string): string => `${URL}/fleet_service_management/${id}`,

  service_dashboard: `${URL}/service_dashboard`,

  // FleetServiceTask APIs
  create_service_task: `${URL}/service_task`,
  find_service_task: `${URL}/service_task/search`,
  update_service_task: (id: string): string => `${URL}/service_task/${id}`,
  delete_service_task: (id: string): string => `${URL}/service_task/${id}`,

  // FleetServiceReminder APIs
  create_service_reminder: `${URL}/service_reminder`,
  find_service_reminder: `${URL}/service_reminder/search`,
  update_service_reminder: (id: string): string => `${URL}/service_reminder/${id}`,
  delete_service_reminder: (id: string): string => `${URL}/service_reminder/${id}`,
};

// FleetService Interface
export interface FleetService extends Record<string, unknown> {
  // Primary Field
  service_id: string;
  service_sub_id: number;
  service_code?: string;

  // Main Field Details
  service_status: ServiceStatus;
  service_type: ServiceType;

  service_start_date: string;
  service_start_date_f?: string;
  service_due_date?: string;
  service_due_date_f?: string;
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
  next_service_schedule_date_f?: string;

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

  vendor_id?: string;
  FleetVendor?: FleetVendor;
  vendor_logo_url?: string;
  vendor_name?: string;
  vendor_code?: string;

  service_center_id?: string;
  FleetVendorServiceCenter?: FleetVendorServiceCenter;
  service_center_name?: string;

  workshop_id?: string;
  FleetWorkshop?: FleetWorkshop;
  workshop_name?: string;

  assigned_user_id?: string;
  AssignedUser?: User;
  assigned_user_details?: string;
  assigned_user_image_url?: string;

  // Relations - Child
  // Child - Fleet
  FleetIssue?: FleetIssue[];
  FleetServiceTask?: FleetServiceTask[];
  FleetServiceFile?: FleetServiceFile[];
  FleetServiceReminder?: FleetServiceReminder[];

  // Relations - Child (Optional)
  // Child - Fleet
  FleetInspection?: FleetInspection[];
  // FleetTyreInspection?: FleetTyreInspection[];

  // Relations - Child Count
  _count?: {
    FleetIssue?: number;
    FleetServiceTask?: number;
    FleetServiceFile?: number;
    FleetServiceReminder?: number;
    FleetInspection?: number;
    FleetTyreInspection?: number;
  };
}

// FleetServiceTask Interface
export interface FleetServiceTask extends Record<string, unknown> {
  // Primary Field
  service_task_id: string;

  // Main Field Details
  part_unit_amount?: number;
  part_quantity?: number;
  part_total_amount?: number;
  part_warranty_end_date?: string;
  part_warranty_end_date_f?: string;

  next_due_date?: string;
  next_due_date_f?: string;
  next_due_odometer_reading?: number;

  task_description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  service_id: string;
  FleetService?: FleetService;

  fleet_service_task_id: string;
  MasterFleetServiceTask?: MasterFleetServiceTask;
  fleet_service_task?: string;

  fleet_service_part_id?: string;
  MasterFleetServicePart?: MasterFleetServicePart;
  part_name?: string;

  // Relations - Child
  // Child - Fleet
  FleetServiceReminder?: FleetServiceReminder[];

  // Relations - Child Count
  _count?: {
    FleetServiceReminder?: number;
  };
}

// FleetServiceFile Interface
export interface FleetServiceFile extends BaseCommonFile {
  // Primary Field
  service_file_id: string;

  // Usage Type -> Sevice Receipt, Payment Receipt, Job Card, Parts Image/Video, Service Video, Odometer Image, Fuel Level Image

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

  service_id: string;
  FleetService?: FleetService;

  // Relations - Child

  // Relations - Child Count
  _count?: {};
}

// FleetServiceReminder Interface
export interface FleetServiceReminder extends Record<string, unknown> {
  // Primary Field
  service_reminder_id: string;

  // Main Field Details
  reminder_type: ReminderType;

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

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  service_id: string;
  FleetService?: FleetService;

  service_task_id?: string;
  FleetServiceTask?: FleetServiceTask;

  // Relations - Child

  // Relations - Child Count
  _count?: {};
}

// ServiceDashboard Interface
export interface ServiceDashboard extends Record<string, unknown> {
  date: string;
  services_count: number;
  total_amount: number;

  // Relations - Parent

  // Relations - Child

  // Relations - Child Count
  _count?: {};
}

// FleetServiceFile Schema
export const FleetServiceFileSchema = BaseFileSchema.extend({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  service_id: single_select_mandatory('FleetService'), // Single-Selection -> FleetService
});
export type FleetServiceFileDTO = z.infer<typeof FleetServiceFileSchema>;

// FleetService Create/Update Schema
export const FleetServiceSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  vehicle_id: single_select_mandatory('MasterVehicle'), // Single-Selection -> MasterVehicle
  driver_id: single_select_optional('MasterDriver'), // Single-Selection -> MasterDriver

  is_inhouse_service: enumMandatory('Is Inhouse Service', YesNo, YesNo.No),

  vendor_id: single_select_optional('FleetVendor'), // Single-Selection -> FleetVendor
  service_center_id: single_select_optional('FleetVendorServiceCenter'), // Single-Selection -> FleetVendorServiceCenter

  workshop_id: single_select_optional('FleetWorkshop'), // Single-Selection -> FleetWorkshop
  assigned_user_id: single_select_optional('AssignedUser'), // Single-Selection -> User

  // Main Field Details
  service_status: enumMandatory('Service Status', ServiceStatus, ServiceStatus.Pending),
  service_type: enumMandatory('Service Type', ServiceType, ServiceType.Preventive),

  service_start_date: dateMandatory('Service Start Date'),
  service_due_date: dateOptional('Service Due Date'),
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

  // Rating
  rating: numberOptional('Rating', 0, 5),
  rating_comments: stringOptional('Rating Comments', 0, 2000),

  // Warranty Information
  warranty_related_information: stringOptional('Warranty Related Information', 0, 500),

  // Payment Information
  payment_related_information: stringOptional('Payment Related Information', 0, 500),
  payment_status: enumMandatory('Payment Status', PaymentStatus, PaymentStatus.Pending),
  payment_method: stringOptional('Payment Method', 0, 50),

  // Next Schedule
  next_odometer_reading: numberOptional('Next Odometer Reading'),
  next_service_schedule_date: dateOptional('Next Service Schedule Date'),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),

  // Files
  FleetServiceFileSchema: nestedArrayOfObjectsOptional('FleetServiceFileSchema', FleetServiceFileSchema, []),

  // Other
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FleetServiceDTO = z.infer<typeof FleetServiceSchema>;

// FleetService Query Schema
export const FleetServiceQuerySchema = BaseQuerySchema.extend({
  service_ids: multi_select_optional('FleetService'), // Multi-Selection -> FleetService

  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // Multi-Selection -> MasterDriver

  is_inhouse_service: enumArrayOptional('Is Inhouse Service', YesNo, getAllEnums(YesNo)),

  vendor_ids: multi_select_optional('FleetVendor'), // Multi-Selection -> FleetVendor
  service_center_ids: multi_select_optional('FleetVendorServiceCenter'), // Multi-Selection -> FleetVendorServiceCenter
  workshop_ids: multi_select_optional('FleetWorkshop'), // Multi-Selection -> FleetWorkshop
  assigned_user_ids: multi_select_optional('AssignedUser'), // Multi-Selection -> User

  service_status: enumArrayOptional('Service Status', ServiceStatus, getAllEnums(ServiceStatus)),
  service_type: enumArrayOptional('Service Type', ServiceType, getAllEnums(ServiceType)),

  payment_status: enumArrayOptional('Payment Status', PaymentStatus, getAllEnums(PaymentStatus)),

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetServiceQueryDTO = z.infer<typeof FleetServiceQuerySchema>;

// FleetServiceDashBoard Query Schema
export const FleetServiceDashBoardQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetServiceDashBoardQueryDTO = z.infer<typeof FleetServiceDashBoardQuerySchema>;

// FleetServiceTask Create/Update Schema
export const FleetServiceTaskSchema = z.object({
  // Relations - Parent
  service_id: single_select_mandatory('FleetService'), // Single-Selection -> FleetService
  fleet_service_task_id: single_select_mandatory('MasterFleetServiceTask'), // Single-Selection -> MasterFleetServiceTask
  fleet_service_part_id: single_select_optional('MasterFleetServicePart'), // Single-Selection -> MasterFleetServicePart

  // Main Field Details
  part_unit_amount: doubleOptional('Part Unit Amount'),
  part_quantity: numberOptional('Part Quantity'),
  part_total_amount: doubleOptional('Part Total Amount'),
  part_warranty_end_date: dateOptional('Part Warranty End Date'),

  next_due_date: dateOptional('Next Due Date'),
  next_due_odometer_reading: numberOptional('Task Next Due Odometer Reading'),
  task_description: stringOptional('Task Description', 0, 2000),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FleetServiceTaskDTO = z.infer<typeof FleetServiceTaskSchema>;

// FleetServiceTask Query Schema
export const FleetServiceTaskQuerySchema = BaseQuerySchema.extend({
  // Self Table
  service_task_ids: multi_select_optional('FleetServiceTask'), // Multi-Selection -> FleetServiceTask

  // Relations - Parent
  service_ids: multi_select_optional('FleetService'), // Multi-Selection -> FleetService
  fleet_service_task_ids: multi_select_optional('MasterFleetServiceTask'), // Multi-Selection -> MasterFleetServiceTask
  fleet_service_part_ids: multi_select_optional('MasterFleetServicePart'), // Multi-Selection -> MasterFleetServicePart
});
export type FleetServiceTaskQueryDTO = z.infer<typeof FleetServiceTaskQuerySchema>;

// FleetServiceReminder Create/Update Schema
export const FleetServiceReminderSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  vehicle_id: single_select_mandatory('MasterVehicle'), // Single-Selection -> MasterVehicle
  service_id: single_select_mandatory('FleetService'), // Single-Selection -> FleetService

  // Main Field Details
  reminder_type: enumMandatory('Reminder Type', ReminderType, ReminderType.Upcoming),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetServiceReminderDTO = z.infer<typeof FleetServiceReminderSchema>;

// FleetServiceReminder Query Schema
export const FleetServiceReminderQuerySchema = BaseQuerySchema.extend({
  // Self Table
  service_reminder_ids: multi_select_optional('FleetServiceReminder'), // Multi-Selection -> FleetServiceReminder

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle
  service_ids: multi_select_optional('FleetService'), // Multi-Selection -> FleetService

  // Enums
  reminder_type: enumArrayOptional('Reminder Type', ReminderType, getAllEnums(ReminderType)),
});
export type FleetServiceReminderQueryDTO = z.infer<typeof FleetServiceReminderQuerySchema>;

// Convert FleetService Data to API Payload
export const toFleetServicePayload = (row: FleetService): FleetServiceDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',
  vehicle_id: row.vehicle_id || '',
  driver_id: row.driver_id || '',

  is_inhouse_service: row.is_inhouse_service || YesNo.No,

  vendor_id: row.vendor_id || '',
  service_center_id: row.service_center_id || '',

  workshop_id: row.workshop_id || '',
  assigned_user_id: row.assigned_user_id || '',

  service_status: row.service_status || ServiceStatus.Pending,
  service_type: row.service_type || ServiceType.Preventive,

  service_start_date: row.service_start_date || '',
  service_due_date: row.service_due_date || '',
  service_complete_date: row.service_complete_date || '',

  odometer_reading: row.odometer_reading || 0,
  fuel: row.fuel || 0,

  estimated_labor_cost: row.estimated_labor_cost || 0,
  estimated_parts_cost: row.estimated_parts_cost || 0,
  estimated_total_cost: row.estimated_total_cost || 0,
  estimated_notes: row.estimated_notes || '',

  actual_labor_cost: row.actual_labor_cost || 0,
  actual_parts_cost: row.actual_parts_cost || 0,
  actual_total_cost: row.actual_total_cost || 0,
  final_notes: row.final_notes || '',

  rating: row.rating || 0,
  rating_comments: row.rating_comments || '',

  warranty_related_information: row.warranty_related_information || '',

  payment_related_information: row.payment_related_information || '',
  payment_status: row.payment_status || PaymentStatus.Pending,
  payment_method: row.payment_method || '',

  next_odometer_reading: row.next_odometer_reading || 0,
  next_service_schedule_date: row.next_service_schedule_date || '',

  status: row.status || Status.Active,

  FleetServiceFileSchema:
    row.FleetServiceFile?.map((file) => ({
      service_file_id: file.service_file_id || '',

      // Usage Type -> Sevice Receipt, Payment Receipt, Job Card, Parts Image/Video, Service Video, Odometer Image, Fuel Level Image
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
      service_id: file.service_id || '',
    })) || [],

  time_zone_id: '',
});

// Create New FleetService Payload
export const newFleetServicePayload = (): FleetServiceDTO => ({
  organisation_id: '',
  user_id: '',
  vehicle_id: '',
  driver_id: '',

  is_inhouse_service: YesNo.No,

  vendor_id: '',
  service_center_id: '',

  workshop_id: '',
  assigned_user_id: '',

  service_status: ServiceStatus.Pending,
  service_type: ServiceType.Preventive,

  service_start_date: '',
  service_due_date: '',
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

  rating: 0,
  rating_comments: '',

  warranty_related_information: '',

  payment_related_information: '',
  payment_status: PaymentStatus.Pending,
  payment_method: '',

  next_odometer_reading: 0,
  next_service_schedule_date: '',

  status: Status.Active,

  FleetServiceFileSchema: [],

  time_zone_id: '',
});

// Convert FleetServiceTask Data to API Payload
export const toFleetServiceTaskPayload = (
  row: FleetServiceTask,
): FleetServiceTaskDTO => ({
  service_id: row.service_id || '',
  fleet_service_task_id: row.fleet_service_task_id || '',
  fleet_service_part_id: row.fleet_service_part_id || '',

  part_unit_amount: row.part_unit_amount || 0,
  part_quantity: row.part_quantity || 0,
  part_total_amount: row.part_total_amount || 0,
  part_warranty_end_date: row.part_warranty_end_date || '',

  next_due_date: row.next_due_date || '',
  next_due_odometer_reading: row.next_due_odometer_reading || 0,
  task_description: row.task_description || '',

  status: row.status || Status.Active,
  time_zone_id: '',
});

// Create New FleetServiceTask Payload
export const newFleetServiceTaskPayload = (): FleetServiceTaskDTO => ({
  service_id: '',
  fleet_service_task_id: '',
  fleet_service_part_id: '',

  part_unit_amount: 0,
  part_quantity: 0,
  part_total_amount: 0,
  part_warranty_end_date: '',

  next_due_date: '',
  next_due_odometer_reading: 0,
  task_description: '',

  status: Status.Active,
  time_zone_id: '',
});

// Convert FleetServiceReminder Data to API Payload
export const toFleetServiceReminderPayload = (row: FleetServiceReminder): FleetServiceReminderDTO => ({
  organisation_id: row.organisation_id || '',
  vehicle_id: row.vehicle_id || '',
  service_id: row.service_id || '',

  reminder_type: row.reminder_type || ReminderType.Upcoming,

  status: row.status || Status.Active,
});

// Create New FleetServiceReminder Payload
export const newFleetServiceReminderPayload = (): FleetServiceReminderDTO => ({
  organisation_id: '',
  vehicle_id: '',
  service_id: '',

  reminder_type: ReminderType.Upcoming,

  status: Status.Active,
});

// AWS S3 PRESIGNED
export const get_service_file_presigned_url = async (
  data: FilePresignedUrlDTO,
): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(
    ENDPOINTS.service_file_presigned_url,
    data,
  );
};

// File Uploads
export const create_service_file = async (
  data: FleetServiceFileDTO,
): Promise<SBR> => {
  return apiPost<SBR, FleetServiceFileDTO>(ENDPOINTS.create_service_file, data);
};

export const remove_service_file = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_service_file(id));
};

// FleetService APIs
export const findFleetService = async (
  data: FleetServiceQueryDTO,
): Promise<FBR<FleetService[]>> => {
  return apiPost<FBR<FleetService[]>, FleetServiceQueryDTO>(
    ENDPOINTS.find,
    data,
  );
};

export const createFleetService = async (
  data: FleetServiceDTO,
): Promise<SBR> => {
  return apiPost<SBR, FleetServiceDTO>(ENDPOINTS.create, data);
};

export const updateFleetService = async (
  id: string,
  data: FleetServiceDTO,
): Promise<SBR> => {
  return apiPatch<SBR, FleetServiceDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetService = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const service_dashboard = async (
  data: FleetServiceDashBoardQueryDTO,
): Promise<FBR<ServiceDashboard[]>> => {
  return apiPost<FBR<ServiceDashboard[]>, FleetServiceDashBoardQueryDTO>(
    ENDPOINTS.service_dashboard,
    data,
  );
};

// FleetServiceTask APIs
export const findFleetServiceTask = async (
  data: FleetServiceTaskQueryDTO,
): Promise<FBR<FleetServiceTask[]>> => {
  return apiPost<FBR<FleetServiceTask[]>, FleetServiceTaskQueryDTO>(
    ENDPOINTS.find_service_task,
    data,
  );
};

export const createFleetServiceTask = async (
  data: FleetServiceTaskDTO,
): Promise<SBR> => {
  return apiPost<SBR, FleetServiceTaskDTO>(
    ENDPOINTS.create_service_task,
    data,
  );
};

export const updateFleetServiceTask = async (
  id: string,
  data: FleetServiceTaskDTO,
): Promise<SBR> => {
  return apiPatch<SBR, FleetServiceTaskDTO>(
    ENDPOINTS.update_service_task(id),
    data,
  );
};

export const deleteFleetServiceTask = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_service_task(id));
};

// FleetServiceReminder APIs
export const findFleetServiceReminder = async (
  data: FleetServiceReminderQueryDTO,
): Promise<FBR<FleetServiceReminder[]>> => {
  return apiPost<FBR<FleetServiceReminder[]>, FleetServiceReminderQueryDTO>(
    ENDPOINTS.find_service_reminder,
    data,
  );
};

export const createFleetServiceReminder = async (
  data: FleetServiceReminderDTO,
): Promise<SBR> => {
  return apiPost<SBR, FleetServiceReminderDTO>(
    ENDPOINTS.create_service_reminder,
    data,
  );
};

export const updateFleetServiceReminder = async (
  id: string,
  data: FleetServiceReminderDTO,
): Promise<SBR> => {
  return apiPatch<SBR, FleetServiceReminderDTO>(
    ENDPOINTS.update_service_reminder(id),
    data,
  );
};

export const deleteFleetServiceReminder = async (
  id: string,
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_service_reminder(id));
};