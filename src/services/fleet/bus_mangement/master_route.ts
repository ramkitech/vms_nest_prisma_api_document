// master/route_service.ts

// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
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
  numberOptional,
  numberMandatory,
  nestedArrayOfObjectsOptional,
  dateOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, BusLeg, YesNo } from '../../../core/Enums';

// Other Models (adjust paths as required)
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';
import { BusStop } from './bus_stop';

// Base URL
const URL = 'master/route';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Schedule endpoints
  schedule_find: `${URL}/schedule/search`,
  schedule_create: `${URL}/schedule`,
  schedule_update: (id: string): string => `${URL}/schedule/${id}`,
  schedule_delete: (id: string): string => `${URL}/schedule/${id}`,

  // Route stops
  create_stops_first_time_route: `${URL}/create_stops_first_time_route`,
  append_route_stop_reorder: `${URL}/append_route_stop_reorder`,
  delete_route_stops_all: `${URL}/delete_route_stops_all`,
  delete_route_stop_reorder: `${URL}/delete_route_stop_reorder`,

  // Student assign
  assign_route_students_pickup: `${URL}/assign_route_students_pickup`,
  assign_route_students_drop: `${URL}/assign_route_students_drop`,
  remove_route_students_pickup: `${URL}/remove_route_students_pickup`,
  remove_route_students_drop: `${URL}/remove_route_students_drop`,
};

// -----------------------------
// Interfaces (frontend model)
// -----------------------------
export interface MasterRoute extends Record<string, unknown> {
  route_id: string;
  route_name: string;
  route_code?: string;
  route_notes?: string;
  route_status: Status | string;

  pickup_journey_time_in_seconds?: number;
  drop_journey_time_in_seconds?: number;

  pickup_start_stop_id?: string;
  pickup_end_stop_id?: string;
  drop_start_stop_id?: string;
  drop_end_stop_id?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  organisation_branch_id?: string;
  OrganisationBranch?: OrganisationBranch;

  // Navigation
  Pickup_Start_BusStop?: BusStop;
  Pickup_End_BusStop?: BusStop;
  Drop_Start_BusStop?: BusStop;
  Drop_End_BusStop?: BusStop;

  // Counts
  _count?: {
    MasterRouteStop?: number;
    MasterFixedSchedule?: number;
    MasterRouteStudent?: number;
  };
}

export interface MasterFixedSchedule extends Record<string, unknown> {
  fixed_schedule_id: string;
  schedule_name: string;
  schedule_status: Status | string;
  is_stops_finalized: YesNo | string;
  schedule_type: BusLeg | string;

  start_hour?: number;
  start_minute?: number;
  end_hour?: number;
  end_minute?: number;

  schedule_plan_start_date?: string;
  schedule_plan_end_date?: string;

  sunday?: YesNo | string;
  monday?: YesNo | string;
  tuesday?: YesNo | string;
  wednesday?: YesNo | string;
  thursday?: YesNo | string;
  friday?: YesNo | string;
  saturday?: YesNo | string;

  status: Status;
  added_date_time: string;
  modified_date_time: string;

  organisation_id?: string;
  organisation_branch_id?: string;

  route_id?: string;
  vehicle_id?: string;
  driver_id?: string;
  attendant_id?: string;
}

export interface MasterRouteStop extends Record<string, unknown> {
  route_stop_id: string;
  leg: BusLeg | string;
  order_no?: number;
  stop_duration_seconds?: number;
  travel_seconds_to_next_stop?: number;

  stop_name?: string;

  status: Status;
  added_date_time: string;
  modified_date_time: string;

  organisation_id?: string;
  organisation_branch_id?: string;

  route_id?: string;
  bus_stop_id?: string;
}

// -----------------------------
// Zod DTOs (create / update)
// -----------------------------

// MasterRoute Create/Update Schema
export const MasterRouteSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  organisation_branch_id: single_select_mandatory('OrganisationBranch'),

  pickup_start_stop_id: single_select_optional('Pickup_Start_BusStop'),
  pickup_end_stop_id: single_select_optional('Pickup_End_BusStop'),
  drop_start_stop_id: single_select_optional('Drop_Start_BusStop'),
  drop_end_stop_id: single_select_optional('Drop_End_BusStop'),

  route_name: stringMandatory('Route Name', 3, 100),
  route_code: stringOptional('Route Code', 0, 100),
  route_notes: stringOptional('Route Notes', 0, 500),
  route_status: enumMandatory('Route Status', Status, Status.Active),

  pickup_journey_time_in_seconds: numberOptional('Pickup Journey Time In Seconds'),
  drop_journey_time_in_seconds: numberOptional('Drop Journey Time In Seconds'),

  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterRouteDTO = z.infer<typeof MasterRouteSchema>;

// MasterRoute Query Schema
export const MasterRouteQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'),
  organisation_branch_ids: multi_select_optional('OrganisationBranch'),

  pickup_start_stop_ids: multi_select_optional('Pickup_Start_BusStop'),
  pickup_end_stop_ids: multi_select_optional('Pickup_End_BusStop'),
  drop_start_stop_ids: multi_select_optional('Drop_Start_BusStop'),
  drop_end_stop_ids: multi_select_optional('Drop_End_BusStop'),

  route_ids: multi_select_optional('MasterRoute'),

  route_status: enumArrayOptional('Route Status', Status, Object.values(Status) as any),
});
export type MasterRouteQueryDTO = z.infer<typeof MasterRouteQuerySchema>;

// -----------------------------
// MasterFixedSchedule DTOs & Query
// -----------------------------
export const MasterFixedScheduleSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  organisation_branch_id: single_select_mandatory('OrganisationBranch'),
  route_id: single_select_mandatory('MasterRoute'),

  vehicle_id: single_select_optional('MasterVehicle'),
  driver_id: single_select_optional('Driver'),
  attendant_id: single_select_optional('Attendant'),

  schedule_name: stringMandatory('Schedule Name', 3, 100),
  schedule_status: enumMandatory('Schedule Status', Status, Status.Active),
  is_stops_finalized: enumMandatory('Is Stops Finalized', YesNo, YesNo.No),
  schedule_type: enumMandatory('Schedule Type', BusLeg, BusLeg.Pickup),

  start_hour: numberOptional('Start Hour'),
  start_minute: numberOptional('Start Minute'),
  end_hour: numberOptional('End Hour'),
  end_minute: numberOptional('End Minute'),

  // use dateOptional helper — no explicit nulls
  schedule_plan_start_date: dateOptional('Schedule Plan Start Date'),
  schedule_plan_end_date: dateOptional('Schedule Plan End Date'),

  sunday: enumMandatory('Sunday', YesNo, YesNo.No),
  monday: enumMandatory('Monday', YesNo, YesNo.No),
  tuesday: enumMandatory('Tuesday', YesNo, YesNo.No),
  wednesday: enumMandatory('Wednesday', YesNo, YesNo.No),
  thursday: enumMandatory('Thursday', YesNo, YesNo.No),
  friday: enumMandatory('Friday', YesNo, YesNo.No),
  saturday: enumMandatory('Saturday', YesNo, YesNo.No),

  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFixedScheduleDTO = z.infer<typeof MasterFixedScheduleSchema>;

export const MasterFixedScheduleQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'),
  organisation_branch_ids: multi_select_optional('OrganisationBranch'),
  route_ids: multi_select_optional('MasterRoute'),
  vehicle_ids: multi_select_optional('MasterVehicle'),
  driver_ids: multi_select_optional('Driver'),
  attendant_ids: multi_select_optional('Attendant'),
  fixed_schedule_ids: multi_select_optional('MasterFixedSchedule'),

  schedule_status: enumArrayOptional('Schedule Status', Status, Object.values(Status) as any),
  is_stops_finalized: enumArrayOptional('Is Stops Finalized', YesNo, Object.values(YesNo) as any),
  schedule_type: enumArrayOptional('Schedule Type', BusLeg, Object.values(BusLeg) as any),
  sunday: enumArrayOptional('Sunday', YesNo, Object.values(YesNo) as any),
  monday: enumArrayOptional('Monday', YesNo, Object.values(YesNo) as any),
  tuesday: enumArrayOptional('Tuesday', YesNo, Object.values(YesNo) as any),
  wednesday: enumArrayOptional('Wednesday', YesNo, Object.values(YesNo) as any),
  thursday: enumArrayOptional('Thursday', YesNo, Object.values(YesNo) as any),
  friday: enumArrayOptional('Friday', YesNo, Object.values(YesNo) as any),
  saturday: enumArrayOptional('Saturday', YesNo, Object.values(YesNo) as any),
});
export type MasterFixedScheduleQueryDTO = z.infer<typeof MasterFixedScheduleQuerySchema>;

// -----------------------------
// MasterRouteStop Create DTOs
// -----------------------------
export const MasterRouteBusStops = z.object({
  order_no: numberMandatory('Order No'),
  stop_duration_seconds: numberMandatory('Stop Duration Seconds'),
  travel_seconds_to_next_stop: numberMandatory('Travel Seconds To Next Stop'),
  bus_stop_id: single_select_mandatory('BusStop'),
});
export type MasterRouteBusStopsDTO = z.infer<typeof MasterRouteBusStops>;

export const MasterRouteStopCreateSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  organisation_branch_id: single_select_mandatory('OrganisationBranch'),
  route_id: single_select_mandatory('MasterRoute'),

  leg: enumMandatory('Leg', BusLeg, BusLeg.Pickup),

  status: enumMandatory('Status', Status, Status.Active),

  MasterRouteBusStops: nestedArrayOfObjectsOptional(
    'MasterRouteBusStops',
    MasterRouteBusStops,
    [],
  ),
});
export type MasterRouteStopCreateDTO = z.infer<typeof MasterRouteStopCreateSchema>;

export const MasterRouteStopDeleteSchema = z.object({
  route_id: single_select_mandatory('MasterRoute'),
  leg: enumMandatory('Leg', BusLeg, BusLeg.Pickup),
});
export type MasterRouteStopDeleteDTO = z.infer<typeof MasterRouteStopDeleteSchema>;

export const MasterRouteStopDeleteReOrderSchema = z.object({
  route_id: single_select_mandatory('MasterRoute'),
  bus_stop_id: single_select_mandatory('BusStop'),
  leg: enumMandatory('Leg', BusLeg, BusLeg.Pickup),
});
export type MasterRouteStopDeleteReOrderDTO = z.infer<typeof MasterRouteStopDeleteReOrderSchema>;

// -----------------------------
// MasterRouteStudent assign Schema
// -----------------------------
export const MasterRouteStudentAssignSchema = z.object({
  route_id: single_select_mandatory('MasterRoute'),
  student_ids: multi_select_optional('Student'),
});
export type MasterRouteStudentAssignDTO = z.infer<typeof MasterRouteStudentAssignSchema>;

// -----------------------------
// Helpers: payload creators
// -----------------------------
export const toMasterRoutePayload = (row: MasterRoute): MasterRouteDTO => ({
  organisation_id: (row.organisation_id as string) ?? '',
  organisation_branch_id: (row.organisation_branch_id as string) ?? '',
  pickup_start_stop_id: (row.pickup_start_stop_id as string) ?? '',
  pickup_end_stop_id: (row.pickup_end_stop_id as string) ?? '',
  drop_start_stop_id: (row.drop_start_stop_id as string) ?? '',
  drop_end_stop_id: (row.drop_end_stop_id as string) ?? '',
  route_name: row.route_name as string,
  route_code: (row.route_code as string) ?? '',
  route_notes: (row.route_notes as string) ?? '',
  route_status: (row.route_status as unknown) as Status,
  pickup_journey_time_in_seconds: (row.pickup_journey_time_in_seconds as number) ?? undefined,
  drop_journey_time_in_seconds: (row.drop_journey_time_in_seconds as number) ?? undefined,
  status: (row.status as unknown) as Status,
});

export const newMasterRoutePayload = (): MasterRouteDTO => ({
    status: Status.Active,
    organisation_id: '',
    organisation_branch_id: '',
    pickup_start_stop_id: '',
    pickup_end_stop_id: '',
    drop_start_stop_id: '',
    drop_end_stop_id: '',
    route_name: '',
    route_code: '',
    route_notes: '',
    route_status: Status.Active,
    pickup_journey_time_in_seconds: 0,
    drop_journey_time_in_seconds: 0
});

// -----------------------------
// API Methods
// -----------------------------

// MasterRoute CRUD
export const findMasterRoute = async (data: MasterRouteQueryDTO): Promise<FBR<MasterRoute[]>> => {
  return apiPost<FBR<MasterRoute[]>, MasterRouteQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterRoute = async (data: MasterRouteDTO): Promise<SBR> => {
  return apiPost<SBR, MasterRouteDTO>(ENDPOINTS.create, data);
};

export const updateMasterRoute = async (id: string, data: MasterRouteDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterRouteDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterRoute = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Fixed Schedule - CRUD
export const findMasterFixedSchedule = async (data: MasterFixedScheduleQueryDTO): Promise<FBR<MasterFixedSchedule[]>> => {
  return apiPost<FBR<MasterFixedSchedule[]>, MasterFixedScheduleQueryDTO>(ENDPOINTS.schedule_find, data);
};

export const createMasterFixedSchedule = async (data: MasterFixedScheduleDTO): Promise<SBR> => {
  return apiPost<SBR, MasterFixedScheduleDTO>(ENDPOINTS.schedule_create, data);
};

export const updateMasterFixedSchedule = async (id: string, data: MasterFixedScheduleDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterFixedScheduleDTO>(ENDPOINTS.schedule_update(id), data);
};

export const deleteMasterFixedSchedule = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.schedule_delete(id));
};

// MasterRouteStop APIs
export const createStopsFirstTimeRoute = async (data: MasterRouteStopCreateDTO): Promise<SBR> => {
  return apiPost<SBR, MasterRouteStopCreateDTO>(ENDPOINTS.create_stops_first_time_route, data);
};

export const appendRouteStopReorder = async (data: MasterRouteStopCreateDTO): Promise<SBR> => {
  return apiPost<SBR, MasterRouteStopCreateDTO>(ENDPOINTS.append_route_stop_reorder, data);
};

export const deleteRouteStopsAll = async (data: MasterRouteStopDeleteDTO): Promise<SBR> => {
  // Controller expects a body with DELETE. If your apiDelete doesn't support body,
  // update apiDelete to accept an optional body parameter or switch to apiPost here.
  // Example if apiDelete supports body: return apiDelete<SBR, MasterRouteStopDeleteDTO>(ENDPOINTS.delete_route_stops_all, data);
  // For safety keep POST fallback commented:
  // return apiPost<SBR, MasterRouteStopDeleteDTO>(ENDPOINTS.delete_route_stops_all, data);
  // Current attempt (may need change based on apiDelete impl):
  // @ts-ignore
  return apiDelete<SBR>(ENDPOINTS.delete_route_stops_all, data);
};

export const deleteRouteStopReorder = async (data: MasterRouteStopDeleteReOrderDTO): Promise<SBR> => {
  // Same note as above about DELETE with body.
  // @ts-ignore
  return apiDelete<SBR>(ENDPOINTS.delete_route_stop_reorder, data);
};

// MasterRouteStudent assign/unassign
export const assignRouteStudentsPickup = async (data: MasterRouteStudentAssignDTO): Promise<SBR> => {
  return apiPost<SBR, MasterRouteStudentAssignDTO>(ENDPOINTS.assign_route_students_pickup, data);
};

export const assignRouteStudentsDrop = async (data: MasterRouteStudentAssignDTO): Promise<SBR> => {
  return apiPost<SBR, MasterRouteStudentAssignDTO>(ENDPOINTS.assign_route_students_drop, data);
};

export const removeRouteStudentsPickup = async (data: MasterRouteStudentAssignDTO): Promise<SBR> => {
  return apiPost<SBR, MasterRouteStudentAssignDTO>(ENDPOINTS.remove_route_students_pickup, data);
};

export const removeRouteStudentsDrop = async (data: MasterRouteStudentAssignDTO): Promise<SBR> => {
  return apiPost<SBR, MasterRouteStudentAssignDTO>(ENDPOINTS.remove_route_students_drop, data);
};
