// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  enumArrayOptional,
  single_select_mandatory,
  getAllEnums,
  multi_select_optional,
  stringMandatory,
  stringOptional,
  enumArrayMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo, ReportType, ReportList, OnOff } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { MasterVehicle } from '../../main/vehicle/master_vehicle_service';

// URL and Endpoints
const URL = 'gps/features/user_report_preferences';
const URL_AUTOMATION_MAIL = 'gps/features/user_report_preferences_automation_mail';

const ENDPOINTS = {
  find: `${URL}/search`,
  find_automation_mail: `${URL_AUTOMATION_MAIL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// UserReportsPreferences Interface
export interface UserReportsPreferences extends Record<string, unknown> {
  report_preference_id: string;

  report_name: string;
  report_status: OnOff;
  report_types: ReportType[];
  report_list: ReportList[];

  email_ids: string;
  cc_email_ids?: string;

  all_vehicles: YesNo;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  UserReportsPreferencesVehicleLink: UserReportsPreferencesVehicleLink[]
  UserReportsAutomationMail: UserReportsAutomationMail[]

  // Count
  _count?: {
    UserReportsPreferencesVehicleLink: number;
    UserReportsAutomationMail: number;
  };

}

export interface UserReportsPreferencesVehicleLink extends Record<string, unknown> {

  report_vehicle_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  report_preference_id: string;
  UserReportsPreferences?: UserReportsPreferences;

  // Relations - Child

  // Count
}

export interface UserReportsAutomationMail extends Record<string, unknown> {

  automation_mail_id: string;

  report_name: string;
  report_type: ReportType;
  from_date: string;
  to_date: string;
  date: string;

  all_vehicles: YesNo;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  report_preference_id: string;
  UserReportsPreferences?: UserReportsPreferences;

  // Relations - Child
  UserReportsAutomationVehicleLink: UserReportsAutomationVehicleLink[]

  // Count
  _count?: {
    UserReportsAutomationVehicleLink: number;
  };
}

export interface UserReportsAutomationVehicleLink extends Record<string, unknown> {

  automation_vehicle_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  automation_mail_id: string;
  UserReportsAutomationMail?: UserReportsAutomationMail;

  // Relations - Child

  // Count
}

// ✅ UserReportsAutomationMail Query Schema
export const UserReportsAutomationMailQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  report_preference_ids: multi_select_optional('UserReportPreferences'), // ✅ Multi-Selection -> UserReportPreferences
  automation_mail_ids: multi_select_optional('UserReportPreferences'), // ✅ Multi-Selection -> UserReportsAutomationMail
  all_vehicles: enumArrayOptional('All Vehicles', YesNo, getAllEnums(YesNo)),
  report_type: enumArrayOptional(
    'Report Type',
    ReportType,
    getAllEnums(ReportType),
  ),
});
export type UserReportsAutomationMailQueryDTO = z.infer<
  typeof UserReportsAutomationMailQuerySchema
>;

// ✅ UserReportPreferences Create/Update Schema
export const UserReportPreferencesSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),

  report_name: stringMandatory('Report Name', 3, 100),
  report_status: enumMandatory('Report Status', OnOff, OnOff.On),
  report_types: enumArrayMandatory(
    'Report Type',
    ReportType,
    getAllEnums(ReportType),
  ),
  report_list: enumArrayMandatory(
    'Report List',
    ReportList,
    getAllEnums(ReportList),
  ),

  email_ids: stringMandatory('Email IDs', 3, 300),
  cc_email_ids: stringOptional('CC email IDs', 0, 300),

  all_vehicles: enumMandatory('All Vehicles', YesNo, YesNo.No),
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi selection -> MasterVehicle

  status: enumMandatory('Status', Status, Status.Active),
});
export type UserReportPreferencesDTO = z.infer<
  typeof UserReportPreferencesSchema
>;

// ✅ UserReportPreferences Query Schema
export const UserReportPreferencesQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  report_preference_ids: multi_select_optional('UserReportPreferences'), // ✅ Multi-Selection -> UserReportPreferences
  report_status: enumArrayOptional('Report Status', OnOff, getAllEnums(OnOff)),
  all_vehicles: enumArrayOptional('All Vehicles', YesNo, getAllEnums(YesNo)),
});
export type UserReportPreferencesQueryDTO = z.infer<
  typeof UserReportPreferencesQuerySchema
>;

// Payload Conversions
export const toUserReportsPreferencesPayload = (data: UserReportsPreferences): UserReportPreferencesDTO => ({
  organisation_id: data.organisation_id,
  report_name: data.report_name,
  report_status: data.report_status,
  report_types: data.report_types,
  report_list: data.report_list,

  email_ids: data.email_ids || '',
  cc_email_ids: data.cc_email_ids || '',
  all_vehicles: data.all_vehicles,

  vehicle_ids:
    data.UserReportsPreferencesVehicleLink?.map((v) => v.vehicle_id) ?? [],

  status: Status.Active

});

export const newUserReportsPreferencesPayload = (): UserReportPreferencesDTO => ({
  organisation_id: '',
  report_name: '',
  report_status: OnOff.On,
  report_types: [],
  report_list: [],

  email_ids: '',
  cc_email_ids: '',
  all_vehicles: YesNo.Yes,

  vehicle_ids: [],

  status: Status.Active

});

// API Methods
export const findUserReportsPreferences = async (data: UserReportPreferencesQueryDTO): Promise<FBR<UserReportsPreferences[]>> => {
  return apiPost<FBR<UserReportsPreferences[]>, UserReportPreferencesQueryDTO>(ENDPOINTS.find, data);
};

export const createUserReportsPreferences = async (data: UserReportPreferencesDTO): Promise<SBR> => {
  return apiPost<SBR, UserReportPreferencesDTO>(ENDPOINTS.create, data);
};

export const updateUserReportsPreferences = async (id: string, data: UserReportPreferencesDTO): Promise<SBR> => {
  return apiPatch<SBR, UserReportPreferencesDTO>(ENDPOINTS.update(id), data);
};

export const deleteUserReportsPreferences = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const findUserReportsAutomationMail = async (data: UserReportsAutomationMailQueryDTO): Promise<FBR<UserReportsAutomationMail[]>> => {
  return apiPost<FBR<UserReportsAutomationMail[]>, UserReportsAutomationMailQueryDTO>(ENDPOINTS.find_automation_mail, data);
};
