// ──────── Axios Setup ─────────
export { setAxiosInstance as setupSdk } from './sdk-config';

// ──────── Core Types ──────────
export * from './core/BaseRequest';
export * from './core/BaseResponse';
export * from './core/Enums';

// ──────── API Caller ──────────
export * from './apiCall';

// ──────── Zod Utils ───────────
export * from './zod/zod_utils';
export * from './zod/zod_base_schema';

// ──────── Services ────────────

// ──────── Master ────────────

// Device
export * from './services/master/device/master_device_manufacturer_service';
export * from './services/master/device/master_device_model_service';
export * from './services/master/device/master_device_type_service';

// Expense
export * from './services/master/expense/master_expense_name_service';
export * from './services/master/expense/master_expense_type_service';
export * from './services/master/expense/master_vendor_type_service';

// Fleet
export * from './services/master/fleet/master_fleet_incident_severity_service';
export * from './services/master/fleet/master_fleet_incident_status_service';
export * from './services/master/fleet/master_fleet_incident_type_service';
export * from './services/master/fleet/master_fleet_insurance_claim_status_service';
export * from './services/master/fleet/master_fleet_service_task_service';

// Main
export * from './services/master/main/master_main_country_service';
export * from './services/master/main/master_main_currency_service';
export * from './services/master/main/master_main_date_format_service';
export * from './services/master/main/master_main_eway_bill_provider_service';
export * from './services/master/main/master_main_fasttag_bank_service';
export * from './services/master/main/master_main_industry_service';
//export * from './services/master/main/master_main_landmark_service';
export * from './services/master/main/master_main_language_service';
export * from './services/master/main/master_main_sim_provider_service';
export * from './services/master/main/master_main_state_service';
export * from './services/master/main/master_main_timezone_service';
export * from './services/master/main/master_main_unit_distance_service';
export * from './services/master/main/master_main_unit_mileage_service';
export * from './services/master/main/master_main_unit_volume_service';

// Organisation
export * from './services/master/organisation/organisation_branch_service';
export * from './services/master/organisation/organisation_color_service';
export * from './services/master/organisation/organisation_group_service';
export * from './services/master/organisation/organisation_sub_company_service';
export * from './services/master/organisation/organisation_tag_service';

// Spare Part
export * from './services/master/spare_part/master_spare_part_category_service';
export * from './services/master/spare_part/master_spare_part_sub_category_service';
export * from './services/master/spare_part/master_spare_part_unit_service';

// Trip
export * from './services/master/trip/master_trip_party_type_service';

// Tyre
export * from './services/master/tyre/master_tyre_grade_service';
export * from './services/master/tyre/master_tyre_make_service';
export * from './services/master/tyre/master_tyre_model_service';

// User
export * from './services/master/user/master_user_role_service';
export * from './services/master/user/master_user_status_service';

// Vehicle
export * from './services/master/vehicle/master_vehicle_fuel_type_service';
export * from './services/master/vehicle/master_vehicle_make_service';
export * from './services/master/vehicle/master_vehicle_model_service';
export * from './services/master/vehicle/master_vehicle_ownership_type_service';
export * from './services/master/vehicle/master_vehicle_status_type_service';
export * from './services/master/vehicle/master_vehicle_sub_model_service';
export * from './services/master/vehicle/master_vehicle_type_service';

// ──────── Account ────────────
export * from './services/account/alert_service';
export * from './services/account/bookmark_service';
export * from './services/account/notification_service';
export * from './services/account/ticket_service';

// Analytics
export * from './services/account/analytics/user_login_analytics_service';
export * from './services/account/analytics/user_page_analytics_service';

// ──────── GPS ────────────

// Features //
export * from './services/gps/features/gps_live_track_share_link_service';
export * from './services/gps/features/gps_track_history_share_link_service';

// Fuel
export * from './services/gps/features/fuel/gps_fuel_vehicle_daily_summary_service';
export * from './services/gps/features/fuel/gps_fuel_vehicle_refill_service';
export * from './services/gps/features/fuel/gps_fuel_vehicle_removal_service';

// Geofence
export * from './services/gps/features/geofence/gps_geofence_data_service';
export * from './services/gps/features/geofence/gps_geofence_transaction_service';
export * from './services/gps/features/geofence/gps_geofence_transaction_summary_service';
export * from './services/gps/features/geofence/trip_geofence_to_geofence_service';

// Reports //
export * from './services/gps/reports/gps_reports_mongo_service';
//export * from './services/gps/reports/gps_reports_postgre_service';

// GPS Models

// ──────── Main ────────────

// Devices
export * from './services/main/devices/master_device_service';

// Drivers
export * from './services/main/drivers/master_driver_service';

// Sims
export * from './services/main/sims/master_sim_service';

// Users
export * from './services/main/users/auth_service';
//export * from './services/main/users/user_admin_service';
export * from './services/main/users/user_organisation_service';
export * from './services/main/users/user_service';

// Vehicle //
export * from './services/main/vehicle/master_vehicle_service';

// Child
export * from './services/main/vehicle/childs/vehicle_odometer_history';

// ──────── Main ────────────

export * from './services/website/contact_us_detail_service';
export * from './services/website/faq_service';
export * from './services/website/static_pages_service';
