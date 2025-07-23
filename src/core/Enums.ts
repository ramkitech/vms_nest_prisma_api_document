export enum PAGING {
  Yes = 'Yes',
  No = 'No',
}

export enum LoadParents {
  Yes = 'Yes',
  No = 'No',
  Custom = 'Custom',
}

export enum LoadChild {
  No = 'No',
  Yes = 'Yes',
  Count = 'Count',
  Custom = 'Custom',
  Direct = 'Direct',
}

export enum LoadChildCount {
  No = 'No',
  Yes = 'Yes',
  Custom = 'Custom',
}

export enum OrderBy {
  asc = 'asc',
  desc = 'desc',
}

export enum AdminRole {
  MasterAdmin = 'MasterAdmin',
  Admin = 'Admin',
}

export enum LoginFrom {
  Web = 'Web',
  Android = 'Android',
  IPhone = 'IPhone',
}

export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum ExpenseCategory {
  Main = 'Main',
  Document = 'Document',
  Daily = 'Daily',
  Incident = 'Incident',
  Other = 'Other',
}

export enum DoorSensorStatus {
  Open = 'Open',
  Close = 'Close',
}

export enum LifeExpiry {
  No = 'No',
  Expiring = 'Expiring',
  Expired = 'Expired',
}

export enum PurchaseVehicleType {
  New = 'New',
  Used = 'Used',
}

export enum PurchaseType {
  Loan = 'Loan',
  Lease = 'Lease',
  NoFinance = 'NoFinance',
}

export enum FileType {
  NoFile = 'NoFile',
  Image = 'Image',
  Video = 'Video',
  PDF = 'PDF',
}

export enum DocumentValidityStatus {
  Valid = 'Valid',
  Expiring = 'Expiring',
  Expired = 'Expired',
}

export enum DocumentStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Old = 'Old',
}

export enum YesNo {
  Yes = 'Yes',
  No = 'No',
}

export enum IssueSource {
  Direct = 'Direct',
  Inspection = 'Inspection',
  Incident = 'Incident',
  Service = 'Service',
  Other = 'Other',
}

export enum OdometerSource {
  Direct = 'Direct',
  Inspection = 'Inspection',
  Incident = 'Incident',
  Service = 'Service',
  Issue = 'Issue',
  Other = 'Other',
}

export enum IssueStatus {
  Open = 'Open',
  Closed = 'Closed',
  Resolved = 'Resolved',
  OverDue = 'OverDue',
  Reopen = 'Reopen',
}

export enum Priority {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  NoPriority = 'NoPriority',
}

export enum IssueSeverity {
  Minor = 'Minor',
  Moderate = 'Moderate',
  Severe = 'Severe',
  Critical = 'Critical',
}

export enum RequestType {
  Lock = 'Lock',
  Unlock = 'Unlock',
}

export enum VerifyStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Expired = 'Expired',
}

export enum DeviceType {
  Android = 'Android',
  IPhone = 'IPhone',
  Web = 'Web',
}

export enum NotificationType {
  Whatsapp = 'Whatsapp',
  Message = 'Message',
  Email = 'Email',
}

export enum GeofenceType {
  Polygon = 'Polygon',
  Circle = 'Circle',
}

export enum GeofenceStatusType {
  Enter = 'Enter',
  Exit = 'Exit',
}

export enum LinkType {
  CurrentLocation = 'CurrentLocation',
  LiveLocation = 'LiveLocation',
  Trip = 'Trip',
}

export enum LinkStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Expired = 'Expired',
  TripEnded = 'TripEnded',
}

export enum InspectionStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Missed = 'Missed',
  Cancelled = 'Cancelled',
  Failed = 'Failed',
}

export enum ScheduleType {
  OneTime = 'OneTime',
  Recurring = 'Recurring',
}

export enum RecurrenceInterval {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  CustomInterval = 'CustomInterval',
}

export enum InspectionType {
  Regular = 'Regular',
  VehicleHandover = 'VehicleHandover',
  VehicleReturn = 'VehicleReturn',
  TripPreCheckList = 'TripPreCheckList',
  TripPostCheckList = 'TripPostCheckList',
  ServiceBefore = 'ServiceBefore',
  ServiceAfter = 'ServiceAfter',
}

export enum InspectionActionStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Escalated = 'Escalated',
}

export enum ScheduleStatus {
  Scheduled = 'Scheduled',
  ServiceInitiated = 'ServiceInitiated',
  ServiceInProgress = 'ServiceInProgress',
  Overdue = 'Overdue',
  Missed = 'Missed',
  Completed = 'Completed',
}

export enum JobCardStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  OnHold = 'OnHold',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

export enum ServiceType {
  Preventive = 'Preventive',
  Corrective = 'Corrective',
  Emergency = 'Emergency',
}

export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  PartiallyPaid = 'PartiallyPaid',
  Failed = 'Failed',
  Refunded = 'Refunded',
}

export enum DocumentType {
  PurchaseOrder = 'PurchaseOrder',
  Invoice = 'Invoice',
  TaxDocument = 'TaxDocument',
  Contract = 'Contract',
  License = 'License',
  Registration = 'Registration',
  InsurancePolicy = 'InsurancePolicy',
  Warranty = 'Warranty',
  Quotation = 'Quotation',
  DeliveryChallan = 'DeliveryChallan',
  PerformanceReport = 'PerformanceReport',
  BankDetails = 'BankDetails',
  ComplianceDocument = 'ComplianceDocument',
  Certification = 'Certification',
  Agreement = 'Agreement',
  Other = 'Other',
}

export enum PurchaseOrderStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Ordered = 'Ordered',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  StockReceived = 'StockReceived',
}

export enum StockType {
  Consumable = 'Consumable',
  NonConsumable = 'NonConsumable',
}

export enum ReminderSource {
  VehicleManagement = 'VehicleManagement',
  DriverManagement = 'DriverManagement',
  InspectionManagement = 'InspectionManagement',
  IssueManagement = 'IssueManagement',
  ServiceManagement = 'ServiceManagement',
  SparePartsManagement = 'SparePartsManagement',
  VendorManagement = 'VendorManagement',
  PartyManagement = 'PartyManagement',
  WorkshopManagement = 'WorkshopManagement',
  GPSModule = 'GPSModule',
  Other = 'Other',
}

export enum ReminderStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Overdue = 'Overdue',
  Dismissed = 'Dismissed',
}

export enum ReminderTriggerType {
  TimeBased = 'TimeBased',
  UsageBased = 'UsageBased',
  ConditionBased = 'ConditionBased',
  Custom = 'Custom',
}

export enum GPSFuelApproveStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum RetreadingMethod {
  PreCure = 'PreCure',
  MoldCure = 'MoldCure',
  ColdRetread = 'ColdRetread',
  HotRetread = 'HotRetread',
  CustomRetread = 'CustomRetread',
  Other = 'Other',
}

export enum TyreStatus {
  Instock = 'Instock',
  Installed = 'Installed',
  Retired = 'Retired',
  UnderRepair = 'UnderRepair',
  Retreading = 'Retreading',
  Scrapped = 'Scrapped',
}

export enum GPSSource {
  Traccar = 'Traccar',
  API = 'API',
  Protocol = 'Protocol',
  NoDevice = 'NoDevice',
}

export enum TicketStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  Closed = 'Closed',
  Cancelled = 'Cancelled',
  Reopen = 'Reopen',
}

export enum MenuType {
  Group = 'Group',
  Item = 'Item',
}

export enum Module {
  ABC = 'ABC',
}

export enum SubModule {
  ABC = 'ABC',
}

export enum AlertType {
  ABC = 'ABC',
}

export enum AlertSubType {
  ABC = 'ABC',
}

export enum SimStatus {
  New = 'New',
  Used = 'Used',
  Removed = 'Removed',
}

export enum DeviceStatus {
  New = 'New',
  Used = 'Used',
  Removed = 'Removed',
}

export enum BillingStatus {
  New = 'New',
  Activated = 'Activated',
  Deactivated = 'Deactivated',
}

export enum FleetSize {
  Fleet_1_to_50_Vehicles = 'Fleet_1_to_50_Vehicles',
  Fleet_51_to_100_Vehicles = 'Fleet_51_to_100_Vehicles',
  Fleet_101_to_500_Vehicles = 'Fleet_101_to_500_Vehicles',
  Fleet_501_to_1000_Vehicles = 'Fleet_501_to_1000_Vehicles',
  Fleet_1001_to_5000_Vehicles = 'Fleet_1001_to_5000_Vehicles',
  Fleet_5000Plus_Vehicles = 'Fleet_5000Plus_Vehicles',
}

export enum TrackHistoryLinkStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Expired = 'Expired',
}

export enum GeofencePurposeType {
  // 🚚 Freight & Logistics
  TripSourceLocation = 'TripSourceLocation',
  TripEndLocation = 'TripEndLocation',
  IntermediateStop = 'IntermediateStop',
  LoadingPoint = 'LoadingPoint',
  UnloadingPoint = 'UnloadingPoint',
  Warehouse = 'Warehouse',
  Plant = 'Plant',
  DistributionHub = 'DistributionHub',
  CustomerLocation = 'CustomerLocation',
  VendorLocation = 'VendorLocation',
  ParkingYard = 'ParkingYard',
  Depot = 'Depot',
  LogisticsPark = 'LogisticsPark',

  // 🏭 Industrial & Supply Chain
  Factory = 'Factory',
  Port = 'Port',
  AirportCargoZone = 'AirportCargoZone',
  WeighBridge = 'WeighBridge',
  SecurityGate = 'SecurityGate',
  ScrapYard = 'ScrapYard',
  Checkpost = 'Checkpost',
  TollBooth = 'TollBooth',

  // 🚌 Passenger & Public Transport
  BusStop = 'BusStop',
  BusDepot = 'BusDepot',
  CabPickupPoint = 'CabPickupPoint',
  CabDropPoint = 'CabDropPoint',
  SchoolPickupZone = 'SchoolPickupZone',
  SchoolDropZone = 'SchoolDropZone',
  Terminal = 'Terminal',
  Station = 'Station',
  Office = 'Office',
  ResidentialArea = 'ResidentialArea',

  // 🧊 Cold Chain / Sensitive Goods
  ColdStorage = 'ColdStorage',
  TemperatureSensitiveZone = 'TemperatureSensitiveZone',
  PharmaDeliveryPoint = 'PharmaDeliveryPoint',
  VaccineDropLocation = 'VaccineDropLocation',

  // 🔋 EV & Maintenance
  ChargingStation = 'ChargingStation',
  BatterySwapStation = 'BatterySwapStation',
  FuelStation = 'FuelStation', // ✅ Added back
  ServiceCenter = 'ServiceCenter', // ✅ Added back
  MaintenanceBay = 'MaintenanceBay',

  // 🛑 Security / Restrictions
  RestrictedArea = 'RestrictedArea',
  SpeedLimitZone = 'SpeedLimitZone',
  NoParkingZone = 'NoParkingZone',
  AccidentProneZone = 'AccidentProneZone',
  SchoolZone = 'SchoolZone',

  // 🌾 Agriculture & Rural
  Farm = 'Farm',
  CollectionCenter = 'CollectionCenter',
  RuralDeliveryPoint = 'RuralDeliveryPoint',

  // ⛏️ Mining / Heavy Industry
  MiningZone = 'MiningZone',
  Quarry = 'Quarry',
  MaterialPickup = 'MaterialPickup',
  MaterialDumpingZone = 'MaterialDumpingZone',

  // 🛡️ Government / Emergency
  BorderCheckpost = 'BorderCheckpost',
  PoliceStation = 'PoliceStation',
  FireStation = 'FireStation',
  EmergencyResponseZone = 'EmergencyResponseZone',

  // 🎯 General
  Custom = 'Custom',
}


export enum OverSpeed {
  Over_Speed_60KM = 'Over_Speed_60KM',
  Over_Speed_70KM = 'Over_Speed_70KM',
  Over_Speed_80KM = 'Over_Speed_80KM',
  Over_Speed_90KM = 'Over_Speed_90KM',
  Over_Speed_100KM = 'Over_Speed_100KM',
  Over_Speed_110KM = 'Over_Speed_110KM',
  Over_Speed_120KM = 'Over_Speed_120KM',
  Over_Speed_130KM = 'Over_Speed_130KM',
}

export enum TimeSlot {
  TIME_SLOT_12AM_TO_12AM = 'TIME_SLOT_12AM_TO_12AM',
  TIME_SLOT_1AM_TO_1AM = 'TIME_SLOT_1AM_TO_1AM',
  TIME_SLOT_2AM_TO_2AM = 'TIME_SLOT_2AM_TO_2AM',
  TIME_SLOT_3AM_TO_3AM = 'TIME_SLOT_3AM_TO_3AM',
  TIME_SLOT_4AM_TO_4AM = 'TIME_SLOT_4AM_TO_4AM',
  TIME_SLOT_5AM_TO_5AM = 'TIME_SLOT_5AM_TO_5AM',
  TIME_SLOT_6AM_TO_6AM = 'TIME_SLOT_6AM_TO_6AM',
  TIME_SLOT_7AM_TO_7AM = 'TIME_SLOT_7AM_TO_7AM',
  TIME_SLOT_8AM_TO_8AM = 'TIME_SLOT_8AM_TO_8AM',
  TIME_SLOT_9AM_TO_9AM = 'TIME_SLOT_9AM_TO_9AM',
  TIME_SLOT_10AM_TO_10AM = 'TIME_SLOT_10AM_TO_10AM',
  TIME_SLOT_11AM_TO_11AM = 'TIME_SLOT_11AM_TO_11AM',
  TIME_SLOT_12PM_TO_12PM = 'TIME_SLOT_12PM_TO_12PM',
}

export enum NightDriving {
  Night_Driving_8PM_2AM = 'Night_Driving_8PM_2AM',
  Night_Driving_8PM_3AM = 'Night_Driving_8PM_3AM',
  Night_Driving_8PM_4AM = 'Night_Driving_8PM_4AM',
  Night_Driving_8PM_5AM = 'Night_Driving_8PM_5AM',

  Night_Driving_9PM_2AM = 'Night_Driving_9PM_2AM',
  Night_Driving_9PM_3AM = 'Night_Driving_9PM_3AM',
  Night_Driving_9PM_4AM = 'Night_Driving_9PM_4AM',
  Night_Driving_9PM_5AM = 'Night_Driving_9PM_5AM',

  Night_Driving_10PM_2AM = 'Night_Driving_10PM_2AM',
  Night_Driving_10PM_3AM = 'Night_Driving_10PM_3AM',
  Night_Driving_10PM_4AM = 'Night_Driving_10PM_4AM',
  Night_Driving_10PM_5AM = 'Night_Driving_10PM_5AM',

  Night_Driving_11PM_2AM = 'Night_Driving_11PM_2AM',
  Night_Driving_11PM_3AM = 'Night_Driving_11PM_3AM',
  Night_Driving_11PM_4AM = 'Night_Driving_11PM_4AM',
  Night_Driving_11PM_5AM = 'Night_Driving_11PM_5AM',
}

export enum GPSType {
  Ignition = 'Ignition',
  Stoppage = 'Stoppage',
  Genset = 'Genset',
  Door = 'Door',
}

export enum BooleanType {
  Both = 'Both',
  True = 'True',
  False = 'False',
}

export enum Is12AM {
  Yes = 'Yes',
  No = 'No',
}
