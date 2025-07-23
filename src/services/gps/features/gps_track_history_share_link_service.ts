// Axios
import { apiPost, apiPatch, apiDelete } from 'core/apiCall';
import { SBR, FBR } from 'core/BaseResponse';

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
  nestedArrayOfObjectsOptional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status, NotificationType, TrackHistoryLinkStatus } from 'core/Enums';

// Other Models
import { MasterVehicle } from 'services/main/vehicle/master_vehicle_service';
import { UserOrganisation } from '../../main/users/user_organisation_service';

// 2. URL and Endpoints
const URL = 'gps/features/gps_track_history_share_link';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  createNotification: `${URL}/create_notifications`,
};

// 3. Model Interface
export interface GPSTrackHistoryShareLink extends Record<string, unknown> {
  // Primary Fields
  gps_track_history_share_link_id: string;
  from_date_time: string;
  to_date_time: string;
  expiry_date_time: string;
  link_status: TrackHistoryLinkStatus;

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
  GPSTrackHistoryShareLinkNotifications?: GPSTrackHistoryShareLinkNotification[];
}

export interface GPSTrackHistoryShareLinkNotification
  extends Record<string, unknown> {
  gps_track_history_share_link_notifications_id: string;
  type: NotificationType;
  to_recipients: string;
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  gps_track_history_share_link_id: string;
  GPSTrackHistoryShareLink?: GPSTrackHistoryShareLink;
}

// ✅ GPS Track History Share Link Notifications Create/Update Schema
export const GPSTrackHistoryShareLinkNotificationsSchema = z.object({
  organisation_id: single_select_optional('Organisation ID'),
  gps_track_history_share_link_id: single_select_optional(
    'GPS Track History Share Link ID'
  ),
  type: enumMandatory('Type', NotificationType, NotificationType.Email),
  to_recipients: stringMandatory('To Recipients', 3, 500),
  status: enumMandatory('Status', Status, Status.Active),
});
export type GPSTrackHistoryShareLinkNotificationsDTO = z.infer<
  typeof GPSTrackHistoryShareLinkNotificationsSchema
>;

// ✅ GPS Track History Share Link Create/Update Schema
export const GPSTrackHistoryShareLinkSchema = z.object({
  organisation_id: single_select_mandatory('Organisation ID'),
  vehicle_id: single_select_mandatory('MasterVehicle ID'),
  trip_id: single_select_optional('Trip ID'),
  from_date_time: stringMandatory('From Date Time'),
  to_date_time: stringMandatory('To Date Time'),

  link_status: enumMandatory(
    'Track History Link Status',
    TrackHistoryLinkStatus,
    TrackHistoryLinkStatus.Active
  ),
  status: enumMandatory('Status', Status, Status.Active),

  notifications: nestedArrayOfObjectsOptional(
    'Notifications',
    GPSTrackHistoryShareLinkNotificationsSchema,
    []
  ),
});
export type GPSTrackHistoryShareLinkDTO = z.infer<
  typeof GPSTrackHistoryShareLinkSchema
>;

// ✅ GPS Track History Share Link Query Schema
export const GPSTrackHistoryShareLinkQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle IDs'), // ✅ Multi-selection -> MasterVehicle
  trip_ids: multi_select_optional('Trip IDs'), // ✅ Multi-selection -> Trip
  link_status: enumArrayOptional(
    'Track History Link Status',
    TrackHistoryLinkStatus,
    getAllEnums(TrackHistoryLinkStatus)
  ),
});

export type GPSTrackHistoryShareLinkQueryDTO = z.infer<
  typeof GPSTrackHistoryShareLinkQuerySchema
>;

// 5. Payload Conversions
export const toGPSTrackHistoryShareLinkPayload = (
  link: GPSTrackHistoryShareLink
): GPSTrackHistoryShareLinkDTO => ({
  organisation_id: link.organisation_id,
  vehicle_id: link.vehicle_id,
  trip_id: link.trip_id ?? '',
  from_date_time: link.from_date_time,
  to_date_time: link.to_date_time,
  link_status: link.link_status,
  status: link.status,
  notifications: [],
});

export const newGPSTrackHistoryShareLinkPayload =
  (): GPSTrackHistoryShareLinkDTO => ({
    organisation_id: '',
    vehicle_id: '',
    trip_id: '',
    from_date_time: '',
    to_date_time: '',
    link_status: TrackHistoryLinkStatus.Active,
    status: Status.Active,
    notifications: [],
  });

// 6. API Methods (CRUD)
export const findGPSTrackHistoryShareLinks = async (
  data: GPSTrackHistoryShareLinkQueryDTO
): Promise<FBR<GPSTrackHistoryShareLink[]>> => {
  return apiPost<
    FBR<GPSTrackHistoryShareLink[]>,
    GPSTrackHistoryShareLinkQueryDTO
  >(ENDPOINTS.find, data);
};

export const createGPSTrackHistoryShareLink = async (
  data: GPSTrackHistoryShareLinkDTO
): Promise<SBR> => {
  return apiPost<SBR, GPSTrackHistoryShareLinkDTO>(ENDPOINTS.create, data);
};

export const updateGPSTrackHistoryShareLink = async (
  id: string,
  data: GPSTrackHistoryShareLinkDTO
): Promise<SBR> => {
  return apiPatch<SBR, GPSTrackHistoryShareLinkDTO>(ENDPOINTS.update(id), data);
};

export const deleteGPSTrackHistoryShareLink = async (
  id: string
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const createGPSTrackHistoryNotification = async (
  data: GPSTrackHistoryShareLinkNotificationsDTO
): Promise<SBR> => {
  return apiPost<SBR, GPSTrackHistoryShareLinkNotificationsDTO>(
    ENDPOINTS.createNotification,
    data
  );
};
