import type {
  Booking,
  NotificationItem,
  OrderStatus,
  WalletTransaction,
} from "../models";

// Dummy orders used by both the student tracking screen and the
// partner dashboard / incoming orders / order management screens.
const services = [
  {
    id: "s-wash-fold",
    name: "Wash & Fold",
    price: 20,
    unit: "kg" as const,
    duration: "24 hours",
    description: "Washed, dried and neatly folded.",
  },
  {
    id: "s-express",
    name: "Express Laundry",
    price: 35,
    unit: "kg" as const,
    duration: "6 hours",
    description: "Same-day priority wash.",
  },
  {
    id: "s-iron",
    name: "Ironing",
    price: 5,
    unit: "item" as const,
    duration: "12 hours",
    description: "Professional pressing.",
  },
  {
    id: "s-dry",
    name: "Dry Cleaning",
    price: 30,
    unit: "item" as const,
    duration: "48 hours",
    description: "Gentle dry cleaning for delicate wear.",
  },
];

const laundryNames = [
  "CleanPro Laundry",
  "FreshWash Laundry",
  "Legon Wash Hub",
  "Adenta Fresh Laundry",
  "Blue Nile Laundry",
  "Campus Spin",
];

const studentNames = [
  "Daniel",
  "Ama Serwaa",
  "Kwame Mensah",
  "Abena Owusu",
  "Yaw Boateng",
  "Akosua Frimpong",
  "Mawuli Sogah",
  "Nadia Mensah",
];

const initialBookings: Booking[] = [
  {
    id: "UPSA10234",
    laundryId: "l-cleanpro",
    laundryName: "CleanPro Laundry",
    studentName: "Daniel",
    service: services[0],
    quantity: 5,
    pickupOption: "Laundry pickup",
    scheduledFor: "Tomorrow 10AM",
    total: 100,
    status: "Washing",
    createdAt: "Today",
    paymentMethod: "Pay Online",
    platformCommission: 10,
    laundryReceives: 90,
    commissionStatus: "Collected",
  },
  {
    id: "UPSA10235",
    laundryId: "l-freshwash",
    laundryName: "FreshWash Laundry",
    studentName: "Daniel",
    service: services[2],
    quantity: 8,
    pickupOption: "Student drops off",
    scheduledFor: "Today 2PM",
    total: 40,
    status: "Ready",
    createdAt: "Today",
    paymentMethod: "Pay at Laundry",
    platformCommission: 4,
    laundryReceives: 36,
    commissionStatus: "Outstanding",
  },
  {
    id: "UPSA10220",
    laundryId: "l-cleanpro",
    laundryName: "CleanPro Laundry",
    studentName: "Daniel",
    service: services[1],
    quantity: 3,
    pickupOption: "Laundry pickup",
    scheduledFor: "Yesterday 3PM",
    total: 105,
    status: "Completed",
    createdAt: "Yesterday",
    paymentMethod: "Pay Online",
    platformCommission: 10,
    laundryReceives: 95,
    commissionStatus: "Collected",
  },
];

const generatedBookings: Booking[] = Array.from({ length: 47 }, (_, index) => {
  const service = services[index % services.length];
  const quantity = 2 + ((index + 1) % 6);
  const total = service.price * quantity + (index % 3 === 0 ? 8 : 0);
  const paymentMethod = index % 2 === 0 ? "Pay Online" : "Pay at Laundry";
  const platformCommission = Math.round(total * 0.1);
  return {
    id: `UPSA${10000 + index + 1}`,
    laundryId: `l-${["cleanpro", "freshwash", "legonwash", "adentafresh"][index % 4]}`,
    laundryName: laundryNames[index % laundryNames.length],
    studentName: studentNames[index % studentNames.length],
    service,
    quantity,
    pickupOption: index % 2 === 0 ? "Laundry pickup" : "Student drops off",
    scheduledFor: index % 2 === 0 ? `Tomorrow ${8 + (index % 5) * 2}AM` : `Today ${2 + (index % 4) * 2}PM`,
    total,
    status: ["Booking Confirmed", "Laundry Accepted", "Pickup Scheduled", "Washing", "Ready", "Completed"][index % 6] as Booking["status"],
    createdAt: index < 10 ? "Today" : index < 25 ? "Yesterday" : "Last week",
    paymentMethod,
    platformCommission,
    laundryReceives: total - platformCommission,
    commissionStatus: paymentMethod === "Pay Online" ? "Collected" : "Outstanding",
  };
});

export const dummyOrders: Booking[] = [...initialBookings, ...generatedBookings];

// Partner-side incoming orders (new bookings awaiting accept/reject).
const initialIncomingOrders: Booking[] = [
  {
    id: "UPSA10240",
    laundryId: "l-cleanpro",
    laundryName: "CleanPro Laundry",
    studentName: "Daniel",
    service: services[0],
    quantity: 5,
    pickupOption: "Laundry pickup",
    scheduledFor: "Tomorrow 10AM",
    total: 100,
    status: "Booking Confirmed",
    createdAt: "Just now",
    paymentMethod: "Pay Online",
    platformCommission: 10,
    laundryReceives: 90,
    commissionStatus: "Collected",
  },
  {
    id: "UPSA10241",
    laundryId: "l-cleanpro",
    laundryName: "CleanPro Laundry",
    studentName: "Ama Serwaa",
    service: services[1],
    quantity: 4,
    pickupOption: "Student drops off",
    scheduledFor: "Today 4PM",
    total: 140,
    status: "Booking Confirmed",
    createdAt: "12 min ago",
    paymentMethod: "Pay at Laundry",
    platformCommission: 14,
    laundryReceives: 126,
    commissionStatus: "Outstanding",
  },
  {
    id: "UPSA10242",
    laundryId: "l-cleanpro",
    laundryName: "CleanPro Laundry",
    studentName: "Kwame Mensah",
    service: services[2],
    quantity: 10,
    pickupOption: "Laundry pickup",
    scheduledFor: "Tomorrow 8AM",
    total: 50,
    status: "Booking Confirmed",
    createdAt: "30 min ago",
    paymentMethod: "Pay Online",
    platformCommission: 5,
    laundryReceives: 45,
    commissionStatus: "Collected",
  },
];

const generatedIncomingOrders: Booking[] = Array.from({ length: 6 }, (_, index) => {
  const service = services[(index + 1) % services.length];
  const quantity = 3 + ((index + 2) % 5);
  const total = service.price * quantity + 5;
  const paymentMethod = index % 2 === 0 ? "Pay Online" : "Pay at Laundry";
  const platformCommission = Math.round(total * 0.1);
  return {
    id: `UPSA${10400 + index}`,
    laundryId: "l-cleanpro",
    laundryName: "CleanPro Laundry",
    studentName: studentNames[(index + 3) % studentNames.length],
    service,
    quantity,
    pickupOption: index % 2 === 0 ? "Laundry pickup" : "Student drops off",
    scheduledFor: index % 2 === 0 ? `Tomorrow ${10 + index}AM` : `Today ${4 + index}PM`,
    total,
    status: "Booking Confirmed" as Booking["status"],
    createdAt: `${index + 1} min ago`,
    paymentMethod,
    platformCommission,
    laundryReceives: total - platformCommission,
    commissionStatus: paymentMethod === "Pay Online" ? "Collected" : "Outstanding",
  };
});

export const dummyIncomingOrders: Booking[] = [...initialIncomingOrders, ...generatedIncomingOrders];

// Ordered timeline used by the tracking screen.
export const orderTimeline: OrderStatus[] = [
  "Booking Confirmed",
  "Laundry Accepted",
  "Pickup Scheduled",
  "Washing",
  "Ready",
  "Completed",
];

const notificationTemplates = [
  {
    title: "Booking accepted",
    body: "Your order is now in progress and the laundry has confirmed pickup.",
    tone: "primary" as const,
  },
  {
    title: "Laundry started washing",
    body: "Your clothes are being washed with eco-friendly detergent.",
    tone: "accent" as const,
  },
  {
    title: "Laundry ready",
    body: "Your order is ready for pickup and looks crisp and fresh.",
    tone: "secondary" as const,
  },
  {
    title: "Special discount",
    body: "Enjoy 10% off your next express service this weekend.",
    tone: "warning" as const,
  },
  {
    title: "New booking",
    body: "A student just placed a pickup request for your express service.",
    tone: "accent" as const,
  },
  {
    title: "Weekly performance",
    body: "Your weekly completion rate is at 94% and revenue is trending up.",
    tone: "secondary" as const,
  },
  {
    title: "Payment received",
    body: "The platform has credited your wallet for this week's commission.",
    tone: "primary" as const,
  },
];

export const dummyNotifications: NotificationItem[] = Array.from({ length: 100 }, (_, index) => {
  const template = notificationTemplates[index % notificationTemplates.length];
  const group = index < 25 ? "Today" : index < 60 ? "Yesterday" : "Earlier";
  const forMode = index % 2 === 0 ? "student" : "partner";
  const time = index < 25 ? `${index + 1} min ago` : index < 60 ? `${index - 24}h ago` : `${index - 59}d ago`;

  return {
    id: `notif-${index + 1}`,
    title: template.title,
    body: template.body,
    time,
    unread: index % 4 !== 0,
    tone: template.tone,
    forMode,
    group,
  };
});

const walletTypes = [
  { type: "Commission Collected" as const, description: "Platform collected commission for online payment" },
  { type: "Outstanding Commission" as const, description: "Commission pending settlement from cash booking" },
  { type: "Wallet Top-up" as const, description: "Mobile Money top-up from MTN MoMo" },
  { type: "Platform Adjustment" as const, description: "Service fee adjustment applied to account" },
  { type: "Payout" as const, description: "Weekly payout released to the business wallet" },
  { type: "Refund" as const, description: "Refund issued for cancelled order" },
];

export const dummyWalletTransactions: WalletTransaction[] = Array.from({ length: 15 }, (_, index) => {
  const item = walletTypes[index % walletTypes.length];
  return {
    id: `txn-${index + 1}`,
    type: item.type,
    amount: 20 + index * 7,
    description: item.description,
    time: index < 5 ? `${index + 1}h ago` : `${index - 4}d ago`,
    status: index === 3 ? "Pending" : "Completed",
  };
});
