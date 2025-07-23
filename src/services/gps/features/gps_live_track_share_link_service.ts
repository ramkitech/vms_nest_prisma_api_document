// Axios
import { apiPost, apiPatch, apiDelete } from 'core/apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  stringMandatory,
  stringOptional,
  single_select_mandatory,
  single_select_optional,
  multi_select_optional,
  enumArrayOptional,
  numberOptional,
  numberMandatory,
  getAllEnums,
  nestedArrayOfObjectsOptional,
  doubleOptionalLatLng,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status, LinkStatus, LinkType, NotificationType } from 'core/Enums';

// Other Models
import { MasterVehicle } from 'services/main/vehicle/master_vehicle_service';
import { UserOrganisation } from '../../main/users/user_organisation_service';

// 2. URL and Endpoints
const URL = 'gps/features/gps_live_track_share_link';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  delete: (id: string): string => `${URL}/${id}`,
  extend: (id: string): string => `${URL}/extend_live_track_link_time/${id}`,
  updateLinkStatus: (id: string): string =>
    `${URL}/update_live_track_link_status/${id}`,
  updateTripStatus: (id: string): string =>
    `${URL}/update_live_track_trip_link_status/${id}`,
  createNotification: `${URL}/create_notifications`,
};

// 3. Model Interface
export interface GPSLiveTrackShareLink extends Record<string, unknown> {
  // Primary Fields
  gps_live_track_share_link_id: string;
  link_type: LinkType;
  latitude?: number;
  longitude?: number;
  location?: string;
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

  trip_id?: string;
  // Trip?: Trip;

  // Child
  GPSLiveTrackShareLinkNotifications?: GPSLiveTrackShareLinkNotification[];
}

// Child Interface
export interface GPSLiveTrackShareLinkNotification
  extends Record<string, unknown> {
  gps_live_track_share_link_notifications_id: string;
  type: NotificationType;
  to_recipients: string;

  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  gps_live_track_share_link_id: string;
  GPSLiveTrackShareLink?: GPSLiveTrackShareLink;
}

// ✅ GPS Live Track Share Link Notifications Create/Update Schema
export const GPSLiveTrackShareLinkNotificationsSchema = z.object({
  organisation_id: single_select_optional('Organisation ID'),
  gps_live_track_share_link_id: single_select_optional(
    'GPS Live Track Share Link ID'
  ),
  type: enumMandatory('Type', NotificationType, NotificationType.Email),
  to_recipients: stringMandatory('To Recipients', 3, 500),
  status: enumMandatory('Status', Status, Status.Active),
});
export type GPSLiveTrackShareLinkNotificationsDTO = z.infer<
  typeof GPSLiveTrackShareLinkNotificationsSchema
>;

// ✅ GPS Live Track Share Link Create Schema
export const GPSLiveTrackShareLinkSchema = z.object({
  organisation_id: single_select_mandatory('Organisation ID'),
  vehicle_id: single_select_mandatory('Vehicle ID'),

  link_type: enumMandatory('Link Type', LinkType, LinkType.LiveLocation),

  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  location: stringOptional('Location', 0, 500),

  expire_milliseconds: numberOptional('Expire Milliseconds'),

  trip_id: single_select_optional('Trip ID'),

  link_status: enumMandatory('Link Status', LinkStatus, LinkStatus.Active),
  status: enumMandatory('Status', Status, Status.Active),

  notifications: nestedArrayOfObjectsOptional(
    'Notifications',
    GPSLiveTrackShareLinkNotificationsSchema,
    []
  ),
});
export type GPSLiveTrackShareLinkDTO = z.infer<
  typeof GPSLiveTrackShareLinkSchema
>;

// ✅ GPS Live Track Share Link Update Time Schema
export const GPSLiveTrackShareLinkTimeSchema = z.object({
  expire_milliseconds: numberMandatory('Expire Milliseconds'),
});
export type GPSLiveTrackShareLinkTimeDTO = z.infer<
  typeof GPSLiveTrackShareLinkTimeSchema
>;

// ✅ GPS Live Track Share Link Update Link Status Schema
export const GPSLiveTrackShareLinkStatusSchema = z.object({
  link_status: enumMandatory('Link Status', LinkStatus, LinkStatus.Active),
});
export type GPSLiveTrackShareLinkStatusDTO = z.infer<
  typeof GPSLiveTrackShareLinkStatusSchema
>;

// ✅ GPS Live Track Share Link Query Schema
export const GPSLiveTrackShareLinkQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('Master Vehicle IDs'), // ✅ Multi-selection -> MasterVehicle
  trip_ids: multi_select_optional('Trip IDs'), // ✅ Multi-selection -> Trip
  link_type: enumArrayOptional('Link Type', LinkType, getAllEnums(LinkType)),
  link_status: enumArrayOptional(
    'Link Status',
    LinkStatus,
    getAllEnums(LinkStatus)
  ),
});
export type GPSLiveTrackShareLinkQueryDTO = z.infer<
  typeof GPSLiveTrackShareLinkQuerySchema
>;

// 5. Payload Conversions
export const toGPSLiveTrackShareLinkPayload = (
  data: GPSLiveTrackShareLink
): GPSLiveTrackShareLinkDTO => ({
  organisation_id: data.organisation_id,
  vehicle_id: data.vehicle_id,
  link_type: data.link_type,
  latitude: data.latitude,
  longitude: data.longitude,
  location: data.location || '',
  expire_milliseconds: 0,
  trip_id: data.trip_id || '',
  link_status: data.link_status,
  status: data.status,
  notifications: [],
});

export const newGPSLiveTrackShareLinkPayload =
  (): GPSLiveTrackShareLinkDTO => ({
    organisation_id: '',
    vehicle_id: '',
    link_type: LinkType.CurrentLocation,
    latitude: undefined,
    longitude: undefined,
    location: '',
    expire_milliseconds: 0,
    trip_id: '',
    link_status: LinkStatus.Active,
    status: Status.Active,
    notifications: [],
  });

// 6. API Methods (CRUD)
export const findGPSLiveTrackShareLinks = async (
  data: GPSLiveTrackShareLinkQueryDTO
): Promise<FBR<GPSLiveTrackShareLink[]>> => {
  return apiPost<FBR<GPSLiveTrackShareLink[]>, GPSLiveTrackShareLinkQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createGPSLiveTrackShareLink = async (
  data: GPSLiveTrackShareLinkDTO
): Promise<SBR> => {
  return apiPost<SBR, GPSLiveTrackShareLinkDTO>(ENDPOINTS.create, data);
};

export const deleteGPSLiveTrackShareLink = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const extendGPSLiveTrackLinkTime = async (
  id: string,
  data: GPSLiveTrackShareLinkTimeDTO
): Promise<SBR> => {
  return apiPatch<SBR, GPSLiveTrackShareLinkTimeDTO>(
    ENDPOINTS.extend(id),
    data
  );
};

export const updateGPSLiveTrackLinkStatus = async (
  id: string,
  data: GPSLiveTrackShareLinkStatusDTO
): Promise<SBR> => {
  return apiPatch<SBR, GPSLiveTrackShareLinkStatusDTO>(
    ENDPOINTS.updateLinkStatus(id),
    data
  );
};

export const updateGPSLiveTrackTripStatus = async (
  id: string
): Promise<SBR> => {
  return apiPatch<SBR, unknown>(ENDPOINTS.updateTripStatus(id), {});
};

export const createGPSLiveTrackNotification = async (
  data: GPSLiveTrackShareLinkNotificationsDTO
): Promise<SBR> => {
  return apiPost<SBR, GPSLiveTrackShareLinkNotificationsDTO>(
    ENDPOINTS.createNotification,
    data
  );
};
