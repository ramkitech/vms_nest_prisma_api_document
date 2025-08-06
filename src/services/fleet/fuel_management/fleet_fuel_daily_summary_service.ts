// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    single_select_mandatory,
    multi_select_optional,
    enumMandatory,
    dateMandatory,
    enumOptional,
    single_select_optional,
    doubleMandatory,
    numberMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from '../../main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterDevice } from 'src/services/main/devices/master_device_service';

const URL = 'fleet/fuel_management/fleet_fuel_daily_summary';

const ENDPOINTS = {
    find: `${URL}/search`,
    find_monthly: `${URL}/monthly/search`,
    create: URL,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,
};

// ✅ FleetFuelDailySummary Interface
export interface FleetFuelDailySummary extends Record<string, unknown> {
    // Primary Fields
    fleet_fuel_daily_summary_id: string;

    date: string; // ISO date string
    day?: string; // Optional, Max: 20

    start_fuel_liters: number;
    end_fuel_liters: number;
    total_km: number;
    consumed_fuel_liters: number;
    refills_count: number;
    refill_liters: number;
    removals_count: number;
    removal_liters: number;
    mileage_kmpl: number;
    liters_per_100km: number;

    // Metadata
    status: Status;
    added_date_time: string; // ISO string
    modified_date_time: string; // ISO string

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    user_id?: string;
    User?: User;

    vehicle_id: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;

    driver_id?: string;
    MasterDriver?: MasterDriver;
    driver_details?: string;

    device_id: string;
    MasterDevice?: MasterDevice;
    device_identifier?: string;

    // Optional count object (if used in aggregation queries)
    _count?: {
        MasterVehicle?: number;
    };
}

// ✅ FleetFuelDailySummary Create/Update Schema
export const FleetFuelDailySummarySchema = z.object({
    organisation_id: single_select_mandatory('Organisation ID'),
    user_id: single_select_optional('User'),
    vehicle_id: single_select_mandatory('Master Vehicle ID'),
    driver_id: single_select_optional('Driver ID'),
    device_id: single_select_optional('Device ID'),

    date: dateMandatory('Date'),

    start_fuel_liters: doubleMandatory('Start Fuel Liters'),
    end_fuel_liters: doubleMandatory('End Fuel Liters'),
    total_km: doubleMandatory('Total KM'),

    consumed_fuel_liters: doubleMandatory('Consumed Fuel Liters'),

    refills_count: numberMandatory('Refills Count'),
    refill_liters: doubleMandatory('Refill Liters'),
    removals_count: numberMandatory('Removals Count'),
    removal_liters: doubleMandatory('Removal Liters'),

    mileage_kmpl: doubleMandatory('Mileage KMPL'),
    liters_per_100km: doubleMandatory('Liters Per 100 KM'),

    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetFuelDailySummaryDTO = z.infer<
    typeof FleetFuelDailySummarySchema
>;

// ✅ FleetFuelDailySummary Query Schema
export const FleetFuelDailySummaryQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
    user_ids: multi_select_optional('User IDs'), // ✅ Multi-selection -> User
    vehicle_ids: multi_select_optional('Master Vehicle IDs'), // ✅ Multi-selection -> MasterVehicle
    driver_ids: multi_select_optional('Master Driver IDs'), // ✅ Multi-selection -> MasterDriver
    device_ids: multi_select_optional('Master Device IDs'), // ✅ Multi-selection -> MasterDevice
    from_date: dateMandatory('From Date'),
    to_date: dateMandatory('To Date'),
    vehicle_summary: enumOptional('Vehicle Summary', YesNo, YesNo.No),
    day_summary: enumOptional('Day Summary', YesNo, YesNo.No),
});
export type FleetFuelDailySummaryQueryDTO = z.infer<
    typeof FleetFuelDailySummaryQuerySchema
>;

// ✅ GPS Fuel Vehicle Monthly Summary Query Schema
export const FleetFuelDailyMonthlySummaryQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
    vehicle_ids: multi_select_optional('Master Vehicle IDs'), // ✅ Multi-selection -> MasterVehicle
    from_date: dateMandatory('From Date'),
    to_date: dateMandatory('To Date'),
});
export type FleetFuelDailyMonthlySummaryQueryDTO = z.infer<
    typeof FleetFuelDailyMonthlySummaryQuerySchema
>;

// Convert existing data to a payload structure
export const toFleetFuelDailySummaryPayload = (
    row: FleetFuelDailySummary
): FleetFuelDailySummaryDTO => ({
    organisation_id: row.organisation_id ?? '',
    user_id: row.user_id || '',
    vehicle_id: row.vehicle_id ?? '',
    driver_id: row.driver_id || '',
    device_id: row.device_id || '',

    date: row.date,

    start_fuel_liters: row.start_fuel_liters,
    end_fuel_liters: row.end_fuel_liters,
    total_km: row.total_km,
    consumed_fuel_liters: row.consumed_fuel_liters,

    refills_count: row.refills_count,
    refill_liters: row.refill_liters,
    removals_count: row.removals_count,
    removal_liters: row.removal_liters,

    mileage_kmpl: row.mileage_kmpl,
    liters_per_100km: row.liters_per_100km,

    status: row.status,
});

// API Methods
export const findFleetFuelDailySummary = async (
    data: FleetFuelDailySummaryQueryDTO
): Promise<FBR<FleetFuelDailySummary[]>> => {
    return apiPost<FBR<FleetFuelDailySummary[]>, FleetFuelDailySummaryQueryDTO>(
        ENDPOINTS.find,
        data
    );
};

export const findFleetFuelMonthlySummary = async (
    data: FleetFuelDailyMonthlySummaryQueryDTO
): Promise<FBR<FleetFuelDailySummary[]>> => {
    return apiPost<FBR<FleetFuelDailySummary[]>, FleetFuelDailyMonthlySummaryQueryDTO>(
        ENDPOINTS.find_monthly,
        data
    );
};

export const createFleetFuelDailySummary = async (
    data: FleetFuelDailySummaryDTO
): Promise<SBR> => {
    return apiPost<SBR, FleetFuelDailySummaryDTO>(ENDPOINTS.create, data);
};

export const updateFleetFuelDailySummary = async (
    id: string,
    data: FleetFuelDailySummaryDTO
): Promise<SBR> => {
    return apiPatch<SBR, FleetFuelDailySummaryDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetFuelDailySummary = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};
