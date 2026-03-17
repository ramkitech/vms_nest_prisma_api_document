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
import { Student } from './student';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';

const URL = 'bus_stop';


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
    FixedScheduleDayRunStudent?: FixedScheduleDayRunStudent[];

    // Relations - Child Count
    _count?: {
        FixedScheduleDayRunStudent?: number;
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

    fixed_schedule_day_run_stop_id: string;
    FixedScheduleDayRunStop?: FixedScheduleDayRunStop;

    student_id: string;
    Student?: Student;
    roll_number?: string;
    first_name?: string;
    last_name?: string;
    mobile_number?: string;
}


