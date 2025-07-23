export interface DashboardSummaryReport extends Record<string, unknown> {
    today: DashboardSummaryReportChild;
    last_24: DashboardSummaryReportChild;
    this_week: DashboardSummaryReportChild;
    last_7_days: DashboardSummaryReportChild;
    this_month: DashboardSummaryReportChild;
    last_3_months: DashboardSummaryReportChild;
}

export interface DashboardSummaryReportChild extends Record<string, unknown> {
    label: string;
    dm_km: string;
    m_on_ts_f: string;
    m_off_ts_f: string;
    i_on_ts_f: string;
    i_off_ts_f: string;
    as: number;
    ms: number;
}
