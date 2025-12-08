// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BR, AWSPresignedUrl, BaseCommonFile } from '../../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  numberOptional,
  enumMandatory,
  enumOptional,
  multi_select_optional,
  single_select_optional,
  single_select_mandatory,
  doubleOptional,
  doubleOptionalAmount,
  dateOptional,
  enumArrayOptional,
  getAllEnums,
  nestedArrayOfObjectsOptional,
  dynamicJsonSchema,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQueryDTO, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

//Enums
import {
  Status,
  YesNo,
  GPSSource,
  PurchaseVehicleType,
  PurchaseType,
  LifeExpiry,
  SteeringType,
  WheelDriveType,
  VehicleLifeStatus,
  LoanInterestType,
  DocumentValidityStatus,
  DocumentStatus,
  OdometerSource,
  ExpiryType,
  FuelTankType,
  GPSVehicleCategory,
} from '../../../core/Enums';

import {
  MasterDriver,
  AssignRemoveDriverHistory,
} from '../../../services/main/drivers/master_driver_service';
import {
  MasterDevice,
  AssignRemoveDeviceHistory,
} from '../../../services/main/devices/master_device_service';

import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterMainCountry } from '../../../services/master/main/master_main_country_service';
import { MasterMainTimeZone } from '../../../services/master/main/master_main_timezone_service';

import { OrganisationSubCompany } from '../../../services/master/organisation/organisation_sub_company_service';
import { OrganisationBranch } from '../../../services/master/organisation/organisation_branch_service';
import { OrganisationColor } from '../../../services/master/organisation/organisation_color_service';
import { OrganisationTag } from '../../../services/master/organisation/organisation_tag_service';
import { VehicleOrganisationGroupLink } from '../../../services/master/organisation/organisation_group_service';

import { MasterVehicleMake } from '../../../services/master/vehicle/master_vehicle_make_service';
import { MasterVehicleModel } from '../../../services/master/vehicle/master_vehicle_model_service';
import { MasterVehicleSubModel } from '../../../services/master/vehicle/master_vehicle_sub_model_service';
import { MasterVehicleStatusType } from '../../../services/master/vehicle/master_vehicle_status_type_service';
import { MasterVehicleOwnershipType } from '../../../services/master/vehicle/master_vehicle_ownership_type_service';
import { MasterVehicleType } from '../../../services/master/vehicle/master_vehicle_type_service';
import { MasterVehicleFuelType } from '../../../services/master/vehicle/master_vehicle_fuel_type_service';
import { MasterVehicleAssociatedTo } from 'src/services/master/vehicle/master_vehicle_associated_to_service';
import { MasterVehicleFuelUnit } from 'src/services/master/vehicle/master_vehicle_fuel_unit_service';
import { MasterVehicleDocumentType } from 'src/services/master/vehicle/master_vehicle_document_type_service';

import { FleetVendor } from 'src/services/fleet/vendor_management/fleet_vendor_service';
import { OrganisationNotificationPreferenceVehicleLink } from 'src/services/account/notification_preferences.service';
import { OrganisationReportPreferenceVehicleLink, OrganisationReportAutomationMailVehicleLink } from 'src/services/account/report_preferences.service';
import { MasterFixedSchedule } from 'src/services/fleet/bus_mangement/master_route';
import { FleetFuelDailySummary } from 'src/services/fleet/fuel_management/fleet_fuel_daily_summary_service';
import { FleetFuelRefill } from 'src/services/fleet/fuel_management/fleet_fuel_refill_service';
import { FleetFuelRemoval } from 'src/services/fleet/fuel_management/fleet_fuel_removal_service';
import { FleetIncidentManagement } from 'src/services/fleet/incident_management/incident_management_service';
import { FleetInspection } from 'src/services/fleet/inspection_management/fleet_inspection_management_service';
import { FleetInspectionScheduleVehicleLink } from 'src/services/fleet/inspection_management/fleet_inspection_schedule_service';
import { FleetIssueManagement } from 'src/services/fleet/issue_management/issue_management_service';
import { FleetServiceManagement, FleetServiceReminder } from 'src/services/fleet/service_management/fleet_service_management_service';
import { FleetServiceScheduleVehicleLink } from 'src/services/fleet/service_management/fleet_service_schedule_service';
import { GPSGeofenceTransaction } from 'src/services/gps/features/geofence/gps_geofence_transaction_service';
import { GPSGeofenceTransactionSummary } from 'src/services/gps/features/geofence/gps_geofence_transaction_summary_service';
import { TripGeofenceToGeofence } from 'src/services/gps/features/geofence/trip_geofence_to_geofence_service';
import { GPSLiveTrackShareLink } from 'src/services/gps/features/gps_live_track_share_link_service';
import { GPSTrackHistoryShareLink } from 'src/services/gps/features/gps_track_history_share_link_service';
import { UserVehicleLink } from '../users/user_service';

// ✅ URL and Endpoints
const URL = 'main/master_vehicle';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  vehicle_file_presigned_url: `${URL}/vehicle_file_presigned_url`,
  device_file_presigned_url: `${URL}/device_file_presigned_url`,
  vehicle_document_file_presigned_url: `${URL}/vehicle_document_file_presigned_url`,
  calibration_file_presigned_url: `${URL}/calibration_file_presigned_url`,

  // File Uploads
  create_file_vehicle: `${URL}/create_file_vehicle`,
  remove_file_vehicle: (id: string): string => `${URL}/remove_file_vehicle${id}`,
  create_file_device: `${URL}/create_file_device`,
  remove_file_device: (id: string): string => `${URL}/remove_file_device/${id}`,
  create_file_vehicle_document: `${URL}/create_file_vehicle_document`,
  remove_file_vehicle_document: (id: string): string => `${URL}/remove_file_vehicle_document/${id}`,
  update_calibration_file: `${URL}/update_calibration_file`,
  delete_calibration_file: (id: string): string => `${URL}/delete_calibration_file/${id}`,

  // MasterVehicle APIs
  find: `${URL}/search`,
  find_live_dashboard: `${URL}/live_dashboard/search`,
  find_gps_details: `${URL}/gps_details/search`,
  create: `${URL}`,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // API Updates
  update_details_gps_sensor: (id: string): string => `${URL}/gps_sensor_details/${id}`,
  update_details_trip: (id: string): string => `${URL}/trip_details/${id}`,
  update_details_body: (id: string): string => `${URL}/body_details/${id}`,
  update_details_life_cycle: (id: string): string => `${URL}/life_cycle_details/${id}`,
  update_details_purchase: (id: string): string => `${URL}/purchase_details/${id}`,

  // API Vehicle Driver Link
  vehicle_driver_link: `${URL}/vehicle_driver_link`,
  vehicle_driver_unlink: `${URL}/vehicle_driver_unlink`,
  find_vehicle_driver_link_history_by_vehicle: (id: string): string => `${URL}/vehicle_driver_link_history_by_vehicle/${id}`,
  find_vehicle_driver_link_history_by_driver: (id: string): string => `${URL}/vehicle_driver_link_history_by_driver/${id}`,

  // API Vehicle Device Link
  vehicle_device_link: `${URL}/vehicle_device_link`,
  vehicle_device_unlink: `${URL}/vehicle_device_unlink`,
  vehicle_device_link_history_by_vehicle: (id: string): string => `${URL}/vehicle_device_link_history_by_vehicle/${id}`,
  vehicle_device_link_history_by_device: (id: string): string => `${URL}/vehicle_device_link_history_by_device/${id}`,

  // VehicleDocument APIs
  create_document: `${URL}/document`,
  find_document: `${URL}/find_document/search`,
  update_document: (id: string): string => `${URL}/vehicle_document/${id}`,
  remove_document: (id: string): string => `${URL}/vehicle_document/${id}`,

  // VehicleDocumentExpiry APIs
  create_document_expiry: `${URL}/vehicle_document_expiry`,
  find_document_expiry: `${URL}/vehicle_document_expiry/search`,
  update_document_expiry: (id: string): string => `${URL}/vehicle_document_expiry/${id}`,
  remove_document_expiry: (id: string): string => `${URL}/vehicle_document_expiry/${id}`,

  // Cache APIs
  find_cache: `${URL}/cache/:organisation_id`,
  find_cache_simple: `${URL}/cache_simple/:organisation_id`,
  find_cache_parent: `${URL}/cache_parent/:organisation_id`,
  find_cache_dropdown: `${URL}/cache_dropdown/:organisation_id`,
  find_cache_dropdown_live_data: `${URL}/cache_dropdown_live_data/:organisation_id`,
};

// MasterVehicle Interface
export interface MasterVehicle extends Record<string, unknown> {
  // Primary Fields
  vehicle_id: string;
  vehicle_number: string;
  vehicle_name?: string;

  engine_number?: string;
  chassis_number?: string;
  vehicle_make_year?: number;

  // Database Details
  db_instance: string;
  db_group: string;

  // Admin Account Details
  is_fleet_active: YesNo;
  is_gps_active: YesNo;
  is_trip_active: YesNo;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Driver
  is_driver_assigned: YesNo;
  driver_id?: string;
  MasterDriver?: MasterDriver;
  driver_details?: string;
  assign_driver_date?: string;
  assign_driver_date_f?: string;
  AssignRemoveDriverHistory?: AssignRemoveDriverHistory[];

  // Relations - Device
  is_device_installed: YesNo;
  device_gps_source?: GPSSource;
  device_id?: string;
  MasterDevice?: MasterDevice;
  device_identifier?: string;
  assign_device_date?: string;
  assign_device_date_f?: string;
  AssignRemoveDeviceHistory?: AssignRemoveDeviceHistory[];
  country_id?: string;
  MasterMainCountry?: MasterMainCountry;
  time_zone_id?: string;
  MasterMainTimeZone?: MasterMainTimeZone;

  // Relations - Odometer
  odometer_reading?: number;
  odometer_last_change_date?: string;
  odometer_last_change_date_f?: string;
  VehicleOdometerHistory?: VehicleOdometerHistory[];

  // Relations - One to One
  vehicle_details_gps_id?: string;
  VehicleDetailGPS?: VehicleDetailGPS;

  vehicle_details_trip_id?: string;
  VehicleDetailTrip?: VehicleDetailTrip;

  vehicle_details_body_id?: string;
  VehicleDetailBody?: VehicleDetailBody;

  vehicle_details_life_cycle_id?: string;
  VehicleDetailLifeCycle?: VehicleDetailLifeCycle;

  vehicle_details_purchase_id?: string;
  VehicleDetailPurchase?: VehicleDetailPurchase;

  // Relations - Organisation
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  organisation_sub_company_id?: string;
  OrganisationSubCompany?: OrganisationSubCompany;
  sub_company_name?: string;

  organisation_branch_id?: string;
  OrganisationBranch?: OrganisationBranch;
  branch_name?: string;
  branch_city?: string;

  organisation_color_id?: string;
  OrganisationColor?: OrganisationColor;
  color_name?: string;
  color_code?: string;

  organisation_tag_id?: string;
  OrganisationTag?: OrganisationTag;
  tag_name?: string;

  // Relations - MasterVehicle
  vehicle_type_id: string;
  MasterVehicleType?: MasterVehicleType;
  vehicle_type?: string;

  vehicle_make_id?: string;
  MasterVehicleMake?: MasterVehicleMake;
  vehicle_make?: string;

  vehicle_model_id?: string;
  MasterVehicleModel?: MasterVehicleModel;
  vehicle_model?: string;

  vehicle_sub_model_id?: string;
  MasterVehicleSubModel?: MasterVehicleSubModel;
  vehicle_sub_model?: string;

  vehicle_status_type_id?: string;
  MasterVehicleStatusType?: MasterVehicleStatusType;
  status_type?: string;

  vehicle_ownership_type_id?: string;
  MasterVehicleOwnershipType?: MasterVehicleOwnershipType;
  ownership_type?: string;

  vehicle_associated_to_id?: string;
  MasterVehicleAssociatedTo?: MasterVehicleAssociatedTo;
  associated_to?: string;

  // Relations - Fuel Details
  vehicle_fuel_type_id?: string;
  PrimaryFuelType?: MasterVehicleFuelType;
  fuel_type?: string;

  vehicle_fuel_unit_id?: string;
  PrimaryFuelUnit?: MasterVehicleFuelUnit;
  fuel_unit?: string;

  secondary_vehicle_fuel_type_id?: string;
  SecondaryMasterVehicleFuelType?: MasterVehicleFuelType;
  secondary_fuel_type?: string;

  secondary_vehicle_fuel_unit_id?: string;
  SecondaryMasterVehicleFuelUnit?: MasterVehicleFuelUnit;
  secondary_fuel_unit?: string;

  fuel_tank_type?: FuelTankType;
  fuel_tank_size?: number;
  fuel_tank_1_size?: number;
  fuel_tank_2_size?: number;
  fuel_tank_total_size?: number;

  // Bus management
  vehicle_passenger_capacity?: number;
  standing_passenger_capacity?: number;

  // Relations - Child
  // Child - Main
  VehicleDocument?: VehicleDocument[]
  MasterVehicleFile?: MasterVehicleFile[]
  VehicleDocumentExpiry?: VehicleDocumentExpiry[]

  // Child - Master
  VehicleOrganisationGroupLink?: VehicleOrganisationGroupLink[]

  // Child - Fleet
  FleetFuelRefill?: FleetFuelRefill[]
  FleetFuelRemoval?: FleetFuelRemoval[]

  FleetInspection?: FleetInspection[]
  FleetInspectionScheduleVehicleLink?: FleetInspectionScheduleVehicleLink[]

  VehicleIncident?: FleetIncidentManagement[]

  VehicleIssues?: FleetIssueManagement[]

  FleetServiceManagement?: FleetServiceManagement[]
  FleetServiceScheduleVehicleLink?: FleetServiceScheduleVehicleLink[]
  FleetServiceReminder?: FleetServiceReminder[]
  // FleetServiceJobCard?: FleetServiceJobCard[]

  // FleetTyreUsageHistory?: FleetTyreUsageHistory[]
  // FleetTyreInspectionScheduleVehicle?: FleetTyreInspectionScheduleVehicle[]
  // FleetTyreInspectionScheduleTracking?: FleetTyreInspectionScheduleTracking[]
  // FleetTyreInspection?: FleetTyreInspection[]
  // FleetTyreDamageRepair?: FleetTyreDamageRepair[]
  // FleetTyreRotation?: FleetTyreRotation[]
  // FleetTyreRotationDetails?: FleetTyreRotationDetails[]

  MasterFixedSchedule?: MasterFixedSchedule[]
  // FixedScheduleDayRun?: FixedScheduleDayRun[]

  // Child - GPS
  // GpsLockRelayLog?: GPSLockRelayLog[]
  // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[]
  TripGeofenceToGeofence?: TripGeofenceToGeofence[]
  GPSGeofenceTransaction?: GPSGeofenceTransaction[]
  FleetFuelDailySummary?: FleetFuelDailySummary[]
  GPSLiveTrackShareLink?: GPSLiveTrackShareLink[]
  GPSTrackHistoryShareLink?: GPSTrackHistoryShareLink[]
  GPSGeofenceTransactionSummary?: GPSGeofenceTransactionSummary[]

  // Child - Trip
  // Trip?: Trip[]

  // Child - Account
  UserVehicleLink?: UserVehicleLink[]
  OrganisationNotificationPreferenceVehicleLink?: OrganisationNotificationPreferenceVehicleLink[]
  OrganisationReportPreferenceVehicleLink?: OrganisationReportPreferenceVehicleLink[]
  OrganisationReportAutomationMailVehicleLink?: OrganisationReportAutomationMailVehicleLink[]

  // Relations - Child Count
  _count?: {
    VehicleDocument?: number;
    MasterVehicleFile?: number;
    VehicleDocumentExpiry?: number;

    // Child - Master
    VehicleOrganisationGroupLink?: number;

    // Child - Fleet
    FleetFuelRefill?: number;
    FleetFuelRemoval?: number;

    FleetInspection?: number;
    FleetInspectionScheduleVehicleLink?: number;

    VehicleIncident?: number;

    VehicleIssues?: number;

    FleetServiceManagement?: number;
    FleetServiceScheduleVehicleLink?: number;
    FleetServiceReminder?: number;
    // FleetServiceJobCard?: FleetServiceJobCard[]

    // FleetTyreUsageHistory?: FleetTyreUsageHistory[]
    // FleetTyreInspectionScheduleVehicle?: FleetTyreInspectionScheduleVehicle[]
    // FleetTyreInspectionScheduleTracking?: FleetTyreInspectionScheduleTracking[]
    // FleetTyreInspection?: FleetTyreInspection[]
    // FleetTyreDamageRepair?: FleetTyreDamageRepair[]
    // FleetTyreRotation?: FleetTyreRotation[]
    // FleetTyreRotationDetails?: FleetTyreRotationDetails[]

    MasterFixedSchedule?: number;
    // FixedScheduleDayRun?: FixedScheduleDayRun[]

    // Child - GPS
    // GpsLockRelayLog?: GPSLockRelayLog[]
    // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[]
    TripGeofenceToGeofence?: number;
    GPSGeofenceTransaction?: number;
    FleetFuelDailySummary?: number;
    GPSLiveTrackShareLink?: number;
    GPSTrackHistoryShareLink?: number;
    GPSGeofenceTransactionSummary?: number;

    // Child - Trip
    // Trip?: Trip[]

    // Child - Account
    UserVehicleLink?: number;
    OrganisationNotificationPreferenceVehicleLink?: number;
    OrganisationReportPreferenceVehicleLink?: number;
  };
}

// MasterVehicleDropdown Interface
export interface MasterVehicleDropdown extends Record<string, unknown> {
  v_id: string;
  vn: string;
  vt: string;

  dr_f: string;
  dr_id: string;

  dv_id: string;
  imei: string;

  temperature: YesNo;
  duel_temperature: YesNo;
  fuel: YesNo;
  fuel_bluetooth: YesNo;
  fuel_tank_size: number;
  fuel_tank_1_size: number;
  fuel_tank_2_size: number;
  fuel_tank_total_size: number;
  over_speed_kmph: number;
  is_obd: YesNo;
  gps_lock_relay: YesNo;
  gps_door_locker: YesNo;
  door_sensor: YesNo;
  genset_sensor: YesNo;
  dashcam_sensor: YesNo;
  is_rear_cam: YesNo;
  is_front_cam: YesNo;
  camera_extra_count: number;

  vehicle_passenger_capacity: number;
  standing_passenger_capacity: number;

  vehicle_fuel_type_id: string;
  vehicle_fuel_unit_id: string;

  latitude: number;
  longitude: number;
}

// MasterVehicleFile Interface
export interface MasterVehicleFile extends BaseCommonFile {
  // Primary Fields
  vehicle_file_id: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
}

// VehicleDetailGPS Interface
export interface VehicleDetailGPS extends Record<string, unknown> {
  // Primary Fields
  vehicle_details_gps_id: string;

  // GPS Input Source
  serial_no?: number;
  device_identifier?: string;
  device_gps_source?: GPSSource;
  traccar_protocol?: string;
  custom_protocol?: string;
  api_details?: string;

  // sensor configuration
  temperature?: YesNo;
  duel_temperature?: YesNo;
  fuel?: YesNo;
  fuel_bluetooth?: YesNo;
  fuel_tank_type?: FuelTankType;
  fuel_tank_size?: number;
  fuel_tank_1_size?: number;
  fuel_tank_2_size?: number;
  fuel_tank_total_size?: number;
  over_speed_kmph?: number;
  is_obd: YesNo;
  gps_lock_relay?: YesNo;
  gps_door_locker?: YesNo;
  door_sensor?: YesNo;
  genset_sensor?: YesNo;
  dashcam_sensor?: YesNo;
  is_rear_cam?: YesNo;
  is_front_cam?: YesNo;
  camera_extra_count?: number;

  // Calibration File
  calibration_file_url?: string;
  calibration_file_key?: string;
  calibration_file_name?: string;
  calibration_file_updated_date_time?: string;
  calibration_file_updated_date_time_f?: string;

  // GPS Data
  gps_source?: string;
  protocol?: string;
  api_code?: string;
  attributes?: object;
  raw?: string;
  fuel_mapping?: object;
  fuel_values?: object;

  // Time Fields
  st?: string;
  dt?: string;
  ft?: string;
  sts?: number;
  dts?: number;
  fts?: number;

  // Location & Movement
  la?: number;
  lo?: number;
  al?: number;
  s?: number;
  c?: number;
  i?: boolean;
  m?: boolean;
  os?: boolean;
  p?: boolean;
  v?: boolean;
  b?: number;
  b_r?: string;

  // Fuel
  f1_r?: string;
  f2_r?: string;
  f1?: number;
  f2?: number;
  f1_f?: string;

  // Temperature
  t1_r?: string;
  t2_r?: string;
  t1?: number;
  t2?: number;
  t_f?: string;

  // Additional Sensor
  s_r_l?: boolean;
  s_d_l?: boolean;
  s_d?: boolean;
  s_g?: boolean;

  // OverSpeed Data
  f_dt_os?: string;
  f_dts_os?: number;
  s_la_os?: number;
  s_lo_os?: number;
  s_gl_os?: string;
  s_lid_os?: string;
  s_ll_os?: string;
  s_ld_os?: number;

  // Stoppage Data
  f_dt_s?: string;
  f_dts_s?: number;
  s_la_s?: number;
  s_lo_s?: number;
  s_gl_s?: string;
  s_lid_s?: string;
  s_ll_s?: string;
  s_ld_s?: number;

  // Ignition Data
  f_dt_i?: string;
  f_dts_i?: number;
  s_la_i?: number;
  s_lo_i?: number;
  s_gl_i?: string;
  s_lid_i?: string;
  s_ll_i?: string;
  s_ld_i?: number;

  // Genset Data
  f_dt_g?: string;
  f_dts_g?: number;
  s_la_g?: number;
  s_lo_g?: number;
  s_gl_g?: string;
  s_lid_g?: string;
  s_ll_g?: string;
  s_ld_g?: number;

  // Door Sensor Data
  f_dt_d?: string;
  f_dts_d?: number;
  s_la_d?: number;
  s_lo_d?: number;
  s_gl_d?: string;
  s_lid_d?: string;
  s_ll_d?: string;
  s_ld_d?: number;

  // Location
  gl?: string;
  lid?: string;
  ll?: string;
  ld?: number;

  // Kilometer Analytics
  km_last_24?: number;
  t_s_last_24_moving_on?: number;
  t_s_last_24_moving_off?: number;
  t_s_last_24_ignition_on?: number;
  t_s_last_24_ignition_off?: number;
  max_speed_last_24?: number;
  avg_speed_last_24?: number;

  t_s_last_24_moving_on_f?: string;
  t_s_last_24_moving_off_f?: string;
  t_s_last_24_ignition_on_f?: string;
  t_s_last_24_ignition_off_f?: string;

  km_today?: number;
  t_s_today_moving_on?: number;
  t_s_today_moving_off?: number;
  t_s_today_ignition_on?: number;
  t_s_today_ignition_off?: number;
  max_speed_today?: number;
  avg_speed_today?: number;

  t_s_today_moving_on_f?: string;
  t_s_today_moving_off_f?: string;
  t_s_today_ignition_on_f?: string;
  t_s_today_ignition_off_f?: string;

  km_this_week_sunday?: number;
  km_this_week_monday?: number;
  km_this_month?: number;
  km_this_year?: number;
  km_this_financial_year?: number;

  km_slotted_today?: number;
  km_slotted_this_week_sunday?: number;
  km_slotted_this_week_monday?: number;
  km_slotted_this_month?: number;
  km_slotted_this_year?: number;
  km_slotted_this_financial_year?: number;

  is_valid?: boolean;
  is_live?: boolean;
  is_recent?: boolean;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  vehicle_id?: string;
  Vehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  landmark_id?: string;
  // MasterMainLandMark?: MasterMainLandMark;
}

// VehicleDetailTrip Interface
export interface VehicleDetailTrip extends Record<string, unknown> {
  // Primary Fields
  vehicle_details_trip_id: string;
  trip_name?: string;
  trip_no?: string;
  eway_bill_number?: string;
  route_name?: string;

  trip_start_date?: string;
  trip_start_date_f?: string;
  trip_end_date?: string;
  trip_end_date_f?: string;

  trip_notes_1?: string;
  trip_notes_2?: string;
  trip_notes_3?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  vehicle_id?: string;
  Vehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
}

// VehicleDetailBody Interface
export interface VehicleDetailBody extends Record<string, unknown> {
  // Primary Fields
  vehicle_details_body_id: string;
  vehicle_body_details?: string;
  vehicle_height?: number;
  vehicle_width?: number;
  vehicle_length?: number;
  wheel_base?: number;
  number_of_doors?: number;

  // Passenger Configuration (Cars/Buses)
  vehicle_passenger_capacity?: number;
  standing_passenger_capacity?: number;
  seat_configuration?: string;
  has_air_conditioning: YesNo;
  has_heating_system: YesNo;
  has_reclining_seats: YesNo;
  has_safety_belts: YesNo;
  has_headrests: YesNo;
  has_armrests: YesNo;
  has_infotainment_system: YesNo;
  infotainment_type?: string;
  has_individual_lighting: YesNo;
  has_overhead_luggage_storage: YesNo;
  wheelchair_accessible: YesNo;

  // Cargo Configuration (Trucks/Vans)
  vehicle_cargo_volume?: number;
  vehicle_maximum_weight_capacity?: number;
  cargo_area_type?: string;
  has_lift_gate: YesNo;
  has_refrigeration_unit: YesNo;
  refrigeration_temperature_range?: string;
  cargo_bed_length?: number;
  cargo_bed_width?: number;
  cargo_bed_height?: number;
  cargo_floor_material?: string;
  has_side_doors: YesNo;
  has_roof_hatch: YesNo;
  cargo_tie_down_hooks_count?: number;
  is_custom_body_built: YesNo;

  // Wheel & Suspension
  number_of_axles?: number;
  axle_configuration?: string;
  has_dual_rear_wheels: YesNo;
  suspension_type?: string;
  suspension_adjustability: YesNo;
  ground_clearance_mm?: number;
  tire_size?: string;
  has_spare_tire: YesNo;
  has_all_terrain_tires: YesNo;
  has_run_flat_tires: YesNo;
  steering_type: SteeringType
  wheel_drive_type: WheelDriveType;

  // Safety Features
  has_abs: YesNo;
  has_airbags: YesNo;
  has_speed_limiter: YesNo;
  has_gps_tracker: YesNo;
  has_parking_sensors: YesNo;
  has_rear_camera: YesNo;
  has_lane_assist: YesNo;
  has_automatic_emergency_brake: YesNo;
  has_tire_pressure_monitoring: YesNo;
  has_blind_spot_monitoring: YesNo;
  has_collision_warning_system: YesNo;
  has_immobilizer: YesNo;
  has_dashcam: YesNo;
  has_emergency_exit: YesNo;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  vehicle_id?: string;
  Vehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
}

// VehicleDetailLifeCycle Interface
export interface VehicleDetailLifeCycle extends Record<string, unknown> {
  // Primary Fields
  vehicle_details_life_cycle_id: string;

  // Lifecycle Start
  service_start_date?: string;
  service_start_date_f?: string;
  service_start_odometer_reading?: number;

  // Lifecycle End
  service_end_date?: string;
  service_end_date_f?: string;
  service_end_odometer_reading?: number;

  // Estimated Life
  life_estimate_max_month_year?: string;
  life_estimate_max_month_year_f?: string;
  life_estimate_max_odometer_reading?: number;

  // Lifecycle Status
  life_expiry: LifeExpiry;
  is_extended_life_approved: YesNo;
  life_status: VehicleLifeStatus;
  life_expiry_message?: string;
  life_expiry_note?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - One To One
  vehicle_id?: string;
  Vehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
}

// VehicleDetailPurchase Interface
export interface VehicleDetailPurchase extends Record<string, unknown> {
  // Primary Fields
  vehicle_details_purchase_id: string;

  purchase_date?: string;
  purchase_date_f?: string;
  purchase_notes?: string;
  purchase_vehicle_type: PurchaseVehicleType;
  purchase_type: PurchaseType;
  purchase_total_amount?: number;

  // Loan Details
  loan_amount?: number;
  loan_down_payment?: number;
  loan_interest_rate?: number;
  loan_interest_type?: LoanInterestType;
  loan_no_of_installments?: number;
  loan_first_payment_date?: string;
  loan_first_payment_date_f?: string;
  loan_last_payment_date?: string;
  loan_last_payment_date_f?: string;
  loan_monthly_emi?: number;
  loan_emi_date?: number;

  // Lease Details
  lease_start_date?: string;
  lease_start_date_f?: string;
  lease_end_date?: string;
  lease_end_date_f?: string;
  lease_security_deposit_amount?: number;
  lease_monthly_emi_amount?: number;
  lease_emi_date?: number;

  // Warranty Info
  warranty_expiration_date?: string;
  warranty_expiration_date_f?: string;
  warranty_max_odometer_reading?: number;
  warranty_exchange_date?: string;
  warranty_exchange_date_f?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  vehicle_id?: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  purchase_vendor_id?: string;
  PurchaseVendor?: FleetVendor;
  purchase_vendor_name?: string;

  loan_lender_id?: string;
  LoanLender?: FleetVendor;
  loan_lender_name?: string;

  lease_vendor_id?: string;
  LeaseVendor?: FleetVendor;
  lease_vendor_name?: string;
}

// VehicleDocument Interface
export interface VehicleDocument extends Record<string, unknown> {
  // Primary Fields
  vehicle_document_id: string;
  sub_vehicle_document_id: number;
  vehicle_document_code?: string;

  // Document Details
  document_number?: string;
  document_authorized_name?: string;
  document_cost?: number;
  document_issue_date?: string;
  document_issue_date_f?: string;
  document_valid_till_date?: string;
  document_valid_till_date_f?: string;
  document_renewal_date?: string;
  document_renewal_date_f?: string;
  document_validity_status: DocumentValidityStatus;
  document_status: DocumentStatus;
  document_details_1?: string;
  document_details_2?: string;
  document_details_3?: string;
  document_details_4?: string;
  document_notes?: string;

  //  Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  document_type_id: string;
  MasterVehicleDocumentType?: MasterVehicleDocumentType;
  document_type?: string;

  vendor_id?: string;
  FleetVendor?: FleetVendor;
  vendor_name?: string;

  // Relations - Child
  VehicleDocumentFile?: VehicleDocumentFile[];
  VehicleDocumentExpiry?: VehicleDocumentExpiry[];

  // Relations - Child Count
  _count?: {
    VehicleDocumentFile?: number;
    VehicleDocumentExpiry?: number;
  };
}

// VehicleDocumentFile Interface
export interface VehicleDocumentFile extends BaseCommonFile {
  // Primary Fields
  vehicle_document_file_id: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  vehicle_document_id: string;
  VehicleDocument?: VehicleDocument;
}

// VehicleDocumentExpiry Interface
export interface VehicleDocumentExpiry extends Record<string, unknown> {
  // Primary Fields
  document_expiry_id: string;

  expiry_type: ExpiryType;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  vehicle_document_id: string
  VehicleDocument?: VehicleDocument;
}

// VehicleOdometerHistory Interface
export interface VehicleOdometerHistory extends Record<string, unknown> {
  // Primary Fields
  vehicle_odometer_history_id: string;
  odometer_reading: number;
  odometer_date: string;
  odometer_date_f?: string;
  odometer_source: OdometerSource;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
}

// ✅ MasterVehicleFile Schema
export const MasterVehicleFileSchema = BaseFileSchema.extend({
  organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  vehicle_id: single_select_optional('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
});
export type MasterVehicleFileDTO = z.infer<typeof MasterVehicleFileSchema>;

// ✅ CalibrationFile Schema
export const CalibrationFileSchema = z.object({
  calibration_file_url: stringMandatory('Calibration File URL', 0, 300),
  calibration_file_key: stringMandatory('Calibration File Key', 0, 300),
  calibration_file_name: stringMandatory('Calibration File Name', 0, 300),
});
export type CalibrationFileDTO = z.infer<typeof CalibrationFileSchema>;

// ✅ Vehicle Create/Update Schema
export const VehicleSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation

  vehicle_number: stringMandatory('Vehicle Number', 2, 50),
  vehicle_name: stringOptional('Vehicle Name', 0, 50),
  odometer_reading: numberOptional('Odometer Reading'),

  engine_number: stringOptional('Engine Number', 0, 20),
  chassis_number: stringOptional('Chassis Number', 0, 20),
  vehicle_make_year: numberOptional('Vehicle Make Year'),

  is_fleet_active: enumMandatory('Is Fleet Active', YesNo, YesNo.Yes),
  is_gps_active: enumMandatory('Is GPS Active', YesNo, YesNo.No),
  is_trip_active: enumMandatory('Is Trip Active', YesNo, YesNo.No),

  status: enumMandatory('Status', Status, Status.Active),

  organisation_sub_company_id: single_select_optional(
    'Organisation Sub Company ID',
  ), // ✅ Single-Selection -> OrganisationSubCompany
  organisation_branch_id: single_select_optional('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch
  organisation_tag_id: single_select_optional('OrganisationTag'), // ✅ Single-Selection -> OrganisationTag
  organisation_color_id: single_select_optional('OrganisationColor'), // ✅ Single-Selection -> OrganisationColor
  organisation_group_ids: multi_select_optional('OrganisationGroup'), // Multi selection -> OrganisationGroup

  vehicle_type_id: single_select_mandatory('MasterVehicleType'), // ✅ Single-Selection -> MasterVehicleType
  vehicle_make_id: single_select_optional('MasterVehicleMake'), // ✅ Single-Selection -> MasterVehicleMake
  vehicle_model_id: single_select_optional('MasterVehicleModel'), // ✅ Single-Selection -> MasterVehicleModel
  vehicle_sub_model_id: single_select_optional('MasterVehicleSubModel'), // ✅ Single-Selection -> MasterVehicleSubModel
  vehicle_status_type_id: single_select_optional('MasterVehicleStatusType'), // ✅ Single-Selection -> MasterVehicleStatusType
  vehicle_ownership_type_id: single_select_optional(
    'MasterVehicleOwnershipType',
  ), // ✅ Single-Selection -> MasterVehicleOwnershipType
  vehicle_associated_to_id: single_select_optional('MasterVehicleAssociatedTo'), // ✅ Single-Selection -> MasterVehicleAssociatedTo

  // Fuel
  vehicle_fuel_type_id: single_select_optional('MasterVehicleFuelType'), // ✅ Single-Selection -> MasterVehicleFuelType
  vehicle_fuel_unit_id: single_select_optional('MasterVehicleFuelUnit'), // ✅ Single-Selection -> MasterVehicleFuelUnit
  secondary_vehicle_fuel_type_id: single_select_optional(
    'Vehicle Secondary Fuel Type ID',
  ), // ✅ Single-Selection -> MasterVehicleFuelType
  secondary_vehicle_fuel_unit_id: single_select_optional(
    'Vehicle Secondary Fuel Unit ID',
  ), // ✅ Single-Selection -> MasterVehicleFuelUnit
  fuel_tank_type: enumOptional(
    'Fuel Tank Type',
    FuelTankType,
    FuelTankType.SingleTank,
  ),
  fuel_tank_size: numberOptional('Fuel Tank Quantity'),
  fuel_tank_1_size: numberOptional('Tank 1 Fuel Quantity'),
  fuel_tank_2_size: numberOptional('Tank 2 Fuel Quantity'),
  fuel_tank_total_size: numberOptional('Fuel Tank Full Quantity'),

  // Bus Seats
  vehicle_passenger_capacity: numberOptional('Vehicle Passenger Capacity'),
  standing_passenger_capacity: numberOptional('Standing Passenger Capacity'),

  MasterVehicleFileSchema: nestedArrayOfObjectsOptional(
    'MasterVehicleFileSchema',
    MasterVehicleFileSchema,
    [],
  ),
});
export type VehicleDTO = z.infer<typeof VehicleSchema>;

// ✅ Vehicle Create/Update Schema
export const VehicleBulkSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation

  vehicle_number: stringMandatory('Vehicle Number', 2, 50),
  vehicle_name: stringOptional('Vehicle Name', 0, 50),
  odometer_reading: numberOptional('Odometer Reading'),

  engine_number: stringOptional('Engine Number', 0, 20),
  chassis_number: stringOptional('Chassis Number', 0, 20),
  vehicle_make_year: numberOptional('Vehicle Make Year'),

  is_fleet_active: enumMandatory('Is Fleet Active', YesNo, YesNo.Yes),
  is_gps_active: enumMandatory('Is GPS Active', YesNo, YesNo.No),
  is_trip_active: enumMandatory('Is Trip Active', YesNo, YesNo.No),

  status: enumMandatory('Status', Status, Status.Active),

  vehicle_type_id: single_select_mandatory('MasterVehicleType'), // ✅ Single-Selection -> MasterVehicleType

  device_manufacturer_id: single_select_optional('MasterDeviceManufacturer'), // ✅ Single-Selection -> MasterDeviceManufacturer
  device_model_id: single_select_optional('MasterDeviceModel'), // ✅ Single-Selection -> MasterDeviceModel
  device_type_id: single_select_optional('MasterDeviceType'), // ✅ Single-Selection -> MasterDeviceType

  country_id: single_select_optional('MasterMainCountry'), // ✅ Single-Selection -> MasterMainCountry
  time_zone_id: single_select_optional('MasterMainTimeZone'), // ✅ Single-Selection -> MasterMainTimeZone

  fuel_tank_type: enumOptional(
    'Fuel Tank Type',
    FuelTankType,
    FuelTankType.SingleTank,
  ),
  fuel_tank_size: numberOptional('Fuel Tank Quantity'),
  fuel_tank_1_size: numberOptional('Tank 1 Fuel Quantity'),
  fuel_tank_2_size: numberOptional('Tank 2 Fuel Quantity'),
  fuel_tank_total_size: numberOptional('Fuel Tank Full Quantity'),

  // Bus Seats
  vehicle_passenger_capacity: numberOptional('Vehicle Passenger Capacity'),
  standing_passenger_capacity: numberOptional('Standing Passenger Capacity'),
});
export type VehicleBulkDTO = z.infer<typeof VehicleBulkSchema>;

// ✅ MasterDeviceFile Schema -> DeviceImage/VehicleImage/SimImage/Other
export const MasterDeviceFileSchema = BaseFileSchema.extend({
  organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  device_id: single_select_optional('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
});
export type MasterDeviceFileDTO = z.infer<typeof MasterDeviceFileSchema>;

// ✅ Vehicle Device Link Schema
export const VehicleDeviceLinkSchema = z.object({
  device_id: single_select_mandatory('MasterDevice'), // ✅ Single-Selection -> MasterDevice
  device_manufacturer_id: single_select_mandatory('MasterDeviceManufacturer'), // ✅ Single-Selection -> MasterDeviceManufacturer
  device_model_id: single_select_mandatory('MasterDeviceModel'), // ✅ Single-Selection -> MasterDeviceModel
  device_type_id: single_select_mandatory('MasterDeviceType'), // ✅ Single-Selection -> MasterDeviceType

  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  country_id: single_select_mandatory('MasterMainCountry'), // ✅ Single-Selection -> MasterMainCountry
  time_zone_id: single_select_mandatory('MasterMainTimeZone'), // ✅ Single-Selection -> MasterMainTimeZone
  vehicle_id: single_select_mandatory('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle

  temperature: enumOptional('Temperature', YesNo, YesNo.No),
  duel_temperature: enumOptional('Dual Temperature', YesNo, YesNo.No),
  fuel: enumOptional('Fuel', YesNo, YesNo.No),
  fuel_bluetooth: enumOptional('Fuel Bluetooth', YesNo, YesNo.No),
  fuel_tank_type: enumOptional(
    'Fuel Tank Type',
    FuelTankType,
    FuelTankType.SingleTank,
  ),
  fuel_tank_size: numberOptional('Fuel Tank Quantity'),
  fuel_tank_1_size: numberOptional('Tank 1 Fuel Quantity'),
  fuel_tank_2_size: numberOptional('Tank 2 Fuel Quantity'),
  fuel_tank_total_size: numberOptional('Fuel Tank Full Quantity'),
  over_speed_kmph: numberOptional('Over Speed KMPH'),
  is_obd: enumOptional('Is OBD', YesNo, YesNo.No),
  gps_lock_relay: enumOptional('GPS Lock Relay', YesNo, YesNo.No),
  gps_door_locker: enumOptional('GPS Door Locker', YesNo, YesNo.No),
  door_sensor: enumOptional('Door Sensor', YesNo, YesNo.No),
  genset_sensor: enumOptional('Genset Sensor', YesNo, YesNo.No),
  dashcam_sensor: enumOptional('Dashcam Sensor', YesNo, YesNo.No),
  is_rear_cam: enumOptional('Is Rear Cam', YesNo, YesNo.No),
  is_front_cam: enumOptional('Is Front Cam', YesNo, YesNo.No),
  camera_extra_count: numberOptional('Camera Extra Count'),
  fuel_mapping: dynamicJsonSchema('Fuel Mapping'),

  MasterDeviceFileSchema: nestedArrayOfObjectsOptional(
    'MasterDeviceFileSchema',
    MasterDeviceFileSchema,
    [],
  ),
});
export type VehicleDeviceLinkDTO = z.infer<typeof VehicleDeviceLinkSchema>;

// ✅ Vehicle Device Unlink Schema
export const VehicleDeviceUnlinkSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  vehicle_id: single_select_mandatory('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
  device_id: single_select_mandatory('MasterDevice'), // ✅ Single-Selection -> MasterDevice
});
export type VehicleDeviceUnlinkDTO = z.infer<typeof VehicleDeviceUnlinkSchema>;

// ✅ Vehicle Driver Link Schema
export const VehicleDriverLinkSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  vehicle_id: single_select_mandatory('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
  driver_id: single_select_mandatory('MasterDriver'), // ✅ Single-Selection -> MasterDriver
});
export type VehicleDriverLinkDTO = z.infer<typeof VehicleDriverLinkSchema>;

// ✅ VehicleDetailGPSSensor Schema
export const VehicleDetailGPSSensorSchema = z.object({
  temperature: enumOptional('Temperature', YesNo, YesNo.No),
  duel_temperature: enumOptional('Dual Temperature', YesNo, YesNo.No),
  fuel: enumOptional('Fuel', YesNo, YesNo.No),
  fuel_bluetooth: enumOptional('Fuel Bluetooth', YesNo, YesNo.No),
  fuel_tank_type: enumOptional(
    'Fuel Tank Type',
    FuelTankType,
    FuelTankType.SingleTank,
  ),
  fuel_tank_size: numberOptional('Fuel Tank Quantity'),
  fuel_tank_1_size: numberOptional('Tank 1 Fuel Quantity'),
  fuel_tank_2_size: numberOptional('Tank 2 Fuel Quantity'),
  fuel_tank_total_size: numberOptional('Fuel Tank Full Quantity'),
  over_speed_kmph: numberOptional('Over Speed KMPH'),
  is_obd: enumOptional('Is OBD', YesNo, YesNo.No),
  gps_lock_relay: enumOptional('GPS Lock Relay', YesNo, YesNo.No),
  gps_door_locker: enumOptional('GPS Door Locker', YesNo, YesNo.No),
  door_sensor: enumOptional('Door Sensor', YesNo, YesNo.No),
  genset_sensor: enumOptional('Genset Sensor', YesNo, YesNo.No),
  dashcam_sensor: enumOptional('Dashcam Sensor', YesNo, YesNo.No),
  is_rear_cam: enumOptional('Is Rear Cam', YesNo, YesNo.No),
  is_front_cam: enumOptional('Is Front Cam', YesNo, YesNo.No),
  camera_extra_count: numberOptional('Camera Extra Count'),
  fuel_mapping: dynamicJsonSchema('Fuel Mapping'),
});
export type VehicleDetailGPSSensorDTO = z.infer<
  typeof VehicleDetailGPSSensorSchema
>;

// ✅ VehicleDetailTrip Schema
export const VehicleDetailTripSchema = z.object({
  trip_name: stringOptional('Trip Name', 0, 100),
  trip_no: stringOptional('Trip Name', 0, 100),
  eway_bill_number: stringOptional('E-Way Bill Number', 0, 100),
  route_name: stringOptional('Route Name', 0, 100),

  trip_start_date: dateOptional('Trip Start Date'),
  trip_end_date: dateOptional('Trip End Date'),

  trip_notes_1: stringOptional('Trip Notes 1', 0, 200),
  trip_notes_2: stringOptional('Trip Notes 2', 0, 200),
  trip_notes_3: stringOptional('Trip Notes 3', 0, 200),

  status: enumMandatory('Status', Status, Status.Active),
});
export type VehicleDetailTripDTO = z.infer<typeof VehicleDetailTripSchema>;

// ✅ VehicleDetailBody Schema
export const VehicleDetailBodySchema = z.object({
  // 📦 Body & Dimension (Common)
  vehicle_body_details: stringOptional('Vehicle Body Details', 0, 300),
  vehicle_height: doubleOptional('Vehicle Height'),
  vehicle_width: doubleOptional('Vehicle Width'),
  vehicle_length: doubleOptional('Vehicle Length'),
  wheel_base: doubleOptional('Wheel Base'),
  number_of_doors: numberOptional('Number Of Doors'),

  // Passenger Configuration (Cars/Buses)
  vehicle_passenger_capacity: numberOptional('Vehicle Passenger Capacity'),
  standing_passenger_capacity: numberOptional('Standing Passenger Capacity'),
  seat_configuration: stringOptional('Seat Configuration', 0, 100),
  has_air_conditioning: enumMandatory('Has Air Conditioning', YesNo, YesNo.No),
  has_heating_system: enumMandatory('Has Heating System', YesNo, YesNo.No),
  has_reclining_seats: enumMandatory('Has Reclining Seats', YesNo, YesNo.No),
  has_safety_belts: enumMandatory('Has Safety Belts', YesNo, YesNo.No),
  has_headrests: enumMandatory('Has Headrests', YesNo, YesNo.No),
  has_armrests: enumMandatory('Has Armrests', YesNo, YesNo.No),
  has_infotainment_system: enumMandatory(
    'Has Infotainment System',
    YesNo,
    YesNo.No,
  ),
  infotainment_type: stringOptional('Infotainment Type', 0, 100),
  has_individual_lighting: enumMandatory(
    'Has Individual Lighting',
    YesNo,
    YesNo.No,
  ),
  has_overhead_luggage_storage: enumMandatory(
    'Has Overhead Luggage Storage',
    YesNo,
    YesNo.No,
  ),
  wheelchair_accessible: enumMandatory(
    'Wheelchair Accessible',
    YesNo,
    YesNo.No,
  ),

  // Cargo Configuration (Trucks/Vans)
  vehicle_cargo_volume: doubleOptional('Vehicle Cargo Volume'),
  vehicle_maximum_weight_capacity: doubleOptional(
    'Vehicle Maximum Weight Capacity',
  ),
  cargo_area_type: stringOptional('Cargo Area Type', 0, 100),
  has_lift_gate: enumMandatory('Has Lift Gate', YesNo, YesNo.No),
  has_refrigeration_unit: enumMandatory(
    'Has Refrigeration Unit',
    YesNo,
    YesNo.No,
  ),
  refrigeration_temperature_range: stringOptional(
    'Refrigeration Temperature Range',
    0,
    100,
  ),
  cargo_bed_length: doubleOptional('Cargo Bed Length'),
  cargo_bed_width: doubleOptional('Cargo Bed Width'),
  cargo_bed_height: doubleOptional('Cargo Bed Height'),
  cargo_floor_material: stringOptional('Cargo Floor Material', 0, 100),
  has_side_doors: enumMandatory('Has Side Doors', YesNo, YesNo.No),
  has_roof_hatch: enumMandatory('Has Roof Hatch', YesNo, YesNo.No),
  cargo_tie_down_hooks_count: numberOptional('Cargo Tie Down Hooks Count'),
  is_custom_body_built: enumMandatory('Is Custom Body Built', YesNo, YesNo.No),

  number_of_axles: numberOptional('Number Of Axles'),
  axle_configuration: stringOptional('Axle Configuration', 0, 50),
  has_dual_rear_wheels: enumMandatory('Has Dual Rear Wheels', YesNo, YesNo.No),
  suspension_type: stringOptional('Suspension Type', 0, 100),
  suspension_adjustability: enumMandatory(
    'Suspension Adjustability',
    YesNo,
    YesNo.No,
  ),
  ground_clearance_mm: doubleOptional('Ground Clearance MM'),
  tire_size: stringOptional('Tire Size', 0, 50),
  has_spare_tire: enumMandatory('Has Spare Tire', YesNo, YesNo.Yes),
  has_all_terrain_tires: enumMandatory(
    'Has All Terrain Tires',
    YesNo,
    YesNo.No,
  ),
  has_run_flat_tires: enumMandatory('Has Run Flat Tires', YesNo, YesNo.No),
  steering_type: enumMandatory(
    'Steering Type',
    SteeringType,
    SteeringType.Power,
  ),
  wheel_drive_type: enumMandatory(
    'Wheel Drive Type',
    WheelDriveType,
    WheelDriveType.FWD,
  ),

  // 🛡️ Safety Features
  has_abs: enumMandatory('Has ABS', YesNo, YesNo.No),
  has_airbags: enumMandatory('Has Airbags', YesNo, YesNo.No),
  has_speed_limiter: enumMandatory('Has Speed Limiter', YesNo, YesNo.No),
  has_gps_tracker: enumMandatory('Has GPS Tracker', YesNo, YesNo.No),
  has_parking_sensors: enumMandatory('Has Parking Sensors', YesNo, YesNo.No),
  has_rear_camera: enumMandatory('Has Rear Camera', YesNo, YesNo.No),
  has_lane_assist: enumMandatory('Has Lane Assist', YesNo, YesNo.No),
  has_automatic_emergency_brake: enumMandatory(
    'Has Automatic Emergency Brake',
    YesNo,
    YesNo.No,
  ),
  has_tire_pressure_monitoring: enumMandatory(
    'Has Tire Pressure Monitoring',
    YesNo,
    YesNo.No,
  ),
  has_blind_spot_monitoring: enumMandatory(
    'Has Blind Spot Monitoring',
    YesNo,
    YesNo.No,
  ),
  has_collision_warning_system: enumMandatory(
    'Has Collision Warning System',
    YesNo,
    YesNo.No,
  ),
  has_immobilizer: enumMandatory('Has Immobilizer', YesNo, YesNo.No),
  has_dashcam: enumMandatory('Has DashCam', YesNo, YesNo.No),
  has_emergency_exit: enumMandatory('Has Emergency Exit', YesNo, YesNo.No),

  status: enumMandatory('Status', Status, Status.Active),
});
export type VehicleDetailBodyDTO = z.infer<typeof VehicleDetailBodySchema>;

// ✅ VehicleDetailLifeCycle Schema
export const VehicleDetailLifeCycleSchema = z.object({
  // Lifecycle Start
  service_start_date: dateOptional('Service Start Date'),
  service_start_odometer_reading: numberOptional(
    'Service Start Odometer Reading',
  ),

  // Lifecycle End
  service_end_date: dateOptional('Service End Date'),
  service_end_odometer_reading: numberOptional('Service End Odometer Reading'),

  // Estimated Life
  life_estimate_max_month_year: dateOptional('Life Estimate Max Month/Year'),
  life_estimate_max_odometer_reading: numberOptional(
    'Life Estimate Max Odometer Reading',
  ),

  // Lifecycle Status
  life_expiry: enumMandatory('Life Expiry', LifeExpiry, LifeExpiry.No),
  is_extended_life_approved: enumMandatory(
    'Is Extended Life Approved',
    YesNo,
    YesNo.No,
  ),
  life_status: enumMandatory(
    'Life Status',
    VehicleLifeStatus,
    VehicleLifeStatus.Active,
  ),
  life_expiry_message: stringOptional('Life Expiry Message', 0, 300),
  life_expiry_note: stringOptional('Life Expiry Note', 0, 2000),

  status: enumMandatory('Status', Status, Status.Active),
});
export type VehicleDetailLifeCycleDto = z.infer<
  typeof VehicleDetailLifeCycleSchema
>;

// ✅ VehicleDetailPurchase Schema
export const VehicleDetailPurchaseSchema = z.object({
  // Basic Purchase Info
  purchase_date: dateOptional('Purchase Date'),
  purchase_notes: stringOptional('Purchase Notes', 0, 300),
  purchase_vehicle_type: enumMandatory(
    'Purchase Vehicle Type',
    PurchaseVehicleType,
    PurchaseVehicleType.New,
  ),
  purchase_type: enumMandatory(
    'Purchase Type',
    PurchaseType,
    PurchaseType.NoFinance,
  ),
  purchase_total_amount: doubleOptionalAmount('Purchase Total Amount', 2),

  // Loan Details
  loan_amount: doubleOptionalAmount('Loan Amount', 2),
  loan_down_payment: doubleOptionalAmount('Loan Down Payment', 2),
  loan_interest_rate: doubleOptionalAmount('Loan Interest Rate', 2),
  loan_interest_type: enumOptional(
    'Loan Interest Type',
    LoanInterestType,
    LoanInterestType.Simple,
  ),
  loan_no_of_installments: numberOptional('Loan No of Installments'),
  loan_first_payment_date: dateOptional('Loan First Payment Date'),
  loan_last_payment_date: dateOptional('Loan Last Payment Date'),
  loan_monthly_emi: doubleOptionalAmount('Loan Monthly EMI'),
  loan_emi_date: numberOptional('Loan EMI Date'),

  // Lease Details
  lease_start_date: dateOptional('Lease Start Date'),
  lease_end_date: dateOptional('Lease End Date'),
  lease_security_deposit_amount: doubleOptionalAmount(
    'Lease Security Deposit Amount',
    2,
  ),
  lease_monthly_emi_amount: doubleOptionalAmount('Lease Monthly EMI Amount', 2),
  lease_emi_date: numberOptional('Lease EMI Date'),

  // Warranty Info
  warranty_expiration_date: dateOptional('Warranty Expiration Date'),
  warranty_max_odometer_reading: numberOptional(
    'Warranty Max Odometer Reading',
  ),
  warranty_exchange_date: dateOptional('Warranty Exchange Date'),

  purchase_vendor_id: single_select_optional('Purchase Vendor ID'),
  loan_lender_id: single_select_optional('Loan Lender ID'),
  lease_vendor_id: single_select_optional('Lease Vendor ID'),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type VehicleDetailPurchaseDTO = z.infer<
  typeof VehicleDetailPurchaseSchema
>;

// ✅ VehicleDocumentFile Schema
export const VehicleDocumentFileSchema = BaseFileSchema.extend({
  organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  vehicle_document_id: single_select_optional('VehicleDocument'), // ✅ Single-Selection -> VehicleDocument
});
export type VehicleDocumentFileDTO = z.infer<
  typeof VehicleDocumentFileSchema
>;

// ✅ VehicleDocument Schema
export const VehicleDocumentSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  vehicle_id: single_select_mandatory('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle

  document_type_id: single_select_mandatory('MasterVehicleDocumentType'), // ✅ Single-Selection -> MasterVehicleDocumentType
  vendor_id: single_select_optional('FleetVendor'), // ✅ Single-Selection -> FleetVendor

  vehicle_document_code: stringOptional('vehicle Document Code', 0, 50),
  document_number: stringOptional('vehicle Document Code', 0, 100),
  document_authorized_name: stringOptional('vehicle Document Code', 0, 100),
  document_cost: doubleOptional('Document Cost'),
  document_issue_date: dateOptional('Document Issue Date'),
  document_valid_till_date: dateOptional('Document Valid Till Date'),
  document_renewal_date: dateOptional('Document Renewal Date'),
  document_validity_status: enumMandatory(
    'DocumentValidityStatus',
    DocumentValidityStatus,
    DocumentValidityStatus.Valid,
  ),
  document_status: enumMandatory(
    'DocumentStatus',
    DocumentStatus,
    DocumentStatus.Active,
  ),
  document_details_1: stringOptional('Document Details 1', 0, 200),
  document_details_2: stringOptional('Document Details 2', 0, 200),
  document_details_3: stringOptional('Document Details 3', 0, 200),
  document_details_4: stringOptional('Document Details 4', 0, 200),
  document_notes: stringOptional('Document Notes', 0, 2000),

  status: enumMandatory('Status', Status, Status.Active),

  time_zone_id: single_select_mandatory('MasterMainTimeZone'),

  VehicleDocumentFileSchema: nestedArrayOfObjectsOptional(
    'VehicleDocumentFileSchema',
    VehicleDocumentFileSchema,
    [],
  ),
});
export type VehicleDocumentDTO = z.infer<typeof VehicleDocumentSchema>;

// ✅ VehicleDocument Query Schema
export const VehicleDocumentQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-Selection -> MasterVehicle
  document_type_ids: multi_select_optional('MasterVehicleDocumentType'), // ✅ Multi-Selection -> MasterVehicleDocumentType
  vendor_ids: multi_select_optional('FleetVendor'), // ✅ Multi-Selection -> FleetVendor
  vehicle_document_ids: multi_select_optional('VehicleDocument'), // ✅ Multi-Selection -> VehicleDocument
});
export type VehicleDocumentQueryDTO = z.infer<
  typeof VehicleDocumentQuerySchema
>;

// ✅ VehicleDocumentExpiry Schema
export const VehicleDocumentExpirySchema = z.object({
  organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  vehicle_id: single_select_optional('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
  vehicle_document_id: single_select_optional('VehicleDocument'), // ✅ Single-Selection -> VehicleDocument
  expiry_type: enumMandatory('Expiry Type', ExpiryType, ExpiryType.Expiring),

  status: enumMandatory('Status', Status, Status.Active),
});
export type VehicleDocumentExpiryDTO = z.infer<
  typeof VehicleDocumentExpirySchema
>;

// ✅ VehicleDocumentExpiry Query Schema
export const VehicleDocumentExpiryQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-selection -> MasterVehicle
  vehicle_document_ids: multi_select_optional('VehicleDocument'), // ✅ Multi-selection -> VehicleDocument
  document_expiry_ids: multi_select_optional('VehicleDocumentExpiry'), // ✅ Multi-selection -> VehicleDocumentExpiry

  expiry_type: enumArrayOptional(
    'Expiry Type',
    ExpiryType,
    getAllEnums(ExpiryType),
  ),
});
export type VehicleDocumentExpiryQueryDTO = z.infer<
  typeof VehicleDocumentExpiryQuerySchema
>;

// ✅ Vehicle Query Schema
export const VehicleQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation

  is_driver_assigned: enumArrayOptional(
    'Is Device Installed',
    YesNo,
    getAllEnums(YesNo),
  ),
  driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-Selection -> MasterDriver

  is_device_installed: enumArrayOptional(
    'Is Device Installed',
    YesNo,
    getAllEnums(YesNo),
  ),
  device_ids: multi_select_optional('MasterDevice'), // ✅ Multi-Selection -> MasterDevice

  organisation_sub_company_ids: multi_select_optional('OrganisationSubCompany'), // ✅ Multi-Selection -> OrganisationSubCompany
  organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-Selection -> OrganisationBranch
  organisation_tag_ids: multi_select_optional('OrganisationTag'), // ✅ Multi-Selection -> OrganisationTag
  organisation_color_ids: multi_select_optional('OrganisationColor'), // ✅ Multi-Selection -> OrganisationColor

  vehicle_type_ids: multi_select_optional('MasterVehicleType'), // ✅ Multi-Selection -> MasterVehicleType
  vehicle_make_ids: multi_select_optional('MasterVehicleMake'), // ✅ Multi-Selection -> MasterVehicleMake
  vehicle_model_ids: multi_select_optional('MasterVehicleModel'), // ✅ Multi-Selection -> MasterVehicleModel
  vehicle_sub_model_ids: multi_select_optional('MasterVehicleSubModel'), // ✅ Multi-Selection -> MasterVehicleSubModel
  vehicle_status_type_ids: multi_select_optional('MasterVehicleStatusType'), // ✅ Multi-Selection -> MasterVehicleStatusType
  vehicle_ownership_type_ids: multi_select_optional(
    'MasterVehicleOwnershipType',
  ), // ✅ Multi-Selection -> MasterVehicleOwnershipType
  vehicle_associated_to_ids: multi_select_optional('MasterVehicleAssociatedTo'), // ✅ Multi-Selection -> MasterVehicleAssociatedTo

  vehicle_fuel_type_ids: multi_select_optional('MasterVehicleFuelType'), // ✅ Multi-Selection -> MasterVehicleFuelType
  vehicle_fuel_unit_ids: multi_select_optional('MasterVehicleFuelUnit'), // ✅ Multi-Selection -> MasterVehicleFuelUnit

  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-Selection -> MasterVehicle

  gps_vehicle_category: enumOptional(
    'GPS Vehicle Category',
    GPSVehicleCategory,
    GPSVehicleCategory.ALL,
  ),
});
export type VehicleQueryDTO = z.infer<typeof VehicleQuerySchema>;

// ✅ Simple Find Query Schema
export const SimpleFindQuerySchema = BaseQuerySchema.extend({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
});
export type SimpleFindQueryDTO = z.infer<typeof SimpleFindQuerySchema>;

// ✅ Vehicle GPS Query Schema
export const VehicleGPSQuerySchema = BaseQuerySchema.extend({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  vehicle_id: single_select_mandatory('MasterVehicle'), // Single-selection -> MasterVehicle
});
export type VehicleGPSQueryDTO = z.infer<typeof VehicleGPSQuerySchema>;

// Convert Vehicle Data to API Payload
export const toVehiclePayload = (row: MasterVehicle): VehicleDTO => ({
  organisation_id: row.organisation_id || '',

  vehicle_number: row.vehicle_number || '',
  vehicle_name: row.vehicle_name || '',

  engine_number: row.engine_number || '',
  chassis_number: row.chassis_number || '',
  vehicle_make_year: row.vehicle_make_year || 0,

  is_fleet_active: row.is_fleet_active || YesNo.No,
  is_gps_active: row.is_gps_active || YesNo.No,
  is_trip_active: row.is_trip_active || YesNo.No,

  organisation_sub_company_id: row.organisation_sub_company_id || '',
  organisation_branch_id: row.organisation_branch_id || '',
  organisation_tag_id: row.organisation_tag_id || '',
  organisation_color_id: row.organisation_color_id || '',
  organisation_group_ids: row.VehicleOrganisationGroupLink?.map((v) => v.organisation_group_id) || [],

  vehicle_type_id: row.vehicle_type_id || '',
  vehicle_make_id: row.vehicle_make_id || '',
  vehicle_model_id: row.vehicle_model_id || '',
  vehicle_sub_model_id: row.vehicle_sub_model_id || '',
  vehicle_status_type_id: row.vehicle_status_type_id || '',
  vehicle_ownership_type_id: row.vehicle_ownership_type_id || '',
  vehicle_associated_to_id: row.vehicle_associated_to_id || '',

  vehicle_fuel_type_id: row.vehicle_fuel_type_id || '',
  vehicle_fuel_unit_id: row.vehicle_fuel_unit_id || '',

  secondary_vehicle_fuel_type_id: row.secondary_vehicle_fuel_type_id || '',
  secondary_vehicle_fuel_unit_id: row.secondary_vehicle_fuel_unit_id || '',

  odometer_reading: row.odometer_reading || 0,

  fuel_tank_type: row.fuel_tank_type || FuelTankType.SingleTank,
  fuel_tank_size: row.fuel_tank_size || 0,
  fuel_tank_1_size: row.fuel_tank_1_size || 0,
  fuel_tank_2_size: row.fuel_tank_2_size || 0,
  fuel_tank_total_size: row.fuel_tank_total_size || 0,

  vehicle_passenger_capacity: row.vehicle_passenger_capacity || 0,
  standing_passenger_capacity: row.standing_passenger_capacity || 0,

  status: row.status || Status.Active,

  MasterVehicleFileSchema: row.MasterVehicleFile?.map((file) => ({
    vehicle_file_id: file.vehicle_file_id || '',

    usage_type: file.usage_type,

    file_type: file.file_type,
    file_url: file.file_url || '',
    file_key: file.file_key || '',
    file_name: file.file_name || '',
    file_description: file.file_description || '',
    file_size: file.file_size || 0,
    file_metadata: file.file_metadata || {},

    status: file.status,
    added_date_time: file.added_date_time,
    modified_date_time: file.modified_date_time,

    organisation_id: file.organisation_id ?? '',
    vehicle_id: file.vehicle_id ?? '',
  })) ?? [],
});

// Create New Vehicle Payload
export const newVehiclePayload = (): VehicleDTO => ({
  organisation_id: '',

  vehicle_number: '',
  vehicle_name: '',

  engine_number: '',
  chassis_number: '',
  vehicle_make_year: 0,

  is_fleet_active: YesNo.No,
  is_gps_active: YesNo.No,
  is_trip_active: YesNo.No,

  organisation_sub_company_id: '',
  organisation_branch_id: '',
  organisation_tag_id: '',
  organisation_color_id: '',
  organisation_group_ids: [],

  vehicle_type_id: '',
  vehicle_make_id: '',
  vehicle_model_id: '',
  vehicle_sub_model_id: '',
  vehicle_status_type_id: '',
  vehicle_ownership_type_id: '',
  vehicle_associated_to_id: '',

  vehicle_fuel_type_id: '',
  vehicle_fuel_unit_id: '',
  secondary_vehicle_fuel_type_id: '',
  secondary_vehicle_fuel_unit_id: '',

  odometer_reading: 0,

  fuel_tank_type: FuelTankType.SingleTank,
  fuel_tank_size: 0,
  fuel_tank_1_size: 0,
  fuel_tank_2_size: 0,
  fuel_tank_total_size: 0,

  vehicle_passenger_capacity: 0,
  standing_passenger_capacity: 0,

  status: Status.Active,

  MasterVehicleFileSchema: [],
});

// Convert VehicleDetailGPS Data to API Payload
export const toVehicleDetailsGPSPayload = (vehicleGPS?: VehicleDetailGPS): VehicleDetailGPSSensorDTO => ({
  temperature: vehicleGPS?.temperature || YesNo.No,
  duel_temperature: vehicleGPS?.duel_temperature || YesNo.No,
  fuel: vehicleGPS?.fuel || YesNo.No,
  fuel_bluetooth: vehicleGPS?.fuel_bluetooth || YesNo.No,
  fuel_tank_type: vehicleGPS?.fuel_tank_type || FuelTankType.SingleTank,
  fuel_tank_size: vehicleGPS?.fuel_tank_size || 0,
  fuel_tank_1_size: vehicleGPS?.fuel_tank_1_size || 0,
  fuel_tank_2_size: vehicleGPS?.fuel_tank_2_size || 0,
  fuel_tank_total_size: vehicleGPS?.fuel_tank_total_size || 0,
  over_speed_kmph: vehicleGPS?.over_speed_kmph || 0,
  is_obd: vehicleGPS?.is_obd || YesNo.No,
  gps_lock_relay: vehicleGPS?.gps_lock_relay || YesNo.No,
  gps_door_locker: vehicleGPS?.gps_door_locker || YesNo.No,
  door_sensor: vehicleGPS?.door_sensor || YesNo.No,
  genset_sensor: vehicleGPS?.genset_sensor || YesNo.No,
  dashcam_sensor: vehicleGPS?.dashcam_sensor || YesNo.No,
  is_rear_cam: vehicleGPS?.is_rear_cam || YesNo.No,
  is_front_cam: vehicleGPS?.is_front_cam || YesNo.No,
  camera_extra_count: vehicleGPS?.camera_extra_count || 0,
  fuel_mapping: vehicleGPS?.fuel_mapping || {},
});

// Convert VehicleDetailTrip Data to API Payload
export const toVehicleDetailsTripPayload = (trip?: VehicleDetailTrip): VehicleDetailTripDTO => ({
  trip_name: trip?.trip_name || '',
  trip_no: trip?.trip_no || '',
  eway_bill_number: trip?.eway_bill_number || '',
  route_name: trip?.route_name || '',

  trip_start_date: trip?.trip_start_date || '',
  trip_end_date: trip?.trip_end_date || '',

  trip_notes_1: trip?.trip_notes_1 || '',
  trip_notes_2: trip?.trip_notes_2 || '',
  trip_notes_3: trip?.trip_notes_3 || '',

  status: trip ? trip.status : Status.Active,
});

// Convert VehicleDetailBody Data to API Payload
export const toVehicleDetailsBodyPayload = (vehicleBody?: VehicleDetailBody): VehicleDetailBodyDTO => ({
  // 📦 Body & Dimension (Common)
  vehicle_body_details: vehicleBody?.vehicle_body_details || '',

  vehicle_height: vehicleBody?.vehicle_height || 0,
  vehicle_width: vehicleBody?.vehicle_width || 0,
  vehicle_length: vehicleBody?.vehicle_length || 0,
  wheel_base: vehicleBody?.wheel_base || 0,
  number_of_doors: vehicleBody?.number_of_doors || 0,

  // Passenger Configuration (Cars/Buses)
  vehicle_passenger_capacity: vehicleBody?.vehicle_passenger_capacity || 0,
  standing_passenger_capacity: vehicleBody?.standing_passenger_capacity || 0,
  seat_configuration: vehicleBody?.seat_configuration || '',
  has_air_conditioning: vehicleBody?.has_air_conditioning || YesNo.No,
  has_heating_system: vehicleBody?.has_heating_system || YesNo.No,
  has_reclining_seats: vehicleBody?.has_reclining_seats || YesNo.No,
  has_safety_belts: vehicleBody?.has_safety_belts || YesNo.No,
  has_headrests: vehicleBody?.has_headrests || YesNo.No,
  has_armrests: vehicleBody?.has_armrests || YesNo.No,
  has_infotainment_system: vehicleBody?.has_infotainment_system || YesNo.No,
  infotainment_type: vehicleBody?.infotainment_type || '',
  has_individual_lighting: vehicleBody?.has_individual_lighting || YesNo.No,
  has_overhead_luggage_storage: vehicleBody?.has_overhead_luggage_storage || YesNo.No,
  wheelchair_accessible: vehicleBody?.wheelchair_accessible || YesNo.No,

  // Cargo Configuration (Trucks/Vans)
  vehicle_cargo_volume: vehicleBody?.vehicle_cargo_volume || 0,
  vehicle_maximum_weight_capacity: vehicleBody?.vehicle_maximum_weight_capacity || 0,
  cargo_area_type: vehicleBody?.cargo_area_type || '',
  has_lift_gate: vehicleBody?.has_lift_gate || YesNo.No,
  has_refrigeration_unit: vehicleBody?.has_refrigeration_unit || YesNo.No,
  refrigeration_temperature_range: vehicleBody?.refrigeration_temperature_range || '',
  cargo_bed_length: vehicleBody?.cargo_bed_length || 0,
  cargo_bed_width: vehicleBody?.cargo_bed_width || 0,
  cargo_bed_height: vehicleBody?.cargo_bed_height || 0,
  cargo_floor_material: vehicleBody?.cargo_floor_material || '',
  has_side_doors: vehicleBody?.has_side_doors || YesNo.No,
  has_roof_hatch: vehicleBody?.has_roof_hatch || YesNo.No,
  cargo_tie_down_hooks_count: vehicleBody?.cargo_tie_down_hooks_count || 0,
  is_custom_body_built: vehicleBody?.is_custom_body_built || YesNo.No,

  // 🛞 Wheel & Suspension
  number_of_axles: vehicleBody?.number_of_axles || 0,
  axle_configuration: vehicleBody?.axle_configuration || '',
  has_dual_rear_wheels: vehicleBody?.has_dual_rear_wheels || YesNo.No,
  suspension_type: vehicleBody?.suspension_type || '',
  suspension_adjustability: vehicleBody?.suspension_adjustability || YesNo.No,
  ground_clearance_mm: vehicleBody?.ground_clearance_mm || 0,
  tire_size: vehicleBody?.tire_size || '',
  has_spare_tire: vehicleBody?.has_spare_tire || YesNo.No,
  has_all_terrain_tires: vehicleBody?.has_all_terrain_tires || YesNo.No,
  has_run_flat_tires: vehicleBody?.has_run_flat_tires || YesNo.No,
  steering_type: vehicleBody?.steering_type || SteeringType.Manual,
  wheel_drive_type: vehicleBody?.wheel_drive_type || WheelDriveType.FWD,

  // 🛡️ Safety Features
  has_abs: vehicleBody?.has_abs || YesNo.No,
  has_airbags: vehicleBody?.has_airbags || YesNo.No,
  has_speed_limiter: vehicleBody?.has_speed_limiter || YesNo.No,
  has_gps_tracker: vehicleBody?.has_gps_tracker || YesNo.No,
  has_parking_sensors: vehicleBody?.has_parking_sensors || YesNo.No,
  has_rear_camera: vehicleBody?.has_rear_camera || YesNo.No,
  has_lane_assist: vehicleBody?.has_lane_assist || YesNo.No,
  has_automatic_emergency_brake: vehicleBody?.has_automatic_emergency_brake || YesNo.No,
  has_tire_pressure_monitoring: vehicleBody?.has_tire_pressure_monitoring || YesNo.No,
  has_blind_spot_monitoring: vehicleBody?.has_blind_spot_monitoring || YesNo.No,
  has_collision_warning_system: vehicleBody?.has_collision_warning_system || YesNo.No,
  has_immobilizer: vehicleBody?.has_immobilizer || YesNo.No,
  has_dashcam: vehicleBody?.has_dashcam || YesNo.No,
  has_emergency_exit: vehicleBody?.has_emergency_exit || YesNo.No,

  status: vehicleBody ? vehicleBody?.status : Status.Active,
});

// Convert VehicleDetailLifeCycle Data to API Payload
export const toVehicleDetailLifeCyclePayload = (vehicleLifeCycle?: VehicleDetailLifeCycle): VehicleDetailLifeCycleDto => ({
  // Lifecycle Start
  service_start_date: vehicleLifeCycle?.service_start_date || '',
  service_start_odometer_reading: vehicleLifeCycle?.service_start_odometer_reading || 0,

  // Lifecycle End
  service_end_date: vehicleLifeCycle?.service_end_date || '',
  service_end_odometer_reading: vehicleLifeCycle?.service_end_odometer_reading || 0,

  // Estimated Life
  life_estimate_max_month_year: vehicleLifeCycle?.life_estimate_max_month_year || '',
  life_estimate_max_odometer_reading: vehicleLifeCycle?.life_estimate_max_odometer_reading || 0,

  // Lifecycle Status
  life_expiry: vehicleLifeCycle?.life_expiry || LifeExpiry.No,
  is_extended_life_approved: vehicleLifeCycle?.is_extended_life_approved || YesNo.No,
  life_status: VehicleLifeStatus.Active,
  life_expiry_message: vehicleLifeCycle?.life_expiry_message || '',
  life_expiry_note: vehicleLifeCycle?.life_expiry_note || '',

  status: vehicleLifeCycle ? vehicleLifeCycle.status : Status.Active,
});

// Convert VehicleDetailPurchase Data to API Payload
export const toVehicleDetailPurchasePayload = (vehiclePurchase?: VehicleDetailPurchase): VehicleDetailPurchaseDTO => ({
  // Basic Purchase Info
  purchase_date: vehiclePurchase?.purchase_date || '',
  purchase_notes: vehiclePurchase?.purchase_notes || '',
  purchase_vehicle_type: vehiclePurchase?.purchase_vehicle_type || PurchaseVehicleType.New,
  purchase_type: vehiclePurchase?.purchase_type || PurchaseType.NoFinance,
  purchase_total_amount: vehiclePurchase?.purchase_total_amount || 0,

  // Loan Details
  loan_amount: vehiclePurchase?.loan_amount || 0,
  loan_down_payment: vehiclePurchase?.loan_down_payment || 0,
  loan_interest_rate: vehiclePurchase?.loan_interest_rate || 0,
  loan_interest_type: vehiclePurchase?.loan_interest_type || LoanInterestType.Simple,
  loan_no_of_installments: vehiclePurchase?.loan_no_of_installments || 0,
  loan_first_payment_date: vehiclePurchase?.loan_first_payment_date || '',
  loan_last_payment_date: vehiclePurchase?.loan_last_payment_date || '',
  loan_monthly_emi: vehiclePurchase?.loan_monthly_emi || 0,
  loan_emi_date: vehiclePurchase?.loan_emi_date || 0,

  // Lease Details
  lease_start_date: vehiclePurchase?.lease_start_date || '',
  lease_end_date: vehiclePurchase?.lease_end_date || '',
  lease_security_deposit_amount: vehiclePurchase?.lease_security_deposit_amount || 0,
  lease_monthly_emi_amount: vehiclePurchase?.lease_monthly_emi_amount || 0,
  lease_emi_date: vehiclePurchase?.lease_emi_date || 0,

  // Warranty Info
  warranty_expiration_date: vehiclePurchase?.warranty_expiration_date || '',
  warranty_max_odometer_reading: vehiclePurchase?.warranty_max_odometer_reading || 0,
  warranty_exchange_date: vehiclePurchase?.warranty_exchange_date || '',

  status: vehiclePurchase ? vehiclePurchase.status : Status.Active,

  // Relations
  purchase_vendor_id: vehiclePurchase?.purchase_vendor_id || '',

  loan_lender_id: vehiclePurchase?.loan_lender_id || '',

  lease_vendor_id: vehiclePurchase?.lease_vendor_id || '',
});

// Convert VehicleDocument Data to API Payload
export const toVehicleDocumentPayload = (row: VehicleDocument): VehicleDocumentDTO => ({
  organisation_id: row.organisation_id || '',
  vehicle_id: row.vehicle_id || '',
  vendor_id: row.vendor_id || '',
  document_type_id: row.document_type_id || '',

  vehicle_document_code: row.vehicle_document_code || '',

  document_number: row.document_number || '',
  document_authorized_name: row.document_authorized_name || '',
  document_cost: row.document_cost || 0,
  document_issue_date: row.document_issue_date || '',
  document_valid_till_date: row.document_valid_till_date || '',
  document_renewal_date: row.document_renewal_date || '',
  document_validity_status: row.document_validity_status || DocumentValidityStatus.Valid,
  document_status: row.document_status || DocumentStatus.Active,

  document_details_1: row.document_details_1 || '',
  document_details_2: row.document_details_2 || '',
  document_details_3: row.document_details_3 || '',
  document_details_4: row.document_details_4 || '',
  document_notes: row.document_notes || '',

  status: row.status || Status.Active,

  time_zone_id: '', // Needs to be provided manually

  VehicleDocumentFileSchema: row.VehicleDocumentFile?.map((file) => ({
    vehicle_document_file_id: file.vehicle_document_file_id ?? '',

    usage_type: file.usage_type,

    file_type: file.file_type,
    file_url: file.file_url || '',
    file_key: file.file_key || '',
    file_name: file.file_name || '',
    file_description: file.file_description || '',
    file_size: file.file_size ?? 0,
    file_metadata: file.file_metadata ?? {},

    status: file.status,
    added_date_time: file.added_date_time,
    modified_date_time: file.modified_date_time,

    organisation_id: file.organisation_id ?? '',
    vehicle_document_id: file.vehicle_document_id ?? '',
  })) ?? [],
});

// Create New VehicleDocument Payload
export const newVehicleDocumentPayload = (): VehicleDocumentDTO => ({

  organisation_id: '',
  vehicle_id: '',
  vendor_id: '',
  document_type_id: '',

  vehicle_document_code: '',

  document_number: '',
  document_authorized_name: '',
  document_cost: 0,
  document_issue_date: '',
  document_valid_till_date: '',
  document_renewal_date: '',
  document_validity_status: DocumentValidityStatus.Valid,
  document_status: DocumentStatus.Active,

  document_details_1: '',
  document_details_2: '',
  document_details_3: '',
  document_details_4: '',
  document_notes: '',

  status: Status.Active,

  time_zone_id: '', // Needs to be provided manually

  VehicleDocumentFileSchema: []
});

// Convert VehicleDocumentExpiry Data to API Payload
export const toVehicleDocumentExpiryPayload = (row: VehicleDocumentExpiry): VehicleDocumentExpiryDTO => ({
  organisation_id: row.organisation_id || '',
  vehicle_id: row.vehicle_id || '',
  vehicle_document_id: row.vehicle_document_id || '',

  expiry_type: row.expiry_type || ExpiryType.Expiring,

  status: row.status || Status.Active,
});

// Create New VehicleDocumentExpiry Payload
export const newVehicleDocumentExpiryPayload = (): VehicleDocumentExpiryDTO => ({
  organisation_id: '',

  vehicle_id: '',
  vehicle_document_id: '',

  expiry_type: ExpiryType.Expiring,

  status: Status.Active,
});


// AWS S3 PRESIGNED
export const get_vehicle_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.vehicle_file_presigned_url, data);
};

export const get_device_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.device_file_presigned_url, data);
};

export const get_vehicle_document_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.vehicle_document_file_presigned_url, data);
};

// File Uploads
export const createFileVehicle = async (payload: MasterVehicleFileDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleFileDTO>(ENDPOINTS.create_file_vehicle, payload);
};

export const remove_file_vehicle = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_file_vehicle(id));
};

export const create_file_device = async (payload: MasterDeviceFileDTO): Promise<SBR> => {
  return apiPost<SBR, MasterDeviceFileDTO>(ENDPOINTS.create_file_device, payload);
};

export const remove_file_device = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_file_device(id));
};

export const create_file_vehicle_document = async (payload: VehicleDocumentFileDTO): Promise<SBR> => {
  return apiPost<SBR, VehicleDocumentFileDTO>(ENDPOINTS.create_file_vehicle_document, payload);
};

export const removeFileVehicleDocument = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_file_vehicle_document(id));
};

export const update_calibration_file = async (payload: CalibrationFileDTO): Promise<SBR> => {
  return apiPost<SBR, CalibrationFileDTO>(ENDPOINTS.update_calibration_file, payload);
};

export const delete_calibration_file = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete_calibration_file(id));
};

// Vehicle APIs
export const findVehicles = async (payload: VehicleQueryDTO): Promise<FBR<MasterVehicle[]>> => {
  return apiPost<FBR<MasterVehicle[]>, VehicleQueryDTO>(ENDPOINTS.find, payload);
};

export const findVehiclesLiveDashboard = async (payload: VehicleQueryDTO): Promise<FBR<MasterVehicle[]>> => {
  return apiPost<FBR<MasterVehicle[]>, VehicleQueryDTO>(ENDPOINTS.find_live_dashboard, payload);
};

export const findVehicleGPSDetails = async (payload: VehicleGPSQueryDTO): Promise<BR<VehicleDetailGPS>> => {
  return apiPost<BR<VehicleDetailGPS>, VehicleGPSQueryDTO>(ENDPOINTS.find_gps_details, payload);
};

export const createVehicle = async (payload: VehicleDTO): Promise<SBR> => {
  return apiPost<SBR, VehicleDTO>(ENDPOINTS.create, payload);
};

export const updateVehicle = async (id: string, payload: VehicleDTO): Promise<SBR> => {
  return apiPatch<SBR, VehicleDTO>(ENDPOINTS.update(id), payload);
};

export const deleteVehicle = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Updates
export const updateDetailsGpsSensor = async (id: string, payload: VehicleDetailGPSSensorDTO): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailGPSSensorDTO>(ENDPOINTS.update_details_gps_sensor(id), payload);
};

export const updateDetailsTrip = async (id: string, payload: VehicleDetailTripDTO): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailTripDTO>(ENDPOINTS.update_details_trip(id), payload);
};

export const updateVehicleBodyDetails = async (id: string, payload: VehicleDetailBodyDTO): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailBodyDTO>(ENDPOINTS.update_details_body(id), payload);
};

export const updateVehicleLifeCycleDetails = async (id: string, payload: VehicleDetailLifeCycleDto): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailLifeCycleDto>(ENDPOINTS.update_details_life_cycle(id), payload);
};

export const updateVehiclePurchaseDetails = async (id: string, payload: VehicleDetailPurchaseDTO): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailPurchaseDTO>(ENDPOINTS.update_details_purchase(id), payload);
};

// API Vehicle Driver Link
export const linkDriverToVehicle = async (payload: VehicleDriverLinkDTO): Promise<SBR> => {
  return apiPost<SBR, VehicleDriverLinkDTO>(ENDPOINTS.vehicle_driver_link, payload);
};

export const unlinkDriverFromVehicle = async (payload: VehicleDriverLinkDTO): Promise<SBR> => {
  return apiPost<SBR, VehicleDriverLinkDTO>(ENDPOINTS.vehicle_driver_unlink, payload);
};

export const getDriverLinkHistoryByVehicle = async (id: string, params: BaseQueryDTO): Promise<FBR<AssignRemoveDriverHistory[]>> => {
  return apiGet<FBR<AssignRemoveDriverHistory[]>>(ENDPOINTS.find_vehicle_driver_link_history_by_vehicle(id), params);
};

export const getDriverLinkHistoryByDriver = async (id: string, params: BaseQueryDTO): Promise<FBR<AssignRemoveDriverHistory[]>> => {
  return apiGet<FBR<AssignRemoveDriverHistory[]>>(ENDPOINTS.find_vehicle_driver_link_history_by_driver(id), params);
};

// API Vehicle Device Link
export const linkDeviceToVehicle = async (payload: VehicleDeviceLinkDTO): Promise<SBR> => {
  return apiPost<SBR, VehicleDeviceLinkDTO>(ENDPOINTS.vehicle_device_link, payload);
};

export const unlinkDeviceFromVehicle = async (payload: VehicleDeviceUnlinkDTO): Promise<SBR> => {
  return apiPost<SBR, VehicleDeviceUnlinkDTO>(ENDPOINTS.vehicle_device_unlink, payload);
};

export const getDeviceLinkHistoryByVehicle = async (id: string, params: BaseQueryDTO): Promise<FBR<AssignRemoveDeviceHistory[]>> => {
  return apiGet<FBR<AssignRemoveDeviceHistory[]>>(ENDPOINTS.vehicle_device_link_history_by_vehicle(id), params);
};

export const getDeviceLinkHistoryByDevice = async (id: string, params: BaseQueryDTO): Promise<FBR<AssignRemoveDeviceHistory[]>> => {
  return apiGet<FBR<AssignRemoveDeviceHistory[]>>(ENDPOINTS.vehicle_device_link_history_by_device(id), params);
};

// VehicleDocument APIs
export const createVehicleDocument = async (payload: VehicleDocumentDTO): Promise<SBR> => {
  return apiPost<SBR, VehicleDocumentDTO>(ENDPOINTS.create_document, payload);
};

export const findVehicleDocument = async (payload: VehicleDocumentQueryDTO): Promise<FBR<VehicleDocument[]>> => {
  return apiPost<FBR<VehicleDocument[]>, VehicleDocumentQueryDTO>(ENDPOINTS.find_document, payload);
};

export const updateVehicleDocument = async (id: string, payload: VehicleDocumentDTO): Promise<SBR> => {
  return apiPatch<SBR, VehicleDocumentDTO>(ENDPOINTS.update_document(id), payload);
};

export const removeVehicleDocument = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_document(id));
};

// VehicleDocumentExpiry APIs
export const createVehicleDocumentExpiry = async (payload: VehicleDocumentExpiryDTO): Promise<SBR> => {
  return apiPost<SBR, VehicleDocumentExpiryDTO>(ENDPOINTS.create_document_expiry, payload);
};

export const findVehicleDocumentExpiry = async (payload: VehicleDocumentExpiryQueryDTO): Promise<FBR<VehicleDocumentExpiry[]>> => {
  return apiPost<FBR<VehicleDocumentExpiry[]>, VehicleDocumentExpiryQueryDTO>(ENDPOINTS.find_document_expiry, payload);
};

export const updateVehicleDocumentExpiry = async (id: string, payload: VehicleDocumentExpiryDTO): Promise<SBR> => {
  return apiPatch<SBR, VehicleDocumentExpiryDTO>(ENDPOINTS.update_document_expiry(id), payload);
};

export const removeVehicleDocumentExpiry = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_document_expiry(id));
};

// Cache APIs
export const getVehicleCache = async (organisationId: string): Promise<FBR<MasterVehicle[]>> => {
  return apiGet<FBR<MasterVehicle[]>>(ENDPOINTS.find_cache.replace(':organisation_id', organisationId));
};

export const getVehicleSimpleCache = async (organisationId: string): Promise<FBR<MasterVehicle[]>> => {
  return apiGet<FBR<MasterVehicle[]>>(ENDPOINTS.find_cache_simple.replace(':organisation_id', organisationId));
};

export const getVehicleParentCache = async (organisationId: string): Promise<FBR<MasterVehicle[]>> => {
  return apiGet<FBR<MasterVehicle[]>>(ENDPOINTS.find_cache_parent.replace(':organisation_id', organisationId));
};

export const getVehicleSimpleDropdownCustom = async (organisationId: string): Promise<FBR<MasterVehicleDropdown[]>> => {
  return apiGet<FBR<MasterVehicleDropdown[]>>(ENDPOINTS.find_cache_dropdown.replace(':organisation_id', organisationId));
};

export const getVehicleSimpleDropdownCacheLiveData = async (organisationId: string): Promise<FBR<MasterVehicleDropdown[]>> => {
  return apiGet<FBR<MasterVehicleDropdown[]>>(ENDPOINTS.find_cache_dropdown_live_data.replace(':organisation_id', organisationId));
};

