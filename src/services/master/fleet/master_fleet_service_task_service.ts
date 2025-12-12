// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { FleetServiceManagementTask } from 'src/services/fleet/service_management/fleet_service_management_service';

const URL = 'master/fleet/service_task';

const ENDPOINTS = {
  // MasterFleetServiceTask APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterFleetServiceTask Interface
export interface MasterFleetServiceTask extends Record<string, unknown> {
  // Primary Fields
  fleet_service_task_id: string;
  fleet_service_task: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  // Child - Main
  FleetServiceManagementTask?: FleetServiceManagementTask[]
  // FleetServiceJobCardTask?: FleetServiceJobCardTask[]

  // Relations - Child Count
  _count?: {
    FleetServiceManagementTask?: number;
    FleetServiceJobCardTask?: number;
  };
}

// MasterFleetServiceTask Create/Update Schema
export const MasterFleetServiceTaskSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  fleet_service_task: stringMandatory('Fleet Service Task', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetServiceTaskDTO = z.infer<
  typeof MasterFleetServiceTaskSchema
>;

// MasterFleetServiceTask Query Schema
export const MasterFleetServiceTaskQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  fleet_service_task_ids: multi_select_optional('MasterFleetServiceTask'), // Multi-selection -> MasterFleetServiceTask
});
export type MasterFleetServiceTaskQueryDTO = z.infer<
  typeof MasterFleetServiceTaskQuerySchema
>;

// Convert MasterFleetServiceTask Data to API Payload
export const toMasterFleetServiceTaskPayload = (row: MasterFleetServiceTask): MasterFleetServiceTaskDTO => ({
  organisation_id: row.organisation_id || '',
  fleet_service_task: row.fleet_service_task || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterFleetServiceTask Payload
export const newMasterFleetServiceTaskPayload = (): MasterFleetServiceTaskDTO => ({
  organisation_id: '',
  fleet_service_task: '',
  description: '',
  status: Status.Active,
});

// MasterFleetServiceTask APIs
export const findMasterFleetServiceTasks = async (data: MasterFleetServiceTaskQueryDTO): Promise<FBR<MasterFleetServiceTask[]>> => {
  return apiPost<FBR<MasterFleetServiceTask[]>, MasterFleetServiceTaskQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterFleetServiceTask = async (data: MasterFleetServiceTaskDTO): Promise<SBR> => {
  return apiPost<SBR, MasterFleetServiceTaskDTO>(ENDPOINTS.create, data);
};

export const updateMasterFleetServiceTask = async (id: string, data: MasterFleetServiceTaskDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetServiceTaskDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFleetServiceTask = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterFleetServiceTaskCache = async (organisation_id: string): Promise<FBR<MasterFleetServiceTask[]>> => {
  return apiGet<FBR<MasterFleetServiceTask[]>>(ENDPOINTS.cache(organisation_id));
};
