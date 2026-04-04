// Axios

// Zod

// Enums
import { AttendanceMethod, BusLeg, BusStopType, DayRunRunningStatus, DayRunStatus, DayRunStopStatus, GeofenceType, Status, StudentLegStatus } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';
import { MasterRoute, MasterRouteStop } from './master_route';
import { MasterFixedSchedule } from './master_schedule';
import { BusStop } from './bus_stop';
import { Student } from '../school_management/student_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import z from 'zod';
import { dateMandatory, dateTimeMandatory, dateTimeOptional, enumArrayOptional, enumMandatory, getAllEnums, multi_select_optional, single_select_mandatory, single_select_optional, stringOptional } from 'src/zod_utils/zod_utils';
import { BaseQuerySchema } from 'src/zod_utils/zod_base_schema';
import { AWSPresignedUrl, BR, FBR, SBR } from 'src/core/BaseResponse';
import { apiGet, apiPatch, apiPost } from 'src/core/apiCall';

const URL = 'day_run';

const ENDPOINTS = {
    // AWS S3 PRESIGNED
    get_student_attendance_presigned_url: (fileName: string): string => `${URL}/student_attendance_presigned_url/${fileName}`,

    // FixedScheduleDayRun APIs
    update_fixed_schedule_day_run: (id: string): string => `${URL}/update_fixed_schedule_day_run/${id}`,
    cancel_fixed_schedule_day_run: (id: string): string => `${URL}/cancel_fixed_schedule_day_run/${id}`,
    find: `${URL}/search`,

    // FixedScheduleDayRunStudent APIs
    update_student_boarded: (id: string): string => `${URL}/update_student_boarded/${id}`,
    update_student_handovered: (id: string): string => `${URL}/update_student_handovered/${id}`,

    // FixedScheduleDayRunStop APIs
    update_stop_enter: (id: string): string => `${URL}/update_stop_enter/${id}`,
    update_stop_exit: (id: string): string => `${URL}/update_stop_exit/${id}`,
};

// FixedScheduleDayRun Interface
export interface FixedScheduleDayRun extends Record<string, unknown> {
    fixed_schedule_day_run_id: string;

    run_date: string;
    run_date_f?: string;
    schedule_type: BusLeg;

    start_planned_date_time?: string;
    start_planned_date_time_f?: string;
    end_planned_date_time?: string;
    end_planned_date_time_f?: string;
    start_actual_date_time?: string;
    start_actual_date_time_f?: string;
    end_actual_date_time?: string;
    end_actual_date_time_f?: string;

    planned_stops_count?: number;
    covered_stops_count?: number;
    planned_student_count?: number;
    marked_student_count?: number;

    day_run_status: DayRunStatus;
    running_status: DayRunRunningStatus;
    running_delay_seconds?: number;
    notes?: string;
    cancel_reason?: string;

    // Metadata
    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    // Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;

    organisation_branch_id: string;
    OrganisationBranch?: OrganisationBranch;
    branch_name?: string;
    branch_city?: string;

    route_id: string;
    MasterRoute?: MasterRoute;
    route_name?: string;

    fixed_schedule_id: string;
    MasterFixedSchedule?: MasterFixedSchedule;
    schedule_name?: string;

    vehicle_id: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;

    driver_id?: string;
    Driver?: MasterDriver;
    driver_details?: string;

    attendant_id?: string;
    Attendant?: MasterDriver;
    attendant_details?: string;

    // Relations - Child
    FixedScheduleDayRunStop?: FixedScheduleDayRunStop[];
    FixedScheduleDayRunStudent?: FixedScheduleDayRunStudent[];

    // Relations - Child Count
    _count?: {
        FixedScheduleDayRunStop?: number;
        FixedScheduleDayRunStudent?: number;
    };
}

// FixedScheduleDayRunStop Interface
export interface FixedScheduleDayRunStop extends Record<string, unknown> {
    fixed_schedule_day_run_stop_id: string;

    order_no: number;

    planned_arrival_time?: string;
    planned_arrival_time_f?: string;
    planned_departure_time?: string;
    planned_departure_time_f?: string;
    planned_stop_duration_seconds?: number;

    actual_arrival_time?: string;
    actual_arrival_time_f?: string;
    actual_departure_time?: string;
    actual_departure_time_f?: string;
    actual_stop_duration_seconds?: number;

    stop_status: DayRunStopStatus;
    planned_student_count?: number;
    marked_student_count?: number;

    // Metadata
    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    // Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;

    organisation_branch_id: string;
    OrganisationBranch?: OrganisationBranch;
    branch_name?: string;
    branch_city?: string;

    route_id: string;
    MasterRoute?: MasterRoute;
    route_name?: string;

    fixed_schedule_id: string;
    MasterFixedSchedule?: MasterFixedSchedule;
    schedule_name?: string;

    fixed_schedule_day_run_id: string;
    FixedScheduleDayRun?: FixedScheduleDayRun;

    bus_stop_id: string;
    BusStop?: BusStop;
    stop_name?: string;

    // Relations - Child
    FSDRS_Planned_FixedScheduleDayRunStop?: FixedScheduleDayRunStudent[];
    FSDRS_Actual_FixedScheduleDayRunStop?: FixedScheduleDayRunStudent[];

    // Relations - Child Count
    _count?: {
        FSDRS_Planned_FixedScheduleDayRunStop?: number;
        FSDRS_Actual_FixedScheduleDayRunStop?: number;
    };
}

// FixedScheduleDayRunStudent Interface
export interface FixedScheduleDayRunStudent extends Record<string, unknown> {
    fixed_schedule_day_run_student_id: string;

    student_boarding_status: StudentLegStatus;
    method: AttendanceMethod;
    mark_time?: string;
    mark_time_f?: string;
    note?: string;

    // Attendance Image/Logo
    student_attendance_image_url?: string
    student_attendance_image_key?: string
    student_attendance_image_name?: string

    // Metadata
    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    // Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;

    organisation_branch_id: string;
    OrganisationBranch?: OrganisationBranch;
    branch_name?: string;
    branch_city?: string;

    route_id: string;
    MasterRoute?: MasterRoute;
    route_name?: string;

    fixed_schedule_id: string;
    MasterFixedSchedule?: MasterFixedSchedule;
    schedule_name?: string;

    fixed_schedule_day_run_id: string;
    FixedScheduleDayRun?: FixedScheduleDayRun;

    planned_fixed_schedule_day_run_stop_id?: string;
    Planned_FixedScheduleDayRunStop?: FixedScheduleDayRunStop;

    actual_fixed_schedule_day_run_stop_id?: string;
    Actual_FixedScheduleDayRunStop?: FixedScheduleDayRunStop;

    student_id: string;
    Student?: Student;
    roll_number?: string;
    first_name?: string;
    last_name?: string;
    mobile_number?: string;
}

// FixedScheduleDayRun Update Schema
export const FixedScheduleDayRunUpdateSchema = z.object({
    // Relations - Parent
    vehicle_id: single_select_optional('MasterVehicle'), // Single-Selection -> MasterVehicle
    driver_id: single_select_optional('MasterDriver'), // Single-Selection -> MasterDriver
    attendant_id: single_select_optional('MasterDriver'), // Single-Selection -> MasterDriver

    // Main Field Details
    start_planned_date_time: dateTimeOptional('Start Planned Date Time'),
    end_planned_date_time: dateTimeOptional('End Planned Date Time'),
    notes: stringOptional('Notes', 0, 500),

    // Other
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FixedScheduleDayRunUpdateDTO = z.infer<
    typeof FixedScheduleDayRunUpdateSchema
>;

// FixedScheduleDayRun Cancel Schema
export const FixedScheduleDayRunCancelSchema = z.object({
    cancel_reason: stringOptional('Cancel Reason', 0, 500),
});
export type FixedScheduleDayRunCancelDTO = z.infer<
    typeof FixedScheduleDayRunCancelSchema
>;

// FixedScheduleDayRun Query Schema
export const FixedScheduleDayRunQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fixed_schedule_day_run_ids: multi_select_optional('FixedScheduleDayRun'), // Multi-selection -> FixedScheduleDayRun

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  organisation_branch_ids: multi_select_optional('OrganisationBranch'), // Multi-selection -> OrganisationBranch

  route_ids: multi_select_optional('MasterRoute'), // Multi-selection -> MasterRoute
  fixed_schedule_ids: multi_select_optional('MasterFixedSchedule'), // Multi-selection -> MasterFixedSchedule
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // Multi-selection -> MasterDriver
  attendant_ids: multi_select_optional('MasterDriver'), // Multi-selection -> MasterDriver

  // Enums
  schedule_type: enumArrayOptional(
    'Schedule Type',
    BusLeg,
    getAllEnums(BusLeg),
  ),
  day_run_status: enumArrayOptional(
    'Day Run Status',
    DayRunStatus,
    getAllEnums(DayRunStatus),
  ),
  running_status: enumArrayOptional(
    'Running Status',
    DayRunRunningStatus,
    getAllEnums(DayRunRunningStatus),
  ),

  // Other
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FixedScheduleDayRunQueryDTO = z.infer<
  typeof FixedScheduleDayRunQuerySchema
>;

// FixedScheduleDayRunStudent Update Schema
export const FixedScheduleDayRunStudentUpdateSchema = z.object({
    // Relations - Parent
    actual_fixed_schedule_day_run_stop_id: single_select_optional(
        'FixedScheduleDayRunStudent',
    ), // Single-Selection -> FixedScheduleDayRunStudent

    // Main Field Details
    method: enumMandatory('Method', AttendanceMethod, AttendanceMethod.None),
    mark_time: dateTimeOptional('Mark Time'),
    note: stringOptional('Note', 0, 500),

    // Attendance Image/Logo
    student_attendance_image_url: stringOptional(
        'Student Attendance Image URL',
        0,
        300,
    ),
    student_attendance_image_key: stringOptional(
        'Student Attendance Image Key',
        0,
        300,
    ),
    student_attendance_image_name: stringOptional(
        'Student Attendance Image Name',
        0,
        300,
    ),

    // Other
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FixedScheduleDayRunStudentUpdateDTO = z.infer<
    typeof FixedScheduleDayRunStudentUpdateSchema
>;

// FixedScheduleDayRunStop Enter Schema
export const FixedScheduleDayRunStopEnterSchema = z.object({
    // Main Field Details
    actual_arrival_time: dateTimeMandatory('Actual Arrival Time'),

    // Other
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FixedScheduleDayRunStopEnterDTO = z.infer<
    typeof FixedScheduleDayRunStopEnterSchema
>;

// FixedScheduleDayRunStop Exit Schema
export const FixedScheduleDayRunStopExitSchema = z.object({
    // Main Field Details
    actual_departure_time: dateTimeMandatory('Actual Departure Time'),

    // Other
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FixedScheduleDayRunStopExitDTO = z.infer<
    typeof FixedScheduleDayRunStopExitSchema
>;

// Convert FixedScheduleDayRun Update Data to API Payload
export const toFixedScheduleDayRunUpdatePayload = (row: FixedScheduleDayRun): FixedScheduleDayRunUpdateDTO => ({
    vehicle_id: row.vehicle_id || '',
    driver_id: row.driver_id || '',
    attendant_id: row.attendant_id || '',

    start_planned_date_time: row.start_planned_date_time || '',
    end_planned_date_time: row.end_planned_date_time || '',
    notes: row.notes || '',
    time_zone_id: '', // Needs to be provided manually
});

export const newFixedScheduleDayRunUpdatePayload = (): FixedScheduleDayRunUpdateDTO => ({
    vehicle_id: '',
    driver_id: '',
    attendant_id: '',

    start_planned_date_time: '',
    end_planned_date_time: '',
    notes: '',

    time_zone_id: '', // Needs to be provided manually
});

// Convert FixedScheduleDayRun Cancel Data to API Payload
export const toFixedScheduleDayRunCancelPayload = (row: FixedScheduleDayRun): FixedScheduleDayRunCancelDTO => ({
    cancel_reason: row.cancel_reason || '',
});

export const newFixedScheduleDayRunCancelPayload = (): FixedScheduleDayRunCancelDTO => ({
    cancel_reason: '',
});

// Convert FixedScheduleDayRunStudent Update Data to API Payload
export const toFixedScheduleDayRunStudentUpdatePayload = (row: FixedScheduleDayRunStudent): FixedScheduleDayRunStudentUpdateDTO => ({
    actual_fixed_schedule_day_run_stop_id: row.actual_fixed_schedule_day_run_stop_id || '',
    method: row.method || AttendanceMethod.None,
    mark_time: row.mark_time || '',
    note: row.note || '',

    // Attendance Image/Logo
    student_attendance_image_url: row.student_attendance_image_url || '',
    student_attendance_image_key: row.student_attendance_image_key || '',
    student_attendance_image_name: row.student_attendance_image_name || '',

    time_zone_id: '', // Needs to be provided manually
});

export const newFixedScheduleDayRunStudentUpdatePayload = (): FixedScheduleDayRunStudentUpdateDTO => ({
    actual_fixed_schedule_day_run_stop_id: '',
    method: AttendanceMethod.None,
    mark_time: '',
    note: '',

    // Attendance Image/Logo
    student_attendance_image_url: '',
    student_attendance_image_key: '',
    student_attendance_image_name: '',

    time_zone_id: '', // Needs to be provided manually
});

// Convert FixedScheduleDayRun Stop Enter Data to API Payload
export const toFixedScheduleDayRunStopEnterPayload = (row: FixedScheduleDayRunStop): FixedScheduleDayRunStopEnterDTO => ({
    actual_arrival_time: row.actual_arrival_time || '',

    time_zone_id: '', // Needs to be provided manually
});

export const newFixedScheduleDayRunStopEnterPayload = (): FixedScheduleDayRunStopEnterDTO => ({
    actual_arrival_time: '',

    time_zone_id: '', // Needs to be provided manually
});

// Convert FixedScheduleDayRun Stop Exit Data to API Payload
export const toFixedScheduleDayRunStopExitPayload = (row: FixedScheduleDayRunStop): FixedScheduleDayRunStopExitDTO => ({
    actual_departure_time: row.actual_departure_time || '',

    time_zone_id: '', // Needs to be provided manually
});

export const newFixedScheduleDayRunStopExitPayload = (): FixedScheduleDayRunStopExitDTO => ({
    actual_departure_time: '',

    time_zone_id: '', // Needs to be provided manually
});

// AWS S3 PRESIGNED
export const get_student_attendance_presigned_url = async (fileName: string): Promise<BR<AWSPresignedUrl>> => {
    return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.get_student_attendance_presigned_url(fileName));
};

// FixedScheduleDayRun APIs
export const find = async (data: FixedScheduleDayRunQueryDTO): Promise<FBR<FixedScheduleDayRun[]>> => {
    return apiPost<FBR<FixedScheduleDayRun[]>, FixedScheduleDayRunQueryDTO>(ENDPOINTS.find, data);
};

export const update_fixed_schedule_day_run = async (id: string, data: FixedScheduleDayRunUpdateDTO): Promise<SBR> => {
    return apiPatch<SBR, FixedScheduleDayRunUpdateDTO>(ENDPOINTS.update_fixed_schedule_day_run(id), data);
};

export const cancel_fixed_schedule_day_run = async (id: string, data: FixedScheduleDayRunCancelDTO): Promise<SBR> => {
    return apiPatch<SBR, FixedScheduleDayRunCancelDTO>(ENDPOINTS.cancel_fixed_schedule_day_run(id), data);
};

// FixedScheduleDayRunStudent APIs
export const update_student_boarded = async (id: string, data: FixedScheduleDayRunStudentUpdateDTO): Promise<SBR> => {
    return apiPatch<SBR, FixedScheduleDayRunStudentUpdateDTO>(ENDPOINTS.update_student_boarded(id), data);
};

export const update_student_handovered = async (id: string, data: FixedScheduleDayRunStudentUpdateDTO): Promise<SBR> => {
    return apiPatch<SBR, FixedScheduleDayRunStudentUpdateDTO>(ENDPOINTS.update_student_handovered(id), data);
};

// FixedScheduleDayRunStop APIs
export const update_stop_enter = async (id: string, data: FixedScheduleDayRunStopEnterDTO): Promise<SBR> => {
    return apiPatch<SBR, FixedScheduleDayRunStopEnterDTO>(ENDPOINTS.update_stop_enter(id), data);
};

export const update_stop_exit = async (id: string, data: FixedScheduleDayRunStopExitDTO): Promise<SBR> => {
    return apiPatch<SBR, FixedScheduleDayRunStopExitDTO>(ENDPOINTS.update_stop_exit(id), data);
};


