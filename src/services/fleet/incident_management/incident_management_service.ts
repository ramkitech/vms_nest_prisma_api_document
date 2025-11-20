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
import { IncidentRoadType, IncidentTime, IncidentVisibility, IncidentWeather, IssueSeverity, IssueSource, IssueStatus, Priority, Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { User } from 'src/services/main/users/user_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterFleetInsuranceClaimStatus } from 'src/services/master/fleet/master_fleet_insurance_claim_status_service';
import { MasterFleetIncidentSeverity } from 'src/services/master/fleet/master_fleet_incident_severity_service';
import { MasterFleetIncidentStatus } from 'src/services/master/fleet/master_fleet_incident_status_service';
import { MasterFleetIncidentType } from 'src/services/master/fleet/master_fleet_incident_type_service';
import { MasterExpenseName } from 'src/services/master/expense/master_expense_name_service';

const URL = 'fleet/incident_management/incidents';

const ENDPOINTS = {

    // AWS S3 PRESIGNED
    presigned_url_file: `${URL}/presigned_url`,

    find: `${URL}/search`,
    create: `${URL}`,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    // File
    create_file: `${URL}/create_file`,
    remove_file: (id: string): string => `${URL}/remove_file/${id}`,

    create_cost: `${URL}/create_cost`,
    find_cost: `${URL}/cost/search`,
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
    vehicle_incident_file_id: string;

    // ✅ Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    vehicle_incident_id: string;
    FleetIncidentManagement?: FleetIncidentManagement;
}


// ✅ VehicleIncidentFile Schema
export const VehicleIncidentFileSchema = BaseFileSchema.extend({
    organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vehicle_incident_id: single_select_optional('FleetIncidentManagement'), // ✅ Single-Selection -> FleetIncidentManagement
});
export type VehicleIncidentFileDTO = z.infer<typeof VehicleIncidentFileSchema>;

// ✅ FleetIncidentManagement Create/update Schema
export const IncidentManagementSchema = z.object({
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
    incident_description: stringOptional('Incident DescriptionL', 0, 2000),

    // Location Details
    latitude: doubleOptionalLatLng('Latitude'),
    longitude: doubleOptionalLatLng('Longitude'),
    google_location: stringOptional('Google Location', 0, 500),

    insurance_cover: enumMandatory('Insurance Cover', YesNo, YesNo.No),
    insurance_claimed: enumMandatory('Insurance Claimed', YesNo, YesNo.No),
    insurance_claimed_amount: doubleOptional('Insurance Claimed Amount'),
    insurance_settled_amount: doubleOptional('Insurance Settled Amount'),
    insurance_policy_number: stringOptional('Insurance Policy  Number', 0, 100),
    insurance_company_name: stringOptional('Insurance Company Name', 0, 100),
    insurance_contact_number: stringOptional('Insurance Contact Number', 0, 50),
    insurance_description: stringOptional('Insurance Description', 0, 2000),

    police_report_filed: enumMandatory('Police Report Filed', YesNo, YesNo.No),
    police_report_number: stringOptional('Police Report  Number', 0, 100),
    police_station_name: stringOptional('Police Station Name', 0, 100),

    any_injuries: enumMandatory('Any Injuries', YesNo, YesNo.No),
    injury_description: stringOptional('Injury Description', 0, 1000),
    injured_persons_count: numberOptional('Injury Persons Count'),

    legal_description: stringOptional('Legal Description', 0, 2000),
    involved_parties_description: stringOptional(
        'Involved Parties Description',
        0,
        2000,
    ),
    status: enumMandatory('Status', Status, Status.Active),

    VehicleIncidentFileSchema: nestedArrayOfObjectsOptional(
        'VehicleIncidentFileSchema',
        VehicleIncidentFileSchema,
        [],
    ),
});
export type IncidentManagementDTO = z.infer<typeof IncidentManagementSchema>;

// ✅ FleetIncidentManagementCost Query Schema
export const IncidentManagementQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    user_ids: multi_select_optional('User'), // ✅ Multi-Selection -> User
    vehicle_incident_ids: multi_select_optional('FleetIncidentManagement'), // ✅ Multi-Selection -> FleetIncidentManagement
    vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-Selection -> MasterVehicle
    driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-Selection -> MasterDriver
    landmark_ids: multi_select_optional('MasterMainLandMark'), // ✅ Multi-Selection -> MasterMainLandMark
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
    fleet_incident_type_ids: multi_select_optional('MasterFleetIncidentType'), // ✅ Multi-Selection -> MasterFleetIncidentType
    fleet_incident_status_ids: multi_select_optional('MasterFleetIncidentStatus'), // ✅ Multi-Selection -> MasterFleetIncidentStatus
    fleet_incident_severity_ids: multi_select_optional(
        'MasterFleetIncidentSeverity',
    ), // ✅ Multi-Selection -> MasterFleetIncidentSeverity
    fleet_insurance_claim_status_ids: multi_select_optional(
        'MasterFleetInsuranceClaimStatus',
    ), // ✅ Multi-Selection -> MasterFleetInsuranceClaimStatus
});
export type IncidentManagementQueryDTO = z.infer<
    typeof IncidentManagementQuerySchema
>;

// ✅ FleetIncidentManagementCost Create/update Schema
export const IncidentManagementCostSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    vehicle_incident_id: single_select_mandatory('FleetIncidentManagement'), // ✅ Single-Selection -> FleetIncidentManagement
    expense_name_id: single_select_mandatory('MasterExpenseName'), // ✅ Single-Selection -> MasterExpenseName
    incident_cost_description: stringOptional(
        'Incident Cost Description',
        0,
        2000,
    ),
    incident_cost_amount: doubleOptional('Incident Cost Amount'),
    incident_cost_date: dateMandatory('Incident Cost Date'),
    status: enumMandatory('Status', Status, Status.Active),
});
export type IncidentManagementCostDTO = z.infer<
    typeof IncidentManagementCostSchema
>;

// ✅ FleetIncidentManagementCost Query Schema
export const IncidentManagementCostQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    vehicle_incident_ids: multi_select_optional('FleetIncidentManagement'), // ✅ Multi-Selection -> FleetIncidentManagement
    expense_name_ids: multi_select_optional('MasterExpenseName'), // ✅ Multi-Selection -> MasterExpenseName
    incident_cost_ids: multi_select_optional('FleetIncidentManagementCost'), // ✅ Multi-Selection -> FleetIncidentManagementCost
});
export type IncidentManagementCostQueryDTO = z.infer<
    typeof IncidentManagementCostQuerySchema
>;


// ✅ Convert FleetIncidentManagement Data to API Payload
export const toFleetIncidentManagementPayload = (incidentManagement: FleetIncidentManagement): IncidentManagementDTO => ({
    // Incident Details
    incident_date: incidentManagement.incident_date || '',
    was_towed: incidentManagement.was_towed || YesNo.No,
    is_vehicle_operational: incidentManagement.is_vehicle_operational || YesNo.Yes,
    incident_time: incidentManagement.incident_time || IncidentTime.EarlyMorning,
    incident_weather: incidentManagement.incident_weather || IncidentWeather.Clear,
    incident_road_type: incidentManagement.incident_road_type || IncidentRoadType.Highway,
    incident_visibility: incidentManagement.incident_visibility || IncidentVisibility.Excellent,
    odometer_reading: incidentManagement.odometer_reading || 0,
    incident_cost: incidentManagement.incident_cost || 0,
    incident_description: incidentManagement.incident_description || '',

    // Location Details
    latitude: incidentManagement.latitude || 0,
    longitude: incidentManagement.longitude || 0,
    google_location: incidentManagement.google_location || '',

    // Insurance Details
    insurance_cover: incidentManagement.insurance_cover || YesNo.No,
    insurance_claimed: incidentManagement.insurance_claimed || YesNo.No,
    insurance_claimed_amount: incidentManagement.insurance_claimed_amount || 0,
    insurance_settled_amount: incidentManagement.insurance_settled_amount || 0,
    insurance_policy_number: incidentManagement.insurance_policy_number || '',
    insurance_company_name: incidentManagement.insurance_company_name || '',
    insurance_contact_number: incidentManagement.insurance_contact_number || '',
    insurance_description: incidentManagement.insurance_description || '',

    // Complaint Details
    police_report_filed: incidentManagement.police_report_filed || YesNo.No,
    police_report_number: incidentManagement.police_report_number || '',
    police_station_name: incidentManagement.police_station_name || '',

    // Injury Details
    any_injuries: incidentManagement.any_injuries || YesNo.No,
    injury_description: incidentManagement.injury_description || '',
    injured_persons_count: incidentManagement.injured_persons_count || 0,

    // Other Details
    legal_description: incidentManagement.legal_description || '',
    involved_parties_description: incidentManagement.involved_parties_description || '',

    // Relations
    organisation_id: incidentManagement.organisation_id || '',
    user_id: incidentManagement.user_id || '',
    vehicle_id: incidentManagement.vehicle_id || '',
    driver_id: incidentManagement.driver_id || '',
    fleet_incident_type_id: incidentManagement.fleet_incident_type_id || '',
    fleet_incident_status_id: incidentManagement.fleet_incident_status_id || '',
    fleet_incident_severity_id: incidentManagement.fleet_incident_severity_id || '',
    fleet_insurance_claim_status_id: incidentManagement.fleet_insurance_claim_status_id || '',

    status: Status.Active,

    VehicleIncidentFileSchema: incidentManagement.FleetIncidentManagementFile?.map((file) => ({
        vehicle_incident_file_id: file.vehicle_incident_file_id ?? '',

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
        vehicle_incident_id: file.vehicle_incident_id ?? '',
    })) ?? [],
});

// ✅ Create New FleetIncidentManagement Payload
export const newFleetIncidentManagementPayload = (): IncidentManagementDTO => ({
    incident_date: '',
    was_towed: YesNo.Yes,
    is_vehicle_operational: YesNo.Yes,
    incident_time: IncidentTime.EarlyMorning,
    incident_weather: IncidentWeather.Clear,
    incident_road_type: IncidentRoadType.Highway,
    incident_visibility: IncidentVisibility.Excellent,
    odometer_reading: 0,
    incident_cost: 0,
    incident_description: '',

    latitude: 0,
    longitude: 0,
    google_location: '',

    insurance_cover: YesNo.Yes,
    insurance_claimed: YesNo.Yes,
    insurance_claimed_amount: 0,
    insurance_settled_amount: 0,
    insurance_policy_number: '',
    insurance_company_name: '',
    insurance_contact_number: '',
    insurance_description: '',

    police_report_filed: YesNo.Yes,
    police_report_number: '',
    police_station_name: '',

    any_injuries: YesNo.Yes,
    injury_description: '',
    injured_persons_count: 0,

    legal_description: '',
    involved_parties_description: '',

    status: Status.Active,

    organisation_id: '',
    user_id: '',
    vehicle_id: '',
    driver_id: '',
    fleet_incident_type_id: '',
    fleet_incident_status_id: '',
    fleet_incident_severity_id: '',
    fleet_insurance_claim_status_id: '',

    VehicleIncidentFileSchema: []
});

// ✅ Convert FleetIncidentManagementCost Data to API Payload
export const toFleetIncidentManagementCostPayload = (incidentManagementCost: FleetIncidentManagementCost): IncidentManagementCostDTO => ({
    incident_cost_description: incidentManagementCost.incident_cost_description || '',
    incident_cost_amount: incidentManagementCost.incident_cost_amount || 0,
    incident_cost_date: incidentManagementCost.incident_cost_date || '',

    organisation_id: incidentManagementCost.organisation_id || '',
    vehicle_incident_id: incidentManagementCost.vehicle_incident_id || '',
    expense_name_id: incidentManagementCost.expense_name_id || '',

    status: Status.Active,
});

// ✅ Create New FleetIncidentManagementCost Payload
export const newFleetIncidentManagementCostPayload = (): IncidentManagementCostDTO => ({
    incident_cost_description: '',
    incident_cost_amount: 0,
    incident_cost_date: '',

    organisation_id: '',
    vehicle_incident_id: '',
    expense_name_id: '',

    status: Status.Active,
});

// Generate presigned URL for file uploads
export const presigned_url_file = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
    return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.presigned_url_file, data);
};

// API Methods
export const createIncidentManagement = async (data: IncidentManagementDTO): Promise<SBR> => {
    return apiPost<SBR, IncidentManagementDTO>(ENDPOINTS.create, data);
};

export const findIncidentManagement = async (data: IncidentManagementQueryDTO): Promise<FBR<FleetIncidentManagement[]>> => {
    return apiPost<FBR<FleetIncidentManagement[]>, IncidentManagementQueryDTO>(ENDPOINTS.find, data);
};

export const updateIncidentManagement = async (id: string, data: IncidentManagementDTO): Promise<SBR> => {
    return apiPatch<SBR, IncidentManagementDTO>(ENDPOINTS.update(id), data);
};

export const deleteIncidentManagement = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// File API Methods
export const create_file = async (data: VehicleIncidentFileDTO): Promise<SBR> => {
    return apiPost<SBR, VehicleIncidentFileDTO>(ENDPOINTS.create_file, data);
};

export const remove_file = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_file(id));
};

// IncidentManagementCost
export const createIncidentManagementCost = async (data: IncidentManagementCostDTO): Promise<SBR> => {
    return apiPost<SBR, IncidentManagementCostDTO>(ENDPOINTS.create_cost, data);
};

export const findIncidentManagementCost = async (data: IncidentManagementQueryDTO): Promise<FBR<FleetIncidentManagementCost[]>> => {
    return apiPost<FBR<FleetIncidentManagementCost[]>, IncidentManagementQueryDTO>(ENDPOINTS.find_cost, data);
};

export const updateIncidentManagementCost = async (id: string, data: IncidentManagementCostDTO): Promise<SBR> => {
    return apiPatch<SBR, IncidentManagementCostDTO>(ENDPOINTS.update_cost(id), data);
};

export const deleteIncidentManagementCost = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_cost(id));
};