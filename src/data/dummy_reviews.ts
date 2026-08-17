import type { Review } from "../models";

// Shared dummy reviews reused across detail screens and the business profile.
export const dummyReviews: Review[] = [
  {
    id: "rv1",
    authorName: "Ama Serwaa",
    authorAvatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
    rating: 5,
    comment: "Picked up my clothes right on time and folded everything neatly. Best laundry around UPSA!",
    date: "2 days ago",
  },
  {
    id: "rv2",
    authorName: "Kwame Mensah",
    authorAvatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
    rating: 5,
    comment: "Express service saved me before an exam. Clothes smelled fresh and were ready in 6 hours.",
    date: "1 week ago",
  },
  {
    id: "rv3",
    authorName: "Abena Owusu",
    authorAvatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
    rating: 4,
    comment: "Good service and fair prices. Pickup was a bit late but the quality made up for it.",
    date: "2 weeks ago",
  },
  {
    id: "rv4",
    authorName: "Yaw Boateng",
    authorAvatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
    rating: 5,
    comment: "Affordable and reliable. My go-to laundry in Madina now.",
    date: "3 days ago",
  },
];
