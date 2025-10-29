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
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    // Address
    address_create: `${URL}/address`,
    address_find: `${URL}/address/search`,
    address_update: (id: string): string => `${URL}/address/${id}`,
    address_delete: (id: string): string => `${URL}/address/${id}`,

    // Leave Request
    leave_request_create: `${URL}/leave_request`,
    leave_request_find: `${URL}/leave_request/search`,
    leave_request_update: (id: string): string => `${URL}/leave_request/${id}`,
    leave_request_delete: (id: string): string => `${URL}/leave_request/${id}`,

    // Stop Change Request
    stop_change_request_create: `${URL}/stop_change_request`,
    stop_change_request_find: `${URL}/stop_change_request/search`,
    stop_change_request_update: (id: string): string => `${URL}/stop_change_request/${id}`,
    stop_change_request_delete: (id: string): string => `${URL}/stop_change_request/${id}`,

    // Guardian Link
    guardian_link_create: `${URL}/guardian_link`,
    guardian_link_find: `${URL}/guardian_link/search`,
    guardian_link_update: (id: string): string => `${URL}/guardian_link/${id}`,
    guardian_link_delete: (id: string): string => `${URL}/guardian/${id}`,

    guardian_autofill_find: `${URL}/guardian_autofill/search`,
};

// -----------------------------
// Interfaces (frontend model)
// -----------------------------
export interface Student extends Record<string, unknown> {
    student_id: string;

    photo_url?: string;
    photo_key?: string;

    admission_registration_number?: string;
    roll_number?: string;

    first_name: string;
    last_name?: string;

    mobile_number?: string;
    email?: string;

    dob: string;
    gender?: string;
    blood_group?: string;
    special_notes?: string;

    enrollment_status: EnrollmentStatus;
    transport_plan_type?: TransportPlanType;

    pickup_route_id?: string;
    drop_route_id?: string;
    pickup_route_stop_id?: string;
    drop_route_stop_id?: string;
    pickup_fixed_schedule_id?: string;
    drop_fixed_schedule_id?: string;

    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

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

    address_line1: string;
    address_line2?: string;
    locality_landmark?: string;
    neighborhood?: string;
    town_city?: string;
    district_county?: string;
    state_province_region?: string;
    postal_code?: string;
    country?: string;
    country_code?: string;
    google_location?: string;

    latitude?: number;
    longitude?: number;

    bus_stop_id?: string;
    stop_name?: string;

    is_active: YesNo;
    notes?: string;

    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    student_id: string;
    Student?: Student
}

export interface StudentLeaveRequest extends Record<string, unknown> {
    student_leave_request_id: string;
    date_from: string;
    date_to: string;
    leave_type: StudentLeaveType;
    reason?: string;
    approval_status: ApprovalStatus;
    approval_notes?: string;
    approval_date?: string;
    status: Status;

    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    student_id: string;
    Student?: Student
}

export interface StudentStopChangeRequest extends Record<string, unknown> {
    student_stop_change_request_id: string;
    change_pickup: YesNo;
    change_drop: YesNo;
    is_temporary: YesNo;
    apply_from?: string;
    apply_until?: string;
    reason?: string;
    approval_status: ApprovalStatus;
    approval_notes?: string;
    approval_date?: string;
    status: Status;

    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    student_id: string;
    Student?: Student
    student_address_id: string;
    StudentAddress?: StudentAddress
}

export interface StudentGuardianLink extends Record<string, unknown> {
    student_guardian_link_id: string;
    is_primary: YesNo;
    notes?: string;
    full_name: string;
    mobile: string;
    email?: string;
    alt_mobile?: string;
    photo_url?: string;
    photo_key?: string;
    
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
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

    first_name: stringMandatory('First Name', 3, 100),
    last_name: stringOptional('Last Name', 0, 100),
    admission_registration_number: stringOptional(
        'Admission Registration Number',
        0,
        100,
    ),
    roll_number: stringOptional('Roll Number', 0, 100),

    photo_url: stringOptional('Photo URL', 0, 300),
    photo_key: stringOptional('Photo Key', 0, 300),

    mobile_number: stringOptional('Mobile Number', 0, 20),
    email: stringOptional('Email', 0, 100),

    dob: dateMandatory('DOB'),

    gender: stringOptional('Gender', 0, 20),
    blood_group: stringOptional('Blood Group', 0, 10),
    special_notes: stringOptional('Special Notes', 0, 2000),

    status: enumMandatory('Status', Status, Status.Active),

    enrollment_status: enumOptional(
        'Enrollment Status',
        EnrollmentStatus,
        EnrollmentStatus.Active,
    ),
    change_reason: stringOptional('Change Reason', 0, 500),
});
export type StudentDTO = z.infer<typeof StudentSchema>;

// ✅ Student Query Schema
export const StudentQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-selection -> OrganisationBranch
    program_ids: multi_select_optional('MasterProgram'), // ✅ Multi-selection -> MasterProgram
    stream_ids: multi_select_optional('MasterStream'), // ✅ Multi-selection -> MasterStream
    year_ids: multi_select_optional('MasterYear'), // ✅ Multi-selection -> MasterYear
    semester_ids: multi_select_optional('MasterSemester'), // ✅ Multi-selection -> MasterSemester
    class_ids: multi_select_optional('MasterClass'), // ✅ Multi-selection -> MasterClass
    section_ids: multi_select_optional('MasterSection'), // ✅ Multi-selection -> MasterSection
    student_ids: multi_select_optional('Student'), // ✅ Multi-selection -> Student

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
    drop_stop_same_as_pickup: enumArrayOptional(
        'Drop Stop Same As Pickup',
        YesNo,
        getAllEnums(YesNo),
    ),
});
export type StudentQueryDTO = z.infer<typeof StudentQuerySchema>;

// ✅ Student NoRoute Query Schema
export const StudentNoRouteQuerySchema = BaseQuerySchema.extend({
    organisation_id: single_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
});
export type StudentNoRouteQueryDTO = z.infer<typeof StudentNoRouteQuerySchema>;

// ✅ StudentAddress Create/Update Schema
export const StudentAddressSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
    student_id: single_select_mandatory('Student'), // ✅ Single-Selection -> Student

    // Address
    address_line1: stringMandatory('Address Line 1', 1, 150),
    address_line2: stringOptional('Address Line 2', 0, 150),
    locality_landmark: stringOptional('Locality / Landmark', 0, 150),
    neighborhood: stringOptional('Neighborhood', 0, 100),
    town_city: stringOptional('Town / City', 0, 100),
    district_county: stringOptional('District / County', 0, 100),
    state_province_region: stringOptional('State / Province / Region', 0, 100),
    postal_code: stringOptional('Postal Code', 0, 20),
    country: stringOptional('Country', 0, 100),
    country_code: stringOptional('Country Code', 0, 5),
    google_location: stringOptional('Google Location', 0, 500),

    latitude: doubleOptionalLatLng('Latitude'),
    longitude: doubleOptionalLatLng('Longitude'),

    is_active: enumMandatory('Is Active', YesNo, YesNo.No),
    notes: stringOptional('Notes', 0, 1000),

    status: enumMandatory('Status', Status, Status.Active),
});
export type StudentAddressDTO = z.infer<typeof StudentAddressSchema>;

// ✅ StudentAddress Query Schema
export const StudentAddressQuerySchema = BaseQuerySchema.extend({
    // Multi-select relations
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    student_ids: multi_select_optional('Student'), // ✅ Multi-selection -> Student
    bus_stop_ids: multi_select_optional('BusStop'), // ✅ Multi-selection -> BusStop
    student_address_ids: multi_select_optional('StudentAddress'), // ✅ Multi-selection -> StudentAddress

    is_active: enumArrayOptional('Is Active', YesNo, getAllEnums(YesNo)),
});
export type StudentAddressQueryDTO = z.infer<typeof StudentAddressQuerySchema>;

// ✅ StudentLeaveRequest Create/Update Schema
export const StudentLeaveRequestSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'),
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

    approval_status: enumMandatory(
        'Approval Status',
        ApprovalStatus,
        ApprovalStatus.Pending,
    ),
    approval_notes: stringOptional('Approval Notes', 0, 500),
    approval_date: dateOptional('Approval Date'),

    status: enumMandatory('Status', Status, Status.Active),
});
export type StudentLeaveRequestDTO = z.infer<typeof StudentLeaveRequestSchema>;

// ✅ StudentLeaveRequest Query Schema
export const StudentLeaveRequestQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    student_ids: multi_select_optional('Student'), // ✅ Multi-selection -> Student
    student_leave_request_ids: multi_select_optional('StudentLeaveRequest'), // ✅ Multi-selection -> StudentLeaveRequest

    approval_status: enumArrayOptional(
        'Approval Status',
        ApprovalStatus,
        getAllEnums(ApprovalStatus),
    ),
    leave_type: enumArrayOptional(
        'Leave Type',
        StudentLeaveType,
        getAllEnums(StudentLeaveType),
    ),
});
export type StudentLeaveRequestQueryDTO = z.infer<
    typeof StudentLeaveRequestQuerySchema
>;

// ✅ StudentStopChangeRequest Create/Update Schema
export const StudentStopChangeRequestSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'),
    student_id: single_select_mandatory('Student'),
    student_address_id: single_select_mandatory('StudentAddress'),

    change_pickup: enumMandatory('Change Pickup', YesNo, YesNo.Yes),
    change_drop: enumMandatory('Change Drop', YesNo, YesNo.Yes),

    is_temporary: enumMandatory('Is Temporary', YesNo, YesNo.No),
    apply_from: dateOptional('Apply From'),
    apply_until: dateOptional('Apply Until'),

    reason: stringOptional('Reason', 0, 500),

    approval_status: enumMandatory(
        'Approval Status',
        ApprovalStatus,
        ApprovalStatus.Pending,
    ),
    approval_notes: stringOptional('Approval Notes', 0, 500),
    approval_date: dateOptional('Approval Date'),

    status: enumMandatory('Status', Status, Status.Active),
});
export type StudentStopChangeRequestDTO = z.infer<
    typeof StudentStopChangeRequestSchema
>;

// ✅ StudentStopChangeRequest Query Schema
export const StudentStopChangeRequestQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
    student_ids: multi_select_optional('Student'), // ✅ Multi-selection -> Student
    student_address_ids: multi_select_optional('StudentAddress'), // ✅ Multi-selection -> StudentAddress
    student_stop_change_request_ids: multi_select_optional(
        'StudentStopChangeRequest',
    ), // ✅ Multi-selection -> StudentStopChangeRequest

    change_pickup: enumArrayOptional('Change Pickup', YesNo, getAllEnums(YesNo)),
    change_drop: enumArrayOptional('Change Drop', YesNo, getAllEnums(YesNo)),
    is_temporary: enumArrayOptional('Is Temporary', YesNo, getAllEnums(YesNo)),
    approval_status: enumArrayOptional(
        'Approval Status',
        ApprovalStatus,
        getAllEnums(ApprovalStatus),
    ),
});
export type StudentStopChangeRequestQueryDTO = z.infer<
    typeof StudentStopChangeRequestQuerySchema
>;

// ✅ StudentGuardianLink Create/Update Schema
export const StudentGuardianLinkSchema = z.object({
    is_primary: enumMandatory('Is Primary', YesNo, YesNo.No),
    notes: stringOptional('Notes', 0, 1000),

    organisation_id: single_select_mandatory('UserOrganisation'),
    student_id: single_select_mandatory('Student'),
    relationship_id: single_select_mandatory('MasterRelationship'),

    // Guardian
    full_name: stringMandatory('Full Name', 3, 120),
    mobile: stringMandatory('Mobile', 1, 20),
    email: stringOptional('Email', 0, 100),
    alt_mobile: stringOptional('Alt. Mobile', 0, 20),

    photo_url: stringOptional('Photo URL', 0, 300),
    photo_key: stringOptional('Photo Key', 0, 300),

    status: enumMandatory('Status', Status, Status.Active),
});
export type StudentGuardianLinkDTO = z.infer<typeof StudentGuardianLinkSchema>;

// ✅ StudentGuardian Query Schema
export const StudentGuardianLinkQuerySchema = BaseQuerySchema.extend({
    organisation_ids: multi_select_optional('UserOrganisation'),
    guardian_ids: multi_select_optional('StudentGuardian'),
});
export type StudentGuardianLinkQueryDTO = z.infer<
    typeof StudentGuardianLinkQuerySchema
>;

// ✅ StudentGuardianAutofill Query Schema
export const StudentGuardianAutofillQuerySchema = BaseQuerySchema.extend({
    guardian_ids: multi_select_optional('StudentGuardian'),
});
export type StudentGuardianAutofillQueryDTO = z.infer<
    typeof StudentGuardianAutofillQuerySchema
>;

// -----------------------------
// Helpers: payload creators
// -----------------------------
export const toStudentPayload = (row: Student): StudentDTO => ({
    organisation_id: row.organisation_id,
    organisation_branch_id: row.organisation_branch_id ?? '',
    program_id: row.program_id ?? '',
    stream_id: row.stream_id ?? '',
    year_id: row.year_id ?? '',
    semester_id: row.semester_id ?? '',
    class_id: row.class_id ?? '',
    section_id: row.section_id ?? '',

    first_name: row.first_name,
    last_name: row.last_name ?? '',
    admission_registration_number: row.admission_registration_number ?? '',
    roll_number: row.roll_number ?? '',

    photo_url: row.photo_url ?? '',
    photo_key: row.photo_key ?? '',

    mobile_number: row.mobile_number ?? '',
    email: row.email ?? '',
    dob: row.dob,
    gender: row.gender ?? '',
    blood_group: row.blood_group ?? '',
    special_notes: row.special_notes ?? '',
    status: row.status,
    enrollment_status: row.enrollment_status ?? '',
    change_reason: '',
});

export const newStudentPayload = (): StudentDTO => ({
    year_id: '',
    status: Status.Active,
    organisation_id: '',
    photo_url: '',
    photo_key: '',
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
    organisation_branch_id: '',
    program_id: '',
    stream_id: '',
    semester_id: '',
    class_id: '',
    section_id: '',
    change_reason: ''
});

export const toStudentAddressPayload = (row: StudentAddress): StudentAddressDTO => ({
    organisation_id: row.organisation_id,
    student_id: row.student_id,
    address_line1: row.address_line1,
    address_line2: row.address_line2 ?? '',
    locality_landmark: row.locality_landmark ?? '',
    neighborhood: row.neighborhood ?? '',
    town_city: row.town_city ?? '',
    district_county: row.district_county ?? '',
    state_province_region: row.state_province_region ?? '',
    postal_code: row.postal_code ?? '',
    country: row.country ?? '',
    country_code: row.country_code ?? '',
    google_location: row.google_location ?? '',
    latitude: row.latitude ?? 0,
    longitude: row.longitude ?? 0,
    is_active: row.is_active,
    notes: row.notes ?? '',
    status: row.status,
});

export const newStudentAddressPayload = (): StudentAddressDTO => ({
    organisation_id: '',
    student_id: '',
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
    google_location: '',
    latitude: 0,
    longitude: 0,
    is_active: YesNo.No,
    notes: '',
    status: Status.Active,
});

export const toStudentLeaveRequestPayload = (row: StudentLeaveRequest): StudentLeaveRequestDTO => ({
    organisation_id: row.organisation_id,
    student_id: row.student_id,
    date_from: row.date_from,
    date_to: row.date_to,
    leave_type: row.leave_type,
    reason: row.reason ?? '',
    approval_status: row.approval_status,
    approval_notes: row.approval_notes ?? '',
    approval_date: row.approval_date ?? '',
    status: row.status,
});

export const newStudentLeaveRequestPayload = (): StudentLeaveRequestDTO => ({
    student_id: '',
    status: Status.Active,
    organisation_id: '',
    date_from: '',
    date_to: '',
    leave_type: StudentLeaveType.FullDay,
    reason: '',
    approval_status: ApprovalStatus.Pending,
    approval_notes: '',
    approval_date: ''
});

export const toStudentStopChangeRequestPayload = (row: StudentStopChangeRequest): StudentStopChangeRequestDTO => ({
    organisation_id: row.organisation_id,
    student_id: row.student_id,
    student_address_id: row.student_address_id,
    change_pickup: row.change_pickup,
    change_drop: row.change_drop,
    is_temporary: row.is_temporary,
    apply_from: row.apply_from ?? '',
    apply_until: row.apply_until ?? '',
    reason: row.reason ?? '',
    approval_status: row.approval_status,
    approval_notes: row.approval_notes ?? '',
    approval_date: row.approval_date ?? '',
    status: row.status,
});

export const newStudentStopChangeRequestPayload = (): StudentStopChangeRequestDTO => ({
    student_id: '',
    status: Status.Active,
    organisation_id: '',
    student_address_id: '',
    reason: '',
    approval_status: ApprovalStatus.Pending,
    approval_notes: '',
    approval_date: '',
    change_pickup: YesNo.Yes,
    change_drop: YesNo.Yes,
    is_temporary: YesNo.Yes,
    apply_from: '',
    apply_until: ''
});

export const toStudentGuardianLinkPayload = (row: StudentGuardianLink): StudentGuardianLinkDTO => ({
    organisation_id: row.organisation_id,
    student_id: row.student_id,
    relationship_id: row.relationship_id,

    is_primary: row.is_primary,
    notes: row.notes ?? '',
    
    full_name: row.full_name,
    mobile: row.mobile,
    email: row.email ?? '',
    alt_mobile: row.alt_mobile ?? '',
    photo_url: row.photo_url ?? '',
    photo_key: row.photo_key ?? '',
    status: row.status,
});

export const newStudentGuardianLinkPayload = (): StudentGuardianLinkDTO => ({
    is_primary: YesNo.No,
    notes: '',
    organisation_id: '',
    student_id: '',
    relationship_id: '',
    full_name: '',
    mobile: '',
    email: '',
    alt_mobile: '',
    photo_url: '',
    photo_key: '',
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
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Student No-Route helpers (pickup/drop)
export const findStudentsWithNoRoutePickup = async (data: StudentNoRouteQueryDTO): Promise<FBR<Student[]>> => {
    return apiPost<FBR<Student[]>, StudentNoRouteQueryDTO>(`${URL}/no_route_pickup/search`, data);
};

export const findStudentsWithNoRouteDrop = async (data: StudentNoRouteQueryDTO): Promise<FBR<Student[]>> => {
    return apiPost<FBR<Student[]>, StudentNoRouteQueryDTO>(`${URL}/no_route_drop/search`, data);
};

// StudentAddress CRUD
export const createStudentAddress = async (data: StudentAddressDTO): Promise<SBR> => {
    return apiPost<SBR, StudentAddressDTO>(ENDPOINTS.address_create, data);
};

export const findStudentAddress = async (data: StudentAddressQueryDTO): Promise<FBR<StudentAddress[]>> => {
    return apiPost<FBR<StudentAddress[]>, StudentAddressQueryDTO>(ENDPOINTS.address_find, data);
};

export const updateStudentAddress = async (id: string, data: StudentAddressDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentAddressDTO>(ENDPOINTS.address_update(id), data);
};

export const deleteStudentAddress = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.address_delete(id));
};

// Student Leave Request CRUD
export const createStudentLeaveRequest = async (data: StudentLeaveRequestDTO): Promise<SBR> => {
    return apiPost<SBR, StudentLeaveRequestDTO>(ENDPOINTS.leave_request_create, data);
};

export const findStudentLeaveRequest = async (data: StudentLeaveRequestQueryDTO): Promise<FBR<StudentLeaveRequest[]>> => {
    return apiPost<FBR<StudentLeaveRequest[]>, StudentLeaveRequestQueryDTO>(ENDPOINTS.leave_request_find, data);
};

export const updateStudentLeaveRequest = async (id: string, data: StudentLeaveRequestDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentLeaveRequestDTO>(ENDPOINTS.leave_request_update(id), data);
};

export const deleteStudentLeaveRequest = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.leave_request_delete(id));
};

// Student Stop Change Request CRUD
export const createStudentStopChangeRequest = async (data: StudentStopChangeRequestDTO): Promise<SBR> => {
    return apiPost<SBR, StudentStopChangeRequestDTO>(ENDPOINTS.stop_change_request_create, data);
};

export const findStudentStopChangeRequest = async (data: StudentStopChangeRequestQueryDTO): Promise<FBR<StudentStopChangeRequest[]>> => {
    return apiPost<FBR<StudentStopChangeRequest[]>, StudentStopChangeRequestQueryDTO>(ENDPOINTS.stop_change_request_find, data);
};

export const updateStudentStopChangeRequest = async (id: string, data: StudentStopChangeRequestDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentStopChangeRequestDTO>(ENDPOINTS.stop_change_request_update(id), data);
};

export const deleteStudentStopChangeRequest = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.stop_change_request_delete(id));
};

// Student Guardian Link CRUD
export const createStudentGuardianLink = async (data: StudentGuardianLinkDTO): Promise<SBR> => {
    return apiPost<SBR, StudentGuardianLinkDTO>(ENDPOINTS.guardian_link_create, data);
};

export const findStudentGuardianLink = async (data: StudentGuardianLinkQueryDTO): Promise<FBR<StudentGuardianLink[]>> => {
    return apiPost<FBR<StudentGuardianLink[]>, StudentGuardianLinkQueryDTO>(ENDPOINTS.guardian_link_find, data);
};

export const updateStudentGuardianLink = async (id: string, data: StudentGuardianLinkDTO): Promise<SBR> => {
    return apiPatch<SBR, StudentGuardianLinkDTO>(ENDPOINTS.guardian_link_update(id), data);
};

export const deleteStudentGuardian = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.guardian_link_delete(id));
};

export const findStudentGuardianAutofillDetails = async (data: StudentGuardianAutofillQueryDTO): Promise<FBR<StudentGuardianLink[]>> => {
    return apiPost<FBR<StudentGuardianLink[]>, StudentGuardianAutofillQueryDTO>(ENDPOINTS.guardian_autofill_find, data);
};
