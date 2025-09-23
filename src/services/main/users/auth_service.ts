// Imports
import { apiPost } from '../../../core/apiCall';
import { BR, SBR } from '../../../core/BaseResponse';

// Zod
import { enumOptional, stringMandatory, stringOptional, stringUUIDMandatory } from '../../../zod_utils/zod_utils';
import { z } from 'zod';
import { User } from './user_service';
import { UserAdmin } from './user_admin_service';
import { LoginFrom } from 'src/core/Enums';

const URL = 'user/auth';

const ENDPOINTS = {
  user_login: `${URL}/user_login`,
  user_logout: `${URL}/user_logout`,
  user_change_password: `${URL}/user_change_password`,

  admin_login: `${URL}/admin_login`,
};

export interface UserResponse extends Record<string, unknown> {
  access_token: string;
  user: User;
}

export interface AdminResponse extends Record<string, unknown> {
  access_token: string;
  user: UserAdmin;
}

export const ChangePasswordSchema = z.object({
  user_id: stringUUIDMandatory('user_id'),
  old_password: stringMandatory('Old Password', 3, 20),
  new_password: stringMandatory('New Password Size', 3, 20),
});
export type UserChangePasswordDTO = z.infer<typeof ChangePasswordSchema>;

export const LoginUserSchema = z.object({
  identifier: stringMandatory('Identifier', 3, 100),
  password: stringMandatory('Password', 3, 20),

  endpoint: stringOptional('endpoint', 0, 10000),
  p256dh: stringOptional('p256dh', 0, 255),
  auth: stringOptional('auth', 0, 255),

  platform: enumOptional('Login From', LoginFrom, LoginFrom.Web),

  user_agent: stringOptional('user_agent', 0, 500),
  ip_address: stringOptional('ip_address', 0, 45),

  device_id: stringOptional('device_id', 0, 120),

  device_model: stringOptional('device_model', 0, 120),
  os_name: stringOptional('os_name', 0, 80),
  os_version: stringOptional('os_version', 0, 60),
  browser_name: stringOptional('browser_name', 0, 80),
  browser_version: stringOptional('browser_version', 0, 60),
  app_version: stringOptional('app_version', 0, 40),
});
export type LoginUserDTO = z.infer<typeof LoginUserSchema>;

export const LogoutSchema = z.object({
  endpoint: z.string().optional(),
  device_id: z.string().optional(),
});
export type LogoutDTO = z.infer<typeof LogoutSchema>;

export const LoginAdminSchema = z.object({
  email: stringMandatory('Email', 3, 100),
  password: stringMandatory('Password', 3, 20),
});
export type LoginAdminDTO = z.infer<typeof LoginAdminSchema>;

export type ChangePasswordDTO = z.infer<typeof ChangePasswordSchema>;

// API Methods
export const user_login = async (data: LoginUserDTO): Promise<BR<UserResponse>> => {
  return apiPost<BR<UserResponse>, LoginUserDTO>(ENDPOINTS.user_login, data);
};

export const user_logout = async (data: LogoutDTO): Promise<SBR> => {
  return apiPost<SBR, LogoutDTO>(ENDPOINTS.user_logout, data);
};

export const user_change_password = async (data: ChangePasswordDTO): Promise<SBR> => {
  return apiPost<SBR, ChangePasswordDTO>(ENDPOINTS.user_change_password, data);
};

export const admin_login = async (data: LoginAdminDTO): Promise<BR<AdminResponse>> => {
  return apiPost<BR<AdminResponse>, LoginAdminDTO>(ENDPOINTS.admin_login, data);
};
