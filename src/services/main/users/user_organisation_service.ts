// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  single_select_mandatory,
  single_select_optional,
  multi_select_optional,
  enumMandatory,
  doubleOptionalLatLng,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status, FleetSize } from 'core/Enums';

// Other Models
import { MasterMainIndustry } from 'services/master/main/master_main_industry_service';
import { MasterMainCountry } from 'services/master/main/master_main_country_service';
import { MasterMainState } from 'services/master/main/master_main_state_service';
import { MasterMainTimeZone } from 'services/master/main/master_main_timezone_service';
import { MasterMainCurrency } from 'services/master/main/master_main_currency_service';
import { MasterMainDateFormat } from 'services/master/main/master_main_date_format_service';
import { MasterMainUnitDistance } from 'services/master/main/master_main_unit_distance_service';
import { MasterMainUnitMileage } from 'services/master/main/master_main_unit_mileage_service';
import { MasterMainUnitVolume } from 'services/master/main/master_main_unit_volume_service';

// Other Models Childs
import { MasterVehicle } from 'services/main/vehicle/master_vehicle_service';
import { MasterDriver } from 'services/main/drivers/master_driver_service';
import { MasterDevice } from 'services/main/devices/master_device_service';
import { User } from 'services/main/users/user_service';

import { OrganisationBranch } from 'services/master/organisation/organisation_branch_service';
import { OrganisationColor } from 'services/master/organisation/organisation_color_service';
import { OrganisationGroup } from 'services/master/organisation/organisation_group_service';
import { OrganisationSubCompany } from 'services/master/organisation/organisation_sub_company_service';
import { OrganisationTag } from 'services/master/organisation/organisation_tag_service';

import { MasterExpenseName } from 'services/master/expense/master_expense_name_service';
import { MasterExpenseType } from 'services/master/expense/master_expense_type_service';

import { MasterUserRole } from 'services/master/user/master_user_role_service';
import { MasterUserStatus } from 'services/master/user/master_user_status_service';

import { MasterVehicleFuelType } from 'services/master/vehicle/master_vehicle_fuel_type_service';
import { MasterVehicleOwnershipType } from 'services/master/vehicle/master_vehicle_ownership_type_service';
import { MasterVehicleMake } from 'services/master/vehicle/master_vehicle_make_service';
import { MasterVehicleModel } from 'services/master/vehicle/master_vehicle_model_service';
import { MasterVehicleSubModel } from 'services/master/vehicle/master_vehicle_sub_model_service';
import { MasterVehicleStatusType } from 'services/master/vehicle/master_vehicle_status_type_service';
import { MasterVehicleType } from 'services/master/vehicle/master_vehicle_type_service';

import { MasterTyreGrade } from 'services/master/tyre/master_tyre_grade_service';
import { MasterTyreMake } from 'services/master/tyre/master_tyre_make_service';
import { MasterTyreModel } from 'services/master/tyre/master_tyre_model_service';

import { MasterFleetIncidentType } from 'services/master/fleet/master_fleet_incident_type_service';
import { MasterFleetIncidentStatus } from 'services/master/fleet/master_fleet_incident_status_service';
import { MasterFleetIncidentSeverity } from 'services/master/fleet/master_fleet_incident_severity_service';
import { MasterFleetInsuranceClaimStatus } from 'services/master/fleet/master_fleet_insurance_claim_status_service';
import { MasterFleetServiceTask } from 'services/master/fleet/master_fleet_service_task_service';

import { MasterTripPartyType } from 'services/master/trip/master_trip_party_type_service';

import { MasterVendorType } from 'services/master/expense/master_vendor_type_service';

import { MasterSparePartCategory } from 'services/master/spare_part/master_spare_part_category_service';
import { MasterSparePartSubCategory } from 'services/master/spare_part/master_spare_part_sub_category_service';
import { MasterSparePartUnit } from 'services/master/spare_part/master_spare_part_unit_service';

const URL = 'user/organisation';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (): string => `${URL}/cache`,
  cache_simple: (): string => `${URL}/cache_simple`,
  presignedUrl: (fileName: string): string =>
    `${URL}/presigned_url/${fileName}`,
};

// UserOrganisation Interface
export interface UserOrganisation extends Record<string, unknown> {
  // Primary Fields
  organisation_id: string;
  organisation_name: string; // Min: 3, Max: 100
  organisation_email: string; // Min: 3, Max: 100
  organisation_mobile?: string; // Min: 0, Max: 20

  fleet_size: FleetSize;

  db_instance: string; // Min: 3, Max: 100
  db_index: string; // Min: 3, Max: 100

  organisation_logo_url?: string; // Min: 0, Max: 300
  organisation_logo_key?: string; // Min: 0, Max: 300

  // Company Address
  address?: string;
  locality?: string;
  city_district_town?: string;
  state?: string;
  zip_code?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;

  // Billing Information
  company_cin?: string;
  company_tin_gstin?: string;
  billing_address?: string;
  billing_locality?: string;
  billing_city_district_town?: string;
  billing_state?: string;
  billing_zip_code?: string;
  billing_landmark?: string;
  billing_latitude?: number;
  billing_longitude?: number;

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

  time_zone_id?: string;
  MasterMainTimeZone?: MasterMainTimeZone;

  currency_id?: string;
  MasterMainCurrency?: MasterMainCurrency;

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
  // VehicleOdometerHistory: VehicleOdometerHistory[]
  // VehicleDocument:        VehicleDocument[]
  // VehicleDocumentFile:    VehicleDocumentFile[]

  // Child - Master
  OrganisationBranch: OrganisationBranch[];
  OrganisationColor: OrganisationColor[];
  OrganisationGroup: OrganisationGroup[];
  OrganisationSubCompany: OrganisationSubCompany[];
  OrganisationTag: OrganisationTag[];

  MasterExpenseName: MasterExpenseName[];
  MasterExpenseType: MasterExpenseType[];
  MasterVendorType: MasterVendorType[];

  MasterUserRole: MasterUserRole[];
  MasterUserStatus: MasterUserStatus[];

  MasterVehicleFuelType: MasterVehicleFuelType[];
  MasterVehicleOwnershipType: MasterVehicleOwnershipType[];
  MasterVehicleModel: MasterVehicleModel[];
  MasterVehicleMake: MasterVehicleMake[];
  MasterVehicleStatusType: MasterVehicleStatusType[];
  MasterVehicleSubModel: MasterVehicleSubModel[];
  MasterVehicleType: MasterVehicleType[];

  MasterTyreGrade: MasterTyreGrade[];
  MasterTyreMake: MasterTyreMake[];
  MasterTyreModel: MasterTyreModel[];

  MasterFleetIncidentType: MasterFleetIncidentType[];
  MasterFleetIncidentStatus: MasterFleetIncidentStatus[];
  MasterFleetIncidentSeverity: MasterFleetIncidentSeverity[];
  MasterFleetInsuranceClaimStatus: MasterFleetInsuranceClaimStatus[];
  MasterFleetServiceTask: MasterFleetServiceTask[];

  MasterTripPartyType: MasterTripPartyType[];

  MasterSparePartCategory: MasterSparePartCategory[];
  MasterSparePartSubCategory: MasterSparePartSubCategory[];
  MasterSparePartUnit: MasterSparePartUnit[];

  // Child - Fleet
  // FleetFuelRefills  FleetFuelRefills[]
  // FleetFuelRemovals FleetFuelRemovals[]

  // VehicleIncident             FleetIncidentManagement[]
  // FleetIncidentManagementCost FleetIncidentManagementCost[]
  // IncidentManagementFile      FleetIncidentManagementFile[]

  // InspectionTemplate             FleetInspectionTemplate[]
  // InspectionSchedule             FleetInspectionSchedule[]
  // InspectionScheduleTracking     FleetInspectionScheduleTracking[]
  // Inspection                     FleetInspection[]
  // FleetInspectionFile            FleetInspectionFile[]
  // FleetInspectionScheduleVehicle FleetInspectionScheduleVehicle[]

  // VehicleIssues            FleetIssueManagement[]
  // FleetIssueManagementFile FleetIssueManagementFile[]

  // FleetReminders FleetReminders[]

  // FleetServiceSchedule    FleetServiceSchedule[]
  // FleetServiceJobCard     FleetServiceJobCard[]
  // FleetServiceJobCardFile FleetServiceJobCardFile[]

  // FleetSpareParts                     FleetSpareParts[]
  // FleetSparePartsInventory            FleetSparePartsInventory[]
  // FleetSparePartsPurchaseOrders       FleetSparePartsPurchaseOrders[]
  // FleetSparePartsPurchaseOrderDetails FleetSparePartsPurchaseOrderDetails[]
  // FleetSparePartsUsage                FleetSparePartsUsage[]
  // FleetSparePartsUsageDetails         FleetSparePartsUsageDetails[]

  // FleetTyreInventory                  FleetTyreInventory[]
  // FleetAxleTemplate                   FleetAxleTemplate[]
  // FleetAxlePosition                   FleetAxlePosition[]
  // FleetTyrePosition                   FleetTyrePosition[]
  // FleetTyreUsageHistory               FleetTyreUsageHistory[]
  // FleetTyreInspectionSchedule         FleetTyreInspectionSchedule[]
  // FleetTyreInspectionScheduleTracking FleetTyreInspectionScheduleTracking[]
  // FleetTyreInspection                 FleetTyreInspection[]
  // FleetTyreRetreading                 FleetTyreRetreading[]
  // FleetTyreDamageRepair               FleetTyreDamageRepair[]
  // FleetTyreRotation                   FleetTyreRotation[]
  // FleetTyreRotationDetails            FleetTyreRotationDetails[]

  // FleetMasterVendor         FleetVendor[]
  // FleetVendorContactPersons FleetVendorContactPersons[]
  // FleetVendorDocuments      FleetVendorDocuments[]

  // FleetWorkshop FleetWorkshop[]

  // FleetTripParty              FleetTripParty[]
  // FleetTripPartyGroup         FleetTripPartyGroup[]
  // FleetTripPartyContactPerson FleetTripPartyContactPerson[]

  // Child - GPS
  // GPSLiveTrackShareLink                 GPSLiveTrackShareLink[]
  // GPSLiveTrackShareLinkNotifications    GPSLiveTrackShareLinkNotifications[]
  // GPSTrackHistoryShareLink              GPSTrackHistoryShareLink[]
  // GPSTrackHistoryShareLinkNotifications GPSTrackHistoryShareLinkNotifications[]
  // GPSLockRelayLog                       GPSLockRelayLog[]
  // GPSLockDigitalDoorLog                 GPSLockDigitalDoorLog[]
  // GPSGeofenceData                       GPSGeofenceData[]
  // GPSGeofenceTransaction                GPSGeofenceTransaction[]
  // GPSGeofenceTransactionSummary         GPSGeofenceTransactionSummary[]
  // TripGeofenceToGeofence                TripGeofenceToGeofence[]
  // GPSFuelVehicleDailySummary            GPSFuelVehicleDailySummary[]
  // GPSFuelVehicleRefill                  GPSFuelVehicleRefill[]
  // GPSFuelVehicleRemoval                 GPSFuelVehicleRemoval[]

  // Child - Trip
  // Trip Trip[]

  // Child - Account
  // BookMark BookMark[]
  // Alert Alert[]
  // Notification Notification[]
  // Ticket Ticket[]
  // TicketFile TicketFile[]
  // FasttagDetails FasttagDetails[]
  // EWayBillDetails EWayBillDetails[]
  // UserLoginPush UserLoginPush[]

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
  db_in: string;

  o_logo?: string;
}

// ✅ Create Organisation Create/Update Schema
export const UserOrganisationSchema = z.object({
  organisation_name: stringMandatory('Organisation Name', 3, 100),
  organisation_email: stringMandatory('Organisation Email', 3, 100),
  organisation_mobile: stringOptional('Organisation Mobile', 0, 20),

  fleet_size: enumMandatory(
    'Fleet Size',
    FleetSize,
    FleetSize.Fleet_1_to_50_Vehicles
  ),

  organisation_logo_url: stringOptional('Organisation Logo URL', 0, 300),
  organisation_logo_key: stringOptional('Organisation Logo Key', 0, 300),

  company_cin: stringOptional('Company CIN', 0, 50),
  company_tin_gstin: stringOptional('Company TIN/GSTIN', 0, 50),
  billing_address: stringOptional('Billing Address', 0, 100),
  billing_locality: stringOptional('Billing Locality', 0, 100),
  billing_city_district_town: stringOptional(
    'Billing City/District/Town',
    0,
    100
  ),
  billing_state: stringOptional('Billing State', 0, 100),
  billing_zip_code: stringOptional('Billing Zip Code', 0, 10),
  billing_landmark: stringOptional('Billing Landmark', 0, 100),
  billing_latitude: doubleOptionalLatLng('Billing Latitude'),
  billing_longitude: doubleOptionalLatLng('Billing Longitude'),

  address: stringOptional('Address', 0, 100),
  locality: stringOptional('Locality', 0, 100),
  city_district_town: stringOptional('City/District/Town', 0, 100),
  state: stringOptional('State', 0, 100),
  zip_code: stringOptional('Zip Code', 0, 10),
  landmark: stringOptional('Landmark', 0, 100),
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),

  status: enumMandatory('Status', Status, Status.Active),

  industry_id: single_select_mandatory('Industry ID'), // Single selection -> MasterMainIndustry
  country_id: single_select_mandatory('Country ID'), // Single selection -> MasterMainCountry
  state_id: single_select_optional('State ID'), // Single selection -> MasterMainState
  time_zone_id: single_select_optional('Time Zone ID'), // Single selection -> MasterMainTimeZone
  currency_id: single_select_optional('Currency ID'), // Single selection -> MasterMainCurrency
  date_format_id: single_select_optional('Date Format ID'), // Single selection -> MasterMainDateFormat
  distance_unit_id: single_select_optional('Distance Unit ID'), // Single selection -> MasterMainUnitDistance
  mileage_unit_id: single_select_optional('Mileage Unit ID'), // Single selection -> MasterMainUnitMileage
  volume_unit_id: single_select_optional('Volume Unit ID'), // Single selection -> MasterMainUnitVolume
});
export type UserOrganisationDTO = z.infer<typeof UserOrganisationSchema>;

// ✅ Organisation Query Schema
export const UserOrganisationQuerySchema = BaseQuerySchema.extend({
  industry_ids: multi_select_optional('Industry IDs', 100, []), // Multi-selection -> MasterMainIndustry
  country_ids: multi_select_optional('Country IDs', 100, []), // Multi-selection -> MasterMainCountry
  state_ids: multi_select_optional('State IDs', 100, []), // Multi-selection -> MasterMainState
  time_zone_ids: multi_select_optional('Time Zone IDs', 100, []), // Multi-selection -> MasterMainTimeZone
  currency_ids: multi_select_optional('Currency IDs', 100, []), // Multi-selection -> MasterMainCurrency
  date_format_ids: multi_select_optional('Date Format IDs', 100, []), // Multi-selection -> MasterMainDateFormat
  distance_unit_ids: multi_select_optional('Distance Unit IDs', 100, []), // Multi-selection -> MasterMainUnitDistance
  mileage_unit_ids: multi_select_optional('Mileage Unit IDs', 100, []), // Multi-selection -> MasterMainUnitMileage
  volume_unit_ids: multi_select_optional('Volume Unit IDs', 100, []), // Multi-selection -> MasterMainUnitVolume
  organisation_ids: multi_select_optional('Organisation IDs', 100, []), // Multi-selection -> UserOrganisation
});
export type UserOrganisationQueryDTO = z.infer<
  typeof UserOrganisationQuerySchema
>;

// Convert existing data to a payload structure
export const toUserOrganisationPayload = (
  organisation: UserOrganisation
): UserOrganisationDTO => ({
  organisation_name: organisation.organisation_name,
  organisation_email: organisation.organisation_email,
  organisation_mobile: organisation.organisation_mobile ?? '',

  fleet_size: organisation.fleet_size,

  organisation_logo_url: organisation.organisation_logo_url ?? '',
  organisation_logo_key: organisation.organisation_logo_key ?? '',

  status: organisation.status,

  industry_id: organisation.industry_id,
  country_id: organisation.country_id,
  state_id: organisation.state_id ?? '',
  time_zone_id: organisation.time_zone_id ?? '',
  currency_id: organisation.currency_id ?? '',
  date_format_id: organisation.date_format_id ?? '',
  distance_unit_id: organisation.distance_unit_id ?? '',
  mileage_unit_id: organisation.mileage_unit_id ?? '',
  volume_unit_id: organisation.volume_unit_id ?? '',

  // Billing Information
  company_cin: organisation.company_cin ?? '',
  company_tin_gstin: organisation.company_tin_gstin ?? '',
  billing_address: organisation.billing_address ?? '',
  billing_locality: organisation.billing_locality ?? '',
  billing_city_district_town: organisation.billing_city_district_town ?? '',
  billing_state: organisation.billing_state ?? '',
  billing_zip_code: organisation.billing_zip_code ?? '',
  billing_landmark: organisation.billing_landmark ?? '',
  billing_latitude: organisation.billing_latitude ?? undefined,
  billing_longitude: organisation.billing_longitude ?? undefined,

  // Company Address
  address: organisation.address ?? '',
  locality: organisation.locality ?? '',
  city_district_town: organisation.city_district_town ?? '',
  state: organisation.state ?? '',
  zip_code: organisation.zip_code ?? '',
  landmark: organisation.landmark ?? '',
  latitude: organisation.latitude ?? undefined,
  longitude: organisation.longitude ?? undefined,
});

// Generate a new payload with default values
export const newUserOrganisationPayload = (): UserOrganisationDTO => ({
  organisation_name: '',
  organisation_email: '',
  organisation_mobile: '',

  fleet_size: FleetSize.Fleet_1_to_50_Vehicles,

  organisation_logo_url: '',
  organisation_logo_key: '',

  status: Status.Active,

  industry_id: '',
  country_id: '',
  state_id: '',
  time_zone_id: '',
  currency_id: '',
  date_format_id: '',
  distance_unit_id: '',
  mileage_unit_id: '',
  volume_unit_id: '',

  // Billing Information
  company_cin: '',
  company_tin_gstin: '',
  billing_address: '',
  billing_locality: '',
  billing_city_district_town: '',
  billing_state: '',
  billing_zip_code: '',
  billing_landmark: '',
  billing_latitude: undefined,
  billing_longitude: undefined,

  // Company Address
  address: '',
  locality: '',
  city_district_town: '',
  state: '',
  zip_code: '',
  landmark: '',
  latitude: undefined,
  longitude: undefined,
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
