// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumArrayOptional,
  enumMandatory,
  enumOptional,
  getAllEnums,
  multi_select_optional,
  single_select_mandatory,
  stringMandatory,
  stringOptional,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../core/Enums';

// Other Models
import { Alert } from '../../services/account/alert_service';
import { User } from '../../services/main/users/user_service';
import { UserOrganisation } from '../../services/main/users/user_organisation_service';

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
  // Primary Fields
  notification_id: string;
  notification_title: string;
  notification_message: string;

  is_push_sent?: YesNo;
  is_sms_sent?: YesNo;
  is_whatsapp_sent?: YesNo;
  is_email_sent?: YesNo;

  mobile_numbers?: string;
  emails?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  alert_id: string;
  Alert?: Alert;

  // Relations - Child
  NotificationUserLink?: NotificationUserLink[];
}

// Alert User Link Interface
export interface NotificationUserLink extends Record<string, unknown> {
  alert_user_link_id: string;

  // Relations
  notification_id: string;
  Notification?: Notification;

  user_id: string;
  User?: User;
}

// ✅ Notification Create/Update Schema
export const NotificationSchema = z.object({
  notification_title: stringMandatory('Notification Title', 3, 100),
  notification_message: stringMandatory('Notification Message', 3, 500),

  is_push_sent: enumOptional('Is Push Sent', YesNo, YesNo.No),
  is_sms_sent: enumOptional('Is SMS Sent', YesNo, YesNo.No),
  is_whatsapp_sent: enumOptional('Is WhatsApp Sent', YesNo, YesNo.No),
  is_email_sent: enumOptional('Is Email Sent', YesNo, YesNo.No),

  mobile_numbers: stringOptional('Mobile Numbers', 0, 300),
  emails: stringOptional('Emails', 0, 300),

  alert_id: single_select_mandatory('Alert'),
  organisation_id: single_select_mandatory('Organisation'),
  user_ids: multi_select_optional('User'),
  status: enumMandatory('Status', Status, Status.Active),
});
export type NotificationDTO = z.infer<typeof NotificationSchema>;

// ✅ Notification Query Schema
export const NotificationQuerySchema = BaseQuerySchema.extend({
  alert_ids: multi_select_optional('Alert'),
  organisation_ids: multi_select_optional('Organisation'),
  notification_ids: multi_select_optional('Notification'),
  is_push_sent: enumArrayOptional(
    'Is Push Sent',
    YesNo,
    getAllEnums(YesNo),
    0,
    10,
    true
  ),
  is_sms_sent: enumArrayOptional(
    'Is SMS Sent',
    YesNo,
    getAllEnums(YesNo),
    0,
    10,
    true
  ),
  is_whatsapp_sent: enumArrayOptional(
    'Is Whatsapp Sent',
    YesNo,
    getAllEnums(YesNo),
    0,
    10,
    true
  ),
  is_email_sent: enumArrayOptional(
    'Is Email Sent',
    YesNo,
    getAllEnums(YesNo),
    0,
    10,
    true
  ),
});
export type NotificationQueryDTO = z.infer<typeof NotificationQuerySchema>;

// Convert existing data to a payload structure
export const toNotificationPayload = (
  notification: Notification
): NotificationDTO => ({
  notification_title: notification.notification_title,
  notification_message: notification.notification_message,

  is_push_sent: notification.is_push_sent ?? YesNo.No,
  is_sms_sent: notification.is_sms_sent ?? YesNo.No,
  is_whatsapp_sent: notification.is_whatsapp_sent ?? YesNo.No,
  is_email_sent: notification.is_email_sent ?? YesNo.No,

  mobile_numbers: notification.mobile_numbers ?? '',
  emails: notification.emails ?? '',

  alert_id: notification.alert_id,
  organisation_id: notification.organisation_id,
  user_ids: [],
  status: notification.status,
});

// Generate a new payload with default values
export const newNotificationPayload = (): NotificationDTO => ({
  notification_title: '',
  notification_message: '',

  is_push_sent: YesNo.No,
  is_sms_sent: YesNo.No,
  is_whatsapp_sent: YesNo.No,
  is_email_sent: YesNo.No,

  mobile_numbers: '',
  emails: '',

  alert_id: '',
  organisation_id: '',
  user_ids: [],
  status: Status.Active,
});

// API Methods
export const findNotifications = async (
  data: NotificationQueryDTO
): Promise<FBR<Notification[]>> => {
  return apiPost<FBR<Notification[]>, NotificationQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createNotification = async (
  data: NotificationDTO
): Promise<SBR> => {
  return apiPost<SBR, NotificationDTO>(ENDPOINTS.create, data);
};

export const updateNotification = async (
  id: string,
  data: NotificationDTO
): Promise<SBR> => {
  return apiPatch<SBR, NotificationDTO>(ENDPOINTS.update(id), data);
};

export const deleteNotification = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
