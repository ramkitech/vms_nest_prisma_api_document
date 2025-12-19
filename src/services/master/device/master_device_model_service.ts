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
  stringUUIDMandatory,
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
  // MasterDeviceModel APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (device_manufacturer_id?: string): string => `${URL}/cache?device_manufacturer_id=${device_manufacturer_id || ''}`,
  cache_count: (device_manufacturer_id?: string): string => `${URL}/cache_count?device_manufacturer_id=${device_manufacturer_id || ''}`,
  cache_child: (device_manufacturer_id?: string): string => `${URL}/cache_child?device_manufacturer_id=${device_manufacturer_id || ''}`,
};

// MasterDeviceModel Interface
export interface MasterDeviceModel extends Record<string, unknown> {
  // Primary Fields
  device_model_id: string;

  // Main Field Details
  device_model_name: string;
  device_model_code?: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  device_manufacturer_id: string;
  MasterDeviceManufacturer?: MasterDeviceManufacturer;

  // Relations - Child
  // Child - Master
  MasterDeviceType?: MasterDeviceType[];
  MasterDevice?: MasterDevice[];

  // Relations - Child Count
  _count?: {
    MasterDeviceType?: number;
    MasterDevice?: number;
  };
}

// MasterDeviceModel Create/Update Schema
export const MasterDeviceModelSchema = z.object({
  // Relations - Parent
  device_manufacturer_id: single_select_mandatory('MasterDeviceManufacturer'), // Single-Selection -> MasterDeviceManufacturer

  // Main Field Details
  device_model_name: stringMandatory('Device Model Name', 3, 100),
  device_model_code: stringOptional('Device Model Code', 0, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterDeviceModelDTO = z.infer<typeof MasterDeviceModelSchema>;

// MasterDeviceModel Query Schema
export const MasterDeviceModelQuerySchema = BaseQuerySchema.extend({
  // Self Table
  device_model_ids: multi_select_optional('MasterDeviceModel'), // Multi-Selection -> MasterDeviceModel

  // Relations - Parent
  device_manufacturer_ids: multi_select_optional('MasterDeviceManufacturer'), // Multi-Selection -> MasterDeviceManufacturer
});
export type MasterDeviceModelQueryDTO = z.infer<
  typeof MasterDeviceModelQuerySchema
>;

export const FindCacheSchema = z.object({
  device_manufacturer_id: stringUUIDMandatory('device_manufacturer_id'),
});
export type FindCacheDTO = z.infer<typeof FindCacheSchema>;

// Convert MasterDeviceModel Data to API Payload
export const toMasterDeviceModelPayload = (row: MasterDeviceModel): MasterDeviceModelDTO => ({
  device_manufacturer_id: row.device_manufacturer_id || '',

  device_model_name: row.device_model_name || '',
  device_model_code: row.device_model_code || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterDeviceModel Payload
export const newMasterDeviceModelPayload = (): MasterDeviceModelDTO => ({
  device_manufacturer_id: '',

  device_model_name: '',
  device_model_code: '',
  description: '',
  
  status: Status.Active,
});

// MasterDeviceModel APIs
export const findMasterDeviceModels = async (data: MasterDeviceModelQueryDTO): Promise<FBR<MasterDeviceModel[]>> => {
  return apiPost<FBR<MasterDeviceModel[]>, MasterDeviceModelQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterDeviceModel = async (data: MasterDeviceModelDTO): Promise<SBR> => {
  return apiPost<SBR, MasterDeviceModelDTO>(ENDPOINTS.create, data);
};

export const updateMasterDeviceModel = async (id: string, data: MasterDeviceModelDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterDeviceModelDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterDeviceModel = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterDeviceModelCache = async (device_manufacturer_id?: string): Promise<FBR<MasterDeviceModel[]>> => {
  return apiGet<FBR<MasterDeviceModel[]>>(ENDPOINTS.cache(device_manufacturer_id));
};

export const getMasterDeviceModelCacheCount = async (device_manufacturer_id?: string): Promise<FBR<MasterDeviceModel[]>> => {
  return apiGet<FBR<MasterDeviceModel[]>>(ENDPOINTS.cache_count(device_manufacturer_id));
};

export const getMasterDeviceModelCacheChild = async (device_manufacturer_id?: string): Promise<FBR<MasterDeviceModel[]>> => {
  return apiGet<FBR<MasterDeviceModel[]>>(ENDPOINTS.cache_child(device_manufacturer_id));
};

