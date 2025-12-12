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
import { MasterDeviceModel } from '../../../services/master/device/master_device_model_service';
import { MasterDevice } from '../../../services/main/devices/master_device_service';

const URL = 'master/device/type';

const ENDPOINTS = {
  // MasterDeviceType APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (device_model_id?: string): string => `${URL}/cache?device_model_id=${device_model_id || '0'}`,
  cache_count: (device_model_id?: string): string => `${URL}/cache_count?device_model_id=${device_model_id || '0'}`,
  cache_child: (device_model_id?: string): string => `${URL}/cache_child?device_model_id=${device_model_id || '0'}`,
};

// Master Device Type Interface
export interface MasterDeviceType extends Record<string, unknown> {
  // Primary Fields
  device_type_id: string;
  device_type_name: string; // Min: 3, Max: 100
  device_type_code?: string; // Max: 100
  description?: string; // Max: 300

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  device_manufacturer_id: string;
  MasterDeviceManufacturer?: MasterDeviceManufacturer;

  device_model_id: string;
  MasterDeviceModel?: MasterDeviceModel;

  // Relations - Child
  // Child - Master
  MasterDevice?: MasterDevice[];

  // Relations - Child Count
  _count?: {
    MasterDevice?: number;
  };
}

// MasterDeviceType Create/Update Schema
export const MasterDeviceTypeSchema = z.object({
  device_manufacturer_id: single_select_mandatory('MasterDeviceManufacturer'), // Single-Selection -> MasterDeviceManufacturer
  device_model_id: single_select_mandatory('MasterDeviceModel'), // Single-Selection -> MasterDeviceModel
  device_type_name: stringMandatory('Device Type Name', 3, 100),
  device_type_code: stringOptional('Device Type Code', 0, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterDeviceTypeDTO = z.infer<typeof MasterDeviceTypeSchema>;

// MasterDeviceType Query Schema
export const MasterDeviceTypeQuerySchema = BaseQuerySchema.extend({
  device_manufacturer_ids: multi_select_optional('MasterDeviceManufacturer'), // Multi-Selection -> MasterDeviceManufacturer
  device_model_ids: multi_select_optional('MasterDeviceModel'), // Multi-Selection -> MasterDeviceModel
  device_type_ids: multi_select_optional('MasterDeviceType'), // Multi-Selection -> MasterDeviceType
});
export type MasterDeviceTypeQueryDTO = z.infer<
  typeof MasterDeviceTypeQuerySchema
>;

// Convert MasterDeviceType Data to API Payload
export const toMasterDeviceTypePayload = (row: MasterDeviceType): MasterDeviceTypeDTO => ({
  device_manufacturer_id: row.device_manufacturer_id || '',
  device_model_id: row.device_model_id || '',
  device_type_name: row.device_type_name || '',
  device_type_code: row.device_type_code || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterDeviceType Payload
export const newMasterDeviceTypePayload = (): MasterDeviceTypeDTO => ({
  device_manufacturer_id: '',
  device_model_id: '',
  device_type_name: '',
  device_type_code: '',
  description: '',
  status: Status.Active,
});

// MasterDeviceType APIs
export const findMasterDeviceTypes = async (data: MasterDeviceTypeQueryDTO): Promise<FBR<MasterDeviceType[]>> => {
  return apiPost<FBR<MasterDeviceType[]>, MasterDeviceTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterDeviceType = async (data: MasterDeviceTypeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterDeviceTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterDeviceType = async (id: string, data: MasterDeviceTypeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterDeviceTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterDeviceType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterDeviceTypeCache = async (device_model_id?: string): Promise<FBR<MasterDeviceType[]>> => {
  return apiGet<FBR<MasterDeviceType[]>>(ENDPOINTS.cache(device_model_id));
};

export const getMasterDeviceTypeCacheCount = async (device_model_id?: string): Promise<FBR<MasterDeviceType>> => {
  return apiGet<FBR<MasterDeviceType>>(ENDPOINTS.cache_count(device_model_id));
};

export const getMasterDeviceTypeCacheChild = async (device_model_id?: string): Promise<FBR<MasterDeviceType[]>> => {
  return apiGet<FBR<MasterDeviceType[]>>(ENDPOINTS.cache_child(device_model_id));
};

