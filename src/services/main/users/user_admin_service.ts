// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

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
import { Status, AdminRole } from '../../../core/Enums';

// URL and Endpoints
const URL = 'user/admin';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
 
  presigned_url: (fileName: string): string =>`${URL}/presigned_url/${fileName}`,

  // Cache
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

// Convert existing data to a payload structure
export const toUserAdminPayload = (admin: UserAdmin): UserAdminDTO => ({
  admin_name: admin.admin_name,
  email: admin.email,
  password: admin.password || '',
  mobile: admin.mobile || '',
  admin_role: admin.admin_role,
  admin_image_url: admin.admin_image_url || '',
  admin_image_key: admin.admin_image_key || '',
  admin_image_name: admin.admin_image_name || '',
  status: admin.status,
});

// Generate a new payload with default values
export const newUserAdminPayload = (): UserAdminDTO => ({
  admin_name: '',
  email: '',
  password: '',
  mobile: '',
  admin_role: AdminRole.Admin,
  admin_image_url: '',
  admin_image_key: '',
  admin_image_name: '',
  status: Status.Active,
});

// API Methods
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

// Presigned URL Fetch
export const get_presigned_url = async ( file_name: string): Promise<FBR<{ url: string }>> => {
  return apiGet<FBR<{ url: string }>>(ENDPOINTS.presigned_url(file_name));
};

// API Cache Methods
export const getAdminUserCache = async (): Promise<FBR<UserAdmin[]>> => {
  return apiGet<FBR<UserAdmin[]>>(ENDPOINTS.cache);
};
