// Axios
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { apiGet } from '../../../core/apiCall';
import { BR, SBR } from '../../../core/BaseResponse';
import { MasterVehicleType } from '../vehicle/master_vehicle_type_service';
import { MasterVehicleMake } from '../vehicle/master_vehicle_make_service';
import { MasterVehicleStatusType } from '../vehicle/master_vehicle_status_type_service';
import { MasterVehicleOwnershipType } from '../vehicle/master_vehicle_ownership_type_service';
import { MasterVehicleAssociatedTo } from '../vehicle/master_vehicle_associated_to_service';
import { MasterVehicleFuelType } from '../vehicle/master_vehicle_fuel_type_service';
import { MasterVehicleFuelUnit } from '../vehicle/master_vehicle_fuel_unit_service';
import { MasterVehicleFuelRemovalReason } from '../vehicle/master_vehicle_fuel_removal_reason_service';
import { MasterVehicleDocumentType } from '../vehicle/master_vehicle_document_type_service';
import { MasterUserStatus } from '../user/master_user_status_service';
import { MasterUserRole } from '../user/master_user_role_service';
import { MasterTyreMake } from '../tyre/master_tyre_make_service';
import { MasterTyreGrade } from '../tyre/master_tyre_grade_service';
import { MasterTripPartyType } from '../trip/master_trip_party_type_service';
import { MasterSparePartCategory } from '../spare_part/master_spare_part_category_service';
import { MasterSparePartUnit } from '../spare_part/master_spare_part_unit_service';
import { OrganisationSubCompany } from '../organisation/organisation_sub_company_service';
import { OrganisationBranch } from '../organisation/organisation_branch_service';
import { OrganisationColor } from '../organisation/organisation_color_service';
import { OrganisationTag } from '../organisation/organisation_tag_service';
import { OrganisationGroup } from '../organisation/organisation_group_service';
import { MasterMainIndustry } from '../main/master_main_industry_service';
import { MasterMainCountry } from '../main/master_main_country_service';
import { MasterMainDateFormat } from '../main/master_main_date_format_service';
import { MasterMainLanguage } from '../main/master_main_language_service';
import { MasterMainUnitDistance } from '../main/master_main_unit_distance_service';
import { MasterMainUnitMileage } from '../main/master_main_unit_mileage_service';
import { MasterMainUnitVolume } from '../main/master_main_unit_volume_service';
import { MasterMainFasttagBank } from '../main/master_main_fasttag_bank_service';
import { MasterMainEwayBillProvider } from '../main/master_main_eway_bill_provider_service';
import { MasterMainSimProvider } from '../main/master_main_sim_provider_service';
import { MasterFleetIncidentType } from '../fleet/master_fleet_incident_type_service';
import { MasterFleetIncidentStatus } from '../fleet/master_fleet_incident_status_service';
import { MasterFleetIncidentSeverity } from '../fleet/master_fleet_incident_severity_service';
import { MasterFleetInsuranceClaimStatus } from '../fleet/master_fleet_insurance_claim_status_service';
import { MasterFleetServiceTask } from '../fleet/master_fleet_service_task_service';
import { MasterExpenseName } from '../expense/master_expense_name_service';
import { MasterExpenseType } from '../expense/master_expense_type_service';
import { MasterVendorType } from '../expense/master_vendor_type_service';
import { MasterVendorTag } from '../expense/master_vendor_tag_service';
import { MasterVendorDocumentType } from '../expense/master_vendor_document_type_service';
import { MasterFuelCompany } from '../expense/master_fuel_company_service';
import { MasterClass } from '../bus/master_class_service';
import { MasterProgram } from '../bus/master_program_service';
import { MasterSemester } from '../bus/master_semester_service';
import { MasterRelationship } from '../bus/master_relationship_service';
import { MasterSection } from '../bus/master_section_service';
import { MasterStream } from '../bus/master_stream_service';
import { MasterYear } from '../bus/master_year_service';

const URL = 'master';

const ENDPOINTS = {
  reset_cache: `${URL}/reset_cache`,

  // vehicle cache
  vehicle_cache: (id: string): string => `${URL}/vehicle/cache/${id}`,
  vehicle_cache_count: (id: string): string => `${URL}/vehicle/cache_count/${id}`,
  vehicle_cache_child: (id: string): string => `${URL}/vehicle/cache_child/${id}`,

  // user cache
  user_cache: (id: string): string => `${URL}/user/cache/${id}`,
  user_cache_count: (id: string): string => `${URL}/user/cache_count/${id}`,

  // tyre cache
  tyre_cache: (id: string): string => `${URL}/tyre/cache/${id}`,
  tyre_cache_count: (id: string): string => `${URL}/tyre/cache_count/${id}`,

  // trip cache
  trip_cache: (id: string): string => `${URL}/trip/cache/${id}`,

  // spare_part cache
  spare_part_cache: (id: string): string => `${URL}/spare_parts/cache/${id}`,
  spare_part_cache_count: (id: string): string => `${URL}/spare_parts/cache_count/${id}`,

  // organisation cache
  organisation_cache: (id: string): string => `${URL}/organisation/cache/${id}`,
  organisation_cache_count: (id: string): string => `${URL}/organisation/cache_count/${id}`,
  organisation_cache_child: (id: string): string => `${URL}/organisation/cache_child/${id}`,

  // main cache
  main_cache: (id: string): string => `${URL}/main/cache/${id}`,

  // fleet cache
  fleet_cache: (id: string): string => `${URL}/fleet/cache/${id}`,

  // expense cache
  expense_cache: (id: string): string => `${URL}/expense/cache/${id}`,

  // bus cache
  bus_cache: (id: string): string => `${URL}/bus/cache/${id}`,
  bus_cache_count: (id: string): string => `${URL}/bus/cache_count/${id}`,
};

// VehicleAllCache Interface
export interface VehicleAllCache extends Record<string, unknown> {
  MasterVehicleType: MasterVehicleType[];
  MasterVehicleMake: MasterVehicleMake[];
  MasterVehicleStatusType: MasterVehicleStatusType[];
  MasterVehicleOwnershipType: MasterVehicleOwnershipType[];
  MasterVehicleAssociatedTo: MasterVehicleAssociatedTo[];
  MasterVehicleFuelType: MasterVehicleFuelType[];
  MasterVehicleFuelUnit: MasterVehicleFuelUnit[];
  MasterVehicleFuelRemovalReason: MasterVehicleFuelRemovalReason[];
  MasterVehicleDocumentType: MasterVehicleDocumentType[];
}

// UserAllCache Interface
export interface UserAllCache extends Record<string, unknown> {
  MasterUserRole: MasterUserRole[];
  MasterUserStatus: MasterUserStatus[];
}

// TyreAllCache Interface
export interface TyreAllCache extends Record<string, unknown> {
  MasterTyreMake: MasterTyreMake[];
  MasterTyreGrade: MasterTyreGrade[];
}

// TripAllCache Interface
export interface TripAllCache extends Record<string, unknown> {
  MasterTripPartyType: MasterTripPartyType[];
}

// SparePartAllCache Interface
export interface SparePartAllCache extends Record<string, unknown> {
  MasterSparePartCategory: MasterSparePartCategory[];
  MasterSparePartUnit: MasterSparePartUnit[];
}

// OrganisationAllCache Interface
export interface OrganisationAllCache extends Record<string, unknown> {
  OrganisationSubCompany: OrganisationSubCompany[];
  OrganisationBranch: OrganisationBranch[];
  OrganisationColor: OrganisationColor[];
  OrganisationTag: OrganisationTag[];
  OrganisationGroup: OrganisationGroup[];
}

// MainAllCache Interface
export interface MainAllCache extends Record<string, unknown> {
  MasterMainIndustry: MasterMainIndustry[];
  MasterMainCountry: MasterMainCountry[];
  MasterMainDateFormat: MasterMainDateFormat[];
  MasterMainLanguage: MasterMainLanguage[];
  MasterMainUnitDistance: MasterMainUnitDistance[];
  MasterMainUnitMileage: MasterMainUnitMileage[];
  MasterMainUnitVolume: MasterMainUnitVolume[];
  MasterMainFasttagBank: MasterMainFasttagBank[];
  MasterMainEwayBillProvider: MasterMainEwayBillProvider[];
  MasterMainSimProvider: MasterMainSimProvider[];
}

// FleetAllCache Interface
export interface FleetAllCache extends Record<string, unknown> {
  MasterFleetIncidentType: MasterFleetIncidentType[];
  MasterFleetIncidentStatus: MasterFleetIncidentStatus[];
  MasterFleetIncidentSeverity: MasterFleetIncidentSeverity[];
  MasterFleetInsuranceClaimStatus: MasterFleetInsuranceClaimStatus[];
  MasterFleetServiceTask: MasterFleetServiceTask[];
}

// ExpenseAllCache Interface
export interface ExpenseAllCache extends Record<string, unknown> {
  MasterExpenseName: MasterExpenseName[];
  MasterExpenseType: MasterExpenseType[];
  MasterVendorType: MasterVendorType[];
  MasterVendorTag: MasterVendorTag[];
  MasterVendorDocumentType: MasterVendorDocumentType[];
  MasterFuelCompany: MasterFuelCompany[];
}

// BusAllCache Interface
export interface BusAllCache extends Record<string, unknown> {
  MasterClass: MasterClass[];
  MasterProgram: MasterProgram[];
  MasterSemester: MasterSemester[];
  MasterRelationShip: MasterRelationship[];
  MasterSection: MasterSection[];
  MasterStream: MasterStream[];
  MasterYear: MasterYear[];
}

// Cache APIs
export const reset_cache_master = async (): Promise<SBR> => {
  return apiGet<SBR>(ENDPOINTS.reset_cache);
};

// Vehicle Cache APIs
export const vehicle_cache = async (id: string): Promise<BR<VehicleAllCache>> => {
  return apiGet<BR<VehicleAllCache>>(ENDPOINTS.vehicle_cache(id));
};

export const vehicle_cache_count = async (id: string): Promise<BR<VehicleAllCache>> => {
  return apiGet<BR<VehicleAllCache>>(ENDPOINTS.vehicle_cache_count(id));
};

export const vehicle_cache_child = async (id: string): Promise<BR<VehicleAllCache>> => {
  return apiGet<BR<VehicleAllCache>>(ENDPOINTS.vehicle_cache_child(id));
};

// User Cache APIs
export const user_cache = async (id: string): Promise<BR<UserAllCache>> => {
  return apiGet<BR<UserAllCache>>(ENDPOINTS.user_cache(id));
};

export const user_cache_count = async (id: string): Promise<BR<UserAllCache>> => {
  return apiGet<BR<UserAllCache>>(ENDPOINTS.user_cache_count(id));
};

// Tyre Cache APIs
export const tyre_cache = async (id: string): Promise<BR<TyreAllCache>> => {
  return apiGet<BR<TyreAllCache>>(ENDPOINTS.tyre_cache(id));
};

export const tyre_cache_count = async (id: string): Promise<BR<TyreAllCache>> => {
  return apiGet<BR<TyreAllCache>>(ENDPOINTS.tyre_cache_count(id));
};

// Trip Cache APIs
export const trip_cache = async (id: string): Promise<BR<TripAllCache>> => {
  return apiGet<BR<TripAllCache>>(ENDPOINTS.trip_cache(id));
};

// SparePart Cache APIs
export const spare_part_cache = async (id: string): Promise<BR<SparePartAllCache>> => {
  return apiGet<BR<SparePartAllCache>>(ENDPOINTS.spare_part_cache(id));
};

export const spare_part_cache_count = async (id: string): Promise<BR<SparePartAllCache>> => {
  return apiGet<BR<SparePartAllCache>>(ENDPOINTS.spare_part_cache_count(id));
};

// Organisation Cache APIs
export const organisation_cache = async (id: string): Promise<BR<OrganisationAllCache>> => {
  return apiGet<BR<OrganisationAllCache>>(ENDPOINTS.organisation_cache(id));
};

export const organisation_cache_count = async (id: string): Promise<BR<OrganisationAllCache>> => {
  return apiGet<BR<OrganisationAllCache>>(ENDPOINTS.organisation_cache_count(id));
};

export const organisation_cache_child = async (id: string): Promise<BR<OrganisationAllCache>> => {
  return apiGet<BR<OrganisationAllCache>>(ENDPOINTS.organisation_cache_child(id));
};

// Main Cache APIs
export const main_cache = async (id: string): Promise<BR<MainAllCache>> => {
  return apiGet<BR<MainAllCache>>(ENDPOINTS.main_cache(id));
};

// Fleet Cache APIs
export const fleet_cache = async (id: string): Promise<BR<FleetAllCache>> => {
  return apiGet<BR<FleetAllCache>>(ENDPOINTS.fleet_cache(id));
};

// Expense Cache APIs
export const expense_cache = async (id: string): Promise<BR<ExpenseAllCache>> => {
  return apiGet<BR<ExpenseAllCache>>(ENDPOINTS.expense_cache(id));
};

// Bus Cache APIs
export const bus_cache = async (id: string): Promise<BR<BusAllCache>> => {
  return apiGet<BR<BusAllCache>>(ENDPOINTS.bus_cache(id));
};

export const bus_cache_count = async (id: string): Promise<BR<BusAllCache>> => {
  return apiGet<BR<BusAllCache>>(ENDPOINTS.bus_cache_count(id));
};