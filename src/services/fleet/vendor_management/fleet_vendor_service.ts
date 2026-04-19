// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BaseCommonFile, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  enumArrayOptional,
  getAllEnums,
  single_select_mandatory,
  single_select_optional,
  multi_select_mandatory,
  multi_select_optional,
  nestedArrayOfObjectsOptional,
  stringMandatory,
  stringOptional,
  numberMandatory,
  dateOptional,
  doubleOptionalLatLng,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { BankAccountType, FileType, FleetVendorAddressLabel, Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { FleetVendorServiceCenter } from './fleet_vendor_service_center';
import { FleetVendorFuelStation } from './fleet_vendor_fuel_station';
import { MasterVendorType } from 'src/services/master/expense/master_vendor_type_service';
import { MasterVendorTag } from 'src/services/master/expense/master_vendor_tag_service';
import { MasterVendorDocumentType } from 'src/services/master/expense/master_vendor_document_type_service';
import { MasterMainLandMark } from 'src/services/master/main/master_main_landmark_service';

const URL = 'fleet/vendor_management/fleet_vendor';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  vendor_logo_presigned_url: (file_name: string): string => `${URL}/vendor_logo_presigned_url/${file_name}`,
  vendor_contact_person_logo_presigned_url: (file_name: string): string => `${URL}/vendor_contact_person_logo_presigned_url/${file_name}`,
  vendor_document_file_presigned_url: `${URL}/vendor_document_file_presigned_url`,

  // File Uploads
  update_vendor_logo: (id: string): string => `${URL}/update_vendor_logo/${id}`,
  remove_vendor_logo: (id: string): string => `${URL}/remove_vendor_logo/${id}`,
  update_vendor_contact_person_image: (id: string): string => `${URL}/update_vendor_contact_person_image/${id}`,
  remove_vendor_contact_person_image: (id: string): string => `${URL}/remove_vendor_contact_person_image/${id}`,
  create_vendor_document_file: `${URL}/create_vendor_document_file`,
  remove_vendor_document_file: (id: string): string => `${URL}/remove_vendor_document_file/${id}`,

  // FleetVendor APIs
  find: `${URL}/fleet_vendor/search`,
  create: `${URL}/fleet_vendor`,
  update: (id: string): string => `${URL}/fleet_vendor/${id}`,
  delete: (id: string): string => `${URL}/fleet_vendor/${id}`,

  vendor_dashboard: `${URL}/vendor_dashboard`,

  // FleetVendorContactPerson APIs
  find_contact_person: `${URL}/vendor_contact_person/search`,
  create_contact_person: `${URL}/vendor_contact_person`,
  update_contact_person: (id: string): string => `${URL}/vendor_contact_person/${id}`,
  delete_contact_person: (id: string): string => `${URL}/vendor_contact_person/${id}`,

  // FleetVendorDocument APIs
  find_document: `${URL}/vendor_document/search`,
  create_document: `${URL}/vendor_document`,
  update_document: (id: string): string => `${URL}/vendor_document/${id}`,
  delete_document: (id: string): string => `${URL}/vendor_document/${id}`,

  // FleetVendorAddress APIs
  find_address: `${URL}/vendor_address/search`,
  create_address: `${URL}/vendor_address`,
  update_address: (id: string): string => `${URL}/vendor_address/${id}`,
  delete_address: (id: string): string => `${URL}/vendor_address/${id}`,

  // FleetVendorBankAccount APIs
  find_bank_account: `${URL}/vendor_bank_account/search`,
  create_bank_account: `${URL}/vendor_bank_account`,
  update_bank_account: (id: string): string => `${URL}/vendor_bank_account/${id}`,
  delete_bank_account: (id: string): string => `${URL}/vendor_bank_account/${id}`,

  // FleetVendorReview APIs
  find_review: `${URL}/vendor_review/search`,
  create_review: `${URL}/vendor_review`,
  update_review: (id: string): string => `${URL}/vendor_review/${id}`,
  delete_review: (id: string): string => `${URL}/vendor_review/${id}`,

  // FleetVendor Cache
  cache_simple: (organisation_id: string): string => `${URL}/cache_simple/${organisation_id}`,
};

// FleetVendor Interface
export interface FleetVendor extends Record<string, unknown> {
  // Primary Field
  vendor_id: string;

  // Profile Image/Logo
  logo_url?: string;
  logo_key?: string;
  logo_name?: string;

  // Main Field Details
  vendor_name: string;
  vendor_code?: string;
  business_mobile?: string;
  business_email?: string;

  // Business Details
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
  FleetVendorTypeLink?: FleetVendorTypeLink[];
  FleetVendorTagLink?: FleetVendorTagLink[];
  FleetVendorAddress?: FleetVendorAddress[];
  FleetVendorBankAccount?: FleetVendorBankAccount[];
  FleetVendorContactPerson?: FleetVendorContactPerson[];
  FleetVendorReview?: FleetVendorReview[];
  FleetVendorDocument?: FleetVendorDocument[];
  FleetVendorServiceCenter?: FleetVendorServiceCenter[];
  FleetVendorFuelStation?: FleetVendorFuelStation[];

  // Relations - Child Count
  _count?: {
    FleetVendorTypeLink?: number;
    FleetVendorTagLink?: number;
    FleetVendorAddress?: number;
    FleetVendorBankAccount?: number;
    FleetVendorContactPerson?: number;
    FleetVendorReview?: number;
    FleetVendorDocument?: number;
    FleetVendorServiceCenter?: number;
    FleetVendorFuelStation?: number;
  };
}

// FleetVendorTypeLink Interface
export interface FleetVendorTypeLink extends Record<string, unknown> {
  // Primary Field
  vendor_type_link_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  vendor_id: string;
  FleetVendor?: FleetVendor;
  vendor_logo_url?: string;
  vendor_name?: string;
  vendor_code?: string;

  vendor_type_id: string;
  MasterVendorType?: MasterVendorType;
  vendor_type?: string;

  // Relations - Child Count
  _count?: {};
}

// FleetVendorTagLink Interface
export interface FleetVendorTagLink extends Record<string, unknown> {
  // Primary Field
  vendor_tag_link_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  vendor_id: string;
  FleetVendor?: FleetVendor;
  vendor_logo_url?: string;
  vendor_name?: string;
  vendor_code?: string;

  vendor_tag_id: string;
  MasterVendorTag?: MasterVendorTag;
  vendor_tag?: string;

  // Relations - Child Count
  _count?: {};
}

// FleetVendorAddress Interface
export interface FleetVendorAddress extends Record<string, unknown> {
  // Primary Field
  vendor_address_id: string;

  // Main Field Details
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
  MasterMainLandMark?: MasterMainLandMark;
  landmark_location?: string;
  landmark_distance?: number;

  is_default: YesNo;
  notes?: string;

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

  // Relations - Child Count
  _count?: {};
}

// FleetVendorBankAccount Interface
export interface FleetVendorBankAccount extends Record<string, unknown> {
  // Primary Field
  vendor_bank_account_id: string;

  // Main Field Details
  bank_name?: string;
  branch_name?: string;
  account_holder_name?: string;
  account_number: string;
  account_type: BankAccountType;
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

  // Relations - Child Count
  _count?: {};
}

// FleetVendorContactPerson Interface
export interface FleetVendorContactPerson extends Record<string, unknown> {
  // Primary Field
  contact_person_id: string;

  // Profile Image/Logo
  image_url?: string;
  image_key?: string;
  image_name?: string;

  // Main Field Details
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

  // Relations - Child Count
  _count?: {};
}

// FleetVendorReview Interface
export interface FleetVendorReview extends Record<string, unknown> {
  // Primary Field
  vendor_review_id: string;

  // Main Field Details
  rating: number;
  rating_comments?: string;

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

  // Relations - Child Count
  _count?: {};
}

// FleetVendorDocument Interface
export interface FleetVendorDocument extends Record<string, unknown> {
  // Primary Field
  fleet_vendor_document_id: string;

  // Document Details
  document_name: string;
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

  document_type_id: string;
  MasterVendorDocumentType?: MasterVendorDocumentType;
  document_type?: string;

  // Relations - Child
  // Child - Fleet
  FleetVendorDocumentFile?: FleetVendorDocumentFile[];

  // Relations - Child Count
  _count?: {
    FleetVendorDocumentFile?: number;
  };
}

// FleetVendorDocumentFile Interface
export interface FleetVendorDocumentFile extends BaseCommonFile {
  // Primary Field
  fleet_vendor_document_file_id: string;

  // Usage Type -> GST Registration Certificate, Certificate Of Incorporation, Udyam Registration, Professional Tax Registration

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

  fleet_vendor_document_id: string;
  FleetVendorDocument?: FleetVendorDocument;

  // Relations - Child Count
  _count?: {};
}

// VendorDashboard Interface
export interface VendorDashboard extends Record<string, unknown> {
  main_counts: {
    vendors: number;
    fuel_stations: number;
    service_centers: number;
  };

  // Relations - Child Count
  _count?: {};
}

// FleetVendorSimple Interface
export interface FleetVendorSimple extends Record<string, unknown> {
  vendor_id: string;
  vendor_name: string;
  vendor_code?: string;
  business_mobile?: string;
  business_email?: string;

  // Relations - Child Count
  _count?: {};
}

// FleetVendor Logo Schema
export const FleetVendorLogoSchema = z.object({
  // Profile Image/Logo
  logo_url: stringMandatory('Logo URL', 1, 300),
  logo_key: stringMandatory('Logo Key', 1, 300),
  logo_name: stringMandatory('Logo Name', 1, 300),
});
export type FleetVendorLogoDTO = z.infer<typeof FleetVendorLogoSchema>;

// FleetVendorContactPerson Logo Schema
export const FleetVendorContactPersonLogoSchema = z.object({
  // Profile Image/Logo
  image_url: stringMandatory('Image URL', 1, 300),
  image_key: stringMandatory('Image Key', 1, 300),
  image_name: stringMandatory('Image Name', 1, 300),
});
export type FleetVendorContactPersonLogoDTO = z.infer<typeof FleetVendorContactPersonLogoSchema>;

// FleetVendorDocumentFile Schema
export const FleetVendorDocumentFileSchema = BaseFileSchema.extend({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  fleet_vendor_document_id: single_select_mandatory('FleetVendorDocument'), // Single-Selection -> FleetVendorDocument
});
export type FleetVendorDocumentFileDTO = z.infer<typeof FleetVendorDocumentFileSchema>;

// FleetVendor Create/Update Schema
export const FleetVendorSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User

  // Profile Image/Logo
  logo_url: stringOptional('Logo URL', 0, 300),
  logo_key: stringOptional('Logo Key', 0, 300),
  logo_name: stringOptional('Logo Name', 0, 300),

  // Main Field Details
  vendor_name: stringMandatory('Vendor Name', 3, 100),
  vendor_code: stringOptional('Vendor Code', 0, 100),
  business_mobile: stringOptional('Business Mobile', 0, 15),
  business_email: stringOptional('Business Email', 0, 100),

  // Business Details
  gst_number: stringOptional('GST Number', 0, 15),
  pan_number: stringOptional('PAN Number', 0, 10),
  tax_id_number: stringOptional('Tax ID Number', 0, 50),
  vat_number: stringOptional('VAT Number', 0, 50),
  business_registration_number: stringOptional('Business Registration Number', 0, 50),

  // Financial Details
  payment_terms: stringOptional('Payment Terms', 0, 2000),
  financial_notes: stringOptional('Financial Notes', 0, 2000),

  // Additional Information
  additional_details_1: stringOptional('Additional Details 1', 0, 2000),
  additional_details_2: stringOptional('Additional Details 2', 0, 2000),
  additional_details_3: stringOptional('Additional Details 3', 0, 2000),

  vendor_type_ids: multi_select_optional('MasterVendorType'), // Multi selection -> MasterVendorType
  vendor_tag_ids: multi_select_optional('MasterVendorTag'), // Multi selection -> MasterVendorTag

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorDTO = z.infer<typeof FleetVendorSchema>;

// FleetVendor Query Schema
export const FleetVendorQuerySchema = BaseQuerySchema.extend({
  // Self Table
  vendor_ids: multi_select_optional('FleetVendor'), // Multi-Selection -> FleetVendor

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User

  vendor_type_ids: multi_select_optional('MasterVendorType'), // Multi-Selection -> MasterVendorType
  vendor_tag_ids: multi_select_optional('MasterVendorTag'), // Multi-Selection -> MasterVendorTag
});
export type FleetVendorQueryDTO = z.infer<typeof FleetVendorQuerySchema>;

// FleetVendorAddress Create/Update Schema
export const FleetVendorAddressSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  vendor_id: single_select_mandatory('FleetVendor'), // Single-Selection -> FleetVendor

  // Main Field Details
  vendor_address_label: enumMandatory('Fleet Vendor Address Label', FleetVendorAddressLabel, FleetVendorAddressLabel.OTHER),

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

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorAddressDTO = z.infer<typeof FleetVendorAddressSchema>;

// FleetVendorAddress Query Schema
export const FleetVendorAddressQuerySchema = BaseQuerySchema.extend({
  // Self Table
  vendor_address_ids: multi_select_optional('FleetVendorAddress'), // Multi-Selection -> FleetVendorAddress

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
  vendor_ids: multi_select_optional('FleetVendor'), // Multi-Selection -> FleetVendor

  vendor_address_label: enumArrayOptional('Vendor Address Label', FleetVendorAddressLabel, getAllEnums(FleetVendorAddressLabel)),

  // Enums
  is_default: enumArrayOptional('Is Default', YesNo, getAllEnums(YesNo)),
});
export type FleetVendorAddressQueryDTO = z.infer<typeof FleetVendorAddressQuerySchema>;

// FleetVendorBankAccount Create/Update Schema
export const FleetVendorBankAccountSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  vendor_id: single_select_mandatory('FleetVendor'), // Single-Selection -> FleetVendor

  // Main Field Details
  bank_name: stringOptional('Bank Name', 0, 100),
  branch_name: stringOptional('Branch Name', 0, 100),
  account_holder_name: stringOptional('Account Holder Name', 0, 100),
  account_number: stringMandatory('Account Number', 1, 50),
  account_type: enumMandatory('Account Type', BankAccountType, BankAccountType.Other),
  ifsc_code: stringOptional('IFSC Code', 0, 20),
  swift_code: stringOptional('Swift Code', 0, 20),
  iban_number: stringOptional('IBAN Number', 0, 34),
  upi_id: stringOptional('UPI ID', 0, 100),
  is_primary: enumMandatory('Is Primary', YesNo, YesNo.No),
  notes: stringOptional('Notes', 0, 2000),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorBankAccountDTO = z.infer<typeof FleetVendorBankAccountSchema>;

// FleetVendorBankAccount Query Schema
export const FleetVendorBankAccountQuerySchema = BaseQuerySchema.extend({
  // Self Table
  vendor_bank_account_ids: multi_select_optional('FleetVendorBankAccount'), // Multi-Selection -> FleetVendorBankAccount

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
  vendor_ids: multi_select_optional('FleetVendor'), // Multi-Selection -> FleetVendor

  // Enums
  is_primary: enumArrayOptional('Is Primary', YesNo, getAllEnums(YesNo)),
  account_type: enumArrayOptional('Account Type', BankAccountType, getAllEnums(BankAccountType)),
});
export type FleetVendorBankAccountQueryDTO = z.infer<typeof FleetVendorBankAccountQuerySchema>;

// FleetVendorContactPerson Create/Update Schema
export const FleetVendorContactPersonSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  vendor_id: single_select_mandatory('FleetVendor'), // Single-Selection -> FleetVendor

  // Profile Image/Logo
  image_url: stringOptional('Image URL', 0, 300),
  image_key: stringOptional('Image Key', 0, 300),
  image_name: stringOptional('Image Name', 0, 300),

  // Main Field Details
  name: stringMandatory('Name', 3, 100),
  mobile: stringOptional('Mobile', 0, 15),
  alternative_mobile: stringOptional('Alternative Mobile', 0, 15),
  email: stringOptional('Email', 0, 100),
  designation: stringOptional('Designation', 0, 50),

  // Additional Details
  branch_name: stringOptional('Branch Name', 0, 100),
  preferred_language: stringOptional('Preferred Language', 0, 50),
  is_primary: enumMandatory('Is Primary', YesNo, YesNo.No),
  notes: stringOptional('Notes', 0, 2000),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorContactPersonDTO = z.infer<typeof FleetVendorContactPersonSchema>;

// FleetVendorContactPerson Query Schema
export const FleetVendorContactPersonQuerySchema = BaseQuerySchema.extend({
  // Self Table
  contact_person_ids: multi_select_optional('FleetVendorContactPerson'), // Multi-Selection -> FleetVendorContactPerson

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
  vendor_ids: multi_select_optional('FleetVendor'), // Multi-Selection -> FleetVendor

  // Enums
  is_primary: enumArrayOptional('Is Primary', YesNo, getAllEnums(YesNo)),
});
export type FleetVendorContactPersonQueryDTO = z.infer<typeof FleetVendorContactPersonQuerySchema>;

// FleetVendorReview Create/Update Schema
export const FleetVendorReviewSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  vendor_id: single_select_mandatory('FleetVendor'), // Single-Selection -> FleetVendor
  user_id: single_select_optional('User'), // Single-Selection -> User

  // Main Field Details
  rating: numberMandatory('Rating', 1, 5),
  rating_comments: stringOptional('Rating Comments', 0, 2000),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetVendorReviewDTO = z.infer<typeof FleetVendorReviewSchema>;

// FleetVendorReview Query Schema
export const FleetVendorReviewQuerySchema = BaseQuerySchema.extend({
  // Self Table
  vendor_review_ids: multi_select_optional('FleetVendorReview'), // Multi-Selection -> FleetVendorReview

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
  vendor_ids: multi_select_optional('FleetVendor'), // Multi-Selection -> FleetVendor
});
export type FleetVendorReviewQueryDTO = z.infer<typeof FleetVendorReviewQuerySchema>;

// FleetVendorDocument Create/Update Schema
export const FleetVendorDocumentSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // Single-Selection -> User
  vendor_id: single_select_mandatory('FleetVendor'), // Single-Selection -> FleetVendor
  document_type_id: single_select_mandatory('MasterVendorDocumentType'), // Single-Selection -> MasterVendorDocumentType

  // Main Field Details
  document_name: stringMandatory('Document Name', 3, 150),
  document_number: stringOptional('Document Number', 0, 150),
  issuing_authority: stringOptional('Issuing Authority', 0, 150),
  issue_date: dateOptional('Issue Date'),
  expiry_date: dateOptional('Expiry Date'),
  remarks: stringOptional('Remarks', 0, 150),

  FleetVendorDocumentFileSchema: nestedArrayOfObjectsOptional('FleetVendorDocumentFileSchema', FleetVendorDocumentFileSchema, []),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),

  // Other
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FleetVendorDocumentDTO = z.infer<typeof FleetVendorDocumentSchema>;

// FleetVendorDocument Query Schema
export const FleetVendorDocumentQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fleet_vendor_document_ids: multi_select_optional('FleetVendorDocument'), // Multi-selection -> FleetVendorDocument

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-selection -> User
  vendor_ids: multi_select_optional('FleetVendor'), // Multi-selection -> FleetVendor
  document_type_ids: multi_select_optional('MasterVendorDocumentType'), // Multi-selection -> MasterVendorDocumentType
});
export type FleetVendorDocumentQueryDTO = z.infer<typeof FleetVendorDocumentQuerySchema>;

// FleetVendorDashBoard Query Schema
export const FleetVendorDashBoardQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_mandatory('UserOrganisation'), // Multi-Selection -> UserOrganisation
});
export type FleetVendorDashBoardQueryDTO = z.infer<typeof FleetVendorDashBoardQuerySchema>;

// Convert FleetVendor Data to API Payload
export const toFleetVendorPayload = (row: FleetVendor): FleetVendorDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',

  logo_url: row.logo_url || '',
  logo_key: row.logo_key || '',
  logo_name: row.logo_name || '',

  vendor_name: row.vendor_name || '',
  vendor_code: row.vendor_code || '',
  business_mobile: row.business_mobile || '',
  business_email: row.business_email || '',

  gst_number: row.gst_number || '',
  pan_number: row.pan_number || '',
  tax_id_number: row.tax_id_number || '',
  vat_number: row.vat_number || '',
  business_registration_number: row.business_registration_number || '',

  payment_terms: row.payment_terms || '',
  financial_notes: row.financial_notes || '',

  additional_details_1: row.additional_details_1 || '',
  additional_details_2: row.additional_details_2 || '',
  additional_details_3: row.additional_details_3 || '',

  vendor_type_ids: row.FleetVendorTypeLink?.map((l) => l.vendor_type_id) || [],
  vendor_tag_ids: row.FleetVendorTagLink?.map((l) => l.vendor_tag_id) || [],

  status: row.status || Status.Active,
});

// Create New FleetVendor Payload
export const newFleetVendorPayload = (): FleetVendorDTO => ({
  organisation_id: '',
  user_id: '',

  logo_url: '',
  logo_key: '',
  logo_name: '',

  vendor_name: '',
  vendor_code: '',
  business_mobile: '',
  business_email: '',

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

  vendor_type_ids: [],
  vendor_tag_ids: [],

  status: Status.Active,
});

// Convert FleetVendorAddress Data to API Payload
export const toFleetVendorAddressPayload = (row: FleetVendorAddress): FleetVendorAddressDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',
  vendor_id: row.vendor_id || '',

  vendor_address_label: row.vendor_address_label || FleetVendorAddressLabel.OTHER,

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

  latitude: row.latitude || 0,
  longitude: row.longitude || 0,
  google_location: row.google_location || '',

  is_default: row.is_default || YesNo.No,
  notes: row.notes || '',

  status: row.status || Status.Active,
});

// Create New FleetVendorAddress Payload
export const newFleetVendorAddressPayload = (): FleetVendorAddressDTO => ({
  organisation_id: '',
  user_id: '',
  vendor_id: '',

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

  is_default: YesNo.No,
  notes: '',

  status: Status.Active,
});

// Convert FleetVendorBankAccount Data to API Payload
export const toFleetVendorBankAccountPayload = (row: FleetVendorBankAccount): FleetVendorBankAccountDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',
  vendor_id: row.vendor_id || '',

  bank_name: row.bank_name || '',
  branch_name: row.branch_name || '',
  account_holder_name: row.account_holder_name || '',
  account_number: row.account_number || '',
  account_type: row.account_type || BankAccountType.Other,
  ifsc_code: row.ifsc_code || '',
  swift_code: row.swift_code || '',
  iban_number: row.iban_number || '',
  upi_id: row.upi_id || '',
  is_primary: row.is_primary || YesNo.No,
  notes: row.notes || '',

  status: row.status || Status.Active,
});

// Create New FleetVendorBankAccount Payload
export const newFleetVendorBankAccountPayload = (): FleetVendorBankAccountDTO => ({
  organisation_id: '',
  user_id: '',
  vendor_id: '',

  bank_name: '',
  branch_name: '',
  account_holder_name: '',
  account_number: '',
  account_type: BankAccountType.Other,
  ifsc_code: '',
  swift_code: '',
  iban_number: '',
  upi_id: '',
  is_primary: YesNo.No,
  notes: '',

  status: Status.Active,
});

// Convert FleetVendorContactPerson Data to API Payload
export const toFleetVendorContactPersonPayload = (row: FleetVendorContactPerson): FleetVendorContactPersonDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',
  vendor_id: row.vendor_id || '',

  image_url: row.image_url || '',
  image_key: row.image_key || '',
  image_name: row.image_name || '',

  name: row.name || '',
  mobile: row.mobile || '',
  alternative_mobile: row.alternative_mobile || '',
  email: row.email || '',
  designation: row.designation || '',

  branch_name: row.branch_name || '',
  preferred_language: row.preferred_language || '',
  is_primary: row.is_primary || YesNo.No,
  notes: row.notes || '',

  status: row.status || Status.Active,
});

// Create New FleetVendorContactPerson Payload
export const newFleetVendorContactPersonPayload = (): FleetVendorContactPersonDTO => ({
  organisation_id: '',
  user_id: '',
  vendor_id: '',

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

  status: Status.Active,
});

// Convert FleetVendorReview Data to API Payload
export const toFleetVendorReviewPayload = (row: FleetVendorReview): FleetVendorReviewDTO => ({
  organisation_id: row.organisation_id || '',
  vendor_id: row.vendor_id || '',
  user_id: row.user_id || '',

  rating: row.rating || 1,
  rating_comments: row.rating_comments || '',

  status: row.status || Status.Active,
});

// Create New FleetVendorReview Payload
export const newFleetVendorReviewPayload = (): FleetVendorReviewDTO => ({
  organisation_id: '',
  vendor_id: '',
  user_id: '',

  rating: 1,
  rating_comments: '',

  status: Status.Active,
});

// Convert FleetVendorDocument Data to API Payload
export const toFleetVendorDocumentPayload = (row: FleetVendorDocument): FleetVendorDocumentDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',
  vendor_id: row.vendor_id || '',
  document_type_id: row.document_type_id || '',

  document_name: row.document_name || '',
  document_number: row.document_number || '',
  issuing_authority: row.issuing_authority || '',
  issue_date: row.issue_date || '',
  expiry_date: row.expiry_date || '',
  remarks: row.remarks || '',

  FleetVendorDocumentFileSchema: row.FleetVendorDocumentFile?.map((file) => ({
    fleet_vendor_document_file_id: file.fleet_vendor_document_file_id || '',

    usage_type: file.usage_type || '',

    file_type: file.file_type || FileType.Image,

    file_url: file.file_url || '',
    file_key: file.file_key || '',
    file_name: file.file_name || '',
    file_description: file.file_description || '',
    file_size: file.file_size || 0,
    file_metadata: file.file_metadata || {},

    status: file.status || Status.Active,
    added_date_time: file.added_date_time,
    modified_date_time: file.modified_date_time,

    organisation_id: file.organisation_id || '',
    user_id: file.user_id || '',
    fleet_vendor_document_id: file.fleet_vendor_document_id || '',
  })) || [],

  status: row.status || Status.Active,
  time_zone_id: '',
});

// Create New FleetVendorDocument Payload
export const newFleetVendorDocumentPayload = (): FleetVendorDocumentDTO => ({
  organisation_id: '',
  user_id: '',
  vendor_id: '',
  document_type_id: '',

  document_name: '',
  document_number: '',
  issuing_authority: '',
  issue_date: '',
  expiry_date: '',
  remarks: '',

  FleetVendorDocumentFileSchema: [],

  status: Status.Active,
  time_zone_id: '',
});

// AWS S3 PRESIGNED
export const get_vendor_logo_presigned_url = async (file_name: string): Promise<BR<AWSPresignedUrl>> => {
  return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.vendor_logo_presigned_url(file_name));
};

export const get_vendor_contact_person_logo_presigned_url = async (file_name: string): Promise<BR<AWSPresignedUrl>> => {
  return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.vendor_contact_person_logo_presigned_url(file_name));
};

export const get_vendor_document_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.vendor_document_file_presigned_url, data);
};

// File Uploads
export const update_vendor_logo = async (id: string, data: FleetVendorLogoDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetVendorLogoDTO>(ENDPOINTS.update_vendor_logo(id), data);
};

export const remove_vendor_logo = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_vendor_logo(id));
};

export const update_vendor_contact_person_image = async (id: string, data: FleetVendorContactPersonLogoDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetVendorContactPersonLogoDTO>(ENDPOINTS.update_vendor_contact_person_image(id), data);
};

export const remove_vendor_contact_person_image = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_vendor_contact_person_image(id));
};

export const create_vendor_document_file = async (data: FleetVendorDocumentFileDTO): Promise<SBR> => {
  return apiPost<SBR, FleetVendorDocumentFileDTO>(ENDPOINTS.create_vendor_document_file, data);
};

export const remove_vendor_document_file = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_vendor_document_file(id));
};

// FleetVendor APIs
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

export const vendor_dashboard = async (data: FleetVendorDashBoardQueryDTO): Promise<FBR<VendorDashboard[]>> => {
  return apiPost<FBR<VendorDashboard[]>, FleetVendorDashBoardQueryDTO>(ENDPOINTS.vendor_dashboard, data);
};

// FleetVendorContactPerson APIs
export const findFleetVendorContactPerson = async (data: FleetVendorContactPersonQueryDTO): Promise<FBR<FleetVendorContactPerson[]>> => {
  return apiPost<FBR<FleetVendorContactPerson[]>, FleetVendorContactPersonQueryDTO>(ENDPOINTS.find_contact_person, data);
};

export const createFleetVendorContactPerson = async (data: FleetVendorContactPersonDTO): Promise<SBR> => {
  return apiPost<SBR, FleetVendorContactPersonDTO>(ENDPOINTS.create_contact_person, data);
};

export const updateFleetVendorContactPerson = async (id: string, data: FleetVendorContactPersonDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetVendorContactPersonDTO>(ENDPOINTS.update_contact_person(id), data);
};

export const deleteFleetVendorContactPerson = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_contact_person(id));
};

// FleetVendorDocument APIs
export const findFleetVendorDocument = async (data: FleetVendorDocumentQueryDTO): Promise<FBR<FleetVendorDocument[]>> => {
  return apiPost<FBR<FleetVendorDocument[]>, FleetVendorDocumentQueryDTO>(ENDPOINTS.find_document, data);
};

export const createFleetVendorDocument = async (data: FleetVendorDocumentDTO): Promise<SBR> => {
  return apiPost<SBR, FleetVendorDocumentDTO>(ENDPOINTS.create_document, data);
};

export const updateFleetVendorDocument = async (id: string, data: FleetVendorDocumentDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetVendorDocumentDTO>(ENDPOINTS.update_document(id), data);
};

export const deleteFleetVendorDocument = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_document(id));
};

// FleetVendorAddress APIs
export const findFleetVendorAddress = async (data: FleetVendorAddressQueryDTO): Promise<FBR<FleetVendorAddress[]>> => {
  return apiPost<FBR<FleetVendorAddress[]>, FleetVendorAddressQueryDTO>(ENDPOINTS.find_address, data);
};

export const createFleetVendorAddress = async (data: FleetVendorAddressDTO): Promise<SBR> => {
  return apiPost<SBR, FleetVendorAddressDTO>(ENDPOINTS.create_address, data);
};

export const updateFleetVendorAddress = async (id: string, data: FleetVendorAddressDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetVendorAddressDTO>(ENDPOINTS.update_address(id), data);
};

export const deleteFleetVendorAddress = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_address(id));
};

// FleetVendorBankAccount APIs
export const findFleetVendorBankAccount = async (data: FleetVendorBankAccountQueryDTO): Promise<FBR<FleetVendorBankAccount[]>> => {
  return apiPost<FBR<FleetVendorBankAccount[]>, FleetVendorBankAccountQueryDTO>(ENDPOINTS.find_bank_account, data);
};

export const createFleetVendorBankAccount = async (data: FleetVendorBankAccountDTO): Promise<SBR> => {
  return apiPost<SBR, FleetVendorBankAccountDTO>(ENDPOINTS.create_bank_account, data);
};

export const updateFleetVendorBankAccount = async (id: string, data: FleetVendorBankAccountDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetVendorBankAccountDTO>(ENDPOINTS.update_bank_account(id), data);
};

export const deleteFleetVendorBankAccount = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_bank_account(id));
};

// FleetVendorReview APIs
export const findFleetVendorReview = async (data: FleetVendorReviewQueryDTO): Promise<FBR<FleetVendorReview[]>> => {
  return apiPost<FBR<FleetVendorReview[]>, FleetVendorReviewQueryDTO>(ENDPOINTS.find_review, data);
};

export const createFleetVendorReview = async (data: FleetVendorReviewDTO): Promise<SBR> => {
  return apiPost<SBR, FleetVendorReviewDTO>(ENDPOINTS.create_review, data);
};

export const updateFleetVendorReview = async (id: string, data: FleetVendorReviewDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetVendorReviewDTO>(ENDPOINTS.update_review(id), data);
};

export const deleteFleetVendorReview = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_review(id));
};

// FleetVendor Cache
export const find_vendor_cache_simple = async (organisation_id: string): Promise<FBR<FleetVendorSimple[]>> => {
  return apiGet<FBR<FleetVendorSimple[]>>(ENDPOINTS.cache_simple(organisation_id));
};