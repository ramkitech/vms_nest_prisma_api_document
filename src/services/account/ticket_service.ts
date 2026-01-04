// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR, BaseCommonFile, BR, AWSPresignedUrl } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumArrayOptional,
  enumMandatory,
  getAllEnums,
  multi_select_optional,
  nestedArrayOfObjectsOptional,
  single_select_mandatory,
  single_select_optional,
  stringMandatory,
  stringOptional,
} from '../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../zod_utils/zod_base_schema';

// Enums
import { Status, TicketStatus } from '../../core/Enums';

// Other Models
import { User } from '../../services/main/users/user_service';
import { UserAdmin } from '../../services/main/users/user_admin_service';
import { UserOrganisation } from '../../services/main/users/user_organisation_service';

// URL and Endpoints
const URL = 'account/tickets';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  ticket_file_presigned_url: `${URL}/ticket_file_presigned_url`,

  // File Uploads
  create_ticket_file: `${URL}/create_ticket_file`,
  remove_ticket_file: (id: string): string => `${URL}/remove_ticket_file/${id}`,

  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  update_verify_status: (id: string): string => `${URL}/verify_status/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Ticket Interface
export interface Ticket extends Record<string, unknown> {
  // Primary Fields
  ticket_id: string;

  // Main Field Details
  subject: string;
  description?: string;
  admin_message?: string;
  ticket_status: TicketStatus;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;

  user_id: string;
  User?: User;
  user_details?: string;

  admin_id?: string;
  UserAdmin?: UserAdmin;
  admin_name?: string;

  // Child Relations
  TicketFile?: TicketFile[];

  // Optional Count
  _count?: {
    TicketFile?: number;
  };
}

// TicketFile Interface
export interface TicketFile extends BaseCommonFile {
  // Primary Field
  ticket_file_id: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;

  ticket_id: string;
  Ticket?: Ticket;

  // Usage Type -> Issue Image, Issue Video
}

// Ticket File Schema
export const TicketFileSchema = BaseFileSchema.extend({
  organisation_id: single_select_optional('UserOrganisation'), // Single-Selection -> UserOrganisation
  ticket_id: single_select_optional('Ticket'), // Single-Selection -> Ticket
});
export type TicketFileDTO = z.infer<typeof TicketFileSchema>;

// Ticket Create/update Schema
export const TicketSchema = z.object({
  subject: stringMandatory('Subject', 3, 100),
  description: stringOptional('Description', 0, 500),

  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_mandatory('User'), // Single-Selection -> User

  TicketFileSchema: nestedArrayOfObjectsOptional(
    'TicketFileSchema',
    TicketFileSchema,
    [],
  ),
  status: enumMandatory('Status', Status, Status.Active),
});
export type TicketDTO = z.infer<typeof TicketSchema>;

// Ticket Verify Schema
export const TicketVerifySchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  admin_id: single_select_mandatory('UserAdmin'), // Single-Selection -> UserAdmin
  admin_message: stringOptional('Admin Message', 0, 500),
  ticket_status: enumMandatory('TicketStatus', TicketStatus, TicketStatus.Open),
  TicketFileSchema: nestedArrayOfObjectsOptional(
    'TicketFileSchema',
    TicketFileSchema,
    [],
  ),
});
export type TicketVerifyDTO = z.infer<typeof TicketVerifySchema>;

// Ticket Query Schema
export const TicketQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-selection -> User
  admin_ids: multi_select_optional('UserAdmin'), // Multi-selection -> UserAdmin
  ticket_ids: multi_select_optional('Ticket'), // Multi-selection -> Ticket
  ticket_status: enumArrayOptional(
    'Ticket Status',
    TicketStatus,
    getAllEnums(TicketStatus),
  ),
});
export type TicketQueryDTO = z.infer<typeof TicketQuerySchema>;

// Convert existing data to a payload structure
export const toTicketPayload = (ticket: Ticket): TicketDTO => ({
  organisation_id: ticket.organisation_id,
  user_id: ticket.user_id,

  subject: ticket.subject ?? '',
  description: ticket.description ?? '',

  status: ticket.status || Status.Active,

  TicketFileSchema: ticket.TicketFile?.map((file) => ({
    organisation_id: file.organisation_id ?? '',
    ticket_id: file.ticket_id ?? '',
    ticket_file_id: file.ticket_file_id ?? '',
    usage_type: file.usage_type,
    file_type: file.file_type,
    file_url: file.file_url || '',
    file_key: file.file_key || '',
    file_name: file.file_name || '',
    file_description: file.file_description || '',
    file_size: file.file_size ?? 0,
    file_metadata: file.file_metadata ?? {},
    status: file.status,
  })) ?? [],
});

// Generate a new payload with default values
export const newTicketPayload = (): TicketDTO => ({
  organisation_id: '',
  user_id: '',

  subject: '',
  description: '',

  status: Status.Active,

  TicketFileSchema: [],
});

// Convert existing data to a payload structure
export const newVerifyTicketPayload = (): TicketVerifyDTO => ({
  organisation_id: '',

  admin_id: '',

  admin_message: '',
  ticket_status: TicketStatus.Open,

  TicketFileSchema: [],
});

// Convert existing data to a payload structure
export const toVerifyTicketPayload = (ticket: Ticket): TicketVerifyDTO => ({
  organisation_id: ticket.organisation_id ?? '',

  admin_id: ticket.admin_id ?? '',

  admin_message: ticket.admin_message ?? '',
  ticket_status: ticket.ticket_status,

  TicketFileSchema: ticket.TicketFile?.map((file) => ({
    organisation_id: file.organisation_id ?? '',
    ticket_id: file.ticket_id ?? '',
    ticket_file_id: file.ticket_file_id ?? '',
    usage_type: file.usage_type,
    file_type: file.file_type,
    file_url: file.file_url || '',
    file_key: file.file_key || '',
    file_name: file.file_name || '',
    file_description: file.file_description || '',
    file_size: file.file_size ?? 0,
    file_metadata: file.file_metadata ?? {},
    status: file.status,
  })) ?? [],
});

// AWS S3 PRESIGNED
export const get_ticket_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.ticket_file_presigned_url, data);
};

// File Uploads
export const create_ticket_file = async (data: TicketFileDTO): Promise<SBR> => {
  return apiPost<SBR, TicketFileDTO>(ENDPOINTS.create_ticket_file, data);
};

export const remove_ticket_file = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_ticket_file(id));
};

// API Methods
export const findTickets = async (data: TicketQueryDTO): Promise<FBR<Ticket[]>> => {
  return apiPost<FBR<Ticket[]>, TicketQueryDTO>(ENDPOINTS.find, data);
};

export const createTicket = async (data: TicketDTO): Promise<SBR> => {
  return apiPost<SBR, TicketDTO>(ENDPOINTS.create, data);
};

export const updateTicket = async (id: string, data: TicketDTO): Promise<SBR> => {
  return apiPatch<SBR, TicketDTO>(ENDPOINTS.update(id), data);
};

export const updateVerifyStatus = async (id: string, data: TicketVerifyDTO): Promise<SBR> => {
  return apiPatch<SBR, TicketVerifyDTO>(ENDPOINTS.update_verify_status(id), data);
};

export const deleteTicket = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
