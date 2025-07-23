// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumArrayOptional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status, YesNo } from 'core/Enums';

// Other Models
import { UserOrganisation } from 'services/main/users/user_organisation_service';
import { MasterVehicle } from 'services/main/vehicle/master_vehicle_service';

const URL = 'main/master_driver';

const ENDPOINTS = {
  FIND: `${URL}/search`,
  CREATE: `${URL}`,
  UPDATE: `${URL}/:id`,
  DELETE: `${URL}/:id`,

  // ✅ Presigned URL for file uploads
  PRESIGNED_URL: `${URL}/presigned_url/:fileName`,

  // ✅ Cache Management
  CACHE: `${URL}/cache/:organisation_id`,
  CACHE_SIMPLE: `${URL}/cache_simple/:organisation_id`,
};

// ✅ Master Driver Interface
export interface MasterDriver extends Record<string, unknown> {
  // ✅ Primary Fields
  driver_id: string;
  driver_code?: string; // Max: 50
  driver_first_name: string; // Min: 3, Max: 100
  driver_last_name?: string; // Max: 100
  driver_mobile?: string; // Max: 20
  driver_email?: string; // Max: 100
  driver_license?: string; // Max: 20
  driver_pan?: string; // Max: 10
  driver_aadhaar?: string; // Max: 12

  password?: string; // Max: 20
  can_login: YesNo;

  // ✅ Image Fields
  driver_image_url?: string;
  driver_image_key?: string;
  driver_aadhaar_front_image_url?: string;
  driver_aadhaar_front_image_key?: string;
  driver_aadhaar_back_image_url?: string;
  driver_aadhaar_back_image_key?: string;
  driver_pan_image_url?: string;
  driver_pan_image_key?: string;
  driver_license_back_image_url?: string;
  driver_license_back_image_key?: string;
  driver_license_front_image_url?: string;
  driver_license_front_image_key?: string;

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations - Vehicle
  vehicle_id?: string;
  MasterVehicle?: MasterVehicle;
  assign_vehicle_date?: string;
  is_vehicle_assigned: YesNo;
  AssignRemoveDriverHistory?: AssignRemoveDriverHistory[];

  // ✅ Relations - Organisation
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // ✅ Relations - Dummy
  Dummy_MasterVehicle?: MasterVehicle[];

  // ✅ Relations - Child
  // TripGeofenceToGeofence?: TripGeofenceToGeofence[];
  // GPSGeofenceTransaction?: GPSGeofenceTransaction[];
  // GPSFuelVehicleDailySummary?: GPSFuelVehicleDailySummary[];
  // GPSFuelVehicleRefill?: GPSFuelVehicleRefill[];
  // GPSFuelVehicleRemoval?: GPSFuelVehicleRemoval[];
  // GPSLockRelayLog?: GPSLockRelayLog[];
  // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[];
  // GPSGeofenceTransactionSummary?: GPSGeofenceTransactionSummary[];

  // Inspection?: FleetInspection[];
  // IncidentManagement?: FleetIncidentManagement[];
  // IssueManagement?: FleetIssueManagement[];
  // FleetServiceSchedule?: FleetServiceSchedule[];
  // FleetServiceJobCard?: FleetServiceJobCard[];
  // FleetReminders?: FleetReminders[];
  // FleetFuelRefills?: FleetFuelRefills[];
  // FleetFuelRemovals?: FleetFuelRemovals[];
  // FleetTyreDamageRepair?: FleetTyreDamageRepair[];
  // FleetTyreRotation?: FleetTyreRotation[];
  // AlertDriverLink?: AlertDriverLink[];

  // ✅ Count (Child Relations)
  _count?: {
    AssignRemoveDriverHistory: number;
    TripGeofenceToGeofence: number;
    GPSGeofenceTransaction: number;
    GPSFuelVehicleDailySummary: number;
    GPSFuelVehicleRefill: number;
    GPSFuelVehicleRemoval: number;
    GPSLockRelayLog: number;
    GPSLockDigitalDoorLog: number;
    GPSGeofenceTransactionSummary: number;
    Inspection: number;
    IncidentManagement: number;
    IssueManagement: number;
    FleetServiceSchedule: number;
    FleetServiceJobCard: number;
    FleetReminders: number;
    FleetFuelRefills: number;
    FleetFuelRemovals: number;
    FleetTyreDamageRepair: number;
    FleetTyreRotation: number;
    AlertDriverLink: number;
  };
}

// ✅ Assign Remove Driver History Interface
export interface AssignRemoveDriverHistory extends Record<string, unknown> {
  // ✅ Primary Fields
  history_id: string;
  assign_date?: string; // Nullable DateTime
  remove_date?: string; // Nullable DateTime

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations - Vehicle
  vehicle_id: string;
  Vehicle?: MasterVehicle;

  // ✅ Relations - Driver
  driver_id: string;
  MasterDriver?: MasterDriver;
}

// ✅ MasterDriver Create/Update Schema
export const MasterDriverSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation

  driver_code: stringOptional('Driver Code', 0, 50),
  driver_first_name: stringMandatory('Driver First Name', 3, 100),
  driver_last_name: stringOptional('Driver Last Name', 0, 100),
  driver_mobile: stringOptional('Driver Mobile', 0, 20),
  driver_email: stringOptional('Driver Email', 0, 100),
  driver_license: stringOptional('Driver License', 0, 20),
  driver_pan: stringOptional('Driver PAN', 0, 10),
  driver_aadhaar: stringOptional('Driver Aadhaar', 0, 12),
  password: stringOptional('Password', 0, 6),

  can_login: enumMandatory('Can Login', YesNo, YesNo.No),

  driver_image_url: stringOptional('Driver Image URL', 0, 300),
  driver_image_key: stringOptional('Driver Image Key', 0, 300),
  driver_aadhaar_front_image_url: stringOptional(
    'Driver Aadhaar Front Image URL',
    0,
    300
  ),
  driver_aadhaar_front_image_key: stringOptional(
    'Driver Aadhaar Front Image Key',
    0,
    300
  ),
  driver_aadhaar_back_image_url: stringOptional(
    'Driver Aadhaar Back Image URL',
    0,
    300
  ),
  driver_aadhaar_back_image_key: stringOptional(
    'Driver Aadhaar Back Image Key',
    0,
    300
  ),
  driver_pan_image_url: stringOptional('Driver PAN Image URL', 0, 300),
  driver_pan_image_key: stringOptional('Driver PAN Image Key', 0, 300),
  driver_license_back_image_url: stringOptional(
    'Driver License Back Image URL',
    0,
    300
  ),
  driver_license_back_image_key: stringOptional(
    'Driver License Back Image Key',
    0,
    300
  ),
  driver_license_front_image_url: stringOptional(
    'Driver License Front Image URL',
    0,
    300
  ),
  driver_license_front_image_key: stringOptional(
    'Driver License Front Image Key',
    0,
    300
  ),

  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterDriverDTO = z.infer<typeof MasterDriverSchema>;

// ✅ MasterDriver Query Schema
export const DriverQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation IDs', 100, []), // Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('Vehicle IDs', 100, []), // Multi-selection -> Vehicle
  driver_ids: multi_select_optional('Driver IDs', 100, []), // Multi-selection -> MasterDriver
  can_login: enumArrayOptional('Can Login', YesNo),
  is_vehicle_assigned: enumArrayOptional('Iss Vehicle Sssigned', YesNo),
});
export type DriverQueryDTO = z.infer<typeof DriverQuerySchema>;

// ✅ Convert Driver Data to API Payload
export const toDriverPayload = (driver?: MasterDriver): MasterDriverDTO => ({
  driver_code: driver?.driver_code || '',
  driver_first_name: driver?.driver_first_name || '',
  driver_last_name: driver?.driver_last_name || '',
  driver_mobile: driver?.driver_mobile || '',
  driver_email: driver?.driver_email || '',
  driver_license: driver?.driver_license || '',
  driver_pan: driver?.driver_pan || '',
  driver_aadhaar: driver?.driver_aadhaar || '',

  password: driver?.password || '',
  can_login: driver?.can_login || YesNo.No,

  driver_image_url: driver?.driver_image_url || '',
  driver_image_key: driver?.driver_image_key || '',
  driver_aadhaar_front_image_url: driver?.driver_aadhaar_front_image_url || '',
  driver_aadhaar_front_image_key: driver?.driver_aadhaar_front_image_key || '',
  driver_aadhaar_back_image_url: driver?.driver_aadhaar_back_image_url || '',
  driver_aadhaar_back_image_key: driver?.driver_aadhaar_back_image_key || '',
  driver_pan_image_url: driver?.driver_pan_image_url || '',
  driver_pan_image_key: driver?.driver_pan_image_key || '',
  driver_license_back_image_url: driver?.driver_license_back_image_url || '',
  driver_license_back_image_key: driver?.driver_license_back_image_key || '',
  driver_license_front_image_url: driver?.driver_license_front_image_url || '',
  driver_license_front_image_key: driver?.driver_license_front_image_key || '',

  status: driver?.status || Status.Active,
  organisation_id: driver?.organisation_id || '',
});

// ✅ Create New Driver Payload
export const newDriverPayload = (): MasterDriverDTO => ({
  driver_code: '',
  driver_first_name: '',
  driver_last_name: '',
  driver_mobile: '',
  driver_email: '',
  driver_license: '',
  driver_pan: '',
  driver_aadhaar: '',

  password: '',
  can_login: YesNo.No,

  driver_image_url: '',
  driver_image_key: '',
  driver_aadhaar_front_image_url: '',
  driver_aadhaar_front_image_key: '',
  driver_aadhaar_back_image_url: '',
  driver_aadhaar_back_image_key: '',
  driver_pan_image_url: '',
  driver_pan_image_key: '',
  driver_license_back_image_url: '',
  driver_license_back_image_key: '',
  driver_license_front_image_url: '',
  driver_license_front_image_key: '',

  status: Status.Active,
  organisation_id: '',
});

// API Methods
export const findDrivers = async (
  payload: DriverQueryDTO
): Promise<FBR<MasterDriver[]>> => {
  return apiPost<FBR<MasterDriver[]>, DriverQueryDTO>(ENDPOINTS.FIND, payload);
};

export const createDriver = async (payload: MasterDriverDTO): Promise<SBR> => {
  return apiPost<SBR, MasterDriverDTO>(ENDPOINTS.CREATE, payload);
};

export const updateDriver = async (
  id: string,
  payload: MasterDriverDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterDriverDTO>(
    ENDPOINTS.UPDATE.replace(':id', id),
    payload
  );
};

export const deleteDriver = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.DELETE.replace(':id', id));
};

export const getPresignedUrlForDriver = async (
  fileName: string
): Promise<SBR> => {
  return apiGet<SBR>(ENDPOINTS.PRESIGNED_URL.replace(':fileName', fileName));
};

export const getDriverCache = async (
  organisationId: string
): Promise<FBR<MasterDriver[]>> => {
  return apiGet<FBR<MasterDriver[]>>(
    ENDPOINTS.CACHE.replace(':organisation_id', organisationId)
  );
};

export const getDriverSimpleCache = async (
  organisationId: string
): Promise<FBR<MasterDriver[]>> => {
  return apiGet<FBR<MasterDriver[]>>(
    ENDPOINTS.CACHE_SIMPLE.replace(':organisation_id', organisationId)
  );
};
