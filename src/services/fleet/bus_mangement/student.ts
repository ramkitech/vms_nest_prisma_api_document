// student_service.ts

// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    single_select_mandatory,
    single_select_optional,
    multi_select_optional,
    enumMandatory,
    enumOptional,
    enumArrayOptional,
    dateMandatory,
    dateOptional,
    stringMandatory,
    stringOptional,
    doubleOptionalLatLng,
    getAllEnums,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import {
    Status,
    YesNo,
    ApprovalStatus,
    EnrollmentStatus,
    StudentLeaveType,
    TransportPlanType,
} from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from '../../master/organisation/organisation_branch_service';
import { MasterClass } from 'src/services/master/bus/master_class_service';
import { MasterProgram } from 'src/services/master/bus/master_program_service';
import { MasterSection } from 'src/services/master/bus/master_section_service';
import { MasterSemester } from 'src/services/master/bus/master_semester_service';
import { MasterStream } from 'src/services/master/bus/master_stream_service';
import { MasterYear } from 'src/services/master/bus/master_year_service';
import { MasterRelationship } from 'src/services/master/bus/master_relationship_service';

// Base URL
const URL = 'student';

const ENDPOINTS = {
    // Student
    find: `${URL}/search`,
    create: URL,
    find_students_with_no_route_pickup: `${URL}/no_route_pickup/search`,
    find_students_with_no_route_drop: `${URL}/no_route_drop/search`,
    update: (id: string): string => `${URL}/${id}`,
    update_profile_picture: (id: string): string => `${URL}/update_profile_picture/${id}`,
    remove: (id: string): string => `${URL}/${id}`,

    // Address
    create_address: `${URL}/address`,
    find_address: `${URL}/address/search`,
    update_address: (id: string): string => `${URL}/address/${id}`,
    update_address_bus_stop_assign: (id: string): string => `${URL}/address_bus_stop_assign/${id}`,
    remove_address: (id: string): string => `${URL}/address/${id}`,

    // Guardian Link
    create_guardian_link: `${URL}/guardian_link`,
    find_guardian_link: `${URL}/guardian_link/search`,
    update_guardian_link: (id: string): string => `${URL}/guardian_link/${id}`,
    update_guardian_profile_picture: (id: string): string => `${URL}/guardian_profile_picture/${id}`,
    update_guardian_details: (id: string): string => `${URL}/guardian_details/${id}`,
    update_guardian_mobile_number: (id: string): string => `${URL}/guardian_mobile_number/${id}`,
    remove_guardian_link: (id: string): string => `${URL}/guardian_link/${id}`,
    find_guardian_autofill_details: `${URL}/guardian_autofill/search`,

    // Leave Request
    create_leave_request: `${URL}/leave_request`,
    find_leave_request: `${URL}/leave_request/search`,
    update_leave_request: (id: string): string => `${URL}/leave_request/${id}`,
    approve_leave_request: (id: string): string => `${URL}/approve_leave_request/${id}`,
    remove_leave_request: (id: string): string => `${URL}/leave_request/${id}`,

    // Stop Change Request
    create_stop_change_request: `${URL}/stop_change_request`,
    find_stop_change_request: `${URL}/stop_change_request/search`,
    update_stop_change_request: (id: string): string => `${URL}/stop_change_request/${id}`,
    approve_stop_change_request: (id: string): string => `${URL}/approve_stop_change_request/${id}`,
    remove_stop_change_request: (id: string): string => `${URL}/stop_change_request/${id}`,
};

// -----------------------------
// Interfaces (frontend model)
// -----------------------------
export interface Student extends Record<string, unknown> {
    student_id: string;

    photo_url?: string;
    photo_key?: string;
    photo_name?: string;

    admission_registration_number?: string;
    roll_number?: string;

    first_name: string;
    last_name?: string;

    mobile_number?: string;
    email?: string;

    dob: string;
    dob_f: string;
    gender?: string;
    blood_group?: string;
    special_notes?: string;

    // Admin Will Update
    enrollment_status: EnrollmentStatus;
    transport_plan_type: TransportPlanType;

    pickup_route_id?: string;
    drop_route_id?: string;
    pickup_route_stop_id?: string;
    drop_route_stop_id?: string;
    pickup_fixed_schedule_id?: string;
    drop_fixed_schedule_id?: string;

    // Metadata
    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    organisation_branch_id?: string;
    OrganisationBranch?: OrganisationBranch;

    program_id?: string;
    MasterProgram?: MasterProgram;

    stream_id?: string;
    MasterStream?: MasterStream;

    year_id?: string;
    MasterYear?: MasterYear;

    semester_id?: string;
    MasterSemester?: MasterSemester;

    class_id?: string;
    MasterClass?: MasterClass;

    section_id?: string;
    MasterSection?: MasterSection;

    _count?: Record<string, number>;
}

export interface StudentAddress extends Record<string, unknown> {
    student_address_id: string;

    // Address
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

    // Location Details
    latitude?: number;
    longitude?: number;
    google_location?: string;

    bus_stop_id?: string;
    stop_name?: string;

    is_default: YesNo;
    notes?: string;

    // Metadata
    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    organisation_branch_id: string;
    OrganisationBranch?: OrganisationBranch;

    student_id: string;
    Student?: Student
}

export interface StudentLeaveRequest extends Record<string, unknown> {
    student_leave_request_id: string;

    // Leave details
    date_from: string;
    date_to: string;
    leave_type: StudentLeaveType;
    reason?: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    organisation_branch_id: string;
    OrganisationBranch?: OrganisationBranch;

    student_id: string;
    Student?: Student
}

export interface StudentStopChangeRequest extends Record<string, unknown> {
    student_stop_change_request_id: string;
    change_pickup: YesNo;
    change_drop: YesNo;
    is_temporary: YesNo;
    apply_from: string;
    apply_until?: string;
    reason?: string;
    approval_status: ApprovalStatus;
    approval_notes?: string;
    approval_date?: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    organisation_branch_id: string;
    OrganisationBranch?: OrganisationBranch;

    student_id: string;
    Student?: Student

    student_address_id: string;
    StudentAddress?: StudentAddress

    status: Status;
}

export interface StudentGuardianLink extends Record<string, unknown> {
    student_guardian_link_id: string;
    is_primary: YesNo;
    notes?: string;
    full_name: string;
    mobile: string;
    email?: string;
    alternative_mobile?: string;

    photo_url?: string;
    photo_key?: string;
    photo_name?: string;

    // Relations
    organisation_id: string;
    UserOrganisation?: UserOrganisation;

    organisation_branch_id: string;
    OrganisationBranch?: OrganisationBranch;

    student_id: string;
    Student?: Student

    relationship_id: string;
    MasterRelationship?: MasterRelationship
    relationship_name?: string;

    status: Status;
}

// -----------------------------
// Zod DTOs (create / update)
// -----------------------------

// ✅ Student Create/Update Schema
export const StudentSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    organisation_branch_id: single_select_optional('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch

    program_id: single_select_optional('MasterProgram'), // ✅ Single-Selection -> MasterProgram
    stream_id: single_select_optional('MasterStream'), // ✅ Single-Selection -> MasterStream
    year_id: single_select_optional('MasterYear'), // ✅ Single-Selection -> MasterYear
    semester_id: single_select_optional('MasterSemester'), // ✅ Single-Selection -> MasterSemester
    class_id: single_select_optional('MasterClass'), // ✅ Single-Selection -> MasterClass
    section_id: single_select_optional('MasterSection'), // ✅ Single-Selection -> MasterSection

    photo_url: stringOptional('Photo URL', 0, 300),
    photo_key: stringOptional('Photo Key', 0, 300),
    photo_name: stringOptional('Photo Name', 0, 300),

    admission_registration_number: stringOptional(
        'Admission Registration Number',
        0,
        100,
    ),
    roll_number: stringOptional('Roll Number', 0, 100),

    first_name: stringMandatory('First Name', 3, 100),
    last_name: stringOptional('Last Name', 0, 100),

    mobile_number: stringOptional('Mobile Number', 0, 10),
    email: stringOptional('Email', 0, 100),

    dob: dateOptional('DOB'),

    gender: stringOptional('Gender', 0, 10),
    blood_group: stringOptional('Blood Group', 0, 10),
    special_notes: stringOptional('Special Notes', 0, 500),

    // Admin Will Update
    enrollment_status: enumOptional(
        'Enrollment Status',
        EnrollmentStatus,
        EnrollmentStatus.Active,
    ),
    transport_plan_type: enumOptional(
        'Transport Plan Type',
        TransportPlanType,
        TransportPlanType.Both,
    ),

    // Other
    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type StudentDTO = z.infer<typeof StudentSchema>;

// ✅ StudentProfilePicture Update Schema
export const StudentProfilePictureSchema = z.object({
    photo_url: stringMandatory('Photo URL', 0, 300),
    photo_key: stringMandatory('Photo Key', 0, 300),
    photo_name: stringMandatory('Photo Name', 0, 300),
});
export type StudentProfilePictureDTO = z.infer<
    typeof StudentProfilePictureSchema
>;

// ✅ Student Query Schema
export const StudentQuerySchema = BaseQuerySchema.extend({
    student_ids: multi_select_optional('Student'), // ✅ Multi-selection -> Student

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-selection -> OrganisationBranch

    program_ids: multi_select_optional('MasterProgram'), // ✅ Multi-selection -> MasterProgram
    stream_ids: multi_select_optional('MasterStream'), // ✅ Multi-selection -> MasterStream
    year_ids: multi_select_optional('MasterYear'), // ✅ Multi-selection -> MasterYear
    semester_ids: multi_select_optional('MasterSemester'), // ✅ Multi-selection -> MasterSemester
    class_ids: multi_select_optional('MasterClass'), // ✅ Multi-selection -> MasterClass
    section_ids: multi_select_optional('MasterSection'), // ✅ Multi-selection -> MasterSection

    pickup_route_ids: multi_select_optional('MasterRoute'), // ✅ Multi-selection -> MasterRoute
    drop_route_ids: multi_select_optional('MasterRoute'), // ✅ Multi-selection -> MasterRoute
    pickup_route_stop_ids: multi_select_optional('MasterRouteStop'), // ✅ Multi-selection -> MasterRouteStop
    drop_route_stop_ids: multi_select_optional('MasterRouteStop'), // ✅ Multi-selection -> MasterRouteStop
    pickup_fixed_schedule_ids: multi_select_optional('MasterFixedSchedule'), // ✅ Multi-selection -> MasterFixedSchedule
    drop_fixed_schedule_ids: multi_select_optional('MasterFixedSchedule'), // ✅ Multi-selection -> MasterFixedSchedule

    enrollment_status: enumArrayOptional(
        'Enrollment Status',
        EnrollmentStatus,
        getAllEnums(EnrollmentStatus),
    ),
    transport_plan_type: enumArrayOptional(
        'Transport Plan Type',
        TransportPlanType,
        getAllEnums(TransportPlanType),
    ),
});
export type StudentQueryDTO = z.infer<typeof StudentQuerySchema>;

// ✅ Student NoRoute Query Schema
export const StudentNoRouteQuerySchema = BaseQuerySchema.extend({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch
});
export type StudentNoRouteQueryDTO = z.infer<typeof StudentNoRouteQuerySchema>;

// ✅ StudentAddress Create/Update Schema
export const StudentAddressSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch
    student_id: single_select_mandatory('Student'), // ✅ Single-Selection -> Student

    // Address
    address_line1: stringOptional('Address Line 1', 0, 150),
    address_line2: stringOptional('Address Line 2', 0, 150),
    locality_landmark: stringOptional('Locality / Landmark', 0, 150),
    neighborhood: stringOptional('Neighborhood', 0, 100),
    town_city: stringOptional('Town / City', 0, 100),
    district_county: stringOptional('District / County', 0, 100),
    state_province_region: stringOptional('State / Province / Region', 0, 100),
    postal_code: stringOptional('Postal Code', 0, 20),
    country: stringOptional('Country', 0, 100),
    country_code: stringOptional('Country Code', 0, 5),

    // Location Details
    latitude: doubleOptionalLatLng('Latitude'),
    longitude: doubleOptionalLatLng('Longitude'),
    google_location: stringOptional('Google Location', 0, 500),

    is_default: enumMandatory('Is Active', YesNo, YesNo.No),
    notes: stringOptional('Notes', 0, 1000),

    status: enumMandatory('Status', Status, Status.Active),
});
export type StudentAddressDTO = z.infer<typeof StudentAddressSchema>;

// ✅ StudentAddressBusStopAssign Update Schema
export const StudentAddressBusStopAssignSchema = z.object({
    bus_stop_id: single_select_mandatory('BusStop'), // ✅ Single-Selection -> BusStop
});
export type StudentAddressBusStopAssignDTO = z.infer<
    typeof StudentAddressBusStopAssignSchema
>;

// ✅ StudentAddress Query Schema
export const StudentAddressQuerySchema = BaseQuerySchema.extend({
    student_address_ids: multi_select_optional('StudentAddress'), // ✅ Multi-selection -> StudentAddress

    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-selection -> OrganisationBranch
    student_ids: multi_select_optional('Student'), // ✅ Multi-selection -> Student
    bus_stop_ids: multi_select_optional('BusStop'), // ✅ Multi-selection -> BusStop

    is_default: enumArrayOptional('Is Active', YesNo, getAllEnums(YesNo)),
});
export type StudentAddressQueryDTO = z.infer<typeof StudentAddressQuerySchema>;

// ✅ StudentGuardianLink Create/Update Schema
export const StudentGuardianLinkSchema = z.object({
    is_primary: enumMandatory('Is Primary', YesNo, YesNo.No),
    notes: stringOptional('Notes', 0, 500),

    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch
    student_id: single_select_mandatory('Student'),
    relationship_id: single_select_mandatory('MasterRelationship'),

    // Guardian
    photo_url: stringOptional('Photo URL', 0, 300),
    photo_key: stringOptional('Photo Key', 0, 300),
    photo_name: stringOptional('Photo Name', 0, 300),

    full_name: stringMandatory('Full Name', 3, 100),
    mobile: stringMandatory('Mobile', 1, 10),
    email: stringOptional('Email', 0, 100),
    alternative_mobile: stringOptional('Alternative Mobile', 0, 10),

    status: enumMandatory('Status', Status, Status.Active),
});
export type StudentGuardianLinkDTO = z.infer<typeof StudentGuardianLinkSchema>;

// ✅ GuardianProfilePicture Update Schema
export const GuardianProfilePictureSchema = z.object({
    photo_url: stringMandatory('Photo URL', 0, 300),
    photo_key: stringMandatory('Photo Key', 0, 300),
    photo_name: stringMandatory('Photo Name', 0, 300),
});
export type GuardianProfilePictureDTO = z.infer<
    typeof GuardianProfilePictureSchema
>;

// ✅ GuardianDetails Update Schema
export const GuardianDetailsSchema = z.object({
    full_name: stringMandatory('Full Name', 3, 100),
    email: stringOptional('Email', 0, 100),
    alternative_mobile: stringOptional('Alternative Mobile', 0, 10),
});
export type GuardianDetailsDTO = z.infer<typeof GuardianDetailsSchema>;

// ✅ GuardianMobileNumber Update Schema
export const GuardianMobileNumberSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch
    old_mobile: stringMandatory('Mobile', 1, 10),
    new_mobile: stringMandatory('Mobile', 1, 10),
});
export type GuardianMobileNumberDTO = z.infer<
    typeof GuardianMobileNumberSchema
>;

// ✅ StudentGuardian Query Schema
export const StudentGuardianLinkQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-selection -> OrganisationBranch
    student_ids: multi_select_optional('Student'), // ✅ Multi-selection -> Student
    guardian_ids: multi_select_optional('StudentGuardian'), // ✅ Multi-selection -> StudentGuardian
});
export type StudentGuardianLinkQueryDTO = z.infer<
    typeof StudentGuardianLinkQuerySchema
>;

// ✅ StudentGuardianAutofill Query Schema
export const StudentGuardianAutofillQuerySchema = BaseQuerySchema.extend({
    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch
    mobile: stringMandatory('Mobile', 1, 10),
});
export type StudentGuardianAutofillQueryDTO = z.infer<
    typeof StudentGuardianAutofillQuerySchema
>;

// ✅ StudentLeaveRequest Create/Update Schema
export const StudentLeaveRequestSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch
    student_id: single_select_mandatory('Student'),

    // Leave details
    date_from: dateMandatory('Date From'),
    date_to: dateMandatory('Date To'),
    leave_type: enumMandatory(
        'Leave Type',
        StudentLeaveType,
        StudentLeaveType.FullDay,
    ),
    reason: stringOptional('Reason', 0, 500),

    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type StudentLeaveRequestDTO = z.infer<typeof StudentLeaveRequestSchema>;

// ✅ StudentLeaveRequest Approval Schema
export const StudentLeaveRequestApprovalSchema = z.object({
    approval_status: enumMandatory(
        'Approval Status',
        ApprovalStatus,
        ApprovalStatus.Pending,
    ),
    approval_notes: stringOptional('Approval Notes', 0, 500),

    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type StudentLeaveRequestApprovalDTO = z.infer<
    typeof StudentLeaveRequestApprovalSchema
>;

// ✅ StudentLeaveRequest Query Schema
export const StudentLeaveRequestQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-selection -> OrganisationBranch
    student_ids: multi_select_optional('Student'), // ✅ Multi-selection -> Student
    student_leave_request_ids: multi_select_optional('StudentLeaveRequest'), // ✅ Multi-selection -> StudentLeaveRequest

    approval_status: enumArrayOptional(
        'Approval Status',
        ApprovalStatus,
        getAllEnums(ApprovalStatus),
    ),
});
export type StudentLeaveRequestQueryDTO = z.infer<
    typeof StudentLeaveRequestQuerySchema
>;

// ✅ StudentStopChangeRequest Create/Update Schema
export const StudentStopChangeRequestSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch
    student_id: single_select_mandatory('Student'),
    student_address_id: single_select_mandatory('StudentAddress'),

    change_pickup: enumMandatory('Change Pickup', YesNo, YesNo.Yes),
    change_drop: enumMandatory('Change Drop', YesNo, YesNo.Yes),

    is_temporary: enumMandatory('Is Temporary', YesNo, YesNo.No),
    apply_from: dateMandatory('Apply From'),
    apply_until: dateOptional('Apply Until'),

    reason: stringOptional('Reason', 0, 500),

    // Other
    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type StudentStopChangeRequestDTO = z.infer<
    typeof StudentStopChangeRequestSchema
>;

// ✅ StudentStopChangeRequest Approval Schema
export const StudentStopChangeRequestApprovalSchema = z.object({
    approval_status: enumMandatory(
        'Approval Status',
        ApprovalStatus,
        ApprovalStatus.Pending,
    ),
    approval_notes: stringOptional('Approval Notes', 0, 500),
});
export type StudentStopChangeRequestApprovalDTO = z.infer<
    typeof StudentStopChangeRequestApprovalSchema
>;

// ✅ StudentStopChangeRequest Query Schema
export const StudentStopChangeRequestQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-selection -> OrganisationBranch
    student_ids: multi_select_optional('Student'), // ✅ Multi-selection -> Student
    student_address_ids: multi_select_optional('StudentAddress'), // ✅ Multi-selection -> StudentAddress
    student_stop_change_request_ids: multi_select_optional(
        'StudentStopChangeRequest',
    ), // ✅ Multi-selection -> StudentStopChangeRequest

    approval_status: enumArrayOptional(
        'Approval Status',
        ApprovalStatus,
        getAllEnums(ApprovalStatus),
    ),
});
export type StudentStopChangeRequestQueryDTO = z.infer<
    typeof StudentStopChangeRequestQuerySchema
>;

// -----------------------------
// Helpers: payload creators
// -----------------------------
export const toStudentPayload = (row: Student): StudentDTO => ({
    organisation_id: row.organisation_id || '',
    organisation_branch_id: row.organisation_branch_id || '',

    program_id: row.program_id || '',
    stream_id: row.stream_id || '',
    year_id: row.year_id || '',
    semester_id: row.semester_id || '',
    class_id: row.class_id || '',
    section_id: row.section_id || '',

    photo_url: row.photo_url || '',
    photo_key: row.photo_key || '',
    photo_name: row.photo_name || '',

    admission_registration_number: row.admission_registration_number || '',
    roll_number: row.roll_number || '',

    first_name: row.first_name,
    last_name: row.last_name || '',

    mobile_number: row.mobile_number || '',
    email: row.email || '',

    dob: row.dob,
    gender: row.gender || '',
    blood_group: row.blood_group || '',
    special_notes: row.special_notes || '',

    enrollment_status: row.enrollment_status || EnrollmentStatus.Active,
    transport_plan_type: row.transport_plan_type || TransportPlanType.Both,

    status: row.status,
    time_zone_id: '', // Needs to be provided manually
});

export const newStudentPayload = (): StudentDTO => ({
    organisation_id: '',
    organisation_branch_id: '',

    program_id: '',
    stream_id: '',
    year_id: '',
    semester_id: '',
    class_id: '',
    section_id: '',

    photo_url: '',
    photo_key: '',
    photo_name: '',

    admission_registration_number: '',
    roll_number: '',

    first_name: '',
    last_name: '',

    mobile_number: '',
    email: '',
    dob: '',
    gender: '',
    blood_group: '',
    special_notes: '',

    enrollment_status: EnrollmentStatus.Active,
    transport_plan_type: TransportPlanType.Both,
    status: Status.Active,
    time_zone_id: '', // Needs to be provided manually
});

export const toStudentAddressPayload = (row: StudentAddress): StudentAddressDTO => ({
    organisation_id: row.organisation_id || '',
    organisation_branch_id: row.organisation_branch_id || '',
    student_id: row.student_id || '',

    // Address
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

    // Location Details
    latitude: row.latitude || 0,
    longitude: row.longitude || 0,
    google_location: row.google_location || '',

    is_default: row.is_default || YesNo.No,
    notes: row.notes || '',

    status: row.status,
});

export const newStudentAddressPayload = (): StudentAddressDTO => ({
    student_id: '',
    organisation_id: '',
    organisation_branch_id: '',

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

    latitude: 0,
    longitude: 0,
    google_location: '',

    is_default: YesNo.Yes,
    notes: '',

    status: Status.Active
});

export const toStudentLeaveRequestPayload = (row: StudentLeaveRequest): StudentLeaveRequestDTO => ({
    organisation_id: row.organisation_id || '',
    organisation_branch_id: row.organisation_branch_id || '',
    student_id: row.student_id || '',

    // Leave details
    date_from: row.date_from || '',
    date_to: row.date_to || '',
    leave_type: row.leave_type || StudentLeaveType.FullDay,
    reason: row.reason || '',

    time_zone_id: '', // Needs to be provided manually
});

export const newStudentLeaveRequestPayload = (): StudentLeaveRequestDTO => ({
    student_id: '',
    organisation_id: '',
    organisation_branch_id: '',

    date_from: '',
    date_to: '',
    leave_type: StudentLeaveType.FullDay,

    reason: '',
    time_zone_id: '', // Needs to be provided manually
});

export const toStudentStopChangeRequestPayload = (row: StudentStopChangeRequest): StudentStopChangeRequestDTO => ({
    organisation_id: row.organisation_id || '',
    organisation_branch_id: row.organisation_branch_id || '',
    student_id: row.student_id || '',
    student_address_id: row.student_address_id || '',

    change_pickup: row.change_pickup || YesNo.Yes,
    change_drop: row.change_drop || YesNo.Yes,

    is_temporary: row.is_temporary || YesNo.No,
    apply_from: row.apply_from || '',
    apply_until: row.apply_until || '',
    reason: row.reason || '',

    status: row.status,
    time_zone_id: '', // Needs to be provided manually
});

export const newStudentStopChangeRequestPayload = (): StudentStopChangeRequestDTO => ({
    student_id: '',
    organisation_id: '',
    organisation_branch_id: '',
    student_address_id: '',

    change_pickup: YesNo.Yes,
    change_drop: YesNo.Yes,

    is_temporary: YesNo.No,
    apply_from: '',
    apply_until: '',
    reason: '',

    status: Status.Active,
    time_zone_id: '', // Needs to be provided manually
});

export const toStudentGuardianLinkPayload = (row: StudentGuardianLink): StudentGuardianLinkDTO => ({
    organisation_id: row.organisation_id || '',
    organisation_branch_id: row.organisation_branch_id || '',
    student_id: row.student_id || '',
    relationship_id: row.relationship_id || '',

    is_primary: row.is_primary || YesNo.No,
    notes: row.notes || '',

    photo_url: row.photo_url || '',
    photo_key: row.photo_key || '',
    photo_name: row.photo_name || '',

    full_name: row.full_name || '',
    mobile: row.mobile || '',
    email: row.email || '',
    alternative_mobile: row.alternative_mobile || '',

    status: row.status,
});

export const newStudentGuardianLinkPayload = (): StudentGuardianLinkDTO => ({
    student_id: '',
    organisation_id: '',
    organisation_branch_id: '',
    relationship_id: '',

    is_primary: YesNo.No,
    notes: '',

    // Guardian
    photo_url: '',
    photo_key: '',
    photo_name: '',

    full_name: '',
    mobile: '',
    email: '',
    alternative_mobile: '',

    status: Status.Active,
});

// -----------------------------
// API Methods
// -----------------------------

// Student CRUD
export const findStudent = async (data: StudentQueryDTO): Promise<FBR<Student[]>> => {
    return apiPost<FBR<Student[]>, StudentQueryDTO>(ENDPOINTS.find, data);
};

export const createStudent = async (data: StudentDTO): Promise<SBR> => {
    return apiPost<SBR, StudentDTO>(ENDPOINTS.create, data);
};

export const updateStudent = async (id: string, data: StudentDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentDTO>(ENDPOINTS.update(id), data);
};

export const deleteStudent = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove(id));
};

// Student No-Route helpers (pickup/drop)
export const findStudentsWithNoRoutePickup = async (data: StudentNoRouteQueryDTO): Promise<FBR<Student[]>> => {
    return apiPost<FBR<Student[]>, StudentNoRouteQueryDTO>(`${URL}/no_route_pickup/search`, data);
};

export const findStudentsWithNoRouteDrop = async (data: StudentNoRouteQueryDTO): Promise<FBR<Student[]>> => {
    return apiPost<FBR<Student[]>, StudentNoRouteQueryDTO>(`${URL}/no_route_drop/search`, data);
};

export const updateProfilePicture = async (id: string, data: StudentProfilePictureDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentProfilePictureDTO>(ENDPOINTS.update_profile_picture(id), data);
};

// StudentAddress CRUD
export const createStudentAddress = async (data: StudentAddressDTO): Promise<SBR> => {
    return apiPost<SBR, StudentAddressDTO>(ENDPOINTS.create_address, data);
};

export const findStudentAddress = async (data: StudentAddressQueryDTO): Promise<FBR<StudentAddress[]>> => {
    return apiPost<FBR<StudentAddress[]>, StudentAddressQueryDTO>(ENDPOINTS.find_address, data);
};

export const updateStudentAddress = async (id: string, data: StudentAddressDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentAddressDTO>(ENDPOINTS.update_address(id), data);
};

export const updateAddressBusStopAssign = async (id: string, data: StudentAddressBusStopAssignDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentAddressBusStopAssignDTO>(ENDPOINTS.update_address_bus_stop_assign(id), data);
};

export const deleteStudentAddress = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_address(id));
};

// Student Guardian Link CRUD
export const createStudentGuardianLink = async (data: StudentGuardianLinkDTO): Promise<SBR> => {
    return apiPost<SBR, StudentGuardianLinkDTO>(ENDPOINTS.create_guardian_link, data);
};

export const findStudentGuardianLink = async (data: StudentGuardianLinkQueryDTO): Promise<FBR<StudentGuardianLink[]>> => {
    return apiPost<FBR<StudentGuardianLink[]>, StudentGuardianLinkQueryDTO>(ENDPOINTS.find_guardian_link, data);
};

export const updateStudentGuardianLink = async (id: string, data: StudentGuardianLinkDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentGuardianLinkDTO>(ENDPOINTS.update_guardian_link(id), data);
};

export const updateGuardianProfilePicture = async (id: string, data: GuardianProfilePictureDTO): Promise<SBR> => {
    return apiPatch<SBR, GuardianProfilePictureDTO>(ENDPOINTS.update_guardian_profile_picture(id), data);
};

export const updateGuardianDetails = async (id: string, data: GuardianDetailsDTO): Promise<SBR> => {
    return apiPatch<SBR, GuardianDetailsDTO>(ENDPOINTS.update_guardian_details(id), data);
};

export const updateGuardianMobileNumber = async (id: string, data: GuardianMobileNumberDTO): Promise<SBR> => {
    return apiPatch<SBR, GuardianMobileNumberDTO>(ENDPOINTS.update_guardian_mobile_number(id), data);
};

export const deleteStudentGuardian = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_guardian_link(id));
};

export const findStudentGuardianAutofillDetails = async (data: StudentGuardianAutofillQueryDTO): Promise<FBR<StudentGuardianLink[]>> => {
    return apiPost<FBR<StudentGuardianLink[]>, StudentGuardianAutofillQueryDTO>(ENDPOINTS.find_guardian_autofill_details, data);
};

// Student Leave Request CRUD
export const createStudentLeaveRequest = async (data: StudentLeaveRequestDTO): Promise<SBR> => {
    return apiPost<SBR, StudentLeaveRequestDTO>(ENDPOINTS.create_leave_request, data);
};

export const findStudentLeaveRequest = async (data: StudentLeaveRequestQueryDTO): Promise<FBR<StudentLeaveRequest[]>> => {
    return apiPost<FBR<StudentLeaveRequest[]>, StudentLeaveRequestQueryDTO>(ENDPOINTS.find_leave_request, data);
};

export const updateStudentLeaveRequest = async (id: string, data: StudentLeaveRequestDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentLeaveRequestDTO>(ENDPOINTS.update_leave_request(id), data);
};

export const approveLeaveRequest = async (id: string, data: StudentLeaveRequestApprovalDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentLeaveRequestApprovalDTO>(ENDPOINTS.approve_leave_request(id), data);
};

export const deleteStudentLeaveRequest = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_leave_request(id));
};

// Student Stop Change Request CRUD
export const createStudentStopChangeRequest = async (data: StudentStopChangeRequestDTO): Promise<SBR> => {
    return apiPost<SBR, StudentStopChangeRequestDTO>(ENDPOINTS.create_stop_change_request, data);
};

export const findStudentStopChangeRequest = async (data: StudentStopChangeRequestQueryDTO): Promise<FBR<StudentStopChangeRequest[]>> => {
    return apiPost<FBR<StudentStopChangeRequest[]>, StudentStopChangeRequestQueryDTO>(ENDPOINTS.find_stop_change_request, data);
};

export const updateStudentStopChangeRequest = async (id: string, data: StudentStopChangeRequestDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentStopChangeRequestDTO>(ENDPOINTS.update_stop_change_request(id), data);
};

export const approveStopChangeRequest = async (id: string, data: StudentStopChangeRequestApprovalDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentStopChangeRequestApprovalDTO>(ENDPOINTS.approve_stop_change_request(id), data);
};

export const deleteStudentStopChangeRequest = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.remove_stop_change_request(id));
};


