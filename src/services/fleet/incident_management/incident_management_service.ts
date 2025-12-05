// Imports
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BaseCommonFile, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringOptional,
    enumMandatory,
    single_select_mandatory,
    multi_select_optional,
    enumArrayOptional,
    numberOptional,
    getAllEnums,
    nestedArrayOfObjectsOptional,
    dateMandatory,
    single_select_optional,
    doubleOptional,
    doubleOptionalLatLng,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { FileType, IncidentRoadType, IncidentTime, IncidentVisibility, IncidentWeather, Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';

import { MasterFleetInsuranceClaimStatus } from 'src/services/master/fleet/master_fleet_insurance_claim_status_service';
import { MasterFleetIncidentSeverity } from 'src/services/master/fleet/master_fleet_incident_severity_service';
import { MasterFleetIncidentStatus } from 'src/services/master/fleet/master_fleet_incident_status_service';
import { MasterFleetIncidentType } from 'src/services/master/fleet/master_fleet_incident_type_service';
import { MasterExpenseName } from 'src/services/master/expense/master_expense_name_service';

const URL = 'fleet/incident_management/incidents';

const ENDPOINTS = {
    // AWS S3 PRESIGNED
    incident_file_presigned_url: `${URL}/incident_file_presigned_url`,

    // File
    create_incident_file: `${URL}/create_incident_file`,
    remove_incident_file: (id: string): string => `${URL}/remove_incident_file/${id}`,

    find: `${URL}/search`,
    incident_dashboard: `${URL}/incident_dashboard`,
    create: `${URL}`,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    find_cost: `${URL}/cost/search`,
    create_cost: `${URL}/create_cost`,
    update_cost: (id: string): string => `${URL}/update_cost/${id}`,
    remove_cost: (id: string): string => `${URL}/remove_cost/${id}`,
};

// ✅ FleetIncidentManagement Interface
export interface FleetIncidentManagement extends Record<string, unknown> {
    vehicle_incident_id: string;
    vehicle_sub_incident_id: number;
    incident_code?: string;

    // Incident Details
    incident_date: string;
    incident_date_f: string;
    was_towed: YesNo;
    is_vehicle_operational: YesNo;
    incident_time: IncidentTime;
    incident_weather: IncidentWeather;
    incident_road_type: IncidentRoadType;
    incident_visibility: IncidentVisibility;
    odometer_reading?: number;
    incident_cost?: number;
    incident_description?: string;

    // Location Details
    latitude?: number;
    longitude?: number;
    google_location?: string;

    // Insurance Details
    insurance_cover: YesNo;
    insurance_claimed: YesNo;
    insurance_claimed_amount?: number;
    insurance_settled_amount?: number;
    insurance_policy_number?: string;
    insurance_company_name?: string;
    insurance_contact_number?: string;
    insurance_description?: string;

    // Complaint Details
    police_report_filed: YesNo;
    police_report_number?: string;
    police_station_name?: string;

    // Injury Details
    any_injuries: YesNo;
    injury_description?: string;
    injured_persons_count?: number;

    // Other Details
    legal_description?: string;
    involved_parties_description?: string;

    // ✅ Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // ✅ Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    user_id: string;
    User?: User;

    vehicle_id: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;

    driver_id?: string;
    MasterDriver?: MasterDriver;
    driver_details?: string;

    fleet_incident_type_id: string;
    MasterFleetIncidentType?: MasterFleetIncidentType;
    fleet_incident_type?: string;

    fleet_incident_status_id: string;
    MasterFleetIncidentStatus?: MasterFleetIncidentStatus;
    fleet_incident_status?: string;

    fleet_incident_severity_id: string;
    MasterFleetIncidentSeverity?: MasterFleetIncidentSeverity;
    fleet_incident_severity?: string;

    fleet_insurance_claim_status_id: string;
    MasterFleetInsuranceClaimStatus?: MasterFleetInsuranceClaimStatus;
    fleet_insurance_claim_status?: string;


    FleetIncidentManagementFile: FleetIncidentManagementFile[]

    // ✅ Count (Child Relations)
    _count?: {
        FleetIncidentManagementFile: number;
        FleetIncidentManagementCost: number;
        FleetIssueManagement: number;
    };
}

// FleetIncidentManagementCost
export interface FleetIncidentManagementCost extends Record<string, unknown> {
    incident_cost_id: string;
    incident_cost_description?: string;
    incident_cost_amount?: number;
    incident_cost_date?: string;
    incident_cost_date_f?: string;

    // ✅ Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // ✅ Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    vehicle_incident_id: string;
    FleetIncidentManagement?: FleetIncidentManagement;

    expense_name_id: string;
    MasterExpenseName?: MasterExpenseName;

    // ✅ Count (Child Relations)
    _count?: {
    };
}

// ✅ FleetIncidentManagementFile Interface
export interface FleetIncidentManagementFile extends BaseCommonFile {
    // Primary Fields
    fleet_incident_management_file_id: string;

    // ✅ Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    vehicle_incident_id: string;
    FleetIncidentManagement?: FleetIncidentManagement;
}

export interface IncidentDashboard {
  vehicle_id: string;
  vehicle_number: string;
  vehicle_type: string;
  incidents_count: number;
}

// ✅ FleetIncidentManagementFile Schema
export const FleetIncidentManagementFileSchema = BaseFileSchema.extend({
    organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vehicle_incident_id: single_select_optional('FleetIncidentManagement'), // ✅ Single-Selection -> FleetIncidentManagement
});
export type FleetIncidentManagementFileDTO = z.infer<
    typeof FleetIncidentManagementFileSchema
>;

// ✅ FleetIncidentManagement Create/update Schema
export const FleetIncidentManagementSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    user_id: single_select_mandatory('User'), // ✅ Single-Selection -> User
    vehicle_id: single_select_mandatory('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
    driver_id: single_select_optional('MasterDriver'), // ✅ Single-Selection -> MasterDriver

    fleet_incident_type_id: single_select_mandatory('MasterFleetIncidentType'), // MasterFleetIncidentType
    fleet_incident_status_id: single_select_mandatory(
        'MasterFleetIncidentStatus',
    ), // MasterFleetIncidentStatus
    fleet_incident_severity_id: single_select_mandatory(
        'MasterFleetIncidentSeverity',
    ), // MasterFleetIncidentSeverity
    fleet_insurance_claim_status_id: single_select_mandatory(
        'MasterFleetInsuranceClaimStatus',
    ), // MasterFleetInsuranceClaimStatus

    // Incident Details
    incident_date: dateMandatory('Incident Date'),
    was_towed: enumMandatory('Was Towed', YesNo, YesNo.No),
    is_vehicle_operational: enumMandatory(
        'Is Vehicle Operational',
        YesNo,
        YesNo.Yes,
    ),
    incident_time: enumMandatory(
        'Incident Time',
        IncidentTime,
        IncidentTime.Unknown,
    ),
    incident_weather: enumMandatory(
        'Incident Weather',
        IncidentWeather,
        IncidentWeather.Unknown,
    ),
    incident_road_type: enumMandatory(
        'Incident Road Type',
        IncidentRoadType,
        IncidentRoadType.Unknown,
    ),
    incident_visibility: enumMandatory(
        'Incident Visibility',
        IncidentVisibility,
        IncidentVisibility.Unknown,
    ),
    odometer_reading: numberOptional('Odometer Reading'),
    incident_cost: doubleOptional('Incident Cost'),
    incident_description: stringOptional('Incident Description', 0, 2000),

    // Location Details
    latitude: doubleOptionalLatLng('Latitude'),
    longitude: doubleOptionalLatLng('Longitude'),
    google_location: stringOptional('Google Location', 0, 500),

    // Insurance Details
    insurance_cover: enumMandatory('Insurance Cover', YesNo, YesNo.No),
    insurance_claimed: enumMandatory('Insurance Claimed', YesNo, YesNo.No),
    insurance_claimed_amount: doubleOptional('Insurance Claimed Amount'),
    insurance_settled_amount: doubleOptional('Insurance Settled Amount'),
    insurance_policy_number: stringOptional('Insurance Policy  Number', 0, 100),
    insurance_company_name: stringOptional('Insurance Company Name', 0, 100),
    insurance_contact_number: stringOptional('Insurance Contact Number', 0, 100),
    insurance_description: stringOptional('Insurance Description', 0, 2000),

    // Complaint Details
    police_report_filed: enumMandatory('Police Report Filed', YesNo, YesNo.No),
    police_report_number: stringOptional('Police Report  Number', 0, 100),
    police_station_name: stringOptional('Police Station Name', 0, 100),

    // Injury Details
    any_injuries: enumMandatory('Any Injuries', YesNo, YesNo.No),
    injury_description: stringOptional('Injury Description', 0, 1000),
    injured_persons_count: numberOptional('Injury Persons Count'),

    // Other Details
    legal_description: stringOptional('Legal Description', 0, 2000),
    involved_parties_description: stringOptional(
        'Involved Parties Description',
        0,
        2000,
    ),

    // Other
    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),

    FleetIncidentManagementFileSchema: nestedArrayOfObjectsOptional(
        'FleetIncidentManagementFileSchema',
        FleetIncidentManagementFileSchema,
        [],
    ),
});
export type FleetIncidentManagementDTO = z.infer<
    typeof FleetIncidentManagementSchema
>;

// ✅ FleetIncidentManagementDashBoard Query Schema
export const FleetIncidentManagementDashBoardQuerySchema =
  BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-Selection -> MasterVehicle

    from_date: dateMandatory('From Date'),
    to_date: dateMandatory('To Date'),
  });
export type FleetIncidentManagementDashBoardQueryDTO = z.infer<
  typeof FleetIncidentManagementDashBoardQuerySchema
>;

// ✅ FleetIncidentManagementComment Query Schema
export const FleetIncidentManagementQuerySchema = BaseQuerySchema.extend({
    vehicle_incident_ids: multi_select_optional('FleetIncidentManagement'), // ✅ Multi-Selection -> FleetIncidentManagement

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    user_ids: multi_select_optional('User'), // ✅ Multi-Selection -> User
    vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-Selection -> MasterVehicle
    driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-Selection -> MasterDriver

    fleet_incident_type_ids: multi_select_optional('MasterFleetIncidentType'), // ✅ Multi-Selection -> MasterFleetIncidentType
    fleet_incident_status_ids: multi_select_optional('MasterFleetIncidentStatus'), // ✅ Multi-Selection -> MasterFleetIncidentStatus
    fleet_incident_severity_ids: multi_select_optional(
        'MasterFleetIncidentSeverity',
    ), // ✅ Multi-Selection -> MasterFleetIncidentSeverity
    fleet_insurance_claim_status_ids: multi_select_optional(
        'MasterFleetInsuranceClaimStatus',
    ), // ✅ Multi-Selection -> MasterFleetInsuranceClaimStatus

    was_towed: enumArrayOptional('Was Towed', YesNo, getAllEnums(YesNo)),
    is_vehicle_operational: enumArrayOptional(
        'Is Vehicle Operational',
        YesNo,
        getAllEnums(YesNo),
    ),
    incident_time: enumArrayOptional(
        'Incident Time',
        IncidentTime,
        getAllEnums(IncidentTime),
    ),
    incident_weather: enumArrayOptional(
        'Incident Weather',
        IncidentWeather,
        getAllEnums(IncidentWeather),
    ),
    incident_road_type: enumArrayOptional(
        'Incident Road Type',
        IncidentRoadType,
        getAllEnums(IncidentRoadType),
    ),
    incident_visibility: enumArrayOptional(
        'Incident Visibility',
        IncidentVisibility,
        getAllEnums(IncidentVisibility),
    ),
    insurance_cover: enumArrayOptional(
        'Insurance Cover',
        YesNo,
        getAllEnums(YesNo),
    ),
    insurance_claimed: enumArrayOptional(
        'Insurance Claimed',
        YesNo,
        getAllEnums(YesNo),
    ),
    police_report_filed: enumArrayOptional(
        'Police Report Filed',
        YesNo,
        getAllEnums(YesNo),
    ),
    any_injuries: enumArrayOptional('Any Injuries', YesNo, getAllEnums(YesNo)),

    from_date: dateMandatory('From Date'),
    to_date: dateMandatory('To Date'),
});
export type FleetIncidentManagementQueryDTO = z.infer<
    typeof FleetIncidentManagementQuerySchema
>;

// ✅ FleetIncidentManagementCost Create/update Schema
export const FleetIncidentManagementCostSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vehicle_incident_id: single_select_mandatory('FleetIncidentManagement'), // ✅ Single-Selection -> FleetIncidentManagement
    expense_name_id: single_select_mandatory('MasterExpenseName'), // ✅ Single-Selection -> MasterExpenseName

    incident_cost_date: dateMandatory('Incident Cost Date'),
    incident_cost_amount: doubleOptional('Incident Cost Amount'),
    incident_cost_description: stringOptional(
        'Incident Cost Description',
        0,
        2000,
    ),

    // Other
    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FleetIncidentManagementCostDTO = z.infer<
    typeof FleetIncidentManagementCostSchema
>;

// ✅ FleetIncidentManagementCost Query Schema
export const FleetIncidentManagementCostQuerySchema = BaseQuerySchema.extend({
    incident_cost_ids: multi_select_optional('FleetIncidentManagementCost'), // ✅ Multi-Selection -> FleetIncidentManagementCost

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    vehicle_incident_ids: multi_select_optional('FleetIncidentManagement'), // ✅ Multi-Selection -> FleetIncidentManagement
    expense_name_ids: multi_select_optional('MasterExpenseName'), // ✅ Multi-Selection -> MasterExpenseName
});
export type FleetIncidentManagementCostQueryDTO = z.infer<
    typeof FleetIncidentManagementCostQuerySchema
>;

// ✅ Convert FleetIncidentManagement Data to API Payload
export const toFleetIncidentManagementPayload = (row: FleetIncidentManagement): FleetIncidentManagementDTO => ({
    // Incident Details
    incident_date: row.incident_date || '',
    was_towed: row.was_towed || YesNo.No,
    is_vehicle_operational: row.is_vehicle_operational || YesNo.Yes,
    incident_time: row.incident_time || IncidentTime.Unknown,
    incident_weather: row.incident_weather || IncidentWeather.Unknown,
    incident_road_type: row.incident_road_type || IncidentRoadType.Unknown,
    incident_visibility: row.incident_visibility || IncidentVisibility.Unknown,
    odometer_reading: row.odometer_reading || 0,
    incident_cost: row.incident_cost || 0,
    incident_description: row.incident_description || '',

    // Location Details
    latitude: row.latitude || 0,
    longitude: row.longitude || 0,
    google_location: row.google_location || '',

    // Insurance Details
    insurance_cover: row.insurance_cover || YesNo.No,
    insurance_claimed: row.insurance_claimed || YesNo.No,
    insurance_claimed_amount: row.insurance_claimed_amount || 0,
    insurance_settled_amount: row.insurance_settled_amount || 0,
    insurance_policy_number: row.insurance_policy_number || '',
    insurance_company_name: row.insurance_company_name || '',
    insurance_contact_number: row.insurance_contact_number || '',
    insurance_description: row.insurance_description || '',

    // Complaint Details
    police_report_filed: row.police_report_filed || YesNo.No,
    police_report_number: row.police_report_number || '',
    police_station_name: row.police_station_name || '',

    // Injury Details
    any_injuries: row.any_injuries || YesNo.No,
    injury_description: row.injury_description || '',
    injured_persons_count: row.injured_persons_count || 0,

    // Other Details
    legal_description: row.legal_description || '',
    involved_parties_description: row.involved_parties_description || '',

    // Relations
    organisation_id: row.organisation_id || '',
    user_id: row.user_id || '',
    vehicle_id: row.vehicle_id || '',
    driver_id: row.driver_id || '',

    fleet_incident_type_id: row.fleet_incident_type_id || '',
    fleet_incident_status_id: row.fleet_incident_status_id || '',
    fleet_incident_severity_id: row.fleet_incident_severity_id || '',
    fleet_insurance_claim_status_id: row.fleet_insurance_claim_status_id || '',

    status: row.status || Status.Active,
    time_zone_id: '', // Needs to be provided manually

    FleetIncidentManagementFileSchema: row.FleetIncidentManagementFile?.map((file) => ({
        fleet_incident_management_file_id: file.fleet_incident_management_file_id ?? '',

        usage_type: (file.usage_type || '').trim(),
        file_type: file.file_type || FileType.Image,
        file_url: (file.file_url || '').trim(),
        file_key: (file.file_key || '').trim(),
        file_name: (file.file_name || '').trim(),
        file_description: (file.file_description || '').trim(),
        file_size: file.file_size || 0,
        file_metadata: file.file_metadata || {},

        status: file.status,
        added_date_time: file.added_date_time,
        modified_date_time: file.modified_date_time,
        
        organisation_id: file.organisation_id || '',

        vehicle_incident_id: file.vehicle_incident_id || '',
    })) ?? [],
});

// ✅ Create New FleetIncidentManagement Payload
export const newFleetIncidentManagementPayload = (): FleetIncidentManagementDTO => ({
    organisation_id: '',
    user_id: '',
    vehicle_id: '',
    driver_id: '',
    fleet_incident_type_id: '',
    fleet_incident_status_id: '',
    fleet_incident_severity_id: '',
    fleet_insurance_claim_status_id: '',

    incident_date: '',
    was_towed: YesNo.No,
    is_vehicle_operational: YesNo.Yes,
    incident_time: IncidentTime.Unknown,
    incident_weather: IncidentWeather.Unknown,
    incident_road_type: IncidentRoadType.Unknown,
    incident_visibility: IncidentVisibility.Unknown,
    odometer_reading: 0,
    incident_cost: 0,
    incident_description: '',

    latitude: 0,
    longitude: 0,
    google_location: '',

    insurance_cover: YesNo.No,
    insurance_claimed: YesNo.No,
    insurance_claimed_amount: 0,
    insurance_settled_amount: 0,
    insurance_policy_number: '',
    insurance_company_name: '',
    insurance_contact_number: '',
    insurance_description: '',

    police_report_filed: YesNo.No,
    police_report_number: '',
    police_station_name: '',

    any_injuries: YesNo.No,
    injury_description: '',
    injured_persons_count: 0,

    legal_description: '',
    involved_parties_description: '',

    status: Status.Active,

    FleetIncidentManagementFileSchema: [],
    time_zone_id: '', // Needs to be provided manually
});

// ✅ Convert FleetIncidentManagementCost Data to API Payload
export const toFleetIncidentManagementCostPayload = (row: FleetIncidentManagementCost): FleetIncidentManagementCostDTO => ({
    incident_cost_date: row.incident_cost_date || '',
    incident_cost_amount: row.incident_cost_amount || 0,
    incident_cost_description: row.incident_cost_description || '',

    organisation_id: row.organisation_id || '',
    vehicle_incident_id: row.vehicle_incident_id || '',
    expense_name_id: row.expense_name_id || '',

    status: row.status || Status.Active,
    time_zone_id: '', // Needs to be provided manually
});

// ✅ Create New FleetIncidentManagementCost Payload
export const newFleetIncidentManagementCostPayload = (): FleetIncidentManagementCostDTO => ({
    organisation_id: '',
    vehicle_incident_id: '',
    expense_name_id: '',

    incident_cost_date: '',
    incident_cost_amount: 0,
    incident_cost_description: '',

    status: Status.Active,
    time_zone_id: '', // Needs to be provided manually
});

// Generate presigned URL
export const get_incident_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
    return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.incident_file_presigned_url, data);
};

// File API Methods
export const create_incident_file = async (data: FleetIncidentManagementFileDTO): Promise<SBR> => {
    return apiPost<SBR, FleetIncidentManagementFileDTO>(ENDPOINTS.create_incident_file, data);
};

export const remove_incident_file = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_incident_file(id));
};

// API Methods
export const createFleetIncidentManagement = async (data: FleetIncidentManagementDTO): Promise<SBR> => {
    return apiPost<SBR, FleetIncidentManagementDTO>(ENDPOINTS.create, data);
};

export const findFleetIncidentManagement = async (data: FleetIncidentManagementQueryDTO): Promise<FBR<FleetIncidentManagement[]>> => {
    return apiPost<FBR<FleetIncidentManagement[]>, FleetIncidentManagementQueryDTO>(ENDPOINTS.find, data);
};

export const incident_dashboard = async (data: FleetIncidentManagementDashBoardQueryDTO): Promise<FBR<IncidentDashboard[]>> => {
    return apiPost<FBR<IncidentDashboard[]>, FleetIncidentManagementDashBoardQueryDTO>(ENDPOINTS.incident_dashboard, data);
};

export const updateFleetIncidentManagement = async (id: string, data: FleetIncidentManagementDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetIncidentManagementDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetIncidentManagement = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// FleetIncidentManagementCost
export const createFleetIncidentManagementCost = async (data: FleetIncidentManagementCostDTO): Promise<SBR> => {
    return apiPost<SBR, FleetIncidentManagementCostDTO>(ENDPOINTS.create_cost, data);
};

export const findFleetIncidentManagementCost = async (data: FleetIncidentManagementCostQueryDTO): Promise<FBR<FleetIncidentManagementCost[]>> => {
    return apiPost<FBR<FleetIncidentManagementCost[]>, FleetIncidentManagementCostQueryDTO>(ENDPOINTS.find_cost, data);
};

export const updateFleetIncidentManagementCost = async (id: string, data: FleetIncidentManagementCostDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetIncidentManagementCostDTO>(ENDPOINTS.update_cost(id), data);
};

export const deleteFleetIncidentManagementCost = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_cost(id));
};