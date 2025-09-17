// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  enumArrayOptional,
  multi_select_optional,
  single_select_mandatory,
  getAllEnums,
  enumArrayMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo, NotificationType, NotificationPreference, OnOff } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { User } from 'src/services/main/users/user_service';

// URL and Endpoints
const URL = 'gps/features/user_notification_preferences';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// UserNotificationPreferences Interface
export interface UserNotificationPreferences extends Record<string, unknown> {

  notification_preference_id: string;

  notification_name: string;
  notification_status: OnOff;
  notification_types: NotificationType[];
  notification_list: NotificationPreference[];

  mobile_numbers?: string;
  email_ids?: string;
  cc_email_ids?: string;

  all_vehicles: YesNo;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  UserNotificationPreferenceUserLink: UserNotificationPreferenceUserLink[];
  UserNotificationPreferenceVehicleLink: UserNotificationPreferenceVehicleLink[];

  // Count
  _count?: {
    UserNotificationPreferenceUserLink: number;
    UserNotificationPreferenceVehicleLink: number;
  };
}

export interface UserNotificationPreferenceVehicleLink extends Record<string, unknown> {

  notification_vehicle_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  notification_preference_id: string;
  UserNotificationPreferences?: UserNotificationPreferences;

  // Relations - Child

  // Count
}

export interface UserNotificationPreferenceUserLink extends Record<string, unknown> {

  notification_user_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  user_id: string;
  User?: User;
  user_details?: string;

  notification_preference_id: string;
  UserNotificationPreferences?: UserNotificationPreferences;

  // Relations - Child

  // Count
}

// ✅ UserNotificationPreferences Create/Update Schema
export const UserNotificationPreferencesSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  notification_name: stringMandatory('Notification Name', 3, 100),
  notification_status: enumMandatory('Notification Status', OnOff, OnOff.On),
  notification_list: enumArrayMandatory(
    'Notification List',
    NotificationPreference,
    getAllEnums(NotificationPreference),
  ),
  notification_types: enumArrayMandatory(
    'Notification Type',
    NotificationType,
    getAllEnums(NotificationType),
  ),

  mobile_numbers: stringOptional('Mobile Numbers', 0, 300),
  email_ids: stringOptional('Email IDs', 0, 300),
  cc_email_ids: stringOptional('CC email IDs', 0, 300),
  user_ids: multi_select_optional('User'), // Multi selection -> User

  all_vehicles: enumMandatory('All Vehicles', YesNo, YesNo.No),
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi selection -> MasterVehicle

  status: enumMandatory('Status', Status, Status.Active),
});
export type UserNotificationPreferencesDTO = z.infer<
  typeof UserNotificationPreferencesSchema
>;

// ✅ UserNotificationPreferences Query Schema
export const UserNotificationPreferencesQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  notification_preference_ids: multi_select_optional(
    'UserNotificationPreferences',
  ), // ✅ Multi-Selection -> UserNotificationPreferences
  notification_status: enumArrayOptional(
    'Notification Status',
    OnOff,
    getAllEnums(OnOff),
  ),
  all_vehicles: enumArrayOptional('All Vehicles', YesNo, getAllEnums(YesNo)),
});
export type UserNotificationPreferencesQueryDTO = z.infer<
  typeof UserNotificationPreferencesQuerySchema
>;

// Payload Conversions
export const toUserNotificationPreferencesPayload = (data: UserNotificationPreferences): UserNotificationPreferencesDTO => ({
  organisation_id: data.organisation_id,

  notification_name: data.notification_name,
  notification_status: data.notification_status,
  notification_types: data.notification_types?? [],
  notification_list: data.notification_list ?? [],

  mobile_numbers: data.mobile_numbers ?? '',
  email_ids: data.email_ids ?? '',
  cc_email_ids: data.cc_email_ids ?? '',
  
  all_vehicles: data.all_vehicles,

  status: data.status,
  vehicle_ids:
    data.UserNotificationPreferenceVehicleLink?.map((v) => v.vehicle_id) ?? [],
  user_ids:
    data.UserNotificationPreferenceUserLink?.map((v) => v.user_id) ?? [],
});

export const newUserNotificationPreferencesPayload = (): UserNotificationPreferencesDTO => ({
  organisation_id: '',
  notification_name: '',
  notification_status: OnOff.On,
  notification_types: [],
  notification_list: [],

  mobile_numbers: '',
  email_ids: '',
  cc_email_ids: '',
  
  all_vehicles: YesNo.Yes,

  vehicle_ids: [],
  user_ids: [],

  status: Status.Active,
});

// API Methods
export const findUserNotificationPreferences = async (data: UserNotificationPreferencesQueryDTO): Promise<FBR<UserNotificationPreferences[]>> => {
  return apiPost<FBR<UserNotificationPreferences[]>, UserNotificationPreferencesQueryDTO>(ENDPOINTS.find, data);
};

export const createUserNotificationPreferences = async (data: UserNotificationPreferencesDTO): Promise<SBR> => {
  return apiPost<SBR, UserNotificationPreferencesDTO>(ENDPOINTS.create, data);
};

export const updateUserNotificationPreferences = async (id: string, data: UserNotificationPreferencesDTO): Promise<SBR> => {
  return apiPatch<SBR, UserNotificationPreferencesDTO>(ENDPOINTS.update(id), data);
};

export const deleteUserNotificationPreferences = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
