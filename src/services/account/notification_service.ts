// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  dateMandatory,
  doubleOptionalLatLng,
  enumArrayOptional,
  enumMandatory,
  getAllEnums,
  multi_select_optional,
  single_select_mandatory,
  single_select_optional,
  stringMandatory,
  stringOptional,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { AlertSubType, AlertType, Module, Status, YesNo } from '../../core/Enums';

// Other Models
import { UserOrganisation } from '../../services/main/users/user_organisation_service';
import { User } from '../../services/main/users/user_service';
import { MasterVehicle } from '../main/vehicle/master_vehicle_service';
import { MasterDriver } from '../main/drivers/master_driver_service';
import { GPSGeofenceData } from '../gps/features/geofence/gps_geofence_data_service';
import { MasterMainLandmark } from '../master/main/master_main_landmark_service';

// URL and Endpoints
const URL = 'account/notifications';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Notification Interface
export interface Notification extends Record<string, unknown> {
  notification_id: string;
  module: Module;
  alert_type: AlertType;
  alert_sub_type: AlertSubType;

  // Event Time
  date_time: string;
  date_time_f?: string;

  // Content
  notification_message: string;
  notification_html_message: string;

  notification_key_1?: string;
  notification_key_2?: string;
  notification_key_3?: string;
  notification_key_4?: string;
  notification_key_5?: string;
  notification_key_6?: string;

  // Location Details
  latitude?: number;
  longitude?: number;
  google_location?: string;

  landmark_id?: string;
  MasterMainLandmark?: MasterMainLandmark;
  landmark_location?: string;
  landmark_distance?: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations
  organisation_id: string;
  UserOrganisation: UserOrganisation;

  user_id?: string;
  User?: User | null;
  user_details?: string;

  vehicle_id?: string;
  MasterVehicle?: MasterVehicle | null;
  vehicle_number?: string;
  vehicle_type?: string;

  driver_id?: string;
  MasterDriver?: MasterDriver | null;
  driver_details?: string;

  gps_geofence_id?: string;
  GPSGeofenceData?: GPSGeofenceData | null;
}

// ✅ Notification Create/Update Schema
export const NotificationSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // ✅ Single-Selection -> User
  vehicle_id: single_select_optional('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
  driver_id: single_select_optional('MasterDriver'), // ✅ Single-Selection -> MasterDriver
  gps_geofence_id: single_select_optional('GPSGeofenceData'), // ✅ Single-Selection -> GPSGeofenceData

  // Event Time
  date_time: dateMandatory('Date Time'),

  notification_message: stringMandatory('Notification Message', 3, 500),
  notification_html_message: stringOptional(
    'Notification HTML Message',
    0,
    500,
  ),

  // Location Details
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  google_location: stringOptional('Google Location', 0, 500),

  notification_key_1: stringOptional('Notification Key 1', 0, 100),
  notification_key_2: stringOptional('Notification Key 2', 0, 100),
  notification_key_3: stringOptional('Notification Key 3', 0, 100),
  notification_key_4: stringOptional('Notification Key 4', 0, 100),
  notification_key_5: stringOptional('Notification Key 5', 0, 100),
  notification_key_6: stringOptional('Notification Key 6', 0, 100),

  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type NotificationDTO = z.infer<typeof NotificationSchema>;

// ✅ Notification Query Schema
export const NotificationQuerySchema = BaseQuerySchema.extend({
  notification_ids: multi_select_optional('Notification'), // ✅ Multi-selection -> Notification
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // ✅ Multi-selection -> User
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-selection -> MasterDriver
  gps_geofence_ids: multi_select_optional('GPSGeofenceData'), // ✅ Multi-selection -> GPSGeofenceData

  module: enumArrayOptional('Module', Module, getAllEnums(Module)),
  alert_type: enumArrayOptional(
    'Alert Type',
    AlertType,
    getAllEnums(AlertType),
  ),
  alert_sub_type: enumArrayOptional(
    'Alert Sub Type',
    AlertSubType,
    getAllEnums(AlertSubType),
  ),
});
export type NotificationQueryDTO = z.infer<typeof NotificationQuerySchema>;

// Convert existing data to a payload structure
export const toNotificationPayload = (row: Notification): NotificationDTO => ({
  // relations (single-selects)
  organisation_id: row.organisation_id,
  user_id: row.user_id ?? '',
  vehicle_id: row.vehicle_id ?? '',
  driver_id: row.driver_id ?? '',
  gps_geofence_id: row.gps_geofence_id ?? '',

  date_time: row.date_time,

  // content
  notification_message: row.notification_message,
  notification_html_message: row.notification_html_message ?? '',

  // keys
  notification_key_1: row.notification_key_1 ?? '',
  notification_key_2: row.notification_key_2 ?? '',
  notification_key_3: row.notification_key_3 ?? '',
  notification_key_4: row.notification_key_4 ?? '',
  notification_key_5: row.notification_key_5 ?? '',
  notification_key_6: row.notification_key_6 ?? '',

  latitude: row.latitude ?? 0,
  longitude: row.longitude ?? 0,
  google_location: row.google_location || '',

  status: row.status,

  time_zone_id: '', // Needs to be provided manually
});

// Generate a new payload with default values
export const newNotificationPayload = (): NotificationDTO => ({
  // relations (single-selects)
  organisation_id: '',
  user_id: '',
  vehicle_id: '',
  driver_id: '',
  gps_geofence_id: '',

  // date
  date_time: new Date().toISOString(),

  // content
  notification_message: '',
  notification_html_message: '',

  // keys
  notification_key_1: '',
  notification_key_2: '',
  notification_key_3: '',
  notification_key_4: '',
  notification_key_5: '',
  notification_key_6: '',

  // location
  latitude: 0,
  longitude: 0,
  google_location: '',

  // metadata
  status: Status.Active,

  time_zone_id: '',
});

// API Methods
export const findNotifications = async (data: NotificationQueryDTO): Promise<FBR<Notification[]>> => {
  return apiPost<FBR<Notification[]>, NotificationQueryDTO>(ENDPOINTS.find, data);
};

export const createNotification = async (data: NotificationDTO): Promise<SBR> => {
  return apiPost<SBR, NotificationDTO>(ENDPOINTS.create, data);
};

export const updateNotification = async (id: string, data: NotificationDTO): Promise<SBR> => {
  return apiPatch<SBR, NotificationDTO>(ENDPOINTS.update(id), data);
};

export const deleteNotification = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
