// Axios
import { apiPost, apiPatch, apiDelete } from '../../../../core/apiCall';
import { SBR, FBR } from '../../../../core/BaseResponse';

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
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo, ReportType, ReportPreference } from '../../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../main/users/user_organisation_service';
import { MasterVehicle } from '../../../main/vehicle/master_vehicle_service';

// URL and Endpoints
const URL = 'gps/features/user_report_preferences';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// UserReportsPreferences Interface
export interface UserReportsPreferences extends Record<string, unknown> {
  report_preference_id: string;

  report_name: string;
  report_status: YesNo;
  report_type: ReportType;
  email_ids: string;
  cc_email_ids?: string;

  report_list: ReportPreference[];

  is_all_vehicles: YesNo;

  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  UserReportsPreferencesVehicleLink: UserReportsPreferencesVehicleLink[]

  // Count
  _count?: {
    UserReportsPreferencesVehicleLink: number;
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

// ✅ UserReportPreferences Create/Update Schema
export const UserReportPreferencesSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  report_name: stringMandatory('Report Name', 3, 100),
  report_status: enumMandatory('Report Status', YesNo, YesNo.No),
  report_type: enumMandatory('Report Type', ReportType, ReportType.Daily),
  email_ids: stringMandatory('Email IDs', 3, 300),
  cc_email_ids: stringOptional('CC email IDs', 0, 300),

  is_all_vehicles: enumMandatory('Is All Vehicles', YesNo, YesNo.No),

  report_list: enumArrayMandatory(
    'Report List',
    ReportPreference,
    getAllEnums(ReportPreference),
  ),

  status: enumMandatory('Status', Status, Status.Active),

  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi selection -> MasterVehicle
});
export type UserReportPreferencesDTO = z.infer<
  typeof UserReportPreferencesSchema
>;

// ✅ UserReportPreferences Query Schema
export const UserReportPreferencesQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  report_preference_ids: multi_select_optional('UserReportPreferences'), // ✅ Multi-Selection -> UserNotificationPreferences
  report_status: enumArrayOptional('Report Status', YesNo, getAllEnums(YesNo)),
  report_type: enumArrayOptional(
    'Report Type',
    ReportType,
    getAllEnums(ReportType),
  ),
  is_all_vehicles: enumArrayOptional(
    'Is All Vehicles',
    YesNo,
    getAllEnums(YesNo),
  ),
});
export type UserReportPreferencesQueryDTO = z.infer<
  typeof UserReportPreferencesQuerySchema
>;

// Payload Conversions
export const toUserReportsPreferencesPayload = (data: UserReportsPreferences): UserReportPreferencesDTO => ({
  organisation_id: data.organisation_id,
  report_name: data.report_name,
  report_status: data.report_status,
  report_type: data.report_type,
  email_ids: data.email_ids,
  cc_email_ids: data.report_name,
  is_all_vehicles: data.is_all_vehicles,
  report_list: data.report_list,
  vehicle_ids:
    data.UserReportsPreferencesVehicleLink?.map((v) => v.vehicle_id) ?? [],

  status: Status.Active

});

export const newUserReportsPreferencesPayload = (): UserReportPreferencesDTO => ({
  organisation_id: '',
  report_name: '',
  report_status: YesNo.Yes,
  report_type: ReportType.Daily,
  email_ids: '',
  cc_email_ids: '',
  is_all_vehicles: YesNo.Yes,
  report_list: [],
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
