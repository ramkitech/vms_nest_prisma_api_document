// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { MasterDeviceManufacturer } from '../../../services/master/device/master_device_manufacturer_service';
import { MasterDeviceType } from '../../../services/master/device/master_device_type_service';
import { MasterDevice } from '../../../services/main/devices/master_device_service';

const URL = 'master/device/model';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (device_manufacturer_id?: string): string =>
    `${URL}/cache?device_manufacturer_id=${device_manufacturer_id || ''}`,
  cache_count: (device_manufacturer_id?: string): string =>
    `${URL}/cache_count?device_manufacturer_id=${device_manufacturer_id || ''}`,
  cache_child: (device_manufacturer_id?: string): string =>
    `${URL}/cache_child?device_manufacturer_id=${device_manufacturer_id || ''}`,
};

// Master Device Model Interface
export interface MasterDeviceModel extends Record<string, unknown> {
  // Primary Fields
  device_model_id: string;
  device_model_name: string; // Min: 3, Max: 100
  device_model_code?: string; // Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;



  // Relations
  device_manufacturer_id: string;
  MasterDeviceManufacturer?: MasterDeviceManufacturer;

  // Relations - Child
  MasterDeviceType: MasterDeviceType[];
  MasterDevice: MasterDevice[];

  // Count
  _count?: {
    MasterDeviceType: number;
    MasterDevice: number;
  };
}

// ✅ Device Model Create/Update Schema
export const MasterDeviceModelSchema = z.object({
  device_manufacturer_id: single_select_mandatory('Device Manufacturer'), // ✅ Single-selection -> MasterDeviceManufacturer
  device_model_name: stringMandatory('Device Model Name', 3, 100),
  device_model_code: stringOptional('Device Model Code', 0, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterDeviceModelDTO = z.infer<typeof MasterDeviceModelSchema>;

// ✅ Device Model Query Schema
export const MasterDeviceModelQuerySchema = BaseQuerySchema.extend({
  device_manufacturer_ids: multi_select_optional('Device Manufacturer'), // ✅ Multi-selection -> MasterDeviceManufacturer
  device_model_ids: multi_select_optional('Device Model'), // ✅ Multi-selection -> MasterDeviceModel
});
export type MasterDeviceModelQueryDTO = z.infer<typeof MasterDeviceModelQuerySchema>;

// Convert existing data to a payload structure
export const toMasterDeviceModelPayload = (deviceModel: MasterDeviceModel): MasterDeviceModelDTO => ({
  device_manufacturer_id: deviceModel.device_manufacturer_id,
  device_model_name: deviceModel.device_model_name,
  device_model_code: deviceModel.device_model_code ?? '',
  status: deviceModel.status,
});

// Generate a new payload with default values
export const newMasterDeviceModelPayload = (): MasterDeviceModelDTO => ({
  device_manufacturer_id: '',
  device_model_name: '',
  device_model_code: '',
  status: Status.Active,
});

// API Methods
export const findMasterDeviceModels = async (
  data: MasterDeviceModelQueryDTO
): Promise<FBR<MasterDeviceModel[]>> => {
  return apiPost<FBR<MasterDeviceModel[]>, MasterDeviceModelQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterDeviceModel = async (
  data: MasterDeviceModelDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterDeviceModelDTO>(ENDPOINTS.create, data);
};

export const updateMasterDeviceModel = async (
  id: string,
  data: MasterDeviceModelDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterDeviceModelDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterDeviceModel = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterDeviceModelCache = async (
  device_manufacturer_id?: string
): Promise<FBR<MasterDeviceModel[]>> => {
  return apiGet<FBR<MasterDeviceModel[]>>(ENDPOINTS.cache(device_manufacturer_id));
};

export const getMasterDeviceModelCacheCount = async (
  device_manufacturer_id?: string
): Promise<FBR<number>> => {
  return apiGet<FBR<number>>(ENDPOINTS.cache_count(device_manufacturer_id));
};

export const getMasterDeviceModelCacheChild = async (
  device_manufacturer_id?: string
): Promise<FBR<MasterDeviceModel[]>> => {
  return apiGet<FBR<MasterDeviceModel[]>>(ENDPOINTS.cache_child(device_manufacturer_id));
};
