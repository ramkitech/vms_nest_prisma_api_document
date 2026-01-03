// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BaseCommonFile } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  single_select_mandatory,
  enumArrayOptional,
  stringOptional,
  stringMandatory,
  enumMandatory,
  multi_select_optional,
  getAllEnums,
} from '../../../zod_utils/zod_utils';
import { BaseQueryDTO, BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import {
  Status,
  YesNo,
  GPSSource,
  DeviceStatus,
} from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterVehicle } from '../../../services/main/vehicle/master_vehicle_service';
import { MasterDeviceManufacturer } from '../../../services/master/device/master_device_manufacturer_service';
import { MasterDeviceModel } from '../../../services/master/device/master_device_model_service';
import { MasterDeviceType } from '../../../services/master/device/master_device_type_service';

import {
  MasterSim,
  AssignRemoveSimHistory,
} from '../../../services/main/sims/master_sim_service';
import { MasterMainCountry } from '../../../services/master/main/master_main_country_service';
import { MasterMainTimeZone } from '../../../services/master/main/master_main_timezone_service';
import { FleetFuelDailySummary } from 'src/services/fleet/fuel_management/fleet_fuel_daily_summary_service';
import { FleetFuelRefill } from 'src/services/fleet/fuel_management/fleet_fuel_refill_service';
import { FleetFuelRemoval } from 'src/services/fleet/fuel_management/fleet_fuel_removal_service';

const URL = 'main/master_device';

const ENDPOINTS = {
  // MasterDevice APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // VehicleDeviceLinkManagement APIs
  DEVICE_SIM_LINK: `${URL}/device_sim_link`,
  DEVICE_SIM_UNLINK: `${URL}/device_sim_unlink`,
  DEVICE_SIM_LINK_HISTORY_BY_SIM: (id: string): string => `${URL}/device_sim_link_history_by_sim/${id}`,
  DEVICE_SIM_LINK_HISTORY_BY_DEVICE: (id: string): string => `${URL}/device_sim_link_history_by_device/${id}`,
};

// MasterDevice Interface
export interface MasterDevice extends Record<string, unknown> {
  // Primary Fields
  device_id: string;
  serial_no: number;

  // Main Field Details
  device_identifier: string;
  device_note_1: string;
  device_note_2: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Sim
  is_sim_linked: YesNo;
  sim_id?: string;
  MasterSim?: MasterSim;
  device_sim_link_date?: string;
  device_sim_link_date_f?: string;
  AssignRemoveSimHistory: AssignRemoveSimHistory[];

  // Relations - Vehicle
  is_device_used: DeviceStatus;
  vehicle_id?: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
  assign_device_date?: string;
  assign_device_date_f?: string;
  AssignRemoveDeviceHistory: AssignRemoveDeviceHistory[];

  device_gps_source: GPSSource;

  // Database Details
  db_instance: string;
  db_group: string;

  // Relations - Parent
  device_manufacturer_id?: string;
  MasterDeviceManufacturer?: MasterDeviceManufacturer;

  device_model_id?: string;
  MasterDeviceModel?: MasterDeviceModel;

  device_type_id?: string;
  MasterDeviceType?: MasterDeviceType;

  organisation_id?: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;

  country_id?: string;
  MasterMainCountry?: MasterMainCountry;
  country_name?: string;

  time_zone_id?: string;
  MasterMainTimeZone?: MasterMainTimeZone;
  time_zone_code?: string;
  time_zone_identifier?: string;

  // Relations - Child
  // Child - Main
  MasterDeviceFile?: MasterDeviceFile[]
  // Child - Fleet
  FleetFuelRefill?: FleetFuelRefill[]
  FleetFuelRemoval?: FleetFuelRemoval[]
  FleetFuelDailySummary?: FleetFuelDailySummary[]
  // Child - GPS
  // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[]
  // GPSLockRelayLog?: GPSLockRelayLog[]

  // Relations - Child Count
  _count?: {
    AssignRemoveSimHistory?: number;
    AssignRemoveDeviceHistory?: number;
    MasterDeviceFile?: number;
    FleetFuelRefill?: number;
    FleetFuelRemoval?: number;
    FleetFuelDailySummary?: number;
    GPSLockDigitalDoorLog?: number;
    GPSLockRelayLog?: number;
  };
}

// AssignRemoveDeviceHistory Interface
export interface AssignRemoveDeviceHistory extends Record<string, unknown> {
  // Primary Fields
  history_id: string;

  // Main Field Details
  assign_date?: string;
  assign_date_f?: string;
  remove_date?: string;
  remove_date_f?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  device_id: string;
  MasterDevice?: MasterDevice;
  device_identifier?: string;
}

// MasterDeviceFile Interface
export interface MasterDeviceFile extends BaseCommonFile {
  // Primary Field
  device_file_id: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;

  // Parent
  device_id: string;
  MasterDevice?: MasterDevice;
  device_identifier?: string;

  // Usage Type -> Device Image, Vehicle Image, Sim Image
}

// MasterDevice Create/Update Schema
export const MasterDeviceSchema = z.object({
  // Relations - Parent
  device_manufacturer_id: single_select_mandatory('Device Manufacturer'), // Single-Selection -> MasterDeviceManufacturer
  device_model_id: single_select_mandatory('MasterDeviceModel'), // Single-Selection -> MasterDeviceModel

  // Main Field Details
  device_gps_source: enumMandatory('Status', GPSSource, GPSSource.Traccar),
  device_identifier: stringMandatory('Device Identifier', 2, 100),
  device_note_1: stringOptional('Device Note 1', 0, 100),
  device_note_2: stringOptional('Device Identifier', 0, 100),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterDeviceDTO = z.infer<typeof MasterDeviceSchema>;

// MasterDevice Query Schema
export const MasterDeviceQuerySchema = BaseQuerySchema.extend({
  // Self Table
  device_ids: multi_select_optional('MasterDevice'), // Multi-Selection -> MasterDevice

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
  country_ids: multi_select_optional('MasterMainCountry'), // Multi-Selection -> MasterMainCountry
  time_zone_ids: multi_select_optional('MasterMainTimeZone'), // Multi-Selection -> MasterMainTimeZone
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle
  device_manufacturer_ids: multi_select_optional('MasterDeviceManufacturer'), // Multi-Selection -> MasterDeviceManufacturer
  device_model_ids: multi_select_optional('MasterDeviceModel'), // Multi-Selection -> MasterDeviceModel
  device_type_ids: multi_select_optional('MasterDeviceType'), // Multi-Selection -> MasterDeviceType

  // Enums
  is_device_used: enumArrayOptional(
    'Is Device Used',
    DeviceStatus,
    getAllEnums(DeviceStatus),
  ),
  is_sim_linked: enumArrayOptional('Is Sim Linked', YesNo, getAllEnums(YesNo)),
  device_gps_source: enumArrayOptional(
    'Device GPS Source',
    GPSSource,
    getAllEnums(GPSSource),
  ),
});
export type MasterDeviceQueryDTO = z.infer<typeof MasterDeviceQuerySchema>;

// MasterDevice Sim Link Schema
export const DeviceSimLinkSchema = z.object({
  // Relations - Parent
  device_id: single_select_mandatory('MasterDevice'), // Single-Selection -> MasterDevice
  sim_id: single_select_mandatory('MasterSim'), // Single-Selection -> MasterSim
});
export type DeviceSimLinkDTO = z.infer<typeof DeviceSimLinkSchema>;

// Convert MasterDevice Data to API Payload
export const toMasterDevicePayload = (row: MasterDevice): MasterDeviceDTO => ({
  device_manufacturer_id: row.device_manufacturer_id || '',
  device_model_id: row.device_model_id || '',

  device_identifier: row.device_identifier || '',
  device_note_1: row.device_note_1 || '',
  device_note_2: row.device_note_2 || '',
  device_gps_source: row.device_gps_source || GPSSource.NoDevice,

  status: row.status || Status.Active,
});

// Create New MasterDevice Payload
export const newMasterDevicePayload = (): MasterDeviceDTO => ({
  device_manufacturer_id: '',
  device_model_id: '',

  device_identifier: '',
  device_note_1: '',
  device_note_2: '',
  device_gps_source: GPSSource.NoDevice,

  status: Status.Active,
});

// MasterDevice APIs
export const findMasterDevices = async (data: MasterDeviceQueryDTO): Promise<FBR<MasterDevice[]>> => {
  return apiPost<FBR<MasterDevice[]>, MasterDeviceQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterDevice = async (data: MasterDeviceDTO): Promise<SBR> => {
  return apiPost<SBR, MasterDeviceDTO>(ENDPOINTS.create, data);
};

export const updateMasterDevice = async (id: string, data: MasterDeviceDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterDeviceDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterDevice = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// DeviceSimLinkManagement APIs

// Link Sim to Device
export const device_sim_link = async (payload: DeviceSimLinkDTO): Promise<SBR> => {
  return apiPost<SBR, DeviceSimLinkDTO>(ENDPOINTS.DEVICE_SIM_LINK, payload);
};

// Unlink Sim from Device
export const device_sim_unlink = async (payload: DeviceSimLinkDTO): Promise<SBR> => {
  return apiPost<SBR, DeviceSimLinkDTO>(ENDPOINTS.DEVICE_SIM_UNLINK, payload);
};

// Get Device Sim Link History by Device
export const get_device_sim_link_history_by_sim = async (id: string, params: BaseQueryDTO): Promise<FBR<AssignRemoveSimHistory[]>> => {
  return apiGet<FBR<AssignRemoveSimHistory[]>>(ENDPOINTS.DEVICE_SIM_LINK_HISTORY_BY_SIM(id), params);
};

// Get Device Sim Link History by Sim
export const get_device_sim_link_history_by_device = async (id: string, params: BaseQueryDTO): Promise<FBR<AssignRemoveSimHistory[]>> => {
  return apiGet<FBR<AssignRemoveSimHistory[]>>(ENDPOINTS.DEVICE_SIM_LINK_HISTORY_BY_DEVICE(id), params);
};
