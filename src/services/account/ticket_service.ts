// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  dynamicJsonSchema,
  enumArrayOptional,
  enumMandatory,
  getAllEnums,
  multi_select_optional,
  nestedArrayOfObjectsOptional,
  numberOptional,
  single_select_mandatory,
  single_select_optional,
  stringMandatory,
  stringOptional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { FileType, Status, TicketStatus } from 'core/Enums';

// Other Models
import { User } from 'services/main/users/user_service';
import { UserAdmin } from 'services/main/users/user_admin_service';
import { UserOrganisation } from 'services/main/users/user_organisation_service';

// URL and Endpoints
const URL = 'account/tickets';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
  presignedUrl: (fileName: string): string =>
    `${URL}/presigned_url/${fileName}`,
  createFile: `${URL}/create_file`,
  removeFile: (id: string): string => `${URL}/remove_file/${id}`,
};

// Ticket File Interface
export interface TicketFile extends Record<string, unknown> {
  ticket_file_id: string;
  file_type: FileType;
  file_url?: string;
  file_key?: string;
  file_description?: string;
  file_size?: number;
  file_metadata?: Record<string, unknown>;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  ticket_id: string;
  Ticket?: Ticket;
}

// Ticket Interface
export interface Ticket extends Record<string, unknown> {
  // Primary Fields
  ticket_id: string;
  subject: string;
  description?: string;
  admin_message?: string;
  ticket_status: TicketStatus;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  user_id: string;
  User?: User;

  admin_id?: string;
  UserAdmin?: UserAdmin;

  // Relations - Child
  TicketFile?: TicketFile[];
}

// ✅ Ticket File Schema
export const TicketFileSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'),
  ticket_id: single_select_mandatory('Ticket'),
  file_type: enumMandatory('File Type', FileType, FileType.Image),
  file_url: stringOptional('File URL', 0, 300),
  file_key: stringOptional('File Key', 0, 300),
  file_description: stringOptional('File Description', 0, 2000),
  file_size: numberOptional('File Size'),
  file_metadata: dynamicJsonSchema('File Metadata', {}),
  status: enumMandatory('Status', Status, Status.Active),
});
export type TicketFileDTO = z.infer<typeof TicketFileSchema>;

// ✅ Ticket Create/Update Schema
export const TicketSchema = z.object({
  subject: stringMandatory('Subject', 3, 100),
  description: stringOptional('Description', 0, 300),
  admin_message: stringOptional('Admin Message', 0, 300),
  ticket_status: enumMandatory(
    'Ticket Status',
    TicketStatus,
    TicketStatus.Open
  ),
  organisation_id: single_select_mandatory('User Organisation'),
  user_id: single_select_mandatory('User'),
  admin_id: single_select_optional('User Admin'),
  ticket_files: nestedArrayOfObjectsOptional(
    'TicketFiles',
    TicketFileSchema,
    []
  ),
  status: enumMandatory('Status', Status, Status.Active),
});
export type TicketDTO = z.infer<typeof TicketSchema>;

// ✅ Ticket Query Schema
export const TicketQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation'),
  user_ids: multi_select_optional('User'),
  admin_ids: multi_select_optional('User Admin'),
  ticket_ids: multi_select_optional('Ticket'),
  ticket_status: enumArrayOptional(
    'Ticket Status',
    TicketStatus,
    getAllEnums(TicketStatus),
    0,
    10,
    true
  ),
});
export type TicketQueryDTO = z.infer<typeof TicketQuerySchema>;

// Convert existing data to a payload structure
export const toTicketPayload = (ticket: Ticket): TicketDTO => ({
  subject: ticket.subject,
  description: ticket.description ?? '',
  admin_message: ticket.admin_message ?? '',
  ticket_status: ticket.ticket_status,
  organisation_id: ticket.organisation_id,
  user_id: ticket.user_id,
  admin_id: ticket.admin_id ?? '',
  ticket_files: [],
  status: ticket.status,
});

// Generate a new payload with default values
export const newTicketPayload = (): TicketDTO => ({
  organisation_id: '',
  user_id: '',
  admin_id: '',
  subject: '',
  description: '',
  admin_message: '',
  ticket_status: TicketStatus.Open,
  ticket_files: [],
  status: Status.Active,
});

// API Methods
export const findTickets = async (
  data: TicketQueryDTO
): Promise<FBR<Ticket[]>> => {
  return apiPost<FBR<Ticket[]>, TicketQueryDTO>(ENDPOINTS.find, data);
};

export const createTicket = async (data: TicketDTO): Promise<SBR> => {
  return apiPost<SBR, TicketDTO>(ENDPOINTS.create, data);
};

export const updateTicket = async (
  id: string,
  data: TicketDTO
): Promise<SBR> => {
  return apiPatch<SBR, TicketDTO>(ENDPOINTS.update(id), data);
};

export const deleteTicket = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// File API Methods
export const getPresignedUrl = async (
  fileName: string
): Promise<FBR<{ url: string }>> => {
  return apiGet<FBR<{ url: string }>>(ENDPOINTS.presignedUrl(fileName));
};

export const createTicketFile = async (data: TicketFileDTO): Promise<SBR> => {
  return apiPost<SBR, TicketFileDTO>(ENDPOINTS.createFile, data);
};

export const removeTicketFile = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.removeFile(id));
};
