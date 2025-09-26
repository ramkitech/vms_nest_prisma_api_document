// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  single_select_optional,
  multi_select_optional,
  enumMandatory,
  enumArrayOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterUserRole } from '../../../services/master/user/master_user_role_service';
import { MasterUserStatus } from '../../../services/master/user/master_user_status_service';
import { MasterMainLanguage } from '../../../services/master/main/master_main_language_service';
import { MasterMainDateFormat } from '../../../services/master/main/master_main_date_format_service';
import { MasterMainTimeZone } from '../../../services/master/main/master_main_timezone_service';
import { MasterVehicle } from '../vehicle/master_vehicle_service';

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
  updateDefaultLanguage: (id: string): string =>
    `${URL}/default_language/${id}`,
  updateDefaultTimezone: (id: string): string =>
    `${URL}/default_timezone/${id}`,
  updateDefaultDateformat: (id: string): string =>
    `${URL}/default_date_format/${id}`,
};

// User Interface
export interface User extends Record<string, unknown> {
  // Primary Fields
  user_id: string;

  first_name: string;
  last_name?: string;
  email: string;
  username?: string;
  mobile?: string;
  password?: string;

  can_login: YesNo;
  is_root_user: YesNo;
  all_vehicles: YesNo;

  user_details?: string;

  user_image_url?: string;
  user_image_key?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  user_role_id?: string;
  MasterUserRole?: MasterUserRole;
  user_role?: string;

  user_status_id?: string;
  MasterUserStatus?: MasterUserStatus;
  user_status?: string;

  language_id?: string;
  MasterMainLanguage?: MasterMainLanguage;

  date_format_id?: string;
  MasterMainDateFormat?: MasterMainDateFormat;

  time_zone_id?: string;
  MasterMainTimeZone?: MasterMainTimeZone;

  // Relations - Child
  UserVehicleLink: UserVehicleLink[];
}

export interface UserVehicleLink extends Record<string, unknown> {

  user_vehicle_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  user_id: string;
  User?: User;

  // Relations - Child

  // Count
}

// ✅ Create User Create/Update Schema
export const CreateUserSchema = z.object({
  first_name: stringMandatory('First Name', 2, 100),
  last_name: stringOptional('Last Name', 0, 100),
  email: stringMandatory('Email', 2, 100),
  username: stringOptional('Mobile', 0, 100),
  mobile: stringOptional('Mobile', 0, 20),
  password: stringOptional('Password', 0, 20),

  can_login: enumMandatory('Can Login', YesNo, YesNo.No),
  is_root_user: enumMandatory('Is Root User', YesNo, YesNo.No),
  all_vehicles: enumMandatory('All Vehicles', YesNo, YesNo.No),
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi selection -> MasterVehicle

  user_image_url: stringOptional('User Image URL', 0, 300),
  user_image_key: stringOptional('User Image Key', 0, 300),

  organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  user_role_id: single_select_optional('MasterUserRole'), // ✅ Single-Selection -> MasterUserRole
  user_status_id: single_select_optional('MasterUserStatus'), // ✅ Single-Selection -> MasterUserStatus
  language_id: single_select_optional('MasterMainLanguage'), // ✅ Single-Selection -> MasterMainLanguage
  time_zone_id: single_select_optional('MasterMainTimeZone'), // ✅ Single-Selection -> MasterMainTimeZone
  date_format_id: single_select_optional('MasterMainDateFormat'), // ✅ Single-Selection -> MasterMainDateFormat

  status: enumMandatory('Status', Status, Status.Active),
});
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

// ✅ User Query Schema
export const UserQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  user_role_ids: multi_select_optional('MasterUserRole'), // ✅ Multi-Selection -> MasterUserRole
  user_status_ids: multi_select_optional('MasterUserStatus'), // ✅ Multi-Selection -> MasterUserStatus
  language_ids: multi_select_optional('MasterMainLanguage'), // ✅ Multi-Selection -> MasterMainLanguage
  time_zone_ids: multi_select_optional('MasterMainTimeZone'), // ✅ Multi-Selection -> MasterMainTimeZone
  date_format_ids: multi_select_optional('MasterMainDateFormat'), // ✅ Multi-Selection -> MasterMainDateFormat
  user_ids: multi_select_optional('User'), // ✅ Multi-Selection -> User

  can_login: enumArrayOptional('Can Login', YesNo),
  is_root_user: enumArrayOptional('Is Root User', YesNo),
  all_vehicles: enumArrayOptional('All Vehicles', YesNo),
});
export type UserQueryDTO = z.infer<typeof UserQuerySchema>;

// ✅ Update UserDefaultLanguageSchema
export const UserDefaultLanguageSchema = z.object({
  language_id: single_select_optional('MasterMainLanguage'), // ✅ Single-Selection -> MasterMainLanguage
});
export type UserDefaultLanguageDTO = z.infer<typeof UserDefaultLanguageSchema>;

// ✅ Update UserDefaultTimeZoneSchema
export const UserDefaultTimeZoneSchema = z.object({
  time_zone_id: single_select_optional('MasterMainTimeZone'), // ✅ Single-Selection -> MasterMainTimeZone
});
export type UserDefaultTimeZoneDTO = z.infer<typeof UserDefaultTimeZoneSchema>;

// ✅ Update UserDefaultDateFormatSchema
export const UserDefaultDateFormatSchema = z.object({
  date_format_id: single_select_optional('MasterMainDateFormat'), // ✅ Single-Selection -> MasterMainDateFormat
});
export type UserDefaultDateFormatDTO = z.infer<
  typeof UserDefaultDateFormatSchema
>;

// Generate a new payload with default values
export const newUserPayload = (): CreateUserDTO => ({
  first_name: '',
  last_name: '',
  email: '',
  username: '',
  mobile: '',
  password: '',

  can_login: YesNo.No,
  is_root_user: YesNo.No,
  all_vehicles: YesNo.Yes,
  vehicle_ids: [],

  user_image_url: '',
  user_image_key: '',

  organisation_id: '',
  user_role_id: '',
  user_status_id: '',
  language_id: '',
  time_zone_id: '',
  date_format_id: '',

  status: Status.Active,
});

// Convert existing data to a payload structure
export const toUserPayload = (data: User): CreateUserDTO => ({
  first_name: data.first_name,
  last_name: data.last_name ?? '',
  email: data.email,
  mobile: data.mobile ?? '',
  username: data.username ?? '',
  password: data.password ?? '',

  can_login: data.can_login,
  is_root_user: data.is_root_user,
  all_vehicles: data.all_vehicles,

  user_image_url: data.user_image_url ?? '',
  user_image_key: data.user_image_key ?? '',

  organisation_id: data.organisation_id ?? '',
  user_role_id: data.user_role_id ?? '',
  user_status_id: data.user_status_id ?? '',
  language_id: data.language_id ?? '',
  date_format_id: data.date_format_id ?? '',
  time_zone_id: data.time_zone_id ?? '',

  status: data.status,

  vehicle_ids:
    data.UserVehicleLink?.map((v) => v.vehicle_id) ?? [],
});

// API Methods
export const findUsers = async (data: UserQueryDTO): Promise<FBR<User[]>> => {
  return apiPost<FBR<User[]>, UserQueryDTO>(ENDPOINTS.find, data);
};

export const createUser = async (data: CreateUserDTO): Promise<SBR> => {
  return apiPost<SBR, CreateUserDTO>(ENDPOINTS.create, data);
};

export const updateUser = async (id: string, data: CreateUserDTO): Promise<SBR> => {
  return apiPatch<SBR, CreateUserDTO>(ENDPOINTS.update(id), data);
};

export const deleteUser = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getUserCache = async (organisation_id: string): Promise<FBR<User[]>> => {
  return apiGet<FBR<User[]>>(ENDPOINTS.cache(organisation_id));
};

export const getUserCacheSimple = async (organisation_id: string): Promise<FBR<User[]>> => {
  return apiGet<FBR<User[]>>(ENDPOINTS.cacheSimple(organisation_id));
};

// Generate presigned URL for file uploads
export const getUserPresignedUrl = async (fileName: string): Promise<SBR> => {
  return apiGet<SBR>(ENDPOINTS.presignedUrl(fileName));
};

// Update Default Language
export const updateUserDefaultLanguage = async (id: string, data: UserDefaultLanguageDTO): Promise<SBR> => {
  return apiPatch<SBR, UserDefaultLanguageDTO>(ENDPOINTS.updateDefaultLanguage(id), data);
};

// Update Default Language
export const updateUserDefaultTimezone = async (id: string, data: UserDefaultTimeZoneDTO): Promise<SBR> => {
  return apiPatch<SBR, UserDefaultTimeZoneDTO>(ENDPOINTS.updateDefaultTimezone(id), data);
};

// Update Default Language
export const updateUserDefaultDateformat = async (id: string, data: UserDefaultDateFormatDTO): Promise<SBR> => {
  return apiPatch<SBR, UserDefaultDateFormatDTO>(ENDPOINTS.updateDefaultDateformat(id), data);
};
