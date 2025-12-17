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
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { FleetServiceManagement } from './fleet_service_management_service';

const URL = 'fleet/service_management/service_schedule';

const ENDPOINTS = {
  // FleetServiceSchedule APIs
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// FleetServiceSchedule Interface
export interface FleetServiceSchedule extends Record<string, unknown> {
  // Primary Fields
  service_schedule_id: string;

  // Main Field Details
  service_schedule_name?: string;
  service_schedule_description?: string;
  service_schedule_start_date?: string;
  service_schedule_start_date_f?: string;
  service_schedule_due_date?: string;
  service_schedule_due_date_f?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  user_id: string;
  User?: User;
  user_details?: string;

  // Relations - Child
  // Child - Fleet
  FleetServiceManagement?: FleetServiceManagement[];
  FleetServiceScheduleVehicleLink?: FleetServiceScheduleVehicleLink[];

  // Relations - Child Count
  _count?: {
    FleetServiceManagement?: number;
    FleetServiceScheduleVehicleLink?: number;
  };
}

// FleetServiceScheduleVehicleLink Interface
export interface FleetServiceScheduleVehicleLink extends Record<string, unknown> {
  // Primary Field
  service_schedule_vehicle_link_id: string;

  // Main Field Details
  // service_schedule_status: ServiceScheduleStatus;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  service_schedule_id: string;
  FleetServiceSchedule?: FleetServiceSchedule;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
}

// FleetServiceSchedule Create/Update Schema
export const FleetServiceScheduleSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_mandatory('User'), // Single-Selection -> User

  service_schedule_name: stringMandatory('Service Schedule Name', 3, 100),
  service_schedule_description: stringOptional(
    'Service Schedule Description',
    0,
    2000,
  ),
  service_schedule_start_date: dateOptional('Service Schedule Start Date'),
  service_schedule_due_date: dateOptional('Service Schedule Due Date'),

  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi selection -> MasterVehicle

  // Other
  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FleetServiceScheduleDTO = z.infer<
  typeof FleetServiceScheduleSchema
>;

// FleetServiceSchedule Query Schema
export const FleetServiceScheduleQuerySchema = BaseQuerySchema.extend({
  service_schedule_ids: multi_select_optional('FleetServiceSchedule'), // Multi-Selection -> FleetServiceSchedule
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
});
export type FleetServiceScheduleQueryDTO = z.infer<
  typeof FleetServiceScheduleQuerySchema
>;

// Convert FleetServiceSchedule Data to API Payload
export const toFleetServiceSchedulePayload = (row: FleetServiceSchedule): FleetServiceScheduleDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',

  service_schedule_name: row.service_schedule_name || '',
  service_schedule_description: row.service_schedule_description || '',
  service_schedule_start_date: row.service_schedule_start_date || '',
  service_schedule_due_date: row.service_schedule_due_date || '',

  vehicle_ids:
    row.FleetServiceScheduleVehicleLink?.map((v) => v.vehicle_id) || [],

  status: row.status || Status.Active,
  time_zone_id: '', // Needs to be provided manually
});

// Create New FleetServiceSchedule Payload
export const newFleetServiceSchedulePayload = (): FleetServiceScheduleDTO => ({
  organisation_id: '',
  user_id: '',

  service_schedule_name: '',
  service_schedule_description: '',
  service_schedule_start_date: '',
  service_schedule_due_date: '',

  vehicle_ids: [],

  status: Status.Active,
  time_zone_id: '', // Needs to be provided manually
});

// FleetServiceSchedule APIs
export const findFleetServiceSchedule = async (data: FleetServiceScheduleQueryDTO): Promise<FBR<FleetServiceSchedule[]>> => {
  return apiPost<FBR<FleetServiceSchedule[]>, FleetServiceScheduleQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetServiceSchedule = async (data: FleetServiceScheduleDTO): Promise<SBR> => {
  return apiPost<SBR, FleetServiceScheduleDTO>(ENDPOINTS.create, data);
};

export const updateFleetServiceSchedule = async (id: string, data: FleetServiceScheduleDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetServiceScheduleDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetServiceSchedule = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};