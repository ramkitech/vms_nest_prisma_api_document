// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  single_select_optional,
  multi_select_optional,
  enumMandatory,
  enumArrayOptional,
  single_select_mandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { LoginFrom, Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterUserRole } from '../../../services/master/user/master_user_role_service';
import { MasterUserStatus } from '../../../services/master/user/master_user_status_service';
import { MasterMainLanguage } from '../../../services/master/main/master_main_language_service';
import { MasterMainDateFormat } from '../../../services/master/main/master_main_date_format_service';
import { MasterMainTimeZone } from '../../../services/master/main/master_main_timezone_service';
import { MasterVehicle } from '../vehicle/master_vehicle_service';

import { BookMark } from 'src/services/account/bookmark_service';
import { OrganisationNotificationPreferenceUserLink } from 'src/services/account/notification_preferences.service';
import { Ticket } from 'src/services/account/ticket_service';

import { FleetFuelDailySummary } from 'src/services/fleet/fuel_management/fleet_fuel_daily_summary_service';
import { FleetFuelRefill } from 'src/services/fleet/fuel_management/fleet_fuel_refill_service';
import { FleetFuelRemoval } from 'src/services/fleet/fuel_management/fleet_fuel_removal_service';
import { FleetIncidentManagement } from 'src/services/fleet/incident_management/incident_management_service';
import { FleetInspection } from 'src/services/fleet/inspection_management/fleet_inspection_management_service';
import { FleetInspectionSchedule } from 'src/services/fleet/inspection_management/fleet_inspection_schedule_service';
import { FleetIssueManagement } from 'src/services/fleet/issue_management/issue_management_service';
import { FleetServiceManagement } from 'src/services/fleet/service_management/fleet_service_management_service';
import { FleetServiceSchedule } from 'src/services/fleet/service_management/fleet_service_schedule_service';
import { FleetVendorDocument, FleetVendorReview } from 'src/services/fleet/vendor_management/fleet_vendor_service';

const URL = 'user/user';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  user_image_presigned_url: (fileName: string): string => `${URL}/user_image_presigned_url/${fileName}`,

  // File Uploads
  update_user_image: (id: string): string => `${URL}/update_user_image/${id}`,
  delete_user_image: (id: string): string => `${URL}/delete_user_image/${id}`,

  // User APIs
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  update_profile: (id: string): string => `${URL}/update_profile/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_simple: (organisation_id: string): string => `${URL}/cache_simple/${organisation_id}`,

  // Default Settings
  update_default_language: (id: string): string => `${URL}/default_language/${id}`,
  update_default_timezone: (id: string): string => `${URL}/default_timezone/${id}`,
  update_default_date_format: (id: string): string => `${URL}/default_date_format/${id}`,
};

// User Interface
export interface User extends Record<string, unknown> {
  // Primary Fields
  user_id: string;

  // Profile Image/Logo
  user_image_url?: string;
  user_image_key?: string;
  user_image_name?: string;

  // Main Field Details
  first_name: string;
  last_name?: string;
  email: string;
  username?: string;
  mobile?: string;
  password?: string;

  is_root_user: YesNo;
  can_login: YesNo;
  all_vehicles: YesNo;

  user_details?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;

  user_role_id?: string;
  MasterUserRole?: MasterUserRole;
  user_role?: string;

  user_status_id?: string;
  MasterUserStatus?: MasterUserStatus;
  user_status?: string;

  language_id?: string;
  MasterMainLanguage?: MasterMainLanguage;
  language_name?: string;
  language_code?: string;

  time_zone_id?: string;
  MasterMainTimeZone?: MasterMainTimeZone;
  time_zone_code?: string;
  time_zone_identifier?: string;

  date_format_id?: string;
  MasterMainDateFormat?: MasterMainDateFormat;
  date_format_date?: string;
  date_format_time?: string;

  // Relations - Child

  // Child - Fleet
  FleetVendorDocument?: FleetVendorDocument[]
  FleetVendorReview?: FleetVendorReview[]

  FleetFuelRefill?: FleetFuelRefill[]
  FleetFuelRemoval?: FleetFuelRemoval[]

  InspectionSchedule?: FleetInspectionSchedule[]
  InspectorUser?: FleetInspection[]
  ApprovedUser?: FleetInspection[]

  IncidentManagement?: FleetIncidentManagement[]

  IssueManagement?: FleetIssueManagement[]

  FleetServiceManagement?: FleetServiceManagement[]

  // FleetWorkshop?: FleetWorkshop[]

  // AssignedUser?: FleetServiceJobCard[]
  // RatingUser?: FleetServiceJobCard[]
  FleetServiceSchedule?: FleetServiceSchedule[]

  // FleetTripParty?: FleetTripParty[]
  // FleetTripPartyGroup?: FleetTripPartyGroup[]

  // FleetSparePartsUsage?: FleetSparePartsUsage[]
  // FleetSparePartsPurchaseOrders?: FleetSparePartsPurchaseOrders[]

  // FleetTyreInspectionSchedule?: FleetTyreInspectionSchedule[]
  // FleetTyreInspectionScheduleTracking?: FleetTyreInspectionScheduleTracking[]
  // FleetTyreInspection?: FleetTyreInspection[]

  // Child - GPS
  FleetFuelDailySummary?: FleetFuelDailySummary[]

  // GpsLockRelayLog?: GPSLockRelayLog[]
  // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[]

  // Child - Account
  Ticket?: Ticket[]
  BookMark?: BookMark[]
  // FasttagDetails?: FasttagDetails[]
  // EWayBillDetails?: EWayBillDetails[]
  UserLoginPush?: UserLoginPush[]
  UserVehicleLink?: UserVehicleLink[]
  OrganisationNotificationPreferenceUserLink?: OrganisationNotificationPreferenceUserLink[]

  // Relations - Child Count
  _count?: {
    // Child - Fleet
    FleetVendorDocument?: number;
    FleetVendorReview?: number;

    FleetFuelRefill?: number;
    FleetFuelRemoval?: number;

    InspectionSchedule?: number;
    InspectorUser?: number;
    ApprovedUser?: number;

    IncidentManagement?: number;

    IssueManagement?: number;

    FleetServiceManagement?: number;

    // FleetWorkshop?: FleetWorkshop[]

    // AssignedUser?: FleetServiceJobCard[]
    // RatingUser?: FleetServiceJobCard[]
    FleetServiceSchedule?: number;

    // FleetTripParty?: FleetTripParty[]
    // FleetTripPartyGroup?: FleetTripPartyGroup[]

    // FleetSparePartsUsage?: FleetSparePartsUsage[]
    // FleetSparePartsPurchaseOrders?: FleetSparePartsPurchaseOrders[]

    // FleetTyreInspectionSchedule?: FleetTyreInspectionSchedule[]
    // FleetTyreInspectionScheduleTracking?: FleetTyreInspectionScheduleTracking[]
    // FleetTyreInspection?: FleetTyreInspection[]

    // Child - GPS
    FleetFuelDailySummary?: number;

    // GpsLockRelayLog?: GPSLockRelayLog[]
    // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[]

    // Child - Account
    Ticket?: number;
    BookMark?: number;
    // FasttagDetails?: FasttagDetails[]
    // EWayBillDetails?: EWayBillDetails[]
    UserLoginPush?: number;
    UserVehicleLink?: number;
    OrganisationNotificationPreferenceUserLink?: number;
  };
}

// UserVehicleLink Interface
export interface UserVehicleLink extends Record<string, unknown> {
  // Primary Fields
  user_vehicle_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  user_id: string;
  User?: User;
  User_details?: string;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
}

// UserLoginPush Interface
export interface UserLoginPush extends Record<string, unknown> {
  // Primary Fields
  user_login_push_id: string;

  // Main Field Details
  fcm_token: string;

  platform: LoginFrom;
  user_agent?: string;
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
  organisation_name?: string;

  user_id: string;
  User?: User;
  User_details?: string;
}

// User Create/Update Schema
export const UserSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_role_id: single_select_optional('MasterUserRole'), // Single-Selection -> MasterUserRole
  user_status_id: single_select_optional('MasterUserStatus'), // Single-Selection -> MasterUserStatus
  language_id: single_select_optional('MasterMainLanguage'), // Single-Selection -> MasterMainLanguage
  time_zone_id: single_select_optional('MasterMainTimeZone'), // Single-Selection -> MasterMainTimeZone
  date_format_id: single_select_optional('MasterMainDateFormat'), // Single-Selection -> MasterMainDateFormat

  // Profile Image/Logo
  user_image_url: stringOptional('User Image URL', 0, 300),
  user_image_key: stringOptional('User Image Key', 0, 300),
  user_image_name: stringOptional('User Image Name', 0, 300),

  // Main Field Details
  first_name: stringMandatory('First Name', 2, 100),
  last_name: stringOptional('Last Name', 0, 100),
  email: stringMandatory('Email', 3, 100),
  username: stringOptional('Username', 0, 100),
  mobile: stringOptional('Mobile', 0, 15),
  password: stringOptional('Password', 0, 20),

  can_login: enumMandatory('Can Login', YesNo, YesNo.Yes),
  is_root_user: enumMandatory('Is Root User', YesNo, YesNo.No),
  all_vehicles: enumMandatory('All Vehicles', YesNo, YesNo.No),
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi selection -> MasterVehicle

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type UserDTO = z.infer<typeof UserSchema>;

// User Query Schema
export const UserQuerySchema = BaseQuerySchema.extend({
  // Self Table
  user_ids: multi_select_optional('User'), // Multi-Selection -> User

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_role_ids: multi_select_optional('MasterUserRole'), // Multi-Selection -> MasterUserRole
  user_status_ids: multi_select_optional('MasterUserStatus'), // Multi-Selection -> MasterUserStatus
  language_ids: multi_select_optional('MasterMainLanguage'), // Multi-Selection -> MasterMainLanguage
  time_zone_ids: multi_select_optional('MasterMainTimeZone'), // Multi-Selection -> MasterMainTimeZone
  date_format_ids: multi_select_optional('MasterMainDateFormat'), // Multi-Selection -> MasterMainDateFormat

  // Enums
  can_login: enumArrayOptional('Can Login', YesNo),
  is_root_user: enumArrayOptional('Is Root User', YesNo),
  all_vehicles: enumArrayOptional('All Vehicles', YesNo),
});
export type UserQueryDTO = z.infer<typeof UserQuerySchema>;

// User Logo Schema
export const UserLogoSchema = z.object({
  // Profile Image/Logo
  user_image_url: stringMandatory('User Image URL', 0, 300),
  user_image_key: stringMandatory('User Image Key', 0, 300),
  user_image_name: stringMandatory('User Image Name', 0, 300),
});
export type UserLogoDTO = z.infer<typeof UserLogoSchema>;

// User Update Profile Schema
export const UserProfileSchema = z.object({
  // Profile Image/Logo
  user_image_url: stringOptional('User Image URL', 0, 300),
  user_image_key: stringOptional('User Image Key', 0, 300),
  user_image_name: stringOptional('User Image Name', 0, 300),

  // Main Field Details
  first_name: stringMandatory('First Name', 2, 100),
  last_name: stringOptional('Last Name', 0, 100),
  email: stringMandatory('Email', 3, 100),
  username: stringOptional('Username', 0, 100),
  mobile: stringOptional('Mobile', 0, 15),
});
export type UserProfileDTO = z.infer<typeof UserProfileSchema>;

// Update UserDefaultLanguageSchema
export const UserDefaultLanguageSchema = z.object({
  language_id: single_select_optional('MasterMainLanguage'), // Single-Selection -> MasterMainLanguage
});
export type UserDefaultLanguageDTO = z.infer<typeof UserDefaultLanguageSchema>;

// Update UserDefaultTimeZoneSchema
export const UserDefaultTimeZoneSchema = z.object({
  time_zone_id: single_select_optional('MasterMainTimeZone'), // Single-Selection -> MasterMainTimeZone
});
export type UserDefaultTimeZoneDTO = z.infer<typeof UserDefaultTimeZoneSchema>;

// Update UserDefaultDateFormatSchema
export const UserDefaultDateFormatSchema = z.object({
  date_format_id: single_select_optional('MasterMainDateFormat'), // Single-Selection -> MasterMainDateFormat
});
export type UserDefaultDateFormatDTO = z.infer<
  typeof UserDefaultDateFormatSchema
>;

// Convert User Data to API Payload
export const toUserPayload = (row: User): UserDTO => ({
  first_name: row.first_name || '',
  last_name: row.last_name || '',
  email: row.email || '',
  mobile: row.mobile || '',
  username: row.username || '',
  password: row.password || '',

  is_root_user: row.is_root_user || YesNo.Yes,
  can_login: row.can_login || YesNo.Yes,
  all_vehicles: row.all_vehicles || YesNo.Yes,

  user_image_url: row.user_image_url || '',
  user_image_key: row.user_image_key || '',
  user_image_name: row.user_image_name || '',

  organisation_id: row.organisation_id || '',
  user_role_id: row.user_role_id || '',
  user_status_id: row.user_status_id || '',
  language_id: row.language_id || '',
  date_format_id: row.date_format_id || '',
  time_zone_id: row.time_zone_id || '',

  status: row.status || Status.Active,

  vehicle_ids:
    row.UserVehicleLink?.map((v) => v.vehicle_id) || [],
});

// Convert UserProfile Data to API Payload
export const toUserProfilePayload = (data: User): UserProfileDTO => ({
  first_name: data.first_name || '',
  last_name: data.last_name || '',
  email: data.email || '',
  mobile: data.mobile || '',
  username: data.username || '',

  user_image_url: data.user_image_url || '',
  user_image_key: data.user_image_key || '',
  user_image_name: data.user_image_name || '',
});

// Create New User Payload
export const newUserPayload = (): UserDTO => ({
  first_name: '',
  last_name: '',
  email: '',
  username: '',
  mobile: '',
  password: '',

  can_login: YesNo.Yes,
  is_root_user: YesNo.Yes,
  all_vehicles: YesNo.Yes,
  vehicle_ids: [],

  user_image_url: '',
  user_image_key: '',
  user_image_name: '',

  organisation_id: '',
  user_role_id: '',
  user_status_id: '',
  language_id: '',
  time_zone_id: '',
  date_format_id: '',

  status: Status.Active
});

// AWS S3 PRESIGNED
export const get_user_image_presigned_url = async (fileName: string): Promise<BR<AWSPresignedUrl>> => {
  return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.user_image_presigned_url(fileName));
};

// File Uploads
export const update_user_image = async (id: string, data: UserLogoDTO): Promise<SBR> => {
  return apiPatch<SBR, UserLogoDTO>(ENDPOINTS.update_user_image(id), data);
};

export const delete_user_image = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_user_image(id));
};

// User APIs
export const findUser = async (data: UserQueryDTO): Promise<FBR<User[]>> => {
  return apiPost<FBR<User[]>, UserQueryDTO>(ENDPOINTS.find, data);
};

export const createUser = async (data: UserDTO): Promise<SBR> => {
  return apiPost<SBR, UserDTO>(ENDPOINTS.create, data);
};

export const updateUser = async (id: string, data: UserDTO): Promise<SBR> => {
  return apiPatch<SBR, UserDTO>(ENDPOINTS.update(id), data);
};

export const deleteUser = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const updateUserProfile = async (id: string, data: UserProfileDTO): Promise<SBR> => {
  return apiPatch<SBR, UserProfileDTO>(ENDPOINTS.update_profile(id), data);
};

// Cache APIs
export const getUserCache = async (organisation_id: string): Promise<FBR<User[]>> => {
  return apiGet<FBR<User[]>>(ENDPOINTS.cache(organisation_id));
};

export const getUserCacheSimple = async (organisation_id: string): Promise<FBR<User[]>> => {
  return apiGet<FBR<User[]>>(ENDPOINTS.cache_simple(organisation_id));
};

// Update Default Language
export const updateUserDefaultLanguage = async (id: string, data: UserDefaultLanguageDTO): Promise<SBR> => {
  return apiPatch<SBR, UserDefaultLanguageDTO>(ENDPOINTS.update_default_language(id), data);
};

export const updateUserDefaultTimezone = async (id: string, data: UserDefaultTimeZoneDTO): Promise<SBR> => {
  return apiPatch<SBR, UserDefaultTimeZoneDTO>(ENDPOINTS.update_default_timezone(id), data);
};

export const updateUserDefaultDateformat = async (id: string, data: UserDefaultDateFormatDTO): Promise<SBR> => {
  return apiPatch<SBR, UserDefaultDateFormatDTO>(ENDPOINTS.update_default_date_format(id), data);
};
