// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
//import { FleetSpareParts } from "@api/services/fleet/fleet_spare_parts_service";

const URL = 'master/spare_part/unit';

const ENDPOINTS = {
  // MasterSparePartUnit APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// SparePartUnit Interface
export interface MasterSparePartUnit extends Record<string, unknown> {
  // Primary Fields
  spare_part_unit_id: string;
  unit_name: string;
  unit_code: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  // Child - Fleet
  //FleetSpareParts?: FleetSpareParts[];

  // Relations - Child Count
  _count?: {
    FleetSpareParts?: number;
  };
}

// ✅ MasterSparePartUnit Create/Update Schema
export const MasterSparePartUnitSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  unit_name: stringMandatory('Unit Name', 3, 50),
  unit_code: stringMandatory('Unit Code', 2, 10),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterSparePartUnitDTO = z.infer<typeof MasterSparePartUnitSchema>;

// ✅ MasterSparePartUnit Query Schema
export const SparePartUnitQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  spare_part_unit_ids: multi_select_optional('MasterSparePartUnit'), // ✅ Multi-selection -> MasterSparePartUnit
});
export type SparePartUnitQueryDTO = z.infer<typeof SparePartUnitQuerySchema>;

// Convert MasterSparePartUnit Data to API Payload
export const toMasterSparePartUnitPayload = (row: MasterSparePartUnit): MasterSparePartUnitDTO => ({
  organisation_id: row.organisation_id || '',
  unit_name: row.unit_name || '',
  unit_code: row.unit_code || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterSparePartUnit Payload
export const newMasterSparePartUnitPayload = (): MasterSparePartUnitDTO => ({
  organisation_id: '',
  unit_name: '',
  unit_code: '',
  description: '',
  status: Status.Active,
});

// MasterSparePartUnit APIs
export const findMasterSparePartUnits = async (data: SparePartUnitQueryDTO): Promise<FBR<MasterSparePartUnit[]>> => {
  return apiPost<FBR<MasterSparePartUnit[]>, SparePartUnitQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterSparePartUnit = async (data: MasterSparePartUnitDTO): Promise<SBR> => {
  return apiPost<SBR, MasterSparePartUnitDTO>(ENDPOINTS.create, data);
};

export const updateMasterSparePartUnit = async (id: string, data: MasterSparePartUnitDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterSparePartUnitDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterSparePartUnit = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterSparePartUnitCache = async (organisation_id: string): Promise<FBR<MasterSparePartUnit[]>> => {
  return apiGet<FBR<MasterSparePartUnit[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterSparePartUnitCacheCount = async (organisation_id: string): Promise<FBR<MasterSparePartUnit[]>> => {
  return apiGet<FBR<MasterSparePartUnit[]>>(ENDPOINTS.cache_count(organisation_id));
};

