// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

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
import { MasterMainUnitMileage } from '../../../services/master/main/master_main_unit_mileage_service';
import { MasterMainUnitVolume } from '../../../services/master/main/master_main_unit_volume_service';

// Other Models Childs
import { MasterVehicle, MasterVehicleFile, VehicleDocument, VehicleDocumentExpiry, VehicleDocumentFile, VehicleOdometerHistory } from '../../../services/main/vehicle/master_vehicle_service';
import { DriverLoginPush, MasterDriver, MasterDriverFile } from '../../../services/main/drivers/master_driver_service';
import { MasterDevice } from '../../../services/main/devices/master_device_service';
import { User, UserLoginPush } from '../../../services/main/users/user_service';

import { OrganisationBranch } from '../../../services/master/organisation/organisation_branch_service';
import { OrganisationColor } from '../../../services/master/organisation/organisation_color_service';
import { OrganisationGroup } from '../../../services/master/organisation/organisation_group_service';
import { OrganisationSubCompany } from '../../../services/master/organisation/organisation_sub_company_service';
import { OrganisationTag } from '../../../services/master/organisation/organisation_tag_service';
import { OrganisationCalendar } from 'src/services/fleet/bus_mangement/calender';

import { BookMark } from 'src/services/account/bookmark_service';
import { OrganisationNotificationPreference } from 'src/services/account/notification_preferences.service';
import { OrganisationReportPreference, OrganisationReportAutomationMail } from 'src/services/account/report_preferences.service';
import { Ticket, TicketFile } from 'src/services/account/ticket_service';
import { BusStop } from 'src/services/fleet/bus_mangement/bus_stop';
import { MasterRoute, MasterRouteStop, MasterRouteStudent, MasterFixedSchedule } from 'src/services/fleet/bus_mangement/master_route';
import { OrganisationNoticeBoard } from 'src/services/fleet/bus_mangement/notice_board';
import { Student, StudentAddress, StudentGuardianLink, StudentLeaveRequest, StudentStopChangeRequest } from 'src/services/fleet/bus_mangement/student';

import { FleetFuelDailySummary } from 'src/services/fleet/fuel_management/fleet_fuel_daily_summary_service';
import { FleetFuelRefill, FleetFuelRefillFile } from 'src/services/fleet/fuel_management/fleet_fuel_refill_service';
import { FleetFuelRemoval, FleetFuelRemovalFile } from 'src/services/fleet/fuel_management/fleet_fuel_removal_service';
import { FleetIncidentManagement, FleetIncidentManagementCost, FleetIncidentManagementFile } from 'src/services/fleet/incident_management/incident_management_service';
import { FleetInspectionForm } from 'src/services/fleet/inspection_management/fleet_inspection_form_service';
import { FleetInspection, FleetInspectionFile } from 'src/services/fleet/inspection_management/fleet_inspection_management_service';
import { FleetInspectionSchedule } from 'src/services/fleet/inspection_management/fleet_inspection_schedule_service';
import { FleetIssueManagement, FleetIssueManagementComment, FleetIssueManagementFile } from 'src/services/fleet/issue_management/issue_management_service';
import { FleetServiceManagement, FleetServiceManagementFile, FleetServiceReminder } from 'src/services/fleet/service_management/fleet_service_management_service';
import { FleetVendorFuelStation } from 'src/services/fleet/vendor_management/fleet_vendor_fuel_station';
import { FleetVendor, FleetVendorAddress, FleetVendorBankAccount, FleetVendorContactPersons, FleetVendorReview, FleetVendorDocument, FleetVendorDocumentFile } from 'src/services/fleet/vendor_management/fleet_vendor_service';
import { FleetVendorServiceCenter } from 'src/services/fleet/vendor_management/fleet_vendor_service_center';

import { MasterFleetIncidentSeverity } from 'src/services/master/fleet/master_fleet_incident_severity_service';
import { MasterFleetIncidentStatus } from 'src/services/master/fleet/master_fleet_incident_status_service';
import { MasterFleetIncidentType } from 'src/services/master/fleet/master_fleet_incident_type_service';
import { MasterFleetInsuranceClaimStatus } from 'src/services/master/fleet/master_fleet_insurance_claim_status_service';
import { MasterFleetServiceTask } from 'src/services/master/fleet/master_fleet_service_task_service';

import { GPSGeofence } from 'src/services/gps/features/geofence/gps_geofence_service';
import { GPSGeofenceTransaction } from 'src/services/gps/features/geofence/gps_geofence_transaction_service';
import { GPSGeofenceTransactionSummary } from 'src/services/gps/features/geofence/gps_geofence_transaction_summary_service';
import { TripGeofenceToGeofence } from 'src/services/gps/features/geofence/trip_geofence_to_geofence_service';
import { GPSLiveTrackShareLink, GPSLiveTrackShareLinkNotification } from 'src/services/gps/features/gps_live_track_share_link_service';
import { GPSTrackHistoryShareLink, GPSTrackHistoryShareLinkNotification } from 'src/services/gps/features/gps_track_history_share_link_service';

import { MasterMainLanguage } from 'src/services/master/main/master_main_language_service';
import { MasterClass } from 'src/services/master/bus/master_class_service';
import { MasterProgram } from 'src/services/master/bus/master_program_service';
import { MasterRelationship } from 'src/services/master/bus/master_relationship_service';
import { MasterSection } from 'src/services/master/bus/master_section_service';
import { MasterSemester } from 'src/services/master/bus/master_semester_service';
import { MasterStream } from 'src/services/master/bus/master_stream_service';
import { MasterYear } from 'src/services/master/bus/master_year_service';
import { MasterExpenseName } from 'src/services/master/expense/master_expense_name_service';
import { MasterExpenseType } from 'src/services/master/expense/master_expense_type_service';
import { MasterFuelCompany } from 'src/services/master/expense/master_fuel_company_service';
import { MasterVendorDocumentType } from 'src/services/master/expense/master_vendor_document_type_service';
import { MasterVendorTag } from 'src/services/master/expense/master_vendor_tag_service';
import { MasterVendorType } from 'src/services/master/expense/master_vendor_type_service';

import { MasterSparePartCategory } from 'src/services/master/spare_part/master_spare_part_category_service';
import { MasterSparePartSubCategory } from 'src/services/master/spare_part/master_spare_part_sub_category_service';
import { MasterSparePartUnit } from 'src/services/master/spare_part/master_spare_part_unit_service';
import { MasterTripPartyType } from 'src/services/master/trip/master_trip_party_type_service';
import { MasterTyreGrade } from 'src/services/master/tyre/master_tyre_grade_service';
import { MasterTyreMake } from 'src/services/master/tyre/master_tyre_make_service';
import { MasterTyreModel } from 'src/services/master/tyre/master_tyre_model_service';

import { MasterUserRole } from 'src/services/master/user/master_user_role_service';
import { MasterUserStatus } from 'src/services/master/user/master_user_status_service';

import { MasterVehicleAssociatedTo } from 'src/services/master/vehicle/master_vehicle_associated_to_service';
import { MasterVehicleDocumentType } from 'src/services/master/vehicle/master_vehicle_document_type_service';
import { MasterVehicleFuelRemovalReason } from 'src/services/master/vehicle/master_vehicle_fuel_removal_reason_service';
import { MasterVehicleFuelType } from 'src/services/master/vehicle/master_vehicle_fuel_type_service';
import { MasterVehicleFuelUnit } from 'src/services/master/vehicle/master_vehicle_fuel_unit_service';
import { MasterVehicleMake } from 'src/services/master/vehicle/master_vehicle_make_service';
import { MasterVehicleModel } from 'src/services/master/vehicle/master_vehicle_model_service';
import { MasterVehicleOwnershipType } from 'src/services/master/vehicle/master_vehicle_ownership_type_service';
import { MasterVehicleStatusType } from 'src/services/master/vehicle/master_vehicle_status_type_service';
import { MasterVehicleSubModel } from 'src/services/master/vehicle/master_vehicle_sub_model_service';
import { MasterVehicleType } from 'src/services/master/vehicle/master_vehicle_type_service';
import { MasterMainUnitDistance } from 'src/services/master/main/master_main_unit_distance_service';

const URL = 'user/organisation';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  organisation_logo_presigned_url: (fileName: string): string => `${URL}/organisation_logo_presigned_url/${fileName}`,

  // File Uploads
  update_organisation_logo: (id: string): string => `${URL}/update_organisation_logo/${id}`,
  delete_organisation_logo: (id: string): string => `${URL}/delete_organisation_logo/${id}`,

  // UserOrganisation APIs
  find: `${URL}/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (): string => `${URL}/cache`,
  cache_simple: (): string => `${URL}/cache_simple`,
};

// UserOrganisation Interface
export interface UserOrganisation extends Record<string, unknown> {
  // Primary Fields
  organisation_id: string;

  // Profile Image/Logo
  logo_url?: string;
  logo_key?: string;
  logo_name?: string;

  // Main Field Details
  organisation_name: string;
  organisation_email?: string;
  organisation_mobile?: string;

  organisation_code?: string;
  organisation_utrack_id?: string;

  fleet_size: FleetSize;

  // Database Details
  db_instance: string;
  db_group: string;

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

  // Organisation Address
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

  // Relations - Parent
  industry_id: string;
  MasterMainIndustry?: MasterMainIndustry;
  industry_name?: string;

  country_id: string;
  MasterMainCountry?: MasterMainCountry;
  country_name?: string;

  state_id?: string;
  MasterMainState?: MasterMainState;
  state_name?: string;
  state_code?: string;

  currency_id?: string;
  MasterMainCurrency?: MasterMainCurrency;
  currency_name?: string;
  currency_code?: string;

  language_id?: string;
  MasterMainLanguage?: MasterMainLanguage;
  language_name?: string;
  language_code?: string;

  time_zone_id?: string;
  MasterMainTimeZone?: MasterMainTimeZone;
  time_zone_code?: string;
  time_zone_identifier?: string;

  date_format_id?: string;
  MasterMainDateFormat?: MasterMainDateFormat;
  date_format_date?: string;
  date_format_time?: string;

  distance_unit_id?: string;
  MasterMainUnitDistance?: MasterMainUnitDistance;
  distance_unit_name?: string;
  distance_unit_code?: string;

  mileage_unit_id?: string;
  MasterMainUnitMileage?: MasterMainUnitMileage;
  mileage_unit_name?: string;
  mileage_unit_code?: string;

  volume_unit_id?: string;
  MasterMainUnitVolume?: MasterMainUnitVolume;
  volume_unit_name?: string;
  volume_unit_code?: string;

  // Relations - Child
  // Child - Main
  User?: User[]
  MasterDriver?: MasterDriver[]
  MasterDriverFile?: MasterDriverFile[]
  MasterDevice?: MasterDevice[]
  // MasterDeviceFile?: MasterDeviceFile[]
  MasterVehicle?: MasterVehicle[]
  MasterVehicleFile?: MasterVehicleFile[]
  VehicleOdometerHistory?: VehicleOdometerHistory[]
  VehicleDocument?: VehicleDocument[]
  VehicleDocumentFile?: VehicleDocumentFile[]
  VehicleDocumentExpiry?: VehicleDocumentExpiry[]

  // Child - Master
  OrganisationSubCompany?: OrganisationSubCompany[]
  OrganisationBranch?: OrganisationBranch[]
  OrganisationColor?: OrganisationColor[]
  OrganisationTag?: OrganisationTag[]
  OrganisationGroup?: OrganisationGroup[]

  MasterVehicleType?: MasterVehicleType[]
  MasterVehicleMake?: MasterVehicleMake[]
  MasterVehicleModel?: MasterVehicleModel[]
  MasterVehicleSubModel?: MasterVehicleSubModel[]
  MasterVehicleStatusType?: MasterVehicleStatusType[]
  MasterVehicleOwnershipType?: MasterVehicleOwnershipType[]
  MasterVehicleAssociatedTo?: MasterVehicleAssociatedTo[]
  MasterVehicleFuelType?: MasterVehicleFuelType[]
  MasterVehicleFuelUnit?: MasterVehicleFuelUnit[]
  MasterVehicleFuelRemovalReason?: MasterVehicleFuelRemovalReason[]
  MasterVehicleDocumentType?: MasterVehicleDocumentType[]

  MasterUserRole?: MasterUserRole[]
  MasterUserStatus?: MasterUserStatus[]

  MasterFleetIncidentType?: MasterFleetIncidentType[]
  MasterFleetIncidentStatus?: MasterFleetIncidentStatus[]
  MasterFleetIncidentSeverity?: MasterFleetIncidentSeverity[]
  MasterFleetInsuranceClaimStatus?: MasterFleetInsuranceClaimStatus[]
  MasterFleetServiceTask?: MasterFleetServiceTask[]

  MasterExpenseName?: MasterExpenseName[]
  MasterExpenseType?: MasterExpenseType[]
  MasterVendorType?: MasterVendorType[]
  MasterVendorTag?: MasterVendorTag[]
  MasterVendorDocumentType?: MasterVendorDocumentType[]
  MasterFuelCompany?: MasterFuelCompany[]

  MasterTyreGrade?: MasterTyreGrade[]
  MasterTyreMake?: MasterTyreMake[]
  MasterTyreModel?: MasterTyreModel[]

  MasterTripPartyType?: MasterTripPartyType[]

  MasterSparePartCategory?: MasterSparePartCategory[]
  MasterSparePartSubCategory?: MasterSparePartSubCategory[]
  MasterSparePartUnit?: MasterSparePartUnit[]

  MasterProgram?: MasterProgram[]
  MasterStream?: MasterStream[]
  MasterYear?: MasterYear[]
  MasterSemester?: MasterSemester[]
  MasterClass?: MasterClass[]
  MasterSection?: MasterSection[]
  MasterRelationship?: MasterRelationship[]

  // Child - Fleet
  FleetVendor?: FleetVendor[]
  FleetVendorAddress?: FleetVendorAddress[]
  FleetVendorBankAccount?: FleetVendorBankAccount[]
  FleetVendorContactPersons?: FleetVendorContactPersons[]
  FleetVendorReview?: FleetVendorReview[]
  FleetVendorDocument?: FleetVendorDocument[]
  FleetVendorDocumentFile?: FleetVendorDocumentFile[]
  FleetVendorServiceCenter?: FleetVendorServiceCenter[]
  FleetVendorFuelStation?: FleetVendorFuelStation[]

  FleetFuelRefill?: FleetFuelRefill[]
  FleetFuelRemoval?: FleetFuelRemoval[]
  FleetFuelRefillFile?: FleetFuelRefillFile[]
  FleetFuelRemovalFile?: FleetFuelRemovalFile[]

  VehicleIncident?: FleetIncidentManagement[]
  FleetIncidentManagementCost?: FleetIncidentManagementCost[]
  IncidentManagementFile?: FleetIncidentManagementFile[]

  FleetInspectionForm?: FleetInspectionForm[]
  FleetInspectionSchedule?: FleetInspectionSchedule[]
  FleetInspection?: FleetInspection[]
  FleetInspectionFile?: FleetInspectionFile[]

  VehicleIssues?: FleetIssueManagement[]
  FleetIssueManagementComment?: FleetIssueManagementComment[]
  FleetIssueManagementFile?: FleetIssueManagementFile[]

  FleetServiceManagement?: FleetServiceManagement[]
  FleetServiceManagementFile?: FleetServiceManagementFile[]
  FleetServiceReminder?: FleetServiceReminder[]

  // FleetSpareParts?: FleetSpareParts[]
  // FleetSparePartsInventory?: FleetSparePartsInventory[]
  // FleetSparePartsPurchaseOrders?: FleetSparePartsPurchaseOrders[]
  // FleetSparePartsPurchaseOrderDetails?: FleetSparePartsPurchaseOrderDetails[]
  // FleetSparePartsUsage?: FleetSparePartsUsage[]
  // FleetSparePartsUsageDetails?: FleetSparePartsUsageDetails[]

  // FleetTyreInventory?: FleetTyreInventory[]
  // FleetAxleTemplate?: FleetAxleTemplate[]
  // FleetAxlePosition?: FleetAxlePosition[]
  // FleetTyrePosition?: FleetTyrePosition[]
  // FleetTyreUsageHistory?: FleetTyreUsageHistory[]
  // FleetTyreInspectionSchedule?: FleetTyreInspectionSchedule[]
  // FleetTyreInspectionScheduleTracking?: FleetTyreInspectionScheduleTracking[]
  // FleetTyreInspection?: FleetTyreInspection[]
  // FleetTyreRetreading?: FleetTyreRetreading[]
  // FleetTyreDamageRepair?: FleetTyreDamageRepair[]
  // FleetTyreRotation?: FleetTyreRotation[]
  // FleetTyreRotationDetails?: FleetTyreRotationDetails[]

  // FleetWorkshop?: FleetWorkshop[]

  // FleetServiceJobCard?: FleetServiceJobCard[]
  // FleetServiceJobCardFile?: FleetServiceJobCardFile[]
  // FleetServiceSchedule?: FleetServiceSchedule[]

  // FleetTripParty?: FleetTripParty[]
  // FleetTripPartyGroup?: FleetTripPartyGroup[]
  // FleetTripPartyContactPerson?: FleetTripPartyContactPerson[]

  // Child - Fleet - Bus
  BusStop?: BusStop[]
  // OrganisationBusManagementSettings?: OrganisationBusManagementSettings[]
  OrganisationCalendar?: OrganisationCalendar[]
  OrganisationNoticeBoard?: OrganisationNoticeBoard[]

  Student?: Student[]
  StudentAddress?: StudentAddress[]
  // StudentGuardian?: StudentGuardian[]
  StudentGuardianLink?: StudentGuardianLink[]
  StudentLeaveRequest?: StudentLeaveRequest[]
  StudentStopChangeRequest?: StudentStopChangeRequest[]
  // StudentEnrollmentStatusHistory?: StudentEnrollmentStatusHistory[]
  // StudentLoginPush?: StudentLoginPush[]
  // StudentGuardianLoginPush?: StudentGuardianLoginPush[]

  MasterRoute?: MasterRoute[]
  MasterRouteStop?: MasterRouteStop[]
  MasterRouteStudent?: MasterRouteStudent[]
  MasterFixedSchedule?: MasterFixedSchedule[]
  // MasterRouteStudentChangeHistory?: MasterRouteStudentChangeHistory[]
  // FixedScheduleDayRun?: FixedScheduleDayRun[]
  // FixedScheduleDayRunStop?: FixedScheduleDayRunStop[]
  // FixedScheduleDayRunStudent?: FixedScheduleDayRunStudent[]

  // Child - GPS
  GPSLiveTrackShareLink?: GPSLiveTrackShareLink[]
  GPSLiveTrackShareLinkNotification?: GPSLiveTrackShareLinkNotification[]
  GPSTrackHistoryShareLink?: GPSTrackHistoryShareLink[]
  GPSTrackHistoryShareLinkNotification?: GPSTrackHistoryShareLinkNotification[]
  // GPSLockRelayLog?: GPSLockRelayLog[]
  // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[]
  GPSGeofence?: GPSGeofence[]
  GPSGeofenceTransaction?: GPSGeofenceTransaction[]
  GPSGeofenceTransactionSummary?: GPSGeofenceTransactionSummary[]
  TripGeofenceToGeofence?: TripGeofenceToGeofence[]
  FleetFuelDailySummary?: FleetFuelDailySummary[]

  // Child - Trip
  // Trip?: Trip[]

  // Child - Account
  BookMark?: BookMark[]
  Ticket?: Ticket[]
  TicketFile?: TicketFile[]
  // FasttagDetails?: FasttagDetails[]
  // EWayBillDetails?: EWayBillDetails[]
  UserLoginPush?: UserLoginPush[]
  DriverLoginPush?: DriverLoginPush[]

  // Child - Notification and Reports
  OrganisationNotificationPreference?: OrganisationNotificationPreference[]
  OrganisationReportPreference?: OrganisationReportPreference[]
  OrganisationReportAutomationMail?: OrganisationReportAutomationMail[]

  // Relations - Child Count
  _count?: {
    User?: number;
    MasterDriver?: number;
    MasterDriverFile?: number;
    MasterDevice?: number;
    // MasterDeviceFile?: number;
    MasterVehicle?: number;
    MasterVehicleFile?: number;
    VehicleOdometerHistory?: number;
    VehicleDocument?: number;
    VehicleDocumentFile?: number;
    VehicleDocumentExpiry?: number;

    // Child - Master
    OrganisationSubCompany?: number;
    OrganisationBranch?: number;
    OrganisationColor?: number;
    OrganisationTag?: number;
    OrganisationGroup?: number;

    MasterVehicleType?: number;
    MasterVehicleMake?: number;
    MasterVehicleModel?: number;
    MasterVehicleSubModel?: number;
    MasterVehicleStatusType?: number;
    MasterVehicleOwnershipType?: number;
    MasterVehicleAssociatedTo?: number;
    MasterVehicleFuelType?: number;
    MasterVehicleFuelUnit?: number;
    MasterVehicleFuelRemovalReason?: number;
    MasterVehicleDocumentType?: number;

    MasterUserRole?: number;
    MasterUserStatus?: number;

    MasterFleetIncidentType?: number;
    MasterFleetIncidentStatus?: number;
    MasterFleetIncidentSeverity?: number;
    MasterFleetInsuranceClaimStatus?: number;
    MasterFleetServiceTask?: number;

    MasterExpenseName?: number;
    MasterExpenseType?: number;
    MasterVendorType?: number;
    MasterVendorTag?: number;
    MasterVendorDocumentType?: number;
    MasterFuelCompany?: number;

    MasterTyreGrade?: number;
    MasterTyreMake?: number;
    MasterTyreModel?: number;

    MasterTripPartyType?: number;

    MasterSparePartCategory?: number;
    MasterSparePartSubCategory?: number;
    MasterSparePartUnit?: number;

    MasterProgram?: number;
    MasterStream?: number;
    MasterYear?: number;
    MasterSemester?: number;
    MasterClass?: number;
    MasterSection?: number;
    MasterRelationship?: number;

    // Child - Fleet
    FleetVendor?: number;
    FleetVendorAddress?: number;
    FleetVendorBankAccount?: number;
    FleetVendorContactPersons?: number;
    FleetVendorReview?: number;
    FleetVendorDocument?: number;
    FleetVendorDocumentFile?: number;
    FleetVendorServiceCenter?: number;
    FleetVendorFuelStation?: number;

    FleetFuelRefill?: number;
    FleetFuelRemoval?: number;
    FleetFuelRefillFile?: number;
    FleetFuelRemovalFile?: number;

    VehicleIncident?: number;
    FleetIncidentManagementCost?: number;
    IncidentManagementFile?: number;

    FleetInspectionForm?: number;
    FleetInspectionSchedule?: number;
    FleetInspection?: number;
    FleetInspectionFile?: number;

    VehicleIssues?: number;
    FleetIssueManagementComment?: number;
    FleetIssueManagementFile?: number;

    FleetServiceManagement?: number;
    FleetServiceManagementFile?: number;
    FleetServiceReminder?: number;

    // FleetSpareParts?: FleetSpareParts[]
    // FleetSparePartsInventory?: FleetSparePartsInventory[]
    // FleetSparePartsPurchaseOrders?: FleetSparePartsPurchaseOrders[]
    // FleetSparePartsPurchaseOrderDetails?: FleetSparePartsPurchaseOrderDetails[]
    // FleetSparePartsUsage?: FleetSparePartsUsage[]
    // FleetSparePartsUsageDetails?: FleetSparePartsUsageDetails[]

    // FleetTyreInventory?: FleetTyreInventory[]
    // FleetAxleTemplate?: FleetAxleTemplate[]
    // FleetAxlePosition?: FleetAxlePosition[]
    // FleetTyrePosition?: FleetTyrePosition[]
    // FleetTyreUsageHistory?: FleetTyreUsageHistory[]
    // FleetTyreInspectionSchedule?: FleetTyreInspectionSchedule[]
    // FleetTyreInspectionScheduleTracking?: FleetTyreInspectionScheduleTracking[]
    // FleetTyreInspection?: FleetTyreInspection[]
    // FleetTyreRetreading?: FleetTyreRetreading[]
    // FleetTyreDamageRepair?: FleetTyreDamageRepair[]
    // FleetTyreRotation?: FleetTyreRotation[]
    // FleetTyreRotationDetails?: FleetTyreRotationDetails[]

    // FleetWorkshop?: FleetWorkshop[]

    // FleetServiceJobCard?: FleetServiceJobCard[]
    // FleetServiceJobCardFile?: FleetServiceJobCardFile[]
    // FleetServiceSchedule?: FleetServiceSchedule[]

    // FleetTripParty?: FleetTripParty[]
    // FleetTripPartyGroup?: FleetTripPartyGroup[]
    // FleetTripPartyContactPerson?: FleetTripPartyContactPerson[]

    // Child - Fleet - Bus
    BusStop?: number;
    // OrganisationBusManagementSettings?: OrganisationBusManagementSettings[]
    OrganisationCalendar?: number;
    OrganisationNoticeBoard?: number;

    Student?: number;
    StudentAddress?: number;
    // StudentGuardian?: StudentGuardian[]
    StudentGuardianLink?: number;
    StudentLeaveRequest?: number;
    StudentStopChangeRequest?: number;
    // StudentEnrollmentStatusHistory?: StudentEnrollmentStatusHistory[]
    // StudentLoginPush?: StudentLoginPush[]
    // StudentGuardianLoginPush?: StudentGuardianLoginPush[]

    MasterRoute?: number;
    MasterRouteStop?: number;
    MasterRouteStudent?: number;
    MasterFixedSchedule?: number;
    // MasterRouteStudentChangeHistory?: MasterRouteStudentChangeHistory[]
    // FixedScheduleDayRun?: FixedScheduleDayRun[]
    // FixedScheduleDayRunStop?: FixedScheduleDayRunStop[]
    // FixedScheduleDayRunStudent?: FixedScheduleDayRunStudent[]

    // Child - GPS
    GPSLiveTrackShareLink?: number;
    GPSLiveTrackShareLinkNotification?: number;
    GPSTrackHistoryShareLink?: number;
    GPSTrackHistoryShareLinkNotification?: number;
    // GPSLockRelayLog?: GPSLockRelayLog[]
    // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[]
    GPSGeofence?: number;
    GPSGeofenceTransaction?: number;
    GPSGeofenceTransactionSummary?: number;
    TripGeofenceToGeofence?: number;
    FleetFuelDailySummary?: number;

    // Child - Trip
    // Trip?: Trip[]

    // Child - Account
    BookMark?: number;
    Ticket?: number;
    TicketFile?: number;
    // FasttagDetails?: FasttagDetails[]
    // EWayBillDetails?: EWayBillDetails[]
    UserLoginPush?: number;
    DriverLoginPush?: number;

    // Child - Notification and Reports
    OrganisationNotificationPreference?: number;
    OrganisationReportPreference?: number;
    OrganisationReportAutomationMail?: number;
  }
};


// UserOrganisationSimple Interface
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

  l_id: string;
  df_id: string;
  tz_id: string;
}

// UserOrganisation Create/Update Schema
export const UserOrganisationSchema = z.object({
  // Relations - Parent
  industry_id: single_select_mandatory('MasterMainIndustry'), // Single-Selection -> MasterMainIndustry
  country_id: single_select_mandatory('MasterMainCountry'), // Single-Selection -> MasterMainCountry
  state_id: single_select_optional('MasterMainState'), // Single-Selection -> MasterMainState
  currency_id: single_select_optional('MasterMainCurrency'), // Single-Selection -> MasterMainCurrency
  language_id: single_select_optional('MasterMainLanguage'), // Single-Selection -> MasterMainLanguage
  time_zone_id: single_select_mandatory('MasterMainTimeZone'), // Single-Selection -> MasterMainTimeZone
  date_format_id: single_select_optional('MasterMainDateFormat'), // Single-Selection -> MasterMainDateFormat
  distance_unit_id: single_select_optional('MasterMainUnitDistance'), // Single-Selection -> MasterMainUnitDistance
  mileage_unit_id: single_select_optional('MasterMainUnitMileage'), // Single-Selection -> MasterMainUnitMileage
  volume_unit_id: single_select_optional('MasterMainUnitVolume'), // Single-Selection -> MasterMainUnitVolume

  // Profile Image/Logo
  logo_url: stringOptional('Logo URL', 0, 300),
  logo_key: stringOptional('Logo Key', 0, 300),
  logo_name: stringOptional('Logo Name', 0, 300),

  // Relations - Parent
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

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type UserOrganisationDTO = z.infer<typeof UserOrganisationSchema>;

// UserOrganisation Query Schema
export const UserOrganisationQuerySchema = BaseQuerySchema.extend({
  // Self Table
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation

  // Relations - Parent
  industry_ids: multi_select_optional('MasterMainIndustry'), // Multi-Selection -> MasterMainIndustry
  country_ids: multi_select_optional('MasterMainCountry'), // Multi-Selection -> MasterMainCountry
  state_ids: multi_select_optional('MasterMainState'), // Multi-Selection -> MasterMainState
  currency_ids: multi_select_optional('MasterMainCurrency'), // Multi-Selection -> MasterMainCurrency
  language_ids: multi_select_optional('MasterMainLanguage'), // Multi-Selection -> MasterMainLanguage
  time_zone_ids: multi_select_optional('MasterMainTimeZone'), // Multi-Selection -> MasterMainTimeZone
  date_format_ids: multi_select_optional('MasterMainDateFormat'), // Multi-Selection -> MasterMainDateFormat

  // Enums
  fleet_size: enumArrayOptional(
    'Fleet Size',
    FleetSize,
    getAllEnums(FleetSize),
  ),
});
export type UserOrganisationQueryDTO = z.infer<
  typeof UserOrganisationQuerySchema
>;

// UserOrganisation Logo Schema
export const UserOrganisationLogoSchema = z.object({
  // Profile Image/Logo
  logo_url: stringMandatory('Logo URL', 0, 300),
  logo_key: stringMandatory('Logo Key', 0, 300),
  logo_name: stringMandatory('Logo Name', 0, 300),
});
export type UserOrganisationLogoDTO = z.infer<
  typeof UserOrganisationLogoSchema
>;

// Convert UserOrganisation Data to API Payload
export const toUserOrganisationPayload = (row: UserOrganisation): UserOrganisationDTO => ({
  organisation_name: row.organisation_name || '',
  organisation_email: row.organisation_email || '',
  organisation_mobile: row.organisation_mobile || '',

  organisation_code: row.organisation_code || '',
  organisation_utrack_id: row.organisation_utrack_id || '',

  fleet_size: row.fleet_size || FleetSize.Fleet_1_to_50_Vehicles,

  logo_url: row.logo_url || '',
  logo_key: row.logo_key || '',
  logo_name: row.logo_name || '',

  company_cin: row.company_cin || '',
  company_tin_gstin: row.company_tin_gstin || '',

  // Billing Address
  billing_address_line1: row.billing_address_line1 || '',
  billing_address_line2: row.billing_address_line2 || '',
  billing_locality_landmark: row.billing_locality_landmark || '',
  billing_neighborhood: row.billing_neighborhood || '',
  billing_town_city: row.billing_town_city || '',
  billing_district_county: row.billing_district_county || '',
  billing_state_province_region: row.billing_state_province_region || '',
  billing_postal_code: row.billing_postal_code || '',
  billing_country: row.billing_country || '',
  billing_country_code: row.billing_country_code || '',

  // Company Address
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

  industry_id: row.industry_id,
  country_id: row.country_id,
  state_id: row.state_id || '',
  currency_id: row.currency_id || '',

  language_id: row.language_id || '',
  time_zone_id: row.time_zone_id || '',
  date_format_id: row.date_format_id || '',

  distance_unit_id: row.distance_unit_id || '',
  mileage_unit_id: row.mileage_unit_id || '',
  volume_unit_id: row.volume_unit_id || '',

  status: row.status || Status.Active,
});

// Create New UserOrganisation Payload
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

  status: Status.Active,
});

// AWS S3 PRESIGNED
export const get_organisation_logo_presigned_url = async (file_name: string): Promise<BR<AWSPresignedUrl>> => {
  return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.organisation_logo_presigned_url(file_name));
};

// File Uploads
export const update_organisation_logo = async (id: string, data: UserOrganisationLogoDTO): Promise<SBR> => {
  return apiPatch<SBR, UserOrganisationLogoDTO>(ENDPOINTS.update_organisation_logo(id), data);
};

export const delete_organisation_logo = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_organisation_logo(id));
};

// AMasterUserOrganisation APIs
export const findUserOrganisation = async (data: UserOrganisationQueryDTO): Promise<FBR<UserOrganisation[]>> => {
  return apiPost<FBR<UserOrganisation[]>, UserOrganisationQueryDTO>(ENDPOINTS.find, data);
};

export const createUserOrganisation = async (data: UserOrganisationDTO): Promise<SBR> => {
  return apiPost<SBR, UserOrganisationDTO>(ENDPOINTS.create, data);
};

export const updateUserOrganisation = async (id: string, data: UserOrganisationDTO): Promise<SBR> => {
  return apiPatch<SBR, UserOrganisationDTO>(ENDPOINTS.update(id), data);
};

export const deleteUserOrganisation = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getUserOrganisationCache = async (): Promise<FBR<UserOrganisation[]>> => {
  return apiGet<FBR<UserOrganisation[]>>(ENDPOINTS.cache());
};

export const getUserOrganisationCacheSimple = async (): Promise<FBR<UserOrganisationSimple[]>> => {
  return apiGet<FBR<UserOrganisationSimple[]>>(ENDPOINTS.cache_simple());
};
