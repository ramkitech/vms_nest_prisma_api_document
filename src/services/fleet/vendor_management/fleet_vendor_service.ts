// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BaseCommonFile, BR, AWSPresignedUrl } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringMandatory,
    stringOptional,
    enumMandatory,
    single_select_mandatory,
    multi_select_optional,
    enumArrayOptional,
    single_select_optional,
    getAllEnums,
    nestedArrayOfObjectsOptional,
    dateOptional,
    doubleOptionalLatLng,
    numberMandatory,
    multi_select_mandatory,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo, FleetVendorAddressLabel } from '../../../core/Enums';

// Other Models
import { MasterVendorType } from 'src/services/master/expense/master_vendor_type_service';
import { MasterVendorTag } from 'src/services/master/expense/master_vendor_tag_service';
import { MasterMainLandmark } from 'src/services/master/main/master_main_landmark_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVendorDocumentType } from 'src/services/master/expense/master_vendor_document_type_service';
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { FleetVendorServiceCenter } from './fleet_vendor_service_center';
import { FleetVendorFuelStation } from './fleet_vendor_fuel_station';

const URL = 'fleet/vendor_management/fleet_vendor';

const ENDPOINTS = {

    // AWS S3 PRESIGNED
    vendor_logo_presigned_url: (fileName: string): string => `${URL}/vendor_logo_presigned_url/${fileName}`,
    vendor_contact_person_logo_presigned_url: (fileName: string): string => `${URL}/vendor_contact_person_logo_presigned_url/${fileName}`,
    vendor_document_file_presigned_url: `${URL}/vendor_document_file_presigned_url`,

    update_vendor_logo: (id: string): string => `${URL}/update_vendor_logo/${id}`,
    delete_vendor_logo: (id: string): string => `${URL}/delete_vendor_logo/${id}`,

    create_vendor_document_file: `${URL}/create_vendor_document_file`,
    remove_vendor_document_file: (id: string): string => `${URL}/remove_vendor_document_file/${id}`,

    find: `${URL}/search`,
    vendor_dashboard: `${URL}/vendor_dashboard`,
    create: `${URL}`,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    // Address
    create_address: `${URL}/address`,
    find_address: `${URL}/address/search`,
    update_address: (id: string): string => `${URL}/address/${id}`,
    remove_address: (id: string): string => `${URL}/address/${id}`,

    // Bank Account
    create_bank_account: `${URL}/bank_account`,
    find_bank_account: `${URL}/bank_account/search`,
    update_bank_account: (id: string): string => `${URL}/bank_account/${id}`,
    remove_bank_account: (id: string): string => `${URL}/bank_account/${id}`,

    // Contact Person
    create_contact_person: `${URL}/contact_person`,
    find_contact_person: `${URL}/contact_person/search`,
    update_contact_person: (id: string): string => `${URL}/contact_person/${id}`,
    remove_contact_person: (id: string): string => `${URL}/contact_person/${id}`,
    update_vendor_contact_person_logo: (id: string): string => `${URL}/update_vendor_contact_person_logo/${id}`,
    delete_vendor_contact_person_logo: (id: string): string => `${URL}/delete_vendor_contact_person_logo/${id}`,

    // Review
    create_review: `${URL}/review`,
    find_review: `${URL}/review/search`,
    update_review: (id: string): string => `${URL}/review/${id}`,
    remove_review: (id: string): string => `${URL}/review/${id}`,

    // Document
    create_document: `${URL}/document`,
    find_document: `${URL}/document/search`,
    update_document: (id: string): string => `${URL}/document/${id}`,
    remove_document: (id: string): string => `${URL}/document/${id}`,

    // Cache
    cache_simple: (organisation_id: string): string => `${URL}/cache_simple/${organisation_id}`,
};

// ✅ FleetVendor Interface
export interface FleetVendor extends Record<string, unknown> {
    // ✅ Primary Fields
    vendor_id: string;
    vendor_name: string;
    vendor_code?: string;
    business_mobile?: string;
    business_email?: string;

    // ✅ Logo
    logo_url?: string;
    logo_key?: string;
    logo_name?: string;

    // Business Details
    organisation_name?: string;
    gst_number?: string;
    pan_number?: string;
    tax_id_number?: string;
    vat_number?: string;
    business_registration_number?: string;

    // Financial Details
    payment_terms?: string;
    financial_notes?: string;

    // Additional Information
    additional_details_1?: string;
    additional_details_2?: string;
    additional_details_3?: string;

    // ✅ Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // ✅ Relations - Parent
    organisation_id: string;
    UserOrganisation: UserOrganisation;

    // ✅ Relations - Child
    FleetVendorTypeLink?: FleetVendorTypeLink[]
    FleetVendorTagLink?: FleetVendorTagLink[]
    FleetVendorAddress?: FleetVendorAddress[]
    FleetVendorBankAccount?: FleetVendorBankAccount[]
    FleetVendorContactPersons?: FleetVendorContactPersons[];

    FleetVendorReview?: FleetVendorReview[]
    FleetVendorDocument?: FleetVendorDocument[]
    FleetVendorServiceCenter?: FleetVendorServiceCenter[]
    FleetVendorFuelStation?: FleetVendorFuelStation[]

    // ✅ Count (Child Relations)
    _count?: {
        FleetVendorTypeLink: number;
        FleetVendorTagLink: number;
        FleetVendorAddress: number;
        FleetVendorBankAccount: number;
        FleetVendorContactPersons: number;
        FleetVendorReview: number;
        FleetVendorDocument: number;
        FleetVendorServiceCenter: number;
        FleetVendorFuelStation: number;
    };
}

export interface VendorDashboard {
    main_counts: {
        vendors: number;
        fuel_stations: number;
        service_centers: number;
    };
}

// ✅ FleetVendorSimple Interface
export interface FleetVendorSimple extends Record<string, unknown> {
    vendor_id: string;
    vendor_name: string;
    vendor_code?: string;
    business_mobile?: string;
    business_email?: string;
};

// ✅ FleetVendorTypeLink Interface
export interface FleetVendorTypeLink extends Record<string, unknown> {
    // ✅ Primary Fields
    vendor_type_link_id: string;

    // ✅ Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations
    vendor_id: string
    FleetVendor?: FleetVendor;
    vendor_name?: string;

    vendor_type_id: string;
    MasterVendorType?: MasterVendorType;
    vendor_type?: string;

    // ✅ Count (Child Relations)
    _count?: {
    };
}

// ✅ FleetVendorTagLink Interface
export interface FleetVendorTagLink extends Record<string, unknown> {
    // ✅ Primary Fields
    vendor_tag_link_id: string;

    // ✅ Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations
    vendor_id: string
    FleetVendor?: FleetVendor;
    vendor_name?: string;

    vendor_tag_id: string;
    MasterVendorTag?: MasterVendorTag;
    vendor_tag?: string;

    // ✅ Count (Child Relations)
    _count?: {
    };
}

// ✅ FleetVendorAddress Interface
export interface FleetVendorAddress extends Record<string, unknown> {
    vendor_address_id: string;

    vendor_address_label: FleetVendorAddressLabel;

    // Address Details
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

    is_default: YesNo
    notes?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    vendor_id: string;
    FleetVendor?: FleetVendor;
    vendor_name?: string;

    // ✅ Count (Child Relations)
    _count?: {
    };
}

// ✅ FleetVendorBankAccount Interface
export interface FleetVendorBankAccount extends Record<string, unknown> {
    vendor_bank_account_id: string;

    bank_name?: string;
    bank_branch_name?: string;
    bank_account_name?: string;
    bank_account_number?: string;
    ifsc_code?: string;
    swift_code?: string;
    iban_number?: string;
    upi_id?: string;
    is_primary: YesNo;
    notes?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    vendor_id: string;
    FleetVendor?: FleetVendor;
    vendor_name?: string;

    // ✅ Count (Child Relations)
    _count?: {
    };
}

// ✅ FleetVendorContactPersons Interface
export interface FleetVendorContactPersons extends Record<string, unknown> {
    contact_person_id: string;

    // Image
    image_url?: string;
    image_key?: string;
    image_name?: string;

    // Primary Details
    name: string;
    mobile?: string;
    alternative_mobile?: string;
    email?: string;
    designation?: string;

    // Additional Details
    branch_name?: string;
    preferred_language?: string;
    is_primary: YesNo;
    notes?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    vendor_id: string;
    FleetVendor?: FleetVendor;
    vendor_name?: string;

    // ✅ Count (Child Relations)
    _count?: {
    };
}

// ✅ FleetVendorReview Interface
export interface FleetVendorReview extends Record<string, unknown> {
    vendor_review_id: string;

    rating: number
    rating_comments?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    user_id?: string;
    User?: User;

    vendor_id: string;
    FleetVendor?: FleetVendor;
    vendor_name?: string;

    // ✅ Count (Child Relations)
    _count?: {
    };
}

// ✅ FleetVendorDocument Interface
export interface FleetVendorDocument extends Record<string, unknown> {
    fleet_vendor_document_id: string;

    // Document Details
    document_name?: string;
    document_number?: string;
    issuing_authority?: string;
    issue_date?: string;
    issue_date_f?: string;
    expiry_date?: string;
    expiry_date_f?: string;
    remarks?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    user_id?: string;
    User?: User;

    vendor_id: string;
    FleetVendor?: FleetVendor;
    vendor_name?: string;

    document_type_id: string;
    MasterVendorDocumentType?: MasterVendorDocumentType;
    document_type?: string;

    // ✅ Relations - Child
    FleetVendorDocumentFile: FleetVendorDocumentFile[];

    // ✅ Count (Child Relations)
    _count?: {
        FleetVendorDocumentFile: number;
    };
}

// ✅ FleetVendorDocumentFile Interface
export interface FleetVendorDocumentFile extends BaseCommonFile {
    // Primary Fields
    fleet_vendor_document_file_id: string;

    // ✅ Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    fleet_vendor_document_id: string;
    FleetVendorDocument?: FleetVendorDocument;
}


// ✅ FleetVendor Logo Schema
export const FleetVendorLogoSchema = z.object({
    logo_url: stringMandatory('Logo URL', 0, 300),
    logo_key: stringMandatory('Logo Key', 0, 300),
    logo_name: stringMandatory('Logo Name', 0, 300),
});
export type FleetVendorLogoDTO = z.infer<typeof FleetVendorLogoSchema>;

// ✅ FleetVendor Create/Update Schema
export const FleetVendorSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation

    vendor_name: stringMandatory('Vendor Name', 3, 100),
    vendor_code: stringOptional('Vendor Code', 0, 100),
    business_mobile: stringOptional('Business Mobile', 0, 15),
    business_email: stringOptional('Business Email', 0, 100),

    // Logo
    logo_url: stringOptional('Logo URL', 0, 300),
    logo_key: stringOptional('Logo Key', 0, 300),
    logo_name: stringOptional('Logo Name', 0, 300),

    // Business Details
    organisation_name: stringOptional('Organisation Name', 0, 100),
    gst_number: stringOptional('GST Number', 0, 15),
    pan_number: stringOptional('PAN Number', 0, 10),
    tax_id_number: stringOptional('Tax ID Number', 0, 50),
    vat_number: stringOptional('VAT Number', 0, 50),
    business_registration_number: stringOptional(
        'Business Registration Number',
        0,
        50,
    ),

    // Financial Details
    payment_terms: stringOptional('Payment Terms', 0, 2000),
    financial_notes: stringOptional('Financial Notes', 0, 2000),

    // Additional Information
    additional_details_1: stringOptional('Additional Details 1', 0, 2000),
    additional_details_2: stringOptional('Additional Details 2', 0, 2000),
    additional_details_3: stringOptional('Additional Details 3', 0, 2000),

    status: enumMandatory('Status', Status, Status.Active),

    vendor_type_ids: multi_select_optional('MasterVendorType'), // Multi selection -> MasterVendorType
    vendor_tag_ids: multi_select_optional('MasterVendorTag'), // Multi selection -> MasterVendorTag
});
export type FleetVendorDTO = z.infer<typeof FleetVendorSchema>;

// ✅ FleetVendor Query Schema
export const FleetVendorQuerySchema = BaseQuerySchema.extend({
    vendor_ids: multi_select_optional('FleetVendor'), // ✅ Multi-Selection -> FleetVendor

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
});
export type FleetVendorQueryDTO = z.infer<typeof FleetVendorQuerySchema>;

// ✅ FleetVendorDashBoard Query Schema
export const FleetVendorDashBoardQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_mandatory('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
});
export type FleetVendorDashBoardQueryDTO = z.infer<
    typeof FleetVendorDashBoardQuerySchema
>;

// ✅ FleetVendorAddress Create/Update Schema
export const FleetVendorAddressSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vendor_id: single_select_mandatory('FleetVendor'), // ✅ Single-Selection -> FleetVendor

    vendor_address_label: enumMandatory(
        'Fleet Vendor Address Label',
        FleetVendorAddressLabel,
        FleetVendorAddressLabel.OTHER,
    ),

    // Address Details
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

    is_default: enumMandatory('Is Default', YesNo, YesNo.No),
    notes: stringOptional('Notes', 0, 2000),

    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorAddressDTO = z.infer<typeof FleetVendorAddressSchema>;

// ✅ FleetVendorAddress Query Schema
export const FleetVendorAddressQuerySchema = BaseQuerySchema.extend({
    vendor_address_ids: multi_select_optional('FleetVendorAddress'), // ✅ Multi-Selection -> FleetVendorAddress

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    vendor_ids: multi_select_optional('FleetVendor'), // ✅ Multi-Selection -> FleetVendor

    vendor_address_label: enumArrayOptional(
        'Vendor Address Label',
        FleetVendorAddressLabel,
        getAllEnums(FleetVendorAddressLabel),
    ),
    is_default: enumArrayOptional('Is Default', YesNo, getAllEnums(YesNo)),
});
export type FleetVendorAddressQueryDTO = z.infer<
    typeof FleetVendorAddressQuerySchema
>;

// ✅ FleetVendorBankAccount Create/Update Schema
export const FleetVendorBankAccountSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vendor_id: single_select_mandatory('FleetVendor'), // ✅ Single-Selection -> FleetVendor

    bank_name: stringOptional('Bank Name', 0, 100),
    bank_branch_name: stringOptional('Bank Branch Name', 0, 100),
    bank_account_name: stringOptional('Bank Account Name', 0, 100),
    bank_account_number: stringOptional('Bank Account Number', 0, 34),
    ifsc_code: stringOptional('IFSC Code', 0, 20),
    swift_code: stringOptional('Swift Code', 0, 20),
    iban_number: stringOptional('IBAN Number', 0, 34),
    upi_id: stringOptional('UPI ID', 0, 100),
    is_primary: enumMandatory('Is Primary', YesNo, YesNo.No),
    notes: stringOptional('Notes', 0, 2000),

    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorBankAccountDTO = z.infer<
    typeof FleetVendorBankAccountSchema
>;

// ✅ FleetVendorBankAccount Query Schema
export const FleetVendorBankAccountQuerySchema = BaseQuerySchema.extend({
    vendor_bank_account_ids: multi_select_optional('FleetVendorBankAccount'), // ✅ Multi-Selection -> FleetVendorBankAccount

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    vendor_ids: multi_select_optional('FleetVendor'), // ✅ Multi-Selection -> FleetVendor

    is_primary: enumArrayOptional('Is Primary', YesNo, getAllEnums(YesNo)),
});
export type FleetVendorBankAccountQueryDTO = z.infer<
    typeof FleetVendorBankAccountQuerySchema
>;

// ✅ FleetVendorContactPerson Logo Schema
export const FleetVendorContactPersonsLogoSchema = z.object({
    image_url: stringMandatory('Image URL', 0, 300),
    image_key: stringMandatory('Image Key', 0, 300),
    image_name: stringMandatory('Image Name', 0, 300),
});
export type FleetVendorContactPersonsLogoDTO = z.infer<
    typeof FleetVendorContactPersonsLogoSchema
>;

// ✅ FleetVendorContactPersons Create/Update Schema
export const FleetVendorContactPersonsSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vendor_id: single_select_mandatory('FleetVendor'), // ✅ Single-Selection -> FleetVendor

    // Image
    image_url: stringOptional('Image URL', 0, 300),
    image_key: stringOptional('Image Key', 0, 300),
    image_name: stringOptional('Image Name', 0, 300),

    // Primary Details
    name: stringMandatory('Name', 3, 100),
    mobile: stringOptional('Mobile', 0, 15),
    alternative_mobile: stringOptional('Alternative Mobile', 0, 15),
    email: stringOptional('Email', 0, 100),
    designation: stringOptional('Designation', 0, 50),

    // Additional Details
    branch_name: stringOptional('Branch Name', 0, 100),
    preferred_language: stringOptional('Preferred Language', 0, 10),
    is_primary: enumMandatory('Is Primary', YesNo, YesNo.No),
    notes: stringOptional('Notes', 0, 2000),

    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorContactPersonsDTO = z.infer<
    typeof FleetVendorContactPersonsSchema
>;

// ✅ FleetVendorContactPersons Query Schema
export const FleetVendorContactPersonsQuerySchema = BaseQuerySchema.extend({
    contact_person_ids: multi_select_optional('FleetVendorContactPersons'), // ✅ Multi-Selection -> FleetVendorContactPersons

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    vendor_ids: multi_select_optional('FleetVendor'), // ✅ Multi-Selection -> FleetVendor

    is_primary: enumArrayOptional('Is Primary', YesNo, getAllEnums(YesNo)),
});
export type FleetVendorContactPersonsQueryDTO = z.infer<
    typeof FleetVendorContactPersonsQuerySchema
>;

// ✅ FleetVendorReview Create/Update Schema
export const FleetVendorReviewSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vendor_id: single_select_mandatory('FleetVendor'), // ✅ Single-Selection -> FleetVendor
    user_id: single_select_optional('User'), // ✅ Single-Selection -> User

    rating: numberMandatory('Rating'),
    rating_comments: stringOptional('Rating Comments', 0, 2000),

    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorReviewDTO = z.infer<typeof FleetVendorReviewSchema>;

// ✅ FleetVendorReview Query Schema
export const FleetVendorReviewQuerySchema = BaseQuerySchema.extend({
    vendor_review_ids: multi_select_optional('FleetVendorReview'), // ✅ Multi-Selection -> FleetVendorReview

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    vendor_ids: multi_select_optional('FleetVendor'), // ✅ Multi-Selection -> FleetVendor
});
export type FleetVendorReviewQueryDTO = z.infer<
    typeof FleetVendorReviewQuerySchema
>;

// ✅ FleetVendorDocumentFile Schema
export const FleetVendorDocumentFileSchema = BaseFileSchema.extend({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    fleet_vendor_document_id: single_select_mandatory('FleetVendorDocument'), // ✅ Single-Selection -> FleetVendorDocument
});
export type FleetVendorDocumentFileDTO = z.infer<
    typeof FleetVendorDocumentFileSchema
>;

// ✅ FleetVendorDocument Create/Update Schema
export const FleetVendorDocumentSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    user_id: single_select_optional('User'), // ✅ Single-Selection -> User
    vendor_id: single_select_mandatory('FleetVendor'), // ✅ Single-Selection -> FleetVendor
    document_type_id: single_select_mandatory('MasterVendorDocumentType'), // ✅ Single-Selection -> MasterVendorDocumentType

    document_name: stringOptional('Document Name', 0, 150),
    document_number: stringOptional('Document Number', 0, 150),
    issuing_authority: stringOptional('Issuing Authority', 0, 150),
    issue_date: dateOptional('Issue Date'),
    expiry_date: dateOptional('Expiry Date'),
    remarks: stringOptional('Remarks', 0, 150),

    // Other
    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),

    FleetVendorDocumentFileSchema: nestedArrayOfObjectsOptional(
        'FleetVendorDocumentFileSchema',
        FleetVendorDocumentFileSchema,
        [],
    ),
});
export type FleetVendorDocumentDTO = z.infer<typeof FleetVendorDocumentSchema>;

// ✅ FleetVendorDocument Query Schema
export const FleetVendorDocumentQuerySchema = BaseQuerySchema.extend({
    fleet_vendor_document_ids: multi_select_optional('FleetVendorDocument'), // ✅ Multi-selection -> FleetVendorDocument

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    vendor_ids: multi_select_optional('FleetVendor'), // ✅ Multi-selection -> FleetVendor
    document_type_ids: multi_select_optional('MasterVendorDocumentType'), // ✅ Multi-selection -> MasterVendorDocumentType
});
export type FleetVendorDocumentQueryDTO = z.infer<
    typeof FleetVendorDocumentQuerySchema
>;

// ✅ Convert FleetVendor Data to API Payload
export const toFleetVendorPayload = (row: FleetVendor): FleetVendorDTO => ({
    vendor_name: row.vendor_name || '',
    vendor_code: row.vendor_code || '',
    business_mobile: row.business_mobile || '',
    business_email: row.business_email || '',

    logo_url: row.logo_url || '',
    logo_key: row.logo_key || '',
    logo_name: row.logo_name || '',

    // Business Details
    organisation_name: row.organisation_name || '',
    gst_number: row.gst_number || '',
    pan_number: row.pan_number || '',
    tax_id_number: row.tax_id_number || '',
    vat_number: row.vat_number || '',
    business_registration_number: row.business_registration_number || '',

    // Financial Details
    payment_terms: row.payment_terms || '',
    financial_notes: row.financial_notes || '',

    // Additional Information
    additional_details_1: row.additional_details_1 || '',
    additional_details_2: row.additional_details_2 || '',
    additional_details_3: row.additional_details_3 || '',

    // Relations
    organisation_id: row.organisation_id || '',

    vendor_type_ids: row.FleetVendorTypeLink?.map((v) => v.vendor_type_id) || [],
    vendor_tag_ids: row.FleetVendorTagLink?.map((v) => v.vendor_tag_id) || [],

    status: row.status,
});

// ✅ Create New FleetVendor Payload
export const newFleetVendorPayload = (): FleetVendorDTO => ({
    vendor_name: '',
    vendor_code: '',
    business_mobile: '',
    business_email: '',

    logo_url: '',
    logo_key: '',
    logo_name: '',

    organisation_name: '',
    gst_number: '',
    pan_number: '',
    tax_id_number: '',
    vat_number: '',
    business_registration_number: '',

    payment_terms: '',
    financial_notes: '',

    additional_details_1: '',
    additional_details_2: '',
    additional_details_3: '',

    organisation_id: '',

    vendor_type_ids: [],
    vendor_tag_ids: [],

    status: Status.Active,
});

// ✅ Convert FleetVendorAddress Data to API Payload
export const toFleetVendorAddressPayload = (row: FleetVendorAddress): FleetVendorAddressDTO => ({
    vendor_address_label: row.vendor_address_label || FleetVendorAddressLabel.OTHER,

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

    is_default: row.is_default || YesNo.No,
    notes: row.notes || '',

    status: row.status || Status.Active,
});

// ✅ Create New FleetVendorAddress Payload
export const newFleetVendorAddressPayload = (): FleetVendorAddressDTO => ({
    vendor_address_label: FleetVendorAddressLabel.OTHER,

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

    is_default: YesNo.No,
    notes: '',

    status: Status.Active,
});

// ✅ Convert FleetVendorBankAccount Data to API Payload
export const toFleetVendorBankAccountPayload = (row: FleetVendorBankAccount): FleetVendorBankAccountDTO => ({
    bank_name: row.bank_name || '',
    bank_branch_name: row.bank_branch_name || '',
    bank_account_name: row.bank_account_name || '',
    bank_account_number: row.bank_account_number || '',
    ifsc_code: row.ifsc_code || '',
    swift_code: row.swift_code || '',
    iban_number: row.iban_number || '',
    upi_id: row.upi_id || '',
    is_primary: row.is_primary || YesNo.No,
    notes: row.notes || '',

    // Relations
    organisation_id: row.organisation_id || '',
    vendor_id: row.vendor_id || '',

    status: row.status || Status.Active,
});

// ✅ Create New FleetVendorBankAccount Payload
export const newFleetVendorBankAccountPayload = (): FleetVendorBankAccountDTO => ({
    bank_name: '',
    bank_branch_name: '',
    bank_account_name: '',
    bank_account_number: '',
    ifsc_code: '',
    swift_code: '',
    iban_number: '',
    upi_id: '',
    is_primary: YesNo.No,
    notes: '',

    vendor_id: '',
    organisation_id: '',

    status: Status.Active,
});

// ✅ Convert FleetVendorContactPersons Data to API Payload
export const toFleetVendorContactPersonsPayload = (row: FleetVendorContactPersons): FleetVendorContactPersonsDTO => ({
    // Image
    image_url: row.image_url || '',
    image_key: row.image_key || '',
    image_name: row.image_name || '',

    // Primary Details
    name: row.name || '',
    mobile: row.mobile || '',
    alternative_mobile: row.alternative_mobile || '',
    email: row.email || '',
    designation: row.designation || '',

    // Additional Details
    branch_name: row.branch_name || '',
    preferred_language: row.preferred_language || '',
    is_primary: row.is_primary || YesNo.No,
    notes: row.notes || '',

    organisation_id: row.organisation_id || '',
    vendor_id: row.vendor_id || '',

    status: row.status || Status.Active,
});

// ✅ Create New FleetVendorContactPersons Payload
export const newFleetVendorContactPersonsPayload = (): FleetVendorContactPersonsDTO => ({
    image_url: '',
    image_key: '',
    image_name: '',

    name: '',
    mobile: '',
    alternative_mobile: '',
    email: '',
    designation: '',

    branch_name: '',
    preferred_language: '',
    is_primary: YesNo.No,
    notes: '',

    organisation_id: '',
    vendor_id: '',

    status: Status.Active,
});

// ✅ Convert FleetVendorReview Data to API Payload
export const toFleetVendorReviewPayload = (row: FleetVendorReview): FleetVendorReviewDTO => ({
    rating: row.rating || 0,
    rating_comments: row.rating_comments || '',

    // Relations
    organisation_id: row.organisation_id || '',
    vendor_id: row.vendor_id || '',
    user_id: row.user_id || '',

    status: row.status || Status.Active,
});

// ✅ Create New FleetVendorReview Payload
export const newFleetVendorReviewPayload = (): FleetVendorReviewDTO => ({
    rating: 0,
    rating_comments: '',

    organisation_id: '',
    vendor_id: '',
    user_id: '',

    status: Status.Active,
});

// ✅ Convert FleetVendorDocument Data to API Payload
export const toFleetVendorDocumentPayload = (row: FleetVendorDocument): FleetVendorDocumentDTO => ({
    // Document Details
    document_name: row.document_name || '',
    document_number: row.document_number || '',
    issuing_authority: row.issuing_authority || '',
    issue_date: row.issue_date || '',
    expiry_date: row.expiry_date || '',
    remarks: row.remarks || '',

    // Relations
    organisation_id: row.organisation_id || '',
    vendor_id: row.vendor_id || '',
    user_id: row.user_id || '',
    document_type_id: row.document_type_id || '',

    status: row.status || Status.Active,

    time_zone_id: '', // Needs to be provided manually

    FleetVendorDocumentFileSchema: row.FleetVendorDocumentFile?.map((file) => ({
        fleet_vendor_document_file_id: file.fleet_vendor_document_file_id ?? '',

        usage_type: file.usage_type,

        file_type: file.file_type,
        file_url: file.file_url || '',
        file_key: file.file_key || '',
        file_name: file.file_name || '',
        file_description: file.file_description || '',
        file_size: file.file_size || 0,
        file_metadata: file.file_metadata ?? {},

        status: file.status,
        added_date_time: file.added_date_time,
        modified_date_time: file.modified_date_time,

        organisation_id: file.organisation_id ?? '',
        fleet_vendor_document_id: file.fleet_vendor_document_id ?? '',
    })) ?? [],
});

// ✅ Convert API Response to Frontend Data
export const newFleetVendorDocumentPayload = (): FleetVendorDocumentDTO => ({
    document_name: '',
    document_number: '',
    issuing_authority: '',
    issue_date: '',
    expiry_date: '',
    remarks: '',

    organisation_id: '',
    vendor_id: '',
    user_id: '',
    document_type_id: '',

    status: Status.Active,
    time_zone_id: '', // Needs to be provided manually

    FleetVendorDocumentFileSchema: [],
});


// Generate presigned URL for file uploads
export const get_vendor_logo_presigned_url = async (fileName: string): Promise<BR<AWSPresignedUrl>> => {
    return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.vendor_logo_presigned_url(fileName));
};

export const get_vendor_contact_person_logo_presigned_url = async (fileName: string): Promise<BR<AWSPresignedUrl>> => {
    return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.vendor_contact_person_logo_presigned_url(fileName));
};

export const get_vendor_document_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
    return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.vendor_document_file_presigned_url, data);
};

export const update_vendor_logo = async (id: string, data: FleetVendorLogoDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetVendorLogoDTO>(ENDPOINTS.update_vendor_logo(id), data);
};

export const delete_vendor_logo = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete_vendor_logo(id));
};

export const updateFleetVendorContactPersonsLogo = async (id: string, data: FleetVendorContactPersonsLogoDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetVendorContactPersonsLogoDTO>(ENDPOINTS.update_vendor_contact_person_logo(id), data);
};

export const deleteFleetVendorContactPersonsLogo = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete_vendor_contact_person_logo(id));
};

export const create_vendor_document_file = async (data: FleetVendorDocumentFileDTO): Promise<SBR> => {
    return apiPost<SBR, FleetVendorDocumentFileDTO>(ENDPOINTS.create_vendor_document_file, data);
};

export const remove_vendor_document_file = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_vendor_document_file(id));
};

// FleetVendor
export const findFleetVendor = async (data: FleetVendorQueryDTO): Promise<FBR<FleetVendor[]>> => {
    return apiPost<FBR<FleetVendor[]>, FleetVendorQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetVendor = async (data: FleetVendorDTO): Promise<SBR> => {
    return apiPost<SBR, FleetVendorDTO>(ENDPOINTS.create, data);
};

export const updateFleetVendor = async (id: string, data: FleetVendorDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetVendorDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetVendor = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const vendor_dashboard = async (data: FleetVendorDashBoardQueryDTO,): Promise<FBR<VendorDashboard[]>> => {
    return apiPost<FBR<VendorDashboard[]>, FleetVendorDashBoardQueryDTO>(ENDPOINTS.vendor_dashboard, data);
};

// FleetVendorAddress
export const createFleetVendorAddress = async (data: FleetVendorAddressDTO): Promise<SBR> => {
    return apiPost<SBR, FleetVendorAddressDTO>(ENDPOINTS.create_address, data);
};

export const findFleetVendorAddress = async (data: FleetVendorAddressQueryDTO): Promise<FBR<FleetVendorAddress[]>> => {
    return apiPost<FBR<FleetVendorAddress[]>, FleetVendorAddressQueryDTO>(ENDPOINTS.find_address, data);
};

export const updateFleetVendorAddress = async (id: string, data: FleetVendorAddressDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetVendorAddressDTO>(ENDPOINTS.update_address(id), data);
};

export const deleteFleetVendorAddress = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_address(id));
};

// FleetVendorBankAccount
export const createFleetVendorBankAccount = async (data: FleetVendorBankAccountDTO): Promise<SBR> => {
    return apiPost<SBR, FleetVendorBankAccountDTO>(ENDPOINTS.create_bank_account, data);
};

export const findFleetVendorBankAccount = async (data: FleetVendorBankAccountQueryDTO): Promise<FBR<FleetVendorBankAccount[]>> => {
    return apiPost<FBR<FleetVendorBankAccount[]>, FleetVendorBankAccountQueryDTO>(ENDPOINTS.find_bank_account, data);
};

export const updateFleetVendorBankAccount = async (id: string, data: FleetVendorBankAccountDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetVendorBankAccountDTO>(ENDPOINTS.update_bank_account(id), data);
};

export const deleteFleetVendorBankAccount = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_bank_account(id));
};

// FleetVendorContactPersons
export const createFleetVendorContactPersons = async (data: FleetVendorContactPersonsDTO): Promise<SBR> => {
    return apiPost<SBR, FleetVendorContactPersonsDTO>(ENDPOINTS.create_contact_person, data);
};

export const findFleetVendorContactPersons = async (data: FleetVendorContactPersonsQueryDTO): Promise<FBR<FleetVendorContactPersons[]>> => {
    return apiPost<FBR<FleetVendorContactPersons[]>, FleetVendorContactPersonsQueryDTO>(ENDPOINTS.find_contact_person, data);
};

export const updateFleetVendorContactPersons = async (id: string, data: FleetVendorContactPersonsDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetVendorContactPersonsDTO>(ENDPOINTS.update_contact_person(id), data);
};

export const deleteFleetVendorContactPersons = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_contact_person(id));
};

// FleetVendorReview
export const createFleetVendorReview = async (data: FleetVendorReviewDTO): Promise<SBR> => {
    return apiPost<SBR, FleetVendorReviewDTO>(ENDPOINTS.create_review, data);
};

export const findFleetVendorReview = async (data: FleetVendorReviewQueryDTO): Promise<FBR<FleetVendorReview[]>> => {
    return apiPost<FBR<FleetVendorReview[]>, FleetVendorReviewQueryDTO>(ENDPOINTS.find_review, data);
};

export const updateFleetVendorReview = async (id: string, data: FleetVendorReviewDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetVendorReviewDTO>(ENDPOINTS.update_review(id), data);
};

export const deleteFleetVendorReview = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_review(id));
};

// FleetVendorDocument
export const createFleetVendorDocument = async (data: FleetVendorDocumentDTO): Promise<SBR> => {
    return apiPost<SBR, FleetVendorDocumentDTO>(ENDPOINTS.create_document, data);
};

export const findFleetVendorDocument = async (data: FleetVendorDocumentQueryDTO): Promise<FBR<FleetVendorDocument[]>> => {
    return apiPost<FBR<FleetVendorDocument[]>, FleetVendorDocumentQueryDTO>(ENDPOINTS.find_document, data);
};

export const updateFleetVendorDocument = async (id: string, data: FleetVendorDocumentDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetVendorDocumentDTO>(ENDPOINTS.update_document(id), data);
};

export const deleteFleetVendorDocument = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_document(id));
};

// API Cache Methods
export const getFleetVendorCacheSimple = async (organisation_id: string): Promise<BR<FleetVendorSimple[]>> => {
    return apiGet<BR<FleetVendorSimple[]>>(ENDPOINTS.cache_simple(organisation_id));
};