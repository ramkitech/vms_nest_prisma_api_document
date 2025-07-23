// Axios
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
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// Other Models
import { MasterDeviceManufacturer } from 'services/master/device/master_device_manufacturer_service';
import { MasterDeviceModel } from 'services/master/device/master_device_model_service';
import { MasterDevice } from 'services/main/devices/master_device_service';

const URL = 'master/device/type';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (device_model_id?: string): string =>
    `${URL}/cache?device_model_id=${device_model_id || '0'}`,
  cache_count: (device_model_id?: string): string =>
    `${URL}/cache_count?device_model_id=${device_model_id || '0'}`,
  cache_child: (device_model_id?: string): string =>
    `${URL}/cache_child?device_model_id=${device_model_id || '0'}`,
};

// Master Device Type Interface
export interface MasterDeviceType extends Record<string, unknown> {
  // Primary Fields
  device_type_id: string;
  device_type_name: string; // Min: 3, Max: 100
  device_type_code?: string; // Max: 100
  device_type_description?: string; // Max: 200

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  device_manufacturer_id: string;
  MasterDeviceManufacturer?: MasterDeviceManufacturer;
  device_model_id: string;
  MasterDeviceModel?: MasterDeviceModel;

  // Relations - Child
  MasterDevice: MasterDevice[];

  // Count
  _count?: {
    MasterDevice: number;
  };
}

// ✅ Device Type Create/Update Schema
export const MasterDeviceTypeSchema = z.object({
  device_manufacturer_id: single_select_mandatory('Device Manufacturer'), // ✅ Single-selection -> MasterDeviceManufacturer
  device_model_id: single_select_mandatory('Device Model'), // ✅ Single-selection -> MasterDeviceModel
  device_type_name: stringMandatory('Device Type Name', 3, 100),
  device_type_code: stringOptional('Device Type Code', 0, 100),
  device_type_description: stringOptional('Device Type Description', 0, 200),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterDeviceTypeDTO = z.infer<typeof MasterDeviceTypeSchema>;

// ✅ Device Type Query Schema
export const MasterDeviceTypeQuerySchema = BaseQuerySchema.extend({
  device_manufacturer_ids: multi_select_optional('Device Manufacturer'), // ✅ Multi-selection -> MasterDeviceManufacturer
  device_model_ids: multi_select_optional('Device Model'), // ✅ Multi-selection -> MasterDeviceModel
  device_type_ids: multi_select_optional('Device Type'), // ✅ Multi-selection -> MasterDeviceType
});
export type MasterDeviceTypeQueryDTO = z.infer<typeof MasterDeviceTypeQuerySchema>;

// Convert existing data to a payload structure
export const toMasterDeviceTypePayload = (deviceType: MasterDeviceType): MasterDeviceTypeDTO => ({
  device_manufacturer_id: deviceType.device_manufacturer_id,
  device_model_id: deviceType.device_model_id,
  device_type_name: deviceType.device_type_name,
  device_type_code: deviceType.device_type_code ?? '',
  device_type_description: deviceType.device_type_description ?? '',
  status: deviceType.status,
});

// Generate a new payload with default values
export const newMasterDeviceTypePayload = (): MasterDeviceTypeDTO => ({
  device_manufacturer_id: '',
  device_model_id: '',
  device_type_name: '',
  device_type_code: '',
  device_type_description: '',
  status: Status.Active,
});

// API Methods
export const findMasterDeviceTypes = async (
  data: MasterDeviceTypeQueryDTO
): Promise<FBR<MasterDeviceType[]>> => {
  return apiPost<FBR<MasterDeviceType[]>, MasterDeviceTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterDeviceType = async (
  data: MasterDeviceTypeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterDeviceTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterDeviceType = async (
  id: string,
  data: MasterDeviceTypeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterDeviceTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterDeviceType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterDeviceTypeCache = async (
  device_model_id?: string
): Promise<FBR<MasterDeviceType[]>> => {
  return apiGet<FBR<MasterDeviceType[]>>(ENDPOINTS.cache(device_model_id));
};

export const getMasterDeviceTypeCacheCount = async (
  device_model_id?: string
): Promise<FBR<number>> => {
  return apiGet<FBR<number>>(ENDPOINTS.cache_count(device_model_id));
};

export const getMasterDeviceTypeCacheChild = async (
  device_model_id?: string
): Promise<FBR<MasterDeviceType[]>> => {
  return apiGet<FBR<MasterDeviceType[]>>(ENDPOINTS.cache_child(device_model_id));
};
