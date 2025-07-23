// Axios
import { apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  stringOptional,
  enumOptional,
  single_select_mandatory,
  multi_select_optional,
  enumArrayOptional,
  getAllEnums,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Other Models
import { UserOrganisation } from 'services/main/users/user_organisation_service';
import { User } from 'services/main/users/user_service';
import { MasterDriver } from 'services/main/drivers/master_driver_service';
import { MasterVehicle } from 'services/main/vehicle/master_vehicle_service';

// Enums
import {
  SubModule,
  AlertType,
  AlertSubType,
  YesNo,
  Status,
  Module,
} from 'core/Enums';

// URL and Endpoints
const URL = 'account/alerts';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Alert Interface
export interface Alert extends Record<string, unknown> {
  // Primary Fields
  alert_id: string;

  module: Module;
  sub_module: SubModule;
  alert_type: AlertType;
  alert_sub_type: AlertSubType;

  alert_key_1?: string;
  alert_key_2?: string;
  alert_key_3?: string;
  alert_key_4?: string;

  is_edit?: YesNo;
  is_push?: YesNo;
  is_sms?: YesNo;
  is_whatsapp?: YesNo;
  is_email?: YesNo;

  mobile_numbers?: string;
  emails?: string;

  all_vehicles?: YesNo;
  all_trips?: YesNo;
  all_geofences?: YesNo;
  all_drivers?: YesNo;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  user_id: string;
  User?: User;

  // Relations - Child
  AlertUserLink?: AlertUserLink[];
  AlertGeofenceLink?: AlertGeofenceLink[];
  AlertVehicleLink?: AlertVehicleLink[];
  AlertDriverLink?: AlertDriverLink[];
}

// Alert User Link Interface
export interface AlertUserLink extends Record<string, unknown> {
  alert_user_link_id: string;

  // Relations
  alert_id: string;
  Alert?: Alert;

  user_id: string;
  User?: User;
}

// Alert Geofence Link Interface
export interface AlertGeofenceLink extends Record<string, unknown> {
  alert_geofence_link_id: string;

  // Relations
  alert_id: string;
  Alert?: Alert;

  gps_geofence_id: string;
}

// Alert Vehicle Link Interface
export interface AlertVehicleLink extends Record<string, unknown> {
  alert_vehicle_link_id: string;

  // Relations
  alert_id: string;
  Alert?: Alert;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
}

// Alert Driver Link Interface
export interface AlertDriverLink extends Record<string, unknown> {
  alert_driver_link_id: string;

  // Relations
  alert_id: string;
  Alert?: Alert;

  driver_id: string;
  MasterDriver?: MasterDriver;
}

// ✅ Alert Create/Update Schema
export const AlertSchema = z.object({
  module: enumMandatory('Module', Module, Module.ABC),
  sub_module: enumMandatory('Sub Module', SubModule, SubModule.ABC),
  alert_type: enumMandatory('Alert Type', AlertType, AlertType.ABC),
  alert_sub_type: enumMandatory(
    'Alert Sub Type',
    AlertSubType,
    AlertSubType.ABC
  ),

  alert_key_1: stringOptional('Alert Key 1', 0, 50),
  alert_key_2: stringOptional('Alert Key 2', 0, 50),
  alert_key_3: stringOptional('Alert Key 3', 0, 50),
  alert_key_4: stringOptional('Alert Key 4', 0, 50),

  is_edit: enumOptional('Is Edit', YesNo, YesNo.No),
  is_push: enumOptional('Is Push', YesNo, YesNo.No),
  is_sms: enumOptional('Is SMS', YesNo, YesNo.No),
  is_whatsapp: enumOptional('Is WhatsApp', YesNo, YesNo.No),
  is_email: enumOptional('Is Email', YesNo, YesNo.No),

  mobile_numbers: stringOptional('Mobile Numbers', 0, 300),
  emails: stringOptional('Emails', 0, 300),

  all_vehicles: enumOptional('All Vehicles', YesNo, YesNo.No),
  all_trips: enumOptional('All Trips', YesNo, YesNo.No),
  all_geofences: enumOptional('All Geofences', YesNo, YesNo.No),
  all_drivers: enumOptional('All Drivers', YesNo, YesNo.No),

  organisation_id: single_select_mandatory('UserOrganisation'),
  user_id: single_select_mandatory('User'),
  status: enumMandatory('Status', Status, Status.Active),

  vehicle_ids: multi_select_optional('Vehicle'),
  user_ids: multi_select_optional('User'),
  driver_ids: multi_select_optional('Driver'),
  gps_geofence_ids: multi_select_optional('GPS Geofence Data'),
});
export type AlertDTO = z.infer<typeof AlertSchema>;

// ✅ Alert Query Schema
export const AlertQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'),
  user_ids: multi_select_optional('User'),
  alert_ids: multi_select_optional('Alert'),

  module: enumArrayOptional('Module', Module, getAllEnums(Module), 0, 10, true),
  sub_module: enumArrayOptional(
    'Sub Module',
    SubModule,
    getAllEnums(SubModule),
    0,
    10,
    true
  ),
  alert_type: enumArrayOptional(
    'Alert Type',
    AlertType,
    getAllEnums(AlertType),
    0,
    10,
    true
  ),
  alert_sub_type: enumArrayOptional(
    'Alert Sub Type',
    AlertSubType,
    getAllEnums(AlertSubType),
    0,
    10,
    true
  ),
  is_edit: enumArrayOptional('Is Edit', YesNo, getAllEnums(YesNo), 0, 10, true),
  is_push: enumArrayOptional('Is Push', YesNo, getAllEnums(YesNo), 0, 10, true),
  is_sms: enumArrayOptional('Is SMS', YesNo, getAllEnums(YesNo), 0, 10, true),
  is_whatsapp: enumArrayOptional(
    'Is Whatsapp',
    YesNo,
    getAllEnums(YesNo),
    0,
    10,
    true
  ),
  is_email: enumArrayOptional(
    'Is Email',
    YesNo,
    getAllEnums(YesNo),
    0,
    10,
    true
  ),
});
export type AlertQueryDTO = z.infer<typeof AlertQuerySchema>;

// Convert existing data to a payload structure
export const toAlertPayload = (alert: Alert): AlertDTO => ({
  module: alert.module,
  sub_module: alert.sub_module,
  alert_type: alert.alert_type,
  alert_sub_type: alert.alert_sub_type,

  alert_key_1: alert.alert_key_1 ?? '',
  alert_key_2: alert.alert_key_2 ?? '',
  alert_key_3: alert.alert_key_3 ?? '',
  alert_key_4: alert.alert_key_4 ?? '',

  is_edit: alert.is_edit ?? YesNo.No,
  is_push: alert.is_push ?? YesNo.No,
  is_sms: alert.is_sms ?? YesNo.No,
  is_whatsapp: alert.is_whatsapp ?? YesNo.No,
  is_email: alert.is_email ?? YesNo.No,

  mobile_numbers: alert.mobile_numbers ?? '',
  emails: alert.emails ?? '',

  all_vehicles: alert.all_vehicles ?? YesNo.No,
  all_trips: alert.all_trips ?? YesNo.No,
  all_geofences: alert.all_geofences ?? YesNo.No,
  all_drivers: alert.all_drivers ?? YesNo.No,

  user_id: alert.user_id,
  organisation_id: alert.organisation_id,
  status: alert.status,

  vehicle_ids: [],
  user_ids: [],
  driver_ids: [],
  gps_geofence_ids: [],
});

// Generate a new payload with default values
export const newAlertPayload = (): AlertDTO => ({
  module: Module.ABC,
  sub_module: SubModule.ABC,
  alert_type: AlertType.ABC,
  alert_sub_type: AlertSubType.ABC,

  alert_key_1: '',
  alert_key_2: '',
  alert_key_3: '',
  alert_key_4: '',

  is_edit: YesNo.No,
  is_push: YesNo.No,
  is_sms: YesNo.No,
  is_whatsapp: YesNo.No,
  is_email: YesNo.No,

  mobile_numbers: '',
  emails: '',

  all_vehicles: YesNo.No,
  all_trips: YesNo.No,
  all_geofences: YesNo.No,
  all_drivers: YesNo.No,

  user_id: '',
  organisation_id: '',
  status: Status.Active,
  vehicle_ids: [],
  user_ids: [],
  driver_ids: [],
  gps_geofence_ids: [],
});

// API Methods
export const findAlerts = async (
  data: AlertQueryDTO
): Promise<FBR<Alert[]>> => {
  return apiPost<FBR<Alert[]>, AlertQueryDTO>(ENDPOINTS.find, data);
};

export const createAlert = async (data: AlertDTO): Promise<SBR> => {
  return apiPost<SBR, AlertDTO>(ENDPOINTS.create, data);
};

export const updateAlert = async (id: string, data: AlertDTO): Promise<SBR> => {
  return apiPatch<SBR, AlertDTO>(ENDPOINTS.update(id), data);
};

export const deleteAlert = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
