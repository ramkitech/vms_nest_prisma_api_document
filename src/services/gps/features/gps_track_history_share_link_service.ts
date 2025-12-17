// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  enumArrayOptional,
  single_select_optional,
  single_select_mandatory,
  multi_select_optional,
  getAllEnums,
  stringOptional,
  enumArrayMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, TrackHistoryLinkStatus, ShareChannel } from '../../../core/Enums';

// Other Models
import { MasterVehicle } from '../../../services/main/vehicle/master_vehicle_service';
import { UserOrganisation } from '../../main/users/user_organisation_service';

const URL = 'gps/features/gps_track_history_share_link';

const ENDPOINTS = {
  // GPSTrackHistoryShareLink APIs
  find: `${URL}/search`,
  create_notification: `${URL}/create_notification`,
  create: URL,
  update_track_history_link_status: (id: string): string => `${URL}/update_track_history_link_status/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// GPSTrackHistoryShareLink Interface
export interface GPSTrackHistoryShareLink extends Record<string, unknown> {
  // Primary Fields
  gps_track_history_share_link_id: string;

  // Main Field Details
  from_date_time: string;
  to_date_time: string;
  link_status: TrackHistoryLinkStatus;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  // Relations - Child
  GPSTrackHistoryShareLinkNotification?: GPSTrackHistoryShareLinkNotification[];

  // Relations - Child Count
  _count?: {
    GPSTrackHistoryShareLinkNotification?: number;
  };
}

// GPSTrackHistoryShareLinkNotification Interface
export interface GPSTrackHistoryShareLinkNotification extends Record<string, unknown> {
  // Primary Fields
  gps_track_history_share_link_notification_id: string;

  // Main Field Details
  share_channels: ShareChannel[];
  mobile_numbers?: string;
  email_ids?: string;
  cc_email_ids?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  gps_track_history_share_link_id: string;
  GPSTrackHistoryShareLink?: GPSTrackHistoryShareLink;
}

// GPSTrackHistoryShareLinkNotification Create/Update Schema
export const GPSTrackHistoryShareLinkNotificationSchema = z.object({
  organisation_id: single_select_optional('UserOrganisation'), // Single-Selection -> UserOrganisation
  gps_track_history_share_link_id: single_select_optional(
    'GPSTrackHistoryShareLink',
  ),
  share_channels: enumArrayMandatory(
    'Share Channels',
    ShareChannel,
    getAllEnums(ShareChannel),
  ),
  mobile_numbers: stringOptional('Mobile Numbers', 0, 300),
  email_ids: stringOptional('Email IDs', 0, 300),
  cc_email_ids: stringOptional('CC email IDs', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type GPSTrackHistoryShareLinkNotificationDTO = z.infer<
  typeof GPSTrackHistoryShareLinkNotificationSchema
>;

// GPSTrackHistoryShareLink Create/Update Schema
export const GPSTrackHistoryShareLinkSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  vehicle_id: single_select_mandatory('MasterVehicle'),
  from_date_time: stringMandatory('From Date Time'),
  to_date_time: stringMandatory('To Date Time'),

  link_status: enumMandatory(
    'Track History Link Status',
    TrackHistoryLinkStatus,
    TrackHistoryLinkStatus.Active,
  ),
  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type GPSTrackHistoryShareLinkDTO = z.infer<
  typeof GPSTrackHistoryShareLinkSchema
>;

// GPSTrackHistoryShareLink Update Link Status Schema
export const GPSTrackHistoryShareLinkUpdateLinkStatusSchema = z.object({
  link_status: enumMandatory(
    'Track History Link Status',
    TrackHistoryLinkStatus,
    TrackHistoryLinkStatus.Active,
  ),
});
export type GPSTrackHistoryShareLinkUpdateLinkStatusDTO = z.infer<
  typeof GPSTrackHistoryShareLinkUpdateLinkStatusSchema
>;

// GPSTrackHistoryShareLink Query Schema
export const GPSTrackHistoryShareLinkQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle
  link_status: enumArrayOptional(
    'Track History Link Status',
    TrackHistoryLinkStatus,
    getAllEnums(TrackHistoryLinkStatus),
  ),
  gps_track_history_share_link_ids: multi_select_optional(
    'GPSTrackHistoryShareLink',
  ), // Multi-selection -> GPSTrackHistoryShareLink
});

export type GPSTrackHistoryShareLinkQueryDTO = z.infer<
  typeof GPSTrackHistoryShareLinkQuerySchema
>;

// Convert GPSTrackHistoryShareLink Data to API Payload
export const toGPSTrackHistoryShareLinkPayload = (data: GPSTrackHistoryShareLink): GPSTrackHistoryShareLinkDTO => ({
  organisation_id: data.organisation_id || '',
  vehicle_id: data.vehicle_id || '',

  from_date_time: data.from_date_time || '',
  to_date_time: data.to_date_time || '',
  link_status: data.link_status || TrackHistoryLinkStatus.Active,
  
  status: data.status || Status.Active,
  time_zone_id: '', // Needs to be provided manually
});

// Create New GPSTrackHistoryShareLink Payload
export const newGPSTrackHistoryShareLinkPayload = (): GPSTrackHistoryShareLinkDTO => ({
  organisation_id: '',
  vehicle_id: '',

  from_date_time: '',
  to_date_time: '',
  link_status: TrackHistoryLinkStatus.Active,

  status: Status.Active,
  time_zone_id: '', // Needs to be provided manually
});

// GPSTrackHistoryShareLink APIs
export const findGPSTrackHistoryShareLink = async (data: GPSTrackHistoryShareLinkQueryDTO): Promise<FBR<GPSTrackHistoryShareLink[]>> => {
  return apiPost<FBR<GPSTrackHistoryShareLink[]>, GPSTrackHistoryShareLinkQueryDTO>(ENDPOINTS.find, data);
};

export const createGPSTrackHistoryShareLink = async (data: GPSTrackHistoryShareLinkDTO): Promise<BR<GPSTrackHistoryShareLink>> => {
  return apiPost<BR<GPSTrackHistoryShareLink>, GPSTrackHistoryShareLinkDTO>(ENDPOINTS.create, data);
};

export const updateTrackHistoryLinkStatus = async (id: string, data: GPSTrackHistoryShareLinkUpdateLinkStatusDTO): Promise<SBR> => {
  return apiPatch<SBR, GPSTrackHistoryShareLinkUpdateLinkStatusDTO>(ENDPOINTS.update_track_history_link_status(id), data);
};

export const deleteGPSTrackHistoryShareLink = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const createGPSTrackHistoryShareLinkNotification = async (data: GPSTrackHistoryShareLinkNotificationDTO): Promise<SBR> => {
  return apiPost<SBR, GPSTrackHistoryShareLinkNotificationDTO>(ENDPOINTS.create_notification, data);
};
