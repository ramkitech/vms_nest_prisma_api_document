// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  doubleOptionalLatLng,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { MasterMainState } from '../../../services/master/main/master_main_state_service';
import { MasterMainCountry } from '../../../services/master/main/master_main_country_service';
import { StudentAddress } from 'src/services/fleet/bus_mangement/student';
import { FleetFuelRefill } from 'src/services/fleet/fuel_management/fleet_fuel_refill_service';
import { FleetFuelRemoval } from 'src/services/fleet/fuel_management/fleet_fuel_removal_service';
import { FleetIncidentManagement } from 'src/services/fleet/incident_management/incident_management_service';
import { FleetVendorFuelStation } from 'src/services/fleet/vendor_management/fleet_vendor_fuel_station';
import { FleetVendorAddress } from 'src/services/fleet/vendor_management/fleet_vendor_service';
import { FleetVendorServiceCenter } from 'src/services/fleet/vendor_management/fleet_vendor_service_center';
import { VehicleDetailGPS } from 'src/services/main/vehicle/master_vehicle_service';

const URL = 'master/main/landmark';

const ENDPOINTS = {
  // MasterMainLandmark APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterMainLandMark Interface
export interface MasterMainLandMark extends Record<string, unknown> {
  // Primary Fields
  landmark_id: string;
  landmark_name: string;

  location: string;
  locality: string;
  city_district_town: string;
  zip_code: string;

  latitude: number;
  longitude: number;
  google_location: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  country_id?: string;
  MasterMainCountry?: MasterMainCountry;

  state_id?: string;
  MasterMainState?: MasterMainState;

  // Relations - Child
  // Child - GPS
  VehicleDetailGPS?: VehicleDetailGPS[]
  // GPSLockRelayLog?: GPSLockRelayLog[]
  // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[]
  // Child - FLeet
  FleetVendorAddress?: FleetVendorAddress[]
  FleetVendorFuelStation?: FleetVendorFuelStation[]
  FleetVendorServiceCenter?: FleetVendorServiceCenter[]

  FleetFuelRefill?: FleetFuelRefill[]
  FleetFuelRemoval?: FleetFuelRemoval[]

  FleetIncidentManagement?: FleetIncidentManagement[]

  StudentAddress?: StudentAddress[]

  // Relations - Child Count
  _count?: {
    VehicleDetailGPS?: number;
    GPSLockRelayLog?: number;
    GPSLockDigitalDoorLog?: number;

    FleetVendorAddress?: number;
    FleetVendorFuelStation?: number;
    FleetVendorServiceCenter?: number;

    FleetFuelRefill?: number;
    FleetFuelRemoval?: number;

    FleetIncidentManagement?: number;

    StudentAddress?: number;
  };
}

// ✅ MasterMainLandmark Create/Update Schema
export const MasterMainLandmarkSchema = z.object({
  country_id: single_select_mandatory('MasterMainCountry'), // ✅ Single-Selection -> MasterMainCountry
  state_id: single_select_mandatory('MasterMainState'), // ✅ Single-Selection -> MasterMainState
  landmark_name: stringMandatory('Landmark Name', 3, 100),
  location: stringOptional('Location', 0, 100),
  google_location: stringOptional('Google Location', 0, 100),
  locality: stringOptional('Locality', 0, 100),
  city_district_town: stringOptional('City/District/Town', 0, 100),
  zip_code: stringOptional('Zip Code', 0, 10),
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainLandmarkDTO = z.infer<typeof MasterMainLandmarkSchema>;

// ✅ MasterMainLandmark Query Schema
export const MasterMainLandmarkQuerySchema = BaseQuerySchema.extend({
  country_ids: multi_select_optional('MasterMainCountry'), // ✅ Multi-selection -> MasterMainCountry
  state_ids: multi_select_optional('MasterMainState'), // ✅ Multi-selection -> MasterMainState
  landmark_ids: multi_select_optional('MasterMainLandmark'), // ✅ Multi-selection -> MasterMainLandmark
});
export type MasterMainLandmarkQueryDTO = z.infer<
  typeof MasterMainLandmarkQuerySchema
>;

// Convert MasterMainLandmark Data to API Payload
export const toMasterMainLandmarkPayload = (row: MasterMainLandMark): MasterMainLandmarkDTO => ({
  country_id: row.country_id || '',
  state_id: row.state_id || '',

  landmark_name: row.landmark_name || '',
  location: row.location || '',
  google_location: row.google_location || '',
  locality: row.locality || '',
  city_district_town: row.city_district_town || '',
  zip_code: row.zip_code || '',
  latitude: row.latitude || 0,
  longitude: row.longitude || 0,
  status: row.status || Status.Active,
});

// Create New MasterMainLandmark Payload
export const newMasterMainLandmarkPayload = (): MasterMainLandmarkDTO => ({
  country_id: '',
  state_id: '',
  landmark_name: '',
  location: '',
  google_location: '',
  locality: '',
  city_district_town: '',
  zip_code: '',
  latitude: 0,
  longitude: 0,
  status: Status.Active,
});

// MasterMainLandmark APIs
export const findMasterMainCountries = async (data: MasterMainLandmarkQueryDTO): Promise<FBR<MasterMainLandMark[]>> => {
  return apiPost<FBR<MasterMainLandMark[]>, MasterMainLandmarkQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainCountry = async (data: MasterMainLandmarkDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainLandmarkDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainCountry = async (id: string, data: MasterMainLandmarkDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainLandmarkDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainCountry = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
