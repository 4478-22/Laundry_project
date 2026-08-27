import { create } from "zustand";
import type {
  AppMode,
  Booking,
  BusinessSettings,
  CustomerUser,
  Laundry,
  NotificationItem,
  OrderStatus,
  PartnerWalletState,
  WalletTransaction,
} from "../models";
import {
  dummyLaundries,
  dummyOrders,
  dummyIncomingOrders,
  dummyNotifications,
  dummyWalletTransactions,
} from "../data";

// Central app store. In a real app this would be split across providers;
// here Zustand mirrors the same single-source-of-truth idea with richer
// local state for bookings, notifications, settings and wallet activity.

interface AppState {
  mode: AppMode;
  isAuthed: boolean;
  isAcceptingOrders: boolean;
  customer: CustomerUser;
  bookings: Booking[];
  incomingOrders: Booking[];
  savedLaundryIds: string[];
  notifications: NotificationItem[];
  businessSettings: BusinessSettings;
  partnerWallet: PartnerWalletState;

  setMode: (mode: AppMode) => void;
  login: () => void;
  logout: () => void;
  addBooking: (booking: Booking) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  acceptOrder: (id: string) => void;
  setAcceptingOrders: (accepting: boolean) => void;
  toggleSaved: (laundryId: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  setBusinessSettings: (settings: BusinessSettings) => void;
  addBusinessService: (service: BusinessSettings["services"][number]) => void;
  updateBusinessService: (service: BusinessSettings["services"][number]) => void;
  deleteBusinessService: (id: string) => void;
  topUpWallet: (amount: number, provider: string) => void;
  expireCustomerPoints: () => void;
  getLaundry: (id: string) => Laundry | undefined;
}

const defaultCustomer: CustomerUser = {
  id: "u-daniel",
  name: "Daniel",
  phone: "+233 24 555 0192",
  email: "daniel@example.com",
  avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  rewardsPoints: 320,
  lastCompletedBookingAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
};

const defaultBusinessSettings: BusinessSettings = {
  businessName: "CleanPro Laundry",
  ownerName: "Nana Opoku",
  phone: "+233 24 123 4567",
  email: "ops@cleanprolaundry.com",
  address: "Near Accra Central, Accra",
  gpsLocation: "5.6727, -0.1808",
  description: "Trusted laundry partner for busy professionals and families in Accra.",
  hours: [
    { day: "Monday", open: "07:00", close: "20:00", closed: false },
    { day: "Tuesday", open: "07:00", close: "20:00", closed: false },
    { day: "Wednesday", open: "07:00", close: "20:00", closed: false },
    { day: "Thursday", open: "07:00", close: "20:00", closed: false },
    { day: "Friday", open: "07:00", close: "22:00", closed: false },
    { day: "Saturday", open: "07:00", close: "22:00", closed: false },
    { day: "Sunday", open: "09:00", close: "17:00", closed: false },
  ],
  holidayMode: false,
  services: [
    {
      id: "s-wash-fold",
      name: "Wash & Fold",
      price: 20,
      unit: "kg",
      duration: "24 hours",
      description: "Neatly washed and folded garments.",
    },
    {
      id: "s-express",
      name: "Express Laundry",
      price: 35,
      unit: "kg",
      duration: "6 hours",
      description: "Priority turnaround for urgent orders.",
    },
    {
      id: "s-iron",
      name: "Ironing",
      price: 5,
      unit: "item",
      duration: "12 hours",
      description: "Freshly pressed shirts and trousers.",
    },
  ],
  pricing: {
    pickupFee: 8,
    expressFee: 12,
    ironingFee: 3,
    largeItems: 15,
  },
  profileImage: "https://images.pexels.com/photos/6193248/pexels-photo-6193248.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  coverImage: "https://images.pexels.com/photos/6193248/pexels-photo-6193248.jpeg?auto=compress&cs=tinysrgb&w=900&h=500&fit=crop",
};

const defaultWallet: PartnerWalletState = {
  walletBalance: 4560,
  outstandingCommission: 360,
  availablePayout: 1320,
  commissionRate: 10,
  lifetimeEarnings: 18240,
  monthlyEarnings: 2480,
  weeklyEarnings: 650,
  transactions: dummyWalletTransactions,
};

export const useAppStore = create<AppState>((set) => ({
  mode: "customer",
  isAuthed: false,
  isAcceptingOrders: true,
  customer: defaultCustomer,
  bookings: dummyOrders,
  incomingOrders: dummyIncomingOrders,
  savedLaundryIds: ["l-cleanpro"],
  notifications: dummyNotifications,
  businessSettings: defaultBusinessSettings,
  partnerWallet: defaultWallet,

  setMode: (mode) => set({ mode }),
  login: () => set({ isAuthed: true }),
  logout: () => set({ isAuthed: false }),
  addBooking: (booking) =>
    set((state) => {
      const nextTransactions: WalletTransaction[] = [...state.partnerWallet.transactions];
      const nextWallet = { ...state.partnerWallet };
      if (booking.paymentMethod === "Pay Online") {
        nextWallet.walletBalance += booking.laundryReceives;
        nextWallet.availablePayout += booking.laundryReceives;
        nextWallet.lifetimeEarnings += booking.laundryReceives;
        nextWallet.monthlyEarnings += booking.laundryReceives;
        nextWallet.weeklyEarnings += booking.laundryReceives;
        nextTransactions.unshift({
          id: booking.id,
          type: "Commission Collected",
          amount: booking.platformCommission,
          description: `Collected platform commission for ${booking.laundryName}`,
          time: "Just now",
          status: "Completed",
        });
      } else {
        nextWallet.outstandingCommission += booking.platformCommission;
        nextTransactions.unshift({
          id: booking.id,
          type: "Outstanding Commission",
          amount: booking.platformCommission,
          description: `Outstanding commission for ${booking.laundryName}`,
          time: "Just now",
          status: "Pending",
        });
      }
      return {
        bookings: [booking, ...state.bookings],
        incomingOrders: [booking, ...state.incomingOrders],
        partnerWallet: {
          ...nextWallet,
          transactions: nextTransactions,
        },
      };
    }),
  updateOrderStatus: (id, status) =>
    set((s) => {
      const currentOrder = s.bookings.find((b) => b.id === id) ?? s.incomingOrders.find((b) => b.id === id);
      const shouldResetTimer = currentOrder?.status !== "Completed" && status === "Completed";
      return {
        bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        incomingOrders: s.incomingOrders.map((b) => (b.id === id ? { ...b, status } : b)),
        customer: shouldResetTimer
          ? { ...s.customer, lastCompletedBookingAt: new Date().toISOString() }
          : s.customer,
      };
    }),
  acceptOrder: (id) =>
    set((s) => ({
      incomingOrders: s.incomingOrders.map((b) =>
        b.id === id ? { ...b, status: "Laundry Accepted" as OrderStatus } : b,
      ),
    })),
  setAcceptingOrders: (accepting) => set({ isAcceptingOrders: accepting }),
  toggleSaved: (laundryId) =>
    set((s) => ({
      savedLaundryIds: s.savedLaundryIds.includes(laundryId)
        ? s.savedLaundryIds.filter((id) => id !== laundryId)
        : [...s.savedLaundryIds, laundryId],
    })),
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((item) => ({ ...item, unread: false })),
    })),
  deleteNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((item) => item.id !== id),
    })),
  setBusinessSettings: (businessSettings) => set({ businessSettings }),
  addBusinessService: (service) =>
    set((s) => ({
      businessSettings: {
        ...s.businessSettings,
        services: [...s.businessSettings.services, service],
      },
    })),
  updateBusinessService: (service) =>
    set((s) => ({
      businessSettings: {
        ...s.businessSettings,
        services: s.businessSettings.services.map((item) => (item.id === service.id ? service : item)),
      },
    })),
  deleteBusinessService: (id) =>
    set((s) => ({
      businessSettings: {
        ...s.businessSettings,
        services: s.businessSettings.services.filter((item) => item.id !== id),
      },
    })),
  topUpWallet: (amount, provider) =>
    set((s) => ({
      partnerWallet: {
        ...s.partnerWallet,
        walletBalance: s.partnerWallet.walletBalance + amount,
        availablePayout: s.partnerWallet.availablePayout + amount,
        transactions: [
          {
            id: `topup-${Date.now()}`,
            type: "Wallet Top-up",
            amount,
            description: `${provider} top-up completed successfully`,
            time: "Just now",
            status: "Completed",
          },
          ...s.partnerWallet.transactions,
        ],
      },
    })),
  expireCustomerPoints: () =>
    set((s) => {
      if (!s.customer.lastCompletedBookingAt || s.customer.rewardsPoints <= 0) {
        return {};
      }
      const lastCompleted = new Date(s.customer.lastCompletedBookingAt);
      const expiryThresholdMs = 90 * 24 * 60 * 60 * 1000;
      if (Date.now() - lastCompleted.getTime() >= expiryThresholdMs) {
        return {
          customer: {
            ...s.customer,
            rewardsPoints: 0,
          },
        };
      }
      return {};
    }),
  getLaundry: (id) => dummyLaundries.find((l) => l.id === id),
}));
