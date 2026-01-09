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
  AndroidPWA = 'AndroidPWA',
  iOSPWA = 'iOSPWA',
}

export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum ReminderType {
  Upcoming = 'Upcoming',
  OverDue = 'OverDue',
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
  Excel = 'Excel',
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

export enum FuelTankType {
  SingleTank = 'SingleTank',
  DualTank = 'DualTank'
};

export enum OnOff {
  On = 'On',
  Off = 'Off',
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

export enum ReportList {
  AllVehiclesFullAnalysisReport = 'AllVehiclesFullAnalysisReport',
  AllDriversPerformanceReport = 'AllDriversPerformanceReport',
  MonthlyKilometersSummaryReport = 'MonthlyKilometersSummaryReport',
  VehicleStoppageReport = 'VehicleStoppageReport',
  GeofenceReport = 'GeofenceReport',
  GeofenceToGeofenceReport = 'GeofenceToGeofenceReport',
  VehicleIgnitionActivityLogReport = 'VehicleIgnitionActivityLogReport',
  AllVehiclesIgnitionTimeSummaryReport = 'AllVehiclesIgnitionTimeSummaryReport',
  AllVehiclesOverSpeedViolationReport = 'AllVehiclesOverSpeedViolationReport',
  MonthlyOverSpeedSummaryReport = 'MonthlyOverSpeedSummaryReport',
  FuelConsumptionReport = 'FuelConsumptionReport',
  FuelRefillReport = 'FuelRefillReport',
  FuelRemovalReport = 'FuelRemovalReport',
}

export enum NotificationList {
  VehicleMoving = 'VehicleMoving',
  VehicleStopped = 'VehicleStopped',
  IgnitionOn = 'IgnitionOn',
  IgnitionOff = 'IgnitionOff',
  GeofenceEnter = 'GeofenceEnter',
  GeofenceExit = 'GeofenceExit',
  FuelSuddenIncrease = 'FuelSuddenIncrease',
  FuelSuddenDecrease = 'FuelSuddenDecrease',
  OverSpeed = 'OverSpeed',
}

export enum ShareChannel {
  // WhatsApp = 'WhatsApp',
  // SMS = 'SMS',
  Email = 'Email',
}

export enum NotificationChannel {
  Push = 'Push',
  // WhatsApp = 'WhatsApp',
  // SMS = 'SMS',
  Email = 'Email',
}

export enum ReportChannel {
  // WhatsApp = 'WhatsApp',
  // SMS = 'SMS',
  Email = 'Email',
}

export enum ReportType {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

export enum NotificationPreference {
  VehicleMoving = 'VehicleMoving',
  VehicleStopped = 'VehicleStopped',
  IgnitionOn = 'IgnitionOn',
  IgnitionOff = 'IgnitionOff',
  GeofenceEnter = 'GeofenceEnter',
  GeofenceExit = 'GeofenceExit',
  FuelSuddenIncrease = 'FuelSuddenIncrease',
  FuelSuddenDecrease = 'FuelSuddenDecrease',
  OverSpeed70 = 'OverSpeed70',
  OverSpeed80 = 'OverSpeed80',
  OverSpeed90 = 'OverSpeed90',
  OverSpeed100 = 'OverSpeed100',
  OverSpeed110 = 'OverSpeed110',
  OverSpeed120 = 'OverSpeed120',
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
}

export enum InspectionStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Missed = 'Missed',
  Cancelled = 'Cancelled',
  Failed = 'Failed',
}

export enum InspectionPriority {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  NoPriority = 'NoPriority',
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

export enum ServiceStatus {
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

export enum GPSVehicleCategory {
  ALL = 'ALL',
  Moving = 'Moving',
  Stopped = 'Stopped',
  AwaitingGPS = 'AwaitingGPS',
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
  GPSModule = 'GPSModule',
  FleetModule = 'FleetModule',
  TripModule = 'TripModule',
  AccountModule = 'AccountModule',
}

export enum AlertType {
  // GPS Module
  Fuel = 'Fuel',
  Temperature = 'Temperature',
  RelayIgnitionLock = 'RelayIgnitionLock',
  Genset = 'Genset',
  DoorSensor = 'DoorSensor',
  DigitalLocker = 'DigitalLocker',
  OverSpeed = 'OverSpeed',
  Ignition = 'Ignition',
  VehicleMovement = 'VehicleMovement',
  Geofence = 'Geofence',
  Trailer = 'Trailer',

  // Fleet Module
  DocumentExpiry = 'DocumentExpiry',
  Compliance = 'Compliance',
  Maintenance = 'Maintenance',
  Service = 'Service',
  Inspection = 'Inspection',
  Tyre = 'Tyre',
  Incident = 'Incident',
  Issue = 'Issue',
  Reminder = 'Reminder',

  // Trip Module
  Trip = 'Trip',
  Route = 'Route',

  // Account Module
  Invoice = 'Invoice',
  BillDue = 'BillDue',
  UserAuth = 'UserAuth',
}

export enum AlertSubType {
  // Fuel
  FuelRefill = 'FuelRefill',
  FuelRemoval = 'FuelRemoval',
  LowFuel = 'LowFuel',
  FuelSensorFault = 'FuelSensorFault',

  // Temperature
  TemperatureHigh = 'TemperatureHigh',
  TemperatureLow = 'TemperatureLow',
  TempProbeFault = 'TempProbeFault',

  // Relay / Immobilizer
  VehicleLocked = 'VehicleLocked',
  VehicleUnlocked = 'VehicleUnlocked',

  // Genset
  GensetOn = 'GensetOn',
  GensetOff = 'GensetOff',

  // Door sensor
  DoorOpen = 'DoorOpen',
  DoorClose = 'DoorClose',
  DoorOpenTooLong = 'DoorOpenTooLong',
  DoorTamper = 'DoorTamper',

  // Digital locker
  DigitalLockerLocked = 'DigitalLockerLocked',
  DigitalLockerUnlocked = 'DigitalLockerUnlocked',
  DigitalLockerFailedUnlock = 'DigitalLockerFailedUnlock',
  DigitalLockerForcedOpen = 'DigitalLockerForcedOpen',

  // Speed
  OverSpeed = 'OverSpeed',

  // Ignition
  IgnitionOn = 'IgnitionOn',
  IgnitionOff = 'IgnitionOff',

  // Movement
  VehicleMoving = 'VehicleMoving',
  VehicleStopped = 'VehicleStopped',
  VehicleStoppedHours = 'VehicleStoppedHours', // stopped ≥ configured hours (dynamic)
  LessKMTravel = 'LessKMTravel',               // low distance within period (dynamic)
  TowDetected = 'TowDetected',
  AfterHours = 'AfterHours',

  // Geofence
  GeofenceEnter = 'GeofenceEnter',
  GeofenceExit = 'GeofenceExit',

  // Trailer
  TrailerConnected = 'TrailerConnected',
  TrailerDisconnected = 'TrailerDisconnected',

  // ==== Fleet Module ====

  // DocumentExpiry
  InsuranceExpiry = 'InsuranceExpiry',
  RegistrationExpiry = 'RegistrationExpiry',
  PermitExpiry = 'PermitExpiry',
  PollutionExpiry = 'PollutionExpiry',
  FitnessExpiry = 'FitnessExpiry',
  TaxExpiry = 'TaxExpiry',

  // Maintenance
  MaintenanceDue = 'MaintenanceDue',
  MaintenanceOverdue = 'MaintenanceOverdue',
  MaintenanceCompleted = 'MaintenanceCompleted',

  // Service
  ServiceScheduled = 'ServiceScheduled',
  ServiceStarted = 'ServiceStarted',
  ServiceCompleted = 'ServiceCompleted',
  ServiceOverdue = 'ServiceOverdue',

  // Inspection
  InspectionScheduled = 'InspectionScheduled',
  InspectionPassed = 'InspectionPassed',
  InspectionFailed = 'InspectionFailed',
  InspectionOverdue = 'InspectionOverdue',

  // Incident
  CollisionDetected = 'CollisionDetected',
  Rollover = 'Rollover',

  // Issue
  IssueCreated = 'IssueCreated',
  IssueUpdated = 'IssueUpdated',
  IssueResolved = 'IssueResolved',

  // Reminder
  ReminderDue = 'ReminderDue',
  ReminderOverdue = 'ReminderOverdue',
  ReminderCompleted = 'ReminderCompleted',

  // ==== Trip Module ====
  // Trip
  TripPlanned = 'TripPlanned',
  TripStarted = 'TripStarted',
  TripPaused = 'TripPaused',
  TripResumed = 'TripResumed',
  TripCompleted = 'TripCompleted',
  TripCancelled = 'TripCancelled',

  // Route
  RouteDeviation = 'RouteDeviation',
  WaypointMissed = 'WaypointMissed',
  UnscheduledStop = 'UnscheduledStop',

  // ==== Account Module ====
  // Invoice
  InvoiceGenerated = 'InvoiceGenerated',
  InvoiceDue = 'InvoiceDue',
  InvoiceOverdue = 'InvoiceOverdue',
  InvoicePaid = 'InvoicePaid',

  // UserAuth
  UserLogin = 'UserLogin',
  UserLogout = 'UserLogout',
  PasswordChanged = 'PasswordChanged',
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

export enum RefillEntrySource {
  Manual = 'Manual',
  GPSFuelSensor = 'GPSFuelSensor',
  APISync = 'APISync',
  FuelCard = 'FuelCard',
}

export enum RefillMethod {
  Dispenser = 'Dispenser',
  Barrel = 'Barrel',
  Can = 'Can',
  Tanker = 'Tanker',
  Other = 'Other',
}

export enum PaymentMode {
  Cash = 'Cash',
  Card = 'Card',
  UPI = 'UPI',
  FuelCard = 'FuelCard',
  Credit = 'Credit',
  BankTransfer = 'BankTransfer',
  Other = 'Other',
}


export enum BusLeg {
  Pickup = 'Pickup',
  Drop = 'Drop'
}


export enum BusStopType {
  CommonPickupPoint = 'CommonPickupPoint',
  HomeStop = 'HomeStop',
  BranchGate = 'BranchGate',
  ParkingSlot = 'ParkingSlot',
}

export enum EnrollmentStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum TransportPlanType {
  Both = 'Both',
  PickupOnly = 'PickupOnly',
  DropOnly = 'DropOnly',
}

export enum ApprovalStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum StudentLeaveType {
  FullDay = 'FullDay',
  PickupOnly = 'PickupOnly',
  DropOnly = 'DropOnly',
}

export enum HolidayType {
  FullDay = 'FullDay',
  HalfDay = 'HalfDay',
}

export enum DriverType {
  Driver = 'Driver',
  Helper = 'Helper',
}


export enum SteeringType {
  Manual = 'Manual',
  Power = 'Power',
  Electric = 'Electric',
  Hydraulic = 'Hydraulic',
}

export enum WheelDriveType {
  FWD = 'FWD',
  RWD = 'RWD',
  AWD = 'AWD',
  FourWD = 'FourWD',
  TwoWD = 'TwoWD',
  SixWD = 'SixWD',
  EightWD = 'EightWD',
  EAWD = 'EAWD',
  SelectableFourWD = 'SelectableFourWD',
}

export enum VehicleLifeStatus {
  Active = 'Active',
  Retired = 'Retired',
  Scrapped = 'Scrapped',
  Reassigned = 'Reassigned',
  Sold = 'Sold',
  Inactive = 'Inactive',
}

export enum LoanInterestType {
  Simple = 'Simple',
  Compound = 'Compound',
  Reducing = 'Reducing',
}

export enum ExpiryType {
  Expiring = 'Expiring',
  Expired = 'Expired',
}

export enum FleetVendorAddressLabel {
  HQ = 'HQ',
  BILLING = 'BILLING',
  SHIPPING = 'SHIPPING',
  WORKSHOP = 'WORKSHOP',
  OTHER = 'OTHER',
}

export enum IncidentTime {
  EarlyMorning = 'EarlyMorning',
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  Night = 'Night',
  Unknown = 'Unknown',
}

export enum IncidentWeather {
  Clear = 'Clear',
  Cloudy = 'Cloudy',
  Rainy = 'Rainy',
  Stormy = 'Stormy',
  Foggy = 'Foggy',
  Snowy = 'Snowy',
  Hail = 'Hail',
  Windy = 'Windy',
  Other = 'Other',
  Unknown = 'Unknown',
}

export enum IncidentRoadType {
  Highway = 'Highway',
  CityStreet = 'CityStreet',
  RuralRoad = 'RuralRoad',
  MountainRoad = 'MountainRoad',
  ConstructionZone = 'ConstructionZone',
  Alley = 'Alley',
  Expressway = 'Expressway',
  DirtRoad = 'DirtRoad',
  Tunnel = 'Tunnel',
  Bridge = 'Bridge',
  Other = 'Other',
  Unknown = 'Unknown',
}

export enum IncidentVisibility {
  Excellent = 'Excellent',
  Good = 'Good',
  Moderate = 'Moderate',
  Poor = 'Poor',
  VeryPoor = 'VeryPoor',
  Unknown = 'Unknown',
}