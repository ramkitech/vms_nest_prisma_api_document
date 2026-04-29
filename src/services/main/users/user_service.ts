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
import { MasterVehicle, MasterVehicleFile } from '../vehicle/master_vehicle_service';

import { OrganisationNotificationPreferenceUserLink } from 'src/services/account/notification_preferences.service';
import { Ticket, TicketFile } from 'src/services/account/ticket_service';

import { FleetFuelDailySummary } from 'src/services/fleet/fuel_management/fleet_fuel_daily_summary_service';
import { FleetFuelRefill, FleetFuelRefillFile } from 'src/services/fleet/fuel_management/fleet_fuel_refill_service';
import { FleetFuelRemoval, FleetFuelRemovalFile } from 'src/services/fleet/fuel_management/fleet_fuel_removal_service';
import { FleetInspection, FleetInspectionFile } from 'src/services/fleet/inspection_management/fleet_inspection_management_service';
import { FleetInspectionSchedule } from 'src/services/fleet/inspection_management/fleet_inspection_schedule_service';
import { FleetService, FleetServiceFile } from 'src/services/fleet/service_management/fleet_service_service';
import { FleetServiceSchedule } from 'src/services/fleet/service_management/fleet_service_schedule_service';
import { FleetVendor, FleetVendorAddress, FleetVendorBankAccount, FleetVendorContactPerson, FleetVendorDocument, FleetVendorDocumentFile, FleetVendorReview } from 'src/services/fleet/vendor_management/fleet_vendor_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';
import { FleetIncident, FleetIncidentCost, FleetIncidentFile } from 'src/services/fleet/incident_management/incident_management_service';
import { FleetIssue, FleetIssueComment, FleetIssueFile } from 'src/services/fleet/issue_management/issue_management_service';
import { MasterDriver, MasterDriverFile } from '../drivers/master_driver_service';
import { Invoice, InvoiceFile } from 'src/services/account/invoice_service';
import { FleetBreakdown, FleetBreakdownCost, FleetBreakdownFile } from 'src/services/fleet/breakdown_management/breakdown_management_service';
import { FleetDocument, FleetDocumentFile } from 'src/services/fleet/document_management/document_management_service';
import { FleetInspectionForm } from 'src/services/fleet/inspection_management/fleet_inspection_form_service';
import { FleetVendorFuelStation } from 'src/services/fleet/vendor_management/fleet_vendor_fuel_station';
import { FleetVendorServiceCenter } from 'src/services/fleet/vendor_management/fleet_vendor_service_center';
import { FleetWorkshop } from 'src/services/fleet/workshop_management/fleet_workshop_service';
import { MasterDevice, MasterDeviceFile } from '../devices/master_device_service';

const URL = 'user/user';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  get_user_image_presigned_url: (fileName: string): string => `${URL}/get_user_image_presigned_url/${fileName}`,

  // File Uploads
  update_user_image: (id: string): string => `${URL}/update_user_image/${id}`,
  remove_user_image: (id: string): string => `${URL}/remove_user_image/${id}`,

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
  username?: string;
  email: string;
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
  organisation_code?: string;
  organisation_logo_url?: string;

  organisation_branch_id?: string;
  OrganisationBranch?: OrganisationBranch;
  branch_name?: string;
  branch_city?: string;

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

  // Child - Main
  MasterVehicle?: MasterVehicle[];
  MasterVehicleFile?: MasterVehicleFile[];
  MasterDriver?: MasterDriver[];
  MasterDriverFile?: MasterDriverFile[];
  MasterDevice?: MasterDevice[];
  MasterDeviceFile?: MasterDeviceFile[];

  // Child - Account
  Invoice?: Invoice[];
  InvoiceFile?: InvoiceFile[];
  Ticket?: Ticket[];
  TicketFile?: TicketFile[];
  // FasttagDetails?: FasttagDetails[];
  // EWayBillDetails?: EWayBillDetails[];
  UserLoginPush?: UserLoginPush[];
  UserVehicleLink?: UserVehicleLink[];
  OrganisationNotificationPreferenceUserLink?: OrganisationNotificationPreferenceUserLink[];

  // Child - Fleet Vendor
  FleetVendor?: FleetVendor[];
  FleetVendorAddress?: FleetVendorAddress[];
  FleetVendorBankAccount?: FleetVendorBankAccount[];
  FleetVendorContactPerson?: FleetVendorContactPerson[];
  FleetVendorReview?: FleetVendorReview[];
  FleetVendorDocument?: FleetVendorDocument[];
  FleetVendorDocumentFile?: FleetVendorDocumentFile[];
  FleetVendorServiceCenter?: FleetVendorServiceCenter[];
  FleetVendorFuelStation?: FleetVendorFuelStation[];

  // Child - Fleet Document
  FleetDocument?: FleetDocument[];
  FleetDocumentFile?: FleetDocumentFile[];

  // Child - Fleet Fuel
  FleetFuelRefill?: FleetFuelRefill[];
  FleetFuelRemoval?: FleetFuelRemoval[];
  FleetFuelRefillFile?: FleetFuelRefillFile[];
  FleetFuelRemovalFile?: FleetFuelRemovalFile[];

  // Child - Fleet Issue
  FleetIssue?: FleetIssue[];
  FleetIssueComment?: FleetIssueComment[];
  FleetIssueFile?: FleetIssueFile[];

  // Child - Fleet Service
  FleetServiceSchedule?: FleetServiceSchedule[];
  FleetService?: FleetService[];
  AssignedUser?: FleetService[];
  FleetServiceFile?: FleetServiceFile[];

  // Child - Fleet Inspection
  FleetInspectionForm?: FleetInspectionForm[];
  FleetInspectionSchedule?: FleetInspectionSchedule[];
  FleetInspection?: FleetInspection[];
  FleetInspectionFile?: FleetInspectionFile[];

  // Child - Fleet Breakdown
  FleetBreakdown?: FleetBreakdown[];
  FleetBreakdownCost?: FleetBreakdownCost[];
  FleetBreakdownFile?: FleetBreakdownFile[];

  // Child - Fleet Incident
  FleetIncident?: FleetIncident[];
  FleetIncidentCost?: FleetIncidentCost[];
  FleetIncidentFile?: FleetIncidentFile[];

  // Child - Fleet Workshop
  FleetWorkshop?: FleetWorkshop[];

  // Child - Fleet Trip
  // FleetTripParty?: FleetTripParty[];
  // FleetTripPartyGroup?: FleetTripPartyGroup[];

  // Child - Fleet Spare Parts
  // FleetSparePartsUsage?: FleetSparePartsUsage[];
  // FleetSparePartsPurchaseOrders?: FleetSparePartsPurchaseOrders[];

  // Child - Fleet Tyre
  // FleetTyreInventory?: FleetTyreInventory[];
  // FleetTyreRetreading?: FleetTyreRetreading[];
  // RetreadingAssignedUser?: FleetTyreRetreading[];
  // FleetTyreDamageRepair?: FleetTyreDamageRepair[];
  // DamageRepairAssignedUser?: FleetTyreDamageRepair[];
  // FleetTyreInspectionSchedule?: FleetTyreInspectionSchedule[];
  // FleetTyreInspection?: FleetTyreInspection[];
  // FleetTyreInspectionFile?: FleetTyreInspectionFile[];

  // Child - GPS
  FleetFuelDailySummary?: FleetFuelDailySummary[];
  // GpsLockRelayLog?: GPSLockRelayLog[];
  // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[];

  // _count
  _count?: {
    MasterVehicle?: number;
    MasterVehicleFile?: number;
    MasterDriver?: number;
    MasterDriverFile?: number;
    MasterDevice?: number;
    MasterDeviceFile?: number;

    Invoice?: number;
    InvoiceFile?: number;
    Ticket?: number;
    TicketFile?: number;
    BookMark?: number;
    FasttagDetails?: number;
    EWayBillDetails?: number;
    UserLoginPush?: number;
    UserVehicleLink?: number;
    OrganisationNotificationPreferenceUserLink?: number;

    FleetVendor?: number;
    FleetVendorAddress?: number;
    FleetVendorBankAccount?: number;
    FleetVendorContactPerson?: number;
    FleetVendorReview?: number;
    FleetVendorDocument?: number;
    FleetVendorDocumentFile?: number;
    FleetVendorServiceCenter?: number;
    FleetVendorFuelStation?: number;

    FleetDocument?: number;
    FleetDocumentFile?: number;

    FleetFuelRefill?: number;
    FleetFuelRemoval?: number;
    FleetFuelRefillFile?: number;
    FleetFuelRemovalFile?: number;

    FleetIssue?: number;
    FleetIssueComment?: number;
    FleetIssueFile?: number;

    FleetServiceSchedule?: number;
    FleetService?: number;
    AssignedUser?: number;
    FleetServiceFile?: number;

    FleetInspectionForm?: number;
    FleetInspectionSchedule?: number;
    FleetInspection?: number;
    FleetInspectionFile?: number;

    FleetBreakdown?: number;
    FleetBreakdownCost?: number;
    FleetBreakdownFile?: number;

    FleetIncident?: number;
    FleetIncidentCost?: number;
    FleetIncidentFile?: number;

    FleetWorkshop?: number;

    FleetTripParty?: number;
    FleetTripPartyGroup?: number;

    FleetSparePartsUsage?: number;
    FleetSparePartsPurchaseOrders?: number;

    FleetTyreInventory?: number;
    FleetTyreRetreading?: number;
    RetreadingAssignedUser?: number;
    FleetTyreDamageRepair?: number;
    DamageRepairAssignedUser?: number;
    FleetTyreInspectionSchedule?: number;
    FleetTyreInspection?: number;
    FleetTyreInspectionFile?: number;

    FleetFuelDailySummary?: number;
    GpsLockRelayLog?: number;
    GPSLockDigitalDoorLog?: number;
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
  user_details?: string;
  user_image_url?: string;

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
  organisation_code?: string;
  organisation_logo_url?: string;

  user_id: string;
  User?: User;
  user_details?: string;
  user_image_url?: string;
}

// User Create/Update Schema
export const UserSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  organisation_branch_id: single_select_optional('OrganisationBranch'), // Single-Selection -> OrganisationBranch
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
  username: stringOptional('Username', 0, 100),
  email: stringMandatory('Email', 3, 100),
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
  organisation_branch_ids: multi_select_optional('OrganisationBranch'), // Multi-Selection -> OrganisationBranch
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
  user_image_url: stringMandatory('User Image URL', 1, 300),
  user_image_key: stringMandatory('User Image Key', 1, 300),
  user_image_name: stringMandatory('User Image Name', 1, 300),
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
  organisation_branch_id: row.organisation_branch_id || '',
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
  organisation_branch_id: '',
  user_role_id: '',
  user_status_id: '',
  language_id: '',
  time_zone_id: '',
  date_format_id: '',

  status: Status.Active
});

// AWS S3 PRESIGNED
export const get_user_image_presigned_url = async (fileName: string): Promise<BR<AWSPresignedUrl>> => {
  return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.get_user_image_presigned_url(fileName));
};

// File Uploads
export const update_user_image = async (id: string, data: UserLogoDTO): Promise<SBR> => {
  return apiPatch<SBR, UserLogoDTO>(ENDPOINTS.update_user_image(id), data);
};

export const remove_user_image = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_user_image(id));
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
