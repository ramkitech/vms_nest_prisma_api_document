import { z } from 'zod';
import {
  Status,
  PAGING,
  LoadChild,
  LoadParents,
  LoadChildCount,
  OrderBy,
  YesNo,
  LoginFrom,
  FileType,
} from '../core/Enums';
import {
  enumArrayOptional,
  enumOptional,
  numberOptional,
  stringOptional,
  single_select_optional,
  getAllEnums,
  stringArrayOptional,
  dynamicJsonSchema,
  stringMandatory,
  enumMandatory,
} from './zod_utils';

export const OrderBySchema = z.array(
  z.object({
    name: stringMandatory('Order Field Name', 0, 255),
    field: stringMandatory('Order Field Name', 0, 255),
    direction: enumMandatory('Order Direction', OrderBy, OrderBy.asc),
  })
);

export const BaseQuerySchema = z.object({
  search: stringOptional('Search', 0, 255, ''),
  status: enumArrayOptional('Status', Status, getAllEnums(Status), 0, 10, true),

  paging: enumOptional('Paging', PAGING, PAGING.Yes),
  page_count: numberOptional('Page Count', 0, 1000, 100),
  page_index: numberOptional('Page Index', 0, 1000, 0),

  load_parents: enumOptional('Load Parents', LoadParents, LoadParents.No),
  load_parents_list: stringArrayOptional('Load Parents List'),
  load_child: enumOptional('Load Child', LoadChild, LoadChild.No),
  load_child_list: stringArrayOptional('Load Child List'),
  load_child_count: enumOptional(
    'Load Child',
    LoadChildCount,
    LoadChildCount.No
  ),
  load_child_count_list: stringArrayOptional('Load Child List'),
  include_details: dynamicJsonSchema('Include Details', {}),
  where_relations: dynamicJsonSchema('Where Relations', {}),
  order_by: OrderBySchema.optional().default([]),
  include_master_data: enumOptional('Include Master Data', YesNo, YesNo.No),
  date_format_id: single_select_optional('MasterMainDateFormat'),
  time_zone_id: single_select_optional('MasterMainTimeZone'),
});
export type BaseQueryDTO = z.infer<typeof BaseQuerySchema>;

export const FilePresignedUrlSchema = z.object({
  file_name: stringMandatory('File Name', 1, 255),
  file_type: enumMandatory('File Type', FileType, FileType.Image),
});
export type FilePresignedUrlDTO = z.infer<typeof FilePresignedUrlSchema>;

export const MongoBaseQuerySchema = z.object({
  search: stringOptional('Search', 0, 255, ''),
  paging: enumOptional('Paging', PAGING, PAGING.Yes),
  page_count: numberOptional('Page Count', 0, 1000, 100),
  page_index: numberOptional('Page Index', 0, 1000, 0),
  login_from: enumMandatory('Login From', LoginFrom, LoginFrom.Web),
  date_format_id: single_select_optional('MasterMainDateFormat'), // ✅ Single-selection -> MasterMainDateFormat
  time_zone_id: single_select_optional('MasterMainTimeZone'), // ✅ Single-selection -> MasterMainTimeZone
});
export type MongoBaseQueryDTO = z.infer<typeof MongoBaseQuerySchema>;
