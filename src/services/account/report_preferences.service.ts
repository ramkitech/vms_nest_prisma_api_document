// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

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
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo, ReportType, ReportList, OnOff, ReportChannel } from '../../core/Enums';

// Other Models
import { UserOrganisation } from '../main/users/user_organisation_service';
import { MasterVehicle } from '../main/vehicle/master_vehicle_service';

// URL and Endpoints
const URL = 'account/report_preferences';
const URL_AUTOMATION_MAIL = 'account/report_preferences_automation_mail';

const ENDPOINTS = {
  find: `${URL}/search`,
  find_automation_mail: `${URL_AUTOMATION_MAIL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// OrganisationReportPreference Interface
export interface OrganisationReportPreference extends Record<string, unknown> {
  report_preference_id: string;

  report_name: string;
  report_status: OnOff;
  report_types: ReportType[];
  report_list: ReportList[];

  report_channels: ReportChannel[],
  mobile_numbers?: string;
  email_ids?: string;
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
  OrganisationReportPreferenceVehicleLink: OrganisationReportPreferenceVehicleLink[]
  OrganisationReportAutomationMail: OrganisationReportAutomationMail[]

  // Count
  _count?: {
    OrganisationReportPreferenceVehicleLink: number;
    OrganisationReportAutomationMail: number;
  };

}

// OrganisationReportPreferenceVehicleLink Interface
export interface OrganisationReportPreferenceVehicleLink extends Record<string, unknown> {

  report_preference_vehicle_id: string;

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
  OrganisationReportPreference?: OrganisationReportPreference;

  // Relations - Child

  // Count
}

// OrganisationReportAutomationMail Interface
export interface OrganisationReportAutomationMail extends Record<string, unknown> {

  report_automation_mail_id: string;

  report_name: string;
  report_type: ReportType;
  from_date?: string;
  to_date?: string;
  date?: string;

  all_vehicles: YesNo;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  report_preference_id: string;
  OrganisationReportPreference?: OrganisationReportPreference;

  // Relations - Child
  OrganisationReportAutomationMailVehicleLink: OrganisationReportAutomationMailVehicleLink[]

  // Count
  _count?: {
    OrganisationReportAutomationMailVehicleLink: number;
  };
}

// OrganisationReportAutomationMailVehicleLink Interface
export interface OrganisationReportAutomationMailVehicleLink extends Record<string, unknown> {

  report_automation_mail_vehicle_id: string;

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
  OrganisationReportAutomationMail?: OrganisationReportAutomationMail;

  // Relations - Child

  // Count
}

// ✅ OrganisationReportAutomationMail Query Schema
export const OrganisationReportAutomationMailQuerySchema =
  BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    report_preference_ids: multi_select_optional(
      'OrganisationReportPreference',
    ), // ✅ Multi-Selection -> OrganisationReportPreference
    report_automation_mail_ids: multi_select_optional(
      'OrganisationReportAutomationMail',
    ), // ✅ Multi-Selection -> OrganisationReportAutomationMail
    report_type: enumArrayOptional(
      'Report Type',
      ReportType,
      getAllEnums(ReportType),
    ),
  });
export type OrganisationReportAutomationMailQueryDTO = z.infer<
  typeof OrganisationReportAutomationMailQuerySchema
>;

// ✅ OrganisationReportPreference Create/Update Schema
export const OrganisationReportPreferenceSchema = z.object({
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

  report_channels: enumArrayMandatory(
    'Report Channels',
    ReportChannel,
    getAllEnums(ReportChannel),
  ),
  mobile_numbers: stringOptional('Mobile Numbers', 0, 300),
  email_ids: stringOptional('Email IDs', 0, 300),
  cc_email_ids: stringOptional('CC email IDs', 0, 300),

  all_vehicles: enumMandatory('All Vehicles', YesNo, YesNo.No),
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi selection -> MasterVehicle

  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationReportPreferenceDTO = z.infer<
  typeof OrganisationReportPreferenceSchema
>;

// ✅ OrganisationReportPreference Query Schema
export const OrganisationReportPreferenceQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  report_preference_ids: multi_select_optional('OrganisationReportPreference'), // ✅ Multi-Selection -> OrganisationReportPreference
  report_status: enumArrayOptional('Report Status', OnOff, getAllEnums(OnOff)),
  report_types: enumArrayOptional(
    'Report Type',
    ReportType,
    getAllEnums(ReportType),
  ),
  report_list: enumArrayOptional(
    'Report List',
    ReportList,
    getAllEnums(ReportList),
  ),
  report_channels: enumArrayOptional(
    'Report Channel',
    ReportChannel,
    getAllEnums(ReportChannel),
  ),
});
export type OrganisationReportPreferenceQueryDTO = z.infer<
  typeof OrganisationReportPreferenceQuerySchema
>;

// Payload Conversions
export const toOrganisationReportPreferencePayload = (data: OrganisationReportPreference): OrganisationReportPreferenceDTO => ({
  organisation_id: data.organisation_id,

  report_name: data.report_name,
  report_status: data.report_status,
  report_types: data.report_types,
  report_list: data.report_list,

  report_channels: data.report_channels || [],
  mobile_numbers: data.mobile_numbers || '',
  email_ids: data.email_ids || '',
  cc_email_ids: data.cc_email_ids || '',
  all_vehicles: data.all_vehicles,

  vehicle_ids: data.OrganisationReportPreferenceVehicleLink?.map((v) => v.vehicle_id) ?? [],

  status: Status.Active,
});

export const newOrganisationReportPreferencePayload = (): OrganisationReportPreferenceDTO => ({
  organisation_id: '',
  report_name: '',
  report_status: OnOff.On,
  report_types: [],
  report_list: [],

  report_channels: [],
  mobile_numbers: '',
  email_ids: '',
  cc_email_ids: '',

  all_vehicles: YesNo.Yes,

  vehicle_ids: [],

  status: Status.Active,
});

// API Methods
export const findOrganisationReportPreference = async (data: OrganisationReportPreferenceQueryDTO): Promise<FBR<OrganisationReportPreference[]>> => {
  return apiPost<FBR<OrganisationReportPreference[]>, OrganisationReportPreferenceQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationReportPreference = async (data: OrganisationReportPreferenceDTO): Promise<SBR> => {
  return apiPost<SBR, OrganisationReportPreferenceDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationReportPreference = async (id: string, data: OrganisationReportPreferenceDTO): Promise<SBR> => {
  return apiPatch<SBR, OrganisationReportPreferenceDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationReportPreference = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const findUserReportAutomationMail = async (data: OrganisationReportAutomationMailQueryDTO): Promise<FBR<OrganisationReportAutomationMail[]>> => {
  return apiPost<FBR<OrganisationReportAutomationMail[]>, OrganisationReportAutomationMailQueryDTO>(ENDPOINTS.find_automation_mail, data);
};
