// Axios
import { apiPost } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  single_select_mandatory,
} from '../../zod_utils/zod_utils';

// Enums
import { Status } from '../../core/Enums';

// Other Models
import { UserOrganisation } from '../main/users/user_organisation_service';
import { User } from '../main/users/user_service';
import {
  MasterBookmarkModule,
  MasterBookmarkPage,
  MasterBookmarkSubModule,
} from './master_bookmark_service';

// URL and Endpoints
const URL = 'account/user_bookmarks';

const ENDPOINTS = {
  selection_list: `${URL}/selection_list`,
  save_selection: `${URL}/save_selection`,
};

// UserBookmark Interface
export interface UserBookmark {
  user_bookmark_id: string;

  sort_order: number;

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

  user_id: string;
  User?: User;
  user_details?: string;
  user_image_url?: string;

  bookmark_module_id: string;
  MasterBookmarkModule?: MasterBookmarkModule;
  module_name?: string;

  bookmark_sub_module_id: string;
  MasterBookmarkSubModule?: MasterBookmarkSubModule;
  sub_module_name?: string;

  bookmark_page_id: string;
  MasterBookmarkPage?: MasterBookmarkPage;
  page_name?: string;
  page_icon_name?: string;
  page_url?: string;
}

export const UserBookmarkSelectionQuerySchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  user_id: single_select_mandatory('User'),
});
export type UserBookmarkSelectionQueryDTO = z.infer<typeof UserBookmarkSelectionQuerySchema>;

export const UserBookmarkSaveSelectionItemSchema = z.object({
  bookmark_page_id: single_select_mandatory('MasterBookmarkPage'),
  sort_order: z.coerce.number().optional().default(0),
});

export const UserBookmarkSaveSelectionSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'),
  user_id: single_select_mandatory('User'),

  pages: z.array(UserBookmarkSaveSelectionItemSchema).default([]),
});
export type UserBookmarkSaveSelectionDTO = z.infer<typeof UserBookmarkSaveSelectionSchema>;

// Convert existing data to a payload structure
export const toBookMarkPayload = (row: UserBookmark): UserBookmarkSaveSelectionDTO => ({
  organisation_id: row.organisation_id,
  user_id: row.user_id,
  pages: []
});

// Generate a new payload with default values
export const newBookMarkPayload = (): UserBookmarkSaveSelectionDTO => ({
  organisation_id: '',
  user_id: '',
  pages: []
});

// API Methods
export const getUserBookmarks = async (data: UserBookmarkSelectionQueryDTO): Promise<FBR<UserBookmark[]>> => {
  return apiPost<FBR<UserBookmark[]>, UserBookmarkSelectionQueryDTO>(ENDPOINTS.selection_list, data);
};

export const saveUserBookmarks = async (data: UserBookmarkSaveSelectionDTO): Promise<SBR> => {
  return apiPost<SBR, UserBookmarkSaveSelectionDTO>(ENDPOINTS.save_selection, data);
};
