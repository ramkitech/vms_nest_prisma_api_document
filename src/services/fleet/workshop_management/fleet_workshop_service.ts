// Imports
import { apiPost, apiPatch, apiDelete, apiGet } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    enumMandatory,
    single_select_mandatory,
    single_select_optional,
    multi_select_optional,
    stringMandatory,
    stringOptional,
    doubleOptionalLatLng,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterMainLandMark } from 'src/services/master/main/master_main_landmark_service';
import { FleetService } from 'src/services/fleet/service_management/fleet_service_service';

const URL = 'fleet/workshop_management/workshop';

const ENDPOINTS = {
    // FleetWorkshop APIs
    find: `${URL}/search`,
    create: `${URL}`,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    fleet_workshop_dashboard: `${URL}/fleet_workshop_dashboard`,

    // FleetWorkshop Cache
    cache_simple: (organisation_id: string): string => `${URL}/cache_simple/${organisation_id}`,
};

// FleetWorkshop Interface
export interface FleetWorkshop extends Record<string, unknown> {
    // Primary Field
    workshop_id: string;

    // Main Field Details
    workshop_name: string;
    workshop_description?: string;

    // Location Details
    latitude?: number;
    longitude?: number;
    google_location?: string;

    landmark_id?: string;
    MasterMainLandMark?: MasterMainLandMark;
    landmark_location?: string;
    landmark_distance?: number;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;
    organisation_logo_url?: string;

    user_id?: string;
    User?: User;
    user_details?: string;
    user_image_url?: string;

    // Relations - Child
    // Child - Fleet
    FleetService?: FleetService[];
    //   FleetTyreRetreading?: FleetTyreRetreading[];
    //   FleetTyreDamageRepair?: FleetTyreDamageRepair[];
    //   FleetSparePartsUsage?: FleetSparePartsUsage[];
    //   FleetSparePartsInventory?: FleetSparePartsInventory[];
    //   FleetSparePartsPurchaseOrders?: FleetSparePartsPurchaseOrders[];

    // Relations - Child Count
    _count?: {
        FleetService?: number;
        FleetTyreRetreading?: number;
        FleetTyreDamageRepair?: number;
        FleetSparePartsUsage?: number;
        FleetSparePartsInventory?: number;
        FleetSparePartsPurchaseOrders?: number;
    };
}

// WorkshopDashboard Interface
export interface WorkshopDashboard extends Record<string, unknown> {
    workshop_id: string;
    workshop_name: string;
    total_services: number;
    pending_services: number;
    inprogress_services: number;
    onhold_services: number;
    cancelled_services: number;
    completed_services: number;

    // Relations - Child Count
    _count?: {};
}

// FleetWorkshopSimple Interface
export interface FleetWorkshopSimple extends Record<string, unknown> {
    workshop_id: string;
    workshop_name: string;
    workshop_description?: string;

    // Relations - Child Count
    _count?: {};
}

// FleetWorkshop Create/Update Schema
export const FleetWorkshopSchema = z.object({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
    user_id: single_select_optional('User'), // Single-Selection -> User

    // Main Field Details
    workshop_name: stringMandatory('Workshop Name', 3, 100),
    workshop_description: stringOptional('Description', 0, 2000),

    // Location Details
    latitude: doubleOptionalLatLng('Latitude'),
    longitude: doubleOptionalLatLng('Longitude'),
    google_location: stringOptional('Google Location', 0, 500),

    // Metadata
    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetWorkshopDTO = z.infer<typeof FleetWorkshopSchema>;

// FleetWorkshop Query Schema
export const FleetWorkshopQuerySchema = BaseQuerySchema.extend({
    // Self Table
    workshop_ids: multi_select_optional('FleetWorkshop'), // Multi-Selection -> FleetWorkshop

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
    user_ids: multi_select_optional('User'), // Multi-Selection -> User
});
export type FleetWorkshopQueryDTO = z.infer<typeof FleetWorkshopQuerySchema>;

// FleetWorkshopDashBoard Query Schema
export const FleetWorkshopDashBoardQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
    workshop_ids: multi_select_optional('FleetWorkshop'), // Multi-Selection -> FleetWorkshop
});
export type FleetWorkshopDashBoardQueryDTO = z.infer<typeof FleetWorkshopDashBoardQuerySchema>;

// Convert FleetWorkshop Data to API Payload
export const toFleetWorkshopPayload = (row: FleetWorkshop): FleetWorkshopDTO => ({
    organisation_id: row.organisation_id || '',
    user_id: row.user_id || '',

    workshop_name: row.workshop_name || '',
    workshop_description: row.workshop_description || '',

    latitude: row.latitude || 0,
    longitude: row.longitude || 0,
    google_location: row.google_location || '',

    status: row.status || Status.Active,
});

// Create New FleetWorkshop Payload
export const newFleetWorkshopPayload = (): FleetWorkshopDTO => ({
    organisation_id: '',
    user_id: '',

    workshop_name: '',
    workshop_description: '',

    latitude: 0,
    longitude: 0,
    google_location: '',

    status: Status.Active,
});

// FleetWorkshop APIs
export const findFleetWorkshop = async (data: FleetWorkshopQueryDTO): Promise<FBR<FleetWorkshop[]>> => {
    return apiPost<FBR<FleetWorkshop[]>, FleetWorkshopQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetWorkshop = async (data: FleetWorkshopDTO): Promise<SBR> => {
    return apiPost<SBR, FleetWorkshopDTO>(ENDPOINTS.create, data);
};

export const updateFleetWorkshop = async (id: string, data: FleetWorkshopDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetWorkshopDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetWorkshop = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const fleet_workshop_dashboard = async (data: FleetWorkshopDashBoardQueryDTO): Promise<FBR<WorkshopDashboard[]>> => {
    return apiPost<FBR<WorkshopDashboard[]>, FleetWorkshopDashBoardQueryDTO>(ENDPOINTS.fleet_workshop_dashboard, data);
};

// FleetWorkshop Cache
export const find_workshop_cache_simple = async (organisation_id: string): Promise<FBR<FleetWorkshopSimple[]>> => {
    return apiGet<FBR<FleetWorkshopSimple[]>>(ENDPOINTS.cache_simple(organisation_id));
};