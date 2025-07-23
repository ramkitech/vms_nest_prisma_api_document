// Axios
import { apiPost, apiDelete } from 'core/apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import { stringMandatory, multi_select_optional } from 'zod/zod_utils';
import { MongoBaseQuerySchema } from 'zod/zod_base_schema';

// URL and Endpoints
const URL = 'analytics/user_page_analytics';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  delete: (id: string): string => `${URL}/${id}`,
};

// User Page Analytics Interface
export interface UserPageAnalytics extends Record<string, unknown> {
  // Primary Fields
  id: string;
  user_id: string; // Min: 3, Max: 100
  organisation_id: string; // Min: 3, Max: 100
  page: string; // Min: 3, Max: 100
  sub_module: string; // Min: 3, Max: 100
  main_module: string; // Min: 3, Max: 100

  // Metadata
  added_date_time?: string;
}

// ✅ User Page Analytics Create Schema
export const UserPageAnalyticsSchema = z.object({
  user_id: stringMandatory('User', 3, 100),
  organisation_id: stringMandatory('Organisation', 3, 100),
  page: stringMandatory('Page', 3, 100),
  sub_module: stringMandatory('Sub Module', 3, 100),
  main_module: stringMandatory('Main Module', 3, 100),
});
export type UserPageAnalyticsDTO = z.infer<typeof UserPageAnalyticsSchema>;

// ✅ User Page Analytics Query Schema
export const UserPageAnalyticsQuerySchema = MongoBaseQuerySchema.extend({
  user_ids: multi_select_optional('User'),
  organisation_ids: multi_select_optional('Organisation'),
});
export type UserPageAnalyticsQueryDTO = z.infer<
  typeof UserPageAnalyticsQuerySchema
>;

// Convert existing data to a payload structure
export const toUserPageAnalyticsPayload = (
  analytics: UserPageAnalytics
): UserPageAnalyticsDTO => ({
  user_id: analytics.user_id,
  organisation_id: analytics.organisation_id,
  page: analytics.page,
  sub_module: analytics.sub_module,
  main_module: analytics.main_module,
});

// Generate a new payload with default values
export const newUserPageAnalyticsPayload = (): UserPageAnalyticsDTO => ({
  user_id: '',
  organisation_id: '',
  page: '',
  sub_module: '',
  main_module: '',
});

// API Methods
export const findUserPageAnalytics = async (
  data: UserPageAnalyticsQueryDTO
): Promise<FBR<UserPageAnalytics[]>> => {
  return apiPost<FBR<UserPageAnalytics[]>, UserPageAnalyticsQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createUserPageAnalytics = async (
  data: UserPageAnalyticsDTO
): Promise<SBR> => {
  return apiPost<SBR, UserPageAnalyticsDTO>(ENDPOINTS.create, data);
};

export const deleteUserPageAnalytics = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
