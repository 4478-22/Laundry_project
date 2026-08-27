// Domain models for Laundex.
// These mirror what a Flutter app's model classes would look like —
// plain data shapes that the UI and state layers consume.

export type ServiceLocation =
  | "Accra"
  | "Madina"
  | "Legon"
  | "Adenta";

export type PickupOption = "Student drops off" | "Laundry pickup";

export type OrderStatus =
  | "Booking Confirmed"
  | "Laundry Accepted"
  | "Pickup Scheduled"
  | "Washing"
  | "Ready"
  | "Completed";

/** The three stages the student sees on the tracking screen. */
export type StudentStage = "Booking Confirmed" | "Pickup Scheduled" | "Ready";

/** Maps any internal OrderStatus to the student-facing stage it belongs to. */
export function toStudentStage(status: OrderStatus): StudentStage {
  switch (status) {
    case "Booking Confirmed":
    case "Laundry Accepted":
      return "Booking Confirmed";
    case "Pickup Scheduled":
    case "Washing":
      return "Pickup Scheduled";
    case "Ready":
    case "Completed":
      return "Ready";
  }
}

export interface Service {
  id: string;
  name: string;
  /** Price in Ghana Cedis. Unit is either "kg" or "item". */
  price: number;
  unit: "kg" | "item";
  /** Human-readable duration, e.g. "24 hours". */
  duration: string;
  description: string;
  available?: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  /** ISO-ish date string for display only. */
  date: string;
}

export interface Laundry {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  distanceMinutes: number;
  location: ServiceLocation;
  address: string;
  verified: boolean;
  openHours: string;
  services: Service[];
  reviews: Review[];
  pickupAvailable?: boolean;
  expressService?: boolean;
  /** Estimated turnaround shown on the card, e.g. "24 hrs". */
  estimatedCompletion: string;
}

export interface BookingItem {
  service: Service;
  quantity: number;
}

export interface Booking {
  id: string;
  laundryId: string;
  laundryName: string;
  studentName: string;
  service: Service;
  quantity: number;
  pickupOption: PickupOption;
  /** Display string for the scheduled slot, e.g. "Tomorrow 10AM". */
  scheduledFor: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: "Pay Online" | "Pay at Laundry";
  platformCommission: number;
  laundryReceives: number;
  commissionStatus: "Collected" | "Outstanding";
  /** Performance tracking timestamps (ISO strings). */
  bookingCreatedAt?: string;
  pickupScheduledAt?: string;
  pickupCompletedAt?: string;
  processingStartedAt?: string;
  readyAt?: string;
  completedAt?: string;
}

export interface StudentUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  rewardsPoints: number;
  lastCompletedBookingAt?: string;
}

export interface PartnerUser {
  id: string;
  businessName: string;
  phone: string;
  email: string;
  logoUrl: string;
}

export type NotificationTone = "primary" | "secondary" | "accent" | "warning" | "error";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  tone: NotificationTone;
  forMode: AppMode;
  group: "Today" | "Yesterday" | "Earlier";
}

export interface BusinessSettings {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  gpsLocation: string;
  description: string;
  hours: Array<{
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }>;
  holidayMode: boolean;
  services: Service[];
  pricing: {
    pickupFee: number;
    expressFee: number;
    ironingFee: number;
    largeItems: number;
  };
  profileImage: string;
  coverImage: string;
}

export interface WalletTransaction {
  id: string;
  type: "Commission Collected" | "Outstanding Commission" | "Wallet Top-up" | "Platform Adjustment" | "Refund" | "Payout";
  amount: number;
  description: string;
  time: string;
  status: "Completed" | "Pending" | "Failed";
}

export interface PartnerWalletState {
  walletBalance: number;
  outstandingCommission: number;
  availablePayout: number;
  commissionRate: number;
  lifetimeEarnings: number;
  monthlyEarnings: number;
  weeklyEarnings: number;
  transactions: WalletTransaction[];
}

// --- Super Admin models ---

export type IssueType =
  | "Order problem"
  | "Pickup problem"
  | "Missing laundry"
  | "Damaged laundry"
  | "Incorrect order"
  | "Partner issue"
  | "Customer issue"
  | "Payment issue"
  | "Other";

export type IssueStatus = "Open" | "Investigating" | "Resolved";

export type PartnerAccountStatus = "Active" | "Suspended" | "Review Required";

export type SubscriptionPlan = "Free" | "Growth" | "Premium";
export type SubscriptionStatus = "Active" | "Past Due" | "Cancelled";

export interface AdminIssue {
  id: string;
  type: IssueType;
  status: IssueStatus;
  reporter: string;
  reporterRole: "student" | "partner";
  orderId?: string;
  laundryName?: string;
  description: string;
  createdAt: string;
  internalNote?: string;
}

export interface AdminPartner {
  id: string;
  businessName: string;
  location: ServiceLocation;
  address: string;
  rating: number;
  reviewsCount: number;
  ordersCompleted: number;
  avgProcessingTime: string;
  acceptingOrders: boolean;
  subscriptionPlan: SubscriptionPlan;
  accountStatus: PartnerAccountStatus;
  dateJoined: string;
  imageUrl: string;
  services: Service[];
}

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  accountStatus: "Active" | "Suspended";
  dateJoined: string;
  avatarUrl: string;
}

export interface AdminSubscription {
  partnerId: string;
  partnerName: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  dateStarted: string;
}

export interface PendingPartner {
  id: string;
  businessName: string;
  ownerName: string;
  location: ServiceLocation;
  phone: string;
  email: string;
  appliedAt: string;
  services: Service[];
}

export type AppMode = "student" | "partner" | "admin";
