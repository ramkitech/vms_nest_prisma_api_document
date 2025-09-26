// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  stringOptional,
  single_select_mandatory,
  single_select_optional,
  multi_select_optional,
  enumArrayOptional,
  numberOptional,
  numberMandatory,
  getAllEnums,
  nestedArrayOfObjectsOptional,
  enumArrayMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, LinkStatus, LinkType, NotificationChannel, } from '../../../core/Enums';

// Other Models
import { MasterVehicle } from '../../../services/main/vehicle/master_vehicle_service';
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { MasterMainLandmark } from 'src/services/master/main/master_main_landmark_service';

const URL = 'gps/features/gps_live_track_share_link';

const ENDPOINTS = {
  find: `${URL}/search`,
  create_notification: `${URL}/create_notification`,
  create: URL,
  extend_live_track_link_time: (id: string): string => `${URL}/extend_live_track_link_time/${id}`,
  update_live_track_link_status: (id: string): string => `${URL}/update_live_track_link_status/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// GPSLiveTrackShareLink Interface
export interface GPSLiveTrackShareLink extends Record<string, unknown> {

  gps_live_track_share_link_id: string;

  // Primary Fields
  link_type: LinkType;

  // Location Details
  latitude?: number;
  longitude?: number;
  google_location?: string;

  landmark_id?: string;
  MasterMainLandmark?: MasterMainLandmark;
  landmark_location?: string;
  landmark_distance?: number;

  expiry_date_time: string;
  link_status: LinkStatus;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  // Relations - Child
  GPSLiveTrackShareLinkNotifications?: GPSLiveTrackShareLinkNotification[];

  // Count
  _count?: {
    GPSLiveTrackShareLinkNotification?: number;
  };
}

// GPSLiveTrackShareLinkNotification Interface
export interface GPSLiveTrackShareLinkNotification extends Record<string, unknown> {

  gps_live_track_share_link_notification_id: string;

  // Primary Fields
  notification_channels: NotificationChannel[];
  mobile_numbers?: string;
  email_ids?: string;
  cc_email_ids?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  gps_live_track_share_link_id: string;
  GPSLiveTrackShareLink?: GPSLiveTrackShareLink;

  // Relations - Child

  // Count
  _count?: {

  };
}

// ✅ GPSLiveTrackShareLinkNotification Create/Update Schema
export const GPSLiveTrackShareLinkNotificationSchema = z.object({
  organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  gps_live_track_share_link_id: single_select_optional('GPSLiveTrackShareLink'),
  notification_channels: enumArrayMandatory(
    'Notification Channels',
    NotificationChannel,
    getAllEnums(NotificationChannel),
  ),
  mobile_numbers: stringOptional('Mobile Numbers', 0, 300),
  email_ids: stringOptional('Email IDs', 0, 300),
  cc_email_ids: stringOptional('CC email IDs', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type GPSLiveTrackShareLinkNotificationDTO = z.infer<
  typeof GPSLiveTrackShareLinkNotificationSchema
>;

// ✅ GPSLiveTrackShareLink Create Schema
export const GPSLiveTrackShareLinkSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  vehicle_id: single_select_mandatory('Vehicle ID'),

  link_type: enumMandatory('Link Type', LinkType, LinkType.CurrentLocation),

  expire_milliseconds: numberOptional('Expire Milliseconds'),

  link_status: enumMandatory('Link Status', LinkStatus, LinkStatus.Active),
  status: enumMandatory('Status', Status, Status.Active),

  GPSLiveTrackShareLinkNotification: nestedArrayOfObjectsOptional(
    'GPSLiveTrackShareLinkNotification',
    GPSLiveTrackShareLinkNotificationSchema,
    [],
  ),
});
export type GPSLiveTrackShareLinkDTO = z.infer<
  typeof GPSLiveTrackShareLinkSchema
>;

// ✅ GPSLiveTrackShareLink Update Time Schema
export const GPSLiveTrackShareLinkTimeSchema = z.object({
  expire_milliseconds: numberMandatory('Expire Milliseconds'),
});
export type GPSLiveTrackShareLinkTimeDTO = z.infer<
  typeof GPSLiveTrackShareLinkTimeSchema
>;

// ✅ GPSLiveTrackShareLinkk Update Link Status Schema
export const GPSLiveTrackShareLinkStatusSchema = z.object({
  link_status: enumMandatory('Link Status', LinkStatus, LinkStatus.Active),
});
export type GPSLiveTrackShareLinkStatusDTO = z.infer<
  typeof GPSLiveTrackShareLinkStatusSchema
>;

// ✅ GPSLiveTrackShareLink Query Schema
export const GPSLiveTrackShareLinkQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-selection -> MasterVehicle
  link_type: enumArrayOptional('Link Type', LinkType, getAllEnums(LinkType)),
  link_status: enumArrayOptional(
    'Link Status',
    LinkStatus,
    getAllEnums(LinkStatus),
  ),
  gps_live_track_share_link_ids: multi_select_optional('GPSLiveTrackShareLink'), // ✅ Multi-selection -> GPSLiveTrackShareLink
});
export type GPSLiveTrackShareLinkQueryDTO = z.infer<
  typeof GPSLiveTrackShareLinkQuerySchema
>;

// Convert existing data to a payload structure
export const toGPSLiveTrackShareLinkPayload = (data: GPSLiveTrackShareLink): GPSLiveTrackShareLinkDTO => ({
  organisation_id: data.organisation_id,
  vehicle_id: data.vehicle_id,
  link_type: data.link_type,
  expire_milliseconds: 0,
  link_status: data.link_status,
  status: data.status,
  GPSLiveTrackShareLinkNotification: [],
});

// Generate a new payload with default values
export const newGPSLiveTrackShareLinkPayload = (): GPSLiveTrackShareLinkDTO => ({
  organisation_id: '',
  vehicle_id: '',
  link_type: LinkType.CurrentLocation,
  expire_milliseconds: 0,
  link_status: LinkStatus.Active,
  status: Status.Active,
  GPSLiveTrackShareLinkNotification: [],
});

// API Methods
export const findGPSLiveTrackShareLink = async (data: GPSLiveTrackShareLinkQueryDTO): Promise<FBR<GPSLiveTrackShareLink[]>> => {
  return apiPost<FBR<GPSLiveTrackShareLink[]>, GPSLiveTrackShareLinkQueryDTO>(ENDPOINTS.find, data);
};

export const createGPSLiveTrackShareLink = async (data: GPSLiveTrackShareLinkDTO): Promise<SBR> => {
  return apiPost<SBR, GPSLiveTrackShareLinkDTO>(ENDPOINTS.create, data);
};

export const extendGPSLiveTrackLinkTime = async (id: string, data: GPSLiveTrackShareLinkTimeDTO): Promise<SBR> => {
  return apiPatch<SBR, GPSLiveTrackShareLinkTimeDTO>(ENDPOINTS.extend_live_track_link_time(id), data);
};

export const updateGPSLiveTrackLinkStatus = async (id: string, data: GPSLiveTrackShareLinkStatusDTO): Promise<SBR> => {
  return apiPatch<SBR, GPSLiveTrackShareLinkStatusDTO>(ENDPOINTS.update_live_track_link_status(id), data);
};

export const deleteGPSLiveTrackShareLink = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const createGPSLiveTrackShareLinkNotification = async (data: GPSLiveTrackShareLinkNotificationDTO): Promise<SBR> => {
  return apiPost<SBR, GPSLiveTrackShareLinkNotificationDTO>(ENDPOINTS.create_notification, data);
};
