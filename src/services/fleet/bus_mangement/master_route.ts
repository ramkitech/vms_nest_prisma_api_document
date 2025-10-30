// master_route_service.ts

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
    getAllEnums,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, BusLeg, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';
import { BusStop } from './bus_stop';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { Student } from './student';

// Base URL
const URL = 'master_route';

const ENDPOINTS = {
    create_route: (id: string): string => `${URL}/route/${id}`,
    find_route: `${URL}/route/search`,
    update_route: (id: string): string => `${URL}/route/${id}`,
    remove_route: (id: string): string => `${URL}/route/${id}`,

    // Schedule endpoints
    create_schedule: `${URL}/schedule`,
    find_schedule: `${URL}/schedule/search`,
    update_schedule: (id: string): string => `${URL}/schedule/${id}`,
    remove_schedule: (id: string): string => `${URL}/schedule/${id}`,

    // Route stops
    create_stops_first_time_route: `${URL}/create_stops_first_time_route`,
    append_route_stop: `${URL}/append_route_stop`,
    update_route_stop: (id: string): string => `${URL}/route_stop/${id}`,
    reorder_route_stops: `${URL}/reorder_route_stops`,
    delete_route_stops_all: `${URL}/delete_route_stops_all`,
    delete_route_stop_reorder: `${URL}/delete_route_stop_reorder`,

    // Student assign
    find_students_with_no_stop_pickup: `${URL}/students_with_no_stop_pickup/search`,
    find_students_with_no_stop_drop: `${URL}/students_with_no_stop_drop/search`,
    find_students_with_no_schedule_pickup: `${URL}/students_with_no_schedule_pickup/search`,
    find_students_with_no_schedule_drop: `${URL}/students_with_no_schedule_drop/search`,

    assign_route_students_pickup: `${URL}/assign_route_students_pickup`,
    assign_route_students_drop: `${URL}/assign_route_students_drop`,
    remove_route_students_pickup: `${URL}/remove_route_students_pickup`,
    remove_route_students_drop: `${URL}/remove_route_students_drop`,
    assign_master_route_student_stop_to_students_pickup: `${URL}/assign_master_route_student_stop_to_students_pickup`,
    assign_master_route_student_stop_to_students_drop: `${URL}/assign_master_route_student_stop_to_students_drop`,
    remove_master_route_student_stop_to_students_pickup: `${URL}/remove_master_route_student_stop_to_students_pickup`,
    remove_master_route_student_stop_to_students_drop: `${URL}/remove_master_route_student_stop_to_students_drop`,
    assign_master_route_student_schedule_to_students_pickup: `${URL}/assign_master_route_student_schedule_to_students_pickup`,
    assign_master_route_student_schedule_to_students_drop: `${URL}/assign_master_route_student_schedule_to_students_drop`,
    remove_master_route_student_schedule_to_students_pickup: `${URL}/remove_master_route_student_schedule_to_students_pickup`,
    remove_master_route_student_schedule_to_students_drop: `${URL}/remove_master_route_student_schedule_to_students_drop`,
};

// -----------------------------
// Interfaces (frontend model)
// -----------------------------
export interface MasterRoute extends Record<string, unknown> {
    route_id: string;
    route_name: string;
    route_code?: string;
    route_notes?: string;
    route_status: Status;

    pickup_journey_time_in_seconds?: number;
    drop_journey_time_in_seconds?: number;

    pickup_start_stop_id?: string;
    pickup_end_stop_id?: string;
    drop_start_stop_id?: string;
    drop_end_stop_id?: string;

    // Metadata
    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    organisation_branch_id: string;
    OrganisationBranch?: OrganisationBranch;

    // Navigation
    Pickup_Start_BusStop?: BusStop;
    Pickup_End_BusStop?: BusStop;
    Drop_Start_BusStop?: BusStop;
    Drop_End_BusStop?: BusStop;

    // children counts
    _count?: {
        MasterRouteStop?: number;
        MasterFixedSchedule?: number;
        MasterRouteStudent?: number;
    };
}

export interface MasterRouteStop extends Record<string, unknown> {
    route_stop_id: string;
    leg: BusLeg;
    order_no: number;
    stop_duration_seconds: number;
    travel_seconds_to_next_stop: number;

    stop_name?: string;

    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    organisation_id: string;
    organisation_branch_id: string;
    route_id: string;

    bus_stop_id?: string;
    BusStop?: BusStop;
}

export interface MasterFixedSchedule extends Record<string, unknown> {
    fixed_schedule_id: string;
    schedule_name: string;
    schedule_status: Status;
    is_stops_finalized: YesNo;
    schedule_type: BusLeg;

    start_hour?: number;
    start_minute?: number;
    end_hour?: number;
    end_minute?: number;

    schedule_plan_start_date?: string;
    schedule_plan_end_date?: string;

    sunday: YesNo;
    monday: YesNo;
    tuesday: YesNo;
    wednesday: YesNo;
    thursday: YesNo;
    friday: YesNo;
    saturday: YesNo;
    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    organisation_id: string;
    organisation_branch_id: string;
    route_id: string;

    vehicle_id?: string;
    driver_id?: string;
    attendant_id?: string;

    MasterVehicle?: MasterVehicle;
    MasterDriver?: MasterDriver;
}

export interface MasterRouteStudent extends Record<string, unknown> {
    route_student_id: string;
    leg: BusLeg | string;

    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    organisation_id?: string;
    organisation_branch_id?: string;

    route_id?: string;
    student_id?: string;
    route_stop_id?: string;
    fixed_schedule_id?: string;

    Student?: Student;
    MasterRouteStop?: MasterRouteStop;
    MasterFixedSchedule?: MasterFixedSchedule;
}

// -----------------------------
// Zod DTOs (create / update)
// -----------------------------

// ✅ MasterRoute Create/Update Schema
export const MasterRouteSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch

    pickup_start_stop_id: single_select_optional('Pickup_Start_BusStop'), // ✅ Single-Selection -> BusStop
    pickup_end_stop_id: single_select_optional('Pickup_End_BusStop'), // ✅ Single-Selection -> BusStop
    drop_start_stop_id: single_select_optional('Drop_Start_BusStop'), // ✅ Single-Selection -> BusStop
    drop_end_stop_id: single_select_optional('Drop_End_BusStop'), // ✅ Single-Selection -> BusStop

    route_name: stringMandatory('Route Name', 3, 100),
    route_code: stringOptional('Route Code', 0, 100),
    route_notes: stringOptional('Route Notes', 0, 500),
    route_status: enumMandatory('Route Status', Status, Status.Active),

    pickup_journey_time_in_seconds: numberOptional(
        'Pickup Journey Time In Seconds',
    ),
    drop_journey_time_in_seconds: numberOptional('Drop Journey Time In Seconds'),

    status: enumMandatory('Status', Status, Status.Active),
});
export type MasterRouteDTO = z.infer<typeof MasterRouteSchema>;

// ✅ MasterRoute Query Schema
export const MasterRouteQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-selection -> OrganisationBranch
    route_ids: multi_select_optional('MasterRoute'), // ✅ Multi-selection -> MasterRoute
    route_status: enumArrayOptional('Route Status', Status, getAllEnums(Status)),
});
export type MasterRouteQueryDTO = z.infer<typeof MasterRouteQuerySchema>;

// ✅ MasterFixedSchedule Create/Update Schema
export const MasterFixedScheduleSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute

    vehicle_id: single_select_optional('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
    driver_id: single_select_optional('Driver'), // ✅ Single-Selection -> MasterDriver
    attendant_id: single_select_optional('Attendant'), // ✅ Single-Selection -> MasterDriver

    schedule_name: stringMandatory('Schedule Name', 3, 100),
    schedule_status: enumMandatory('Schedule Status', Status, Status.Active),
    is_stops_finalized: enumMandatory('Is Stops Finalized', YesNo, YesNo.No),
    schedule_type: enumMandatory('Schedule Type', BusLeg, BusLeg.Pickup),

    start_hour: numberOptional('Start Hour'),
    start_minute: numberOptional('Start Minute'),
    end_hour: numberOptional('End Hour'),
    end_minute: numberOptional('End Minute'),

    schedule_plan_start_date: dateOptional('Schedule Plan Start Date'),
    schedule_plan_end_date: dateOptional('Schedule Plan End Date'),

    sunday: enumMandatory('Sunday', YesNo, YesNo.No),
    monday: enumMandatory('Monday', YesNo, YesNo.Yes),
    tuesday: enumMandatory('Tuesday', YesNo, YesNo.Yes),
    wednesday: enumMandatory('Wednesday', YesNo, YesNo.Yes),
    thursday: enumMandatory('Thursday', YesNo, YesNo.Yes),
    friday: enumMandatory('Friday', YesNo, YesNo.Yes),
    saturday: enumMandatory('Saturday', YesNo, YesNo.Yes),

    status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFixedScheduleDTO = z.infer<typeof MasterFixedScheduleSchema>;

// ✅ MasterFixedSchedule Query Schema
export const MasterFixedScheduleQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-selection -> OrganisationBranch
    route_ids: multi_select_optional('MasterRoute'), // ✅ Multi-selection -> MasterRoute
    vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-selection -> MasterVehicle
    driver_ids: multi_select_optional('Driver'), // ✅ Multi-selection -> MasterDriver
    attendant_ids: multi_select_optional('Attendant'), // ✅ Multi-selection -> MasterDriver
    fixed_schedule_ids: multi_select_optional('MasterFixedSchedule'), // ✅ Multi-selection -> MasterFixedSchedule

    schedule_status: enumArrayOptional(
        'Schedule Status',
        Status,
        getAllEnums(Status),
    ),
    is_stops_finalized: enumArrayOptional(
        'Is Stops Finalized',
        YesNo,
        getAllEnums(YesNo),
    ),
    schedule_type: enumArrayOptional(
        'Schedule Type',
        BusLeg,
        getAllEnums(BusLeg),
    ),
});
export type MasterFixedScheduleQueryDTO = z.infer<
    typeof MasterFixedScheduleQuerySchema
>;

// ✅ MasterRouteStop Create Array Schema
export const MasterRouteStopSchema = z.object({
    order_no: numberMandatory('Order No'),
    stop_duration_seconds: numberMandatory('Stop Duration Seconds'),
    travel_seconds_to_next_stop: numberMandatory('Travel Seconds To Next Stop'),
    bus_stop_id: single_select_mandatory('BusStop'), // ✅ Single-Selection -> BusStop
});
export type MasterRouteStopDTO = z.infer<typeof MasterRouteStopSchema>;

// ✅ MasterRouteStop Update Schema
export const MasterRouteStopUpdateSchema = z.object({
    stop_duration_seconds: numberMandatory('Stop Duration Seconds'),
    travel_seconds_to_next_stop: numberMandatory('Travel Seconds To Next Stop'),
    bus_stop_id: single_select_mandatory('BusStop'),
});
export type MasterRouteStopUpdateDTO = z.infer<
    typeof MasterRouteStopUpdateSchema
>;

// ✅ MasterRouteStop Create Schema
export const MasterRouteStopCreateSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
    leg: enumMandatory('Leg', BusLeg, BusLeg.Pickup),
    status: enumMandatory('Status', Status, Status.Active),
    MasterRouteStop: nestedArrayOfObjectsOptional(
        'MasterRouteStop',
        MasterRouteStopSchema,
        [],
    ),
});
export type MasterRouteStopCreateDTO = z.infer<
    typeof MasterRouteStopCreateSchema
>;

// ✅ MasterRouteStop Reorder Array Schema
export const MasterRouteStopIds = z.object({
    route_stop_id: single_select_mandatory('MasterRouteStop'), // ✅ Single-Selection -> MasterRouteStop
});
export type MasterRouteStopIdsDTO = z.infer<typeof MasterRouteStopIds>;

// ✅ MasterRouteStop Reorder Schema
export const MasterRouteStopReorderSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
    leg: enumMandatory('Leg', BusLeg, BusLeg.Pickup),
    MasterRouteStopIds: nestedArrayOfObjectsOptional(
        'MasterRouteStopIds',
        MasterRouteStopIds,
        [],
    ),
});
export type MasterRouteStopReorderDTO = z.infer<
    typeof MasterRouteStopReorderSchema
>;

// ✅ MasterRouteStop DeleteAll Schema
export const MasterRouteStopDeleteAllSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
    leg: enumMandatory('Leg', BusLeg, BusLeg.Pickup),
});
export type MasterRouteStopDeleteDTO = z.infer<
    typeof MasterRouteStopDeleteAllSchema
>;

// ✅ MasterRouteStop Delete Schema
export const MasterRouteStopDeleteSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
    bus_stop_id: single_select_mandatory('BusStop'), // ✅ Single-Selection -> BusStop
    leg: enumMandatory('Leg', BusLeg, BusLeg.Pickup),
});
export type MasterRouteStopDeleteReOrderDTO = z.infer<
    typeof MasterRouteStopDeleteSchema
>;

// ✅ Student NoRoute Query Schema
export const StudentNoStopQuerySchema = BaseQuerySchema.extend({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
});
export type StudentNoStopQueryDTO = z.infer<typeof StudentNoStopQuerySchema>;

// ✅ Student NoRoute Query Schema
export const StudentNoScheduleQuerySchema = BaseQuerySchema.extend({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
});
export type StudentNoScheduleQueryDTO = z.infer<
    typeof StudentNoScheduleQuerySchema
>;

// MasterRouteStudent assign remove Schema
export const MasterRouteStudentAssignRemoveSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
    student_ids: multi_select_optional('Student'), // Multi selection -> Student
});
export type MasterRouteStudentAssignRemoveDTO = z.infer<
    typeof MasterRouteStudentAssignRemoveSchema
>;

// MasterRouteStudent assign remove Schema
export const MasterRouteStudentStopAssignRemoveSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
    route_stop_id: single_select_mandatory('MasterRouteStop'), // ✅ Single-Selection -> MasterRouteStop
    route_student_ids: multi_select_optional('MasterRouteStudent'), // Multi selection -> MasterRouteStudent
});
export type MasterRouteStudentStopAssignRemoveDTO = z.infer<
    typeof MasterRouteStudentStopAssignRemoveSchema
>;

// MasterRouteStudent assign remove Schema
export const MasterRouteStudentScheduleAssignRemoveSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
    fixed_schedule_id: single_select_mandatory('MasterFixedSchedule'), // ✅ Single-Selection -> MasterFixedSchedule
    route_student_ids: multi_select_optional('MasterRouteStudent'), // Multi selection -> MasterRouteStudent
});
export type MasterRouteStudentScheduleAssignRemoveDTO = z.infer<
    typeof MasterRouteStudentScheduleAssignRemoveSchema
>;

// -----------------------------
// Helpers: payload creators
// -----------------------------
export const toMasterRoutePayload = (row: MasterRoute): MasterRouteDTO => ({
    organisation_id: row.organisation_id,
    organisation_branch_id: row.organisation_branch_id,
    pickup_start_stop_id: row.pickup_start_stop_id ?? '',
    pickup_end_stop_id: row.pickup_end_stop_id ?? '',
    drop_start_stop_id: row.drop_start_stop_id ?? '',
    drop_end_stop_id: row.drop_end_stop_id ?? '',
    route_name: row.route_name,
    route_code: row.route_code ?? '',
    route_notes: row.route_notes ?? '',
    route_status: row.route_status,
    pickup_journey_time_in_seconds: Number(row.pickup_journey_time_in_seconds) ?? 0,
    drop_journey_time_in_seconds: Number(row.drop_journey_time_in_seconds) ?? 0,
    status: row.status ?? Status.Active,
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
    drop_journey_time_in_seconds: 0,
});

export const toMasterFixedSchedulePayload = (row: MasterFixedSchedule): MasterFixedScheduleDTO => ({
    organisation_id: row.organisation_id,
    organisation_branch_id: row.organisation_branch_id,
    route_id: row.route_id,
    vehicle_id: row.vehicle_id ?? '',
    driver_id: row.driver_id ?? '',
    attendant_id: row.attendant_id ?? '',
    schedule_name: row.schedule_name,
    schedule_status: row.schedule_status,
    is_stops_finalized: row.is_stops_finalized,
    schedule_type: row.schedule_type,
    start_hour: Number(row.start_hour) ?? '',
    start_minute: Number(row.start_minute) ?? '',
    end_hour: Number(row.end_hour) ?? '',
    end_minute: Number(row.end_minute) ?? '',
    schedule_plan_start_date: row.schedule_plan_start_date ?? '',
    schedule_plan_end_date: row.schedule_plan_end_date ?? '',
    sunday: row.sunday,
    monday: row.monday,
    tuesday: row.tuesday,
    wednesday: row.wednesday,
    thursday: row.thursday,
    friday: row.friday,
    saturday: row.saturday,
    status: row.status,
});

export const newMasterFixedSchedulePayload = (): MasterFixedScheduleDTO => ({
    route_id: '',
    status: Status.Active,
    organisation_id: '',
    organisation_branch_id: '',
    schedule_name: '',
    schedule_status: Status.Active,
    is_stops_finalized: YesNo.Yes,
    schedule_type: BusLeg.Pickup,
    start_hour: 0,
    start_minute: 0,
    end_hour: 0,
    end_minute: 0,
    schedule_plan_start_date: '',
    schedule_plan_end_date: '',
    sunday: YesNo.Yes,
    monday: YesNo.Yes,
    tuesday: YesNo.Yes,
    wednesday: YesNo.Yes,
    thursday: YesNo.Yes,
    friday: YesNo.Yes,
    saturday: YesNo.Yes,
    vehicle_id: '',
    driver_id: '',
    attendant_id: ''
});

export const toMasterRouteStopPayload = (row: MasterRouteStop): MasterRouteStopCreateDTO => ({
    organisation_id: row.organisation_id,
    organisation_branch_id: row.organisation_branch_id,
    route_id: row.route_id,
    leg: row.leg,
    status: row.status,
    MasterRouteStop: [],
});

export const newMasterRouteStopPayload = (): MasterRouteStopCreateDTO => ({
    organisation_id: '',
    organisation_branch_id: '',
    route_id: '',
    leg: BusLeg.Pickup,
    status: Status.Active,
    MasterRouteStop: [],
});

export const toMasterRouteStopReorderPayload = (row: MasterRouteStop): MasterRouteStopReorderDTO => ({
    route_id: row.route_id ?? '',
    leg: row.leg,
    MasterRouteStopIds: [],
});

export const toMasterRouteStudentAssignPayload = (row: MasterRouteStudent): MasterRouteStudentAssignRemoveDTO => ({
    route_id: row.route_id ?? '',
    student_ids: Array.isArray((row as any).student_ids) ? (row as any).student_ids : [],
});

export const newMasterRouteStudentAssignPayload = (): MasterRouteStudentAssignRemoveDTO => ({
    route_id: '',
    student_ids: [],
});

// -----------------------------
// API Methods
// -----------------------------

// MasterRoute CRUD
export const findMasterRoute = async (data: MasterRouteQueryDTO): Promise<FBR<MasterRoute[]>> => {
    return apiPost<FBR<MasterRoute[]>, MasterRouteQueryDTO>(ENDPOINTS.find_route, data);
};

export const createMasterRoute = async (id: string, data: MasterRouteDTO): Promise<SBR> => {
    return apiPatch<SBR, MasterRouteDTO>(ENDPOINTS.create_route(id), data);
};

export const updateMasterRoute = async (id: string, data: MasterRouteDTO): Promise<SBR> => {
    return apiPatch<SBR, MasterRouteDTO>(ENDPOINTS.update_route(id), data);
};

export const deleteMasterRoute = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_route(id));
};

// Fixed Schedule - CRUD
export const findMasterFixedSchedule = async (data: MasterFixedScheduleQueryDTO): Promise<FBR<MasterFixedSchedule[]>> => {
    return apiPost<FBR<MasterFixedSchedule[]>, MasterFixedScheduleQueryDTO>(ENDPOINTS.find_schedule, data);
};

export const createMasterFixedSchedule = async (data: MasterFixedScheduleDTO): Promise<SBR> => {
    return apiPost<SBR, MasterFixedScheduleDTO>(ENDPOINTS.create_schedule, data);
};

export const updateMasterFixedSchedule = async (id: string, data: MasterFixedScheduleDTO): Promise<SBR> => {
    return apiPatch<SBR, MasterFixedScheduleDTO>(ENDPOINTS.update_schedule(id), data);
};

export const deleteMasterFixedSchedule = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_schedule(id));
};

// MasterRouteStop APIs
export const createStopsFirstTimeRoute = async (data: MasterRouteStopCreateDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStopCreateDTO>(ENDPOINTS.create_stops_first_time_route, data);
};

export const appendRouteStop = async (data: MasterRouteStopCreateDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStopCreateDTO>(ENDPOINTS.append_route_stop, data);
};

export const updateRouteStop = async (id: string, data: MasterRouteStopUpdateDTO): Promise<SBR> => {
    return apiPatch<SBR, MasterRouteStopUpdateDTO>(ENDPOINTS.update_route_stop(id), data);
};

export const reorderRouteStops = async (data: MasterRouteStopReorderDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStopReorderDTO>(ENDPOINTS.reorder_route_stops, data);
};

export const deleteRouteStopsAll = async (data: MasterRouteStopDeleteDTO): Promise<SBR> => {
    // Controller expects a body with DELETE. If apiDelete supports body, use it. Otherwise adjust.
    // @ts-ignore
    return apiDelete<SBR, MasterRouteStopDeleteDTO>(ENDPOINTS.delete_route_stops_all, data);
};

export const deleteRouteStopReorder = async (data: MasterRouteStopDeleteReOrderDTO): Promise<SBR> => {
    // @ts-ignore
    return apiDelete<SBR, MasterRouteStopDeleteReOrderDTO>(ENDPOINTS.delete_route_stop_reorder, data);
};

// MasterRouteStudent assign/unassign
export const findStudentsWithNoStopPickup = async (data: StudentNoStopQueryDTO): Promise<FBR<MasterRouteStudent[]>> => {
    return apiPost<FBR<MasterRouteStudent[]>, StudentNoStopQueryDTO>(ENDPOINTS.find_students_with_no_stop_pickup, data);
};

export const findStudentsWithNoStopDrop = async (data: StudentNoStopQueryDTO): Promise<FBR<MasterRouteStudent[]>> => {
    return apiPost<FBR<MasterRouteStudent[]>, StudentNoStopQueryDTO>(ENDPOINTS.find_students_with_no_stop_drop, data);
};

export const findStudentsWithNoSchedulePickup = async (data: StudentNoScheduleQueryDTO): Promise<FBR<MasterRouteStudent[]>> => {
    return apiPost<FBR<MasterRouteStudent[]>, StudentNoScheduleQueryDTO>(ENDPOINTS.find_students_with_no_schedule_pickup, data);
};

export const findStudentsWithNoScheduleDrop = async (data: StudentNoScheduleQueryDTO): Promise<FBR<MasterRouteStudent[]>> => {
    return apiPost<FBR<MasterRouteStudent[]>, StudentNoScheduleQueryDTO>(ENDPOINTS.find_students_with_no_schedule_drop, data);
};


export const assignRouteStudentsPickup = async (data: MasterRouteStudentAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentAssignRemoveDTO>(ENDPOINTS.assign_route_students_pickup, data);
};

export const assignRouteStudentsDrop = async (data: MasterRouteStudentAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentAssignRemoveDTO>(ENDPOINTS.assign_route_students_drop, data);
};

export const removeRouteStudentsPickup = async (data: MasterRouteStudentAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentAssignRemoveDTO>(ENDPOINTS.remove_route_students_pickup, data);
};

export const removeRouteStudentsDrop = async (data: MasterRouteStudentAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentAssignRemoveDTO>(ENDPOINTS.remove_route_students_drop, data);
};


export const assignMasterRouteStudentStopToStudentsPickup = async (data: MasterRouteStudentStopAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentStopAssignRemoveDTO>(ENDPOINTS.assign_master_route_student_stop_to_students_pickup, data);
};

export const assignMasterRouteStudentStopToStudentsDrop = async (data: MasterRouteStudentStopAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentStopAssignRemoveDTO>(ENDPOINTS.assign_master_route_student_stop_to_students_drop, data);
};

export const removeMasterRouteStudentStopToStudentsPickup = async (data: MasterRouteStudentStopAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentStopAssignRemoveDTO>(ENDPOINTS.remove_master_route_student_stop_to_students_pickup, data);
};

export const removeMasterRouteStudentStopToStudentsDrop = async (data: MasterRouteStudentStopAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentStopAssignRemoveDTO>(ENDPOINTS.remove_master_route_student_stop_to_students_drop, data);
};

export const assignMasterRouteStudentScheduleToStudentsPickup = async (data: MasterRouteStudentScheduleAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentScheduleAssignRemoveDTO>(ENDPOINTS.assign_master_route_student_schedule_to_students_pickup, data);
};

export const assignMasterRouteStudentScheduleToStudentDrop = async (data: MasterRouteStudentScheduleAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentScheduleAssignRemoveDTO>(ENDPOINTS.assign_master_route_student_schedule_to_students_drop, data);
};

export const removeMasterRouteStudentScheduleToStudentPickup = async (data: MasterRouteStudentScheduleAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentScheduleAssignRemoveDTO>(ENDPOINTS.remove_master_route_student_schedule_to_students_pickup, data);
};

export const removeMasterRouteStudentScheduleToStudentDrop = async (data: MasterRouteStudentScheduleAssignRemoveDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStudentScheduleAssignRemoveDTO>(ENDPOINTS.remove_master_route_student_schedule_to_students_drop, data);
};
