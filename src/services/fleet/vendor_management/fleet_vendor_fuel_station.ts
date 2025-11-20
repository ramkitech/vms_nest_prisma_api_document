// Imports
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringMandatory,
    stringOptional,
    enumMandatory,
    single_select_mandatory,
    multi_select_optional,
    enumArrayOptional,
    doubleOptionalLatLng,
    doubleOptional,
    dateMandatory,
    doubleMandatoryAmount,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../../core/Enums';

// Other Models
import { MasterMainLandmark } from 'src/services/master/main/master_main_landmark_service';
import { FleetVendor } from './fleet_vendor_service';
import { MasterFuelCompany } from 'src/services/master/expense/master_fuel_company_service';
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';

const URL = 'fleet/vendor_management/fuel_station';

const ENDPOINTS = {
    find: `${URL}/search`,
    create: `${URL}`,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,
};

// ✅ FleetVendorFuelStation Interface
export interface FleetVendorFuelStation extends Record<string, unknown> {
    // ✅ Primary Fields
    fuel_station_id: string;

    // Basic Info
    station_name: string;
    station_code?: string;
    is_company_owned: YesNo;

    // Notes & Feedback
    station_notes?: string;
    station_feedback?: string;
    station_rating?: number;
    is_preferred_station: YesNo;

    // Operational Details
    operating_hours?: string;
    is_24x7: YesNo;
    supports_credit: YesNo;
    fuel_card_supported: YesNo;
    accepted_payment_modes?: string;
    supported_fuel_types?: string;

    offers_service: YesNo;
    has_weighbridge: YesNo;
    air_check_available: YesNo;

    // Contact Info
    station_email?: string;
    station_mobile?: string;
    station_phone?: string;
    website_url?: string;

    // Address
    address_line1?: string;
    address_line2?: string;
    locality_landmark?: string;
    neighborhood?: string;
    town_city?: string;
    district_county?: string;
    state_province_region?: string;
    postal_code?: string;
    country?: string;
    country_code?: string;

    // Location Details
    latitude?: number;
    longitude?: number;
    google_location?: string;

    landmark_id?: string;
    MasterMainLandMark?: MasterMainLandmark;
    landmark_location?: string;
    landmark_distance?: number;

    // ✅ Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // ✅ Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    vendor_id: string;
    FleetVendor?: FleetVendor;
    vendor_name?: string;

    fuel_company_id: string;
    MasterFuelCompany?: MasterFuelCompany;
    company_name?: string;

    // ✅ Count (Child Relations)
    _count?: {
        FleetFuelStationRate: number;
        FleetFuelRefill: number;
    };
}


// ✅ FleetVendorFuelStation Create/Update Schema
export const FleetVendorFuelStationSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vendor_id: single_select_mandatory('FleetVendor'), // ✅ Single-Selection -> FleetVendor
    fuel_company_id: single_select_mandatory('MasterFuelCompany'), // ✅ Single-Selection -> MasterFuelCompany

    // Basic Info
    station_name: stringMandatory('Station Name', 3, 100),
    station_code: stringOptional('Station Code', 0, 50),
    is_company_owned: enumMandatory('Is Company Owned', YesNo, YesNo.No),

    // Operational Details
    operating_hours: stringOptional('Operating Hours', 0, 200),
    is_24x7: enumMandatory('Is 24x7', YesNo, YesNo.No),
    supports_credit: enumMandatory('Supports Credit', YesNo, YesNo.No),
    fuel_card_supported: enumMandatory('Fuel Card Supported', YesNo, YesNo.No),
    accepted_payment_modes: stringOptional('Accepted Payment Modes', 0, 300),
    supported_fuel_types: stringOptional('Supported Fuel Types', 0, 200),

    offers_service: enumMandatory('Offers Service', YesNo, YesNo.No),
    has_weighbridge: enumMandatory('Has Weighbridge', YesNo, YesNo.No),
    air_check_available: enumMandatory('Air Check Available', YesNo, YesNo.Yes),

    // Contact Info
    station_email: stringOptional('Station Email', 0, 100),
    station_mobile: stringOptional('Station Mobile', 0, 15),
    station_phone: stringOptional('Station Phone', 0, 15),
    website_url: stringOptional('Website URL', 0, 200),

    // Address
    address_line1: stringOptional('Address Line 1', 0, 150),
    address_line2: stringOptional('Address Line 2', 0, 150),
    locality_landmark: stringOptional('Locality / Landmark', 0, 150),
    neighborhood: stringOptional('Neighborhood', 0, 100),
    town_city: stringOptional('Town / City', 0, 100),
    district_county: stringOptional('District / County', 0, 100),
    state_province_region: stringOptional('State / Province / Region', 0, 100),
    postal_code: stringOptional('Postal Code', 0, 20),
    country: stringOptional('Country', 0, 100),
    country_code: stringOptional('Country Code', 0, 5),

    // Location Details
    latitude: doubleOptionalLatLng('Latitude'),
    longitude: doubleOptionalLatLng('Longitude'),
    google_location: stringOptional('Google Location', 0, 500),

    // Notes & Feedback
    station_notes: stringOptional('Station Notes', 0, 2000),
    station_feedback: stringOptional('Station Feedback', 0, 2000),
    station_rating: doubleOptional('Station Rating'),
    is_preferred_station: enumMandatory('Is Preferred Station', YesNo, YesNo.No),

    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorFuelStationDTO = z.infer<
    typeof FleetVendorFuelStationSchema
>;

// ✅ FleetVendorFuelStation Query Schema
export const FleetVendorFuelStationQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation

    vendor_ids: multi_select_optional('FleetVendor'), // ✅ Single-Selection -> FleetVendor
    fuel_company_ids: multi_select_optional('MasterFuelCompany'), // ✅ Single-Selection -> MasterFuelCompany
    fuel_station_ids: multi_select_optional('FleetVendorFuelStation'), // ✅ Single-Selection -> FleetVendorFuelStation

    is_company_owned: enumArrayOptional('Is Company Owned', YesNo),
    is_preferred_station: enumArrayOptional('Is Preferred Station', YesNo),
});
export type FleetVendorFuelStationQueryDTO = z.infer<
    typeof FleetVendorFuelStationQuerySchema
>;

// ✅ FleetFuelStationRate Create/Update Schema
export const FleetFuelStationRateSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    fuel_station_id: single_select_mandatory('FleetVendorFuelStation'), // ✅ Single-Selection -> FleetVendorFuelStation
    vehicle_fuel_type_id: single_select_mandatory('MasterVehicleFuelType'), // ✅ Single-Selection -> MasterVehicleFuelType
    vehicle_fuel_unit_id: single_select_mandatory('MasterVehicleFuelUnit'), // ✅ Single-Selection -> MasterVehicleFuelUnit
    rate_date: dateMandatory('Rate Date'),
    price_per_unit: doubleMandatoryAmount('Price Per Unit'),
    remarks: stringOptional('Remarks', 0, 500),
    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetFuelStationRateDTO = z.infer<
    typeof FleetFuelStationRateSchema
>;

// ✅ FleetFuelStationRate Query Schema
export const FleetFuelStationRateQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    fuel_station_ids: multi_select_optional('FleetVendorFuelStation'), // ✅ Multi-Selection -> FleetVendorFuelStation
    vehicle_fuel_type_ids: multi_select_optional('MasterVehicleFuelType'), // ✅ Multi-Selection -> MasterVehicleFuelType
    vehicle_fuel_unit_ids: multi_select_optional('MasterVehicleFuelUnit'), // ✅ Multi-Selection -> MasterVehicleFuelUnit
    fuel_rate_ids: multi_select_optional('FleetFuelStationRate'), // ✅ Multi-Selection -> FleetFuelStationRate
});
export type FleetFuelStationRateQueryDTO = z.infer<
    typeof FleetFuelStationRateQuerySchema
>;


// ✅ Convert FleetVendorFuelStation Data to API Payload
export const toFleetVendorFuelStationPayload = (vendorFuelStation: FleetVendorFuelStation): FleetVendorFuelStationDTO => ({
    // Basic Info
    station_name: vendorFuelStation.station_name || '',
    station_code: vendorFuelStation.station_code || '',
    is_company_owned: vendorFuelStation.is_company_owned || YesNo.No,

    // Notes & Feedback
    station_notes: vendorFuelStation.station_notes || '',
    station_feedback: vendorFuelStation.station_feedback || '',
    station_rating: vendorFuelStation.station_rating || 0,
    is_preferred_station: vendorFuelStation.is_preferred_station || YesNo.No,

    // Operational Details
    operating_hours: vendorFuelStation.operating_hours || '',
    is_24x7: vendorFuelStation.is_24x7 || YesNo.No,
    supports_credit: vendorFuelStation.supports_credit || YesNo.No,
    fuel_card_supported: vendorFuelStation.fuel_card_supported || YesNo.No,
    accepted_payment_modes: vendorFuelStation.accepted_payment_modes || '',
    supported_fuel_types: vendorFuelStation.supported_fuel_types || '',

    offers_service: vendorFuelStation.offers_service || YesNo.No,
    has_weighbridge: vendorFuelStation.has_weighbridge || YesNo.No,
    air_check_available: vendorFuelStation.air_check_available || YesNo.Yes,

    // Contact Info
    station_email: vendorFuelStation.station_email || '',
    station_mobile: vendorFuelStation.station_mobile || '',
    station_phone: vendorFuelStation.station_phone || '',
    website_url: vendorFuelStation.website_url || '',

    // Address Details
    address_line1: vendorFuelStation.address_line1 || '',
    address_line2: vendorFuelStation.address_line2 || '',
    locality_landmark: vendorFuelStation.locality_landmark || '',
    neighborhood: vendorFuelStation.neighborhood || '',
    town_city: vendorFuelStation.town_city || '',
    district_county: vendorFuelStation.district_county || '',
    state_province_region: vendorFuelStation.state_province_region || '',
    postal_code: vendorFuelStation.postal_code || '',
    country: vendorFuelStation.country || '',
    country_code: vendorFuelStation.country_code || '',

    // Location Details
    latitude: vendorFuelStation.latitude || 0,
    longitude: vendorFuelStation.longitude || 0,
    google_location: vendorFuelStation.google_location || '',

    organisation_id: vendorFuelStation.organisation_id || '',
    vendor_id: vendorFuelStation.vendor_id || '',
    fuel_company_id: vendorFuelStation.fuel_company_id || '',

    status: Status.Active,
});

// ✅ Create New FleetVendorFuelStation Payload
export const newFleetVendorFuelStationPayload = (): FleetVendorFuelStationDTO => ({
    station_name: '',
    station_code: '',
    is_company_owned: YesNo.No,

    station_notes: '',
    station_feedback: '',
    station_rating: 0,
    is_preferred_station: YesNo.No,

    operating_hours: '',
    is_24x7: YesNo.No,
    supports_credit: YesNo.No,
    fuel_card_supported: YesNo.No,
    accepted_payment_modes: '',
    supported_fuel_types: '',

    offers_service: YesNo.No,
    has_weighbridge: YesNo.No,
    air_check_available: YesNo.Yes,

    station_email: '',
    station_mobile: '',
    station_phone: '',
    website_url: '',

    address_line1: '',
    address_line2: '',
    locality_landmark: '',
    neighborhood: '',
    town_city: '',
    district_county: '',
    state_province_region: '',
    postal_code: '',
    country: '',
    country_code: '',

    latitude: 0,
    longitude: 0,
    google_location: '',

    organisation_id: '',
    vendor_id: '',
    fuel_company_id: '',

    status: Status.Active,
});

// API Methods
export const findFleetVendorFuelStation = async (data: FleetVendorFuelStationQueryDTO): Promise<FBR<FleetVendorFuelStation[]>> => {
    return apiPost<FBR<FleetVendorFuelStation[]>, FleetVendorFuelStationQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetVendorFuelStation = async (data: FleetVendorFuelStationDTO): Promise<SBR> => {
    return apiPost<SBR, FleetVendorFuelStationDTO>(ENDPOINTS.create, data);
};

export const updateFleetVendorFuelStation = async (id: string, data: FleetVendorFuelStationDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetVendorFuelStationDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetVendorFuelStation = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};