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
  multi_select_optional,
  single_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { MasterMainCountry } from '../../../services/master/main/master_main_country_service';
import { VehicleDetailGPS } from 'src/services/main/vehicle/master_vehicle_service';
import { FleetBreakdown } from 'src/services/fleet/breakdown_management/breakdown_management_service';
import { FleetFuelRefill } from 'src/services/fleet/fuel_management/fleet_fuel_refill_service';
import { FleetFuelRemoval } from 'src/services/fleet/fuel_management/fleet_fuel_removal_service';
import { FleetIncident } from 'src/services/fleet/incident_management/incident_management_service';
import { FleetInspection } from 'src/services/fleet/inspection_management/fleet_inspection_management_service';
import { StudentAddress } from 'src/services/fleet/school_management/student_service';
import { FleetVendorFuelStation } from 'src/services/fleet/vendor_management/fleet_vendor_fuel_station';
import { FleetVendorAddress } from 'src/services/fleet/vendor_management/fleet_vendor_service';
import { FleetVendorServiceCenter } from 'src/services/fleet/vendor_management/fleet_vendor_service_center';
import { FleetWorkshop } from 'src/services/fleet/workshop_management/fleet_workshop_service';

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

  // Address Details
  address_line1?: string;
  address_line2?: string;
  locality_landmark?: string;
  neighborhood?: string;
  town_city?: string;
  district_county?: string;
  state_province_region?: string;
  postal_code?: string;
  country?: string;
  country_code?: string;

  latitude?: number;
  longitude?: number;
  google_location?: string;
  landmark_name?: string;
  landmark_location?: string;

  distance_km?: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  country_id?: string;
  MasterMainCountry?: MasterMainCountry;
  country_name?: string;

  // Relations - Child
  // Child - GPS
  VehicleDetailGPS?: VehicleDetailGPS[];
  // GPSLockRelayLog?: GPSLockRelayLog[];
  // GPSLockDigitalDoorLog?: GPSLockDigitalDoorLog[];
  // Child - Fleet
  FleetVendorAddress?: FleetVendorAddress[];
  FleetVendorFuelStation?: FleetVendorFuelStation[];
  FleetVendorServiceCenter?: FleetVendorServiceCenter[];
  FleetFuelRefill?: FleetFuelRefill[];
  FleetFuelRemoval?: FleetFuelRemoval[];
  FleetBreakdown?: FleetBreakdown[];
  FleetIncident?: FleetIncident[];
  FleetInspection?: FleetInspection[];
  // FleetTyreInspection?: FleetTyreInspection[];
  FleetWorkshop?: FleetWorkshop[];
  StudentAddress?: StudentAddress[];

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
    FleetBreakdown?: number;
    FleetIncident?: number;
    FleetInspection?: number;
    FleetTyreInspection?: number;
    FleetWorkshop?: number;
    StudentAddress?: number;
  };
}

// MasterMainLandmark Create/Update Schema
export const MasterMainLandmarkSchema = z.object({
  // Relations - Parent
  country_id: single_select_optional('MasterMainCountry'), // Single-Selection -> MasterMainCountry

  // Main Field Details
  landmark_name: stringMandatory('Landmark Name', 3, 100),
  landmark_location: stringOptional('Landmark Location', 0, 250),

  // Address Details
  address_line1: stringOptional('Address Line 1', 0, 150),
  address_line2: stringOptional('Address Line 2', 0, 150),
  locality_landmark: stringOptional('Locality Landmark', 0, 150),
  neighborhood: stringOptional('Neighborhood', 0, 100),
  town_city: stringOptional('Town/City', 0, 100),
  district_county: stringOptional('District/County', 0, 100),
  state_province_region: stringOptional('State/Province/Region', 0, 100),
  postal_code: stringOptional('Postal Code', 0, 20),
  country: stringOptional('Country', 0, 100),
  country_code: stringOptional('Country Code', 0, 5),

  // GPS
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  google_location: stringOptional('Google Location', 0, 500),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainLandmarkDTO = z.infer<typeof MasterMainLandmarkSchema>;

// MasterMainLandmark Query Schema
export const MasterMainLandmarkQuerySchema = BaseQuerySchema.extend({
  // Self Table
  landmark_ids: multi_select_optional('MasterMainLandmark'), // Multi-Selection -> MasterMainLandmark

  // Relations - Parent
  country_ids: multi_select_optional('MasterMainCountry'), // Multi-Selection -> MasterMainCountry
});
export type MasterMainLandmarkQueryDTO = z.infer<
  typeof MasterMainLandmarkQuerySchema
>;

// Convert MasterMainLandmark Data to API Payload
export const toMasterMainLandmarkPayload = (row: MasterMainLandMark): MasterMainLandmarkDTO => ({
  // Relations - Parent
  country_id: row.country_id || '',

  // Main Field Details
  landmark_name: row.landmark_name || '',
  landmark_location: row.landmark_location || '',

  // Address Details
  address_line1: row.address_line1 || '',
  address_line2: row.address_line2 || '',
  locality_landmark: row.locality_landmark || '',
  neighborhood: row.neighborhood || '',
  town_city: row.town_city || '',
  district_county: row.district_county || '',
  state_province_region: row.state_province_region || '',
  postal_code: row.postal_code || '',
  country: row.country || '',
  country_code: row.country_code || '',

  // GPS
  latitude: row.latitude || 0,
  longitude: row.longitude || 0,
  google_location: row.google_location || '',

  // Metadata
  status: row.status || Status.Active,
});

// Create New MasterMainLandmark Payload
export const newMasterMainLandmarkPayload = (): MasterMainLandmarkDTO => ({
  // Relations - Parent
  country_id: '',

  // Main Field Details
  landmark_name: '',
  landmark_location: '',

  // Address Details
  address_line1: '',
  address_line2: '',
  locality_landmark: '',
  neighborhood: '',
  town_city: '',
  district_county: '',
  state_province_region: '',
  postal_code: '',
  country: '',
  country_code: '',

  // GPS
  latitude: 0,
  longitude: 0,
  google_location: '',

  // Metadata
  status: Status.Active,
});

// MasterMainLandmark APIs
export const findMasterMainLandMark= async (data: MasterMainLandmarkQueryDTO): Promise<FBR<MasterMainLandMark[]>> => {
  return apiPost<FBR<MasterMainLandMark[]>, MasterMainLandmarkQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainLandMark = async (data: MasterMainLandmarkDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainLandmarkDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainLandMark = async (id: string, data: MasterMainLandmarkDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainLandmarkDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainLandMark = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
