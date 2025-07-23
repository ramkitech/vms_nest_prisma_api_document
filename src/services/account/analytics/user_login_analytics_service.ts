// Axios
import { apiPost, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  multi_select_optional,
  enumMandatory,
  dynamicJsonSchema,
} from '../../../zod_utils/zod_utils';
import { MongoBaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { LoginFrom } from '../../../core/Enums';

// URL and Endpoints
const URL = 'analytics/user_login_analytics';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  delete: (id: string): string => `${URL}/${id}`,
};

// User Login Analytics Interface
export interface UserLoginAnalytics extends Record<string, unknown> {
  // Primary Fields
  id: string;
  user_id: string; // Min: 3, Max: 100
  organisation_id: string; // Min: 3, Max: 100
  country_id: string; // Min: 3, Max: 100

  login_from: LoginFrom;
  os_details: Record<string, unknown>;
  ip_details: Record<string, unknown>;

  // Metadata
  added_date_time?: string;
}

// ✅ User Login Analytics Create Schema
export const UserLoginAnalyticsSchema = z.object({
  user_id: stringMandatory('User', 3, 100),
  organisation_id: stringMandatory('Organisation', 3, 100),
  login_from: enumMandatory('Status', LoginFrom, LoginFrom.Web),
  os_details: dynamicJsonSchema('OS Details', {}),
  ip_details: dynamicJsonSchema('IP Details', {}),
  country_id: stringMandatory('Country', 2, 100), // ✅ Country ID
});
export type UserLoginAnalyticsDTO = z.infer<typeof UserLoginAnalyticsSchema>;

// ✅ User Login Analytics Query Schema
export const UserLoginAnalyticsQuerySchema = MongoBaseQuerySchema.extend({
  user_ids: multi_select_optional('User'),
  organisation_ids: multi_select_optional('Organisation'),
  country_ids: multi_select_optional('Country'),
});
export type UserLoginAnalyticsQueryDTO = z.infer<
  typeof UserLoginAnalyticsQuerySchema
>;

// Convert existing data to a payload structure
export const toUserLoginAnalyticsPayload = (
  analytics: UserLoginAnalytics
): UserLoginAnalyticsDTO => ({
  user_id: analytics.user_id,
  organisation_id: analytics.organisation_id,
  login_from: analytics.login_from,
  os_details: analytics.os_details,
  ip_details: analytics.ip_details,
  country_id: analytics.country_id,
});

// Generate a new payload with default values
export const newUserLoginAnalyticsPayload = (): UserLoginAnalyticsDTO => ({
  user_id: '',
  organisation_id: '',
  login_from: LoginFrom.Web,
  os_details: {},
  ip_details: {},
  country_id: '',
});

// API Methods
export const findUserLoginAnalytics = async (
  data: UserLoginAnalyticsQueryDTO
): Promise<FBR<UserLoginAnalytics[]>> => {
  return apiPost<FBR<UserLoginAnalytics[]>, UserLoginAnalyticsQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createUserLoginAnalytics = async (
  data: UserLoginAnalyticsDTO
): Promise<SBR> => {
  return apiPost<SBR, UserLoginAnalyticsDTO>(ENDPOINTS.create, data);
};

export const deleteUserLoginAnalytics = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
