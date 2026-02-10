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
    numberOptional,
    numberMandatory,
    nestedArrayOfObjectsOptional,
    getAllEnums,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, BusLeg } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';
import { BusStop } from './bus_stop';

const URL = 'master_route';

const ENDPOINTS = {
    // MasterRoute APIs
    find_route: `${URL}/route/search`,
    create_route: `${URL}/route`,
    update_route: (id: string): string => `${URL}/route/${id}`,
    remove_route: (id: string): string => `${URL}/route/${id}`,

    // MasterRouteStop APIs
    create_stops_first_time_route: `${URL}/create_stops_first_time_route`,
    append_route_stop: `${URL}/append_route_stop`,
    update_route_stop: (id: string): string => `${URL}/route_stop/${id}`,
    reorder_route_stops: `${URL}/reorder_route_stops`,
    delete_route_stops_all: `${URL}/delete_route_stops_all`,
    delete_route_stop_reorder: `${URL}/delete_route_stop_reorder`,
};

// MasterRoute Interface
export interface MasterRoute extends Record<string, unknown> {
    // Primary Field
    route_id: string;

    // Main Field Details
    route_name: string;
    route_notes?: string;
    route_status: Status;

    // Journey Time
    pickup_journey_time_in_minutes?: number;
    drop_journey_time_in_minutes?: number;

    pickup_start_stop_id?: string;
    Pickup_Start_BusStop?: BusStop;
    pickup_start_stop_name?: string;

    pickup_end_stop_id?: string;
    Pickup_End_BusStop?: BusStop;
    pickup_end_stop_name?: string;

    drop_start_stop_id?: string;
    Drop_Start_BusStop?: BusStop;
    drop_start_stop_name?: string;

    drop_end_stop_id?: string;
    Drop_End_BusStop?: BusStop;
    drop_end_stop_name?: string;

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

    // Relations - Child
    MasterRouteStop?: MasterRouteStop[];

    // Relations - Child Count
    _count?: {
        MasterRouteStop?: number;
    };
}

// MasterRouteStop Interface
export interface MasterRouteStop extends Record<string, unknown> {

    // Primary Field
    route_stop_id: string;

    // Main Field Details
    leg: BusLeg;
    order_no: number;
    stop_duration_seconds: number;
    travel_seconds_to_next_stop: number;

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

    bus_stop_id: string;
    BusStop?: BusStop;
    stop_name?: string;

    // Relations - Child

    // Relations - Child Count
    _count?: {
    };
}

// MasterRoute Create/Update Schema
export const MasterRouteSchema = z.object({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // Single-Selection -> OrganisationBranch

    // Main Field Details
    route_name: stringMandatory('Route Name', 3, 100),
    route_notes: stringOptional('Route Notes', 0, 500),
    route_status: enumMandatory('Route Status', Status, Status.Active),

    pickup_journey_time_in_minutes: numberOptional(
        'Pickup Journey Time In Minutes',
    ),
    drop_journey_time_in_minutes: numberOptional('Drop Journey Time In Minutes'),

    // Stops Info
    pickup_start_stop_id: single_select_optional('Pickup_Start_BusStop'), // Single-Selection -> BusStop
    pickup_end_stop_id: single_select_optional('Pickup_End_BusStop'), // Single-Selection -> BusStop
    drop_start_stop_id: single_select_optional('Drop_Start_BusStop'), // Single-Selection -> BusStop
    drop_end_stop_id: single_select_optional('Drop_End_BusStop'), // Single-Selection -> BusStop

    // Metadata
    status: enumMandatory('Status', Status, Status.Active),
});
export type MasterRouteDTO = z.infer<typeof MasterRouteSchema>;

// MasterRoute Query Schema
export const MasterRouteQuerySchema = BaseQuerySchema.extend({
    // Self Table
    route_ids: multi_select_optional('MasterRoute'), // Multi-selection -> MasterRoute

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
    organisation_branch_ids: multi_select_optional('OrganisationBranch'), // Multi-selection -> OrganisationBranch

    // Enums
    route_status: enumArrayOptional('Route Status', Status, getAllEnums(Status)),
});
export type MasterRouteQueryDTO = z.infer<typeof MasterRouteQuerySchema>;

// MasterRouteStop Create Array Schema
export const MasterRouteStopSchema = z.object({
    order_no: numberMandatory('Order No'),
    stop_duration_seconds: numberMandatory('Stop Duration Seconds'),
    travel_seconds_to_next_stop: numberMandatory('Travel Seconds To Next Stop'),
    bus_stop_id: single_select_mandatory('BusStop'), // Single-Selection -> BusStop
});
export type MasterRouteStopDTO = z.infer<typeof MasterRouteStopSchema>;

// MasterRouteStop Update Schema
export const MasterRouteStopUpdateSchema = z.object({
    stop_duration_seconds: numberMandatory('Stop Duration Seconds'),
    travel_seconds_to_next_stop: numberMandatory('Travel Seconds To Next Stop'),
    bus_stop_id: single_select_mandatory('BusStop'),
});
export type MasterRouteStopUpdateDTO = z.infer<
    typeof MasterRouteStopUpdateSchema
>;

// MasterRouteStop Create Schema
export const MasterRouteStopCreateSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // Single-Selection -> OrganisationBranch
    route_id: single_select_mandatory('MasterRoute'), // Single-Selection -> MasterRoute
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

// MasterRouteStop Reorder Array Schema
export const MasterRouteStopIds = z.object({
    route_stop_id: single_select_mandatory('MasterRouteStop'), // Single-Selection -> MasterRouteStop
});
export type MasterRouteStopIdsDTO = z.infer<typeof MasterRouteStopIds>;

// MasterRouteStop Reorder Schema
export const MasterRouteStopReorderSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // Single-Selection -> MasterRoute
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

// MasterRouteStop Delete Schema
export const MasterRouteStopDeleteSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // Single-Selection -> MasterRoute
    leg: enumMandatory('Leg', BusLeg, BusLeg.Pickup),
    bus_stop_id: single_select_mandatory('BusStop'), // Single-Selection -> BusStop
});
export type MasterRouteStopDeleteReOrderDTO = z.infer<
    typeof MasterRouteStopDeleteSchema
>;

// MasterRouteStop DeleteAll Schema
export const MasterRouteStopDeleteAllSchema = z.object({
    route_id: single_select_mandatory('MasterRoute'), // Single-Selection -> MasterRoute
    leg: enumMandatory('Leg', BusLeg, BusLeg.Pickup),
});
export type MasterRouteStopDeleteDTO = z.infer<
    typeof MasterRouteStopDeleteAllSchema
>;

// Convert MasterRoute Data to API Payload
export const toMasterRoutePayload = (row: MasterRoute): MasterRouteDTO => ({
    organisation_id: row.organisation_id || '',
    organisation_branch_id: row.organisation_branch_id || '',

    route_name: row.route_name || '',
    route_notes: row.route_notes || '',
    route_status: row.route_status || Status.Active,

    pickup_journey_time_in_minutes: row.pickup_journey_time_in_minutes || 0,
    drop_journey_time_in_minutes: row.drop_journey_time_in_minutes || 0,

    pickup_start_stop_id: row.pickup_start_stop_id || '',
    pickup_end_stop_id: row.pickup_end_stop_id || '',
    drop_start_stop_id: row.drop_start_stop_id || '',
    drop_end_stop_id: row.drop_end_stop_id || '',

    status: row.status || Status.Active,
});

// Create New MasterRoute Payload
export const newMasterRoutePayload = (): MasterRouteDTO => ({
    organisation_id: '',
    organisation_branch_id: '',

    route_name: '',
    route_notes: '',
    route_status: Status.Active,

    pickup_journey_time_in_minutes: 0,
    drop_journey_time_in_minutes: 0,

    pickup_start_stop_id: '',
    pickup_end_stop_id: '',
    drop_start_stop_id: '',
    drop_end_stop_id: '',

    status: Status.Active,
});

// MasterRoute APIs
export const findMasterRoute = async (data: MasterRouteQueryDTO): Promise<FBR<MasterRoute[]>> => {
    return apiPost<FBR<MasterRoute[]>, MasterRouteQueryDTO>(ENDPOINTS.find_route, data);
};

export const createMasterRoute = async (data: MasterRouteDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteDTO>(ENDPOINTS.create_route, data);
};

export const updateMasterRoute = async (id: string, data: MasterRouteDTO): Promise<SBR> => {
    return apiPatch<SBR, MasterRouteDTO>(ENDPOINTS.update_route(id), data);
};

export const deleteMasterRoute = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_route(id));
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
    return apiPost<SBR, MasterRouteStopDeleteDTO>(ENDPOINTS.delete_route_stops_all, data);
};

export const deleteRouteStopReorder = async (data: MasterRouteStopDeleteReOrderDTO): Promise<SBR> => {
    return apiPost<SBR, MasterRouteStopDeleteReOrderDTO>(ENDPOINTS.delete_route_stop_reorder, data);
};


