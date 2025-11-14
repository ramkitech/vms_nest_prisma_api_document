// Imports
import { apiPost } from '../../../core/apiCall';
import { BR, SBR } from '../../../core/BaseResponse';

// Zod
import { enumOptional, stringMandatory, stringOptional, stringUUIDMandatory } from '../../../zod_utils/zod_utils';
import { z } from 'zod';
import { User } from './user_service';
import { UserAdmin } from './user_admin_service';
import { LoginFrom } from 'src/core/Enums';
import { MasterDriver } from '../drivers/master_driver_service';

const URL = 'user/auth';

const ENDPOINTS = {
  user_login: `${URL}/user_login`,
  user_logout: `${URL}/user_logout`,
  user_change_password: `${URL}/user_change_password`,

  driver_login: `${URL}/driver_login`,
  driver_logout: `${URL}/driver_logout`,
  driver_change_password: `${URL}/driver_change_password`,

  admin_login: `${URL}/admin_login`,
  admin_logout: `${URL}/admin_logout`,
  admin_change_password: `${URL}/admin_change_password`,
};

export interface UserResponse extends Record<string, unknown> {
  access_token: string;
  user: User;
}

export interface AdminResponse extends Record<string, unknown> {
  access_token: string;
  user: UserAdmin;
}

export interface DriverResponse extends Record<string, unknown> {
  access_token: string;
  user: MasterDriver;
}

export const UserChangePasswordSchema = z.object({
  user_id: stringUUIDMandatory('user_id'),
  old_password: stringMandatory('Old Password', 3, 20),
  new_password: stringMandatory('New Password Size', 3, 20),
  confirm_new_password: stringMandatory('New Password Size', 3, 20),
});
export type UserChangePasswordDTO = z.infer<typeof UserChangePasswordSchema>;

export const UserLoginSchema = z.object({
  identifier: stringMandatory('Identifier', 3, 100),
  password: stringMandatory('Password', 3, 20),

  fcm_token: stringOptional('fcm_token', 0, 10000),

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
export type UserLoginDTO = z.infer<typeof UserLoginSchema>;

export const UserLogoutSchema = z.object({
  fcm_token: stringOptional('fcm_token', 0, 10000),
  device_id: stringOptional('device_id', 0, 120),
});
export type UserLogoutDTO = z.infer<typeof UserLogoutSchema>;

export const DriverChangePasswordSchema = z.object({
  driver_id: stringUUIDMandatory('driver_id'),
  old_password: stringMandatory('Old Password', 3, 20),
  new_password: stringMandatory('New Password Size', 3, 20),
  confirm_new_password: stringMandatory('New Password Size', 3, 20),
});
export type DriverChangePasswordDTO = z.infer<
  typeof DriverChangePasswordSchema
>;

export const DriverLoginSchema = z.object({
  organisation_id: stringUUIDMandatory('organisation_id'),

  identifier: stringMandatory('Identifier', 3, 100),
  password: stringMandatory('Password', 3, 20),

  fcm_token: stringOptional('fcm_token', 0, 10000),

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
export type DriverLoginDTO = z.infer<typeof DriverLoginSchema>;

export const DriverLogoutSchema = z.object({
  fcm_token: stringOptional('fcm_token', 0, 10000),
  device_id: stringOptional('device_id', 0, 120),
});
export type DriverLogoutDTO = z.infer<typeof DriverLogoutSchema>;

export const AdminChangePasswordSchema = z.object({
  admin_id: stringUUIDMandatory('admin_id'),
  old_password: stringMandatory('Old Password', 3, 20),
  new_password: stringMandatory('New Password Size', 3, 20),
  confirm_new_password: stringMandatory('New Password Size', 3, 20),
});
export type AdminChangePasswordDTO = z.infer<typeof AdminChangePasswordSchema>;

export const AdminLoginSchema = z.object({
  identifier: stringMandatory('Identifier', 3, 100),
  password: stringMandatory('Password', 3, 20),

  fcm_token: stringOptional('fcm_token', 0, 10000),

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
export type AdminLoginDTO = z.infer<typeof AdminLoginSchema>;

export const AdminLogoutSchema = z.object({
  fcm_token: stringOptional('fcm_token', 0, 10000),
  device_id: stringOptional('device_id', 0, 120),
});
export type AdminLogoutDTO = z.infer<typeof AdminLogoutSchema>;

// API Methods

// User
export const user_login = async (data: UserLoginDTO): Promise<BR<UserResponse>> => {
  return apiPost<BR<UserResponse>, UserLoginDTO>(ENDPOINTS.user_login, data);
};

export const user_logout = async (data: UserLogoutDTO): Promise<SBR> => {
  return apiPost<SBR, UserLogoutDTO>(ENDPOINTS.user_logout, data);
};

export const user_change_password = async (data: UserChangePasswordDTO): Promise<SBR> => {
  return apiPost<SBR, UserChangePasswordDTO>(ENDPOINTS.user_change_password, data);
};

// UserAdmin
export const admin_login = async (data: AdminLoginDTO): Promise<BR<AdminResponse>> => {
  return apiPost<BR<AdminResponse>, AdminLoginDTO>(ENDPOINTS.admin_login, data);
};

export const admin_logout = async (data: AdminLogoutDTO): Promise<SBR> => {
  return apiPost<SBR, AdminLogoutDTO>(ENDPOINTS.admin_logout, data);
};

export const admin_change_password = async (data: AdminChangePasswordDTO): Promise<SBR> => {
  return apiPost<SBR, AdminChangePasswordDTO>(ENDPOINTS.admin_change_password, data);
};

// MasterDriver
export const driver_login = async (data: DriverLoginDTO): Promise<BR<DriverResponse>> => {
  return apiPost<BR<DriverResponse>, DriverLoginDTO>(ENDPOINTS.driver_login, data);
};

export const driver_logout = async (data: DriverLogoutDTO): Promise<SBR> => {
  return apiPost<SBR, DriverLogoutDTO>(ENDPOINTS.driver_logout, data);
};

export const driver_change_password = async (data: DriverChangePasswordDTO): Promise<SBR> => {
  return apiPost<SBR, DriverChangePasswordDTO>(ENDPOINTS.driver_change_password, data);
};
