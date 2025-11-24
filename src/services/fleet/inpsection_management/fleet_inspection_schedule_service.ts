// Imports
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  dateOptional,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  stringMandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { FleetInspection } from './fleet_inspection_management_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';

const URL = 'fleet/inspection_management/inspection_schedule';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// ✅ FleetInspectionSchedule Interface
export interface FleetInspectionSchedule extends Record<string, unknown> {
  inspection_schedule_id: string;

  inspection_schedule_name?: string;
  inspection_schedule_description?: string;
  inspection_schedule_start_date?: string;
  inspection_schedule_start_date_f?: string;
  inspection_schedule_due_date?: string;
  inspection_schedule_due_date_f?: string;

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  user_id: string;
  User?: User;

  // Relations - Child
  FleetInspection: FleetInspection[];
  FleetInspectionScheduleVehicleLink: FleetInspectionScheduleVehicleLink[];

  // Relations - Count
  _count?: {
    FleetInspection: number;
    FleetInspectionScheduleVehicleLink: number;
  };
}

// ✅ FleetInspectionScheduleVehicleLink Interface
export interface FleetInspectionScheduleVehicleLink extends Record<string, unknown> {
  inspection_schedule_vehicle_link_id: string;

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations
  inspection_schedule_id: string;
  FleetInspectionSchedule?: FleetInspectionSchedule;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
}

// ✅ FleetInspectionSchedule Schema
export const FleetInspectionScheduleSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  user_id: single_select_mandatory('User'), // ✅ Single-Selection -> User

  inspection_schedule_name: stringMandatory('Inspection Schedule Name', 0, 100),
  inspection_schedule_description: stringOptional(
    'Inspection Schedule Description',
    0,
    2000,
  ),
  inspection_schedule_start_date: dateOptional(
    'Inspection Schedule Start Date',
  ),
  inspection_schedule_due_date: dateOptional('Inspection Schedule Due Date'),

  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi selection -> MasterVehicle

  // Other
  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FleetInspectionScheduleDTO = z.infer<
  typeof FleetInspectionScheduleSchema
>;

// ✅ FleetInspectionSchedule Query Schema
export const FleetInspectionScheduleQuerySchema = BaseQuerySchema.extend({
  inspection_schedule_ids: multi_select_optional('FleetInspectionSchedule'), // ✅ Multi-Selection -> FleetInspectionSchedule
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
});
export type FleetInspectionScheduleQueryDTO = z.infer<
  typeof FleetInspectionScheduleQuerySchema
>;

// ✅ Convert FleetInspectionSchedule Data to API Payload
export const toFleetInspectionSchedulePayload = (row: FleetInspectionSchedule): FleetInspectionScheduleDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',

  inspection_schedule_name: row.inspection_schedule_name || '',
  inspection_schedule_description: row.inspection_schedule_description || '',
  inspection_schedule_start_date: row.inspection_schedule_start_date || '',
  inspection_schedule_due_date: row.inspection_schedule_due_date || '',

  vehicle_ids:
    row.FleetInspectionScheduleVehicleLink?.map((v) => v.vehicle_id) ?? [],

  status: Status.Active,
  time_zone_id: '', // Needs to be provided manually
});

// ✅ Create New FleetInspectionSchedule Payload
export const newFleetInspectionSchedulePayload = (): FleetInspectionScheduleDTO => ({
  organisation_id: '',
  user_id: '',

  inspection_schedule_name: '',
  inspection_schedule_description: '',
  inspection_schedule_start_date: '',
  inspection_schedule_due_date: '',

  vehicle_ids: [],

  status: Status.Active,
  time_zone_id: '', // Needs to be provided manually
});

// FleetInspectionSchedule
export const findFleetInspectionSchedule = async (data: FleetInspectionScheduleQueryDTO): Promise<FBR<FleetInspectionSchedule[]>> => {
  return apiPost<FBR<FleetInspectionSchedule[]>, FleetInspectionScheduleQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetInspectionSchedule = async (data: FleetInspectionScheduleDTO): Promise<SBR> => {
  return apiPost<SBR, FleetInspectionScheduleDTO>(ENDPOINTS.create, data);
};

export const updateFleetInspectionSchedule = async (id: string, data: FleetInspectionScheduleDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetInspectionScheduleDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetInspectionSchedule = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};