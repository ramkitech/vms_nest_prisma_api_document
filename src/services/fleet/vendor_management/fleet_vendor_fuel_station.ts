// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    enumMandatory,
    enumArrayOptional,
    getAllEnums,
    single_select_mandatory,
    single_select_optional,
    multi_select_optional,
    stringMandatory,
    stringOptional,
    numberOptional,
    doubleOptionalLatLng,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { FleetVendor } from 'src/services/fleet/vendor_management/fleet_vendor_service';
import { MasterMainLandMark } from 'src/services/master/main/master_main_landmark_service';
import { MasterFuelCompany } from 'src/services/master/expense/master_fuel_company_service';
import { FleetFuelRefill } from 'src/services/fleet/fuel_management/fleet_fuel_refill_service';

const URL = 'fleet/vendor_management/fleet_vendor_fuel_station';

const ENDPOINTS = {
    // FleetVendorFuelStation APIs
    find: `${URL}/search`,
    create: `${URL}`,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    // FleetVendorFuelStation Cache
    cache_simple: (organisation_id: string): string => `${URL}/cache_simple/${organisation_id}`,
};

// FleetVendorFuelStation Interface
export interface FleetVendorFuelStation extends Record<string, unknown> {
    // Primary Field
    fuel_station_id: string;

    // Basic Info
    fuel_station_name: string;
    fuel_station_code?: string;
    is_company_owned: YesNo;

    // Notes
    is_preferred_station: YesNo;
    notes?: string;

    // Rating
    rating?: number;
    rating_comments?: string;

    // Contact Info
    contact_email?: string;
    contact_number?: string;
    website_url?: string;

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

    vendor_id: string;
    FleetVendor?: FleetVendor;
    vendor_logo_url?: string;
    vendor_name?: string;
    vendor_code?: string;

    fuel_company_id: string;
    MasterFuelCompany?: MasterFuelCompany;
    company_name?: string;

    // Relations - Child
    // Child - Fleet
    FleetFuelRefill?: FleetFuelRefill[];

    // Relations - Child Count
    _count?: {
        FleetFuelRefill?: number;
        FleetFuelRefill_liters?: number;
        FleetFuelRefill_ThisMonth?: number;
        FleetFuelRefill_ThisMonth_liters?: number;
        FleetFuelRefill_ThisYear?: number;
        FleetFuelRefill_ThisYear_liters?: number;
    };
}

// FleetVendorFuelStationSimple Interface
export interface FleetVendorFuelStationSimple extends Record<string, unknown> {
    vendor_id: string;
    fuel_station_id: string;
    fuel_station_name: string;
    fuel_station_code?: string;

    // Relations - Child Count
    _count?: {};
}

// FleetVendorFuelStation Create/Update Schema
export const FleetVendorFuelStationSchema = z.object({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
    user_id: single_select_optional('User'), // Single-Selection -> User
    vendor_id: single_select_optional('FleetVendor'), // Single-Selection -> FleetVendor
    fuel_company_id: single_select_mandatory('MasterFuelCompany'), // Single-Selection -> MasterFuelCompany

    // Main Field Details
    // Basic Info
    fuel_station_name: stringMandatory('Fuel Station Name', 3, 100),
    fuel_station_code: stringOptional('Fuel Station Code', 0, 100),
    is_company_owned: enumMandatory('Is Company Owned', YesNo, YesNo.No),

    // Notes
    is_preferred_station: enumMandatory('Is Preferred Station', YesNo, YesNo.No),
    notes: stringOptional('Notes', 0, 2000),

    // Rating
    rating: numberOptional('Rating', 0, 5),
    rating_comments: stringOptional('Rating Comments', 0, 2000),

    // Contact Info
    contact_email: stringOptional('Contact Email', 0, 100),
    contact_number: stringOptional('Contact Number', 0, 15),
    website_url: stringOptional('Website URL', 0, 200),

    // Operational Details
    operating_hours: stringOptional('Operating Hours', 0, 100),
    is_24x7: enumMandatory('Is 24x7', YesNo, YesNo.No),
    supports_credit: enumMandatory('Supports Credit', YesNo, YesNo.No),
    fuel_card_supported: enumMandatory('Fuel Card Supported', YesNo, YesNo.No),
    accepted_payment_modes: stringOptional('Accepted Payment Modes', 0, 500),
    supported_fuel_types: stringOptional('Supported Fuel Types', 0, 500),

    offers_service: enumMandatory('Offers Service', YesNo, YesNo.No),
    has_weighbridge: enumMandatory('Has Weighbridge', YesNo, YesNo.No),
    air_check_available: enumMandatory('Air Check Available', YesNo, YesNo.Yes),

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

    // Metadata
    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorFuelStationDTO = z.infer<typeof FleetVendorFuelStationSchema>;

// FleetVendorFuelStation Query Schema
export const FleetVendorFuelStationQuerySchema = BaseQuerySchema.extend({
    // Self Table
    fuel_station_ids: multi_select_optional('FleetVendorFuelStation'), // Multi-Selection -> FleetVendorFuelStation

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
    user_ids: multi_select_optional('User'), // Multi-Selection -> User
    vendor_ids: multi_select_optional('FleetVendor'), // Multi-Selection -> FleetVendor
    fuel_company_ids: multi_select_optional('MasterFuelCompany'), // Multi-Selection -> MasterFuelCompany

    // Enums
    is_company_owned: enumArrayOptional('Is Company Owned', YesNo, getAllEnums(YesNo)),
    is_preferred_station: enumArrayOptional('Is Preferred Station', YesNo, getAllEnums(YesNo)),
});
export type FleetVendorFuelStationQueryDTO = z.infer<typeof FleetVendorFuelStationQuerySchema>;

// Convert FleetVendorFuelStation Data to API Payload
export const toFleetVendorFuelStationPayload = (row: FleetVendorFuelStation): FleetVendorFuelStationDTO => ({
    organisation_id: row.organisation_id || '',
    user_id: row.user_id || '',
    vendor_id: row.vendor_id || '',
    fuel_company_id: row.fuel_company_id || '',

    // Basic Info
    fuel_station_name: row.fuel_station_name || '',
    fuel_station_code: row.fuel_station_code || '',
    is_company_owned: row.is_company_owned || YesNo.No,

    // Notes
    is_preferred_station: row.is_preferred_station || YesNo.No,
    notes: row.notes || '',

    // Rating
    rating: row.rating || 0,
    rating_comments: row.rating_comments || '',

    // Contact Info
    contact_email: row.contact_email || '',
    contact_number: row.contact_number || '',
    website_url: row.website_url || '',

    // Operational Details
    operating_hours: row.operating_hours || '',
    is_24x7: row.is_24x7 || YesNo.No,
    supports_credit: row.supports_credit || YesNo.No,
    fuel_card_supported: row.fuel_card_supported || YesNo.No,
    accepted_payment_modes: row.accepted_payment_modes || '',
    supported_fuel_types: row.supported_fuel_types || '',

    offers_service: row.offers_service || YesNo.No,
    has_weighbridge: row.has_weighbridge || YesNo.No,
    air_check_available: row.air_check_available || YesNo.Yes,

    // Address
    address_line1: row.address_line1 || '',
    address_line2: row.address_line2 || '',
    locality_landmark: row.locality_landmark || '',
    neighborhood: row.neighborhood || '',
    town_city: row.town_city || '',
    district_county: row.district_county || '',
    state_province_region: row.state_province_region || '',
    postal_code: row.postal_code || '',
    country: row.country || '',
    country_code: row.country_code || '',

    // Location Details
    latitude: row.latitude || 0,
    longitude: row.longitude || 0,
    google_location: row.google_location || '',

    status: row.status || Status.Active,
});

// Create New FleetVendorFuelStation Payload
export const newFleetVendorFuelStationPayload = (): FleetVendorFuelStationDTO => ({
    organisation_id: '',
    user_id: '',
    vendor_id: '',
    fuel_company_id: '',

    // Basic Info
    fuel_station_name: '',
    fuel_station_code: '',
    is_company_owned: YesNo.No,

    // Notes
    is_preferred_station: YesNo.No,
    notes: '',

    // Rating
    rating: 0,
    rating_comments: '',

    // Contact Info
    contact_email: '',
    contact_number: '',
    website_url: '',

    // Operational Details
    operating_hours: '',
    is_24x7: YesNo.No,
    supports_credit: YesNo.No,
    fuel_card_supported: YesNo.No,
    accepted_payment_modes: '',
    supported_fuel_types: '',

    offers_service: YesNo.No,
    has_weighbridge: YesNo.No,
    air_check_available: YesNo.Yes,

    // Address
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

    // Location Details
    latitude: 0,
    longitude: 0,
    google_location: '',

    status: Status.Active,
});

// FleetVendorFuelStation APIs
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

// FleetVendorFuelStation Cache
export const find_fuel_station_cache_simple = async (organisation_id: string): Promise<FBR<FleetVendorFuelStationSimple[]>> => {
    return apiGet<FBR<FleetVendorFuelStationSimple[]>>(ENDPOINTS.cache_simple(organisation_id));
};