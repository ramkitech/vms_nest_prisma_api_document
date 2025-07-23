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
const URL = 'website/faq';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// FAQ Interface
export interface FAQ extends Record<string, unknown> {
  // Primary Fields
  faq_id: string;
  faq_section?: string; // Max: 50
  faq_header?: string; // Max: 50
  faq_content?: string; // Max: 200

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;
}

// ✅ FAQ Create/Update Schema
export const FaqSchema = z.object({
  faq_section: stringOptional('FAQ Section', 0, 50),
  faq_header: stringOptional('FAQ Header', 0, 50),
  faq_content: stringOptional('FAQ Content', 0, 200),
  status: enumMandatory('Status', Status, Status.Active),
});
export type FaqDTO = z.infer<typeof FaqSchema>;

// ✅ FAQ Query Schema
export const FaqQuerySchema = BaseQuerySchema.extend({
  faq_ids: multi_select_optional('FAQ'), // ✅ Multi-selection -> FAQ
});
export type FaqQueryDTO = z.infer<typeof FaqQuerySchema>;

// Convert existing data to a payload structure
export const toFaqPayload = (faq: FAQ): FaqDTO => ({
  faq_section: faq.faq_section ?? '',
  faq_header: faq.faq_header ?? '',
  faq_content: faq.faq_content ?? '',
  status: faq.status,
});

// Generate a new payload with default values
export const newFaqPayload = (): FaqDTO => ({
  faq_section: '',
  faq_header: '',
  faq_content: '',
  status: Status.Active,
});

// API Methods
export const findFaqs = async (data: FaqQueryDTO): Promise<FBR<FAQ[]>> => {
  return apiPost<FBR<FAQ[]>, FaqQueryDTO>(ENDPOINTS.find, data);
};

export const createFaq = async (data: FaqDTO): Promise<SBR> => {
  return apiPost<SBR, FaqDTO>(ENDPOINTS.create, data);
};

export const updateFaq = async (id: string, data: FaqDTO): Promise<SBR> => {
  return apiPatch<SBR, FaqDTO>(ENDPOINTS.update(id), data);
};

export const deleteFaq = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
