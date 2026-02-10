// Imports
import { apiPost, apiPatch, apiDelete, apiGet } from '../../../core/apiCall';
import { SBR, FBR, BR } from '../../../core/BaseResponse';

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
    numberOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../../core/Enums';

// Other Models
import { MasterMainLandMark } from 'src/services/master/main/master_main_landmark_service';
import { FleetVendor } from './fleet_vendor_service';
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { FleetServiceManagement } from '../service_management/fleet_service_management_service';

const URL = 'fleet/vendor_management/vendor_service_center';

const ENDPOINTS = {
    // FleetVendorServiceCenter APIs
    find: `${URL}/search`,
    create: `${URL}`,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    // Cache APIs
    cache_simple: (organisation_id: string): string => `${URL}/cache_simple/${organisation_id}`,
};

// FleetVendorServiceCenter Interface
export interface FleetVendorServiceCenter extends Record<string, unknown> {
    // Primary Fields
    service_center_id: string;

    // Basic Info
    service_center_name: string;
    service_center_code?: string;
    is_company_owned: YesNo;
    oem_authorised: YesNo;
    oem_brand_name?: string;
    service_brand_name?: string;

    // Notes
    center_notes?: string;
    is_preferred_center: YesNo;

    // Rating 
    rating?: number;
    rating_comments?: string;

    // Operational Details
    operating_hours?: string;
    is_24x7: YesNo;
    supports_credit: YesNo;
    pickup_and_drop: YesNo;
    roadside_assistance: YesNo;
    warranty_repairs: YesNo;
    supported_service_types?: string;
    supported_vehicle_types?: string;
    has_alignment_bay: YesNo;
    has_body_shop: YesNo;
    has_paint_booth: YesNo;
    has_wash_bay: YesNo;
    has_tow_truck: YesNo;
    service_capacity_per_day?: number;
    eta_regular_service_hours?: number;
    eta_repair_hours?: number;

    // Contact Info
    center_email?: string;
    center_mobile?: string;
    center_phone?: string;
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

    vendor_id: string;
    FleetVendor?: FleetVendor;
    vendor_name?: string;

    // Relations (Child)
    // Child - Fleet
    FleetServiceManagement?: FleetServiceManagement[]
    // FleetServiceJobCard?: FleetServiceJobCard[]

    // Relations - Child Count
    _count?: {
        FleetServiceManagement?: number;
        FleetServiceManagement_ThisMonth?: number;
        FleetServiceManagement_ThisYear?: number;
        FleetServiceJobCard?: number;
    };
}

// FleetVendorServiceCenter Interface
export interface FleetVendorServiceCenterSimple extends Record<string, unknown> {
    vendor_id: string;
    service_center_id: string;
    service_center_name?: string;
    service_center_code?: string;
};

// FleetVendorServiceCenter Create/Update Schema
export const FleetVendorServiceCenterSchema = z.object({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
    vendor_id: single_select_mandatory('FleetVendor'), // Single-Selection -> FleetVendor

    // Main Field Details
    // Basic Info
    service_center_name: stringMandatory('ServiceCenter Name', 3, 100),
    service_center_code: stringOptional('Service Center Code', 0, 100),
    is_company_owned: enumMandatory('Is Company Owned', YesNo, YesNo.No),
    oem_authorised: enumMandatory('OEM Authorised', YesNo, YesNo.No),
    oem_brand_name: stringOptional('OEM Brand Name', 0, 100),
    service_brand_name: stringOptional('Service Brand Name', 0, 100),

    // Rating
    rating: numberOptional('Rating'),
    rating_comments: stringOptional('Rating Comments', 0, 2000),

    // Operational Details
    operating_hours: stringOptional('Operating Hours', 0, 100),
    is_24x7: enumMandatory('Is 24x7', YesNo, YesNo.No),
    supports_credit: enumMandatory('Supports Credit', YesNo, YesNo.No),
    pickup_and_drop: enumMandatory('Pickup And Drop', YesNo, YesNo.No),
    roadside_assistance: enumMandatory('Roadside Assistance', YesNo, YesNo.No),
    warranty_repairs: enumMandatory('Warranty Repairs', YesNo, YesNo.No),
    supported_service_types: stringOptional('Supported Service Types', 0, 500),
    supported_vehicle_types: stringOptional('Supported Vehicle Types', 0, 500),

    has_alignment_bay: enumMandatory('Has Alignment Bay', YesNo, YesNo.No),
    has_body_shop: enumMandatory('Has Body Shop', YesNo, YesNo.No),
    has_paint_booth: enumMandatory('Has Paint Booth', YesNo, YesNo.No),
    has_wash_bay: enumMandatory('Has Wash Bay', YesNo, YesNo.Yes),
    has_tow_truck: enumMandatory('Has Tow Truck', YesNo, YesNo.No),

    service_capacity_per_day: numberOptional('Service Capacity Per Day', 0),
    eta_regular_service_hours: numberOptional('ETA Regular Service Hours'),
    eta_repair_hours: numberOptional('ETA Repair Hours'),

    // Contact Info
    center_email: stringOptional('Center Email', 0, 100),
    center_mobile: stringOptional('Center Mobile', 0, 15),
    center_phone: stringOptional('Center Phone', 0, 15),
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

    // Notes
    center_notes: stringOptional('Center Notes', 0, 2000),
    is_preferred_center: enumMandatory('Is Preferred Center', YesNo, YesNo.No),

    // Metadata
    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorServiceCenterDTO = z.infer<
    typeof FleetVendorServiceCenterSchema
>;

// FleetVendorServiceCenter Query Schema
export const FleetVendorServiceCenterQuerySchema = BaseQuerySchema.extend({
    // self table
    service_center_ids: multi_select_optional('FleetVendorServiceCenter'), // Single-Selection -> FleetVendorServiceCenter

    // relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Single-Selection -> UserOrganisation
    vendor_ids: multi_select_optional('FleetVendor'), // Single-Selection -> FleetVendor

    // enums
    is_company_owned: enumArrayOptional('Is Company Owned', YesNo),
    oem_authorised: enumArrayOptional('OEM Authorised', YesNo),
    is_preferred_center: enumArrayOptional('Is Preferred Center', YesNo),
});
export type FleetVendorServiceCenterQueryDTO = z.infer<
    typeof FleetVendorServiceCenterQuerySchema
>;

// Convert FleetVendorServiceCenter Data to API Payload
export const toFleetVendorServiceCenterPayload = (row: FleetVendorServiceCenter): FleetVendorServiceCenterDTO => ({
    // Basic Info
    service_center_name: row.service_center_name || '',
    service_center_code: row.service_center_code || '',
    is_company_owned: row.is_company_owned || YesNo.No,
    oem_authorised: row.oem_authorised || YesNo.No,
    oem_brand_name: row.oem_brand_name || '',
    service_brand_name: row.service_brand_name || '',

    // Rating
    rating: row.rating || 0,
    rating_comments: row.rating_comments || '',

    // Notes
    center_notes: row.center_notes || '',
    is_preferred_center: row.is_preferred_center || YesNo.No,

    // Operational Details
    operating_hours: row.operating_hours || '',
    is_24x7: row.is_24x7 || YesNo.No,
    supports_credit: row.supports_credit || YesNo.No,
    pickup_and_drop: row.pickup_and_drop || YesNo.No,
    roadside_assistance: row.roadside_assistance || YesNo.No,
    warranty_repairs: row.warranty_repairs || YesNo.No,
    supported_service_types: row.supported_service_types || '',
    supported_vehicle_types: row.supported_vehicle_types || '',
    has_alignment_bay: row.has_alignment_bay || YesNo.No,
    has_body_shop: row.has_body_shop || YesNo.No,
    has_paint_booth: row.has_paint_booth || YesNo.No,
    has_wash_bay: row.has_wash_bay || YesNo.Yes,
    has_tow_truck: row.has_tow_truck || YesNo.No,
    service_capacity_per_day: row.service_capacity_per_day || 0,
    eta_regular_service_hours: row.eta_regular_service_hours || 0,
    eta_repair_hours: row.eta_repair_hours || 0,


    // Contact Info
    center_email: row.center_email || '',
    center_mobile: row.center_mobile || '',
    center_phone: row.center_phone || '',
    website_url: row.website_url || '',

    // Address Details
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

    organisation_id: row.organisation_id || '',
    vendor_id: row.vendor_id || '',

    status: row.status || Status.Active,
});

// Create New FleetVendorServiceCenter Payload
export const newFleetVendorServiceCenterPayload = (): FleetVendorServiceCenterDTO => ({
    organisation_id: '',
    vendor_id: '',

    service_center_name: '',
    service_center_code: '',
    is_company_owned: YesNo.No,
    oem_authorised: YesNo.No,
    oem_brand_name: '',
    service_brand_name: '',

    rating: 0,
    rating_comments: '',

    center_notes: '',
    is_preferred_center: YesNo.No,

    operating_hours: '',
    is_24x7: YesNo.No,
    supports_credit: YesNo.No,
    pickup_and_drop: YesNo.No,
    roadside_assistance: YesNo.No,
    warranty_repairs: YesNo.No,
    supported_service_types: '',
    supported_vehicle_types: '',
    has_alignment_bay: YesNo.No,
    has_body_shop: YesNo.No,
    has_paint_booth: YesNo.No,
    has_wash_bay: YesNo.Yes,
    has_tow_truck: YesNo.No,
    service_capacity_per_day: 0,
    eta_regular_service_hours: 0,
    eta_repair_hours: 0,

    center_email: '',
    center_mobile: '',
    center_phone: '',
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

    status: Status.Active,
});

// FleetVendorServiceCenter APIs
export const findFleetVendorServiceCenter = async (data: FleetVendorServiceCenterQueryDTO): Promise<FBR<FleetVendorServiceCenter[]>> => {
    return apiPost<FBR<FleetVendorServiceCenter[]>, FleetVendorServiceCenterQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetVendorServiceCenter = async (data: FleetVendorServiceCenterDTO): Promise<SBR> => {
    return apiPost<SBR, FleetVendorServiceCenterDTO>(ENDPOINTS.create, data);
};

export const updateFleetVendorServiceCenter = async (id: string, data: FleetVendorServiceCenterDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetVendorServiceCenterDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetVendorServiceCenter = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getFleetVendorServiceCenterCacheSimple = async (organisation_id: string): Promise<BR<FleetVendorServiceCenterSimple[]>> => {
    return apiGet<BR<FleetVendorServiceCenterSimple[]>>(ENDPOINTS.cache_simple(organisation_id));
};