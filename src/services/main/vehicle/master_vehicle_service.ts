// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BR } from '../../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  numberOptional,
  enumMandatory,
  enumOptional,
  booleanOptional,
  multi_select_optional,
  single_select_optional,
  single_select_mandatory,
  doubleOptional,
  doubleOptionalLatLng,
  doubleOptionalAmount,
  dateOptional,
  enumArrayOptional,
  getAllEnums,
} from '../../../zod_utils/zod_utils';
import { BaseQueryDTO, BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

//Enums
import {
  Status,
  YesNo,
  GPSSource,
  PurchaseVehicleType,
  PurchaseType,
  LifeExpiry,
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

// ✅ URL and Endpoints
const URL = 'main/master_vehicle';

const ENDPOINTS = {
  FIND: `${URL}/search`,
  FIND_LIVE_DASHBOARD: `${URL}/live_dashboard/search`,
  FIND_GPS_DETAILS: `${URL}/gps_datails/search`,
  CREATE: `${URL}`,
  UPDATE: `${URL}/:id`,
  DELETE: `${URL}/:id`,

  // ✅ Vehicle Details Updates
  BASIC_DETAILS_UPDATE: `${URL}/basic_details/:id`,
  BODY_DETAILS_UPDATE: `${URL}/body_details/:id`,
  LIFE_CYCLE_DETAILS_UPDATE: `${URL}/life_cycle_details/:id`,
  PURCHASE_DETAILS_UPDATE: `${URL}/purchase_details/:id`,
  GPS_DETAILS_MAIN_UPDATE: `${URL}/gps_details_main/:id`,
  GPS_DETAILS_DATA_UPDATE: `${URL}/gps_details_data/:id`,
  GPS_DETAILS_ANALYTICS_UPDATE: `${URL}/gps_details_analytic/:id`,
  TRIP_DETAILS_UPDATE: `${URL}/trip_details/:id`,

  // ✅ Presigned URL for file uploads
  PRESIGNED_URL: `${URL}/presigned_url/:fileName`,

  // ✅ Vehicle Driver Link Management
  DRIVER_LINK: `${URL}/vehicle_driver_link`,
  DRIVER_UNLINK: `${URL}/vehicle_driver_unlink`,
  DRIVER_LINK_HISTORY_BY_VEHICLE: `${URL}/vehicle_driver_link_history_by_vehicle/:id`,
  DRIVER_LINK_HISTORY_BY_DRIVER: `${URL}/vehicle_driver_link_history_by_driver/:id`,

  // ✅ Vehicle Device Link Management
  DEVICE_LINK: `${URL}/vehicle_device_link`,
  DEVICE_UNLINK: `${URL}/vehicle_device_unlink`,
  DEVICE_LINK_HISTORY_BY_VEHICLE: `${URL}/vehicle_device_link_history_by_vehicle/:id`,
  DEVICE_LINK_HISTORY_BY_DEVICE: `${URL}/vehicle_device_link_history_by_device/:id`,

  // ✅ Cache Management
  cache: `${URL}/cache/:organisation_id`,
  cache_simple: `${URL}/cache_simple/:organisation_id`,
  cache_parent: `${URL}/cache_parent/:organisation_id`,
  cache_dropdown: `${URL}/cache_dropdown/:organisation_id`,
};

// 🚀 Vehicle Interface
export interface MasterVehicle extends Record<string, unknown> {
  // ✅ Primary Fields
  vehicle_id: string;
  vehicle_number: string;
  vehicle_name: string;

  engine_number?: string; // ✅ Max: 20
  chassis_number?: string; // ✅ Max: 20
  vehicle_make_year?: number;

  // Database Details
  db_instance: string;
  db_group: string;

  // Admin Account Details
  is_fleet_active: YesNo;
  is_gps_active: YesNo;
  is_trip_active: YesNo;

  // Images
  vehicle_front_image_url?: string;
  vehicle_front_image_key?: string;
  vehicle_plate_image_url?: string;
  vehicle_plate_image_key?: string;
  vehicle_full_image_url?: string;
  vehicle_full_image_key?: string;

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations - Driver
  is_driver_assigned: YesNo;
  driver_id?: string;
  MasterDriver?: MasterDriver;
  assign_driver_date?: string;
  AssignRemoveDriverHistory?: AssignRemoveDriverHistory[];

  // ✅ Relations - Device
  is_device_installed: YesNo;
  device_gps_source?: GPSSource;
  device_id?: string;
  MasterDevice?: MasterDevice;
  assign_device_date?: string;
  AssignRemoveDeviceHistory?: AssignRemoveDeviceHistory[];
  country_id?: string;
  MasterMainCountry?: MasterMainCountry;
  time_zone_id?: string;
  MasterMainTimeZone?: MasterMainTimeZone;

  // ✅ Relations - Odometer
  odometer_reading?: number;
  odometer_last_change_date?: string;
  //VehicleOdometerHistory?:    VehicleOdometerHistory[];

  // ✅ Relations - One to One
  vehicle_details_body_id?: string;
  VehicleDetailBody?: VehicleDetailBody;

  vehicle_details_life_cycle_id?: string;
  VehicleDetailLifeCycle?: VehicleDetailLifeCycle;

  vehicle_details_purchase_id?: string;
  VehicleDetailPurchase?: VehicleDetailPurchase;

  vehicle_details_gps_id?: string;
  VehicleDetailGPS?: VehicleDetailGPS;

  vehicle_details_trip_id?: string;
  VehicleDetailTrip?: VehicleDetailTrip;

  // ✅ Relations - Master Data
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  organisation_sub_company_id: string;
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

  vehicle_type_id?: string;
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

  vehicle_total_fuel_quantity?: number;
  vehicle_tank_1_fuel_quantity?: number;
  vehicle_tank_2_fuel_quantity?: number;

  // ✅ Relations - Child
  // Relations - Dummy
  Dummy_Driver?: MasterDriver[];
  Dummy_Device?: MasterDevice[];
  Dummy_VehicleDetailBody?: VehicleDetailBody[];
  Dummy_VehicleDetailLifeCycle?: VehicleDetailLifeCycle[];
  Dummy_VehicleDetailPurchase?: VehicleDetailPurchase[];
  Dummy_VehicleDetailGPS?: VehicleDetailGPS[];
  Dummy_VehicleDetailTrip?: VehicleDetailTrip[];

  // Child Relations
  // Child - Main
  // VehicleDocument?: VehicleDocument[];

  // Child - Master
  VehicleOrganisationGroupLink?: VehicleOrganisationGroupLink[];

  // Child - Fleet
  // InspectionScheduleTracking?: FleetInspectionScheduleTracking[];
  // Inspection?: FleetInspection[];
  // InspectionScheduleVehicle?: FleetInspectionScheduleVehicle[];

  // VehicleIncident?: FleetIncidentManagement[];

  // VehicleIssues?: FleetIssueManagement[];

  // FleetServiceSchedule?: FleetServiceSchedule[];
  // FleetServiceJobCard?: FleetServiceJobCard[];

  // FleetReminders?: FleetReminders[];

  // FleetFuelRefills?: FleetFuelRefills[];
  // FleetFuelRemovals?: FleetFuelRemovals[];

  // FleetTyreUsageHistory?: FleetTyreUsageHistory[];
  // FleetTyreInspectionScheduleVehicle?: FleetTyreInspectionScheduleVehicle[];
  // FleetTyreInspectionScheduleTracking?: FleetTyreInspectionScheduleTracking[];
  // FleetTyreInspection?: FleetTyreInspection[];
  // FleetTyreDamageRepair?: FleetTyreDamageRepair[];
  // FleetTyreRotation?: FleetTyreRotation[];
  // FleetTyreRotationDetails?: FleetTyreRotationDetails[];

  // Child - GPS
  // GpsLockRelayLog?: GPSLockRelayLog[];
  // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[];
  // TripGeofenceToGeofence?: TripGeofenceToGeofence[];
  // GPSGeofenceTransaction?: GPSGeofenceTransaction[];
  // GPSFuelVehicleDailySummary?: GPSFuelVehicleDailySummary[];
  // GPSFuelVehicleRefill?: GPSFuelVehicleRefill[];
  // GPSFuelVehicleRemoval?: GPSFuelVehicleRemoval[];
  // GPSLiveTrackShareLink?: GPSLiveTrackShareLink[];
  // GPSTrackHistoryShareLink?: GPSTrackHistoryShareLink[];
  // GPSGeofenceTransactionSummary?: GPSGeofenceTransactionSummary[];

  // Child - Trip
  //Trip?: Trip[];

  // Child - Account
  //AlertVehicleLink?: AlertVehicleLink[];

  // ✅ Count of child relations
  _count?: {
    VehicleOrganisationGroupLink?: number;

    AssignRemoveDriverHistory?: number;
    AssignRemoveDeviceHistory?: number;
    VehicleOdometerHistory?: number;

    FleetServiceSchedule?: number;
    FleetServiceJobCard?: number;
    FleetReminders?: number;
    FleetFuelRefills?: number;
    FleetFuelRemovals?: number;

    FleetTyreUsageHistory?: number;
    FleetTyreInspectionScheduleVehicle?: number;
    FleetTyreInspectionScheduleTracking?: number;
    FleetTyreInspection?: number;
    FleetTyreDamageRepair?: number;
    FleetTyreRotation?: number;
    FleetTyreRotationDetails?: number;

    GpsLockRelayLog?: number;
    GPSLockDigitalDoorLog?: number;
    TripGeofenceToGeofence?: number;
    GPSGeofenceTransaction?: number;
    GPSFuelVehicleDailySummary?: number;
    GPSFuelVehicleRefill?: number;
    GPSFuelVehicleRemoval?: number;
    GPSLiveTrackShareLink?: number;
    GPSTrackHistoryShareLink?: number;
    GPSGeofenceTransactionSummary?: number;

    Trip?: number;
    AlertVehicleLink?: number;
  };
}

// 🚀 Vehicle Interface
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
  gps_lock_relay: YesNo;
  gps_door_locker: YesNo;
  door_sensor: YesNo;
  genset_sensor: YesNo;
  dashcam_sensor: YesNo;
  is_rear_cam: YesNo;
  is_front_cam: YesNo;
  camera_extra_count: number;

}

// 🚀 Vehicle Detail Body Interface
export interface VehicleDetailBody extends Record<string, unknown> {
  // ✅ Primary Fields
  vehicle_details_body_id: string;
  vehicle_body_details?: string;
  vehicle_height?: number;
  vehicle_width?: number;
  vehicle_length?: number;
  vehicle_passenger_capacity?: number;
  vehicle_cargo_volume?: number;
  vehicle_maximum_weight_capacity?: number;
  vehicle_total_fuel_quantity?: number;
  vehicle_tank_1_fuel_quantity?: number;
  vehicle_tank_2_fuel_quantity?: number;

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations - One To One
  vehicle_id?: string;
  Vehicle?: MasterVehicle;

  // ✅ Child Count
  _count?: object;
}

// 🚀 Vehicle Detail Life Cycle Interface
export interface VehicleDetailLifeCycle extends Record<string, unknown> {
  // ✅ Primary Fields
  vehicle_details_life_cycle_id: string;
  service_start_date?: string;
  service_start_odometer_reading?: number;
  service_end_date?: string;
  service_end_odometer_reading?: number;
  life_estimate_max_month_year?: string;
  life_estimate_max_odometer_reading?: number;
  life_expiry?: LifeExpiry;
  life_expiry_message?: string;
  life_expiry_note?: string;

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations - One To One
  vehicle_id?: string;
  Vehicle?: MasterVehicle;

  // ✅ Child Count
  _count?: object;
}

// 🚀 Vehicle Detail Purchase Interface
export interface VehicleDetailPurchase extends Record<string, unknown> {
  // ✅ Primary Fields
  vehicle_details_purchase_id: string;

  purchase_date?: string;
  purchase_notes?: string;
  purchase_vehicle_type?: PurchaseVehicleType;
  purchase_type?: PurchaseType;
  purchase_total_amount?: number;

  loan_amount?: number;
  loan_down_payment?: number;
  loan_interest_rate?: number;
  loan_no_of_installments?: number;
  loan_first_payment_date?: string;
  loan_last_payment_date?: string;
  loan_monthly_emi?: number;
  loan_emi_date?: number;

  lease_start_date?: string;
  lease_end_date?: string;
  lease_security_deposit_amount?: number;
  lease_monthly_emi_amount?: number;
  lease_emi_date?: number;

  warranty_expiration_date?: string;
  warranty_max_odometer_reading?: number;
  warranty_exchange_date?: string;

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations
  vehicle_id?: string;
  Vehicle?: MasterVehicle;

  purchase_vendor_id?: string;
  //PurchaseVendor?: FleetVendor;

  loan_lender_id?: string;
  //LoanLender?: FleetVendor;

  lease_vendor_id?: string;
  //LeaseVendor?: FleetVendor;

  // ✅ Child Count
  _count?: object;
}

// 🚀 Vehicle Detail GPS Interface
export interface VehicleDetailGPS extends Record<string, unknown> {
  // ✅ Primary Fields
  vehicle_details_gps_id: string;
  serial_no?: number;
  device_identifier?: string;
  device_gps_source?: GPSSource;
  traccar_protocol?: string;
  custom_protocol?: string;
  api_details?: string;

  // Sensor Configuration
  temperature?: YesNo;
  duel_temperature?: YesNo;
  fuel?: YesNo;
  fuel_bluetooth?: YesNo;
  fuel_tank_size?: number;
  gps_lock_relay?: YesNo;
  gps_door_locker?: YesNo;
  door_sensor?: YesNo;
  genset_sensor?: YesNo;
  dashcam_sensor?: YesNo;
  is_rear_cam?: YesNo;
  is_front_cam?: YesNo;
  camera_extra_count?: number;

  // GPS Data
  gps_source?: string;
  attributes?: object;
  raw?: string;
  protocol?: string;
  api_code?: string;
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
  t_s_last_24_moving?: number;
  t_s_last_24_ignition?: number;
  t_s_last_24_moving_f?: string;
  t_s_last_24_ignition_f?: string;

  km_today?: number;
  t_s_today_moving?: number;
  t_s_today_ignition?: number;
  t_s_today_moving_f?: string;
  t_s_today_ignition_f?: string;
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

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations - One To One
  vehicle_id?: string;
  Vehicle?: MasterVehicle;

  landmark_id?: string;
  //MasterMainLandMark?: MasterMainLandMark;

  // ✅ Child Count
  _count?: object;
}

// 🚀 Vehicle Detail Trip Interface
export interface VehicleDetailTrip extends Record<string, unknown> {
  // ✅ Primary Fields
  vehicle_details_trip_id: string;
  trip_name?: string;
  trip_no?: string;
  eway_bill_number?: string;

  route_name?: string;

  trip_start_date?: string;
  trip_end_date?: string;

  trip_notes_1?: string;
  trip_notes_2?: string;
  trip_notes_3?: string;

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations - One To One
  vehicle_id?: string;
  Vehicle?: MasterVehicle;

  // ✅ Child Count
  _count?: object;
}

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

  vehicle_front_image_url: stringOptional('Vehicle Front Image URL', 0, 300),
  vehicle_front_image_key: stringOptional('Vehicle Front Image Key', 0, 300),
  vehicle_plate_image_url: stringOptional('Vehicle Plate Image URL', 0, 300),
  vehicle_plate_image_key: stringOptional('Vehicle Plate Image Key', 0, 300),
  vehicle_full_image_url: stringOptional('Vehicle Full Image URL', 0, 300),
  vehicle_full_image_key: stringOptional('Vehicle Full Image Key', 0, 300),

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
  vehicle_fuel_type_id: single_select_optional('MasterVehicleFuelType'), // ✅ Single-Selection -> MasterVehicleFuelType
  vehicle_fuel_unit_id: single_select_optional('MasterVehicleFuelUnit'), // ✅ Single-Selection -> MasterVehicleFuelUnit
  secondary_vehicle_fuel_type_id: single_select_optional(
    'Vehicle Secondary Fuel Type ID',
  ), // ✅ Single-Selection -> MasterVehicleFuelType
  secondary_vehicle_fuel_unit_id: single_select_optional(
    'Vehicle Secondary Fuel Unit ID',
  ), // ✅ Single-Selection -> MasterVehicleFuelUnit
  vehicle_total_fuel_quantity: numberOptional('Vehicle Total Fuel Quantity'),
  vehicle_tank_1_fuel_quantity: numberOptional('Vehicle Tank 1 Fuel Quantity'),
  vehicle_tank_2_fuel_quantity: numberOptional('Vehicle Tank 2 Fuel Quantity'),
});
export type VehicleDTO = z.infer<typeof VehicleSchema>;

// ✅ Vehicle Device Link Schema
export const VehicleDeviceLinkSchema = z.object({
  device_id: single_select_mandatory('Device ID'), // Single selection -> MasterDevice
  device_manufacturer_id: single_select_mandatory('Device Manufacturer ID'), // Single selection -> MasterDeviceManufacturer
  device_model_id: single_select_mandatory('Device Model ID'), // Single selection -> MasterDeviceModel
  device_type_id: single_select_mandatory('Device Type ID'), // Single selection -> MasterDeviceType

  organisation_id: single_select_mandatory('Organisation ID'), // Single selection -> UserOrganisation
  country_id: single_select_mandatory('Country ID'), // Single selection -> MasterMainCountry
  time_zone_id: single_select_mandatory('Time Zone ID'), // Single selection -> MasterMainTimeZone
  vehicle_id: single_select_mandatory('Vehicle ID'), // Single selection -> Vehicle

  device_image_url: stringOptional('Fuel Receipt URL', 0, 300),
  device_image_key: stringOptional('Fuel Receipt Key', 0, 300),
  vehicle_image_url: stringOptional('Fuel Receipt URL', 0, 300),
  vehicle_image_key: stringOptional('Fuel Receipt Key', 0, 300),
  sim_image_url: stringOptional('Fuel Receipt URL', 0, 300),
  sim_image_key: stringOptional('Fuel Receipt Key', 0, 300),

  gps_lock_relay: enumOptional('GPS Lock Relay', YesNo, YesNo.No),
  gps_door_locker: enumOptional('GPS Door Locker', YesNo, YesNo.No),
  door_sensor: enumOptional('Door Sensor', YesNo, YesNo.No),
  genset_sensor: enumOptional('Genset Sensor', YesNo, YesNo.No),
  dashcam_sensor: enumOptional('Dashcam Sensor', YesNo, YesNo.No),
  is_rear_cam: enumOptional('Is Rear Cam', YesNo, YesNo.No),
  is_front_cam: enumOptional('Is Front Cam', YesNo, YesNo.No),
  camera_extra_count: numberOptional('Camera Extra Count'),
});
export type VehicleDeviceLinkDTO = z.infer<typeof VehicleDeviceLinkSchema>;

// ✅ Vehicle Device Unlink Schema
export const VehicleDeviceUnlinkSchema = z.object({
  vehicle_id: single_select_mandatory('Vehicle ID'), // Single selection -> Vehicle
  device_id: single_select_mandatory('Device ID'), // Single selection -> MasterDevice
});
export type VehicleDeviceUnlinkDTO = z.infer<typeof VehicleDeviceUnlinkSchema>;

// ✅ Vehicle Driver Link Schema
export const VehicleDriverLinkSchema = z.object({
  organisation_id: single_select_mandatory('Organisation ID'), // Single selection -> Organisation
  vehicle_id: single_select_mandatory('Vehicle ID'), // Single selection -> Vehicle
  driver_id: single_select_mandatory('Driver ID'), // Single selection -> MasterDriver
});
export type VehicleDriverLinkDTO = z.infer<typeof VehicleDriverLinkSchema>;

// ✅ Simple Find Query Schema
export const SimpleFindQuerySchema = BaseQuerySchema.extend({
  organisation_id: single_select_mandatory('Organisation ID'), // Single selection -> UserOrganisation
});
export type SimpleFindQueryDTO = z.infer<typeof SimpleFindQuerySchema>;

// ✅ Vehicle Detail Body Schema
export const VehicleDetailBodySchema = z.object({
  vehicle_body_details: stringOptional('Vehicle Body Details', 0, 300),

  vehicle_height: doubleOptional('Vehicle Height', 0, 10000, 2),
  vehicle_width: doubleOptional('Vehicle Width', 0, 10000, 2),
  vehicle_length: doubleOptional('Vehicle Length', 0, 10000, 2),
  vehicle_passenger_capacity: numberOptional('Vehicle Passenger Capacity'),
  vehicle_cargo_volume: doubleOptional('Vehicle Cargo Volume', 0, 10000, 2),
  vehicle_maximum_weight_capacity: doubleOptional(
    'Vehicle Maximum Weight Capacity',
    0,
    10000,
    2
  ),
  vehicle_total_fuel_quantity: numberOptional('Vehicle Total Fuel Quantity'),
  vehicle_tank_1_fuel_quantity: numberOptional('Vehicle Tank 1 Fuel Quantity'),
  vehicle_tank_2_fuel_quantity: numberOptional('Vehicle Tank 2 Fuel Quantity'),
  status: enumMandatory('Status', Status, Status.Active),
});
export type VehicleDetailBodyDTO = z.infer<typeof VehicleDetailBodySchema>;

// ✅ Vehicle Detail GPS Main Schema
export const VehicleDetailGPSMainSchema = z.object({
  gps_lock_relay: enumOptional('GPS Lock Relay', YesNo, YesNo.No),
  gps_door_locker: enumOptional('GPS Door Locker', YesNo, YesNo.No),
  door_sensor: enumOptional('Door Sensor', YesNo, YesNo.No),
  genset_sensor: enumOptional('Genset Sensor', YesNo, YesNo.No),
  dashcam_sensor: enumOptional('Dashcam Sensor', YesNo, YesNo.No),
  is_rear_cam: enumOptional('Is Rear Cam', YesNo, YesNo.No),
  is_front_cam: enumOptional('Is Front Cam', YesNo, YesNo.No),
  camera_extra_count: numberOptional('Camera Extra Count'),
  status: enumMandatory('Status', Status, Status.Active),
});
export type VehicleDetailGPSMainDTO = z.infer<
  typeof VehicleDetailGPSMainSchema
>;

// ✅ Vehicle Detail GPS Data Schema
export const VehicleDetailGPSDataSchema = z.object({
  attributes: stringOptional('Attributes', 0, 2000),
  raw: stringOptional('Raw Data', 0, 2000),
  st: stringOptional('ST'),
  dt: stringOptional('DT'),
  ft: stringOptional('FT'),

  sts: numberOptional('STS'),
  dts: numberOptional('DTS'),
  fts: numberOptional('FTS'),
  la: doubleOptionalLatLng('Latitude'),
  lo: doubleOptionalLatLng('Longitude'),
  al: numberOptional('Altitude'),
  s: numberOptional('Speed'),
  b: numberOptional('Bearing'),
  c: numberOptional('Course'),

  i: booleanOptional('I'),
  m: booleanOptional('M'),
  p: booleanOptional('P'),
  v: booleanOptional('V'),

  b_r: stringOptional('B_R', 0, 100),

  // Fuel and Temperature
  f1_r: stringOptional('Fuel Sensor 1 Reading', 0, 100),
  f2_r: stringOptional('Fuel Sensor 2 Reading', 0, 100),
  f1: doubleOptionalLatLng('Fuel Level 1', 2),
  f2: doubleOptionalLatLng('Fuel Level 2', 2),

  t1_r: stringOptional('Temperature Sensor 1 Reading', 0, 100),
  t2_r: stringOptional('Temperature Sensor 2 Reading', 0, 100),
  t1: doubleOptionalLatLng('Temperature 1', 2),
  t2: doubleOptionalLatLng('Temperature 2', 2),

  // Landmark Location
  gl: stringOptional('GL', 0, 300),
  lid: stringOptional('LID', 0, 300),
  ll: stringOptional('LL', 0, 300),
  ld: numberOptional('LD'),

  // Sensor
  s_r_l: booleanOptional('S_R_L'),
  s_d_l: booleanOptional('S_D_L'),
  s_d: booleanOptional('S_D'),
  s_g: booleanOptional('S_G'),
  g_s: enumOptional('GPS Source', GPSSource, GPSSource.NoDevice),
});
export type VehicleDetailGPSDataDTO = z.infer<
  typeof VehicleDetailGPSDataSchema
>;

// ✅ Vehicle Detail GPS Analytics Schema
export const VehicleDetailGPSAnalyticsSchema = z.object({
  km_today: doubleOptionalLatLng('Kilometers Today', 3),
  km_this_week_sunday: doubleOptionalLatLng('Kilometers This Week (Sunday)', 3),
  km_this_week_monday: doubleOptionalLatLng('Kilometers This Week (Monday)', 3),
  km_this_month: doubleOptionalLatLng('Kilometers This Month', 3),
  km_this_year: doubleOptionalLatLng('Kilometers This Year', 3),
  km_this_financial_year: doubleOptionalLatLng(
    'Kilometers This Financial Year',
    3
  ),

  km_slotted_today: doubleOptionalLatLng('Slotted Kilometers Today', 3),
  km_slotted_this_week_sunday: doubleOptionalLatLng(
    'Slotted Kilometers This Week (Sunday)',
    3
  ),
  km_slotted_this_week_monday: doubleOptionalLatLng(
    'Slotted Kilometers This Week (Monday)',
    3
  ),
  km_slotted_this_month: doubleOptionalLatLng(
    'Slotted Kilometers This Month',
    3
  ),
  km_slotted_this_year: doubleOptionalLatLng('Slotted Kilometers This Year', 3),
  km_slotted_this_financial_year: doubleOptionalLatLng(
    'Slotted Kilometers This Financial Year',
    3
  ),

  km_total_distance: doubleOptionalLatLng('Total Distance', 3),
});
export type VehicleDetailGPSAnalyticsDTO = z.infer<
  typeof VehicleDetailGPSAnalyticsSchema
>;

// ✅ Vehicle Detail Life Cycle Schema
export const VehicleDetailLifeCycleSchema = z.object({
  service_start_date: dateOptional('Service Start Date'),
  service_start_odometer_reading: numberOptional(
    'Service Start Odometer Reading'
  ),

  service_end_date: dateOptional('Service End Date'),
  service_end_odometer_reading: numberOptional('Service End Odometer Reading'),

  life_estimate_max_month_year: dateOptional('Life Estimate Max Month/Year'),
  life_estimate_max_odometer_reading: numberOptional(
    'Life Estimate Max Odometer Reading'
  ),

  life_expiry: enumOptional('Life Expiry', LifeExpiry, LifeExpiry.No), // Adjust default as needed
  life_expiry_message: stringOptional('Life Expiry Message', 0, 300),
  life_expiry_note: stringOptional('Life Expiry Note', 0, 2000),

  status: enumMandatory('Status', Status, Status.Active),
});
export type VehicleDetailLifeCycleDto = z.infer<
  typeof VehicleDetailLifeCycleSchema
>;

// ✅ Vehicle Detail Purchase Schema
export const VehicleDetailPurchaseSchema = z.object({
  // Purchase Info
  purchase_date: dateOptional('Purchase Date'),
  purchase_notes: stringOptional('Purchase Notes', 0, 300),
  purchase_vehicle_type: enumOptional(
    'Purchase Vehicle Type',
    PurchaseVehicleType,
    PurchaseVehicleType.New
  ),
  purchase_type: enumOptional(
    'Purchase Type',
    PurchaseType,
    PurchaseType.NoFinance
  ),
  purchase_vendor_id: single_select_optional('Purchase Vendor ID'),
  purchase_total_amount: doubleOptionalAmount('Purchase Total Amount', 2),

  // Loan Info
  loan_lender_id: single_select_optional('Loan Lender ID'),
  loan_amount: doubleOptionalAmount('Loan Amount', 2),
  loan_down_payment: doubleOptionalAmount('Loan Down Payment', 2),
  loan_interest_rate: doubleOptionalAmount('Loan Interest Rate', 2),
  loan_no_of_installments: numberOptional('Loan No of Installments'),
  loan_first_payment_date: dateOptional('Loan First Payment Date'),
  loan_last_payment_date: dateOptional('Loan Last Payment Date'),
  loan_monthly_emi: doubleOptionalAmount('Loan Monthly EMI'),
  loan_emi_date: numberOptional('Loan EMI Date'),

  // Lease Info
  lease_vendor_id: single_select_optional('Lease Vendor ID'),
  lease_start_date: dateOptional('Lease Start Date'),
  lease_end_date: dateOptional('Lease End Date'),
  lease_security_deposit_amount: doubleOptionalAmount(
    'Lease Security Deposit Amount',
    2
  ),
  lease_monthly_emi_amount: doubleOptionalAmount('Lease Monthly EMI Amount', 2),
  lease_emi_date: numberOptional('Lease EMI Date'),

  // Warranty Info
  warranty_expiration_date: dateOptional('Warranty Expiration Date'),
  warranty_max_odometer_reading: numberOptional(
    'Warranty Max Odometer Reading'
  ),
  warranty_exchange_date: dateOptional('Warranty Exchange Date'),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type VehicleDetailPurchaseDTO = z.infer<
  typeof VehicleDetailPurchaseSchema
>;

// ✅ Vehicle Detail Trip Schema
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

// ✅ Vehicle Query Schema
export const VehicleQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation IDs'), // Multi-selection -> UserOrganisation
  driver_ids: multi_select_optional('Driver IDs'), // Multi-selection -> MasterDriver
  device_ids: multi_select_optional('Device IDs'), // Multi-selection -> MasterDevice

  organisation_sub_company_ids: multi_select_optional(
    'Organisation Sub Company IDs'
  ), // Multi-selection -> OrganisationSubCompany
  organisation_branch_ids: multi_select_optional('Organisation Branch IDs'), // Multi-selection -> OrganisationBranch
  organisation_tag_ids: multi_select_optional('Organisation Tag IDs'), // Multi-selection -> OrganisationTag
  organisation_color_ids: multi_select_optional('Organisation Color IDs'), // Multi-selection -> OrganisationColor

  vehicle_make_ids: multi_select_optional('Vehicle Make IDs', 100, []), // Multi-selection -> MasterVehicleMake
  vehicle_model_ids: multi_select_optional('Vehicle Model IDs', 100, []), // Multi-selection -> MasterVehicleModel
  vehicle_sub_model_ids: multi_select_optional('Vehicle Sub Model IDs'), // Multi-selection -> MasterVehicleSubModel
  vehicle_type_ids: multi_select_optional('Vehicle Type IDs', 100, []), // Multi-selection -> MasterVehicleType
  vehicle_status_type_ids: multi_select_optional('Vehicle Status Type IDs'), // Multi-selection -> MasterVehicleStatusType
  vehicle_ownership_type_ids: multi_select_optional(
    'Vehicle Ownership Type IDs'
  ), // Multi-selection -> MasterVehicleOwnershipType
  vehicle_fuel_type_ids: multi_select_optional('Vehicle Fuel Type IDs'), // Multi-selection -> MasterVehicleFuelType

  vehicle_ids: multi_select_optional('Vehicle IDs'), // Multi-selection -> Vehicles

  is_device_installed: enumArrayOptional(
    'Is Device Installed',
    YesNo,
    getAllEnums(YesNo)
  ),
  is_driver_assigned: enumArrayOptional(
    'Is Device Installed',
    YesNo,
    getAllEnums(YesNo)
  ),
});
export type VehicleQueryDTO = z.infer<typeof VehicleQuerySchema>;

// ✅ Vehicle GPS Query Schema
export const VehicleGPSQuerySchema = BaseQuerySchema.extend({
  organisation_id: single_select_mandatory('Organisation ID'), // Single selection -> UserOrganisation
  vehicle_id: single_select_mandatory('Vehicle ID'), // Single-selection -> Vehicles
});
export type VehicleGPSQueryDTO = z.infer<typeof VehicleGPSQuerySchema>;

// ✅ Convert Form Data to API Payload
export const toVehiclePayload = (vehicle: MasterVehicle): VehicleDTO => ({
  organisation_id: vehicle.organisation_id,
  vehicle_number: vehicle.vehicle_number,
  vehicle_name: vehicle.vehicle_name || '',
  odometer_reading: vehicle.odometer_reading || 0,

  engine_number: vehicle.engine_number || '',
  chassis_number: vehicle.chassis_number || '',
  vehicle_make_year: vehicle.vehicle_make_year || 0,

  vehicle_front_image_url: vehicle.vehicle_front_image_url || '',
  vehicle_front_image_key: vehicle.vehicle_front_image_key || '',
  vehicle_plate_image_url: vehicle.vehicle_plate_image_url || '',
  vehicle_plate_image_key: vehicle.vehicle_plate_image_key || '',
  vehicle_full_image_url: vehicle.vehicle_full_image_url || '',
  vehicle_full_image_key: vehicle.vehicle_full_image_key || '',

  status: vehicle.status,

  is_fleet_active: vehicle.is_fleet_active,
  is_gps_active: vehicle.is_gps_active,
  is_trip_active: vehicle.is_trip_active,

  organisation_sub_company_id: vehicle.organisation_sub_company_id || '',
  organisation_branch_id: vehicle.organisation_branch_id || '',
  organisation_tag_id: vehicle.organisation_tag_id || '',
  organisation_color_id: vehicle.organisation_color_id || '',
  organisation_group_ids: vehicle.VehicleOrganisationGroupLink?.map((v) => v.organisation_group_id) ??
    [],

  vehicle_type_id: vehicle.vehicle_type_id || '',
  vehicle_make_id: vehicle.vehicle_make_id || '',
  vehicle_model_id: vehicle.vehicle_model_id || '',
  vehicle_sub_model_id: vehicle.vehicle_sub_model_id || '',
  vehicle_status_type_id: vehicle.vehicle_status_type_id || '',
  vehicle_ownership_type_id: vehicle.vehicle_ownership_type_id || '',
  vehicle_associated_to_id: vehicle.vehicle_associated_to_id || '',

  vehicle_fuel_type_id: vehicle.vehicle_fuel_type_id || '',
  vehicle_fuel_unit_id: vehicle.vehicle_fuel_unit_id || '',

  secondary_vehicle_fuel_type_id: vehicle.secondary_vehicle_fuel_type_id || '',
  secondary_vehicle_fuel_unit_id: vehicle.secondary_vehicle_fuel_unit_id || '',

  vehicle_total_fuel_quantity: vehicle.vehicle_total_fuel_quantity || 0,
  vehicle_tank_1_fuel_quantity: vehicle.vehicle_tank_1_fuel_quantity || 0,
  vehicle_tank_2_fuel_quantity: vehicle.vehicle_tank_2_fuel_quantity || 0,


});

// ✅ Convert API Response to Frontend Data
export const newVehiclePayload = (): VehicleDTO => ({
  organisation_id: '',
  vehicle_number: '',
  vehicle_name: '',
  odometer_reading: 0,

  engine_number: '',
  chassis_number: '',
  vehicle_make_year: 0,

  vehicle_front_image_url: '',
  vehicle_front_image_key: '',
  vehicle_plate_image_url: '',
  vehicle_plate_image_key: '',
  vehicle_full_image_url: '',
  vehicle_full_image_key: '',

  status: Status.Active,

  is_fleet_active: YesNo.Yes,
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
  vehicle_total_fuel_quantity: 0,
  vehicle_tank_1_fuel_quantity: 0,
  vehicle_tank_2_fuel_quantity: 0
});

// ✅ Convert Vehicle Detail GPS Main to API Payload
export const toVehicleDetailsGPSPayload = (
  vehicleGPS?: VehicleDetailGPS
): VehicleDetailGPSMainDTO => ({
  gps_lock_relay: vehicleGPS?.gps_lock_relay ?? YesNo.No,
  gps_door_locker: vehicleGPS?.gps_door_locker ?? YesNo.No,
  door_sensor: vehicleGPS?.door_sensor ?? YesNo.No,
  genset_sensor: vehicleGPS?.genset_sensor ?? YesNo.No,
  dashcam_sensor: vehicleGPS?.dashcam_sensor ?? YesNo.No,
  is_rear_cam: vehicleGPS?.is_rear_cam ?? YesNo.No,
  is_front_cam: vehicleGPS?.is_front_cam ?? YesNo.No,
  camera_extra_count: vehicleGPS?.camera_extra_count ?? 0,
  status: vehicleGPS ? vehicleGPS?.status : Status.Active,
});

// ✅ Convert Vehicle Detail Body Data to API Payload
export const toVehicleDetailsBodyPayload = (
  vehicleBody?: VehicleDetailBody
): VehicleDetailBodyDTO => ({
  vehicle_body_details: vehicleBody?.vehicle_body_details || '',
  vehicle_height: vehicleBody?.vehicle_height || 0,
  vehicle_width: vehicleBody?.vehicle_width || 0,
  vehicle_length: vehicleBody?.vehicle_length || 0,
  vehicle_passenger_capacity: vehicleBody?.vehicle_passenger_capacity || 0,
  vehicle_cargo_volume: vehicleBody?.vehicle_cargo_volume || 0,
  vehicle_maximum_weight_capacity:
    vehicleBody?.vehicle_maximum_weight_capacity || 0,
  vehicle_total_fuel_quantity: vehicleBody?.vehicle_total_fuel_quantity || 0,
  vehicle_tank_1_fuel_quantity: vehicleBody?.vehicle_tank_1_fuel_quantity || 0,
  vehicle_tank_2_fuel_quantity: vehicleBody?.vehicle_tank_2_fuel_quantity || 0,
  status: vehicleBody ? vehicleBody?.status : Status.Active,
});

// ✅ Convert Vehicle Detail Purchase Data to API Payload
export const toVehicleDetailPurchasePayload = (
  vehiclePurchase?: VehicleDetailPurchase
): VehicleDetailPurchaseDTO => ({
  purchase_date: vehiclePurchase?.purchase_date || '',
  purchase_vendor_id: vehiclePurchase?.purchase_vendor_id || '',
  purchase_notes: vehiclePurchase?.purchase_notes || '',
  purchase_vehicle_type:
    vehiclePurchase?.purchase_vehicle_type || PurchaseVehicleType.New,
  purchase_type: vehiclePurchase?.purchase_type || PurchaseType.NoFinance,

  purchase_total_amount: vehiclePurchase?.purchase_total_amount || 0,

  loan_lender_id: vehiclePurchase?.loan_lender_id || '',
  loan_amount: vehiclePurchase?.loan_amount || 0,
  loan_down_payment: vehiclePurchase?.loan_down_payment || 0,
  loan_interest_rate: vehiclePurchase?.loan_interest_rate || 0,
  loan_no_of_installments: vehiclePurchase?.loan_no_of_installments || 0,
  loan_first_payment_date: vehiclePurchase?.loan_first_payment_date || '',
  loan_last_payment_date: vehiclePurchase?.loan_last_payment_date || '',
  loan_monthly_emi: vehiclePurchase?.loan_monthly_emi || 0,
  loan_emi_date: vehiclePurchase?.loan_emi_date || 0,

  lease_vendor_id: vehiclePurchase?.lease_vendor_id || '',
  lease_start_date: vehiclePurchase?.lease_start_date || '',
  lease_end_date: vehiclePurchase?.lease_end_date || '',
  lease_security_deposit_amount:
    vehiclePurchase?.lease_security_deposit_amount || 0,
  lease_monthly_emi_amount: vehiclePurchase?.lease_monthly_emi_amount || 0,
  lease_emi_date: vehiclePurchase?.lease_emi_date || 0,

  warranty_expiration_date: vehiclePurchase?.warranty_expiration_date || '',
  warranty_max_odometer_reading:
    vehiclePurchase?.warranty_max_odometer_reading || 0,
  warranty_exchange_date: vehiclePurchase?.warranty_exchange_date || '',

  status: vehiclePurchase ? vehiclePurchase.status : Status.Active,
});

// ✅ Convert Vehicle Detail Life Cycle Data to API Payload
export const toVehicleDetailLifeCyclePayload = (
  vehicleLifeCycle?: VehicleDetailLifeCycle
): VehicleDetailLifeCycleDto => ({
  service_start_date: vehicleLifeCycle?.service_start_date || '',
  service_start_odometer_reading:
    vehicleLifeCycle?.service_start_odometer_reading || 0,

  service_end_date: vehicleLifeCycle?.service_end_date || '',
  service_end_odometer_reading:
    vehicleLifeCycle?.service_end_odometer_reading || 0,

  life_estimate_max_month_year:
    vehicleLifeCycle?.life_estimate_max_month_year || '',
  life_estimate_max_odometer_reading:
    vehicleLifeCycle?.life_estimate_max_odometer_reading || 0,

  life_expiry: vehicleLifeCycle?.life_expiry || LifeExpiry.No,
  life_expiry_message: vehicleLifeCycle?.life_expiry_message || '',
  life_expiry_note: vehicleLifeCycle?.life_expiry_note || '',

  status: vehicleLifeCycle ? vehicleLifeCycle.status : Status.Active,
});

// ✅ API Methods

// 🔍 Find Vehicles
export const findVehicles = async (
  payload: VehicleQueryDTO
): Promise<FBR<MasterVehicle[]>> => {
  return apiPost<FBR<MasterVehicle[]>, VehicleQueryDTO>(
    ENDPOINTS.FIND,
    payload
  );
};

export const findVehiclesLiveDashboard = async (
  payload: VehicleQueryDTO
): Promise<FBR<MasterVehicle[]>> => {
  return apiPost<FBR<MasterVehicle[]>, VehicleQueryDTO>(
    ENDPOINTS.FIND_LIVE_DASHBOARD,
    payload
  );
};

export const findVehicleGPSDetails = async (
  payload: VehicleGPSQueryDTO
): Promise<BR<VehicleDetailGPS>> => {
  return apiPost<BR<VehicleDetailGPS>, VehicleGPSQueryDTO>(
    ENDPOINTS.FIND_GPS_DETAILS,
    payload
  );
};

// ➕ Create Vehicle
export const createVehicle = async (payload: VehicleDTO): Promise<SBR> => {
  return apiPost<SBR, VehicleDTO>(ENDPOINTS.CREATE, payload);
};

// ✏️ Update Vehicle
export const updateVehicle = async (
  id: string,
  payload: VehicleDTO
): Promise<SBR> => {
  return apiPatch<SBR, VehicleDTO>(
    ENDPOINTS.UPDATE.replace(':id', id),
    payload
  );
};

// ❌ Delete Vehicle
export const deleteVehicle = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.DELETE.replace(':id', id));
};

// ✅ Vehicle Details Updates
// 🔹 Update Body Details
export const updateVehicleBodyDetails = async (
  id: string,
  payload: VehicleDetailBodyDTO
): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailBodyDTO>(
    ENDPOINTS.BODY_DETAILS_UPDATE.replace(':id', id),
    payload
  );
};

// 🔹 Update Life Cycle Details
export const updateVehicleLifeCycleDetails = async (
  id: string,
  payload: VehicleDetailLifeCycleDto
): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailLifeCycleDto>(
    ENDPOINTS.LIFE_CYCLE_DETAILS_UPDATE.replace(':id', id),
    payload
  );
};

// 🔹 Update Purchase Details
export const updateVehiclePurchaseDetails = async (
  id: string,
  payload: VehicleDetailPurchaseDTO
): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailPurchaseDTO>(
    ENDPOINTS.PURCHASE_DETAILS_UPDATE.replace(':id', id),
    payload
  );
};

// 🔹 Update GPS Details (Main)
export const updateVehicleGPSDetailsMain = async (
  id: string,
  payload: VehicleDetailGPSMainDTO
): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailGPSMainDTO>(
    ENDPOINTS.GPS_DETAILS_MAIN_UPDATE.replace(':id', id),
    payload
  );
};

// 🔹 Update GPS Details (Data)
export const updateVehicleGPSDetailsData = async (
  id: string,
  payload: VehicleDetailGPSDataDTO
): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailGPSDataDTO>(
    ENDPOINTS.GPS_DETAILS_DATA_UPDATE.replace(':id', id),
    payload
  );
};

// 🔹 Update GPS Details (Analytics)
export const updateVehicleGPSDetailsAnalytics = async (
  id: string,
  payload: VehicleDetailGPSAnalyticsDTO
): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailGPSAnalyticsDTO>(
    ENDPOINTS.GPS_DETAILS_ANALYTICS_UPDATE.replace(':id', id),
    payload
  );
};

// 🔹 Update Trip Details
export const updateVehicleTripDetails = async (
  id: string,
  payload: VehicleDetailTripDTO
): Promise<SBR> => {
  return apiPatch<SBR, VehicleDetailTripDTO>(
    ENDPOINTS.TRIP_DETAILS_UPDATE.replace(':id', id),
    payload
  );
};

// // ✅ Presigned URL for file uploads
// export const getPresignedUrl = async (fileName: string): Promise<SBR> => {
//   return apiGet<SBR>(ENDPOINTS.PRESIGNED_URL(fileName));
// };

// ✅ Vehicle Driver Link Management
// 🔗 Link Driver to Vehicle
export const linkDriverToVehicle = async (
  payload: VehicleDriverLinkDTO
): Promise<SBR> => {
  return apiPost<SBR, VehicleDriverLinkDTO>(ENDPOINTS.DRIVER_LINK, payload);
};

// 🔗 Unlink Driver from Vehicle
export const unlinkDriverFromVehicle = async (
  payload: VehicleDriverLinkDTO
): Promise<SBR> => {
  return apiPost<SBR, VehicleDriverLinkDTO>(ENDPOINTS.DRIVER_UNLINK, payload);
};

// 📜 Get Driver Link History by Vehicle
export const getDriverLinkHistoryByVehicle = async (
  id: string,
  params: BaseQueryDTO
): Promise<FBR<AssignRemoveDriverHistory[]>> => {
  return apiGet<FBR<AssignRemoveDriverHistory[]>>(
    ENDPOINTS.DRIVER_LINK_HISTORY_BY_VEHICLE.replace(':id', id), params
  );
};

// 📜 Get Driver Link History by Driver
export const getDriverLinkHistoryByDriver = async (
  id: string,
  params: BaseQueryDTO
): Promise<FBR<AssignRemoveDriverHistory[]>> => {
  return apiGet<FBR<AssignRemoveDriverHistory[]>>(
    ENDPOINTS.DRIVER_LINK_HISTORY_BY_DRIVER.replace(':id', id), params
  );
};

// ✅ Vehicle Device Link Management

// 🔗 Link Device to Vehicle
export const linkDeviceToVehicle = async (
  payload: VehicleDeviceLinkDTO
): Promise<SBR> => {
  return apiPost<SBR, VehicleDeviceLinkDTO>(ENDPOINTS.DEVICE_LINK, payload);
};

// 🔗 Unlink Device from Vehicle
export const unlinkDeviceFromVehicle = async (
  payload: VehicleDeviceUnlinkDTO
): Promise<SBR> => {
  return apiPost<SBR, VehicleDeviceUnlinkDTO>(ENDPOINTS.DEVICE_UNLINK, payload);
};

// 📜 Get Device Link History by Vehicle
export const getDeviceLinkHistoryByVehicle = async (
  id: string,
  params: BaseQueryDTO
): Promise<FBR<AssignRemoveDeviceHistory[]>> => {
  return apiGet<FBR<AssignRemoveDeviceHistory[]>>(
    ENDPOINTS.DEVICE_LINK_HISTORY_BY_VEHICLE.replace(':id', id), params
  );
};

// 📜 Get Device Link History by Device
export const getDeviceLinkHistoryByDevice = async (
  id: string,
  params: BaseQueryDTO
): Promise<FBR<AssignRemoveDeviceHistory[]>> => {
  return apiGet<FBR<AssignRemoveDeviceHistory[]>>(
    ENDPOINTS.DEVICE_LINK_HISTORY_BY_DEVICE.replace(':id', id), params
  );
};

// ✅ Cache Management

// 🔄 Get Cache
export const getVehicleCache = async (
  organisationId: string
): Promise<FBR<MasterVehicle[]>> => {
  return apiGet<FBR<MasterVehicle[]>>(
    ENDPOINTS.cache.replace(':organisation_id', organisationId)
  );
};

// 🔄 Get Simple Cache
export const getVehicleSimpleCache = async (
  organisationId: string
): Promise<FBR<MasterVehicle[]>> => {
  return apiGet<FBR<MasterVehicle[]>>(
    ENDPOINTS.cache_simple.replace(':organisation_id', organisationId)
  );
};

export const getVehicleSimpleDropdownCustom = async (
  organisationId: string
): Promise<FBR<MasterVehicleDropdown[]>> => {
  return apiGet<FBR<MasterVehicleDropdown[]>>(
    ENDPOINTS.cache_dropdown.replace(':organisation_id', organisationId)
  );
};

// 🔄 Get Parent Cache
export const getVehicleParentCache = async (
  organisationId: string
): Promise<FBR<MasterVehicle[]>> => {
  return apiGet<FBR<MasterVehicle[]>>(
    ENDPOINTS.cache_parent.replace(':organisation_id', organisationId)
  );
};
