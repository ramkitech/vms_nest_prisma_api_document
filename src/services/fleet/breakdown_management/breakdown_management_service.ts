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
  dateOptional,
  doubleOptional,
  doubleOptionalLatLng,
  nestedArrayOfObjectsOptional,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { FileType, Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterMainLandMark } from 'src/services/master/main/master_main_landmark_service';
import { MasterExpenseName } from 'src/services/master/expense/master_expense_name_service';
import { FleetIssue } from 'src/services/fleet/issue_management/issue_management_service';
import { MasterFleetBreakdownType } from 'src/services/master/fleet/master_fleet_breakdown_type_service';

const URL = 'fleet/breakdown_management/fleet_breakdown';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  breakdown_file_presigned_url: `${URL}/breakdown_file_presigned_url`,

  // File Uploads
  create_breakdown_file: `${URL}/create_breakdown_file`,
  remove_breakdown_file: (id: string): string => `${URL}/remove_breakdown_file/${id}`,

  // FleetBreakdown APIs
  find: `${URL}/fleet_breakdown/search`,
  create: `${URL}/fleet_breakdown`,
  update: (id: string): string => `${URL}/fleet_breakdown/${id}`,
  delete: (id: string): string => `${URL}/fleet_breakdown/${id}`,

  breakdown_dashboard: `${URL}/breakdown_dashboard`,

  // FleetBreakdownCost APIs
  find_cost: `${URL}/breakdown_cost/search`,
  create_cost: `${URL}/breakdown_cost`,
  update_cost: (id: string): string => `${URL}/breakdown_cost/${id}`,
  delete_cost: (id: string): string => `${URL}/breakdown_cost/${id}`,
};

// FleetBreakdown Interface
export interface FleetBreakdown extends Record<string, unknown> {
  // Primary Field
  breakdown_id: string;
  breakdown_sub_id: number;
  breakdown_code?: string;
  breakdown_total_cost?: number;

  // Breakdown Details
  breakdown_date: string;
  breakdown_date_f?: string;
  breakdown_resolved_date?: string;
  breakdown_resolved_date_f?: string;
  was_towed: YesNo;
  is_vehicle_operational: YesNo;
  roadside_assistance_required: YesNo;
  roadside_assistance_completed: YesNo;
  odometer_reading?: number;
  breakdown_description?: string;

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

  fleet_breakdown_type_id: string;
  MasterFleetBreakdownType?: MasterFleetBreakdownType;
  fleet_breakdown_type?: string;

  // Relations - Child
  // Child - Fleet
  FleetBreakdownFile?: FleetBreakdownFile[];
  FleetBreakdownCost?: FleetBreakdownCost[];
  FleetIssue?: FleetIssue[];

  // Relations - Child Count
  _count?: {
    FleetBreakdownFile?: number;
    FleetBreakdownCost?: number;
    FleetIssue?: number;
  };
}

// FleetBreakdownFile Interface
export interface FleetBreakdownFile extends BaseCommonFile {
  // Primary Field
  breakdown_file_id: string;

  // Usage Type -> Breakdown Images, Breakdown Videos, Breakdown Documents

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

  breakdown_id: string;
  FleetBreakdown?: FleetBreakdown;

  // Relations - Child Count
  _count?: {};
}

// FleetBreakdownCost Interface
export interface FleetBreakdownCost extends Record<string, unknown> {
  // Primary Field
  breakdown_cost_id: string;

  // Main Field Details
  breakdown_cost_date?: string;
  breakdown_cost_date_f?: string;
  breakdown_cost_amount?: number;
  breakdown_cost_description?: string;

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

  breakdown_id: string;
  FleetBreakdown?: FleetBreakdown;

  expense_name_id: string;
  MasterExpenseName?: MasterExpenseName;
  expense_name?: string;

  // Relations - Child Count
  _count?: {};
}

// BreakdownDashboard Interface
export interface BreakdownDashboard extends Record<string, unknown> {
  vehicle_id: string;
  vehicle_number: string;
  vehicle_type: string;
  breakdowns_count: number;

  // Relations - Child Count
  _count?: {};
}

// FleetBreakdownFile Schema
export const FleetBreakdownFileSchema = BaseFileSchema.extend({
  // Relations - Parent
  organisation_id: single_select_optional('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  breakdown_id: single_select_optional('FleetBreakdown'), // Single-Selection -> FleetBreakdown
});
export type FleetBreakdownFileDTO = z.infer<typeof FleetBreakdownFileSchema>;

// FleetBreakdown Create/Update Schema
export const FleetBreakdownSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  vehicle_id: single_select_mandatory('MasterVehicle'), // Single-Selection -> MasterVehicle
  driver_id: single_select_optional('MasterDriver'), // Single-Selection -> MasterDriver

  // Main Field Details
  fleet_breakdown_type_id: single_select_mandatory('MasterFleetBreakdownType'), // Single-Selection -> MasterFleetBreakdownType

  // Breakdown Details
  breakdown_date: dateMandatory('Breakdown Date'),
  breakdown_resolved_date: dateOptional('Breakdown Resolved Date'),
  was_towed: enumMandatory('Was Towed', YesNo, YesNo.No),
  is_vehicle_operational: enumMandatory('Is Vehicle Operational', YesNo, YesNo.No),
  roadside_assistance_required: enumMandatory('Roadside Assistance Required', YesNo, YesNo.No),
  roadside_assistance_completed: enumMandatory('Roadside Assistance Completed', YesNo, YesNo.No),
  odometer_reading: numberOptional('Odometer Reading'),
  breakdown_description: stringOptional('Breakdown Description', 0, 2000),

  // Location Details
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  google_location: stringOptional('Google Location', 0, 500),

  // Other
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),

  // Files
  FleetBreakdownFileSchema: nestedArrayOfObjectsOptional('FleetBreakdownFileSchema', FleetBreakdownFileSchema, []),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetBreakdownDTO = z.infer<typeof FleetBreakdownSchema>;

// FleetBreakdown Query Schema
export const FleetBreakdownQuerySchema = BaseQuerySchema.extend({
  // Self Table
  breakdown_ids: multi_select_optional('FleetBreakdown'), // Multi-Selection -> FleetBreakdown

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // Multi-Selection -> MasterDriver

  // Main Field Details
  fleet_breakdown_type_ids: multi_select_optional('MasterFleetBreakdownType'), // Multi-Selection -> MasterFleetBreakdownType

  was_towed: enumArrayOptional('Was Towed', YesNo, getAllEnums(YesNo)),
  is_vehicle_operational: enumArrayOptional('Is Vehicle Operational', YesNo, getAllEnums(YesNo)),
  roadside_assistance_required: enumArrayOptional('Roadside Assistance Required', YesNo, getAllEnums(YesNo)),
  roadside_assistance_completed: enumArrayOptional('Roadside Assistance Completed', YesNo, getAllEnums(YesNo)),

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetBreakdownQueryDTO = z.infer<typeof FleetBreakdownQuerySchema>;

// FleetBreakdownDashBoard Query Schema
export const FleetBreakdownDashBoardQuerySchema = BaseQuerySchema.extend({
  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetBreakdownDashBoardQueryDTO = z.infer<typeof FleetBreakdownDashBoardQuerySchema>;

// FleetBreakdownCost Create/Update Schema
export const FleetBreakdownCostSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  breakdown_id: single_select_mandatory('FleetBreakdown'), // Single-Selection -> FleetBreakdown
  expense_name_id: single_select_mandatory('MasterExpenseName'), // Single-Selection -> MasterExpenseName

  // Main Field Details
  breakdown_cost_date: dateOptional('Breakdown Cost Date'),
  breakdown_cost_amount: doubleOptional('Breakdown Cost Amount'),
  breakdown_cost_description: stringOptional('Breakdown Cost Description', 0, 2000),

  // Other
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetBreakdownCostDTO = z.infer<typeof FleetBreakdownCostSchema>;

// FleetBreakdownCost Query Schema
export const FleetBreakdownCostQuerySchema = BaseQuerySchema.extend({
  // Self Table
  breakdown_cost_ids: multi_select_optional('FleetBreakdownCost'), // Multi-Selection -> FleetBreakdownCost

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
  breakdown_ids: multi_select_optional('FleetBreakdown'), // Multi-Selection -> FleetBreakdown
  expense_name_ids: multi_select_optional('MasterExpenseName'), // Multi-Selection -> MasterExpenseName
});
export type FleetBreakdownCostQueryDTO = z.infer<typeof FleetBreakdownCostQuerySchema>;

// Convert FleetBreakdown Data to API Payload
export const toFleetBreakdownPayload = (row: FleetBreakdown): FleetBreakdownDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',
  vehicle_id: row.vehicle_id || '',
  driver_id: row.driver_id || '',

  fleet_breakdown_type_id: row.fleet_breakdown_type_id || '',

  breakdown_date: row.breakdown_date || '',
  breakdown_resolved_date: row.breakdown_resolved_date || '',
  was_towed: row.was_towed || YesNo.No,
  is_vehicle_operational: row.is_vehicle_operational || YesNo.No,
  roadside_assistance_required: row.roadside_assistance_required || YesNo.No,
  roadside_assistance_completed: row.roadside_assistance_completed || YesNo.No,
  odometer_reading: row.odometer_reading || 0,
  breakdown_description: row.breakdown_description || '',

  latitude: row.latitude || 0,
  longitude: row.longitude || 0,
  google_location: row.google_location || '',

  time_zone_id: '',

  FleetBreakdownFileSchema: row.FleetBreakdownFile?.map((file) => ({
    breakdown_file_id: file.breakdown_file_id || '',

    // Usage Type -> Breakdown Images, Breakdown Videos, Breakdown Documents
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
    breakdown_id: file.breakdown_id || '',
  })) || [],

  status: row.status || Status.Active,
});

// Create New FleetBreakdown Payload
export const newFleetBreakdownPayload = (): FleetBreakdownDTO => ({
  organisation_id: '',
  user_id: '',
  vehicle_id: '',
  driver_id: '',

  fleet_breakdown_type_id: '',

  breakdown_date: '',
  breakdown_resolved_date: '',
  was_towed: YesNo.No,
  is_vehicle_operational: YesNo.No,
  roadside_assistance_required: YesNo.No,
  roadside_assistance_completed: YesNo.No,
  odometer_reading: 0,
  breakdown_description: '',

  latitude: 0,
  longitude: 0,
  google_location: '',

  time_zone_id: '',

  FleetBreakdownFileSchema: [],

  status: Status.Active,
});

// Convert FleetBreakdownCost Data to API Payload
export const toFleetBreakdownCostPayload = (row: FleetBreakdownCost): FleetBreakdownCostDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',
  breakdown_id: row.breakdown_id || '',
  expense_name_id: row.expense_name_id || '',

  breakdown_cost_date: row.breakdown_cost_date || '',
  breakdown_cost_amount: row.breakdown_cost_amount || 0,
  breakdown_cost_description: row.breakdown_cost_description || '',

  time_zone_id: '',

  status: row.status || Status.Active,
});

// Create New FleetBreakdownCost Payload
export const newFleetBreakdownCostPayload = (): FleetBreakdownCostDTO => ({
  organisation_id: '',
  user_id: '',
  breakdown_id: '',
  expense_name_id: '',

  breakdown_cost_date: '',
  breakdown_cost_amount: 0,
  breakdown_cost_description: '',

  time_zone_id: '',

  status: Status.Active,
});

// AWS S3 PRESIGNED
export const get_breakdown_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.breakdown_file_presigned_url, data);
};

// File Uploads
export const create_breakdown_file = async (data: FleetBreakdownFileDTO): Promise<SBR> => {
  return apiPost<SBR, FleetBreakdownFileDTO>(ENDPOINTS.create_breakdown_file, data);
};

export const remove_breakdown_file = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_breakdown_file(id));
};

// FleetBreakdown APIs
export const findFleetBreakdown = async (data: FleetBreakdownQueryDTO): Promise<FBR<FleetBreakdown[]>> => {
  return apiPost<FBR<FleetBreakdown[]>, FleetBreakdownQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetBreakdown = async (data: FleetBreakdownDTO): Promise<SBR> => {
  return apiPost<SBR, FleetBreakdownDTO>(ENDPOINTS.create, data);
};

export const updateFleetBreakdown = async (id: string, data: FleetBreakdownDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetBreakdownDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetBreakdown = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const breakdown_dashboard = async (data: FleetBreakdownDashBoardQueryDTO): Promise<FBR<BreakdownDashboard[]>> => {
  return apiPost<FBR<BreakdownDashboard[]>, FleetBreakdownDashBoardQueryDTO>(ENDPOINTS.breakdown_dashboard, data);
};

// FleetBreakdownCost APIs
export const findFleetBreakdownCost = async (data: FleetBreakdownCostQueryDTO): Promise<FBR<FleetBreakdownCost[]>> => {
  return apiPost<FBR<FleetBreakdownCost[]>, FleetBreakdownCostQueryDTO>(ENDPOINTS.find_cost, data);
};

export const createFleetBreakdownCost = async (data: FleetBreakdownCostDTO): Promise<SBR> => {
  return apiPost<SBR, FleetBreakdownCostDTO>(ENDPOINTS.create_cost, data);
};

export const updateFleetBreakdownCost = async (id: string, data: FleetBreakdownCostDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetBreakdownCostDTO>(ENDPOINTS.update_cost(id), data);
};

export const deleteFleetBreakdownCost = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_cost(id));
};