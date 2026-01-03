// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  enumArrayOptional,
  getAllEnums,
  multi_select_optional,
  single_select_mandatory,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { Status, MenuType } from '../../core/Enums';

// Other Models
import { UserOrganisation } from '../../services/main/users/user_organisation_service';
import { User } from '../../services/main/users/user_service';

// URL and Endpoints
const URL = 'account/bookmarks';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Bookmark Interface
export interface BookMark extends Record<string, unknown> {
  // Primary Fields
  bookmark_id: string;
  module_name: string; // Min: 3, Max: 100
  menu_type: MenuType;
  group_name: string; // Min: 3, Max: 50
  group_name_language: string; // Min: 3, Max: 50
  group_icon: string; // Min: 3, Max: 50
  group_url: string; // Min: 3, Max: 200
  sub_item_name?: string; // Max: 50
  sub_item_name_language?: string; // Max: 50
  sub_item_icon?: string; // Max: 50
  sub_item_url?: string; // Max: 200

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
}

// ✅ Bookmark Create/Update Schema
export const BookMarkSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  user_id: single_select_mandatory('User'), // ✅ Single-selection -> User
  module_name: stringMandatory('Module Name', 3, 100),
  menu_type: enumMandatory('Menu Type', MenuType, MenuType.Group),
  group_name: stringMandatory('Group Name', 3, 50),
  group_name_language: stringMandatory('Group Name Language', 3, 50),
  group_icon: stringMandatory('Group Icon', 3, 50),
  group_url: stringMandatory('Group URL', 3, 200),
  sub_item_name: stringOptional('Sub Item Name', 0, 50),
  sub_item_name_language: stringOptional('Sub Item Name Language', 0, 50),
  sub_item_icon: stringOptional('Sub Item Icon', 0, 50),
  sub_item_url: stringOptional('Sub Item URL', 0, 200),
  status: enumMandatory('Status', Status, Status.Active),
});
export type BookMarkDTO = z.infer<typeof BookMarkSchema>;

// ✅ Bookmark Query Schema
export const BookMarkQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> Organisation
  user_ids: multi_select_optional('User'), // ✅ Multi-selection -> User
  bookmark_ids: multi_select_optional('Bookmark'), // ✅ Multi-selection -> Bookmark
  menu_type: enumArrayOptional(
    'Menu Type',
    MenuType,
    getAllEnums(MenuType),
    0,
    10,
    true
  ),
});
export type BookMarkQueryDTO = z.infer<typeof BookMarkQuerySchema>;

// Convert existing data to a payload structure
export const toBookMarkPayload = (bookmark: BookMark): BookMarkDTO => ({
  module_name: bookmark.module_name,
  menu_type: bookmark.menu_type,
  group_name: bookmark.group_name,
  group_name_language: bookmark.group_name_language,
  group_icon: bookmark.group_icon,
  group_url: bookmark.group_url,
  sub_item_name: bookmark.sub_item_name ?? '',
  sub_item_name_language: bookmark.sub_item_name_language ?? '',
  sub_item_icon: bookmark.sub_item_icon ?? '',
  sub_item_url: bookmark.sub_item_url ?? '',
  user_id: bookmark.user_id,
  organisation_id: bookmark.organisation_id,
  status: bookmark.status,
});

// Generate a new payload with default values
export const newBookMarkPayload = (): BookMarkDTO => ({
  module_name: '',
  menu_type: MenuType.Group,
  group_name: '',
  group_name_language: '',
  group_icon: '',
  group_url: '',
  sub_item_name: '',
  sub_item_name_language: '',
  sub_item_icon: '',
  sub_item_url: '',
  user_id: '',
  organisation_id: '',
  status: Status.Active,
});

// API Methods
export const findBookMarks = async (
  data: BookMarkQueryDTO
): Promise<FBR<BookMark[]>> => {
  return apiPost<FBR<BookMark[]>, BookMarkQueryDTO>(ENDPOINTS.find, data);
};

export const createBookMark = async (data: BookMarkDTO): Promise<SBR> => {
  return apiPost<SBR, BookMarkDTO>(ENDPOINTS.create, data);
};

export const updateBookMark = async (
  id: string,
  data: BookMarkDTO
): Promise<SBR> => {
  return apiPatch<SBR, BookMarkDTO>(ENDPOINTS.update(id), data);
};

export const deleteBookMark = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
