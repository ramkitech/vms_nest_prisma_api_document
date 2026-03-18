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
    dateOptional,
    getAllEnums,
    stringOptional,
    numberMandatory,
    enumOptional,
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
import { FixedScheduleDayRun, FixedScheduleDayRunStop, FixedScheduleDayRunStudent } from './day_run';

const URL = 'master_schedule';

const ENDPOINTS = {

    // MasterFixedSchedule APIs
    find_schedule: `${URL}/fixed_schedule/search`,
    create_schedule: `${URL}/fixed_schedule`,
    update_schedule: (id: string): string => `${URL}/fixed_schedule/${id}`,
    remove_schedule: (id: string): string => `${URL}/fixed_schedule/${id}`,

    find_schedule_student: `${URL}/fixed_schedule_student/search`,
    assign_fixed_schedule_to_students: `${URL}/fixed_schedule/assign_fixed_schedule_to_students`,
    remove_fixed_schedule_to_students: `${URL}/fixed_schedule/remove_fixed_schedule_to_students`,
    update_stop: `${URL}/fixed_schedule/update_stop`,
};

// MasterFixedSchedule Interface
export interface MasterFixedSchedule extends Record<string, unknown> {
    fixed_schedule_id: string;

    schedule_name: string;
    schedule_status: Status;
    schedule_type: BusLeg;

    max_seating_count: number;

    start_time?: string;
    end_time?: string;

    schedule_plan_start_date?: string;
    schedule_plan_start_date_f?: string;
    schedule_plan_end_date?: string;
    schedule_plan_end_date_f?: string;

    sunday: YesNo;
    monday: YesNo;
    tuesday: YesNo;
    wednesday: YesNo;
    thursday: YesNo;
    friday: YesNo;
    saturday: YesNo;

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
    MasterFixedScheduleStudent?: MasterFixedScheduleStudent[];

    FixedScheduleDayRun?: FixedScheduleDayRun[];
    FixedScheduleDayRunStop?: FixedScheduleDayRunStop[];
    FixedScheduleDayRunStudent?: FixedScheduleDayRunStudent[];

    // Relations - Child Count
    _count?: {
        MasterFixedScheduleStudent?: number;
        FixedScheduleDayRun?: number;
        FixedScheduleDayRunStop?: number;
        FixedScheduleDayRunStudent?: number;
    };
}

// MasterFixedScheduleStudent Interface
export interface MasterFixedScheduleStudent extends Record<string, unknown> {
    fixed_schedule_student_id: string;

    leg: BusLeg;

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

    student_id: string;
    Student?: Student;
    roll_number?: string;
    first_name?: string;
    last_name?: string;
    mobile_number?: string;

    fixed_schedule_id: string;
    MasterFixedSchedule?: MasterFixedSchedule;
    schedule_name?: string;

    route_id: string;
    MasterRoute?: MasterRoute;
    route_name?: string;

    route_stop_id?: string;
    MasterRouteStop?: MasterRouteStop;
    order_no?: string;
    stop_name?: string;
}

// MasterFixedSchedule Create/Update Schema
export const MasterFixedScheduleSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // Single-Selection -> OrganisationBranch

    route_id: single_select_mandatory('MasterRoute'), // Single-Selection -> MasterRoute
    vehicle_id: single_select_mandatory('MasterVehicle'), // Single-Selection -> MasterVehicle
    driver_id: single_select_optional('Driver'), // Single-Selection -> MasterDriver
    attendant_id: single_select_optional('Attendant'), // Single-Selection -> MasterDriver

    schedule_name: stringMandatory('Schedule Name', 3, 100),
    schedule_status: enumMandatory('Schedule Status', Status, Status.Active),
    schedule_type: enumMandatory('Schedule Type', BusLeg, BusLeg.Pickup),
    max_seating_count: numberMandatory('Max Seating Count'),

    start_time: stringOptional('Start Time'),
    end_time: stringOptional('End Time'),

    schedule_plan_start_date: dateOptional('Schedule Plan Start Date'),
    schedule_plan_end_date: dateOptional('Schedule Plan End Date'),

    sunday: enumOptional('Sunday', YesNo, YesNo.No),
    monday: enumOptional('Monday', YesNo, YesNo.Yes),
    tuesday: enumOptional('Tuesday', YesNo, YesNo.Yes),
    wednesday: enumOptional('Wednesday', YesNo, YesNo.Yes),
    thursday: enumOptional('Thursday', YesNo, YesNo.Yes),
    friday: enumOptional('Friday', YesNo, YesNo.Yes),
    saturday: enumOptional('Saturday', YesNo, YesNo.Yes),

    // Other
    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type MasterFixedScheduleDTO = z.infer<typeof MasterFixedScheduleSchema>;

// MasterFixedSchedule Query Schema
export const MasterFixedScheduleQuerySchema = BaseQuerySchema.extend({
    // Self Table
    fixed_schedule_ids: multi_select_optional('MasterFixedSchedule'), // Multi-selection -> MasterFixedSchedule

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
    organisation_branch_ids: multi_select_optional('OrganisationBranch'), // Multi-selection -> OrganisationBranch

    route_ids: multi_select_optional('MasterRoute'), // Multi-selection -> MasterRoute
    vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle
    driver_ids: multi_select_optional('Driver'), // Multi-selection -> MasterDriver
    attendant_ids: multi_select_optional('Attendant'), // Multi-selection -> MasterDriver

    // Enums
    schedule_status: enumArrayOptional(
        'Schedule Status',
        Status,
        getAllEnums(Status),
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

// MasterFixedScheduleStudent Query Schema
export const MasterFixedScheduleStudentQuerySchema = BaseQuerySchema.extend({
    // Self Table
    fixed_schedule_student_ids: multi_select_optional(
        'MasterFixedScheduleStudent',
    ), // Multi-selection -> MasterFixedScheduleStudent

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
    organisation_branch_ids: multi_select_optional('OrganisationBranch'), // Multi-selection -> OrganisationBranch

    student_ids: multi_select_optional('Student'), // Multi-selection -> Student
    fixed_schedule_ids: multi_select_optional('MasterFixedSchedule'), // Multi-selection -> MasterFixedSchedule

    route_ids: multi_select_optional('MasterRoute'), // Multi-selection -> MasterRoute
    route_stop_ids: multi_select_optional('MasterRouteStop'), // Multi-selection -> MasterRouteStop

    // Enums
    leg: enumArrayOptional('Leg', BusLeg, getAllEnums(BusLeg)),
});
export type MasterFixedScheduleStudentQueryDTO = z.infer<
    typeof MasterFixedScheduleStudentQuerySchema
>;

export const AssignFixedScheduleToStudentsSchema = z.object({
    fixed_schedule_id: single_select_mandatory('MasterFixedSchedule'),
    student_ids: multi_select_optional('Student'),
});
export type AssignFixedScheduleToStudentsDTO = z.infer<
    typeof AssignFixedScheduleToStudentsSchema
>;

export const RemoveFixedScheduleToStudentsSchema = z.object({
    fixed_schedule_id: single_select_mandatory('MasterFixedSchedule'),
    student_ids: multi_select_optional('Student'),
});
export type RemoveFixedScheduleToStudentsDTO = z.infer<
    typeof RemoveFixedScheduleToStudentsSchema
>;

export const UpdateStopSchema = z.object({
    fixed_schedule_student_id: single_select_mandatory(
        'MasterFixedScheduleStudent',
    ),
    route_stop_id: single_select_mandatory('MasterRouteStop'),
});
export type UpdateStopDTO = z.infer<typeof UpdateStopSchema>;

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
    schedule_type: row.schedule_type || BusLeg.Pickup,
    max_seating_count: row.max_seating_count || 0,

    start_time: row.start_time || "00:00",
    end_time: row.end_time || "00:00",

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
    schedule_type: BusLeg.Pickup,
    max_seating_count: 0,

    start_time: "00:00",
    end_time: "00:00",

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

// MasterFixedSchedule APIs
export const findMasterFixedSchedule = async (data: MasterFixedScheduleQueryDTO): Promise<FBR<MasterFixedSchedule[]>> => {
    return apiPost<FBR<MasterFixedSchedule[]>, MasterFixedScheduleQueryDTO>(ENDPOINTS.find_schedule, data);
};

export const findMasterFixedScheduleStudent = async (data: MasterFixedScheduleStudentQueryDTO): Promise<FBR<MasterFixedScheduleStudent[]>> => {
    return apiPost<FBR<MasterFixedScheduleStudent[]>, MasterFixedScheduleStudentQueryDTO>(ENDPOINTS.find_schedule_student, data);
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

export const assignFixedScheduleToStudents = async (data: AssignFixedScheduleToStudentsDTO): Promise<SBR> => {
    return apiPost<SBR, AssignFixedScheduleToStudentsDTO>(ENDPOINTS.assign_fixed_schedule_to_students, data);
};

export const removeFixedScheduleToStudents = async (data: RemoveFixedScheduleToStudentsDTO): Promise<SBR> => {
    return apiPost<SBR, RemoveFixedScheduleToStudentsDTO>(ENDPOINTS.remove_fixed_schedule_to_students, data);
};

export const updateStop = async (data: UpdateStopDTO): Promise<SBR> => {
    return apiPost<SBR, UpdateStopDTO>(ENDPOINTS.update_stop, data);
};


