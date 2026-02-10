// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

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
  numberOptional,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo, OnOff, NotificationChannel, NotificationList } from '../../core/Enums';

// Other Models
import { UserOrganisation } from '../main/users/user_organisation_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { User } from 'src/services/main/users/user_service';
import { GPSGeofence } from '../gps/features/geofence/gps_geofence_service';

// URL and Endpoints
const URL = 'account/notification_preferences';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// OrganisationNotificationPreference Interface
export interface OrganisationNotificationPreference extends Record<string, unknown> {

  notification_preference_id: string;

  notification_name: string;
  notification_status: OnOff;

  notification_channels: NotificationChannel[];
  mobile_numbers?: string;
  email_ids?: string;
  cc_email_ids?: string;
  all_users: YesNo;

  notification_list: NotificationList[];
  over_speed_limit?: number;
  all_geofences: YesNo;

  all_vehicles: YesNo;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations- Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;

  // Relations - Child
  OrganisationNotificationPreferenceVehicleLink: OrganisationNotificationPreferenceVehicleLink[];
  OrganisationNotificationPreferenceGeofenceLink: OrganisationNotificationPreferenceGeofenceLink[];
  OrganisationNotificationPreferenceUserLink: OrganisationNotificationPreferenceUserLink[];

  // Count
  _count?: {
    OrganisationNotificationPreferenceVehicleLink: number;
    OrganisationNotificationPreferenceGeofenceLink: number;
    OrganisationNotificationPreferenceUserLink: number;
  };
}

// OrganisationNotificationPreferenceVehicleLink Interface
export interface OrganisationNotificationPreferenceVehicleLink extends Record<string, unknown> {

  notification_preference_geofence_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  notification_preference_id: string;
  OrganisationNotificationPreference?: OrganisationNotificationPreference;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  // Relations - Child

  // Count
}

// OrganisationNotificationPreferenceGeofenceLink Interface
export interface OrganisationNotificationPreferenceGeofenceLink extends Record<string, unknown> {

  notification_preference_geofence_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  notification_preference_id: string;
  OrganisationNotificationPreference?: OrganisationNotificationPreference;

  gps_geofence_id: string;
  GPSGeofence?: GPSGeofence;
  geofence_details?: string;

  // Relations - Child

  // Count
}

// OrganisationNotificationPreferenceUserLink Interface
export interface OrganisationNotificationPreferenceUserLink extends Record<string, unknown> {

  notification_preference_user_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  notification_preference_id: string;
  OrganisationNotificationPreference?: OrganisationNotificationPreference;

  user_id: string;
  User?: User;
  user_details?: string;

  // Relations - Child

  // Count
}

// ✅ OrganisationNotificationPreference Create/Update Schema
export const OrganisationNotificationPreferenceSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),

  notification_name: stringMandatory('Notification Name', 3, 100),
  notification_status: enumMandatory('Notification Status', OnOff, OnOff.On),

  notification_channels: enumArrayMandatory(
    'Notification Channels',
    NotificationChannel,
    getAllEnums(NotificationChannel),
  ),
  mobile_numbers: stringOptional('Mobile Numbers', 0, 300),
  email_ids: stringOptional('Email IDs', 0, 300),
  cc_email_ids: stringOptional('CC email IDs', 0, 300),
  all_users: enumMandatory('All Users', YesNo, YesNo.No),
  user_ids: multi_select_optional('User'), // Multi selection -> User

  notification_list: enumArrayMandatory(
    'Notification List',
    NotificationList,
    getAllEnums(NotificationList),
  ),
  over_speed_limit: numberOptional('Over Speed Limit'),
  all_geofences: enumMandatory('All Geofences', YesNo, YesNo.No),
  gps_geofence_ids: multi_select_optional('GPSGeofence'), // Multi selection -> GPSGeofence

  all_vehicles: enumMandatory('All Vehicles', YesNo, YesNo.No),
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi selection -> MasterVehicle

  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationNotificationPreferenceDTO = z.infer<
  typeof OrganisationNotificationPreferenceSchema
>;

// ✅ OrganisationNotificationPreference Query Schema
export const OrganisationNotificationPreferenceQuerySchema =
  BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    notification_preference_ids: multi_select_optional(
      'OrganisationNotificationPreference',
    ), // ✅ Multi-Selection -> OrganisationNotificationPreference
    notification_status: enumArrayOptional(
      'Notification Status',
      OnOff,
      getAllEnums(OnOff),
    ),
    notification_channels: enumArrayOptional(
      'Notification Channels',
      NotificationChannel,
      getAllEnums(NotificationChannel),
    ),
    notification_list: enumArrayOptional(
      'Notification List',
      NotificationList,
      getAllEnums(NotificationList),
    ),
  });
export type OrganisationNotificationPreferenceQueryDTO = z.infer<
  typeof OrganisationNotificationPreferenceQuerySchema
>;

// Payload Conversions
export const toOrganisationNotificationPreferencePayload = (data: OrganisationNotificationPreference): OrganisationNotificationPreferenceDTO => ({
  organisation_id: data.organisation_id,

  notification_name: data.notification_name,
  notification_status: data.notification_status,

  notification_channels: data.notification_channels ?? [],
  mobile_numbers: data.mobile_numbers ?? '',
  email_ids: data.email_ids ?? '',
  cc_email_ids: data.cc_email_ids ?? '',
  all_users: data.all_users,

  notification_list: data.notification_list ?? [],
  over_speed_limit: data.over_speed_limit ?? 60,
  all_geofences: data.all_geofences,

  all_vehicles: data.all_vehicles,

  status: data.status,

  user_ids:
    data.OrganisationNotificationPreferenceUserLink?.map((v) => v.user_id) ?? [],
  gps_geofence_ids:
    data.OrganisationNotificationPreferenceGeofenceLink?.map((v) => v.gps_geofence_id) ?? [],
  vehicle_ids:
    data.OrganisationNotificationPreferenceVehicleLink?.map((v) => v.vehicle_id) ?? [],

});

export const newOrganisationNotificationPreferencePayload = (): OrganisationNotificationPreferenceDTO => ({
  organisation_id: '',

  notification_name: '',
  notification_status: OnOff.On,

  notification_channels: [],
  mobile_numbers: '',
  email_ids: '',
  cc_email_ids: '',
  all_users: YesNo.Yes,

  notification_list: [],
  over_speed_limit: 0,
  all_geofences: YesNo.Yes,

  all_vehicles: YesNo.Yes,

  status: Status.Active,

  user_ids: [],
  gps_geofence_ids: [],
  vehicle_ids: [],
});

// API Methods
export const findOrganisationNotificationPreference = async (data: OrganisationNotificationPreferenceQueryDTO): Promise<FBR<OrganisationNotificationPreference[]>> => {
  return apiPost<FBR<OrganisationNotificationPreference[]>, OrganisationNotificationPreferenceQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationNotificationPreference = async (data: OrganisationNotificationPreferenceDTO): Promise<SBR> => {
  return apiPost<SBR, OrganisationNotificationPreferenceDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationNotificationPreference = async (id: string, data: OrganisationNotificationPreferenceDTO): Promise<SBR> => {
  return apiPatch<SBR, OrganisationNotificationPreferenceDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationNotificationPreference = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
