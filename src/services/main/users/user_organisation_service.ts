// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
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
  getAllEnums,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, FleetSize } from '../../../core/Enums';

// Other Models
import { MasterMainIndustry } from '../../../services/master/main/master_main_industry_service';
import { MasterMainCountry } from '../../../services/master/main/master_main_country_service';
import { MasterMainState } from '../../../services/master/main/master_main_state_service';
import { MasterMainTimeZone } from '../../../services/master/main/master_main_timezone_service';
import { MasterMainCurrency } from '../../../services/master/main/master_main_currency_service';
import { MasterMainDateFormat } from '../../../services/master/main/master_main_date_format_service';
import { MasterMainUnitDistance } from '../../../services/master/main/master_main_unit_distance_service';
import { MasterMainUnitMileage } from '../../../services/master/main/master_main_unit_mileage_service';
import { MasterMainUnitVolume } from '../../../services/master/main/master_main_unit_volume_service';

// Other Models Childs
import { MasterVehicle } from '../../../services/main/vehicle/master_vehicle_service';
import { MasterDriver } from '../../../services/main/drivers/master_driver_service';
import { MasterDevice } from '../../../services/main/devices/master_device_service';
import { User } from '../../../services/main/users/user_service';

import { OrganisationBranch } from '../../../services/master/organisation/organisation_branch_service';
import { OrganisationColor } from '../../../services/master/organisation/organisation_color_service';
import { OrganisationGroup } from '../../../services/master/organisation/organisation_group_service';
import { OrganisationSubCompany } from '../../../services/master/organisation/organisation_sub_company_service';
import { OrganisationTag } from '../../../services/master/organisation/organisation_tag_service';

import { MasterExpenseName } from '../../../services/master/expense/master_expense_name_service';
import { MasterExpenseType } from '../../../services/master/expense/master_expense_type_service';

import { MasterUserRole } from '../../../services/master/user/master_user_role_service';
import { MasterUserStatus } from '../../../services/master/user/master_user_status_service';

import { MasterVehicleFuelType } from '../../../services/master/vehicle/master_vehicle_fuel_type_service';
import { MasterVehicleOwnershipType } from '../../../services/master/vehicle/master_vehicle_ownership_type_service';
import { MasterVehicleMake } from '../../../services/master/vehicle/master_vehicle_make_service';
import { MasterVehicleModel } from '../../../services/master/vehicle/master_vehicle_model_service';
import { MasterVehicleSubModel } from '../../../services/master/vehicle/master_vehicle_sub_model_service';
import { MasterVehicleStatusType } from '../../../services/master/vehicle/master_vehicle_status_type_service';
import { MasterVehicleType } from '../../../services/master/vehicle/master_vehicle_type_service';

import { MasterTyreGrade } from '../../../services/master/tyre/master_tyre_grade_service';
import { MasterTyreMake } from '../../../services/master/tyre/master_tyre_make_service';
import { MasterTyreModel } from '../../../services/master/tyre/master_tyre_model_service';

import { MasterFleetIncidentType } from '../../../services/master/fleet/master_fleet_incident_type_service';
import { MasterFleetIncidentStatus } from '../../../services/master/fleet/master_fleet_incident_status_service';
import { MasterFleetIncidentSeverity } from '../../../services/master/fleet/master_fleet_incident_severity_service';
import { MasterFleetInsuranceClaimStatus } from '../../../services/master/fleet/master_fleet_insurance_claim_status_service';
import { MasterFleetServiceTask } from '../../../services/master/fleet/master_fleet_service_task_service';

import { MasterTripPartyType } from '../../../services/master/trip/master_trip_party_type_service';

import { MasterVendorType } from '../../../services/master/expense/master_vendor_type_service';

import { MasterSparePartCategory } from '../../../services/master/spare_part/master_spare_part_category_service';
import { MasterSparePartSubCategory } from '../../../services/master/spare_part/master_spare_part_sub_category_service';
import { MasterSparePartUnit } from '../../../services/master/spare_part/master_spare_part_unit_service';
import { MasterMainLanguage } from 'src/services/master/main/master_main_language_service';

const URL = 'user/organisation';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (): string => `${URL}/cache`,
  cache_simple: (): string => `${URL}/cache_simple`,
  presignedUrl: (fileName: string): string => `${URL}/presigned_url/${fileName}`,
};

// UserOrganisation Interface
export interface UserOrganisation extends Record<string, unknown> {
  // Primary Fields
  organisation_id: string;
  organisation_name: string;
  organisation_email?: string;
  organisation_mobile?: string;

  organisation_code?: string;
  organisation_utrack_id?: string;

  fleet_size: FleetSize;

  db_instance: string;
  db_group: string;

  logo_url?: string;
  logo_key?: string;
  logo_name?: string;

  company_cin?: string;
  company_tin_gstin?: string;

  // Billing Address
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_locality_landmark?: string;
  billing_neighborhood?: string;
  billing_town_city?: string;
  billing_district_county?: string;
  billing_state_province_region?: string;
  billing_postal_code?: string;
  billing_country?: string;
  billing_country_code?: string;

  // Company Address
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

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  industry_id: string;
  MasterMainIndustry?: MasterMainIndustry;

  country_id: string;
  MasterMainCountry?: MasterMainCountry;

  state_id?: string;
  MasterMainState?: MasterMainState;

  currency_id?: string;
  MasterMainCurrency?: MasterMainCurrency;

  language_id?: string;
  MasterMainLanguage?: MasterMainLanguage;

  time_zone_id?: string;
  MasterMainTimeZone?: MasterMainTimeZone;

  date_format_id?: string;
  MasterMainDateFormat?: MasterMainDateFormat;

  distance_unit_id?: string;
  MasterMainUnitDistance?: MasterMainUnitDistance;

  mileage_unit_id?: string;
  MasterMainUnitMileage?: MasterMainUnitMileage;

  volume_unit_id?: string;
  MasterMainUnitVolume?: MasterMainUnitVolume;

  // Relations - Child
  // Child - Main
  User: User[];
  MasterDriver: MasterDriver[];
  MasterDevice: MasterDevice[];
  MasterVehicle: MasterVehicle[];

  // Child - Master
  OrganisationBranch: OrganisationBranch[];
  OrganisationColor: OrganisationColor[];
  OrganisationGroup: OrganisationGroup[];
  OrganisationSubCompany: OrganisationSubCompany[];
  OrganisationTag: OrganisationTag[];

  // ✅ Count of child relations
  _count?: {
    User?: number;
    MasterVehicle?: number;
    MasterDevice?: number;
    MasterDriver?: number;

    OrganisationBranch?: number;
    OrganisationColor?: number;
    OrganisationGroup?: number;
    OrganisationSubCompany?: number;
    OrganisationTag?: number;
  };
}

export interface UserOrganisationSimple extends Record<string, unknown> {
  o_id: string;
  o_name: string;
  o_email: string;
  o_mobile: string;
  o_code: string;
  u_id: string;

  db_i: string;
  db_g: string;

  o_logo?: string;
}

// ✅ Create Organisation Create/Update Schema
export const UserOrganisationSchema = z.object({
  organisation_name: stringMandatory('Organisation Name', 3, 100),
  organisation_email: stringOptional('Organisation Email', 0, 100),
  organisation_mobile: stringOptional('Organisation Mobile', 0, 20),

  organisation_code: stringOptional('Organisation Code', 0, 20),
  organisation_utrack_id: stringOptional('Organisation UTrack ID', 0, 20),

  fleet_size: enumMandatory(
    'Fleet Size',
    FleetSize,
    FleetSize.Fleet_1_to_50_Vehicles,
  ),

  logo_url: stringOptional('Logo URL', 0, 300),
  logo_key: stringOptional('Logo Key', 0, 300),
  logo_name: stringOptional('Logo Name', 0, 300),

  company_cin: stringOptional('Company CIN', 0, 50),
  company_tin_gstin: stringOptional('Company TIN/GSTIN', 0, 50),

  // Billing Address
  billing_address_line1: stringOptional('Billing Address Line 1', 0, 150),
  billing_address_line2: stringOptional('Billing Address Line 2', 0, 150),
  billing_locality_landmark: stringOptional(
    'Billing Locality Landmark',
    0,
    150,
  ),
  billing_neighborhood: stringOptional('Billing Neighborhood', 0, 100),
  billing_town_city: stringOptional('Billing Town/City', 0, 100),
  billing_district_county: stringOptional('Billing District/County', 0, 100),
  billing_state_province_region: stringOptional(
    'Billing State/Province/Region',
    0,
    100,
  ),
  billing_postal_code: stringOptional('Billing Postal Code', 0, 20),
  billing_country: stringOptional('Billing Country', 0, 100),
  billing_country_code: stringOptional('Billing Country Code', 0, 5),

  // Address
  address_line1: stringOptional('Address Line 1', 0, 150),
  address_line2: stringOptional('Address Line 2', 0, 150),
  locality_landmark: stringOptional('Locality Landmark', 0, 150),
  neighborhood: stringOptional('Neighborhood', 0, 100),
  town_city: stringOptional('Town/City', 0, 100),
  district_county: stringOptional('District/County', 0, 100),
  state_province_region: stringOptional('State/Province/Region', 0, 100),
  postal_code: stringOptional('Postal Code', 0, 20),
  country: stringOptional('Country', 0, 100),
  country_code: stringOptional('Country Code', 0, 5),

  status: enumMandatory('Status', Status, Status.Active),

  industry_id: single_select_mandatory('MasterMainIndustry'), // ✅ Single-Selection -> MasterMainIndustry
  country_id: single_select_mandatory('MasterMainCountry'), // ✅ Single-Selection -> MasterMainCountry
  state_id: single_select_optional('MasterMainState'), // ✅ Single-Selection -> MasterMainState
  currency_id: single_select_optional('MasterMainCurrency'), // ✅ Single-Selection -> MasterMainCurrency
  language_id: single_select_optional('MasterMainLanguage'), // ✅ Single-Selection -> MasterMainLanguage
  time_zone_id: single_select_mandatory('MasterMainTimeZone'), // ✅ Single-Selection -> MasterMainTimeZone
  date_format_id: single_select_optional('MasterMainDateFormat'), // ✅ Single-Selection -> MasterMainDateFormat
  distance_unit_id: single_select_optional('MasterMainUnitDistance'), // ✅ Single-Selection -> MasterMainUnitDistance
  mileage_unit_id: single_select_optional('MasterMainUnitMileage'), // ✅ Single-Selection -> MasterMainUnitMileage
  volume_unit_id: single_select_optional('MasterMainUnitVolume'), // ✅ Single-Selection -> MasterMainUnitVolume
});
export type UserOrganisationDTO = z.infer<typeof UserOrganisationSchema>;

// ✅ Organisation Query Schema
export const UserOrganisationQuerySchema = BaseQuerySchema.extend({
  industry_ids: multi_select_optional('MasterMainIndustry'), // ✅ Multi-Selection -> MasterMainIndustry
  country_ids: multi_select_optional('MasterMainCountry'), // ✅ Multi-Selection -> MasterMainCountry
  state_ids: multi_select_optional('MasterMainState'), // ✅ Multi-Selection -> MasterMainState
  currency_ids: multi_select_optional('MasterMainCurrency'), // ✅ Multi-Selection -> MasterMainCurrency
  language_ids: multi_select_optional('MasterMainLanguage'), // ✅ Multi-Selection -> MasterMainLanguage
  time_zone_ids: multi_select_optional('MasterMainTimeZone'), // ✅ Multi-Selection -> MasterMainTimeZone
  date_format_ids: multi_select_optional('MasterMainDateFormat'), // ✅ Multi-Selection -> MasterMainDateFormat
  fleet_size: enumArrayOptional(
    'Fleet Size',
    FleetSize,
    getAllEnums(FleetSize),
  ),
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
});
export type UserOrganisationQueryDTO = z.infer<
  typeof UserOrganisationQuerySchema
>;

// Convert existing data to a payload structure
export const toUserOrganisationPayload = (
  organisation: UserOrganisation
): UserOrganisationDTO => ({
  organisation_name: organisation.organisation_name,
  organisation_email: organisation.organisation_email ?? '',
  organisation_mobile: organisation.organisation_mobile ?? '',

  organisation_code: organisation.organisation_code ?? '',
  organisation_utrack_id: organisation.organisation_utrack_id ?? '',

  fleet_size: organisation.fleet_size,

  logo_url: organisation.logo_url ?? '',
  logo_key: organisation.logo_key ?? '',
  logo_name: organisation.logo_name ?? '',

  status: organisation.status,

  company_cin: organisation.company_cin ?? '',
  company_tin_gstin: organisation.company_tin_gstin ?? '',

  // Billing Address
  billing_address_line1: organisation.billing_address_line1 ?? '',
  billing_address_line2: organisation.billing_address_line2 ?? '',
  billing_locality_landmark: organisation.billing_locality_landmark ?? '',
  billing_neighborhood: organisation.billing_neighborhood ?? '',
  billing_town_city: organisation.billing_town_city ?? '',
  billing_district_county: organisation.billing_district_county ?? '',
  billing_state_province_region: organisation.billing_state_province_region ?? '',
  billing_postal_code: organisation.billing_postal_code ?? '',
  billing_country: organisation.billing_country ?? '',
  billing_country_code: organisation.billing_country_code ?? '',

  // Company Address
  address_line1: organisation.address_line1 ?? '',
  address_line2: organisation.address_line2 ?? '',
  locality_landmark: organisation.locality_landmark ?? '',
  neighborhood: organisation.neighborhood ?? '',
  town_city: organisation.town_city ?? '',
  district_county: organisation.district_county ?? '',
  state_province_region: organisation.state_province_region ?? '',
  postal_code: organisation.postal_code ?? '',
  country: organisation.country ?? '',
  country_code: organisation.country_code ?? '',

  industry_id: organisation.industry_id,
  country_id: organisation.country_id,
  state_id: organisation.state_id ?? '',
  currency_id: organisation.currency_id ?? '',

  language_id: organisation.language_id ?? '',
  time_zone_id: organisation.time_zone_id ?? '',
  date_format_id: organisation.date_format_id ?? '',

  distance_unit_id: organisation.distance_unit_id ?? '',
  mileage_unit_id: organisation.mileage_unit_id ?? '',
  volume_unit_id: organisation.volume_unit_id ?? '',
});

// Generate a new payload with default values
export const newUserOrganisationPayload = (): UserOrganisationDTO => ({
  organisation_name: '',
  organisation_email: '',
  organisation_mobile: '',

  organisation_code: '',
  organisation_utrack_id: '',

  fleet_size: FleetSize.Fleet_1_to_50_Vehicles,

  logo_url: '',
  logo_key: '',
  logo_name: '',

  status: Status.Active,

  company_cin: '',
  company_tin_gstin: '',

  // Billing Address
  billing_address_line1: '',
  billing_address_line2: '',
  billing_locality_landmark: '',
  billing_neighborhood: '',
  billing_town_city: '',
  billing_district_county: '',
  billing_state_province_region: '',
  billing_postal_code: '',
  billing_country: '',
  billing_country_code: '',

  // Company Address
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

  industry_id: '',
  country_id: '',
  state_id: '',
  currency_id: '',

  language_id: '',
  time_zone_id: '',
  date_format_id: '',

  distance_unit_id: '',
  mileage_unit_id: '',
  volume_unit_id: '',
});

// API Methods
export const findUserOrganisations = async (
  data: UserOrganisationQueryDTO
): Promise<FBR<UserOrganisation[]>> => {
  return apiPost<FBR<UserOrganisation[]>, UserOrganisationQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createUserOrganisation = async (
  data: UserOrganisationDTO
): Promise<SBR> => {
  return apiPost<SBR, UserOrganisationDTO>(ENDPOINTS.create, data);
};

export const updateUserOrganisation = async (
  id: string,
  data: UserOrganisationDTO
): Promise<SBR> => {
  return apiPatch<SBR, UserOrganisationDTO>(ENDPOINTS.update(id), data);
};

export const deleteUserOrganisation = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getUserOrganisationCache = async (): Promise<
  FBR<UserOrganisation[]>
> => {
  return apiGet<FBR<UserOrganisation[]>>(ENDPOINTS.cache());
};

export const getUserOrganisationCacheSimple = async (): Promise<
  FBR<UserOrganisationSimple[]>
> => {
  return apiGet<FBR<UserOrganisationSimple[]>>(ENDPOINTS.cache_simple());
};

// Generate presigned URL for file uploads
export const getUserOrganisationPresignedUrl = async (
  fileName: string
): Promise<SBR> => {
  return apiGet<SBR>(ENDPOINTS.presignedUrl(fileName));
};
