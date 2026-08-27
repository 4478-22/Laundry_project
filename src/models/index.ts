// Domain models for Laundex.
// These mirror what a Flutter app's model classes would look like —
// plain data shapes that the UI and state layers consume.

export type ServiceLocation =
  | "Accra"
  | "Madina"
  | "Legon"
  | "Adenta";

export type PickupOption = "Customer drops off" | "Laundry pickup";

export type OrderStatus =
  | "Booking Confirmed"
  | "Laundry Accepted"
  | "Pickup Scheduled"
  | "Washing"
  | "Ready"
  | "Completed";

/** The three stages the customer sees on the tracking screen. */
export type CustomerStage = "Booking Confirmed" | "Pickup Scheduled" | "Ready";

/** Maps any internal OrderStatus to the customer-facing stage it belongs to. */
export function toCustomerStage(status: OrderStatus): CustomerStage {
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
  customerName: string;
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

export interface CustomerUser {
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

export type AppMode = "customer" | "partner";
