// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  single_select_optional,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
  enumArrayOptional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status, YesNo, LoginFrom } from 'core/Enums';

// Other Models
import { UserOrganisation } from 'services/main/users/user_organisation_service';
import { MasterUserRole } from 'services/master/user/master_user_role_service';
import { MasterUserStatus } from 'services/master/user/master_user_status_service';
import { MasterMainLanguage } from 'services/master/main/master_main_language_service';
import { MasterMainCountry } from 'services/master/main/master_main_country_service';
import { MasterMainDateFormat } from 'services/master/main/master_main_date_format_service';
import { MasterMainTimeZone } from 'services/master/main/master_main_timezone_service';

const URL = 'user/user';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cacheSimple: (organisation_id: string): string =>
    `${URL}/cache_simple/${organisation_id}`,

  // Presigned URL for file uploads
  presignedUrl: (fileName: string): string =>
    `${URL}/presigned_url/${fileName}`,

  // Default Settings
  updateDefaultPage: (id: string): string => `${URL}/default_page/${id}`,
  updateDefaultTheme: (id: string): string => `${URL}/default_theme/${id}`,
  updateDefaultLanguage: (id: string): string =>
    `${URL}/default_language/${id}`,
  updateDefaultTimezone: (id: string): string =>
    `${URL}/default_timezone/${id}`,
  updateDefaultDateformat: (id: string): string =>
    `${URL}/default_date_format/${id}`,

  // User Login Push
  createLoginPush: `${URL}/login_push`,
  updateLoginPush: (id: string): string => `${URL}/login_push/${id}`,
  deleteLoginPush: (id: string): string => `${URL}/login_push/${id}`,
};

// User Interface
export interface User extends Record<string, unknown> {
  // Primary Fields
  user_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  is_google_login: YesNo;
  google_login_data?: string;
  password?: string;
  mobile?: string;
  can_login: YesNo;
  is_activated: YesNo;
  is_root_user: YesNo;
  user_image_url?: string;
  user_image_key?: string;

  // Default Preferences
  default_module_name?: string;
  default_page_name?: string;
  default_page_url?: string;
  default_theme?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - One To One
  user_access_control_id?: string;
  UserAccessControl?: UserAccessControl;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  user_role_id?: string;
  MasterUserRole?: MasterUserRole;

  user_status_id?: string;
  MasterUserStatus?: MasterUserStatus;

  language_id?: string;
  MasterMainLanguage?: MasterMainLanguage;

  country_id?: string;
  MasterMainCountry?: MasterMainCountry;

  date_format_id?: string;
  MasterMainDateFormat?: MasterMainDateFormat;

  time_zone_id?: string;
  MasterMainTimeZone?: MasterMainTimeZone;

  // Child - Fleet
  // InspectionSchedule: FleetInspectionSchedule[];
  // ScheduledInspections: FleetInspectionScheduleTracking[];
  // ActionedInspections: FleetInspectionScheduleTracking[];
  // InspectorUser: FleetInspection[];
  // ApprovedUser: FleetInspection[];
  // IncidentManagement: FleetIncidentManagement[];
  // IssueManagement: FleetIssueManagement[];
  // FleetServiceSchedule: FleetServiceSchedule[];
  // AssignedUser: FleetServiceJobCard[];
  // RatingUser: FleetServiceJobCard[];
  // FleetWorkshop: FleetWorkshop[];
  // FleetTripParty: FleetTripParty[];
  // FleetTripPartyGroup: FleetTripPartyGroup[];
  // FleetSparePartsUsage: FleetSparePartsUsage[];
  // FleetSparePartsPurchaseOrders: FleetSparePartsPurchaseOrders[];
  // FleetReminders: FleetReminders[];
  // FleetFuelRefills: FleetFuelRefills[];
  // FleetFuelRemovals: FleetFuelRemovals[];
  // FleetTyreInspectionSchedule: FleetTyreInspectionSchedule[];
  // FleetTyreInspectionScheduleTracking: FleetTyreInspectionScheduleTracking[];
  // FleetTyreInspection: FleetTyreInspection[];

  // Child - GPS
  // GPSFuelVehicleRefill: GPSFuelVehicleRefill[];
  // GPSFuelVehicleRemoval: GPSFuelVehicleRemoval[];
  // GpsLockRelayLog: GPSLockRelayLog[];
  // GPSLockDigitalDoorLog: GPSLockDigitalDoorLog[];

  // Child - Account
  // Ticket: Ticket[];
  // BookMark: BookMark[];
  // Alert: Alert[];
  // AlertUserLink: AlertUserLink[];
  // NotificationUserLink: NotificationUserLink[];
  // FasttagDetails: FasttagDetails[];
  // EWayBillDetails: EWayBillDetails[];
  // UserLoginPush: UserLoginPush[];

  // Relations - Child
  // Dummy_UserAccessControl: UserAccessControl[];
}

export interface UserAccessControl extends Record<string, unknown> {
  // Primary Fields
  user_access_control_id: string;

  // Permissions
  vehicles_view: YesNo;
  vehicles_edit: YesNo;
  vehicles_delete: YesNo;

  users_view: YesNo;
  users_edit: YesNo;
  users_delete: YesNo;

  drivers_view: YesNo;
  drivers_edit: YesNo;
  drivers_delete: YesNo;

  account_view: YesNo;
  account_edit: YesNo;
  account_delete: YesNo;

  masters_view: YesNo;
  masters_edit: YesNo;
  masters_delete: YesNo;

  gps_view: YesNo;
  gps_edit: YesNo;
  gps_delete: YesNo;

  fleet_view: YesNo;
  fleet_edit: YesNo;
  fleet_delete: YesNo;

  trips_view: YesNo;
  trips_edit: YesNo;
  trips_delete: YesNo;

  warehouse_view: YesNo;
  warehouse_edit: YesNo;
  warehouse_delete: YesNo;

  accounts_view: YesNo;
  accounts_edit: YesNo;
  accounts_delete: YesNo;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - One To One
  user_id?: string;
  User?: User;

  // Relations - Dummy
  Dummy_User: User[];

  // Index
  index_user_id?: string;
}

// User Access Control create/update schema
export const UserAccessControlSchema = z.object({
  vehicles_view: enumMandatory('Vehicles View', YesNo, YesNo.Yes),
  vehicles_edit: enumMandatory('Vehicles Edit', YesNo, YesNo.No),
  vehicles_delete: enumMandatory('Vehicles Delete', YesNo, YesNo.No),

  users_view: enumMandatory('Users View', YesNo, YesNo.Yes),
  users_edit: enumMandatory('Users Edit', YesNo, YesNo.No),
  users_delete: enumMandatory('Users Delete', YesNo, YesNo.No),

  drivers_view: enumMandatory('Drivers View', YesNo, YesNo.Yes),
  drivers_edit: enumMandatory('Drivers Edit', YesNo, YesNo.No),
  drivers_delete: enumMandatory('Drivers Delete', YesNo, YesNo.No),

  account_view: enumMandatory('Account View', YesNo, YesNo.Yes),
  account_edit: enumMandatory('Account Edit', YesNo, YesNo.No),
  account_delete: enumMandatory('Account Delete', YesNo, YesNo.No),

  masters_view: enumMandatory('Masters View', YesNo, YesNo.Yes),
  masters_edit: enumMandatory('Masters Edit', YesNo, YesNo.No),
  masters_delete: enumMandatory('Masters Delete', YesNo, YesNo.No),

  gps_view: enumMandatory('GPS View', YesNo, YesNo.Yes),
  gps_edit: enumMandatory('GPS Edit', YesNo, YesNo.No),
  gps_delete: enumMandatory('GPS Delete', YesNo, YesNo.No),

  fleet_view: enumMandatory('Fleet View', YesNo, YesNo.Yes),
  fleet_edit: enumMandatory('Fleet Edit', YesNo, YesNo.No),
  fleet_delete: enumMandatory('Fleet Delete', YesNo, YesNo.No),

  trips_view: enumMandatory('Trips View', YesNo, YesNo.Yes),
  trips_edit: enumMandatory('Trips Edit', YesNo, YesNo.No),
  trips_delete: enumMandatory('Trips Delete', YesNo, YesNo.No),

  warehouse_view: enumMandatory('Warehouse View', YesNo, YesNo.Yes),
  warehouse_edit: enumMandatory('Warehouse Edit', YesNo, YesNo.No),
  warehouse_delete: enumMandatory('Warehouse Delete', YesNo, YesNo.No),

  accounts_view: enumMandatory('Accounts View', YesNo, YesNo.Yes),
  accounts_edit: enumMandatory('Accounts Edit', YesNo, YesNo.No),
  accounts_delete: enumMandatory('Accounts Delete', YesNo, YesNo.No),

  user_id: single_select_optional('User ID'), // Single selection -> User

  status: enumMandatory('Status', Status, Status.Active),
});
export type UserAccessControlDTO = z.infer<typeof UserAccessControlSchema>;

// ✅ Create User Create/Update Schema
export const CreateUserSchema = z.object({
  first_name: stringMandatory('First Name', 2, 100),
  last_name: stringOptional('Last Name', 0, 100),
  email: stringMandatory('Email', 2, 100),
  is_google_login: enumMandatory('Is Google Login', YesNo, YesNo.No),
  google_login_data: stringOptional('Google Login Data', 0, 500),
  password: stringOptional('Password', 0, 20),

  mobile: stringOptional('Mobile', 0, 20),
  can_login: enumMandatory('Can Login', YesNo, YesNo.No),
  is_activated: enumMandatory('Is Activated', YesNo, YesNo.No),
  is_root_user: enumMandatory('Is Root User', YesNo, YesNo.No),

  user_image_url: stringOptional('User Image URL', 0, 300),
  user_image_key: stringOptional('User Image Key', 0, 300),

  organisation_id: single_select_mandatory('Organisation ID'), // Single selection -> UserOrganisation

  language_id: single_select_optional('Language ID'), // Single selection -> MasterMainLanguage
  country_id: single_select_optional('Country ID'), // Single selection -> MasterMainCountry
  user_role_id: single_select_optional('User Role ID'), // Single selection -> MasterUserRole
  user_status_id: single_select_optional('User Status ID'), // Single selection -> MasterUserStatus

  default_module_name: stringOptional('Default Module Name', 0, 50),
  default_page_name: stringOptional('Default Page Name', 0, 50),
  default_page_url: stringOptional('Default Page URL', 0, 200),
  default_theme: stringOptional('Default Theme', 0, 50),

  status: enumMandatory('Status', Status, Status.Active),
  user_access_control: UserAccessControlSchema.optional(),
});
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

// ✅ User Query Schema
export const UserQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation IDs', 100, []), // Multi-selection -> UserOrganisation
  language_ids: multi_select_optional('Language IDs', 100, []), // Multi-selection -> MasterMainLanguage
  country_ids: multi_select_optional('Country IDs', 100, []), // Multi-selection -> MasterMainCountry
  user_role_ids: multi_select_optional('User Role IDs', 100, []), // Multi-selection -> MasterUserRole
  user_status_ids: multi_select_optional('User Status IDs', 100, []), // Multi-selection -> MasterUserStatus
  user_ids: multi_select_optional('User IDs', 100, []), // Multi-selection -> User

  can_login: enumArrayOptional('Can Login', YesNo),
  is_activated: enumArrayOptional('Is Activated', YesNo),
});
export type UserQueryDTO = z.infer<typeof UserQuerySchema>;

// ✅ User Default Page Update Schema
export const UserDefaultPageSchema = z.object({
  default_module_name: stringOptional('Default Module Name', 0, 50),
  default_page_name: stringOptional('Default Page Name', 0, 50),
  default_page_url: stringOptional('Default Page URL', 0, 200),
});
export type UserDefaultPageDTO = z.infer<typeof UserDefaultPageSchema>;

// ✅ User Default Theme Update Schema
export const UserDefaultThemeSchema = z.object({
  default_theme: stringOptional('Default Theme', 0, 50),
});
export type UserDefaultThemeDTO = z.infer<typeof UserDefaultThemeSchema>;

// ✅ User Default Language Update Schema
export const UserDefaultLanguageSchema = z.object({
  language_id: single_select_optional('Language ID'), // Single selection -> MasterMainLanguage
});
export type UserDefaultLanguageDTO = z.infer<typeof UserDefaultLanguageSchema>;

// ✅ User Default Language Update Schema
export const UserDefaultTimeZoneSchema = z.object({
  time_zone_id: single_select_optional('Timezone ID'), // Single selection -> MasterMainTimeZone
});
export type UserDefaultTimeZoneDTO = z.infer<typeof UserDefaultTimeZoneSchema>;

// ✅ User Default Language Update Schema
export const UserDefaultDateFormatSchema = z.object({
  date_format_id: single_select_optional('Date Format ID'), // Single selection -> MasterMainDateFormat
});
export type UserDefaultDateFormatDTO = z.infer<
  typeof UserDefaultDateFormatSchema
>;

// ✅ User Login Push Create/Update Schema
export const UserLoginPushSchema = z.object({
  login_from: enumMandatory('Login From', LoginFrom, LoginFrom.Web),
  web_token: stringOptional('Web Token', 0, 500),
  android_token: stringOptional('Android Token', 0, 500),
  iphone_token: stringOptional('IPhone Token', 0, 500),

  organisation_id: single_select_mandatory('Organisation ID'), // Single selection -> UserOrganisation
  user_id: single_select_mandatory('User ID'), // Single selection -> User

  status: enumMandatory('Status', Status, Status.Active),
});
export type UserLoginPushDTO = z.infer<typeof UserLoginPushSchema>;

// Default User Access Control
const defaultUserAccessControl = {
  vehicles_view: YesNo.No,
  vehicles_edit: YesNo.No,
  vehicles_delete: YesNo.No,

  users_view: YesNo.No,
  users_edit: YesNo.No,
  users_delete: YesNo.No,

  drivers_view: YesNo.No,
  drivers_edit: YesNo.No,
  drivers_delete: YesNo.No,

  account_view: YesNo.No,
  account_edit: YesNo.No,
  account_delete: YesNo.No,

  masters_view: YesNo.No,
  masters_edit: YesNo.No,
  masters_delete: YesNo.No,

  gps_view: YesNo.No,
  gps_edit: YesNo.No,
  gps_delete: YesNo.No,

  fleet_view: YesNo.No,
  fleet_edit: YesNo.No,
  fleet_delete: YesNo.No,

  trips_view: YesNo.No,
  trips_edit: YesNo.No,
  trips_delete: YesNo.No,

  warehouse_view: YesNo.No,
  warehouse_edit: YesNo.No,
  warehouse_delete: YesNo.No,

  accounts_view: YesNo.No,
  accounts_edit: YesNo.No,
  accounts_delete: YesNo.No,

  user_id: '',
  status: Status.Active,
};

// Generate a new payload with default values
export const newUserPayload = (): CreateUserDTO => ({
  first_name: '',
  last_name: '',
  email: '',
  is_google_login: YesNo.No,
  google_login_data: '',
  password: '',
  mobile: '',
  can_login: YesNo.No,
  is_activated: YesNo.No,
  is_root_user: YesNo.No,

  user_image_url: '',
  user_image_key: '',

  organisation_id: '',
  language_id: '',
  country_id: '',
  user_role_id: '',
  user_status_id: '',

  default_module_name: '',
  default_page_name: '',
  default_page_url: '',
  default_theme: '',

  status: Status.Active,

  user_access_control: { ...defaultUserAccessControl },
});

// Convert existing data to a payload structure
export const toUserPayload = (user: User): CreateUserDTO => ({
  first_name: user.first_name,
  last_name: user.last_name ?? '',
  email: user.email,
  is_google_login: user.is_google_login,
  google_login_data: user.google_login_data ?? '',
  password: user.password ?? '',
  mobile: user.mobile ?? '',
  can_login: user.can_login,
  is_activated: user.is_activated,
  is_root_user: user.is_root_user,

  user_image_url: user.user_image_url ?? '',
  user_image_key: user.user_image_key ?? '',

  organisation_id: user.organisation_id ?? '',
  language_id: user.language_id ?? '',
  country_id: user.country_id ?? '',
  user_role_id: user.user_role_id ?? '',
  user_status_id: user.user_status_id ?? '',

  default_module_name: user.default_module_name ?? '',
  default_page_name: user.default_page_name ?? '',
  default_page_url: user.default_page_url ?? '',
  default_theme: user.default_theme ?? '',

  status: user.status,

  // User Access Control
  user_access_control: user.UserAccessControl
    ? {
        ...defaultUserAccessControl, // Ensure all fields exist
        ...user.UserAccessControl, // Overwrite with user-specific values
        user_id: user.user_id, // Ensure user_id is correctly assigned
      }
    : { ...defaultUserAccessControl },
});

// API Methods
export const findUsers = async (data: UserQueryDTO): Promise<FBR<User[]>> => {
  return apiPost<FBR<User[]>, UserQueryDTO>(ENDPOINTS.find, data);
};

export const createUser = async (data: CreateUserDTO): Promise<SBR> => {
  return apiPost<SBR, CreateUserDTO>(ENDPOINTS.create, data);
};

export const updateUser = async (
  id: string,
  data: CreateUserDTO
): Promise<SBR> => {
  return apiPatch<SBR, CreateUserDTO>(ENDPOINTS.update(id), data);
};

export const deleteUser = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getUserCache = async (
  organisation_id: string
): Promise<FBR<User[]>> => {
  return apiGet<FBR<User[]>>(ENDPOINTS.cache(organisation_id));
};

export const getUserCacheSimple = async (
  organisation_id: string
): Promise<FBR<User[]>> => {
  return apiGet<FBR<User[]>>(ENDPOINTS.cacheSimple(organisation_id));
};

// Generate presigned URL for file uploads
export const getUserPresignedUrl = async (fileName: string): Promise<SBR> => {
  return apiGet<SBR>(ENDPOINTS.presignedUrl(fileName));
};

// Update Default Page
export const updateUserDefaultPage = async (
  id: string,
  data: UserDefaultPageDTO
): Promise<SBR> => {
  return apiPatch<SBR, UserDefaultPageDTO>(
    ENDPOINTS.updateDefaultPage(id),
    data
  );
};

// Update Default Theme
export const updateUserDefaultTheme = async (
  id: string,
  data: UserDefaultThemeDTO
): Promise<SBR> => {
  return apiPatch<SBR, UserDefaultThemeDTO>(
    ENDPOINTS.updateDefaultTheme(id),
    data
  );
};

// Update Default Language
export const updateUserDefaultLanguage = async (
  id: string,
  data: UserDefaultLanguageDTO
): Promise<SBR> => {
  return apiPatch<SBR, UserDefaultLanguageDTO>(
    ENDPOINTS.updateDefaultLanguage(id),
    data
  );
};

// Update Default Language
export const updateUserDefaultTimezone = async (
  id: string,
  data: UserDefaultTimeZoneDTO
): Promise<SBR> => {
  return apiPatch<SBR, UserDefaultTimeZoneDTO>(
    ENDPOINTS.updateDefaultTimezone(id),
    data
  );
};

// Update Default Language
export const updateUserDefaultDateformat = async (
  id: string,
  data: UserDefaultDateFormatDTO
): Promise<SBR> => {
  return apiPatch<SBR, UserDefaultDateFormatDTO>(
    ENDPOINTS.updateDefaultDateformat(id),
    data
  );
};

// User Login Push
export const createUserLoginPush = async (
  data: UserLoginPushDTO
): Promise<SBR> => {
  return apiPost<SBR, UserLoginPushDTO>(ENDPOINTS.createLoginPush, data);
};

export const updateUserLoginPush = async (
  id: string,
  data: UserLoginPushDTO
): Promise<SBR> => {
  return apiPatch<SBR, UserLoginPushDTO>(ENDPOINTS.updateLoginPush(id), data);
};

export const deleteUserLoginPush = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.deleteLoginPush(id));
};
