// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringOptional,
  enumMandatory,
  multi_select_optional,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../core/Enums';

// URL and Endpoints
const URL = 'website/contact_us_detail';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Contact Us Detail Interface
export interface ContactUsDetail extends Record<string, unknown> {
  // Primary Fields
  contact_us_details_id: string;
  mobile_number?: string; // Max: 20
  email?: string; // Max: 100
  facebook_link?: string; // Max: 200
  twitter_link?: string; // Max: 200
  instagram_link?: string; // Max: 200
  youtube_link?: string; // Max: 200
  linkedin_link?: string; // Max: 200
  pinterest_link?: string; // Max: 200
  whats_app_chat_url?: string; // Max: 200
  telegram_chat_url?: string; // Max: 200

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;
}

// ✅ Contact Us Detail Create/Update Schema
export const ContactUsDetailSchema = z.object({
  mobile_number: stringOptional('Mobile Number', 0, 20),
  email: stringOptional('Email', 0, 100),
  facebook_link: stringOptional('Facebook Link', 0, 200),
  twitter_link: stringOptional('Twitter Link', 0, 200),
  instagram_link: stringOptional('Instagram Link', 0, 200),
  youtube_link: stringOptional('Youtube Link', 0, 200),
  linkedin_link: stringOptional('Linkedin Link', 0, 200),
  pinterest_link: stringOptional('Pinterest Link', 0, 200),
  whats_app_chat_url: stringOptional('Whatsapp Chat URL', 0, 200),
  telegram_chat_url: stringOptional('Telegram Chat URL', 0, 200),
  status: enumMandatory('Status', Status, Status.Active),
});
export type ContactUsDetailDTO = z.infer<typeof ContactUsDetailSchema>;

// ✅ Contact Us Detail Query Schema
export const ContactUsDetailQuerySchema = BaseQuerySchema.extend({
  contact_us_details_ids: multi_select_optional('Contact Us Details'), // ✅ Multi-selection -> ContactUsDetail
});
export type ContactUsDetailQueryDTO = z.infer<
  typeof ContactUsDetailQuerySchema
>;

// Convert existing data to a payload structure
export const toContactUsDetailPayload = (
  detail: ContactUsDetail
): ContactUsDetailDTO => ({
  mobile_number: detail.mobile_number ?? '',
  email: detail.email ?? '',
  facebook_link: detail.facebook_link ?? '',
  twitter_link: detail.twitter_link ?? '',
  instagram_link: detail.instagram_link ?? '',
  youtube_link: detail.youtube_link ?? '',
  linkedin_link: detail.linkedin_link ?? '',
  pinterest_link: detail.pinterest_link ?? '',
  whats_app_chat_url: detail.whats_app_chat_url ?? '',
  telegram_chat_url: detail.telegram_chat_url ?? '',
  status: detail.status,
});

// Generate a new payload with default values
export const newContactUsDetailPayload = (): ContactUsDetailDTO => ({
  mobile_number: '',
  email: '',
  facebook_link: '',
  twitter_link: '',
  instagram_link: '',
  youtube_link: '',
  linkedin_link: '',
  pinterest_link: '',
  whats_app_chat_url: '',
  telegram_chat_url: '',
  status: Status.Active,
});

// API Methods
export const findContactUsDetails = async (
  data: ContactUsDetailQueryDTO
): Promise<FBR<ContactUsDetail[]>> => {
  return apiPost<FBR<ContactUsDetail[]>, ContactUsDetailQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createContactUsDetail = async (
  data: ContactUsDetailDTO
): Promise<SBR> => {
  return apiPost<SBR, ContactUsDetailDTO>(ENDPOINTS.create, data);
};

export const updateContactUsDetail = async (
  id: string,
  data: ContactUsDetailDTO
): Promise<SBR> => {
  return apiPatch<SBR, ContactUsDetailDTO>(ENDPOINTS.update(id), data);
};

export const deleteContactUsDetail = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
