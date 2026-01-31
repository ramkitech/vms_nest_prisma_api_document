// Axios
import { apiPost, apiGet } from 'src/core/apiCall';
import { FBR, SBR } from 'src/core/BaseResponse';

// Zod
import { z } from 'zod';
import { enumArrayOptional, multi_select_optional } from 'src/zod_utils/zod_utils';
import { BaseQuerySchema } from 'src/zod_utils/zod_base_schema';

// Enums
import { YesNo, Status, ExecutionStatus, RunType } from 'src/core/Enums';

const URL = 'cronjobs';

const ENDPOINTS = {
    // Monitor & Logs APIs
    monitor: `${URL}/monitor`,
    cron_job_log: `${URL}/cron_job_log/search`,

    // Controls
    cron_job_run_now: (job_name: string): string => `${URL}/cron_job_run_now/${job_name}`,
    cron_job_enable: (job_name: string): string => `${URL}/cron_job_enable/${job_name}`,
    cron_job_disable: (job_name: string): string => `${URL}/cron_job_disable/${job_name}`,
    cron_jobs_reset: `${URL}/cron_jobs_reset`,
};

// CronJobLog Interface
export interface CronJobLog extends Record<string, unknown> {
    // Primary Fields
    cron_job_log_id: string;

    // Main Field Details
    run_type: RunType;
    execution_status: ExecutionStatus;

    start_date_time?: string;
    start_date_time_f?: string;

    end_date_time?: string;
    end_date_time_f?: string;

    error_details?: string;
    success_details?: string;

    // Relations - Parent
    cron_job_id: string;
    CronJobList?: CronJobList;
    app_name?: string;
    job_name?: string;
    is_latest_run: YesNo;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;
}

// CronJobList Interface
export interface CronJobList extends Record<string, unknown> {
    // Primary Fields
    cron_job_id: string;

    // Main Field Details
    app_name: string;
    category_name?: string;
    sub_category_name?: string;
    
    job_name: string;
    job_description?: string;

    cron_expression: string;
    cron_expression_description?: string;

    is_enabled: YesNo;

    // Next Run Details
    next_run_date_time?: string;
    next_run_date_time_f?: string;

    // Last Run Details
    run_type: RunType;
    execution_status: ExecutionStatus;

    start_date_time?: string;
    start_date_time_f?: string;

    end_date_time?: string;
    end_date_time_f?: string;

    error_details?: string;
    success_details?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Child
    CronJobLog?: CronJobLog[];

    // Relations - Child Count
    _count?: {
        CronJobLog?: number;
    };
}

// Monitor / History Query
export const CronMonitorQuerySchema = BaseQuerySchema.extend({
    is_enabled: enumArrayOptional('Is Enabled', YesNo),
    run_type: enumArrayOptional('Run Type', RunType),
    execution_status: enumArrayOptional('Execution Status', ExecutionStatus),
});
export type CronMonitorQueryDTO = z.infer<typeof CronMonitorQuerySchema>;

// CronJobLog Query
export const CronJobLogQuerySchema = BaseQuerySchema.extend({
    // Relations - Parent
    cron_job_ids: multi_select_optional('CronJobList'), // Multi-selection -> CronJobList

    // Enums
    run_type: enumArrayOptional('Run Type', RunType),
    execution_status: enumArrayOptional('Execution Status', ExecutionStatus),
    is_latest_run: enumArrayOptional('Is Latest Run', YesNo),
});
export type CronJobLogQueryDTO = z.infer<typeof CronJobLogQuerySchema>;


// Monitor APIs
export const getCronJobMonitor = async (data: CronMonitorQueryDTO): Promise<FBR<CronJobList[]>> => {
    return apiPost<FBR<CronJobList[]>, CronMonitorQueryDTO>(ENDPOINTS.monitor, data);
};

// CronJobLog APIs
export const getCronJobLog = async (data: CronJobLogQueryDTO): Promise<FBR<CronJobLog[]>> => {
    return apiPost<FBR<CronJobLog[]>, CronJobLogQueryDTO>(ENDPOINTS.cron_job_log, data);
};

// Control APIs
export const runCronJobNow = async (job_name: string): Promise<SBR> => {
    return apiGet<SBR>(ENDPOINTS.cron_job_run_now(job_name));
};

export const enableCronJob = async (job_name: string): Promise<SBR> => {
    return apiGet<SBR>(ENDPOINTS.cron_job_enable(job_name));
};

export const disableCronJob = async (job_name: string): Promise<SBR> => {
    return apiGet<SBR>(ENDPOINTS.cron_job_disable(job_name));
};

export const resetCronJobs = async (): Promise<SBR> => {
    return apiGet<SBR>(ENDPOINTS.cron_jobs_reset);
};
