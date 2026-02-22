// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR, BaseCommonFile, BR, AWSPresignedUrl } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  dateMandatory,
  dateOptional,
  enumArrayOptional,
  enumMandatory,
  getAllEnums,
  multi_select_optional,
  nestedArrayOfObjectsOptional,
  numberMandatory,
  single_select_mandatory,
  single_select_optional,
  stringMandatory,
} from '../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../zod_utils/zod_base_schema';

// Enums
import { Status, InvoiceStatus } from '../../core/Enums';

// Other Models
import { UserOrganisation } from '../../services/main/users/user_organisation_service';
import { MasterMainCurrency } from '../master/main/master_main_currency_service';

// URL and Endpoints
const URL = 'account/invoices';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  invoice_file_presigned_url: `${URL}/invoice_file_presigned_url`,

  // File Uploads
  create_invoice_file: `${URL}/create_invoice_file`,
  remove_invoice_file: (id: string): string => `${URL}/remove_invoice_file/${id}`,

  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Invoice Interface
export interface Invoice extends Record<string, unknown> {
  // Primary Fields
  invoice_id: string;

  // Main Field Details
  invoice_number: string;
  invoice_month_year: string;
  invoice_amount: number;

  invoice_generate_date?: string;
  invoice_generate_date_f?: string;
  invoice_due_date?: string;
  invoice_due_date_f?: string;
  payment_date?: string;
  payment_date_f?: string;

  invoice_status: InvoiceStatus;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;

  currency_id: string;
  MasterMainCurrency?: MasterMainCurrency;
  currency_name?: string;
  currency_code?: string;
  currency_symbol?: string;

  // Child Relations
  InvoiceFile?: InvoiceFile[];

  // Optional Count
  _count?: {
    InvoiceFile?: number;
  };
}

// InvoiceFile Interface
export interface InvoiceFile extends BaseCommonFile {
  // Primary Field
  invoice_file_id: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;

  invoice_id: string;
  Invoice?: Invoice;

  invoice_number?: string;

  // Usage Type -> Invoice Document, Invoice Receipt
}

// Invoice File Schema
export const InvoiceFileSchema = BaseFileSchema.extend({
  organisation_id: single_select_optional('UserOrganisation'), // Single-Selection -> UserOrganisation
  invoice_id: single_select_optional('Invoice'), // Single-Selection -> Invoice
});
export type InvoiceFileDTO = z.infer<typeof InvoiceFileSchema>;

// Invoice Create/update Schema
export const InvoiceSchema = z.object({
  invoice_number: stringMandatory('Invoice Number', 1, 100),
  invoice_month_year: stringMandatory('Invoice Month Year', 1, 100),

  invoice_amount: numberMandatory('Invoice Amount', 0),

  invoice_generate_date: dateMandatory('Invoice Generate Date'),
  invoice_due_date: dateMandatory('Invoice Due Date'),
  payment_date: dateOptional('Payment Date'),

  invoice_status: enumMandatory(
    'InvoiceStatus',
    InvoiceStatus,
    InvoiceStatus.InvoiceGenerated,
  ),

  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  currency_id: single_select_mandatory('MasterMainCurrency'), // Single-Selection -> MasterMainCurrency

  InvoiceFileSchema: nestedArrayOfObjectsOptional(
    'InvoiceFileSchema',
    InvoiceFileSchema,
    [],
  ),

  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type InvoiceDTO = z.infer<typeof InvoiceSchema>;

// Invoice Query Schema
export const InvoiceQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  currency_ids: multi_select_optional('MasterMainCurrency'), // Multi-selection -> MasterMainCurrency

  invoice_ids: multi_select_optional('Invoice'), // Multi-selection -> Invoice

  invoice_status: enumArrayOptional(
    'Invoice Status',
    InvoiceStatus,
    getAllEnums(InvoiceStatus),
  ),

  // Date Range Filter
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type InvoiceQueryDTO = z.infer<typeof InvoiceQuerySchema>;

// Convert existing data to a payload structure
export const toInvoicePayload = (invoice: Invoice): InvoiceDTO => ({
  organisation_id: invoice.organisation_id,
  currency_id: invoice.currency_id,

  invoice_number: invoice.invoice_number ?? '',
  invoice_month_year: invoice.invoice_month_year ?? '',

  invoice_amount: Number(invoice.invoice_amount ?? 0),

  invoice_generate_date: invoice.invoice_generate_date ?? '',
  invoice_due_date: invoice.invoice_due_date ?? '',
  payment_date: invoice.payment_date ?? '',

  invoice_status: invoice.invoice_status ?? InvoiceStatus.InvoiceGenerated,

  status: invoice.status || Status.Active,

  // Required by schema
  time_zone_id: (invoice as any).time_zone_id ?? '',

  InvoiceFileSchema:
    invoice.InvoiceFile?.map((file) => ({
      organisation_id: file.organisation_id ?? '',
      invoice_id: file.invoice_id ?? '',
      invoice_file_id: file.invoice_file_id ?? '',
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
export const newInvoicePayload = (): InvoiceDTO => ({
  organisation_id: '',
  currency_id: '',

  invoice_number: '',
  invoice_month_year: '',

  invoice_amount: 0,

  invoice_generate_date: '',
  invoice_due_date: '',
  payment_date: '',

  invoice_status: InvoiceStatus.InvoiceGenerated,

  status: Status.Active,

  time_zone_id: '',

  InvoiceFileSchema: [],
});

// AWS S3 PRESIGNED
export const get_invoice_file_presigned_url = async (
  data: FilePresignedUrlDTO,
): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(
    ENDPOINTS.invoice_file_presigned_url,
    data,
  );
};

// File Uploads
export const create_invoice_file = async (data: InvoiceFileDTO): Promise<SBR> => {
  return apiPost<SBR, InvoiceFileDTO>(ENDPOINTS.create_invoice_file, data);
};

export const remove_invoice_file = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_invoice_file(id));
};

// API Methods
export const findInvoices = async (data: InvoiceQueryDTO): Promise<FBR<Invoice[]>> => {
  return apiPost<FBR<Invoice[]>, InvoiceQueryDTO>(ENDPOINTS.find, data);
};

export const createInvoice = async (data: InvoiceDTO): Promise<SBR> => {
  return apiPost<SBR, InvoiceDTO>(ENDPOINTS.create, data);
};

export const updateInvoice = async (id: string, data: InvoiceDTO): Promise<SBR> => {
  return apiPatch<SBR, InvoiceDTO>(ENDPOINTS.update(id), data);
};

export const deleteInvoice = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};