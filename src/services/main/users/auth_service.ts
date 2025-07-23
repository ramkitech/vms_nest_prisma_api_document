// Imports
import { apiPost } from '../../../core/apiCall';
import { BR, SBR } from '../../../core/BaseResponse';

// Zod
import { stringMandatory, stringUUIDMandatory } from '../../../zod_utils/zod_utils';
import { z } from 'zod';
import { User } from './user_service';
import { UserAdmin } from './user_admin_service';

const URL = 'user/auth';

const ENDPOINTS = {
  user_login: `${URL}/user_login`,
  admin_login: `${URL}/admin_login`,
  user_change_password: `${URL}/user_change_password`,
};

export interface UserResponse extends Record<string, unknown> {
  access_token: string;
  user: User;
}

export interface AdminResponse extends Record<string, unknown> {
  access_token: string;
  user: UserAdmin;
}

export const LoginUserSchema = z.object({
  identifier: stringMandatory('Identifier', 3, 100),
  password: stringMandatory('Password', 3, 20),
});
export type LoginUserDTO = z.infer<typeof LoginUserSchema>;

export const LoginAdminSchema = z.object({
  email: stringMandatory('Email', 3, 100),
  password: stringMandatory('Password', 3, 20),
});
export type LoginAdminDTO = z.infer<typeof LoginAdminSchema>;

export const ChangePasswordSchema = z.object({
  user_id: stringUUIDMandatory('user_id'),
  old_password: stringMandatory('Old Password', 3, 20),
  new_password: stringMandatory('New Password', 3, 20),
  confirm_password: stringMandatory('Confirm Password', 3, 20),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export type ChangePasswordDTO = z.infer<typeof ChangePasswordSchema>;

// API Methods
export const login_user = async (
  data: LoginUserDTO
): Promise<BR<UserResponse>> => {
  return apiPost<BR<UserResponse>, LoginUserDTO>(ENDPOINTS.user_login, data);
};

export const login_admin = async (
  data: LoginAdminDTO
): Promise<BR<AdminResponse>> => {
  return apiPost<BR<AdminResponse>, LoginAdminDTO>(ENDPOINTS.admin_login, data);
};

export const change_password = async (
  data: ChangePasswordDTO
): Promise<SBR> => {
  return apiPost<SBR, ChangePasswordDTO>(ENDPOINTS.user_change_password, data);
};
