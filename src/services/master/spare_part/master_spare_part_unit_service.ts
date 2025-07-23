// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'core/apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// Other Models
import { UserOrganisation } from 'services/main/users/user_organisation_service';
//import { FleetSpareParts } from "@api/services/fleet/fleet_spare_parts_service";

const URL = 'master/spare_part/unit';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Spare Part Unit Interface
export interface MasterSparePartUnit extends Record<string, unknown> {
  // Primary Fields
  spare_part_unit_id: string;
  unit_name: string; // Min: 3, Max: 50
  unit_code: string; // Min: 2, Max: 10

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  //FleetSpareParts: FleetSpareParts[];

  // Count
  _count?: {
    FleetSpareParts: number;
  };
}

// ✅ Spare Part Unit Create/Update Schema
export const MasterSparePartUnitSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  unit_name: stringMandatory('Unit Name', 3, 50),
  unit_code: stringMandatory('Unit Code', 2, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterSparePartUnitDTO = z.infer<typeof MasterSparePartUnitSchema>;

// ✅ Spare Part Unit Query Schema
export const SparePartUnitQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  spare_part_unit_ids: multi_select_optional('Spare Part Unit'), // ✅ Multi-selection -> MasterSparePartUnit
});
export type SparePartUnitQueryDTO = z.infer<typeof SparePartUnitQuerySchema>;

// Convert existing data to a payload structure
export const toMasterSparePartUnitPayload = (
  unit: MasterSparePartUnit
): MasterSparePartUnitDTO => ({
  organisation_id: unit.organisation_id ?? '',
  unit_name: unit.unit_name,
  unit_code: unit.unit_code,
  status: unit.status,
});

// Generate a new payload with default values
export const newMasterSparePartUnitPayload = (): MasterSparePartUnitDTO => ({
  organisation_id: '',
  unit_name: '',
  unit_code: '',
  status: Status.Active,
});

// API Methods
export const findMasterSparePartUnits = async (
  data: SparePartUnitQueryDTO
): Promise<FBR<MasterSparePartUnit[]>> => {
  return apiPost<FBR<MasterSparePartUnit[]>, SparePartUnitQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterSparePartUnit = async (
  data: MasterSparePartUnitDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterSparePartUnitDTO>(ENDPOINTS.create, data);
};

export const updateMasterSparePartUnit = async (
  id: string,
  data: MasterSparePartUnitDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterSparePartUnitDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterSparePartUnit = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterSparePartUnitCache = async (
  organisation_id: string
): Promise<FBR<MasterSparePartUnit[]>> => {
  return apiGet<FBR<MasterSparePartUnit[]>>(ENDPOINTS.cache(organisation_id));
};
