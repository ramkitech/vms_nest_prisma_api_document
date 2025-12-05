// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  single_select_mandatory,
  single_select_optional,
  multi_select_optional,
  enumMandatory,
  enumArrayOptional,
  getAllEnums,
  dateMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { HolidayType, Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';

const URL = 'calendar';

const ENDPOINTS = {
  // OrganisationCalendar APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  remove: (id: string): string => `${URL}/${id}`,
};

// OrganisationCalendar Interface
export interface OrganisationCalendar extends Record<string, unknown> {
  // Primary Fields
  calendar_id: string;

  // Basic Info
  calendar_date: string;
  calendar_date_f: string;
  holiday_type: HolidayType;
  title: string;
  notes?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  organisation_branch_id?: string;
  OrganisationBranch?: OrganisationBranch;
}

// OrganisationCalendar Create/Update Schema
export const OrganisationCalendarSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  organisation_branch_id: single_select_optional('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch

  calendar_date: dateMandatory('Calendar Date'),
  holiday_type: enumMandatory('Holiday Type', HolidayType, HolidayType.FullDay),

  title: stringMandatory('Title', 3, 100),
  notes: stringOptional('Notes', 0, 500),

  // Other
  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type OrganisationCalendarDTO = z.infer<
  typeof OrganisationCalendarSchema
>;

// OrganisationCalendar Query Schema
export const OrganisationCalendarQuerySchema = BaseQuerySchema.extend({
  calendar_ids: multi_select_optional('OrganisationCalendar'), // ✅ Multi-selection -> OrganisationCalendar

  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-selection -> OrganisationBranch

  holiday_type: enumArrayOptional(
    'Holiday Type',
    HolidayType,
    getAllEnums(HolidayType),
  ),
});
export type OrganisationCalendarQueryDTO = z.infer<
  typeof OrganisationCalendarQuerySchema
>;

// Convert OrganisationCalendar Data to API Payload
export const toOrganisationCalendarPayload = (row: OrganisationCalendar): OrganisationCalendarDTO => ({
  organisation_id: row.organisation_id || '',
  organisation_branch_id: row.organisation_branch_id || '',

  calendar_date: row.calendar_date || '',
  holiday_type: row.holiday_type || HolidayType.FullDay,

  title: row.title || '',
  notes: row.notes || '',
  status: row.status || Status.Active,
  time_zone_id: '', // Needs to be provided manually
});

// Create New OrganisationCalendar Payload
export const newOrganisationCalendarPayload = (): OrganisationCalendarDTO => ({
  organisation_id: '',
  organisation_branch_id: '',

  calendar_date: '',
  holiday_type: HolidayType.FullDay,

  title: '',
  notes: '',

  status: Status.Active,
  time_zone_id: '', // Needs to be provided manually
});

// OrganisationCalendar APIs
export const findOrganisationCalendar = async (data: OrganisationCalendarQueryDTO): Promise<FBR<OrganisationCalendar[]>> => {
  return apiPost<FBR<OrganisationCalendar[]>, OrganisationCalendarQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationCalendar = async (data: OrganisationCalendarDTO): Promise<SBR> => {
  return apiPost<SBR, OrganisationCalendarDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationCalendar = async (id: string, data: OrganisationCalendarDTO): Promise<SBR> => {
  return apiPatch<SBR, OrganisationCalendarDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationCalendar = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove(id));
};
