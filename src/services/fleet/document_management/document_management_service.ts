// Imports
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BaseCommonFile, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    enumMandatory,
    enumArrayOptional,
    getAllEnums,
    single_select_mandatory,
    single_select_optional,
    multi_select_optional,
    stringOptional,
    doubleOptional,
    dateOptional,
    nestedArrayOfObjectsOptional,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { DocumentValidityStatus, DocumentStatus, ExpiryType, FileType, Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from 'src/services/main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { MasterVehicleDocumentType } from 'src/services/master/vehicle/master_vehicle_document_type_service';
import { FleetVendor } from 'src/services/fleet/vendor_management/fleet_vendor_service';

const URL = 'fleet/document_management/fleet_document';

const ENDPOINTS = {
    // AWS S3 PRESIGNED
    fleet_document_file_presigned_url: `${URL}/fleet_document_file_presigned_url`,

    // File Uploads
    create_fleet_document_file: `${URL}/create_fleet_document_file`,
    remove_fleet_document_file: (id: string): string => `${URL}/remove_fleet_document_file/${id}`,

    // FleetDocument APIs
    find: `${URL}/fleet_document/search`,
    create: `${URL}/fleet_document`,
    update: (id: string): string => `${URL}/fleet_document/${id}`,
    delete: (id: string): string => `${URL}/fleet_document/${id}`,

    fleet_document_dashboard: `${URL}/fleet_document_dashboard`,

    // FleetDocumentExpiry APIs
    find_expiry: `${URL}/fleet_document_expiry/search`,
    create_expiry: `${URL}/fleet_document_expiry`,
    update_expiry: (id: string): string => `${URL}/fleet_document_expiry/${id}`,
    delete_expiry: (id: string): string => `${URL}/fleet_document_expiry/${id}`,
};

// FleetDocument Interface
export interface FleetDocument extends Record<string, unknown> {
    // Primary Field
    document_id: string;
    document_sub_id: number;
    document_code?: string;

    // Document Details
    document_number?: string;
    document_authorized_name?: string;
    document_cost?: number;
    document_issue_date?: string;
    document_issue_date_f?: string;
    document_valid_till_date?: string;
    document_valid_till_date_f?: string;
    document_renewal_date?: string;
    document_renewal_date_f?: string;
    document_validity_status: DocumentValidityStatus;
    document_status: DocumentStatus;
    document_details_1?: string;
    document_details_2?: string;
    document_details_3?: string;
    document_details_4?: string;
    document_notes?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;
    organisation_logo_url?: string;

    user_id?: string;
    User?: User;
    user_details?: string;
    user_image_url?: string;

    vehicle_id: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;

    document_type_id: string;
    MasterVehicleDocumentType?: MasterVehicleDocumentType;
    document_type?: string;

    vendor_id?: string;
    FleetVendor?: FleetVendor;
    vendor_logo_url?: string;
    vendor_name?: string;
    vendor_code?: string;

    // Relations - Child
    // Child - Fleet
    FleetDocumentFile?: FleetDocumentFile[];
    FleetDocumentExpiry?: FleetDocumentExpiry[];

    // Relations - Child Count
    _count?: {
        FleetDocumentFile?: number;
        FleetDocumentExpiry?: number;
    };
}

// FleetDocumentFile Interface
export interface FleetDocumentFile extends BaseCommonFile {
    // Primary Field
    document_file_id: string;

    // Usage Type -> Document Images, Document PDF

    // Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;
    organisation_logo_url?: string;

    user_id?: string;
    User?: User;
    user_details?: string;
    user_image_url?: string;

    document_id: string;
    FleetDocument?: FleetDocument;

    // Relations - Child Count
    _count?: {};
}

// FleetDocumentExpiry Interface
export interface FleetDocumentExpiry extends Record<string, unknown> {
    // Primary Field
    document_expiry_id: string;

    // Main Field Details
    expiry_type: ExpiryType;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;
    organisation_logo_url?: string;

    vehicle_id: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;

    document_id: string;
    FleetDocument?: FleetDocument;

    document_type_id: string;
    MasterVehicleDocumentType?: MasterVehicleDocumentType;
    document_type?: string;

    // Relations - Child Count
    _count?: {};
}

// DocumentDashboard Interface
export interface DocumentDashboard extends Record<string, unknown> {
    main_counts: {
        total_documents: number;
        active_documents: number;
        expired_documents: number;
        documents_with_files: number;
        documents_without_files: number;
        valid_documents: number;
        renewal_due_documents: number;
    };

    // Relations - Child Count
    _count?: {};
}

// FleetDocumentFile Schema
export const FleetDocumentFileSchema = BaseFileSchema.extend({
    // Relations - Parent
    organisation_id: single_select_optional('UserOrganisation'), // Single-Selection -> UserOrganisation
    user_id: single_select_optional('User'), // Single-Selection -> User
    document_id: single_select_optional('FleetDocument'), // Single-Selection -> FleetDocument
});
export type FleetDocumentFileDTO = z.infer<typeof FleetDocumentFileSchema>;

// FleetDocument Create/Update Schema
export const FleetDocumentSchema = z.object({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
    user_id: single_select_optional('User'), // Single-Selection -> User
    vehicle_id: single_select_mandatory('MasterVehicle'), // Single-Selection -> MasterVehicle
    document_type_id: single_select_mandatory('MasterVehicleDocumentType'), // Single-Selection -> MasterVehicleDocumentType
    vendor_id: single_select_optional('FleetVendor'), // Single-Selection -> FleetVendor

    // Main Field Details
    document_number: stringOptional('Document Number', 0, 100),
    document_authorized_name: stringOptional('Document Authorized Name', 0, 100),
    document_cost: doubleOptional('Document Cost'),
    document_issue_date: dateOptional('Document Issue Date'),
    document_valid_till_date: dateOptional('Document Valid Till Date'),
    document_renewal_date: dateOptional('Document Renewal Date'),
    document_validity_status: enumMandatory('DocumentValidityStatus', DocumentValidityStatus, DocumentValidityStatus.Valid),
    document_status: enumMandatory('DocumentStatus', DocumentStatus, DocumentStatus.Active),
    document_details_1: stringOptional('Document Details 1', 0, 200),
    document_details_2: stringOptional('Document Details 2', 0, 200),
    document_details_3: stringOptional('Document Details 3', 0, 200),
    document_details_4: stringOptional('Document Details 4', 0, 200),
    document_notes: stringOptional('Document Notes', 0, 2000),

    // Metadata
    status: enumMandatory('Status', Status, Status.Active),

    // Other
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),

    // Files
    FleetDocumentFileSchema: nestedArrayOfObjectsOptional('FleetDocumentFile', FleetDocumentFileSchema, []),
});
export type FleetDocumentDTO = z.infer<typeof FleetDocumentSchema>;

// FleetDocument Query Schema
export const FleetDocumentQuerySchema = BaseQuerySchema.extend({
    // Self Table
    document_ids: multi_select_optional('FleetDocument'), // Multi-Selection -> FleetDocument

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
    user_ids: multi_select_optional('User'), // Multi-Selection -> User
    vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle
    document_type_ids: multi_select_optional('MasterVehicleDocumentType'), // Multi-Selection -> MasterVehicleDocumentType
    vendor_ids: multi_select_optional('FleetVendor'), // Multi-Selection -> FleetVendor

    // Enums
    document_status: enumArrayOptional('Document Status', DocumentStatus, getAllEnums(DocumentStatus)),
    document_validity_status: enumArrayOptional('Document Validity Status', DocumentValidityStatus, getAllEnums(DocumentValidityStatus)),
});
export type FleetDocumentQueryDTO = z.infer<typeof FleetDocumentQuerySchema>;

// FleetDocumentExpiry Create/Update Schema
export const FleetDocumentExpirySchema = z.object({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
    vehicle_id: single_select_mandatory('MasterVehicle'), // Single-Selection -> MasterVehicle
    document_id: single_select_mandatory('FleetDocument'), // Single-Selection -> FleetDocument

    // Main Field Details
    expiry_type: enumMandatory('Expiry Type', ExpiryType, ExpiryType.Expiring),

    // Metadata
    status: enumMandatory('Status', Status, Status.Active),
});
export type FleetDocumentExpiryDTO = z.infer<typeof FleetDocumentExpirySchema>;

// FleetDocumentExpiry Query Schema
export const FleetDocumentExpiryQuerySchema = BaseQuerySchema.extend({
    // Self Table
    document_expiry_ids: multi_select_optional('FleetDocumentExpiry'), // Multi-selection -> FleetDocumentExpiry

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
    vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle
    document_ids: multi_select_optional('FleetDocument'), // Multi-selection -> FleetDocument
    document_type_ids: multi_select_optional('MasterVehicleDocumentType'), // Multi-selection -> MasterVehicleDocumentType

    // Main Field Details
    expiry_type: enumArrayOptional('Expiry Type', ExpiryType, getAllEnums(ExpiryType)),
});
export type FleetDocumentExpiryQueryDTO = z.infer<typeof FleetDocumentExpiryQuerySchema>;

// FleetDocumentDashBoard Query Schema
export const FleetDocumentDashBoardQuerySchema = BaseQuerySchema.extend({
    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
    vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-Selection -> MasterVehicle
});
export type FleetDocumentDashBoardQueryDTO = z.infer<typeof FleetDocumentDashBoardQuerySchema>;

// Convert FleetDocument Data to API Payload
export const toFleetDocumentPayload = (row: FleetDocument): FleetDocumentDTO => ({
    organisation_id: row.organisation_id || '',
    user_id: row.user_id || '',
    vehicle_id: row.vehicle_id || '',
    document_type_id: row.document_type_id || '',
    vendor_id: row.vendor_id || '',

    document_number: row.document_number || '',
    document_authorized_name: row.document_authorized_name || '',
    document_cost: row.document_cost || 0,
    document_issue_date: row.document_issue_date || '',
    document_valid_till_date: row.document_valid_till_date || '',
    document_renewal_date: row.document_renewal_date || '',
    document_validity_status: row.document_validity_status || DocumentValidityStatus.Valid,
    document_status: row.document_status || DocumentStatus.Active,
    document_details_1: row.document_details_1 || '',
    document_details_2: row.document_details_2 || '',
    document_details_3: row.document_details_3 || '',
    document_details_4: row.document_details_4 || '',
    document_notes: row.document_notes || '',

    status: row.status || Status.Active,
    time_zone_id: '',

    FleetDocumentFileSchema: row.FleetDocumentFile?.map((file) => ({
        document_file_id: file.document_file_id || '',

        // Usage Type -> Document Images, Document PDF
        usage_type: file.usage_type || '',

        file_type: file.file_type || FileType.Image,

        file_url: file.file_url || '',
        file_key: file.file_key || '',
        file_name: file.file_name || '',
        file_description: file.file_description || '',
        file_size: file.file_size || 0,
        file_metadata: file.file_metadata || {},

        status: file.status || Status.Active,
        added_date_time: file.added_date_time,
        modified_date_time: file.modified_date_time,

        organisation_id: file.organisation_id || '',
        user_id: file.user_id || '',
        document_id: file.document_id || '',
    })) || [],
});

// Create New FleetDocument Payload
export const newFleetDocumentPayload = (): FleetDocumentDTO => ({
    organisation_id: '',
    user_id: '',
    vehicle_id: '',
    document_type_id: '',
    vendor_id: '',

    document_number: '',
    document_authorized_name: '',
    document_cost: 0,
    document_issue_date: '',
    document_valid_till_date: '',
    document_renewal_date: '',
    document_validity_status: DocumentValidityStatus.Valid,
    document_status: DocumentStatus.Active,
    document_details_1: '',
    document_details_2: '',
    document_details_3: '',
    document_details_4: '',
    document_notes: '',

    status: Status.Active,
    time_zone_id: '',

    FleetDocumentFileSchema: [],
});

// Convert FleetDocumentExpiry Data to API Payload
export const toFleetDocumentExpiryPayload = (row: FleetDocumentExpiry): FleetDocumentExpiryDTO => ({
    organisation_id: row.organisation_id || '',
    vehicle_id: row.vehicle_id || '',
    document_id: row.document_id || '',

    expiry_type: row.expiry_type || ExpiryType.Expiring,

    status: row.status || Status.Active,
});

// Create New FleetDocumentExpiry Payload
export const newFleetDocumentExpiryPayload = (): FleetDocumentExpiryDTO => ({
    organisation_id: '',
    vehicle_id: '',
    document_id: '',

    expiry_type: ExpiryType.Expiring,

    status: Status.Active,
});

// AWS S3 PRESIGNED
export const get_fleet_document_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
    return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.fleet_document_file_presigned_url, data);
};

// File Uploads
export const create_fleet_document_file = async (data: FleetDocumentFileDTO): Promise<SBR> => {
    return apiPost<SBR, FleetDocumentFileDTO>(ENDPOINTS.create_fleet_document_file, data);
};

export const remove_fleet_document_file = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_fleet_document_file(id));
};

// FleetDocument APIs
export const findFleetDocument = async (data: FleetDocumentQueryDTO): Promise<FBR<FleetDocument[]>> => {
    return apiPost<FBR<FleetDocument[]>, FleetDocumentQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetDocument = async (data: FleetDocumentDTO): Promise<SBR> => {
    return apiPost<SBR, FleetDocumentDTO>(ENDPOINTS.create, data);
};

export const updateFleetDocument = async (id: string, data: FleetDocumentDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetDocumentDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetDocument = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const fleet_document_dashboard = async (data: FleetDocumentDashBoardQueryDTO): Promise<FBR<DocumentDashboard[]>> => {
    return apiPost<FBR<DocumentDashboard[]>, FleetDocumentDashBoardQueryDTO>(ENDPOINTS.fleet_document_dashboard, data);
};

// FleetDocumentExpiry APIs
export const findFleetDocumentExpiry = async (data: FleetDocumentExpiryQueryDTO): Promise<FBR<FleetDocumentExpiry[]>> => {
    return apiPost<FBR<FleetDocumentExpiry[]>, FleetDocumentExpiryQueryDTO>(ENDPOINTS.find_expiry, data);
};

export const createFleetDocumentExpiry = async (data: FleetDocumentExpiryDTO): Promise<SBR> => {
    return apiPost<SBR, FleetDocumentExpiryDTO>(ENDPOINTS.create_expiry, data);
};

export const updateFleetDocumentExpiry = async (id: string, data: FleetDocumentExpiryDTO): Promise<SBR> => {
    return apiPatch<SBR, FleetDocumentExpiryDTO>(ENDPOINTS.update_expiry(id), data);
};

export const deleteFleetDocumentExpiry = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete_expiry(id));
};