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

// OrganisationReportsPreference Interface
export interface OrganisationReportsPreference extends Record<string, unknown> {
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
  OrganisationReportsPreferenceVehicleLink: OrganisationReportsPreferenceVehicleLink[]
  OrganisationReportsAutomationMail: OrganisationReportsAutomationMail[]

  // Count
  _count?: {
    OrganisationReportsPreferenceVehicleLink: number;
    OrganisationReportsAutomationMail: number;
  };

}

// OrganisationReportsPreferenceVehicleLink Interface
export interface OrganisationReportsPreferenceVehicleLink extends Record<string, unknown> {

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
  OrganisationReportsPreference?: OrganisationReportsPreference;

  // Relations - Child

  // Count
}

// OrganisationReportsAutomationMail Interface
export interface OrganisationReportsAutomationMail extends Record<string, unknown> {

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
  OrganisationReportsPreference?: OrganisationReportsPreference;

  // Relations - Child
  OrganisationReportsAutomationMailVehicleLink: OrganisationReportsAutomationMailVehicleLink[]

  // Count
  _count?: {
    OrganisationReportsAutomationMailVehicleLink: number;
  };
}

// OrganisationReportsAutomationMailVehicleLink Interface
export interface OrganisationReportsAutomationMailVehicleLink extends Record<string, unknown> {

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
  OrganisationReportsAutomationMail?: OrganisationReportsAutomationMail;

  // Relations - Child

  // Count
}

// ✅ OrganisationReportsAutomationMail Query Schema
export const OrganisationReportsAutomationMailQuerySchema =
  BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    report_preference_ids: multi_select_optional(
      'OrganisationReportsPreference',
    ), // ✅ Multi-Selection -> OrganisationReportsPreference
    report_automation_mail_ids: multi_select_optional(
      'OrganisationReportsAutomationMail',
    ), // ✅ Multi-Selection -> OrganisationReportsAutomationMail
    report_type: enumArrayOptional(
      'Report Type',
      ReportType,
      getAllEnums(ReportType),
    ),
  });
export type OrganisationReportsAutomationMailQueryDTO = z.infer<
  typeof OrganisationReportsAutomationMailQuerySchema
>;

// ✅ OrganisationReportsPreference Create/Update Schema
export const OrganisationReportsPreferenceSchema = z.object({
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
export type OrganisationReportsPreferenceDTO = z.infer<
  typeof OrganisationReportsPreferenceSchema
>;

// ✅ OrganisationReportsPreference Query Schema
export const OrganisationReportsPreferenceQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  report_preference_ids: multi_select_optional('OrganisationReportsPreference'), // ✅ Multi-Selection -> OrganisationReportsPreference
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
export type OrganisationReportsPreferenceQueryDTO = z.infer<
  typeof OrganisationReportsPreferenceQuerySchema
>;

// Payload Conversions
export const toOrganisationNotificationPreferencePayload = (data: OrganisationReportsPreference): OrganisationReportsPreferenceDTO => ({
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

  vehicle_ids: data.OrganisationReportsPreferenceVehicleLink?.map((v) => v.vehicle_id) ?? [],

  status: Status.Active,
});

export const newOrganisationNotificationPreferencePayload = (): OrganisationReportsPreferenceDTO => ({
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
export const findOrganisationNotificationPreference = async (data: OrganisationReportsPreferenceQueryDTO): Promise<FBR<OrganisationReportsPreference[]>> => {
  return apiPost<FBR<OrganisationReportsPreference[]>, OrganisationReportsPreferenceQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationNotificationPreference = async (data: OrganisationReportsPreferenceDTO): Promise<SBR> => {
  return apiPost<SBR, OrganisationReportsPreferenceDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationNotificationPreference = async (id: string, data: OrganisationReportsPreferenceDTO): Promise<SBR> => {
  return apiPatch<SBR, OrganisationReportsPreferenceDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationNotificationPreference = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const findUserReportsAutomationMail = async (data: OrganisationReportsAutomationMailQueryDTO): Promise<FBR<OrganisationReportsAutomationMail[]>> => {
  return apiPost<FBR<OrganisationReportsAutomationMail[]>, OrganisationReportsAutomationMailQueryDTO>(ENDPOINTS.find_automation_mail, data);
};
