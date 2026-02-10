// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../../core/apiCall';
import { SBR, FBR } from '../../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  numberMandatory,
  enumMandatory,
  single_select_mandatory,
  enumArrayOptional,
  multi_select_optional,
  dateMandatory,
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status, OdometerSource } from '../../../../core/Enums';

// Other Models
import { MasterVehicle } from '../../../../services/main/vehicle/master_vehicle_service';
import { UserOrganisation } from '../../../../services/main/users/user_organisation_service';

// URL and Endpoints
const URL = 'main/odometer_history';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
};

// Vehicle Odometer History Interface
export interface VehicleOdometerHistory extends Record<string, unknown> {
  // Primary Fields
  vehicle_odometer_history_id: string;
  odometer_reading: number;
  odometer_date: string;
  odometer_source: OdometerSource;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
}

// ✅ Vehicle Odometer History Create/Update Schema
export const VehicleOdometerHistorySchema = z.object({
  organisation_id: single_select_mandatory('Organisation ID'),
  vehicle_id: single_select_mandatory('Vehicle ID'),
  odometer_reading: numberMandatory('Odometer Reading'),
  odometer_date: dateMandatory('Odometer Date'),
  odometer_source: enumMandatory(
    'Odometer Source',
    OdometerSource,
    OdometerSource.Direct
  ),
  status: enumMandatory('Status', Status, Status.Active),
});
export type VehicleOdometerHistoryDTO = z.infer<
  typeof VehicleOdometerHistorySchema
>;

// ✅ Vehicle Odometer History Query Schema
export const OdometerHistoryQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation IDs'),
  vehicle_ids: multi_select_optional('Vehicle IDs'),
  vehicle_odometer_history_ids: multi_select_optional(
    'Vehicle Odometer History IDs'
  ),
  odometer_source: enumArrayOptional('Odometer Source', OdometerSource),
});
export type OdometerHistoryQueryDTO = z.infer<
  typeof OdometerHistoryQuerySchema
>;

// Convert existing data to a payload structure
export const toVehicleOdometerHistoryPayload = (
  history: VehicleOdometerHistory
): VehicleOdometerHistoryDTO => ({
  organisation_id: history.organisation_id,
  vehicle_id: history.vehicle_id,
  odometer_reading: history.odometer_reading,
  odometer_date: history.odometer_date,
  odometer_source: history.odometer_source,
  status: history.status,
});

// Generate a new payload with default values
export const newVehicleOdometerHistoryPayload =
  (): VehicleOdometerHistoryDTO => ({
    organisation_id: '',
    vehicle_id: '',
    odometer_reading: 0,
    odometer_date: new Date().toISOString(),
    odometer_source: OdometerSource.Other,
    status: Status.Active,
  });

// API Methods
export const findVehicleOdometerHistories = async (
  data: OdometerHistoryQueryDTO
): Promise<FBR<VehicleOdometerHistory[]>> => {
  return apiPost<FBR<VehicleOdometerHistory[]>, OdometerHistoryQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createVehicleOdometerHistory = async (
  data: VehicleOdometerHistoryDTO
): Promise<SBR> => {
  return apiPost<SBR, VehicleOdometerHistoryDTO>(ENDPOINTS.create, data);
};

export const updateVehicleOdometerHistory = async (
  id: string,
  data: VehicleOdometerHistoryDTO
): Promise<SBR> => {
  return apiPatch<SBR, VehicleOdometerHistoryDTO>(ENDPOINTS.update(id), data);
};

export const deleteVehicleOdometerHistory = async (
  id: string
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Method
export const getVehicleOdometerHistoryCache = async (): Promise<
  FBR<VehicleOdometerHistory[]>
> => {
  return apiGet<FBR<VehicleOdometerHistory[]>>(ENDPOINTS.cache);
};
