// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  multi_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { MasterDeviceModel } from '../../../services/master/device/master_device_model_service';
import { MasterDeviceType } from '../../../services/master/device/master_device_type_service';
import { MasterDevice } from '../../../services/main/devices/master_device_service';

const URL = 'master/device/manufacturer';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
  cache_count: `${URL}/cache_count`,
  cache_child: `${URL}/cache_child`,
};

// Master Device Manufacturer Interface
export interface MasterDeviceManufacturer extends Record<string, unknown> {
  // Primary Fields
  device_manufacturer_id: string;
  device_manufacturer_name: string; // Min: 3, Max: 100
  device_manufacturer_code?: string; // Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  MasterDeviceModel: MasterDeviceModel[];
  MasterDeviceType: MasterDeviceType[];
  MasterDevice: MasterDevice[];

  // Count
  _count?: {
    MasterDeviceModel: number;
    MasterDeviceType: number;
    MasterDevice: number;
  };
}

// ✅ Manufacturer Create/Update Schema
export const MasterDeviceManufacturerSchema = z.object({
  device_manufacturer_name: stringMandatory('Device Manufacturer Name', 3, 100),
  device_manufacturer_code: stringOptional('Device Manufacturer Code', 0, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterDeviceManufacturerDTO = z.infer<typeof MasterDeviceManufacturerSchema>;

// ✅ Manufacturer Query Schema
export const MasterDeviceManufacturerQuerySchema = BaseQuerySchema.extend({
  device_manufacturer_ids: multi_select_optional('Device Manufacturer'), // ✅ Multi-selection -> MasterDeviceManufacturer
});
export type MasterDeviceManufacturerQueryDTO = z.infer<typeof MasterDeviceManufacturerQuerySchema>;

// Convert existing data to a payload structure
export const toMasterDeviceManufacturerPayload = (
  manufacturer: MasterDeviceManufacturer
): MasterDeviceManufacturerDTO => ({
  device_manufacturer_name: manufacturer.device_manufacturer_name,
  device_manufacturer_code: manufacturer.device_manufacturer_code ?? '',
  status: manufacturer.status,
});

// Generate a new payload with default values
export const newMasterDeviceManufacturerPayload = (): MasterDeviceManufacturerDTO => ({
  device_manufacturer_name: '',
  device_manufacturer_code: '',
  status: Status.Active,
});

// API Methods
export const findMasterDeviceManufacturers = async (
  data: MasterDeviceManufacturerQueryDTO
): Promise<FBR<MasterDeviceManufacturer[]>> => {
  return apiPost<FBR<MasterDeviceManufacturer[]>, MasterDeviceManufacturerQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterDeviceManufacturer = async (
  data: MasterDeviceManufacturerDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterDeviceManufacturerDTO>(ENDPOINTS.create, data);
};

export const updateMasterDeviceManufacturer = async (
  id: string,
  data: MasterDeviceManufacturerDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterDeviceManufacturerDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterDeviceManufacturer = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterDeviceManufacturerCache = async (): Promise<FBR<MasterDeviceManufacturer[]>> => {
  return apiGet<FBR<MasterDeviceManufacturer[]>>(ENDPOINTS.cache);
};

export const getMasterDeviceManufacturerCacheCount = async (): Promise<FBR<number>> => {
  return apiGet<FBR<number>>(ENDPOINTS.cache_count);
};

export const getMasterDeviceManufacturerCacheChild = async (): Promise<FBR<MasterDeviceManufacturer[]>> => {
  return apiGet<FBR<MasterDeviceManufacturer[]>>(ENDPOINTS.cache_child);
};
