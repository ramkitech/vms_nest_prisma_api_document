// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringMandatory,
    single_select_mandatory,
    single_select_optional,
    multi_select_optional,
    enumMandatory,
    enumArrayOptional,
    numberOptional,
    dateOptional,
    getAllEnums,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, BusLeg, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { Student } from './student';
import { MasterRoute, MasterRouteStop } from './master_route';

const URL = 'master_schedule';

const ENDPOINTS = {

    // MasterFixedSchedule APIs
    find_schedule: `${URL}/schedule/search`,
    create_schedule: `${URL}/schedule`,
    update_schedule: (id: string): string => `${URL}/schedule/${id}`,
    remove_schedule: (id: string): string => `${URL}/schedule/${id}`,

    // MasterRouteStudent assign/unassign APIs
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

// MasterFixedSchedule Interface
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

    vehicle_id?: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;

    driver_id?: string;
    MasterDriver?: MasterDriver;
    driver_details?: string;

    attendant_id?: string;
    Attendant?: MasterDriver;
    attendant_details?: string;

    // Relations - Child
    // Child - Fleet
    MasterRouteStudent?: MasterRouteStudent[];
    // FixedScheduleDayRun?: FixedScheduleDayRun[];
    // FixedScheduleDayRunStop?: FixedScheduleDayRunStop[];
    // FixedScheduleDayRunStudent?: FixedScheduleDayRunStudent[];

    // Relations - Child Count
    _count?: {
        MasterRouteStudent?: number;
        FixedScheduleDayRun?: number;
        FixedScheduleDayRunStop?: number;
        FixedScheduleDayRunStudent?: number;
    };
}

// MasterRouteStudent Interface
export interface MasterRouteStudent extends Record<string, unknown> {
    route_student_id: string;
    leg: BusLeg | string;

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

    student_id?: string;
    Student?: Student;

    route_stop_id?: string;
    MasterRouteStop?: MasterRouteStop;

    fixed_schedule_id?: string;
    MasterFixedSchedule?: MasterFixedSchedule;
}

// MasterFixedSchedule Create/Update Schema
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

    // Other
    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type MasterFixedScheduleDTO = z.infer<typeof MasterFixedScheduleSchema>;

// MasterFixedSchedule Query Schema
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

// StudentNoRoute Query Schema
export const StudentNoStopQuerySchema = BaseQuerySchema.extend({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
});
export type StudentNoStopQueryDTO = z.infer<typeof StudentNoStopQuerySchema>;

// StudentNoSchedule Query Schema
export const StudentNoScheduleQuerySchema = BaseQuerySchema.extend({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
});
export type StudentNoScheduleQueryDTO = z.infer<
    typeof StudentNoScheduleQuerySchema
>;

// MasterRouteStudentAssignRemove Schema
export const MasterRouteStudentAssignRemoveSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
    student_ids: multi_select_optional('Student'), // Multi selection -> Student
});
export type MasterRouteStudentAssignRemoveDTO = z.infer<
    typeof MasterRouteStudentAssignRemoveSchema
>;

// MasterRouteStudentAssignRemove Schema
export const MasterRouteStudentStopAssignRemoveSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
    route_stop_id: single_select_mandatory('MasterRouteStop'), // ✅ Single-Selection -> MasterRouteStop
    route_student_ids: multi_select_optional('MasterRouteStudent'), // Multi selection -> MasterRouteStudent
});
export type MasterRouteStudentStopAssignRemoveDTO = z.infer<
    typeof MasterRouteStudentStopAssignRemoveSchema
>;

// MasterRouteStudentAssignRemove Schema
export const MasterRouteStudentScheduleAssignRemoveSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // ✅ Single-Selection -> MasterRoute
    fixed_schedule_id: single_select_mandatory('MasterFixedSchedule'), // ✅ Single-Selection -> MasterFixedSchedule
    route_student_ids: multi_select_optional('MasterRouteStudent'), // Multi selection -> MasterRouteStudent
});
export type MasterRouteStudentScheduleAssignRemoveDTO = z.infer<
    typeof MasterRouteStudentScheduleAssignRemoveSchema
>;

// Convert MasterFixedSchedule Data to API Payload
export const toMasterFixedSchedulePayload = (row: MasterFixedSchedule): MasterFixedScheduleDTO => ({
    organisation_id: row.organisation_id || '',
    organisation_branch_id: row.organisation_branch_id || '',
    route_id: row.route_id || '',

    vehicle_id: row.vehicle_id || '',
    driver_id: row.driver_id || '',
    attendant_id: row.attendant_id || '',

    schedule_name: row.schedule_name || '',
    schedule_status: row.schedule_status || Status.Active,
    is_stops_finalized: row.is_stops_finalized || YesNo.No,
    schedule_type: row.schedule_type || BusLeg.Pickup,

    start_hour: row.start_hour || 0,
    start_minute: row.start_minute || 0,
    end_hour: row.end_hour || 0,
    end_minute: row.end_minute || 0,

    schedule_plan_start_date: row.schedule_plan_start_date || '',
    schedule_plan_end_date: row.schedule_plan_end_date || '',

    sunday: row.sunday || YesNo.No,
    monday: row.monday || YesNo.Yes,
    tuesday: row.tuesday || YesNo.Yes,
    wednesday: row.wednesday || YesNo.Yes,
    thursday: row.thursday || YesNo.Yes,
    friday: row.friday || YesNo.Yes,
    saturday: row.saturday || YesNo.Yes,

    status: row.status || Status.Active,
    time_zone_id: '', // Needs to be provided manually
});

// Create New MasterFixedSchedule Payload
export const newMasterFixedSchedulePayload = (): MasterFixedScheduleDTO => ({
    route_id: '',
    organisation_id: '',
    organisation_branch_id: '',

    schedule_name: '',
    schedule_status: Status.Active,
    is_stops_finalized: YesNo.No,
    schedule_type: BusLeg.Pickup,

    start_hour: 0,
    start_minute: 0,
    end_hour: 0,
    end_minute: 0,

    schedule_plan_start_date: '',
    schedule_plan_end_date: '',

    sunday: YesNo.No,
    monday: YesNo.Yes,
    tuesday: YesNo.Yes,
    wednesday: YesNo.Yes,
    thursday: YesNo.Yes,
    friday: YesNo.Yes,
    saturday: YesNo.Yes,

    vehicle_id: '',
    driver_id: '',
    attendant_id: '',

    status: Status.Active,
    time_zone_id: '', // Needs to be provided manually
});

// Convert MasterRouteStudentAssign Data to API Payload
export const toMasterRouteStudentAssignPayload = (row: MasterRouteStudent): MasterRouteStudentAssignRemoveDTO => ({
    route_id: row.route_id || '',
    student_ids: [],
});

// Create New MasterRouteStudentAssign Payload
export const newMasterRouteStudentAssignPayload = (): MasterRouteStudentAssignRemoveDTO => ({
    route_id: '',
    student_ids: [],
});

// MasterFixedSchedule APIs
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

// MasterRouteStudent assign/unassign APIs
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
