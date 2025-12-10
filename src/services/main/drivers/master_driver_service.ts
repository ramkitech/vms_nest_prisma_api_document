// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BaseCommonFile, BR, AWSPresignedUrl } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumArrayOptional,
  single_select_optional,
  getAllEnums,
  nestedArrayOfObjectsOptional,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo, DriverType, LoginFrom } from '../../../core/Enums';

// Other Models
import { MasterVehicle } from '../../../services/main/vehicle/master_vehicle_service';
import { OrganisationSubCompany } from 'src/services/master/organisation/organisation_sub_company_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';
import { OrganisationColor } from 'src/services/master/organisation/organisation_color_service';
import { OrganisationTag } from 'src/services/master/organisation/organisation_tag_service';
import { UserOrganisation } from '../users/user_organisation_service';

import { FleetFuelDailySummary } from 'src/services/fleet/fuel_management/fleet_fuel_daily_summary_service';
import { FleetFuelRefill } from 'src/services/fleet/fuel_management/fleet_fuel_refill_service';
import { FleetFuelRemoval } from 'src/services/fleet/fuel_management/fleet_fuel_removal_service';
import { FleetIncidentManagement } from 'src/services/fleet/incident_management/incident_management_service';
import { FleetInspection } from 'src/services/fleet/inspection_management/fleet_inspection_management_service';
import { FleetIssueManagement } from 'src/services/fleet/issue_management/issue_management_service';
import { FleetServiceManagement } from 'src/services/fleet/service_management/fleet_service_management_service';

import { GPSGeofenceTransaction } from 'src/services/gps/features/geofence/gps_geofence_transaction_service';
import { GPSGeofenceTransactionSummary } from 'src/services/gps/features/geofence/gps_geofence_transaction_summary_service';
import { TripGeofenceToGeofence } from 'src/services/gps/features/geofence/trip_geofence_to_geofence_service';

const URL = 'main/master_driver';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  presigned_url: (fileName: string): string => `${URL}/presigned_url/${fileName}`,
  presigned_url_file: `${URL}/presigned_url`,

  // File Uploads
  create_file: `${URL}/create_file`,
  remove_file: (id: string): string => `${URL}/remove_file/${id}`,

  // MasterDriver APIs
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  update_logo: (id: string): string => `${URL}/update_logo/${id}`,
  delete_logo: (id: string): string => `${URL}/delete_logo/${id}`,
  update_profile: (id: string): string => `${URL}/update_profile/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_simple: (organisation_id: string): string => `${URL}/cache_simple/${organisation_id}`,
};

// MasterDriver Interface
export interface MasterDriver extends Record<string, unknown> {
  // Primary Fields
  driver_id: string;
  driver_code?: string;
  driver_first_name: string;
  driver_last_name?: string;
  driver_mobile?: string;
  driver_email?: string;
  driver_license?: string;
  driver_pan?: string;
  driver_aadhaar?: string;

  driver_details?: string;

  password?: string;
  can_login: YesNo;
  driver_type: DriverType;

  // Image Fields
  driver_image_url?: string;
  driver_image_key?: string;
  driver_image_name?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Vehicle
  is_vehicle_assigned: YesNo;
  vehicle_id?: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
  assign_vehicle_date?: string;
  assign_vehicle_date_f?: string;
  AssignRemoveDriverHistory?: AssignRemoveDriverHistory[];

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  organisation_sub_company_id?: string;
  OrganisationSubCompany?: OrganisationSubCompany;
  sub_company_name?: string;

  organisation_branch_id?: string;
  OrganisationBranch?: OrganisationBranch;
  branch_name?: string;
  branch_code?: string;

  organisation_color_id?: string;
  OrganisationColor?: OrganisationColor;
  color_name?: string;
  color_code?: string;

  organisation_tag_id?: string;
  OrganisationTag?: OrganisationTag;
  tag_name?: string;

  // Relations - Child
  DriverLoginPush?: DriverLoginPush[]
  MasterDriverFile?: MasterDriverFile[]
  // Child - Fleet
  FleetFuelRefill?: FleetFuelRefill[]
  FleetFuelRemoval?: FleetFuelRemoval[]

  TripGeofenceToGeofence?: TripGeofenceToGeofence[]
  GPSGeofenceTransaction?: GPSGeofenceTransaction[]
  FleetFuelDailySummary?: FleetFuelDailySummary[]

  // GPSLockRelayLog?: GPSLockRelayLog[]
  // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[]
  GPSGeofenceTransactionSummary?: GPSGeofenceTransactionSummary[]

  Inspection?: FleetInspection[]

  IncidentManagement?: FleetIncidentManagement[]

  IssueManagement?: FleetIssueManagement[]

  FleetServiceManagement?: FleetServiceManagement[]

  // FleetServiceJobCard?: FleetServiceJobCard[]

  // FleetTyreDamageRepair?: FleetTyreDamageRepair[]

  // FleetTyreRotation?: FleetTyreRotation[]

  // // Relations - Child Count
  _count?: {
    AssignRemoveDriverHistory?: number;

    DriverLoginPush?: number;
    MasterDriverFile?: number;

    FleetFuelRefill?: number;
    FleetFuelRemoval?: number;

    TripGeofenceToGeofence?: number;
    GPSGeofenceTransaction?: number;
    FleetFuelDailySummary?: number;

    GPSGeofenceTransactionSummary?: number;
    Inspection?: number;
    IncidentManagement?: number;

    IssueManagement?: number;
    FleetServiceManagement?: number;
  };
}

// TicketFile Interface
export interface MasterDriverFile extends BaseCommonFile {
  // Primary Fields
  driver_file_id: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  driver_id: string;
  MasterDriver?: MasterDriver;
}

// AssignRemoveDriverHistory Interface
export interface AssignRemoveDriverHistory extends Record<string, unknown> {
  // Primary Fields
  history_id: string;
  assign_date?: string;
  assign_date_f?: string;
  remove_date?: string;
  remove_date_f?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  vehicle_id: string;
  Vehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  driver_id: string;
  MasterDriver?: MasterDriver;
  driver_details?: string;
}

// DriverLoginPush Interface
export interface DriverLoginPush extends Record<string, unknown> {
  driver_login_push_id: string;

  fcm_token: string;

  platform: LoginFrom;
  MasterDriver_agent?: string;
  ip_address?: string;

  device_id?: string;
  device_model?: string;
  os_name?: string;
  os_version?: string;
  browser_name?: string;
  browser_version?: string;
  app_version?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  driver_id: string;
  MasterDriver?: MasterDriver;
  driver_details?: string;
}

// ✅ MasterDriver File Schema
export const MasterDriverFileSchema = BaseFileSchema.extend({
  organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  driver_id: single_select_optional('MasterDriver'), // ✅ Single-Selection -> MasterDriver
});
export type MasterDriverFileDTO = z.infer<typeof MasterDriverFileSchema>;

// ✅ MasterDriver Create/Update Schema
export const MasterDriverSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  organisation_sub_company_id: single_select_optional('OrganisationSubCompany'), // ✅ Single-Selection -> OrganisationSubCompany
  organisation_branch_id: single_select_optional('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch
  organisation_color_id: single_select_optional('OrganisationColor'), // ✅ Single-Selection -> OrganisationColor
  organisation_tag_id: single_select_optional('OrganisationTag'), // ✅ Single-Selection -> OrganisationTag

  driver_code: stringOptional('Driver Code', 0, 50),
  driver_first_name: stringMandatory('Driver First Name', 3, 100),
  driver_last_name: stringOptional('Driver Last Name', 0, 100),
  driver_mobile: stringOptional('Driver Mobile', 0, 20),
  driver_email: stringOptional('Driver Email', 0, 100),
  driver_license: stringOptional('Driver License', 0, 20),
  driver_pan: stringOptional('Driver PAN', 0, 10),
  driver_aadhaar: stringOptional('Driver Aadhaar', 0, 12),

  password: stringOptional('Password', 0, 20),
  can_login: enumMandatory('Can Login', YesNo, YesNo.No),
  driver_type: enumMandatory('Driver Type', DriverType, DriverType.Driver),

  driver_image_url: stringOptional('Driver Image URL', 0, 300),
  driver_image_key: stringOptional('Driver Image Key', 0, 300),
  driver_image_name: stringOptional('Driver Image Name', 0, 300),

  status: enumMandatory('Status', Status, Status.Active),

  MasterDriverFileSchema: nestedArrayOfObjectsOptional(
    'MasterDriverFileSchema',
    MasterDriverFileSchema,
    [],
  ),
});
export type MasterDriverDTO = z.infer<typeof MasterDriverSchema>;

// ✅ MasterDriver Query Schema
export const MasterDriverQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  organisation_sub_company_ids: multi_select_optional('OrganisationSubCompany'), // ✅ Multi-Selection -> OrganisationSubCompany
  organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-Selection -> OrganisationBranch
  organisation_color_ids: multi_select_optional('OrganisationColor'), // ✅ Multi-Selection -> OrganisationColor
  organisation_tag_ids: multi_select_optional('OrganisationTag'), // ✅ Multi-Selection -> OrganisationTag
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-Selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-Selection -> MasterDriver
  can_login: enumArrayOptional('Can Login', YesNo, getAllEnums(YesNo)),
  driver_type: enumArrayOptional(
    'Driver Type',
    DriverType,
    getAllEnums(DriverType),
  ),
  is_vehicle_assigned: enumArrayOptional(
    'Iss Vehicle Assigned',
    YesNo,
    getAllEnums(YesNo),
  ),
});
export type MasterDriverQueryDTO = z.infer<typeof MasterDriverQuerySchema>;

// ✅ MasterDriver Logo Schema
export const MasterDriverLogoSchema = z.object({
  driver_image_url: stringMandatory('Driver Image URL', 0, 300),
  driver_image_key: stringMandatory('Driver Image Key', 0, 300),
  driver_image_name: stringMandatory('Driver Image Name', 0, 300),
});
export type MasterDriverLogoDTO = z.infer<typeof MasterDriverLogoSchema>;

// ✅ MasterDriver Update Profile Schema
export const MasterDriverProfileSchema = z.object({
  driver_code: stringOptional('Driver Code', 0, 50),
  driver_first_name: stringMandatory('Driver First Name', 3, 100),
  driver_last_name: stringOptional('Driver Last Name', 0, 100),
  driver_mobile: stringOptional('Driver Mobile', 0, 20),
  driver_email: stringOptional('Driver Email', 0, 100),
  driver_license: stringOptional('Driver License', 0, 20),
  driver_pan: stringOptional('Driver PAN', 0, 10),
  driver_aadhaar: stringOptional('Driver Aadhaar', 0, 12),

  driver_image_url: stringOptional('Driver Image URL', 0, 300),
  driver_image_key: stringOptional('Driver Image Key', 0, 300),
  driver_image_name: stringOptional('Driver Image Name', 0, 300),

  MasterDriverFileSchema: nestedArrayOfObjectsOptional(
    'MasterDriverFileSchema',
    MasterDriverFileSchema,
    [],
  ),
});
export type MasterDriverProfileDTO = z.infer<typeof MasterDriverProfileSchema>;

// Convert MasterDriver Data to API Payload
export const toDriverPayload = (row: MasterDriver): MasterDriverDTO => ({
  driver_code: row.driver_code || '',
  driver_first_name: row.driver_first_name || '',
  driver_last_name: row.driver_last_name || '',
  driver_mobile: row.driver_mobile || '',
  driver_email: row.driver_email || '',
  driver_license: row.driver_license || '',
  driver_pan: row.driver_pan || '',
  driver_aadhaar: row.driver_aadhaar || '',

  password: row.password || '',
  can_login: row.can_login || YesNo.No,
  driver_type: row.driver_type || DriverType.Driver,

  driver_image_url: row.driver_image_url || '',
  driver_image_key: row.driver_image_key || '',
  driver_image_name: row.driver_image_name || '',

  status: row?.status || Status.Active,

  organisation_id: row.organisation_id || '',
  organisation_sub_company_id: row.organisation_sub_company_id || '',
  organisation_branch_id: row.organisation_branch_id || '',
  organisation_color_id: row.organisation_color_id || '',
  organisation_tag_id: row.organisation_tag_id || '',

  MasterDriverFileSchema: [],
  // MasterDriverFileSchema: row.MasterDriverFile?.map((file) => ({
  //   driver_file_id: file.driver_file_id || '',
  //   organisation_id: file.organisation_id || '',
  //   driver_id: file.driver_id || '',

  //   usage_type: file.usage_type,

  //   file_type: file.file_type,
  //   file_url: file.file_url || '',
  //   file_key: file.file_key || '',
  //   file_name: file.file_name || '',
  //   file_description: file.file_description || '',
  //   file_size: file.file_size || 0,
  //   file_metadata: file.file_metadata || {},
  //   status: file.status || Status.Active,
  // })) || [],
});

// Convert MasterDriverProfile Data to API Payload
export const toDriverProfilePayload = (row: MasterDriver): MasterDriverProfileDTO => ({
  driver_code: row.driver_code || '',
  driver_first_name: row.driver_first_name || '',
  driver_last_name: row.driver_last_name || '',
  driver_mobile: row.driver_mobile || '',
  driver_email: row.driver_email || '',
  driver_license: row.driver_license || '',
  driver_pan: row.driver_pan || '',
  driver_aadhaar: row.driver_aadhaar || '',

  driver_image_url: row.driver_image_url || '',
  driver_image_key: row.driver_image_key || '',
  driver_image_name: row.driver_image_name || '',

  MasterDriverFileSchema: row.MasterDriverFile?.map((file) => ({
    driver_file_id: file.driver_file_id || '',

    usage_type: file.usage_type,

    file_type: file.file_type,
    file_url: file.file_url || '',
    file_key: file.file_key || '',
    file_name: file.file_name || '',
    file_description: file.file_description || '',
    file_size: file.file_size || 0,
    file_metadata: file.file_metadata || {},

    status: file.status,
    added_date_time: file.added_date_time,
    modified_date_time: file.modified_date_time,

    organisation_id: file.organisation_id ?? '',
    driver_id: file.driver_id ?? '',
  })) ?? []
});

// Create New MasterDriver Payload
export const newDriverPayload = (): MasterDriverDTO => ({
  driver_code: '',
  driver_first_name: '',
  driver_last_name: '',
  driver_mobile: '',
  driver_email: '',
  driver_license: '',
  driver_pan: '',
  driver_aadhaar: '',

  password: '',
  can_login: YesNo.No,
  driver_type: DriverType.Driver,

  driver_image_url: '',
  driver_image_key: '',
  driver_image_name: '',

  status: Status.Active,
  organisation_id: '',
  organisation_sub_company_id: '',
  organisation_branch_id: '',
  organisation_color_id: '',
  organisation_tag_id: '',

  MasterDriverFileSchema: [],
});

// AWS S3 PRESIGNED
export const get_master_driver_presigned_url = async (fileName: string): Promise<BR<AWSPresignedUrl>> => {
  return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.presigned_url(fileName));
};

export const get_master_driver_presigned_url_file = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.presigned_url_file, data);
};

// File Uploads
export const create_file = async (data: MasterDriverFileDTO): Promise<SBR> => {
  return apiPost<SBR, MasterDriverFileDTO>(ENDPOINTS.create_file, data);
};

export const remove_file = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_file(id));
};

// AMasterDriver APIs
export const findMasterDriver = async (data: MasterDriverQueryDTO): Promise<FBR<MasterDriver[]>> => {
  return apiPost<FBR<MasterDriver[]>, MasterDriverQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterDriver = async (data: MasterDriverDTO): Promise<SBR> => {
  return apiPost<SBR, MasterDriverDTO>(ENDPOINTS.create, data);
};

export const updateMasterDriver = async (id: string, data: MasterDriverDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterDriverDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterDriver = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const updateMasterDriverLogo = async (id: string, data: MasterDriverLogoDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterDriverLogoDTO>(ENDPOINTS.update_logo(id), data);
};

export const deleteMasterDriverLogo = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_logo(id));
};

export const updateMasterDriverProfile = async (id: string, data: MasterDriverProfileDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterDriverProfileDTO>(ENDPOINTS.update_profile(id), data);
};

// Cache APIs
export const getMasterDriverCache = async (organisation_id: string): Promise<FBR<MasterDriver[]>> => {
  return apiGet<FBR<MasterDriver[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterDriverCacheSimple = async (organisation_id: string): Promise<FBR<MasterDriver[]>> => {
  return apiGet<FBR<MasterDriver[]>>(ENDPOINTS.cache_simple(organisation_id));
};