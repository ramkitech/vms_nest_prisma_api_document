// Axios
import { apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  enumMandatory,
  enumArrayOptional,
  multi_select_optional,
  getAllEnums,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status, SimStatus, BillingStatus } from 'core/Enums';

// Other Models
import { MasterDevice } from 'services/main/devices/master_device_service';
import { MasterMainSimProvider } from 'services/master/main/master_main_sim_provider_service';

const URL = 'main/master_sim';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Master Sim Interface
export interface MasterSim extends Record<string, unknown> {
  // Primary Fields
  sim_id: string;
  sim_number: string; // Max: 50
  sim_imei: string; // Max: 50
  sim_serial_number: string; // Max: 50
  sim_status: SimStatus;
  billing_status: BillingStatus;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Device
  device_id?: string;
  MasterDevice?: MasterDevice;
  device_sim_link_date?: string;
  AssignRemoveSimHistory: AssignRemoveSimHistory[];

  // Relations - Dummy
  Dummy_MasterDevice: MasterDevice[];

  // Relations - Sim Provider
  sim_provider_id: string;
  MasterMainSimProvider: MasterMainSimProvider;

  // Count
  _count?: {
    AssignRemoveSimHistory: number;
    Dummy_MasterDevice: number;
  };
}

// Assign Remove Sim History Interface
export interface AssignRemoveSimHistory extends Record<string, unknown> {
  // Primary Fields
  history_id: string;
  device_sim_link_date?: string;
  device_sim_unlink_date?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  sim_id: string;
  MasterSim: MasterSim;

  device_id: string;
  MasterDevice: MasterDevice;
}

// ✅ Master Sim Create/Update Schema
export const MasterSimSchema = z.object({
  sim_provider_id: single_select_mandatory('Sim Provider ID'), // ✅ Single-selection -> MasterMainSimProvider
  sim_number: stringMandatory('Sim Number', 3, 50),
  sim_imei: stringMandatory('Sim IMEI', 3, 50),
  sim_serial_number: stringMandatory('Sim Serial Number', 3, 50),
  sim_status: enumMandatory('Sim Status', SimStatus, SimStatus.New),
  billing_status: enumMandatory(
    'Billing Status',
    BillingStatus,
    BillingStatus.New
  ),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterSimDTO = z.infer<typeof MasterSimSchema>;

// ✅ Master Sim Query Schema
export const MasterSimQuerySchema = BaseQuerySchema.extend({
  sim_provider_ids: multi_select_optional('Sim Provider IDs'), // ✅ Multi-selection -> MasterMainSimProvider
  sim_ids: multi_select_optional('Sim IDs'), // ✅ Multi-selection -> MasterSim
  sim_status: enumArrayOptional(
    'Sim Status',
    SimStatus,
    getAllEnums(SimStatus)
  ),
  billing_status: enumArrayOptional(
    'Billing Status',
    BillingStatus,
    getAllEnums(BillingStatus)
  ),
});
export type MasterSimQueryDTO = z.infer<typeof MasterSimQuerySchema>;

// Convert existing data to a payload structure
export const toMasterSimPayload = (sim: MasterSim): MasterSimDTO => ({
  sim_provider_id: sim.sim_provider_id,
  sim_number: sim.sim_number,
  sim_imei: sim.sim_imei,
  sim_serial_number: sim.sim_serial_number,
  sim_status: sim.sim_status,
  billing_status: sim.billing_status,
  status: sim.status,
});

// Generate a new payload with default values
export const newMasterSimPayload = (): MasterSimDTO => ({
  sim_provider_id: '', // required select
  sim_number: '',
  sim_imei: '',
  sim_serial_number: '',
  sim_status: SimStatus.New,
  billing_status: BillingStatus.New,
  status: Status.Active,
});

// API Methods
export const findMasterSims = async (
  data: MasterSimQueryDTO
): Promise<FBR<MasterSim[]>> => {
  return apiPost<FBR<MasterSim[]>, MasterSimQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterSim = async (data: MasterSimDTO): Promise<SBR> => {
  return apiPost<SBR, MasterSimDTO>(ENDPOINTS.create, data);
};

export const updateMasterSim = async (
  id: string,
  data: MasterSimDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterSimDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterSim = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
