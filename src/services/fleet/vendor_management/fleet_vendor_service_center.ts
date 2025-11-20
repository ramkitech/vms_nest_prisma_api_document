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
    numberOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../../core/Enums';

// Other Models
import { MasterMainLandmark } from 'src/services/master/main/master_main_landmark_service';
import { FleetVendor } from './fleet_vendor_service';
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';

const URL = 'fleet/vendor_management/vendor_service_center';

const ENDPOINTS = {
    find: `${URL}/search`,
    create: `${URL}`,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,
};

// ✅ FleetVendorServiceCenter Interface
export interface FleetVendorServiceCenter extends Record<string, unknown> {
    // ✅ Primary Fields
    service_center_id: string;

    // Basic Info
    center_name: string;
    center_code?: string;
    is_company_owned: YesNo;
    oem_authorised: YesNo;
    oem_brand_name?: string;
    service_brand_name?: string;

    // Notes
    center_notes?: string;
    is_preferred_center: YesNo;

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

    // ✅ Count (Child Relations)
    _count?: {
        FleetServiceJobCard: number;
    };
}


// ✅ FleetVendorServiceCenter Create/Update Schema
export const FleetVendorServiceCenterSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vendor_id: single_select_mandatory('FleetVendor'), // ✅ Single-Selection -> FleetVendor

    // Basic Info
    center_name: stringMandatory('Center Name', 3, 150),
    center_code: stringOptional('Center Code', 0, 50),
    is_company_owned: enumMandatory('Is Company Owned', YesNo, YesNo.No),
    oem_authorised: enumMandatory('OEM Authorised', YesNo, YesNo.No),
    oem_brand_name: stringOptional('OEM Brand Name', 0, 150),
    service_brand_name: stringOptional('Service Brand Name', 0, 150),

    // Operational Details
    operating_hours: stringOptional('Operating Hours', 0, 200),
    is_24x7: enumMandatory('Is 24x7', YesNo, YesNo.No),
    supports_credit: enumMandatory('Supports Credit', YesNo, YesNo.No),
    pickup_and_drop: enumMandatory('Pickup And Drop', YesNo, YesNo.No),
    roadside_assistance: enumMandatory('Roadside Assistance', YesNo, YesNo.No),
    warranty_repairs: enumMandatory('Warranty Repairs', YesNo, YesNo.No),
    supported_service_types: stringOptional('Supported Service Types', 0, 300),
    supported_vehicle_types: stringOptional('Supported Vehicle Types', 0, 200),

    has_alignment_bay: enumMandatory('Has Alignment Bay', YesNo, YesNo.No),
    has_body_shop: enumMandatory('Has Body Shop', YesNo, YesNo.No),
    has_paint_booth: enumMandatory('Has Paint Booth', YesNo, YesNo.Yes),
    has_wash_bay: enumMandatory('Has Wash Bay', YesNo, YesNo.Yes),
    has_tow_truck: enumMandatory('Has Tow Truck', YesNo, YesNo.Yes),

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

    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorServiceCenterDTO = z.infer<
    typeof FleetVendorServiceCenterSchema
>;

// ✅ FleetVendorServiceCenter Query Schema
export const FleetVendorServiceCenterQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation

    vendor_ids: multi_select_optional('FleetVendor'), // ✅ Single-Selection -> FleetVendor
    service_center_ids: multi_select_optional('FleetVendorServiceCenter'), // ✅ Single-Selection -> FleetVendorServiceCenter

    is_company_owned: enumArrayOptional('Is Company Owned', YesNo),
    oem_authorised: enumArrayOptional('OEM Authorised', YesNo),
    is_preferred_station: enumArrayOptional('Is Preferred Station', YesNo),
});
export type FleetVendorServiceCenterQueryDTO = z.infer<
    typeof FleetVendorServiceCenterQuerySchema
>;

// ✅ Convert FleetVendorServiceCenter Data to API Payload
export const toFleetVendorServiceCenterPayload = (vendorServiceCenter: FleetVendorServiceCenter): FleetVendorServiceCenterDTO => ({
    // Basic Info
    center_name: vendorServiceCenter.center_name || '',
    center_code: vendorServiceCenter.center_code || '',
    is_company_owned: vendorServiceCenter.is_company_owned || YesNo.No,
    oem_authorised: vendorServiceCenter.oem_authorised || YesNo.No,
    oem_brand_name: vendorServiceCenter.oem_brand_name || '',
    service_brand_name: vendorServiceCenter.service_brand_name || '',

    // Notes
    center_notes: vendorServiceCenter.center_notes || '',
    is_preferred_center: vendorServiceCenter.is_preferred_center || YesNo.No,

    // Operational Details
    operating_hours: vendorServiceCenter.operating_hours || '',
    is_24x7: vendorServiceCenter.is_24x7 || YesNo.No,
    supports_credit: vendorServiceCenter.supports_credit || YesNo.No,
    pickup_and_drop: vendorServiceCenter.pickup_and_drop || YesNo.No,
    roadside_assistance: vendorServiceCenter.roadside_assistance || YesNo.No,
    warranty_repairs: vendorServiceCenter.warranty_repairs || YesNo.No,
    supported_service_types: vendorServiceCenter.supported_service_types || '',
    supported_vehicle_types: vendorServiceCenter.supported_vehicle_types || '',
    has_alignment_bay: vendorServiceCenter.has_alignment_bay || YesNo.No,
    has_body_shop: vendorServiceCenter.has_body_shop || YesNo.No,
    has_paint_booth: vendorServiceCenter.has_paint_booth || YesNo.No,
    has_wash_bay: vendorServiceCenter.has_wash_bay || YesNo.Yes,
    has_tow_truck: vendorServiceCenter.has_tow_truck || YesNo.No,
    service_capacity_per_day: vendorServiceCenter.service_capacity_per_day || 0,
    eta_regular_service_hours: vendorServiceCenter.eta_regular_service_hours || 0,
    eta_repair_hours: vendorServiceCenter.eta_repair_hours || 0,


    // Contact Info
    center_email: vendorServiceCenter.center_email || '',
    center_mobile: vendorServiceCenter.center_mobile || '',
    center_phone: vendorServiceCenter.center_phone || '',
    website_url: vendorServiceCenter.website_url || '',

    // Address Details
    address_line1: vendorServiceCenter.address_line1 || '',
    address_line2: vendorServiceCenter.address_line2 || '',
    locality_landmark: vendorServiceCenter.locality_landmark || '',
    neighborhood: vendorServiceCenter.neighborhood || '',
    town_city: vendorServiceCenter.town_city || '',
    district_county: vendorServiceCenter.district_county || '',
    state_province_region: vendorServiceCenter.state_province_region || '',
    postal_code: vendorServiceCenter.postal_code || '',
    country: vendorServiceCenter.country || '',
    country_code: vendorServiceCenter.country_code || '',

    // Location Details
    latitude: vendorServiceCenter.latitude || 0,
    longitude: vendorServiceCenter.longitude || 0,
    google_location: vendorServiceCenter.google_location || '',

    organisation_id: vendorServiceCenter.organisation_id || '',
    vendor_id: vendorServiceCenter.vendor_id || '',

    status: Status.Active,
});

// ✅ Create New FleetVendorServiceCenter Payload
export const newFleetVendorServiceCenterPayload = (): FleetVendorServiceCenterDTO => ({
    organisation_id: '',
    vendor_id: '',

    center_name: '',
    center_code: '',
    is_company_owned: YesNo.No,
    oem_authorised: YesNo.No,
    oem_brand_name: '',
    service_brand_name: '',

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

// API Methods
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