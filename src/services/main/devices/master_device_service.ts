// Imports
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

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

// URL & Endpoints
const URL = 'main/master_device';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // ✅ Vehicle Device Link Management
  DEVICE_SIM_LINK: `${URL}/device_sim_link`,
  DEVICE_SIM_UNLINK: `${URL}/device_sim_unlink`,
  DEVICE_SIM_LINK_HISTORY_BY_SIM: `${URL}/device_sim_link_history_by_sim/:id`,
  DEVICE_SIM_LINK_HISTORY_BY_DEVICE: `${URL}/device_sim_link_history_by_device/:id`,
};

// Master Device Interface
export interface MasterDevice extends Record<string, unknown> {
  // Primary Fields
  device_id: string;
  serial_no: number;
  device_identifier: string; // Max: 100
  device_note_1: string; // Max: 100
  device_note_2: string; // Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Sim
  is_sim_linked: YesNo;
  sim_id?: string;
  MasterSim?: MasterSim;
  device_sim_link_date?: string;
  AssignRemoveSimHistory: AssignRemoveSimHistory[];

  // Relations - Vehicle
  is_device_used: DeviceStatus;
  vehicle_id?: string;
  MasterVehicle?: MasterVehicle;
  assign_device_date?: string;
  AssignRemoveDeviceHistory: AssignRemoveDeviceHistory[];

  device_gps_source: GPSSource;

  // Database Details
  db_instance: string; // Max: 200
  db_group: string; // Max: 200

  // Images
  device_image_url?: string;
  device_image_key?: string;
  vehicle_image_url?: string;
  vehicle_image_key?: string;
  sim_image_url?: string;
  sim_image_key?: string;

  // Relations
  device_manufacturer_id?: string;
  MasterDeviceManufacturer?: MasterDeviceManufacturer;

  device_model_id?: string;
  MasterDeviceModel?: MasterDeviceModel;

  device_type_id?: string;
  MasterDeviceType?: MasterDeviceType;

  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  country_id?: string;
  MasterMainCountry?: MasterMainCountry;

  time_zone_id?: string;
  MasterMainTimeZone?: MasterMainTimeZone;

  // Relations - Dummy
  Dummy_MasterVehicle: MasterVehicle[];
  Dummy_MasterSim: MasterSim[];

  // Relations - Child
  // GPSFuelVehicleRemoval: GPSFuelVehicleRemoval[];
  // GPSFuelVehicleDailySummary: GPSFuelVehicleDailySummary[];
  // GPSLockDigitalDoorLog: GPSLockDigitalDoorLog[];
  // GPSLockRelayLog: GPSLockRelayLog[];
  // GPSFuelVehicleRefill: GPSFuelVehicleRefill[];

  // Count
  _count?: {
    AssignRemoveSimHistory?: number;
    AssignRemoveDeviceHistory?: number;
    GPSFuelVehicleRemoval?: number;
    GPSFuelVehicleDailySummary?: number;
    GPSLockDigitalDoorLog?: number;
    GPSLockRelayLog?: number;
    GPSFuelVehicleRefill?: number;
    Dummy_MasterVehicle?: number;
    Dummy_MasterSim?: number;
  };
}

// Assign Remove Device History Interface
export interface AssignRemoveDeviceHistory extends Record<string, unknown> {
  // Primary Fields
  history_id: string;
  assign_date?: string;
  remove_date?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  vehicle_id: string;
  Vehicle?: MasterVehicle;

  device_id: string;
  MasterDevice?: MasterDevice;
}

// ✅ Device Create/Update Schema
export const MasterDeviceSchema = z.object({
  device_manufacturer_id: single_select_mandatory('Device Manufacturer'), // ✅ Single-selection -> MasterDeviceManufacturer
  device_model_id: single_select_mandatory('Device Model'), // ✅ Single-selection -> MasterDeviceModel
  device_gps_source: enumMandatory('Status', GPSSource, GPSSource.Traccar),
  device_identifier: stringMandatory('Device Identifier', 2, 100),
  device_note_1: stringOptional('Device Note 1', 0, 100),
  device_note_2: stringOptional('Device Identifier', 0, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterDeviceDTO = z.infer<typeof MasterDeviceSchema>;

// ✅ Device Query Schema
export const MasterDeviceQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation'), // ✅ Multi-selection -> UserOrganisation
  country_ids: multi_select_optional('Master Country'), // ✅ Multi-selection -> MasterMainCountry
  time_zone_ids: multi_select_optional('Master Time Zone'), // ✅ Multi-selection -> MasterMainTimeZone
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-selection -> MasterVehicle
  device_manufacturer_ids: multi_select_optional('Device Manufacturer'), // ✅ Multi-selection -> MasterDeviceManufacturer
  device_model_ids: multi_select_optional('Device Model'), // ✅ Multi-selection -> MasterDeviceModel
  device_type_ids: multi_select_optional('Device Type'), // ✅ Multi-selection -> MasterDeviceType
  device_ids: multi_select_optional('Device'), // ✅ Multi-selection -> MasterDevice
  is_device_used: enumArrayOptional(
    'Is Device Used',
    DeviceStatus,
    getAllEnums(DeviceStatus)
  ),
  is_sim_linked: enumArrayOptional('Is Sim Linked', YesNo, getAllEnums(YesNo)),
  device_gps_source: enumArrayOptional(
    'Device GPS Source',
    GPSSource,
    getAllEnums(GPSSource)
  ),
});
export type MasterDeviceQueryDTO = z.infer<typeof MasterDeviceQuerySchema>;

// ✅ Device Sim Link Schema
export const DeviceSimLinkSchema = z.object({
  device_id: single_select_mandatory('Device ID'), // Single selection -> MasterDevice
  sim_id: single_select_mandatory('Sim ID'), // Single selection -> MasterSim
});
export type DeviceSimLinkDTO = z.infer<typeof DeviceSimLinkSchema>;

// Convert existing data to a payload structure
export const toMasterDevicePayload = (
  device: MasterDevice
): MasterDeviceDTO => ({
  device_manufacturer_id: device.device_manufacturer_id ?? '',
  device_model_id: device.device_model_id ?? '',
  device_identifier: device.device_identifier,
  device_note_1: device.device_note_1 ?? '',
  device_note_2: device.device_note_2 ?? '',
  device_gps_source: device.device_gps_source,
  status: device.status,
});

// Generate a new payload with default values
export const newMasterDevicePayload = (): MasterDeviceDTO => ({
  device_manufacturer_id: '',
  device_model_id: '',
  device_identifier: '',
  device_note_1: '',
  device_note_2: '',
  device_gps_source: GPSSource.Traccar,
  status: Status.Active,
});

// API Methods
export const findMasterDevices = async (
  data: MasterDeviceQueryDTO
): Promise<FBR<MasterDevice[]>> => {
  return apiPost<FBR<MasterDevice[]>, MasterDeviceQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterDevice = async (
  data: MasterDeviceDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterDeviceDTO>(ENDPOINTS.create, data);
};

export const updateMasterDevice = async (
  id: string,
  data: MasterDeviceDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterDeviceDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterDevice = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// ✅ Device Sim Link Management

// 🔗 Link Sim to Device
export const device_sim_link = async (
  payload: DeviceSimLinkDTO
): Promise<SBR> => {
  return apiPost<SBR, DeviceSimLinkDTO>(ENDPOINTS.DEVICE_SIM_LINK, payload);
};

// 🔗 Unlink Sim from Device
export const device_sim_unlink = async (
  payload: DeviceSimLinkDTO
): Promise<SBR> => {
  return apiPost<SBR, DeviceSimLinkDTO>(ENDPOINTS.DEVICE_SIM_UNLINK, payload);
};

// 📜 Get Device Sim Link History by Device
export const get_device_sim_link_history_by_sim = async (
  id: string,
  params: BaseQueryDTO
): Promise<FBR<AssignRemoveSimHistory[]>> => {
  return apiGet<FBR<AssignRemoveSimHistory[]>>(
    ENDPOINTS.DEVICE_SIM_LINK_HISTORY_BY_SIM.replace(':id', id), params
  );
};

// 📜 Get Device Sim Link History by Sim
export const get_device_sim_link_history_by_device = async (
  id: string,
  params: BaseQueryDTO
): Promise<FBR<AssignRemoveSimHistory[]>> => {
  return apiGet<FBR<AssignRemoveSimHistory[]>>(
    ENDPOINTS.DEVICE_SIM_LINK_HISTORY_BY_DEVICE.replace(':id', id), params
  );
};
