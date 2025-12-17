// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BR, AWSPresignedUrl } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumArrayOptional,
  enumMandatory,
  getAllEnums,
  multi_select_optional,
  stringMandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, AdminRole, LoginFrom } from '../../../core/Enums';
import { Ticket } from 'src/services/account/ticket_service';

// URL and Endpoints
const URL = 'user/admin';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  admin_image_presigned_url: (fileName: string): string => `${URL}/admin_image_presigned_url/${fileName}`,

  // File Uploads
  update_admin_image: (id: string): string => `${URL}/update_admin_image/${id}`,
  delete_admin_image: (id: string): string => `${URL}/delete_admin_image/${id}`,

  // UserAdmin APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  update_profile: (id: string): string => `${URL}/update_profile/${id}`,

  // Cache APIs
  cache: `${URL}/cache`,
};

// UserAdmin Interface
export interface UserAdmin extends Record<string, unknown> {
  // Primary Fields
  admin_id: string;

  admin_name: string;
  email: string;
  password?: string;
  mobile?: string;
  admin_role: AdminRole;

  admin_image_url?: string;
  admin_image_key?: string;
  admin_image_name?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  Ticket?: Ticket[]
  UserAdminLoginPush?: UserAdminLoginPush[]

  // Relations - Child Count
  _count?: {
    Ticket?: number;
    UserAdminLoginPush?: number;
  };
}

// UserAdminLoginPush Interface
export interface UserAdminLoginPush extends Record<string, unknown> {
  admin_login_push_id: string;

  fcm_token: string;

  platform: LoginFrom;
  user_agent?: string;
  ip_address?: string;

  device_id?: string;
  device_model?: string;
  os_name?: string;
  os_version?: string;
  browser_name?: string;
  browser_version?: string;
  app_version?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  admin_id: string;
  UserAdmin?: UserAdmin;
}

// ✅ UserAdmin Create/Update Schema
export const UserAdminSchema = z.object({
  admin_name: stringMandatory('Admin Name', 3, 100),
  email: stringMandatory('Email', 3, 100),
  password: stringOptional('Password', 0, 20),
  mobile: stringOptional('Password', 0, 20),
  admin_role: enumMandatory('Admin Role', AdminRole, AdminRole.MasterAdmin),

  admin_image_url: stringOptional('Admin Image URL', 0, 300),
  admin_image_key: stringOptional('Admin Image Key', 0, 300),
  admin_image_name: stringOptional('Admin Image Name', 0, 300),

  status: enumMandatory('Status', Status, Status.Active),
});
export type UserAdminDTO = z.infer<typeof UserAdminSchema>;

// ✅ UserAdmin Logo Schema
export const UserAdminLogoSchema = z.object({
  admin_image_url: stringMandatory('Admin Image URL', 0, 300),
  admin_image_key: stringMandatory('Admin Image Key', 0, 300),
  admin_image_name: stringMandatory('Admin Image Name', 0, 300),
});
export type UserAdminLogoDTO = z.infer<typeof UserAdminLogoSchema>;

// ✅ UserAdmin Update Profile Schema
export const UserAdminProfileSchema = z.object({
  admin_name: stringMandatory('Admin Name', 3, 100),
  email: stringMandatory('Email', 3, 100),
  mobile: stringOptional('Password', 0, 20),

  admin_image_url: stringOptional('Admin Image URL', 0, 300),
  admin_image_key: stringOptional('Admin Image Key', 0, 300),
  admin_image_name: stringOptional('Admin Image Name', 0, 300),
});
export type UserAdminProfileDTO = z.infer<typeof UserAdminProfileSchema>;

// ✅ UserAdmin Query Schema
export const UserAdminQuerySchema = BaseQuerySchema.extend({
  admin_ids: multi_select_optional('UserAdmin'), // ✅ Multi-Selection -> UserAdmin
  admin_role: enumArrayOptional(
    'Admin Role',
    AdminRole,
    getAllEnums(AdminRole),
  ),
});
export type UserAdminQueryDTO = z.infer<typeof UserAdminQuerySchema>;

// Convert UserAdmin Data to API Payload
export const toUserAdminPayload = (row: UserAdmin): UserAdminDTO => ({
  admin_name: row.admin_name || '',
  email: row.email || '',
  password: row.password || '',
  mobile: row.mobile || '',
  admin_role: row.admin_role || AdminRole.MasterAdmin,
  admin_image_url: row.admin_image_url || '',
  admin_image_key: row.admin_image_key || '',
  admin_image_name: row.admin_image_name || '',
  status: row.status || Status.Active,
});

// Convert UserAdminProfile Data to API Payload
export const toUserAdminProfilePayload = (row: UserAdmin): UserAdminProfileDTO => ({
  admin_name: row.admin_name || '',
  email: row.email || '',
  mobile: row.mobile || '',
  admin_image_url: row.admin_image_url || '',
  admin_image_key: row.admin_image_key || '',
  admin_image_name: row.admin_image_name || '',
});

// Create New UserAdmin Payload
export const newUserAdminPayload = (): UserAdminDTO => ({
  admin_name: '',
  email: '',
  password: '',
  mobile: '',
  admin_role: AdminRole.MasterAdmin,
  admin_image_url: '',
  admin_image_key: '',
  admin_image_name: '',
  status: Status.Active,
});

// AWS S3 PRESIGNED
export const get_admin_image_presigned_url = async (file_name: string): Promise<BR<AWSPresignedUrl>> => {
  return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.admin_image_presigned_url(file_name));
};

// File Uploads
export const update_admin_image = async (id: string, data: UserAdminLogoDTO): Promise<SBR> => {
  return apiPatch<SBR, UserAdminLogoDTO>(ENDPOINTS.update_admin_image(id), data);
};

export const delete_admin_image = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_admin_image(id));
};

// AMasterAdmin APIs
export const findUserAdmin = async (data: UserAdminQueryDTO): Promise<FBR<UserAdmin[]>> => {
  return apiPost<FBR<UserAdmin[]>, UserAdminQueryDTO>(ENDPOINTS.find, data);
};

export const createUserAdmin = async (data: UserAdminDTO): Promise<SBR> => {
  return apiPost<SBR, UserAdminDTO>(ENDPOINTS.create, data);
};

export const updateUserAdmin = async (id: string, data: UserAdminDTO): Promise<SBR> => {
  return apiPatch<SBR, UserAdminDTO>(ENDPOINTS.update(id), data);
};

export const deleteUserAdmin = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const updateUserAdminProfile = async (id: string, data: UserAdminProfileDTO): Promise<SBR> => {
  return apiPatch<SBR, UserAdminProfileDTO>(ENDPOINTS.update_profile(id), data);
};

// Cache APIs
export const getAdminUserCache = async (): Promise<FBR<UserAdmin[]>> => {
  return apiGet<FBR<UserAdmin[]>>(ENDPOINTS.cache);
};
