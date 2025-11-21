// Imports
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringOptional,
    enumMandatory,
    single_select_mandatory,
    multi_select_optional,
    doubleOptionalLatLng,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models

import { FleetServiceManagement } from './fleet_service_management_service';
import { MasterFleetServiceTask } from 'src/services/master/fleet/master_fleet_service_task_service';

const URL = 'fleet/service/service_management_task';

const ENDPOINTS = {
    find: `${URL}/search`,
    create: `${URL}`,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,
};

// ✅ FleetServiceManagementTask Interface
export interface FleetServiceManagementTask extends Record<string, unknown> {
    fleet_service_management_task_id: string;

    task_cost?: number;
    labor_cost?: number;
    parts_cost?: number;
    task_notes?: string;

    // ✅ Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations
    service_management_id: string;
    FleetServiceManagement?: FleetServiceManagement;

    fleet_service_task_id: string;
    MasterFleetServiceTask?: MasterFleetServiceTask;
    fleet_service_task?: string;

    // Relations - Child
    _count?: {
    };
}

// ✅ FleetServiceManagementTask Create/Update Schema
export const FleetServiceManagementTaskSchema = z.object({
    fleet_service_task_id: single_select_mandatory('MasterFleetServiceTask'), // ✅ Single-Selection -> MasterFleetServiceTask
    service_management_id: single_select_mandatory('FleetServiceManagement'), // ✅ Single-Selection -> FleetServiceManagement

    task_cost: doubleOptionalLatLng('Task Cost', 3),
    labor_cost: doubleOptionalLatLng('Labor Cost', 3),
    parts_cost: doubleOptionalLatLng('Parts Cost', 3),
    task_notes: stringOptional('Task Notes', 0, 2000),

    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetServiceManagementTaskDTO = z.infer<
    typeof FleetServiceManagementTaskSchema
>;

// ✅ FleetServiceManagementTask Query Schema
export const FleetServiceManagementTaskQuerySchema = BaseQuerySchema.extend({
    fleet_service_management_task_ids: multi_select_optional(
        'FleetServiceManagementTask',
    ), // ✅ Multi-Selection -> FleetServiceManagementTask

    service_management_ids: multi_select_optional('FleetServiceManagement'), // ✅ Multi-Selection -> FleetServiceManagement
    fleet_service_task_ids: multi_select_optional('MasterFleetServiceTask'), // ✅ Multi-Selection -> MasterFleetServiceTask
});
export type FleetServiceManagementTaskQueryDTO = z.infer<
    typeof FleetServiceManagementTaskQuerySchema
>;


// ✅ Convert FleetServiceManagementTask Data to API Payload
export const toFleetServiceManagementTaskPayload = (row: FleetServiceManagementTask): FleetServiceManagementTaskDTO => ({
    task_cost: row.task_cost || 0,
    labor_cost: row.labor_cost || 0,
    parts_cost: row.parts_cost || 0,
    task_notes: row.task_notes || '',

    fleet_service_task_id: row.fleet_service_task_id || '',
    service_management_id: row.service_management_id || '',
    status: Status.Active,
});

// ✅ Create New FleetServiceManagementTask Payload
export const newFleetServiceManagementTaskPayload = (): FleetServiceManagementTaskDTO => ({
    task_cost: 0,
    labor_cost: 0,
    parts_cost: 0,
    task_notes: '',

    status: Status.Active,

    service_management_id: '',
    fleet_service_task_id: '',
});

// API Methods
export const findFleetServiceManagementTask = async (data: FleetServiceManagementTaskQueryDTO): Promise<FBR<FleetServiceManagementTask[]>> => {
    return apiPost<FBR<FleetServiceManagementTask[]>, FleetServiceManagementTaskQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetServiceManagementTask = async (data: FleetServiceManagementTaskDTO): Promise<SBR> => {
    return apiPost<SBR, FleetServiceManagementTaskDTO>(ENDPOINTS.create, data);
};

export const updateFleetServiceManagementTask = async (id: string, data: FleetServiceManagementTaskDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetServiceManagementTaskDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetServiceManagementTask = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};